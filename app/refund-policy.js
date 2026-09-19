import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Clock, Award, HelpCircle, Check, DollarSign } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function RefundPolicyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>Refund & 30-Day Warranty Policy | Sheriyakam</title>
                <meta name="description" content="Sheriyakam Refund & Warranty Policy: Pay after work is done, 30-day free rework warranty, zero fees for late technician arrivals, and 2-hour refund processing." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/refund-policy" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { 
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0' 
            }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Refund & Warranty Policy</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>30-Day Free Rework • Zero-Risk Pay After Work</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/cancellation-policy')} style={styles.hubBtn}>
                    <Badge variant="info" size="sm">Cancellation</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <Card variant="elevated" style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <Badge variant="success" size="md">100% Risk-Free Guarantee</Badge>
                    <Text style={styles.heroTitle}>
                        Transparent Refunds & 30-Day Rework Warranty
                    </Text>
                    <Text style={styles.heroSub}>
                        Because you only pay <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>after</Text> the electrical work is finished and tested, your financial risk on Sheriyakam is virtually zero. Here is exactly what happens in every scenario:
                    </Text>
                </Card>

                {/* Scenario 1: 30-Day Warranty */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: '#10B98144' }]}>
                    <View style={styles.sectionHeader}>
                        <ShieldCheck size={22} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            1. 30-Day Free Rework Warranty
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        If any electrical fault, socket wiring, fan capacitor, or breaker repair recurs within 30 calendar days of service:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Free Supervisor Visit</Text>: A senior KSELB licensed supervisor will revisit your premises at ₹0 visit fee.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Free Labor Rework</Text>: We fix the workmanship defect completely free of charge.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Full Labor Refund</Text>: If the defect cannot be fixed due to our error, 100% of the labor fee is refunded to your UPI / bank within 2 hours.
                        </Text>
                    </View>
                </Card>

                {/* Scenario 2: Electrician Delays (>90 mins) */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Clock size={22} color="#F59E0B" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            2. Electrician Delay or No-Show Policy
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We value your time. If your assigned electrician does not arrive within the 90-minute doorstep window without prior communication:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Zero Cancellation Charges</Text>: You can cancel immediately with ₹0 penalty.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Priority Re-dispatch</Text>: If you choose to keep the booking, we fast-track a standby master electrician to your home with a ₹50 discount credit applied to your final bill.
                        </Text>
                    </View>
                </Card>

                {/* Scenario 3: Completed Work Quality Disputes */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <RefreshCw size={22} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            3. Work Quality Disputes & Online Payment Refunds
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        If you paid online via UPI/Card and later identify a quality defect or incorrect billing item:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Fast 2-Hour Refund SLA</Text>: Once a supervisor reviews the job photos and approves the claim, the refund is initiated within 2 hours.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Bank Credit Timing</Text>: UPI and Net Banking refunds reflect within 2–4 hours; credit/debit card refunds reflect in 2–3 business days depending on your bank.
                        </Text>
                    </View>
                </Card>

                {/* How to Claim */}
                <Card variant="outline" style={[styles.claimCard, { borderColor: colors.accent }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <HelpCircle size={20} color={colors.accent} />
                        <Text style={[styles.claimTitle, { color: colors.textPrimary }]}>
                            How to Request a Warranty Rework or Refund
                        </Text>
                    </View>
                    <Text style={[styles.claimText, { color: colors.textSecondary }]}>
                        1. Open the Sheriyakam app and go to <Text style={{ fontWeight: '700' }}>My Bookings</Text>.
                        {'\n'}2. Select the completed job and tap <Text style={{ fontWeight: '700' }}>"Request 30-Day Free Rework"</Text>.
                        {'\n'}3. Or call our customer helpline at <Text style={{ fontWeight: '700', color: colors.accent }}>+91 495 280 0000</Text> (8:00 AM – 9:00 PM).
                    </Text>
                    <Button variant="primary" onPress={() => router.push('/bookings')}>
                        View My Bookings
                    </Button>
                </Card>

                <View style={{ height: 40 }} />
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    headerSub: {
        fontSize: 11,
    },
    hubBtn: {
        padding: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        gap: 14,
        maxWidth: 960,
        width: '100%',
        alignSelf: 'center',
    },
    heroCard: {
        padding: 20,
        borderRadius: 18,
        gap: 12,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    heroSub: {
        color: '#CBD5E1',
        fontSize: 13.5,
        lineHeight: 20,
    },
    sectionCard: {
        padding: 18,
        borderRadius: 16,
        gap: 10,
        borderWidth: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15.5,
        fontWeight: '800',
        flex: 1,
    },
    sectionText: {
        fontSize: 13,
        lineHeight: 20,
    },
    bulletList: {
        gap: 8,
    },
    bulletPoint: {
        fontSize: 13,
        lineHeight: 20,
    },
    claimCard: {
        padding: 18,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1.5,
    },
    claimTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    claimText: {
        fontSize: 13,
        lineHeight: 20,
    },
});
