import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Award, CheckCircle, Lock, PlayCircle, BookOpen,
    Shield, Zap, Snowflake, Video, Home, Factory,
    ChevronRight, X, Download, AlertCircle, FileCheck, ExternalLink,
    Clock, AlertTriangle
} from 'lucide-react-native';
import { Linking } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK } from '../../constants/partnerStore';

export default function PartnerTraining() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;

    const [modules, setModules] = useState([
        {
            id: 'm1',
            title: 'KSELB Safety Code & Live Wire Isolation',
            category: 'Safety',
            icon: Shield,
            status: 'completed',
            score: '98%',
            completedDate: '12 Aug 2026',
            certId: 'KSELB-SAF-9921',
            unlocks: 'Emergency High-Voltage & Tripping Dispatches',
            desc: 'Essential Kerala State Electricity Licensing Board protocols for working on live domestic & commercial supply lines, earthing isolation, and PPE compliance.'
        },
        {
            id: 'm2',
            title: 'Inverter, UPS & Battery Bank Wiring',
            category: 'Electrical',
            icon: Zap,
            status: 'completed',
            score: '95%',
            completedDate: '20 Aug 2026',
            certId: 'SH-INV-4412',
            unlocks: 'Backup Power, Heavy Inverter & Solar UPS Jobs',
            desc: 'Pure sine wave inverter integration, dual-battery equalizing racks, changeover switch calibration, and high-amp surge protection.'
        },
        {
            id: 'm3',
            title: 'Inverter AC Gas Leak & Copper Flare Jointing',
            category: 'AC',
            icon: Snowflake,
            status: 'completed',
            score: '92%',
            completedDate: '28 Aug 2026',
            certId: 'SH-AC-3109',
            unlocks: 'Split & Dual-Inverter AC Jet Cleaning & Refill',
            desc: 'R32 & R410A refrigeration pressure diagnostics, nitrogen pressure leak checks, torque-wrench copper flaring, and vacuum pump purging.'
        },
        {
            id: 'm4',
            title: 'IP CCTV & Hikvision/Dahua NVR Setup',
            category: 'CCTV',
            icon: Video,
            status: 'completed',
            score: '94%',
            completedDate: '04 Sep 2026',
            certId: 'SH-CCTV-8820',
            unlocks: 'Multi-Channel Camera Installs & Remote App Linking',
            desc: 'PoE switch crimping (Cat6 T-568B), static IP configuration, port forwarding, motion detection zones, and smartphone live-stream binding.'
        },
        {
            id: 'm5',
            title: 'Smart Switch Automation (Matter / Zigbee / Tuya)',
            category: 'Smart Home',
            icon: Home,
            status: 'in_progress',
            progress: 65,
            unlocks: 'Smart Home Upgrades & IoT Retrofit Pings (₹800+ avg ticket)',
            desc: 'Neutral wire smart touch switches, capacitive load snubbers for LED flicker prevention, multi-way scene controllers, and Alexa/Google Home voice mapping.'
        },
        {
            id: 'm6',
            title: 'Commercial 3-Phase HT/LT Distribution Boards',
            category: 'Industrial',
            icon: Factory,
            status: 'locked',
            requirement: 'Requires 2+ years field experience & KSELB Supervisor Competency Certificate.',
            unlocks: 'Commercial Supermarket & Mill Heavy Power Jobs (₹2,500+ tickets)',
            desc: '415V three-phase busbar chamber connections, CT-operated digital energy meters, automatic phase selectors, and motorized changeover panels.'
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, completed, in_progress, locked
    const [selectedModule, setSelectedModule] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const filteredModules = modules.filter(m => {
        if (filter === 'completed') return m.status === 'completed';
        if (filter === 'in_progress') return m.status === 'in_progress';
        if (filter === 'locked') return m.status === 'locked';
        return true;
    });

    const handleOpenModule = (mod) => {
        setSelectedModule(mod);
        if (mod.status === 'in_progress') {
            setQuizAnswers({});
            setQuizSubmitted(false);
            setIsQuizModalOpen(true);
        }
    };

    const handleCompleteModuleQuiz = () => {
        if (!quizAnswers['q1'] || !quizAnswers['q2']) {
            Alert.alert('Incomplete', 'Please answer both safety questions before submitting.');
            return;
        }

        setQuizSubmitted(true);
        setTimeout(() => {
            setModules(prev => prev.map(m => {
                if (m.id === selectedModule.id) {
                    return {
                        ...m,
                        status: 'completed',
                        score: '96%',
                        completedDate: 'Just now',
                        certId: 'SH-SMART-' + Math.floor(1000 + Math.random() * 9000)
                    };
                }
                return m;
            }));
            setIsQuizModalOpen(false);
            Alert.alert('🎉 Module Certified!', 'You scored 96% on Smart Switch Automation. High-value smart home jobs are now unlocked in your dispatch feed!');
        }, 600);
    };

    const handleDownloadCert = (modTitle, certId) => {
        Alert.alert(
            '📄 Certificate Generated',
            `Official KSELB-aligned competency certificate for "${modTitle}" (Cert #${certId || 'KSELB-CA-7821'}) has been prepared and dispatched to your email: ${partner.email}`
        );
    };

    const handleRequestUnlock = (modTitle) => {
        Alert.alert(
            '📋 Verification Request Sent',
            `Your application for "${modTitle}" has been forwarded to Supervisor Suresh Kumar (Thalassery zone). You will be contacted for field document verification within 24 hours.`
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Training & Certifications</Text>
                    <Text style={styles.headerSub}>KSELB Badges & Category Unlocks</Text>
                </View>
                <View style={styles.gradeBadge}>
                    <Award size={13} color={COLORS.gold} />
                    <Text style={styles.gradeBadgeText}>GRADE-A</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* KSELB Document Expiry Countdown Banner */}
                <View style={styles.expiryAlertCard}>
                    <View style={styles.expiryAlertHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <AlertTriangle size={16} color="#F59E0B" />
                            <Text style={styles.expiryAlertTitle}>KSELB LICENSE RENEWAL NOTICE</Text>
                        </View>
                        <View style={styles.countdownBadge}>
                            <Clock size={12} color="#F59E0B" />
                            <Text style={styles.countdownBadgeText}>25 DAYS LEFT</Text>
                        </View>
                    </View>
                    <Text style={styles.expiryAlertText}>
                        Wireman permit <Text style={{ color: COLORS.textPrimary, fontWeight: '700' }}>#{partner.kselbLicense || 'KSELB/CA-7821/KL'}</Text> expires on <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>15 October 2026</Text>. Automatic dispatch will pause if renewal is not completed before deadline.
                    </Text>
                    <TouchableOpacity
                        style={styles.renewBtn}
                        onPress={() => Linking.openURL('https://kselb.kerala.gov.in')}
                    >
                        <ExternalLink size={14} color="#000" />
                        <Text style={styles.renewBtnText}>Renew Online at kselb.kerala.gov.in</Text>
                    </TouchableOpacity>
                </View>

                {/* Certified Electrician Hero Card */}
                <View style={styles.licenseCard}>
                    <View style={styles.licenseTopRow}>
                        <View style={styles.licenseSeal}>
                            <Shield size={26} color={COLORS.accent} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.licenseHeading}>Kerala State Electricity Licensing Board</Text>
                            <Text style={styles.licenseNumber}>License: {partner.kselbLicense || 'KSELB/CA-7821/KL'}</Text>
                            <Text style={styles.licenseHolder}>{partner.name} • Thalassery Taluk</Text>
                        </View>
                    </View>

                    <View style={styles.licenseDivider} />

                    <View style={styles.licenseMetaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaVal}>4 / 6</Text>
                            <Text style={styles.metaLabel}>Badges Earned</Text>
                        </View>
                        <View style={styles.metaDivider} />
                        <View style={styles.metaItem}>
                            <Text style={styles.metaVal}>96%</Text>
                            <Text style={styles.metaLabel}>Safety Average</Text>
                        </View>
                        <View style={styles.metaDivider} />
                        <View style={styles.metaItem}>
                            <Text style={[styles.metaVal, { color: COLORS.success }]}>₹5 Lakh</Text>
                            <Text style={styles.metaLabel}>Cover Active</Text>
                        </View>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
                            All Modules ({modules.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'completed' && styles.filterChipActive]}
                        onPress={() => setFilter('completed')}
                    >
                        <Text style={[styles.filterChipText, filter === 'completed' && styles.filterChipTextActive]}>
                            Certified (4)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'in_progress' && styles.filterChipActive]}
                        onPress={() => setFilter('in_progress')}
                    >
                        <Text style={[styles.filterChipText, filter === 'in_progress' && styles.filterChipTextActive]}>
                            In Progress (1)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'locked' && styles.filterChipActive]}
                        onPress={() => setFilter('locked')}
                    >
                        <Text style={[styles.filterChipText, filter === 'locked' && styles.filterChipTextActive]}>
                            Locked (1)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Modules List */}
                <View style={styles.modulesContainer}>
                    {filteredModules.map(mod => {
                        const IconComponent = mod.icon;
                        const isCompleted = mod.status === 'completed';
                        const isInProgress = mod.status === 'in_progress';
                        const isLocked = mod.status === 'locked';

                        return (
                            <TouchableOpacity
                                key={mod.id}
                                style={[
                                    styles.moduleCard,
                                    isCompleted && styles.moduleCardCompleted,
                                    isInProgress && styles.moduleCardInProgress,
                                    isLocked && styles.moduleCardLocked
                                ]}
                                onPress={() => handleOpenModule(mod)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.moduleCardTop}>
                                    <View style={[
                                        styles.iconBox,
                                        isCompleted && { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                                        isInProgress && { backgroundColor: 'rgba(79, 70, 229, 0.18)' },
                                        isLocked && { backgroundColor: 'rgba(113, 113, 122, 0.15)' }
                                    ]}>
                                        <IconComponent
                                            size={22}
                                            color={isCompleted ? COLORS.success : isInProgress ? COLORS.accent : COLORS.textTertiary}
                                        />
                                    </View>

                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <View style={styles.catAndStatus}>
                                            <Text style={styles.categoryTag}>{mod.category}</Text>
                                            {isCompleted && (
                                                <View style={styles.statusCompletedBadge}>
                                                    <CheckCircle size={12} color={COLORS.success} />
                                                    <Text style={styles.statusCompletedText}>{mod.score} Certified</Text>
                                                </View>
                                            )}
                                            {isInProgress && (
                                                <View style={styles.statusProgressBadge}>
                                                    <PlayCircle size={12} color={COLORS.accent} />
                                                    <Text style={styles.statusProgressText}>{mod.progress}% Active</Text>
                                                </View>
                                            )}
                                            {isLocked && (
                                                <View style={styles.statusLockedBadge}>
                                                    <Lock size={12} color={COLORS.textTertiary} />
                                                    <Text style={styles.statusLockedText}>Locked</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.moduleTitle}>{mod.title}</Text>
                                    </View>
                                </View>

                                <Text style={styles.moduleDesc}>{mod.desc}</Text>

                                {/* Unlocks indicator */}
                                <View style={styles.unlocksRow}>
                                    <Zap size={14} color={isLocked ? COLORS.textTertiary : COLORS.gold} />
                                    <Text style={[styles.unlocksText, isLocked && { color: COLORS.textTertiary }]}>
                                        {isLocked ? mod.requirement : mod.unlocks}
                                    </Text>
                                </View>

                                {/* Bottom card actions */}
                                <View style={styles.moduleFooter}>
                                    {isCompleted && (
                                        <TouchableOpacity
                                            style={styles.certDownloadBtn}
                                            onPress={() => handleDownloadCert(mod.title, mod.certId)}
                                        >
                                            <FileCheck size={14} color={COLORS.accent} />
                                            <Text style={styles.certDownloadBtnText}>Cert #{mod.certId}</Text>
                                        </TouchableOpacity>
                                    )}
                                    {isInProgress && (
                                        <TouchableOpacity
                                            style={styles.resumeBtn}
                                            onPress={() => handleOpenModule(mod)}
                                        >
                                            <Text style={styles.resumeBtnText}>Resume Quiz (35% Left) →</Text>
                                        </TouchableOpacity>
                                    )}
                                    {isLocked && (
                                        <TouchableOpacity
                                            style={styles.requestUnlockBtn}
                                            onPress={() => handleRequestUnlock(mod.title)}
                                        >
                                            <Text style={styles.requestUnlockBtnText}>Request Supervisor Clearance</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Bottom Consolidated Certificate Banner */}
                <View style={styles.masterCertBanner}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.masterCertTitle}>Complete Sheriyakam Electrician Dossier</Text>
                        <Text style={styles.masterCertSub}>Includes KSELB license verification, verified skill modules, and police background clearance summary.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.masterCertBtn}
                        onPress={() => handleDownloadCert('Consolidated Master Portfolio', 'KSELB-MASTER-7821')}
                    >
                        <Download size={16} color="#fff" />
                        <Text style={styles.masterCertBtnText}>Download PDF</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Interactive Module Quiz / Training Modal */}
            <Modal
                visible={isQuizModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsQuizModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>SKILL CERTIFICATION TEST</Text>
                                <Text style={styles.modalTitle}>Smart Switch & Neutral Automation</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsQuizModalOpen(false)} style={styles.closeBtn}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.theoryBox}>
                                <Text style={styles.theoryTitle}>📖 KSELB Quick Code Rule:</Text>
                                <Text style={styles.theoryText}>
                                    Smart touch switches with internal Wi-Fi/Zigbee chips require continuous 230V reference. Always isolate the main loop breaker and verify neutral continuity before retrofitting metal switchboards to prevent residual voltage hazards.
                                </Text>
                            </View>

                            <Text style={styles.questionHeading}>Question 1: What is mandatory when installing a Smart Wi-Fi Switch in a standard Kerala distribution box?</Text>
                            <View style={styles.optionsList}>
                                {[
                                    { id: 'opt1', text: 'Pull a dedicated Neutral line from the ceiling rose / junction box' },
                                    { id: 'opt2', text: 'Tie the neutral pin directly to the earthing terminal' },
                                    { id: 'opt3', text: 'Leave neutral disconnected and use earth return' }
                                ].map((opt) => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[
                                            styles.optionBtn,
                                            quizAnswers['q1'] === opt.id && styles.optionBtnSelected
                                        ]}
                                        onPress={() => setQuizAnswers(prev => ({ ...prev, q1: opt.id }))}
                                    >
                                        <View style={[styles.radioDot, quizAnswers['q1'] === opt.id && styles.radioDotSelected]} />
                                        <Text style={[styles.optionText, quizAnswers['q1'] === opt.id && styles.optionTextSelected]}>
                                            {opt.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.questionHeading, { marginTop: 20 }]}>
                                Question 2: How do you prevent LED flickering/ghost glow on non-neutral capacitive smart switches?
                            </Text>
                            <View style={styles.optionsList}>
                                {[
                                    { id: 'optA', text: 'Install the supplied capacitor snubber across L1 and Neutral at the light point' },
                                    { id: 'optB', text: 'Increase MCB rating from 6A to 32A' },
                                    { id: 'optC', text: 'Remove the ground wire completely' }
                                ].map((opt) => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[
                                            styles.optionBtn,
                                            quizAnswers['q2'] === opt.id && styles.optionBtnSelected
                                        ]}
                                        onPress={() => setQuizAnswers(prev => ({ ...prev, q2: opt.id }))}
                                    >
                                        <View style={[styles.radioDot, quizAnswers['q2'] === opt.id && styles.radioDotSelected]} />
                                        <Text style={[styles.optionText, quizAnswers['q2'] === opt.id && styles.optionTextSelected]}>
                                            {opt.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.submitQuizBtn}
                                onPress={handleCompleteModuleQuiz}
                            >
                                <CheckCircle size={18} color="#fff" />
                                <Text style={styles.submitQuizBtnText}>Submit & Unlock Smart Category</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    gradeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.4)',
    },
    gradeBadgeText: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    expiryAlertCard: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(245, 158, 11, 0.35)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        gap: 8,
    },
    expiryAlertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiryAlertTitle: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    countdownBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    countdownBadgeText: {
        color: '#F59E0B',
        fontSize: 10,
        fontWeight: '900',
    },
    expiryAlertText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 17,
    },
    renewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COLORS.gold,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 4,
    },
    renewBtnText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 12,
    },
    licenseCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.35)',
        marginBottom: 20,
    },
    licenseTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    licenseSeal: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.3)',
    },
    licenseHeading: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.accent,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    licenseNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginVertical: 2,
    },
    licenseHolder: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    licenseDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 14,
    },
    licenseMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    metaItem: {
        alignItems: 'center',
    },
    metaVal: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    metaLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    metaDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.border,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: 'rgba(79, 70, 229, 0.18)',
        borderColor: COLORS.accent,
    },
    filterChipText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    modulesContainer: {
        gap: 14,
    },
    moduleCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    moduleCardCompleted: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    moduleCardInProgress: {
        borderColor: 'rgba(79, 70, 229, 0.4)',
    },
    moduleCardLocked: {
        opacity: 0.75,
        borderColor: COLORS.border,
    },
    moduleCardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catAndStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    categoryTag: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
    },
    statusCompletedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusCompletedText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.success,
    },
    statusProgressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusProgressText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.accent,
    },
    statusLockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusLockedText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textTertiary,
    },
    moduleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textPrimary,
        lineHeight: 20,
    },
    moduleDesc: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 10,
        lineHeight: 17,
    },
    unlocksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
    },
    unlocksText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gold,
        flex: 1,
    },
    moduleFooter: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    certDownloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderRadius: 8,
    },
    certDownloadBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.accent,
    },
    resumeBtn: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    resumeBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    requestUnlockBtn: {
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    requestUnlockBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    masterCertBanner: {
        marginTop: 24,
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    masterCertTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    masterCertSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    masterCertBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    masterCertBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 12,
    },
    modalBadge: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.accent,
        letterSpacing: 0.5,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
    },
    modalBody: {
        marginTop: 14,
    },
    theoryBox: {
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.25)',
        marginBottom: 16,
    },
    theoryTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.gold,
        marginBottom: 4,
    },
    theoryText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        lineHeight: 18,
    },
    questionHeading: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 10,
        lineHeight: 18,
    },
    optionsList: {
        gap: 8,
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 10,
    },
    optionBtnSelected: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    radioDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: COLORS.textTertiary,
    },
    radioDotSelected: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.accent,
    },
    optionText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flex: 1,
    },
    optionTextSelected: {
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    modalFooter: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 12,
    },
    submitQuizBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 10,
    },
    submitQuizBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    }
});
