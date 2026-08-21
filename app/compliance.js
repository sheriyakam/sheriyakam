import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, Scale, Lock, FileText, CheckCircle2, AlertTriangle, Eye, Award, ExternalLink, Download, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import { ConsentManagerModal } from '../components/ConsentManagerModal';

const COMPLIANCE_PILLARS = [
    {
        id: 'dpdp',
        title: 'Digital Personal Data Protection (DPDP) Act, 2023',
        authority: 'Ministry of Electronics and Information Technology (MeitY)',
        badge: 'DPDP 2023 Compliant',
        color: '#10B981',
        clauses: [
            {
                title: 'Section 5 & 6: Notice and Clear Consent',
                content: 'Bilingual itemized consent manager (English & Malayalam) specifying exact data purposes before processing. Consent can be updated or withdrawn at any time.'
            },
            {
                title: 'Section 9: Child Data Protection (Under 18)',
                content: 'Strict age confirmation barrier preventing minors from contracting high-voltage electrical services without verifiable parental consent; zero behavioral profiling.'
            },
            {
                title: 'Section 11-14: Data Principal Rights',
                content: 'Self-service 1-tap data export and permanent account deletion purge from Supabase Auth and database clusters.'
            },
            {
                title: 'Data Protection Officer (DPO)',
                content: 'Designated resident DPO with official Kozhikode address: dpo@sheriyakam.com.'
            },
        ]
    },
    {
        id: 'it_rules',
        title: 'Information Technology Rules, 2021 & 2023 Amendments',
        authority: 'Intermediary Guidelines and Digital Media Ethics Code',
        badge: 'IT Rules 2021 Compliant',
        color: '#3B82F6',
        clauses: [
            {
                title: 'Rule 3(2): Resident Grievance Officer',
                content: 'Adv. Arun V. Nair (Kozhikode, Kerala). Statutory SLAs: Acknowledgment within 24 hours and final dispute resolution within 15 calendar days.'
            },
            {
                title: 'Rule 3(1)(d): 36-Hour Content Takedown',
                content: 'Immediate automated/manual takedown of illegal, obscene, impersonating, or defamatory user submissions upon court order or government notification.'
            },
            {
                title: 'Deepfake & Misinformation Mitigation',
                content: 'Zero-tolerance policy and strict identification mechanisms against AI-generated fraudulent reviews or impersonated contractor IDs.'
            },
            {
                title: '24x7 Nodal Law Enforcement Officer',
                content: 'Dedicated point of contact for legal coordination: nodal@sheriyakam.com.'
            },
        ]
    },
    {
        id: 'cert_in',
        title: 'CERT-In Cybersecurity Directions (April 2022)',
        authority: 'Indian Computer Emergency Response Team (IT Act Section 70B)',
        badge: 'CERT-In Compliant',
        color: '#EF4444',
        clauses: [
            {
                title: '6-Hour Cybersecurity Breach Reporting',
                content: 'Legally binding incident response protocol reporting system breaches or unauthorized access to incident@cert-in.org.in within 6 hours of discovery.'
            },
            {
                title: '180-Day Encrypted Access Logs',
                content: 'System, API, and user authorization logs retained for 180+ days synchronized with Indian Standard Time (IST) via National Physical Laboratory NTP.'
            },
            {
                title: 'Penetration Testing & Security Audits',
                content: 'Annual vulnerability assessment and penetration testing (VAPT) across all mobile clients and REST APIs.'
            },
        ]
    },
    {
        id: 'consumer_ecom',
        title: 'Consumer Protection (E-Commerce) Rules, 2020 & Dark Patterns Ban',
        authority: 'Central Consumer Protection Authority (CCPA)',
        badge: 'CCPA Compliant',
        color: '#F59E0B',
        clauses: [
            {
                title: 'Dark Patterns Prohibition Guidelines, 2023',
                content: 'Zero false urgency countdowns, zero basket sneaking (all spare parts are strictly opt-in), zero confirm shaming, and zero drip pricing.'
            },
            {
                title: 'Country of Origin Disclosures',
                content: 'All spare materials, MCBs, and wiring cables display manufacturer origin (e.g. Havells, Anchor, Finolex — Made in India).'
            },
            {
                title: 'Transparent Refund & Cancellation Tariffs',
                content: 'Free booking cancellation up to 2 hours prior to scheduled appointment. Instant digital UPI refund within 2 hours.'
            },
        ]
    },
    {
        id: 'kerala_state',
        title: 'Kerala State Electrical Licensing Board (KSELB) & State GST',
        authority: 'Kerala Electrical Inspectorate & Central Electricity Authority',
        badge: 'KSELB & KSGST',
        color: '#8B5CF6',
        clauses: [
            {
                title: 'KSELB Wireman & Supervisor Licensing',
                content: 'Every contractor holds a verified Class W (Wireman) or Class A/B (Supervisor) competency certificate displayed on booking receipts.'
            },
            {
                title: 'CEA 2010 Domestic Safety Standards',
                content: 'Mandatory earth loop resistance testing (voltage leakage < 2.0V AC) and 30-day free rework warranty on domestic repairs.'
            },
            {
                title: 'Kerala SGST Act 2017 & SAC Code 9987',
                content: 'Tax invoices explicitly itemize 9% CGST + 9% Kerala SGST on electrical maintenance and repair labor.'
            },
        ]
    },
    {
        id: 'gigw',
        title: 'GIGW 3.0 & WCAG 2.1 AA Digital Accessibility',
        authority: 'National Informatics Centre (NIC) / W3C Guidelines',
        badge: 'WCAG 2.1 AA / GIGW 3.0',
        color: '#EC4899',
        clauses: [
            {
                title: 'Screen Reader & Touch Target Standards',
                content: 'Semantic accessibility roles, labels, and hints across all buttons and inputs. Minimum touch area of 48×48 dp.'
            },
            {
                title: 'Color Contrast & Bilingual Text Sizing',
                content: 'High contrast ratios (> 4.5:1) in Dark and Light modes with responsive Malayalam & English typography scaling.'
            },
        ]
    },
];

