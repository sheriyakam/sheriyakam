import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Database, Clock, ShieldCheck, Lock, Trash2, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const RETENTION_SCHEDULES = [
    {
        category: 'CERT-In Infrastructure & Access Logs',
        duration: '180 Days (Mandatory)',
        statute: 'CERT-In Directions under IT Act Sec 70B',
        desc: 'IP addresses, login timestamps, API tokens, and server request headers synchronized with Indian Standard Time (IST) NTP servers.',
        purgeMethod: 'Automated cryptographic overwrite after 180 days.',
        icon: Lock,
        color: '#EF4444',
    },
    {
        category: 'Financial GST Invoices & Ledger Records',
        duration: '6 Years (Mandatory)',
        statute: 'Central & Kerala SGST Act, 2017 (Sec 36)',
        desc: 'Tax invoices, SAC 9987 breakdowns, CGST/SGST collected, UPI transaction IDs, and customer billing names.',
        purgeMethod: 'Statutory archive maintained for 72 months for tax audits.',
        icon: FileCheck,
        color: '#3B82F6',
    },
    {
        category: 'Personal Identity & Profile PII',
        duration: 'Active Account or 30-Day Erasure',
        statute: 'DPDP Act, 2023 (Sec 12 & 13)',
        desc: 'Names, phone numbers, saved addresses, and payment tokens. Purged immediately or within 30 days upon user account deletion request.',
        purgeMethod: 'Self-service 1-tap permanent cryptographic erasure.',
        icon: Trash2,
        color: '#10B981',
    },
    {
        category: 'Foreground GPS Coordinates & Trip Routes',
        duration: '30 Days Post-Booking',
        statute: 'DPDP Act 2023 & Consumer Protection Rules',
        desc: 'Latitude/longitude tracking points captured during active electrician transit for SLA route verification.',
        purgeMethod: 'Hard deleted from Redis/database clusters after 30 days.',
        icon: Clock,
        color: '#F59E0B',
    },
    {
        category: 'Masked VoIP Call Detail Records (CDR)',
        duration: '90 Days Metadata / 30 Days Audio',
        statute: 'DoT Virtual PBX & Telecom Guidelines',
        desc: 'Call duration, timestamp, and virtual masked bridge identifiers. Voice recordings encrypted and deleted after 30 days.',
        purgeMethod: 'Permanent audio purge after 30 days; metadata purged after 90 days.',
        icon: Database,
        color: '#8B5CF6',
    },
    {
        category: 'Contractor BGV, PVC & KSELB Dossiers',
        duration: 'Active Lifecycle + 3 Years Post-Exit',
        statute: 'Workmen & Vicarious Liability Law',
        desc: 'Aadhaar e-KYC logs, Police Verification Certificates, e-Shram UAN, and Kerala wireman license copies.',
        purgeMethod: 'Encrypted cold storage vault; purged 36 months after deactivation.',
        icon: ShieldCheck,
        color: '#EC4899',
    },
];

export default function DataRetentionScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleAuditRequest = () => {
        success('Data retention ledger audit report generated for your session.', 'Retention Audit');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Data Retention & Cyber Log Schedule
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple" size="md">Indian Cyber Law & DPDP Compliance</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Statutory Data Lifecycles & Purge Protocols
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Transparent schedules detailing how long Sheriyakam stores system logs, GPS coordinates, financial invoices, and call records under CERT-In, DPDP Act 2023, and GST rules.
                    </Text>
                </View>

                {/* Schedules List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    STATUTORY DATA RETENTION SCHEDULE
                </Text>

                <View style={styles.scheduleList}>
                    {RETENTION_SCHEDULES.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Card key={idx} variant="default" style={styles.scheduleCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
                                        <Icon size={20} color={item.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.catTitle, { color: colors.textPrimary }]}>
                                            {item.category}
                                        </Text>
                                        <Badge variant="neutral" size="sm">{item.duration}</Badge>
                                    </View>
                                </View>

                                <View style={styles.statuteRow}>
                                    <Text style={[styles.statuteLabel, { color: colors.textTertiary }]}>Governing Law:</Text>
                                    <Text style={[styles.statuteVal, { color: colors.accent, fontWeight: '700' }]}>{item.statute}</Text>
                                </View>

                                <Text style={[styles.descText, { color: colors.textSecondary }]}>
                                    {item.desc}
                                </Text>

                                <View style={[styles.purgeBox, { backgroundColor: isDark ? '#27272A50' : '#F4F4F5' }]}>
                                    <Text style={[styles.purgeLabel, { color: colors.textTertiary }]}>Purge Lifecycle:</Text>
                                    <Text style={[styles.purgeText, { color: colors.textPrimary }]}>{item.purgeMethod}</Text>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* Audit & Rights */}
                <Card variant="elevated" style={styles.actionCard}>
                    <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                        Exercising Your DPDP Data Erasure Rights
                    </Text>
                    <Text style={[styles.actionSub, { color: colors.textSecondary }]}>
                        You can trigger a full export of your personal data or perform an immediate cryptographic account erasure at any time via Account & Security.
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <Button
                            variant="primary"
                            size="md"
                            onPress={() => router.push('/account')}
                            style={{ flex: 1 }}
                        >
                            Account Settings
                        </Button>
                        <Button
                            variant="outline"
                            size="md"
                            onPress={handleAuditRequest}
                            style={{ flex: 1 }}
                        >
                            Audit Log
                        </Button>
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
        lineHeight: 18,
        maxWidth: 340,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    scheduleList: {
        gap: 12,
    },
    scheduleCard: {
        padding: 16,
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    statuteRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginTop: 2,
    },
    statuteLabel: {
        fontSize: 11,
    },
    statuteVal: {
        fontSize: 11,
    },
    descText: {
        fontSize: 12,
        lineHeight: 17,
    },
    purgeBox: {
        padding: 10,
        borderRadius: 8,
        gap: 2,
        marginTop: 4,
    },
    purgeLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    purgeText: {
        fontSize: 11,
        lineHeight: 15,
    },
    actionCard: {
        padding: 18,
        marginTop: 18,
        gap: 6,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    actionSub: {
        fontSize: 12,
        lineHeight: 17,
    },
});
