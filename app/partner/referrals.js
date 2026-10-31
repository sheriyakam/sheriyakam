import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Share, Linking, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Gift, Share2, Copy, CheckCircle2,
    Users, IndianRupee, Sparkles, ChevronRight, MessageSquare,
    Award, ShieldCheck, UserPlus, Check, X, Phone, Trash2, Power
} from 'lucide-react-native';
import { Modal, TextInput } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK, getApprentices, addApprentice, toggleApprenticeStatus, removeApprentice } from '../../constants/partnerStore';

export default function PartnerReferrals() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const referralCode = partner.referral?.code || 'SHYAM7821';

    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('referral'); // 'referral' or 'team'
    const [apprentices, setApprentices] = useState(getApprentices());
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [appName, setAppName] = useState('');
    const [appPhone, setAppPhone] = useState('');
    const [appRole, setAppRole] = useState('Assistant Wireman');
    const [appAadhaar, setAppAadhaar] = useState('');
    const [appTraineeId, setAppTraineeId] = useState('');

    const handleAddApprentice = () => {
        if (!appName.trim() || !appPhone.trim()) {
            Alert.alert('Validation Error', 'Please enter apprentice full name and mobile number.');
            return;
        }
        const res = addApprentice({
            name: appName,
            phone: appPhone,
            role: appRole,
            aadhaarLast4: appAadhaar.slice(-4) || '8812',
            kselbTraineeId: appTraineeId || 'KSELB/TR-9821'
        });
        if (res.success) {
            setApprentices(getApprentices());
            setAddModalVisible(false);
            setAppName('');
            setAppPhone('');
            setAppAadhaar('');
            setAppTraineeId('');
            Alert.alert(
                '✅ Apprentice Registered!',
                `${appName} is now linked to your KSELB License (${partner.kselbLicense}). You can now co-dispatch them on commercial and high-load assignments.`
            );
        }
    };

    const handleToggleStatus = (id) => {
        toggleApprenticeStatus(id);
        setApprentices([...getApprentices()]);
    };

    const handleRemove = (id, name) => {
        Alert.alert(
            'Remove Apprentice',
            `Remove ${name} from your registered crew?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        removeApprentice(id);
                        setApprentices([...getApprentices()]);
                    }
                }
            ]
        );
    };

    const referralList = [
        {
            id: 'ref-1',
            name: 'K. Sreeraj',
            taluk: 'Kochi, Ernakulam',
            status: 'active',
            statusLabel: 'First Job Done • Bonus Credited',
            date: '12 Sep 2026',
            bonus: 500,
        },
        {
            id: 'ref-2',
            name: 'Jithin Das',
            taluk: 'Thalassery, Kannur',
            status: 'active',
            statusLabel: 'First Job Done • Bonus Credited',
            date: '08 Sep 2026',
            bonus: 500,
        },
        {
            id: 'ref-3',
            name: 'Pradeep Kumar',
            taluk: 'Vadakara, Kozhikode',
            status: 'active',
            statusLabel: 'First Job Done • Bonus Credited',
            date: '01 Sep 2026',
            bonus: 500,
        },
        {
            id: 'ref-4',
            name: 'Vipin Chandran',
            taluk: 'Kannur City',
            status: 'pending_verification',
            statusLabel: 'KSELB License Under Review',
            date: '18 Sep 2026',
            bonus: 0,
        },
    ];

    const handleCopyCode = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        Alert.alert('Copied to Clipboard', `Referral code ${referralCode} copied.`);
    };

    const handleWhatsAppShare = () => {
        const msg = encodeURIComponent(
            `Join Sheriyakam as a certified electrician in Kerala! Earn ₹35,000+/month with ₹5 Lakh insurance cover & weekly Tuesday payouts. Use my partner invite code ${referralCode} to get ₹250 joining bonus: https://sheriyakam.vercel.app/partner/auth`
        );
        Linking.openURL(`https://wa.me/?text=${msg}`).catch(() => {
            Alert.alert('Info', 'WhatsApp is not installed on this device.');
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Refer Wiremen & Earn</Text>
                    <Text style={styles.headerSub}>₹500 per activated Kerala electrician</Text>
                </View>
                <View style={styles.giftIconWrap}>
                    <Gift size={20} color={COLORS.success} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Mode Selector Tabs */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'referral' && styles.tabItemActive]}
                        onPress={() => setActiveTab('referral')}
                    >
                        <Gift size={15} color={activeTab === 'referral' ? '#fff' : COLORS.textTertiary} />
                        <Text style={[styles.tabText, activeTab === 'referral' && styles.tabTextActive]}>
                            Refer & Earn (₹500)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'team' && styles.tabItemActive]}
                        onPress={() => setActiveTab('team')}
                    >
                        <Users size={15} color={activeTab === 'team' ? '#fff' : COLORS.textTertiary} />
                        <Text style={[styles.tabText, activeTab === 'team' && styles.tabTextActive]}>
                            Team & Apprentices ({apprentices.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'team' ? (
                    <View>
                        {/* Team Expansion Engine Header */}
                        <View style={styles.teamHeroCard}>
                            <View style={styles.teamHeroBadge}>
                                <ShieldCheck size={14} color={COLORS.accent} />
                                <Text style={styles.teamHeroBadgeText}>KSELB MASTER WIREMAN CREW</Text>
                            </View>
                            <Text style={styles.teamHeroTitle}>Onboard Apprentices & Build Your Field Crew</Text>
                            <Text style={styles.teamHeroSub}>
                                As a licensed wireman (<Text style={{ color: COLORS.gold, fontWeight: '800' }}>{partner.kselbLicense}</Text>), you can register junior helpers and apprentice trainees under your profile to assist on 3-phase and high-volume commercial jobs.
                            </Text>

                            <TouchableOpacity
                                style={styles.addApprenticeBtn}
                                onPress={() => setAddModalVisible(true)}
                            >
                                <UserPlus size={16} color="#fff" />
                                <Text style={styles.addApprenticeBtnText}>Add Junior Apprentice / Helper</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Crew List */}
                        <Text style={styles.sectionTitle}>REGISTERED CREW MEMBERS ({apprentices.length})</Text>
                        {apprentices.map(app => (
                            <View key={app.id} style={styles.apprenticeCard}>
                                <View style={styles.apprenticeTop}>
                                    <View style={styles.apprenticeAvatar}>
                                        <Users size={20} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.apprenticeName}>{app.name}</Text>
                                            <View style={[
                                                styles.appStatusPill,
                                                { backgroundColor: app.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)' }
                                            ]}>
                                                <Text style={[
                                                    styles.appStatusPillText,
                                                    { color: app.status === 'active' ? COLORS.success : COLORS.textTertiary }
                                                ]}>
                                                    {app.status.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.apprenticeRole}>{app.role} • {app.kselbTraineeId}</Text>
                                        <Text style={styles.apprenticeMeta}>
                                            Mob: {app.phone} • Aadhaar: •••• {app.aadhaarLast4} • {app.jobsAssisted} jobs assisted
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.apprenticeActionsRow}>
                                    <TouchableOpacity
                                        style={styles.appActionBtn}
                                        onPress={() => Linking.openURL(`tel:${app.phone}`)}
                                    >
                                        <Phone size={13} color={COLORS.accent} />
                                        <Text style={styles.appActionBtnText}>Call</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.appActionBtn}
                                        onPress={() => handleToggleStatus(app.id)}
                                    >
                                        <Power size={13} color={app.status === 'active' ? COLORS.gold : COLORS.success} />
                                        <Text style={styles.appActionBtnText}>
                                            {app.status === 'active' ? 'Mark Off-Duty' : 'Mark On-Duty'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.appActionBtn, { borderColor: 'rgba(239,68,68,0.3)' }]}
                                        onPress={() => handleRemove(app.id, app.name)}
                                    >
                                        <Trash2 size={13} color="#EF4444" />
                                        <Text style={[styles.appActionBtnText, { color: '#EF4444' }]}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View>
                {/* Promo Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroBadge}>
                        <Sparkles size={14} color="#10B981" />
                        <Text style={styles.heroBadgeText}>COMMUNITY REWARD PROGRAM</Text>
                    </View>
                    <Text style={styles.heroTitle}>Earn ₹500 for Every Wireman You Bring to Sheriyakam</Text>
                    <Text style={styles.heroSub}>
                        Know licensed KSELB electricians in Thalassery, Kannur, Kozhikode, or Kochi? Invite them with your partner code. They get <Text style={{ color: '#fff', fontWeight: '800' }}>₹250</Text> and you receive <Text style={{ color: COLORS.success, fontWeight: '800' }}>₹500</Text> upon their first completed job.
                    </Text>

                    {/* Referral Code Box */}
                    <View style={styles.codeContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.codeLabel}>YOUR UNIQUE REFERRAL CODE</Text>
                            <Text style={styles.codeValue}>{referralCode}</Text>
                        </View>
                        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
                            <Copy size={16} color={COLORS.accent} />
                            <Text style={styles.copyBtnText}>{copied ? 'COPIED!' : 'COPY'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* WhatsApp Share Button */}
                    <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppShare}>
                        <Share2 size={18} color="#fff" />
                        <Text style={styles.whatsappBtnText}>Invite Wiremen via WhatsApp</Text>
                    </TouchableOpacity>
                </View>

                {/* Earnings Summary */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>4</Text>
                        <Text style={styles.statLabel}>Total Invited</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Active Wiremen</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: COLORS.success }]}>₹1,500</Text>
                        <Text style={styles.statLabel}>Total Bonus Paid</Text>
                    </View>
                </View>

                {/* Next Milestone */}
                <View style={styles.milestoneCard}>
                    <View style={styles.milestoneHeader}>
                        <Award size={18} color={COLORS.gold} />
                        <Text style={styles.milestoneTitle}>NEXT MILESTONE BONUS</Text>
                    </View>
                    <Text style={styles.milestoneSub}>
                        Reach 5 active referrals to unlock a special <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>₹1,000 Milestone Bonus</Text>. (2 more wiremen needed)
                    </Text>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: '60%' }]} />
                    </View>
                    <Text style={styles.progressLabel}>3 of 5 Referrals Activated (60%)</Text>
                </View>

                {/* Referral History List */}
                <Text style={styles.sectionHeaderTitle}>YOUR REFERRED CONTRACTORS ({referralList.length})</Text>
                <View style={styles.historyList}>
                    {referralList.map(item => (
                        <View key={item.id} style={styles.historyItem}>
                            <View style={styles.avatarWrap}>
                                <Users size={18} color={item.status === 'active' ? COLORS.success : COLORS.gold} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.historyName}>{item.name}</Text>
                                <Text style={styles.historyTaluk}>{item.taluk} • Invited {item.date}</Text>
                                <Text style={[
                                    styles.historyStatus,
                                    { color: item.status === 'active' ? COLORS.success : COLORS.gold }
                                ]}>
                                    {item.statusLabel}
                                </Text>
                            </View>
                            {item.bonus > 0 && (
                                <View style={styles.bonusTag}>
                                    <Text style={styles.bonusTagText}>+₹{item.bonus}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Program Rules */}
                <View style={styles.rulesBox}>
                    <ShieldCheck size={16} color={COLORS.accent} />
                    <Text style={styles.rulesText}>
                        Referral bonuses are verified against genuine KSELB electrical license credentials and settled weekly every Tuesday into your registered SBI bank account.
                    </Text>
                </View>
                </View>
                )}
            </ScrollView>
        
            {/* ONBOARD APPRENTICE MODAL */}
            <Modal
                visible={addModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.addModalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Onboard Helper / Apprentice</Text>
                                <Text style={styles.modalSub}>Linked to KSELB License: {partner.kselbLicense}</Text>
                            </View>
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAddModalVisible(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputFieldLabel}>Apprentice Full Name *</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g., Arjun K. Vijayan"
                            placeholderTextColor={COLORS.textTertiary}
                            value={appName}
                            onChangeText={setAppName}
                        />

                        <Text style={[styles.inputFieldLabel, { marginTop: 10 }]}>Mobile Number *</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g., 94472 88102"
                            placeholderTextColor={COLORS.textTertiary}
                            value={appPhone}
                            onChangeText={setAppPhone}
                            keyboardType="phone-pad"
                        />

                        <Text style={[styles.inputFieldLabel, { marginTop: 10 }]}>Trade Role</Text>
                        <View style={styles.roleChipsRow}>
                            {['Assistant Wireman', 'AC Helper', 'Trainee Electrician'].map(r => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.roleChip, appRole === r && styles.roleChipActive]}
                                    onPress={() => setAppRole(r)}
                                >
                                    <Text style={[styles.roleChipText, appRole === r && styles.roleChipTextActive]}>{r}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Aadhaar Last 4 Digits</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g., 8812"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={appAadhaar}
                                    onChangeText={setAppAadhaar}
                                    maxLength={4}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>KSELB Trainee ID</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g., KSELB/TR-9821"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={appTraineeId}
                                    onChangeText={setAppTraineeId}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitAppBtn} onPress={handleAddApprentice}>
                            <UserPlus size={16} color="#fff" />
                            <Text style={styles.submitAppBtnText}>Register Apprentice to Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        gap: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    headerSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    giftIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },

    /* Hero Card */
    heroCard: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        marginBottom: 16,
        gap: 12,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    heroBadgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    heroTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
        lineHeight: 24,
    },
    heroSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    codeLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    codeValue: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 22,
        letterSpacing: 2,
        marginTop: 2,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.3)',
    },
    copyBtnText: {
        color: COLORS.accent,
        fontWeight: '800',
        fontSize: 12,
    },
    whatsappBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#16A34A', // WhatsApp green
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 4,
    },
    whatsappBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },

    /* Stats Grid */
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    statValue: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
    },
    statLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },

    /* Milestone Card */
    milestoneCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        gap: 8,
    },
    milestoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    milestoneTitle: {
        color: COLORS.gold,
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    milestoneSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
    progressTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.gold,
        borderRadius: 4,
    },
    progressLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        textAlign: 'right',
    },

    /* History List */
    sectionHeaderTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    historyList: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        marginBottom: 16,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
        gap: 12,
    },
    avatarWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyName: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 13,
    },
    historyTaluk: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    historyStatus: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    bonusTag: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bonusTagText: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 12,
    },

    /* Rules */
    rulesBox: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        alignItems: 'flex-start',
    },
    rulesText: {
        color: COLORS.textTertiary,
        fontSize: 11,
        lineHeight: 16,
        flex: 1,
    },

    /* Team & Apprentice Tab Styles */
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
    },
    tabItemActive: {
        backgroundColor: COLORS.accent,
    },
    tabText: {
        color: COLORS.textTertiary,
        fontSize: 12,
        fontWeight: '700',
    },
    tabTextActive: {
        color: '#fff',
    },

    /* Team Hero Card */
    teamHeroCard: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.25)',
    },
    teamHeroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    teamHeroBadgeText: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    teamHeroTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 6,
    },
    teamHeroSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 14,
    },
    addApprenticeBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
    },
    addApprenticeBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 13,
    },

    /* Apprentice Cards */
    apprenticeCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    apprenticeTop: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    apprenticeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    apprenticeName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    appStatusPill: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    appStatusPillText: {
        fontWeight: '800',
        fontSize: 9,
    },
    apprenticeRole: {
        color: COLORS.gold,
        fontWeight: '700',
        fontSize: 11,
        marginTop: 2,
    },
    apprenticeMeta: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 4,
    },
    apprenticeActionsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    appActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 6,
        borderRadius: 6,
    },
    appActionBtnText: {
        color: COLORS.textPrimary,
        fontSize: 11,
        fontWeight: '700',
    },

    /* Add Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    addModalContent: {
        width: '94%',
        maxWidth: 440,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    modalTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 16,
    },
    modalSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    modalCloseBtn: {
        padding: 4,
    },
    inputFieldLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 12,
    },
    roleChipsRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    roleChip: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    roleChipActive: {
        backgroundColor: 'rgba(79, 70, 229, 0.3)',
        borderColor: COLORS.accent,
    },
    roleChipText: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '700',
    },
    roleChipTextActive: {
        color: '#fff',
    },
    submitAppBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 18,
    },
    submitAppBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 13,
    },

});
