import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Headphones, ShieldAlert, Clock, CheckCircle2, AlertTriangle, Scale, Phone, DollarSign, ChevronRight, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';

const DISPUTE_SCENARIOS = [
    {
        id: 'p1_damage',
        priority: 'PRIORITY 1: CRITICAL',
        title: 'Appliance Burnout / Property Damage Report',
        badge: '2-Hour Field Dispatch',
        badgeVariant: 'danger',
        script: '“Mr./Ms. [Customer Name], your safety is our top priority. Please stay calm while I initiate our emergency safety protocol. Please ensure your main breaker is tripped and do not touch exposed wiring.”',
        steps: [
            '1. Safety Verification: Confirm main ELCB/Isolator is switched off. Remind customer never to throw water on electrical equipment.',
            '2. Emergency Ticket: Log ticket under category P1 - PROPERTY DAMAGE with photo evidence.',
            '3. Supervisor Dispatch: Dispatch on-call Senior KSELB Class A Supervisor within 2 Hours.',
            '4. Reassurance: Inform customer that all domestic repairs are backed by our ₹5,00,000 Property Damage Safety Guarantee.',
        ],
        actionLabel: 'Launch Emergency Damage Claim Desk',
        actionRoute: '/damage-claim',
    },
    {
        id: 'p2_cancellation',
        priority: 'PRIORITY 2: BILLING DISPUTE',
        title: 'Doorstep Travel Fee / Cancellation Dispute',
        badge: 'Fair Marketplace',
        badgeVariant: 'info',
        script: '“Under our Fair Marketplace Policy, when a technician reaches your doorstep, the ₹100 fee is paid directly to the electrician to compensate for fuel and travel time. The rest of your fee is refunded immediately.”',
        steps: [
            '1. GPS Log Audit: Verify if technician arrived on time using foreground GPS tracking timestamps.',
            '2. Late Arrival Exception: If the technician was delayed > 30 mins without prior notice, waive 100% of the cancellation fee and issue an instant full refund.',
            '3. Refund Timeline: Remind customer that refunds are processed via UPI within 2 hours.',
        ],
        actionLabel: 'View Cancellation Policy Matrix',
        actionRoute: '/cancellation-policy',
    },
    {
        id: 'p3_bypass',
        priority: 'PRIORITY 3: COMPLIANCE',
        title: 'Off-Platform Cash Bypass & Overcharge Report',
        badge: 'Zero Tolerance',
        badgeVariant: 'purple',
        script: '“Thank you for reporting this. All official payments must be made digitally through Sheriyakam to maintain your 30-day warranty and ₹5 Lakh insurance protection.”',
        steps: [
            '1. Proof Collection: Request screenshot or photo of cash payment or handwritten receipt.',
            '2. Customer Compensation: Issue a ₹100 convenience credit voucher to customer wallet.',
            '3. Partner Warning: Issue a formal Section 5 audit notice to the technician. Second offense results in permanent platform deactivation.',
        ],
        actionLabel: 'Report to Grievance Officer',
        actionRoute: '/grievance',
    },
];

export default function DisputeSOPScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState('p1_damage');

    const tabs = [
        { id: 'p1_damage', label: 'P1: Damage & Fires' },
        { id: 'p2_cancellation', label: 'P2: Cancellation' },
        { id: 'p3_bypass', label: 'P3: Cash Bypass' },
    ];

    const currentScenario = DISPUTE_SCENARIOS.find((s) => s.id === activeTab) || DISPUTE_SCENARIOS[0];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Customer Support Dispute SOP
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple" size="md">Customer Service Playbook</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        On-Site Incident & Dispute Resolution SOP
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Standardized scripts, de-escalation workflows, and escalation timelines for support agents under the Consumer Protection (E-Commerce) Rules, 2020.
                    </Text>
                </View>

                {/* Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        variant="pills"
                    />
                </ScrollView>

                {/* Scenario Playbook Card */}
                <Card variant="elevated" style={styles.playbookCard}>
                    <View style={styles.cardTop}>
                        <View style={{ flex: 1 }}>
                            <Badge variant={currentScenario.badgeVariant} size="sm">{currentScenario.priority}</Badge>
                            <Text style={[styles.scenarioTitle, { color: colors.textPrimary, marginTop: 4 }]}>
                                {currentScenario.title}
                            </Text>
                        </View>
                    </View>

                    {/* Agent Script Box */}
                    <View style={[styles.scriptBox, { backgroundColor: isDark ? '#27272A50' : '#EFF6FF80', borderColor: isDark ? '#3F3F46' : '#BFDBFE' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <Headphones size={14} color={colors.accent} />
                            <Text style={[styles.scriptLabel, { color: colors.accent }]}>RECOMMENDED AGENT SCRIPT</Text>
                        </View>
                        <Text style={[styles.scriptText, { color: colors.textPrimary }]}>
                            {currentScenario.script}
                        </Text>
                    </View>

                    {/* Step-by-Step Action Items */}
                    <Text style={[styles.stepsHeading, { color: colors.textSecondary }]}>
                        MANDATORY RESOLUTION WORKFLOW
                    </Text>

                    <View style={styles.stepsList}>
                        {currentScenario.steps.map((step, idx) => (
                            <View key={idx} style={styles.stepItem}>
                                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                                    {step}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Action Route Trigger */}
                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        iconRight={ChevronRight}
                        onPress={() => router.push(currentScenario.actionRoute)}
                        style={{ marginTop: 10 }}
                    >
                        {currentScenario.actionLabel}
                    </Button>
                </Card>

                {/* Statutory SLAs Card */}
                <Card variant="default" style={styles.slaCard}>
                    <Text style={[styles.slaTitle, { color: colors.textPrimary }]}>
                        Statutory Resolution Timeframes (E-Commerce Rules 2020)
                    </Text>
                    <View style={styles.slaGrid}>
                        <View style={styles.slaItem}>
                            <Text style={[styles.slaNumber, { color: '#10B981' }]}>24 Hrs</Text>
                            <Text style={[styles.slaDesc, { color: colors.textTertiary }]}>Formal Ticket Ack</Text>
                        </View>
                        <View style={styles.slaItem}>
                            <Text style={[styles.slaNumber, { color: '#3B82F6' }]}>2 Hours</Text>
                            <Text style={[styles.slaDesc, { color: colors.textTertiary }]}>Emergency Inspection</Text>
                        </View>
                        <View style={styles.slaItem}>
                            <Text style={[styles.slaNumber, { color: '#F59E0B' }]}>48 Hrs</Text>
                            <Text style={[styles.slaDesc, { color: colors.textTertiary }]}>Surveyor Appraisal</Text>
                        </View>
                        <View style={styles.slaItem}>
                            <Text style={[styles.slaNumber, { color: '#8B5CF6' }]}>7 Days</Text>
                            <Text style={[styles.slaDesc, { color: colors.textTertiary }]}>Bank Settlement</Text>
                        </View>
                    </View>
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
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 14,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 10,
        gap: 6,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.4,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
    tabsScroll: {
        paddingVertical: 4,
    },
    playbookCard: {
        padding: 18,
        gap: 12,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scenarioTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    scriptBox: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    scriptLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    scriptText: {
        fontSize: 12.5,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    stepsHeading: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginTop: 4,
    },
    stepsList: {
        gap: 8,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    stepText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
    },
    slaCard: {
        padding: 16,
        gap: 12,
    },
    slaTitle: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
    slaGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    slaItem: {
        alignItems: 'center',
        flex: 1,
    },
    slaNumber: {
        fontSize: 16,
        fontWeight: '900',
    },
    slaDesc: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },
});
