import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, TrendingUp, IndianRupee, Calendar, Download,
    CheckCircle, Clock, ChevronRight, Shield, CreditCard, Building
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK } from '../../constants/partnerStore';
import { getBookings } from '../../constants/bookingStore';

export default function PartnerEarnings() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const [period, setPeriod] = useState('weekly'); // 'today', 'weekly', 'monthly'

    const allBookings = getBookings();
    const completedJobs = allBookings.filter(b => b.status === 'completed');

    const totalGross = completedJobs.reduce((sum, j) => sum + (j.finalPrice || j.price || 0), 0) + 4850;
    const platformShare = Math.round(totalGross * 0.10);
    const netPayout = totalGross - platformShare;

    const mockTransactions = [
        {
            id: 'tx-1',
            date: 'Today, 02:40 PM',
            service: 'Short Circuit & MCB Replacement',
            customer: 'K.V. Raghu',
            gross: 550,
            fee: 55,
            net: 495,
            status: 'Processing',
        },
        {
            id: 'tx-2',
            date: 'Yesterday, 11:15 AM',
            service: 'Ceiling Fan Rewinding & Regulator',
            customer: 'Sreelakshmi R.',
            gross: 450,
            fee: 45,
            net: 405,
            status: 'Settled',
        },
        {
            id: 'tx-3',
            date: '18 Sep, 04:30 PM',
            service: 'Split AC Deep Foam Cleaning',
            customer: 'Dr. Vivek Menon',
            gross: 1250,
            fee: 125,
            net: 1125,
            status: 'Settled',
        },
        {
            id: 'tx-4',
            date: '17 Sep, 09:20 AM',
            service: 'Main Earth Resistance Spike Installation',
            customer: 'Thalassery Club',
            gross: 1800,
            fee: 180,
            net: 1620,
            status: 'Settled',
        }
    ];

    const handleDownloadStatement = () => {
        Alert.alert(
            '📄 Statement Generated',
            'Your monthly earnings statement (PDF) has been prepared and sent to your registered email: ' + partner.email
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Earnings & Payouts</Text>
                    <Text style={styles.headerSub}>Transparent 90/10 Partner Split</Text>
                </View>
                <TouchableOpacity onPress={handleDownloadStatement} style={styles.downloadBtn}>
                    <Download size={18} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={styles.periodTabs}>
                    <TouchableOpacity
                        style={[styles.periodTab, period === 'today' && styles.periodTabActive]}
                        onPress={() => setPeriod('today')}
                    >
                        <Text style={[styles.periodTabText, period === 'today' && styles.periodTabTextActive]}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodTab, period === 'weekly' && styles.periodTabActive]}
                        onPress={() => setPeriod('weekly')}
                    >
                        <Text style={[styles.periodTabText, period === 'weekly' && styles.periodTabTextActive]}>This Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodTab, period === 'monthly' && styles.periodTabActive]}
                        onPress={() => setPeriod('monthly')}
                    >
                        <Text style={[styles.periodTabText, period === 'monthly' && styles.periodTabTextActive]}>This Month</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Net Payout Card */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>TOTAL NET EARNINGS ({period.toUpperCase()})</Text>
                    <Text style={styles.heroAmount}>
                        ₹{period === 'today' ? '1,240' : period === 'weekly' ? netPayout : (netPayout * 3.8).toFixed(0)}
                    </Text>
                    <View style={styles.heroMetaRow}>
                        <View style={styles.heroMetaItem}>
                            <Text style={styles.heroMetaLabel}>Gross Billed</Text>
                            <Text style={styles.heroMetaVal}>₹{period === 'today' ? '1,380' : totalGross}</Text>
                        </View>
                        <View style={styles.heroDivider} />
                        <View style={styles.heroMetaItem}>
                            <Text style={styles.heroMetaLabel}>Platform Fee (10%)</Text>
                            <Text style={[styles.heroMetaVal, { color: COLORS.danger }]}>-₹{period === 'today' ? '140' : platformShare}</Text>
                        </View>
                    </View>
                </View>

                {/* Bank Account Payout Schedule Card */}
                <View style={styles.bankCard}>
                    <View style={styles.bankHeader}>
                        <View style={styles.bankIconWrap}>
                            <Building size={20} color={COLORS.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bankName}>{partner.bankDetails?.bankName || 'State Bank of India'}</Text>
                            <Text style={styles.bankAccount}>A/C: {partner.bankDetails?.accountNumber || '•••• 4821'} • IFSC: {partner.bankDetails?.ifsc || 'SBIN0070123'}</Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <CheckCircle size={12} color={COLORS.success} />
                            <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                        </View>
                    </View>
                    <View style={styles.payoutScheduleStrip}>
                        <Clock size={14} color={COLORS.gold} />
                        <Text style={styles.payoutScheduleText}>
                            Next Auto-Settlement: <Text style={{ fontWeight: '800', color: COLORS.gold }}>Tuesday (Weekly Batch)</Text>
                        </Text>
                    </View>
                </View>

                {/* Transaction Breakdown */}
                <Text style={styles.sectionTitle}>RECENT SERVICE PAYOUTS</Text>
                {mockTransactions.map(tx => (
                    <View key={tx.id} style={styles.txCard}>
                        <View style={styles.txTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.txService}>{tx.service}</Text>
                                <Text style={styles.txCustomer}>{tx.customer} • {tx.date}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.txNet}>+₹{tx.net}</Text>
                                <View style={[
                                    styles.txStatusBadge,
                                    { backgroundColor: tx.status === 'Settled' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)' }
                                ]}>
                                    <Text style={[
                                        styles.txStatusText,
                                        { color: tx.status === 'Settled' ? COLORS.success : COLORS.gold }
                                    ]}>
                                        {tx.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.txBottom}>
                            <Text style={styles.txFeeBreakdown}>Billed ₹{tx.gross} • Platform fee ₹{tx.fee}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        gap: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    headerSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    downloadBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    periodTabs: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodTabActive: {
        backgroundColor: COLORS.accent,
    },
    periodTabText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 12,
    },
    periodTabTextActive: {
        color: '#fff',
        fontWeight: '800',
    },
    heroCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        marginBottom: 16,
    },
    heroLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    heroAmount: {
        color: COLORS.success,
        fontSize: 36,
        fontWeight: '900',
        marginVertical: 6,
    },
    heroMetaRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        paddingTop: 12,
        marginTop: 6,
    },
    heroMetaItem: {
        flex: 1,
        alignItems: 'center',
    },
    heroDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    heroMetaLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    heroMetaVal: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
        marginTop: 2,
    },
    bankCard: {
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.25)',
        marginBottom: 20,
    },
    bankHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    bankIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    bankAccount: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    verifiedBadgeText: {
        color: COLORS.success,
        fontWeight: '800',
        fontSize: 9,
    },
    payoutScheduleStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(79, 70, 229, 0.15)',
        paddingTop: 10,
    },
    payoutScheduleText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    sectionTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 12,
    },
    txCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
    },
    txTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    txService: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 14,
    },
    txCustomer: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    txNet: {
        color: COLORS.success,
        fontWeight: '800',
        fontSize: 15,
    },
    txStatusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    txStatusText: {
        fontSize: 9,
        fontWeight: '800',
    },
    txBottom: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.04)',
        paddingTop: 8,
    },
    txFeeBreakdown: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
});
