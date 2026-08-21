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
        category: 'User GPS & Location Logs',
        duration: '180 Days',
        statute: 'DPDP Act 2023 & Criminal Procedure Safety',
        desc: 'Operational tracking and safety audit in case of residential incident investigations.',
        deletionTrigger: 'Automatically deleted 180 days after order closure unless an active dispute is open.',
        icon: Clock,
        color: '#F59E0B',
    },
    {
        category: 'Server Traffic & IP Access Logs',
        duration: '1 Year (365 Days)',
        statute: 'CERT-In Cybersecurity Directives (IT Act Sec 70B)',
        desc: 'Mandatory compliance under CERT-In cybersecurity directions with NTP Indian Standard Time synchronization.',
        deletionTrigger: 'Purged automatically after 1 year via automated systemic cron jobs.',
        icon: Lock,
        color: '#EF4444',
    },
    {
        category: 'Masked Call & Audio Recordings',
        duration: '30 Days',
        statute: 'DoT Virtual PBX & Telecom Intermediary Rules',
        desc: 'Resolving customer-technician behavior disputes, quality assurance, and checkout bypass prevention.',
        deletionTrigger: 'Deleted 30 days after job completion if no dispute is raised.',
        icon: Database,
        color: '#8B5CF6',
    },
    {
        category: 'Aadhaar e-KYC Verification Tokens',
        duration: 'Duration of Employment + 30 Days',
        statute: 'UIDAI Ecosystem & Labor BGV Mandates',
        desc: 'Validating the background check and police clearance status of on-boarded electricians.',
        deletionTrigger: 'Completely wiped within 30 days of the technician off-boarding from the platform.',
        icon: ShieldCheck,
        color: '#10B981',
    },
    {
        category: 'Financial Invoice & Tax Ledgers',
        duration: '8 Financial Years (96 Months)',
        statute: 'Indian Income Tax Act, 1961 & GST Rules',
        desc: 'Statutory account audit records, SAC 9987 / HSN 8536 itemized invoices, and GST remittance filings.',
        deletionTrigger: 'Cannot be deleted by user request due to overlapping financial tax mandates.',
        icon: FileCheck,
        color: '#3B82F6',
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
                    Backend Data Retention Schedule
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple" size="md">DPDP Act 2023 & CERT-In Cyber Directives</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Statutory System Log Lifecycles & Purge Rules
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Under the Digital Personal Data Protection (DPDP) Act, 2023 and CERT-In cyber guidelines, our backend systems retain specific system logs for statutory legal audits while honoring user data deletion rights.
                    </Text>
                </View>

                {/* Schedules List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    STATUTORY DATA RETENTION MATRIX
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
                                    <Text style={[styles.statuteLabel, { color: colors.textTertiary }]}>Governing Mandate:</Text>
                                    <Text style={[styles.statuteVal, { color: colors.accent, fontWeight: '700' }]}>{item.statute}</Text>
                                </View>

                                <Text style={[styles.descText, { color: colors.textSecondary }]}>
                                    {item.desc}
                                </Text>

                                <View style={[styles.purgeBox, { backgroundColor: isDark ? '#27272A50' : '#F4F4F5' }]}>
                                    <Text style={[styles.purgeLabel, { color: colors.textTertiary }]}>Deletion Trigger (DPDP Rules):</Text>
                                    <Text style={[styles.purgeText, { color: colors.textPrimary }]}>{item.deletionTrigger}</Text>
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
