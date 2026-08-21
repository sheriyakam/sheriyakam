import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Clock, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Scale, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const CANCELLATION_MATRIX = [
    {
        timing: 'More than 2 Hours before Slot',
        customerCharge: '₹0 (100% Free)',
        technicianPayout: '₹0',
        refundStatus: 'Instant 100% UPI / Source Refund (within 2 hours)',
        badgeVariant: 'success',
        isHighlight: false,
    },
    {
        timing: 'Within 2 Hours / In Transit',
        customerCharge: '₹50 (Late Dispatch Fee)',
        technicianPayout: '₹50 (Transit Fuel Allowance)',
        refundStatus: 'Balance amount refunded within 2 hours',
        badgeVariant: 'info',
        isHighlight: false,
    },
    {
        timing: 'At Doorstep Arrival',
        customerCharge: '₹100 (Visiting Fee)',
        technicianPayout: '₹100 (Full Doorstep Compensation)',
        refundStatus: 'Remaining service fee refunded within 2 hours',
        badgeVariant: 'gold',
        isHighlight: true,
    },
];

export default function CancellationPolicyScreen() {
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
                    Cancellation & Refund Policy
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple" size="md">Fair Consumer & Gig Worker Policy</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Transparent, Fair & Zero-Hidden Fee Cancellation
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        In accordance with the Consumer Protection (E-Commerce) Rules, 2020. Balancing consumer flexibility with fair fuel and travel compensation for independent Kerala electricians.
                    </Text>
                </View>

                {/* Timing Matrix Table */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    CANCELLATION & TRAVEL ALLOWANCE SCHEDULE
                </Text>

                <View style={styles.matrixList}>
                    {CANCELLATION_MATRIX.map((item, idx) => (
                        <Card
                            key={idx}
                            variant={item.isHighlight ? 'elevated' : 'default'}
                            style={[
                                styles.matrixCard,
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

                            <View style={styles.matrixRow}>
                                <Text style={[styles.matrixLabel, { color: colors.textTertiary }]}>Electrician Fuel Compensation:</Text>
                                <Text style={[styles.matrixVal, { color: '#10B981', fontWeight: '700' }]}>{item.technicianPayout}</Text>
                            </View>

                            <View style={styles.matrixRow}>
                                <Text style={[styles.matrixLabel, { color: colors.textTertiary }]}>Refund Timeline:</Text>
                                <Text style={[styles.matrixVal, { color: colors.textSecondary }]}>{item.refundStatus}</Text>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Consumer Protection Disclosures */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    STATUTORY REFUND GUARANTEES
                </Text>

                <Card variant="default" style={styles.guaranteeCard}>
                    <View style={styles.guaranteeItem}>
                        <CheckCircle2 size={18} color="#10B981" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                2-Hour Instant UPI / Source Refund
                            </Text>
                            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                All eligible refund amounts are processed back to your original payment method (GPay, PhonePe, Card, Bank) within 2 hours.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.guaranteeItem}>
                        <ShieldCheck size={18} color="#3B82F6" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                No Cancellation Fee on Technician Delays
                            </Text>
                            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                If your assigned electrician is delayed past the 30-minute booking window without prior communication, you are entitled to cancel with a 100% full refund and zero deductions.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.guaranteeItem}>
                        <RefreshCw size={18} color="#F59E0B" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                30-Day Free Rework Policy
                            </Text>
                            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                If a diagnosed electrical fault recurs within 30 days of completion, our master technician will revisit and fix the issue completely free of charge.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Dispute Escalation */}
                <Card variant="default" style={styles.escalateCard}>
                    <Scale size={20} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.escalateTitle, { color: colors.textPrimary }]}>
                            Have a dispute regarding a cancellation charge?
                        </Text>
                        <Text style={[styles.escalateSub, { color: colors.textSecondary }]}>
                            Submit a review request directly to our Resident Grievance Officer.
                        </Text>
                    </View>
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={() => router.push('/grievance')}
                    >
                        File Dispute
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
    matrixList: {
        gap: 10,
    },
    matrixCard: {
        padding: 14,
        gap: 8,
    },
    matrixTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    matrixTiming: {
        fontSize: 14,
        fontWeight: '700',
    },
    matrixRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    matrixLabel: {
        fontSize: 12,
    },
    matrixVal: {
        fontSize: 12,
    },
    guaranteeCard: {
        padding: 16,
        gap: 14,
    },
    guaranteeItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    itemDesc: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 2,
    },
    escalateCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 18,
    },
    escalateTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    escalateSub: {
        fontSize: 11,
        marginTop: 1,
    },
});
