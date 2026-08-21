import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, Search, Calendar, CreditCard, ShieldCheck, Zap,
    User, HelpCircle, ChevronRight, Scale, Mail, Phone, Clock,
    AlertTriangle, ShieldAlert, CheckCircle2, FileText, Sparkles,
    Flame, DollarSign, Wrench
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Searchbar } from '../components/ui/Searchbar';
import { Button } from '../components/ui/Button';

const HELP_CATEGORIES = [
    {
        title: 'Booking & Scheduling',
        desc: 'How to reschedule, choose time slots, or book recurring visits',
        icon: Calendar,
        color: '#3B82F6',
    },
    {
        title: 'Payments & GST Invoices',
        desc: 'UPI, credit cards, downloading tax receipts, and refunds',
        icon: CreditCard,
        color: '#10B981',
    },
    {
        title: '30-Day Warranty & Rework',
        desc: 'How to request a free technician rework if a problem recurs',
        icon: ShieldCheck,
        color: '#F59E0B',
    },
    {
        title: 'Emergency 30-Min Dispatch',
        desc: 'How standby technicians are assigned during power blackouts',
        icon: Zap,
        color: '#EF4444',
    },
    {
        title: 'Account, 2FA & Privacy',
        desc: 'Managing passwords, active sessions, and data deletion',
        icon: User,
        color: '#8B5CF6',
    },
];

const ESCALATION_TIERS = [
    {
        tier: 'Tier 1',
        title: 'Frontline Customer Support',
        time: 'Immediate / < 15 Mins',
        desc: 'Live chat or phone assistance for bookings, rescheduling, and general troubleshooting.',
        action: 'Chat with Support',
        route: '/contact',
        badgeColor: 'blue'
    },
    {
        tier: 'Tier 2',
        title: 'KSELB Technical Supervisor',
        time: 'Within 2-24 Hours',
        desc: 'On-site technical inspection for workmanship issues, burnout diagnostics, or ₹5 Lakh property claims.',
        action: 'File Damage Claim',
        route: '/damage-claim',
        badgeColor: 'amber'
    },
    {
        tier: 'Tier 3',
        title: 'Statutory Grievance Redressal Officer',
        time: '24h Ack · 15d Resolution',
        desc: 'Formal legal escalation under Rule 3(2) IT Rules 2021 & DPDP Act 2023 for data privacy or consumer rights.',
        action: 'File Formal Grievance',
        route: '/grievance',
        badgeColor: 'purple'
    }
];

