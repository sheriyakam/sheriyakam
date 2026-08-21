import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, Lock, UserCheck, Key, FileCheck, CheckCircle2, AlertTriangle, Shield } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const SECURITY_PILLARS = [
    {
        icon: UserCheck,
        title: '3-Tier Kerala Wireman Vetting (KSELB)',
        desc: 'Every electrician undergoes government license verification with the Kerala Electrical Inspectorate, criminal background check, and a practical bench test on 3-phase wiring safety.',
        color: '#10B981',
    },
    {
        icon: Lock,
        title: 'Bank-Grade TLS 1.3 & Zero-Knowledge Encryption',
        desc: 'All communications are protected by TLS 1.3 in transit. Sensitive identity data is encrypted at rest using AES-256 with managed zero-knowledge authentication via Supabase.',
        color: '#3B82F6',
    },
    {
        icon: Shield,
        title: '₹5,00,000 Domestic Property Damage Guarantee',
        desc: 'Every domestic booking on Sheriyakam is backed by our domestic property protection policy, covering accidental electrical equipment damages during repair.',
        color: '#F59E0B',
    },
    {
        icon: FileCheck,
        title: 'DPDP Act 2023 & Consent Governance',
        desc: 'Bilingual Section 5 notice and Section 6 consent management with 1-tap data export and permanent cryptographic erasure.',
        color: '#6366F1',
    },
    {
        icon: AlertTriangle,
        title: 'CERT-In 6-Hour Incident Reporting & 180-Day Logs',
        desc: 'Strict cybersecurity protocol reporting any breach to CERT-In within 6 hours. Infrastructure access logs preserved for 180+ days synchronized via IST NTP.',
        color: '#EF4444',
    },
];

export default function SecurityScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Security & Protection</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Banner */}
                <View style={styles.heroSection}>
                    <View style={[styles.shieldCircle, { backgroundColor: '#10B98118' }]}>
                        <ShieldCheck size={44} color="#10B981" />
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Safety First. In Every Circuit.
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        How we protect your home, your family, and your personal data with verified trade compliance.
                    </Text>
                </View>

                {/* Pillars */}
                <View style={styles.pillarsList}>
                    {SECURITY_PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <Card key={idx} variant="default" style={styles.pillarCard}>
                                <View style={[styles.iconWrap, { backgroundColor: pillar.color + '18' }]}>
                                    <Icon size={22} color={pillar.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>
                                        {pillar.title}
                                    </Text>
                                    <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                        {pillar.desc}
                                    </Text>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* Compliance Badges Card */}
                <Card variant="elevated" style={styles.complianceCard}>
                    <Text style={[styles.compTitle, { color: colors.textPrimary }]}>
                        Official Trade & Legal Compliance
                    </Text>
                    <View style={styles.compBadges}>
                        <Badge variant="success">KSELB Wireman Licensed</Badge>
                        <Badge variant="info">TLS 1.3 HTTPS Secured</Badge>
                        <Badge variant="neutral">DPDP India Act 2023</Badge>
                        <Badge variant="purple">IT Rules 2021 (Rule 3(2))</Badge>
                        <Badge variant="gold">CERT-In 6-Hr Reporting</Badge>
                    </View>

                    <View style={{ width: '100%', gap: 8, marginTop: 10 }}>
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onPress={() => router.push('/compliance')}
                        >
                            Open Compliance Hub
                        </Button>
                        <Button
                            variant="outline"
                            size="md"
                            fullWidth
                            onPress={() => router.push('/grievance')}
                        >
                            Contact Grievance Redressal Officer
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
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: 14,
    },
    shieldCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        textAlign: 'center',
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    pillarsList: {
        gap: 12,
        marginVertical: 12,
    },
    pillarCard: {
        padding: 16,
        flexDirection: 'row',
        gap: 14,
        alignItems: 'flex-start',
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillarTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    pillarDesc: {
        fontSize: 12,
        lineHeight: 18,
    },
    complianceCard: {
        padding: 18,
        marginVertical: 10,
        alignItems: 'center',
        gap: 12,
    },
    compTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    compBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
});
