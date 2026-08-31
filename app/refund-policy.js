import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Clock, Award, HelpCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const REFUND_TIERS = [
    {
        title: '30-Day Free Rework Warranty',
        desc: 'If any electrical wiring, switchboard fix, or appliance installation exhibits a fault within 30 days of service completion, a senior supervisor inspects and fixes it at ₹0 cost.',
        badge: 'Zero Cost Fix',
        badgeVariant: 'success',
    },
    {
        title: 'Technician No-Show or Late Cancellation (>60 Min)',
        desc: 'If an assigned technician fails to arrive within 60 minutes of the confirmed booking slot without prior notice, 100% of advance charges are refunded instantly to your original payment source.',
        badge: 'Instant Refund',
        badgeVariant: 'info',
    },
    {
        title: 'Pre-Work Cancellation (>2 Hours)',
        desc: 'Cancel anytime up to 2 hours before your scheduled arrival time for an immediate, no-questions-asked 100% refund.',
        badge: '100% Free',
        badgeVariant: 'gold',
    },
    {
        title: 'Material Damage Protection (₹5,00,000 Cover)',
        desc: 'In the rare event of accidental equipment damage caused during service execution, our third-party domestic protection policy covers up to ₹5,00,000 in direct claims.',
        badge: 'Covered',
        badgeVariant: 'success',
    },
];

export default function RefundPolicyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Refund & Warranty Policy
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">100% Customer Protection</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Clear, Fair Refunds & 30-Day Guarantee
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Every booking on Sheriyakam is backed by verified wireman licensing, milestone-locked escrow, and direct refund processing within 2 hours.
                    </Text>
                </View>

                {/* Refund Tiers Grid */}
                <View style={styles.tierList}>
                    {REFUND_TIERS.map((tier, idx) => (
                        <Card key={idx} variant="elevated" style={styles.tierCard}>
                            <View style={styles.tierHeader}>
                                <Text style={[styles.tierTitle, { color: colors.textPrimary }]}>
                                    {tier.title}
                                </Text>
                                <Badge variant={tier.badgeVariant}>{tier.badge}</Badge>
                            </View>
                            <Text style={[styles.tierDesc, { color: colors.textSecondary }]}>
                                {tier.desc}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Refund Method & Timeline */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Refund Processing & SLA</Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        • <Text style={{ fontWeight: '700' }}>UPI / Net Banking / Cards:</Text> Initiated within 2 hours of claim approval; credited to your bank account within 2–4 business days depending on your bank.
                        {'\n'}• <Text style={{ fontWeight: '700' }}>Dispute Escrow Resolution:</Text> In cases of unresolved service disputes, our grievance team reviews technician job logs, photos, and customer feedback within 24 hours.
                    </Text>
                </View>

                {/* How to Claim */}
                <Card variant="outline" style={styles.claimCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <HelpCircle size={20} color={colors.accent} />
                        <Text style={[styles.claimTitle, { color: colors.textPrimary }]}>
                            How to Request a Refund or Free Rework
                        </Text>
                    </View>
                    <Text style={[styles.claimText, { color: colors.textSecondary }]}>
                        Open your active booking in the Sheriyakam app, select "Need Help / Dispute", or email refunds@sheriyakam.com with your Booking ID and description.
                    </Text>
                    <Button variant="primary" onPress={() => router.push('/bookings')}>
                        View My Bookings
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
        paddingBottom: 60,
        maxWidth: 880,
        width: '100%',
        marginHorizontal: 'auto',
        alignSelf: 'center',
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
        maxWidth: 520,
    },
    tierList: {
        gap: 12,
        marginVertical: 16,
    },
    tierCard: {
        padding: 18,
        gap: 8,
    },
    tierHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    tierTitle: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    tierDesc: {
        fontSize: 13,
        lineHeight: 19,
    },
    section: {
        marginBottom: 20,
        gap: 6,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    sectionText: {
        fontSize: 13,
        lineHeight: 20,
    },
    claimCard: {
        padding: 18,
        gap: 10,
        marginTop: 10,
    },
    claimTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    claimText: {
        fontSize: 12.5,
        lineHeight: 18,
    },
});