export default function HelpCenterScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [searchQuery, setSearchQuery] = useState('');

    const handleCallEmergency = () => {
        Linking.openURL('tel:+914952800000').catch(() => {
            success('Calling 24/7 Emergency Incident Desk (+91 495 280 0000)');
        });
    };

    const handleCallOfficer = () => {
        Linking.openURL('tel:+914952800001').catch(() => {
            success('Calling Grievance Desk (+91 495 280 0001)');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Knowledge Base</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Header */}
                <View style={styles.searchSection}>
                    <Text style={[styles.searchTitle, { color: colors.textPrimary }]}>
                        How can we help you today?
                    </Text>
                    <Searchbar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search answers (e.g. damage claim, grievance, refund)..."
                    />
                </View>

                {/* ────────────────── ₹5 LAKH PROPERTY DAMAGE CLAIM DESK ────────────────── */}
                <View style={styles.damageSection}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={{ flex: 1 }}>
                            <Badge variant="danger" size="sm">₹5,00,000 Insurance Protection</Badge>
                            <Text style={[styles.damageMainTitle, { color: colors.textPrimary }]}>
                                Property Damage Claim Desk
                            </Text>
                        </View>
                        <View style={[styles.alertIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                            <ShieldAlert size={24} color="#EF4444" />
                        </View>
                    </View>
                    <Text style={[styles.damageMainSubtitle, { color: colors.textSecondary }]}>
                        In the rare event of accidental property damage, appliance burnout, or electrical fire during or immediately after a booking, our Commercial General Liability (CGL) policy provides up to ₹5,00,000 coverage.
                    </Text>

                    {/* Damage Protocol Points */}
                    <View style={styles.damageGrid}>
                        <View style={[styles.damagePointCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Clock size={18} color="#F59E0B" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.pointTitle, { color: colors.textPrimary }]}>2-Hour On-Site Inspection</Text>
                                <Text style={[styles.pointDesc, { color: colors.textSecondary }]}>
                                    Senior KSELB certified supervisor dispatches with calibrated Megger insulation testers.
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.damagePointCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Flame size={18} color="#EF4444" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.pointTitle, { color: colors.textPrimary }]}>Instant Escrow Lockdown</Text>
                                <Text style={[styles.pointDesc, { color: colors.textSecondary }]}>
                                    Technician payouts are frozen immediately in payment gateway escrow pending investigation.
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.damagePointCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <DollarSign size={18} color="#10B981" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.pointTitle, { color: colors.textPrimary }]}>Direct Payout / Insurance</Text>
                                <Text style={[styles.pointDesc, { color: colors.textSecondary }]}>
                                    Fast-track settlement up to ₹5,000 warranty cap or full CGL insurance claim up to ₹5 Lakh.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Claim Desk Actions */}
                    <View style={styles.damageActions}>
                        <Button
                            variant="outline"
                            size="sm"
                            style={{ flex: 1 }}
                            onPress={handleCallEmergency}
                        >
                            Emergency Desk
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ flex: 1.5, backgroundColor: '#EF4444', borderColor: '#EF4444' }}
                            onPress={() => router.push('/damage-claim')}
                        >
                            File Damage Claim (2h SLA)
                        </Button>
                    </View>
                </View>

                {/* ────────────────── STATUTORY GRIEVANCE REDRESSAL MECHANISM ────────────────── */}
                <View style={styles.grievanceSection}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={{ flex: 1 }}>
                            <Badge variant="purple" size="sm">Rule 3(2) IT Rules, 2021</Badge>
                            <Text style={[styles.grievanceMainTitle, { color: colors.textPrimary }]}>
                                Grievance Redressal Mechanism
                            </Text>
                        </View>
                        <Scale size={24} color={colors.accent} />
                    </View>
                    <Text style={[styles.grievanceMainSubtitle, { color: colors.textSecondary }]}>
                        If you have an unresolved dispute, service dissatisfaction, consumer rights concern, or data privacy request under the DPDP Act 2023, you can escalate through our mandatory 3-Tier Redressal Mechanism.
                    </Text>

                    {/* 3-Tier Escalation Framework */}
                    <View style={styles.tiersContainer}>
                        {ESCALATION_TIERS.map((tier, i) => (
                            <Card key={i} variant="default" style={[styles.tierCard, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                <View style={styles.tierHeader}>
                                    <Badge variant={tier.badgeColor} size="sm">{tier.tier}</Badge>
                                    <View style={styles.timeTag}>
                                        <Clock size={12} color={colors.textTertiary} />
                                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{tier.time}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.tierTitle, { color: colors.textPrimary }]}>{tier.title}</Text>
                                <Text style={[styles.tierDesc, { color: colors.textSecondary }]}>{tier.desc}</Text>
                                <TouchableOpacity
                                    style={[styles.tierBtn, { backgroundColor: isDark ? '#18181B' : '#F4F4F5' }]}
                                    onPress={() => router.push(tier.route)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.tierBtnText, { color: colors.accent }]}>{tier.action}</Text>
                                    <ChevronRight size={14} color={colors.accent} />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </View>

                    {/* Resident Grievance Officer Quick Card */}
                    <Card variant="elevated" style={[styles.officerCard, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
                        <View style={styles.officerHeader}>
                            <View style={[styles.officerAvatar, { backgroundColor: colors.accent + '20' }]}>
                                <Scale size={20} color={colors.accent} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.officerRole, { color: colors.textTertiary }]}>RESIDENT GRIEVANCE OFFICER</Text>
                                <Text style={[styles.officerName, { color: colors.textPrimary }]}>Adv. S. Nair, LL.M</Text>
                                <Text style={[styles.officerDesignation, { color: colors.textSecondary }]}>
                                    Head of Legal & Statutory Redressal (India)
                                </Text>
                            </View>
                        </View>

                        <View style={styles.officerMeta}>
                            <View style={styles.metaRow}>
                                <Mail size={14} color={colors.textTertiary} />
                                <Text style={[styles.metaText, { color: colors.textSecondary }]}>grievance@sheriyakam.in</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Phone size={14} color={colors.textTertiary} />
                                <Text style={[styles.metaText, { color: colors.textSecondary }]}>+91 495 280 0001 (Mon–Sat, 9AM–6PM)</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Clock size={14} color="#10B981" />
                                <Text style={[styles.metaText, { color: '#10B981', fontWeight: '600' }]}>
                                    Statutory SLA: 24-Hr Ack · 15-Day Final Disposal
                                </Text>
                            </View>
                        </View>

                        <View style={styles.officerActions}>
                            <Button
                                variant="outline"
                                size="sm"
                                style={{ flex: 1 }}
                                onPress={handleCallOfficer}
                            >
                                Call Desk
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                style={{ flex: 1.5 }}
                                onPress={() => router.push('/grievance')}
                            >
                                Submit Grievance
                            </Button>
                        </View>
                    </Card>
                </View>

                {/* ────────────────── BROWSE HELP TOPICS ────────────────── */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    BROWSE HELP TOPICS
                </Text>

                <View style={styles.categoriesList}>
                    {HELP_CATEGORIES.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => router.push('/faq')}
                                activeOpacity={0.75}
                            >
                                <Card variant="default" style={styles.catCard}>
                                    <View style={[styles.iconWrap, { backgroundColor: cat.color + '18' }]}>
                                        <Icon size={20} color={cat.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.catTitle, { color: colors.textPrimary }]}>
                                            {cat.title}
                                        </Text>
                                        <Text style={[styles.catDesc, { color: colors.textSecondary }]}>
                                            {cat.desc}
                                        </Text>
                                    </View>
                                    <ChevronRight size={18} color={colors.textTertiary} />
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Direct Support Contact Banner */}
                <Card variant="elevated" style={styles.supportCard}>
                    <HelpCircle size={28} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>
                            Still have questions?
                        </Text>
                        <Text style={[styles.supportSub, { color: colors.textSecondary }]}>
                            Our Kozhikode dispatch desk is available 24/7.
                        </Text>
                    </View>
                    <Button
                        variant="primary"
                        size="sm"
                        onPress={() => router.push('/contact')}
                    >
                        Contact Us
                    </Button>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    searchSection: {
        marginVertical: 10,
        gap: 10,
    },
    searchTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    damageSection: {
        marginVertical: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.25)',
        gap: 12,
    },
    alertIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    damageMainTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 6,
    },
    damageMainSubtitle: {
        fontSize: 12,
        lineHeight: 17,
    },
    damageGrid: {
        gap: 8,
        marginTop: 2,
    },
    damagePointCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
    },
    pointTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    pointDesc: {
        fontSize: 11.5,
        lineHeight: 16,
        marginTop: 2,
    },
    damageActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    grievanceSection: {
        marginVertical: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(139, 92, 246, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
        gap: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    grievanceMainTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 6,
    },
    grievanceMainSubtitle: {
        fontSize: 12,
        lineHeight: 17,
    },
    tiersContainer: {
        gap: 8,
        marginTop: 4,
    },
    tierCard: {
        padding: 12,
        gap: 6,
        borderRadius: 12,
    },
    tierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    tierTitle: {
        fontSize: 13.5,
        fontWeight: '700',
    },
    tierDesc: {
        fontSize: 11.5,
        lineHeight: 16,
    },
    tierBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 4,
    },
    tierBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    officerCard: {
        padding: 14,
        borderRadius: 14,
        marginTop: 6,
        gap: 10,
    },
    officerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    officerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    officerRole: {
        fontSize: 9.5,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    officerName: {
        fontSize: 14,
        fontWeight: '700',
    },
    officerDesignation: {
        fontSize: 11,
    },
    officerMeta: {
        gap: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150, 150, 150, 0.1)',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 11.5,
    },
    officerActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 14,
        paddingLeft: 2,
    },
    categoriesList: {
        gap: 10,
    },
    catCard: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    catDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
    supportCard: {
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    supportTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    supportSub: {
        fontSize: 12,
        marginTop: 1,
    },
});
