import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, Shield, Building2, Code2, FileText, Zap, ExternalLink, Sparkles, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';

const ROADMAP_PHASES = [
    {
        phase: 'Step 1: Corporate Foundation & Shield',
        timing: 'Month 1',
        icon: Building2,
        color: '#3B82F6',
        items: [
            {
                id: 'corp_1',
                title: 'Incorporate as Private Limited (Pvt Ltd)',
                desc: 'Shields personal assets (savings, home, car) behind corporate limited liability.',
                route: null,
            },
            {
                id: 'corp_2',
                title: 'Kerala GSTIN Registration (32AABCS8492K1Z8)',
                desc: 'Collect and remit 18% GST (9% CGST + 9% SGST) on electrical labor (SAC 9987).',
                route: '/compliance',
            },
            {
                id: 'corp_3',
                title: 'Corporate Current Bank Account',
                desc: 'Tied directly to marketplace payment gateway to strictly isolate founder finances.',
                route: null,
            },
        ]
    },
    {
        phase: 'Step 2: Essential Tech & Data Setup',
        timing: 'Development',
        icon: Code2,
        color: '#10B981',
        items: [
            {
                id: 'tech_1',
                title: 'Just-in-Time Location Permissions',
                desc: 'App requests GPS coordinates foreground-only during active dispatch; zero idle tracking.',
                route: '/data-retention',
            },
            {
                id: 'tech_2',
                title: 'Explicit Un-checked Consent Box',
                desc: 'Manual user confirmation required for Terms & Privacy Policy on signup.',
                route: '/settings',
            },
            {
                id: 'tech_3',
                title: 'OTP-Based Authentication (SMS / WhatsApp)',
                desc: 'Eliminates database plaintext password breach risks entirely.',
                route: '/auth/login',
            },
            {
                id: 'tech_4',
                title: 'Masked VoIP PBX Calling Bridge',
                desc: 'Protects customer & technician phone numbers and stops cash platform leakage.',
                route: '/chat',
            },
        ]
    },
    {
        phase: 'Step 3: Minimum Viable Legal Documents (MVL)',
        timing: 'Pre-Launch',
        icon: FileText,
        color: '#F59E0B',
        items: [
            {
                id: 'doc_1',
                title: 'Terms of Service (User)',
                desc: 'Establishes digital intermediary marketplace model & caps liability at ₹5,000.',
                route: '/terms',
            },
            {
                id: 'doc_2',
                title: 'Technician Onboarding Agreement (SLA)',
                desc: 'Independent contractor status, 15% commission / 85% split, mandatory PPE warranty.',
                route: '/partner/agreement',
            },
            {
                id: 'doc_3',
                title: 'Privacy Policy (DPDP Act 2023)',
                desc: 'Section 5 notice, purpose limitation, zero third-party data selling, 1-tap data deletion.',
                route: '/privacy',
            },
            {
                id: 'doc_4',
                title: 'Doorstep Cancellation & Refund Matrix',
                desc: '₹0 before 2 hrs, ₹100 doorstep travel compensation to electrician, 2-hr UPI refund.',
                route: '/cancellation-policy',
            },
        ]
    },
    {
        phase: 'Step 4: Simple Vendor Integrations',
        timing: 'Launch Week',
        icon: Zap,
        color: '#8B5CF6',
        items: [
            {
                id: 'vend_1',
                title: 'Digio / ZoopOne Identity Verification',
                desc: 'Instant Aadhaar e-KYC and PAN card validation for technician onboarding.',
                route: '/partner/onboarding-checklist',
            },
            {
                id: 'vend_2',
                title: 'Razorpay Route / Cashfree Split Payments',
                desc: 'Automated marketplace split (15% platform fee kept, 85% sent to electrician bank).',
                route: '/invoice/VF-2026-89102',
            },
            {
                id: 'vend_3',
                title: 'ICICI Lombard CGL Insurance (#CGL-2026-SHK)',
                desc: '₹5,00,000 property damage policy covering domestic electrical fire and appliance burnouts.',
                route: '/damage-claim',
            },
        ]
    },
];

