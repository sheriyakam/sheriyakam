import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, CheckCircle2, Zap, Shield, GitCommit } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const RELEASES = [
    {
        version: 'v1.2.0',
        date: 'August 17, 2026',
        title: 'VIP Protection Club & Live Dispatch Gantt',
        changes: [
            'Launched VIP Home Maintenance Annual Membership with ₹0 visit fees',
            'Integrated Contractor Gantt Timeline & Live Booking Dispatch Kanban for admins',
            'Added Two-Factor Authentication (2FA) authenticator modal and account security',
            'Implemented instant photo attachment in live technician chat',
        ],
    },
    {
        version: 'v1.1.0',
        date: 'July 24, 2026',
        title: 'Real-Time Telemetry & Malayalam Localization',
        changes: [
            'Added Live GPS ETA tracking with push notification opt-in primer',
            'Upgraded rate card calculator with 18% GST breakdown and promo code coupons',
            'Introduced 30-day automatic digital warranty certificates',
        ],
    },
    {
        version: 'v1.0.0',
        date: 'June 10, 2026',
        title: 'Initial Production Launch (Kozhikode Zone)',
        changes: [
            'First public release covering Kozhikode, Vadakara, and Thamarassery taluks',
            'Verified government licensing onboarding pipeline for trade wiremen',
            'Full Supabase Auth, Razorpay UPI, and digital invoice generation',
        ],
    },
];

export default function ChangelogScreen() {
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Version History & Changelog</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple">Product Updates</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        What's New in Sheriyakam
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Track our continuous iterations, safety enhancements, and feature rollouts.
                    </Text>
                </View>

                {/* Release List */}
                <View style={styles.releasesList}>
                    {RELEASES.map((rel, idx) => (
                        <Card key={idx} variant="default" style={styles.releaseCard}>
                            <View style={styles.relHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <GitCommit size={18} color={colors.accent} />
                                    <Text style={[styles.relVer, { color: colors.textPrimary }]}>{rel.version}</Text>
                                </View>
                                <Badge variant={idx === 0 ? 'success' : 'neutral'} size="sm">
                                    {idx === 0 ? 'Latest' : rel.date}
                                </Badge>
                            </View>

                            <Text style={[styles.relTitle, { color: colors.textPrimary }]}>
                                {rel.title}
                            </Text>

                            <View style={styles.changesList}>
                                {rel.changes.map((ch, i) => (
                                    <View key={i} style={styles.changeItem}>
                                        <CheckCircle2 size={14} color="#10B981" style={{ marginTop: 2 }} />
                                        <Text style={[styles.changeText, { color: colors.textSecondary }]}>
                                            {ch}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    ))}
                </View>
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
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    releasesList: {
        gap: 14,
        marginVertical: 10,
    },
    releaseCard: {
        padding: 16,
        gap: 10,
    },
    relHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    relVer: {
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    relTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    changesList: {
        gap: 6,
        marginTop: 4,
    },
    changeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    changeText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
});