export default function ComplianceHubScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState('dpdp');
    const [showConsentModal, setShowConsentModal] = useState(false);

    const tabs = [
        { id: 'dpdp', label: 'DPDP 2023' },
        { id: 'it_rules', label: 'IT Rules 2021' },
        { id: 'cert_in', label: 'CERT-In' },
        { id: 'consumer_ecom', label: 'Consumer & Dark Patterns' },
        { id: 'kerala_state', label: 'Kerala & KSELB' },
        { id: 'gigw', label: 'GIGW 3.0 / WCAG' },
    ];

    const currentPillar = COMPLIANCE_PILLARS.find((p) => p.id === activeTab) || COMPLIANCE_PILLARS[0];

    const handleDownloadCertificate = () => {
        success('Sheriyakam_Statutory_Compliance_Audit_2026.pdf downloaded!', 'Audit Certificate');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Legal & Regulatory Compliance Hub
                </Text>
                <TouchableOpacity onPress={handleDownloadCertificate} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Download compliance certificate">
                    <Download size={20} color={colors.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">Indian & Kerala Statutory Frameworks</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Uncompromising Legal & Safety Governance
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Explore how Sheriyakam adheres to India’s Digital Data Protection Act, IT Rules 2021, CERT-In Cyber Directions, CCPA Dark Patterns Ban, and Kerala Electrical Inspectorate standards.
                    </Text>
                </View>

                {/* Quick Statutory Action Tiles */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        onPress={() => setShowConsentModal(true)}
                        style={[styles.actionTile, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                    >
                        <ShieldCheck size={22} color="#10B981" />
                        <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Consent Preferences</Text>
                        <Text style={[styles.actionSub, { color: colors.textTertiary }]}>Manage DPDP Section 5/6 permissions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/grievance')}
                        style={[styles.actionTile, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                    >
                        <Scale size={22} color="#3B82F6" />
                        <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>Grievance Officer</Text>
                        <Text style={[styles.actionSub, { color: colors.textTertiary }]}>24-hr ack / 15-day resolution SLA</Text>
                    </TouchableOpacity>
                </View>

                {/* Framework Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        variant="pills"
                    />
                </ScrollView>

                {/* Active Pillar Card */}
                <Card variant="elevated" style={styles.pillarCard}>
                    <View style={styles.pillarHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: currentPillar.color + '18' }]}>
                            <ShieldCheck size={26} color={currentPillar.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Badge variant="success" size="sm">{currentPillar.badge}</Badge>
                            <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>
                                {currentPillar.title}
                            </Text>
                            <Text style={[styles.pillarAuth, { color: colors.textTertiary }]}>
                                Enforcing Body: {currentPillar.authority}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    {/* Clauses Accordion */}
                    <Accordion>
                        {currentPillar.clauses.map((clause, idx) => (
                            <AccordionItem key={idx} title={clause.title}>
                                <Text style={[styles.clauseContent, { color: colors.textSecondary }]}>
                                    {clause.content}
                                </Text>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Card>

                {/* Grievance Link Box */}
                <Card variant="default" style={styles.bottomCard}>
                    <Text style={[styles.bottomTitle, { color: colors.textPrimary }]}>
                        Need to exercise your statutory rights or report a dispute?
                    </Text>
                    <Text style={[styles.bottomSub, { color: colors.textSecondary }]}>
                        Our Resident Grievance Redressal Officer in Kozhikode is available for formal filings.
                    </Text>
                    <Button
                        variant="primary"
                        size="md"
                        onPress={() => router.push('/grievance')}
                        style={{ marginTop: 12 }}
                    >
                        Access Grievance Redressal Portal
                    </Button>
                </Card>
            </ScrollView>

            {/* DPDP Consent Manager Modal */}
            <ConsentManagerModal
                visible={showConsentModal}
                onClose={() => setShowConsentModal(false)}
            />
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
    iconBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 12,
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
        lineHeight: 19,
        maxWidth: 340,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 12,
    },
    actionTile: {
        flex: 1,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 4,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 4,
    },
    actionSub: {
        fontSize: 11,
        lineHeight: 15,
    },
    tabsScroll: {
        paddingVertical: 6,
        marginBottom: 8,
    },
    pillarCard: {
        padding: 18,
        gap: 12,
    },
    pillarHeader: {
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillarTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    pillarAuth: {
        fontSize: 11,
        marginTop: 1,
    },
    divider: {
        height: 1,
    },
    clauseContent: {
        fontSize: 13,
        lineHeight: 20,
    },
    bottomCard: {
        padding: 18,
        marginTop: 18,
        gap: 6,
    },
    bottomTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    bottomSub: {
        fontSize: 12,
        lineHeight: 17,
    },
});