export default function FounderChecklistScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [checkedItems, setCheckedItems] = useState({
        corp_1: true,
        corp_2: true,
        corp_3: true,
        tech_1: true,
        tech_2: true,
        tech_3: true,
        tech_4: true,
        doc_1: true,
        doc_2: true,
        doc_3: true,
        doc_4: true,
        vend_1: true,
        vend_2: true,
        vend_3: true,
    });

    const totalTasks = Object.keys(checkedItems).length;
    const completedTasks = Object.values(checkedItems).filter(Boolean).length;
    const progressPct = Math.round((completedTasks / totalTasks) * 100);

    const toggleTask = (id) => {
        setCheckedItems((prev) => {
            const next = { ...prev, [id]: !prev[id] };
            if (!prev[id]) {
                success('Milestone marked complete!', 'Roadmap Updated');
            }
            return next;
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Founder's Pre-Launch Legal Roadmap
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Hero */}
                <Card variant="elevated" style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={{ flex: 1 }}>
                            <Badge variant="success" size="md">Pre-Launch Stage</Badge>
                            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                                {progressPct}% Launch Readiness
                            </Text>
                            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                                {completedTasks} of {totalTasks} critical legal & tech milestones completed
                            </Text>
                        </View>
                        <View style={[styles.progressCircle, { backgroundColor: '#10B98120' }]}>
                            <Sparkles size={28} color="#10B981" />
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
                    </View>
                </Card>

                {/* Phases */}
                {ROADMAP_PHASES.map((phase, pIdx) => {
                    const Icon = phase.icon;
                    return (
                        <View key={pIdx} style={styles.phaseWrap}>
                            <View style={styles.phaseHeader}>
                                <View style={[styles.iconWrap, { backgroundColor: phase.color + '18' }]}>
                                    <Icon size={18} color={phase.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.phaseTitle, { color: colors.textPrimary }]}>
                                        {phase.phase}
                                    </Text>
                                    <Text style={[styles.phaseTiming, { color: colors.textTertiary }]}>
                                        {phase.timing}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.itemsList}>
                                {phase.items.map((item) => (
                                    <Card key={item.id} variant="default" style={styles.itemCard}>
                                        <View style={styles.itemRow}>
                                            <Checkbox
                                                checked={checkedItems[item.id]}
                                                onChange={() => toggleTask(item.id)}
                                            />
                                            <View style={{ flex: 1, marginLeft: 8 }}>
                                                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                                    {item.title}
                                                </Text>
                                                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                                    {item.desc}
                                                </Text>
                                            </View>
                                        </View>

                                        {item.route && (
                                            <TouchableOpacity
                                                onPress={() => router.push(item.route)}
                                                style={[styles.routeBtn, { borderTopColor: isDark ? '#27272A' : '#F4F4F5' }]}
                                            >
                                                <Text style={[styles.routeBtnText, { color: colors.accent }]}>
                                                    Inspect Live Implementation
                                                </Text>
                                                <ChevronRight size={14} color={colors.accent} />
                                            </TouchableOpacity>
                                        )}
                                    </Card>
                                ))}
                            </View>
                        </View>
                    );
                })}
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
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 16,
    },
    heroCard: {
        padding: 18,
        gap: 12,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginTop: 4,
    },
    heroSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    progressCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    phaseWrap: {
        gap: 8,
    },
    phaseHeader: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingLeft: 2,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phaseTitle: {
        fontSize: 14,
        fontWeight: '800',
    },
    phaseTiming: {
        fontSize: 11,
    },
    itemsList: {
        gap: 8,
    },
    itemCard: {
        padding: 12,
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    itemDesc: {
        fontSize: 11.5,
        lineHeight: 16,
        marginTop: 2,
    },
    routeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        paddingTop: 8,
        marginTop: 2,
    },
    routeBtnText: {
        fontSize: 11.5,
        fontWeight: '700',
    },
});
