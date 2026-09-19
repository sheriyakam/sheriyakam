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
    Award, ShieldCheck
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK } from '../../constants/partnerStore';

export default function PartnerReferrals() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const referralCode = partner.referral?.code || 'SHYAM7821';

    const [copied, setCopied] = useState(false);

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
            </ScrollView>
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
});
