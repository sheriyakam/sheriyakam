import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Clock, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Scale, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const CANCELLATION_MATRIX = [
    {
        timing: 'Before Electrician Starts Transit (or >30 Mins Before Slot)',
        customerCharge: '₹0 (100% Free)',
        technicianPayout: '₹0',
        explanation: 'Cancel anytime before the wireman begins traveling with zero cancellation fees.',
        badgeVariant: 'success',
        isHighlight: false,
    },
    {
        timing: 'While Electrician is In Transit',
        customerCharge: '₹50 (Transit Fuel Allowance)',
        technicianPayout: '₹50 (Direct to Wireman)',
        explanation: 'A nominal travel allowance to cover fuel costs if the technician has already departed.',
        badgeVariant: 'info',
        isHighlight: false,
    },
    {
        timing: 'At Doorstep Arrival (Customer Cancels on Site)',
        customerCharge: '₹100 (Visiting Fee)',
        technicianPayout: '₹100 (Doorstep Compensation)',
        explanation: 'Covers physical doorstep arrival and multimeter fault testing time.',
        badgeVariant: 'gold',
        isHighlight: true,
    },
    {
        timing: 'Electrician Delayed (>90 Mins Arrival Window)',
        customerCharge: '₹0 (100% Free)',
        technicianPayout: '₹0',
        explanation: 'If our technician is delayed without communication, cancel for free with zero fee + ₹50 credit.',
        badgeVariant: 'success',
        isHighlight: false,
    },
];

export default function CancellationPolicyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>Cancellation & Rescheduling Policy | Sheriyakam</title>
                <meta name="description" content="Sheriyakam Cancellation Policy: Free cancellation before dispatch, fair gig worker travel allowances, and zero cancellation fees for technician delays." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/cancellation-policy" />
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
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cancellation Policy</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Fair Consumer & Gig Worker Transparency</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/refund-policy')} style={styles.hubBtn}>
                    <Badge variant="info" size="sm">Refunds</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <Card variant="elevated" style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <Badge variant="purple" size="md">Fair Consumer & Technician Protection</Badge>
                    <Text style={styles.heroTitle}>
                        Simple, Fair & Zero-Hidden Fee Cancellation
                    </Text>
                    <Text style={styles.heroSub}>
                        We believe in complete fairness: customers enjoy free cancellation before dispatch, while independent Kerala wiremen receive modest fuel allowances if canceled after completing travel.
                    </Text>
                </Card>

                {/* Timing Matrix Table */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Cancellation & Travel Allowance Schedule
                    </Text>

                    <View style={styles.matrixList}>
                        {CANCELLATION_MATRIX.map((item, idx) => (
                            <Card
                                key={idx}
                                variant={item.isHighlight ? 'elevated' : 'default'}
                                style={[
                                    styles.matrixCard,
                                    { backgroundColor: isDark ? '#18181B' : '#FFFFFF' },
                                    item.isHighlight && {
                                        borderColor: colors.accent,
                                        borderWidth: 1.5,
                                    }
                                ]}
                            >
                                <View style={styles.matrixTop}>
                                    <Text style={[styles.matrixTiming, { color: colors.textPrimary }]}>
                                        {item.timing}
                                    </Text>
                                    <Badge variant={item.badgeVariant} size="sm">
                                        {item.customerCharge}
                                    </Badge>
                                </View>

                                <Text style={[styles.matrixDesc, { color: colors.textSecondary }]}>
                                    {item.explanation}
                                </Text>

                                <View style={styles.matrixBottom}>
                                    <Text style={[styles.matrixLabel, { color: colors.textTertiary }]}>Wireman Fuel Allowance:</Text>
                                    <Text style={[styles.matrixVal, { color: '#10B981', fontWeight: '700' }]}>{item.technicianPayout}</Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>

                {/* Rescheduling Rules */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Clock size={20} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Rescheduling Your Booking
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Need to change your service time? Rescheduling on Sheriyakam is 100% free:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Free Anytime Reschedule</Text>: Pick a new date or time slot directly in the app under My Bookings.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>No Penalty Fees</Text>: Your preferred service and itemized cart remain safely preserved.
                        </Text>
                    </View>
                </Card>

                {/* Dispute Escalation */}
                <Card variant="default" style={[styles.escalateCard, { backgroundColor: isDark ? '#18181B' : '#EFF6FF', borderColor: isDark ? '#27272A' : '#BFDBFE' }]}>
                    <Scale size={22} color={colors.accent} />
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.escalateTitle, { color: colors.textPrimary }]}>
                            Have a dispute regarding a cancellation charge?
                        </Text>
                        <Text style={[styles.escalateSub, { color: colors.textSecondary }]}>
                            Our Resident Grievance Officer reviews all disputed allowances within 24 hours.
                        </Text>
                    </View>
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => router.push('/grievance')}
                    >
                        Grievance Desk
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
    sectionWrap: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 15.5,
        fontWeight: '800',
    },
    matrixList: {
        gap: 10,
    },
    matrixCard: {
        padding: 16,
        borderRadius: 14,
        gap: 8,
        borderWidth: 1,
    },
    matrixTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    matrixTiming: {
        fontSize: 14,
        fontWeight: '800',
        flex: 1,
    },
    matrixDesc: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    matrixBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
    matrixLabel: {
        fontSize: 11.5,
    },
    matrixVal: {
        fontSize: 12,
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
    escalateCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 6,
    },
    escalateTitle: {
        fontSize: 13.5,
        fontWeight: '800',
    },
    escalateSub: {
        fontSize: 11.5,
        lineHeight: 16,
    },
});
