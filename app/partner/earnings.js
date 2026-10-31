import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, TrendingUp, IndianRupee, Calendar, Download,
    CheckCircle, Clock, ChevronRight, Shield, CreditCard, Building,
    Zap, Receipt, Plus, AlertCircle, ArrowUpRight, DollarSign, Modal, X, TextInput
} from 'lucide-react-native';
import { Modal as RNModal, TextInput as RNTextInput } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK, requestMicroAdvance, getMicroAdvances, getPartnerInstantPayouts, updatePartnerUpiId } from '../../constants/partnerStore';
import { getBookings } from '../../constants/bookingStore';

export default function PartnerEarnings() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const [period, setPeriod] = useState('weekly');
    const [advanceModalVisible, setAdvanceModalVisible] = useState(false);
    const [advanceAmount, setAdvanceAmount] = useState('1000');
    const [advanceReason, setAdvanceReason] = useState('Emergency MCB & Wire Purchase at Local Hardware Store');
    const [advancesList, setAdvancesList] = useState(getMicroAdvances());
    const [usedCredit, setUsedCredit] = useState(partner.usedCredit || 0);
    const [upiModalVisible, setUpiModalVisible] = useState(false);
    const [upiInput, setUpiInput] = useState(partner.bankDetails?.upiId || 'shyam.electrician@oksbi');
    const [registeredUpi, setRegisteredUpi] = useState(partner.bankDetails?.upiId || 'shyam.electrician@oksbi');
    const [instantPayouts, setInstantPayouts] = useState(getPartnerInstantPayouts());

    const handleSaveUpi = () => {
        const res = updatePartnerUpiId(upiInput);
        if (res.success) {
            setRegisteredUpi(res.upiId);
            setUpiModalVisible(false);
            Alert.alert('✅ Payout UPI Updated', 'Your instant 85% payouts will now be automatically routed to: ' + res.upiId);
        } else {
            Alert.alert('Validation Error', res.message);
        }
    };

    const availableLimit = partner.availableCreditLimit || 2000;
    const remainingCredit = Math.max(0, availableLimit - usedCredit);

    const handleRequestAdvance = () => {
        const num = Number(advanceAmount);
        if (isNaN(num) || num <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid amount.');
            return;
        }
        if (num > remainingCredit) {
            Alert.alert('Limit Exceeded', `Requested ₹${num} exceeds available advance balance of ₹${remainingCredit}.`);
            return;
        }
        const res = requestMicroAdvance(num, advanceReason);
        if (res.success) {
            setAdvancesList(getMicroAdvances());
            setUsedCredit(prev => prev + num);
            setAdvanceModalVisible(false);
            Alert.alert(
                '⚡ Micro-Advance Dispatched Instantly!',
                `₹${num} has been transferred to your registered UPI (shyam.electrician@oksbi) for urgent material purchase. This will be automatically reconciled in Tuesday's weekly batch.`
            );
        } else {
            Alert.alert('Error', res.message);
        }
    }; // 'today', 'weekly', 'monthly'

    const allBookings = getBookings();
    const completedJobs = allBookings.filter(b => b.status === 'completed');

    const totalGross = completedJobs.reduce((sum, j) => sum + (j.finalPrice || j.price || 0), 0) + 4850;
    const platformShare = Math.round(totalGross * 0.15);
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
                    <Text style={styles.headerSub}>Transparent 85/15 Partner Split & Instant UPI Payout</Text>
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

                {/* Hero Net Payout Card with 4-Way Breakdown */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>TOTAL NET EARNINGS ({period.toUpperCase()})</Text>
                    <Text style={styles.heroAmount}>
                        ₹{period === 'today' ? '1,620' : period === 'weekly' ? (netPayout + 1850) : ((netPayout * 3.8) + 4200).toFixed(0)}
                    </Text>

                    <View style={styles.heroMetaRow}>
                        <View style={styles.heroMetaItem}>
                            <Text style={styles.heroMetaLabel}>Gross Service Labor</Text>
                            <Text style={styles.heroMetaVal}>₹{period === 'today' ? '1,380' : totalGross}</Text>
                        </View>
                        <View style={styles.heroDivider} />
                        <View style={styles.heroMetaItem}>
                            <Text style={styles.heroMetaLabel}>Platform Fee (15%)</Text>
                            <Text style={[styles.heroMetaVal, { color: COLORS.danger }]}>-₹{period === 'today' ? '140' : platformShare}</Text>
                        </View>
                        <View style={styles.heroDivider} />
                        <View style={styles.heroMetaItem}>
                            <Text style={[styles.heroMetaLabel, { color: COLORS.success }]}>100% Material Reimbursement</Text>
                            <Text style={[styles.heroMetaVal, { color: COLORS.success }]}>+₹{period === 'today' ? '380' : '1,850'}</Text>
                        </View>
                    </View>
                </View>

                {/* Instant Cash-Out & Micro-Advance Ledger Card */}
                <View style={styles.advanceCard}>
                    <View style={styles.advanceHeader}>
                        <View style={styles.advanceIconWrap}>
                            <Zap size={20} color={COLORS.gold} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.advanceCardTitle}>Instant Cash-Out & Micro-Advance</Text>
                            <Text style={styles.advanceCardSub}>Draw emergency cash for hardware materials against completed jobs</Text>
                        </View>
                    </View>

                    <View style={styles.advanceLimitRow}>
                        <View>
                            <Text style={styles.advanceLimitLabel}>AVAILABLE ADVANCE LIMIT</Text>
                            <Text style={styles.advanceLimitValue}>₹{remainingCredit} <Text style={{ fontSize: 12, color: COLORS.textTertiary }}>/ ₹{availableLimit}</Text></Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.drawAdvanceBtn, remainingCredit <= 0 && { opacity: 0.5 }]}
                            onPress={() => setAdvanceModalVisible(true)}
                            disabled={remainingCredit <= 0}
                        >
                            <Zap size={14} color="#000" />
                            <Text style={styles.drawAdvanceBtnText}>Draw Advance</Text>
                        </TouchableOpacity>
                    </View>

                    {advancesList.length > 0 && (
                        <View style={styles.recentAdvanceStrip}>
                            <Clock size={12} color={COLORS.textTertiary} />
                            <Text style={styles.recentAdvanceText}>
                                Last Draw: ₹{advancesList[0].amount} on {advancesList[0].requestedAt} • Auto-settles Tuesday
                            </Text>
                        </View>
                    )}
                </View>

                {/* Instant 85/15 UPI Payout Destination Card */}
                <View style={styles.bankCard}>
                    <View style={styles.bankHeader}>
                        <View style={[styles.bankIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <Zap size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={styles.bankName}>Instant 85/15 UPI Payout</Text>
                                <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                    <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '800' }}>85% YOUR SHARE</Text>
                                </View>
                            </View>
                            <Text style={styles.bankAccount}>UPI ID: {registeredUpi} • {partner.bankDetails?.bankName || 'State Bank of India'}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setUpiModalVisible(true)}
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        >
                            <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>Edit UPI</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.payoutScheduleStrip, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
                        <CheckCircle size={14} color="#10B981" />
                        <Text style={[styles.payoutScheduleText, { color: '#10B981' }]}>
                            Settlement Speed: <Text style={{ fontWeight: '800', color: '#10B981' }}>Instant (Transferred within 10s of OTP Completion)</Text>
                        </Text>
                    </View>
                </View>


                {/* Transaction Breakdown */}
                {/* Material & Spare Parts Reimbursement Ledger */}
                
                {/* Core Economic Model: 85/15 Split + ₹499 Minimum Floor */}
                <View style={styles.economicsExplainerCard}>
                    <View style={styles.economicsExplainerHeader}>
                        <Shield size={16} color={COLORS.accent} />
                        <Text style={styles.economicsExplainerTitle}>SHERIYAKAM 85/15 FAIR SPLIT & ₹499 FLOOR</Text>
                    </View>
                    <View style={styles.economicsPillRow}>
                        <View style={styles.economicsPill}>
                            <Text style={styles.economicsPillLabel}>Minimum Floor</Text>
                            <Text style={styles.economicsPillVal}>₹499</Text>
                        </View>
                        <View style={styles.economicsPill}>
                            <Text style={styles.economicsPillLabel}>Electrician Share</Text>
                            <Text style={[styles.economicsPillVal, { color: COLORS.success }]}>85%</Text>
                        </View>
                        <View style={styles.economicsPill}>
                            <Text style={styles.economicsPillLabel}>Platform Commission</Text>
                            <Text style={[styles.economicsPillVal, { color: '#60A5FA' }]}>15% (₹75 Min)</Text>
                        </View>
                        <View style={styles.economicsPill}>
                            <Text style={styles.economicsPillLabel}>Material Bills</Text>
                            <Text style={[styles.economicsPillVal, { color: COLORS.gold }]}>100% Pass-Through</Text>
                        </View>
                    </View>
                    <Text style={styles.economicsExplainerText}>
                        • <Text style={{ fontWeight: '800', color: '#fff' }}>The ₹499 Floor:</Text> Even small service calls generate a baseline ₹75 platform pool, funding your ₹5 Lakh insurance cover, customer support & live GPS dispatch.
                    </Text>
                    <Text style={styles.economicsExplainerText}>
                        • <Text style={{ fontWeight: '800', color: '#fff' }}>The 85/15 Split:</Text> On a ₹1,000 job, you take home ₹850. Zero commissions are deducted from your local supplier hardware receipts.
                    </Text>
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>MATERIAL & SPARE PARTS EXPENSE LEDGER</Text>
                    <View style={styles.passThroughBadge}>
                        <Text style={styles.passThroughBadgeText}>100% REIMBURSEMENT (0% FEE)</Text>
                    </View>
                </View>

                <View style={styles.materialReimburseCard}>
                    <View style={styles.materialReimburseRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.materialStoreName}>Malabar Electrical Hardware, Thalassery</Text>
                            <Text style={styles.materialStoreMeta}>Bill #ME-8841 • Havells 32A C-Curve MCB + 2m conduit</Text>
                            <Text style={styles.materialStoreDate}>Today, 03:15 PM • Job #b-active-1</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.materialAmount}>+₹380</Text>
                            <View style={styles.payoutStatusPillPending}>
                                <Text style={styles.payoutStatusPillTextPending}>In Tuesday Batch</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.materialReimburseRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 8 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.materialStoreName}>Kannur Power Electricals, Temple Gate</Text>
                            <Text style={styles.materialStoreMeta}>Bill #KP-1029 • 4 sq mm Finolex Wire (15m) + Copper Lugs</Text>
                            <Text style={styles.materialStoreDate}>18 Sep 2026 • Job #b-enroute-1</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.materialAmount}>+₹1,470</Text>
                            <View style={styles.payoutStatusPillSettled}>
                                <Text style={styles.payoutStatusPillTextSettled}>Settled</Text>
                            </View>
                        </View>
                    </View>
                </View>

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
                            <Text style={styles.txFeeBreakdown}>Billed ₹{tx.gross} • Electrician 85% (₹{tx.net}) • Platform 15% (₹{tx.fee})</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        
            {/* MICRO-ADVANCE CASH-OUT MODAL */}
            <RNModal
                visible={advanceModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setAdvanceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.advanceModalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Request Instant Micro-Advance</Text>
                                <Text style={styles.modalSub}>Auto-transferred to UPI: shyam.electrician@oksbi</Text>
                            </View>
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAdvanceModalVisible(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.advanceBalanceStrip}>
                            <Zap size={16} color={COLORS.gold} />
                            <Text style={styles.advanceBalanceText}>Available to Draw: ₹{remainingCredit}</Text>
                        </View>

                        <Text style={styles.inputFieldLabel}>Advance Amount (₹) *</Text>
                        <RNTextInput
                            style={styles.modalInput}
                            placeholder="e.g., 1000"
                            placeholderTextColor={COLORS.textTertiary}
                            value={advanceAmount}
                            onChangeText={setAdvanceAmount}
                            keyboardType="numeric"
                        />

                        {/* Quick Amount Chips */}
                        <View style={styles.quickChipsRow}>
                            {['500', '1000', '1500', '2000'].map(amt => (
                                <TouchableOpacity
                                    key={amt}
                                    style={[styles.quickChip, advanceAmount === amt && styles.quickChipActive]}
                                    onPress={() => setAdvanceAmount(amt)}
                                >
                                    <Text style={[styles.quickChipText, advanceAmount === amt && styles.quickChipTextActive]}>₹{amt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.inputFieldLabel, { marginTop: 12 }]}>Reason for Micro-Advance</Text>
                        <RNTextInput
                            style={styles.modalInput}
                            placeholder="e.g., Emergency MCB & Wire Purchase"
                            placeholderTextColor={COLORS.textTertiary}
                            value={advanceReason}
                            onChangeText={setAdvanceReason}
                        />

                        <TouchableOpacity style={styles.submitAdvanceBtn} onPress={handleRequestAdvance}>
                            <Zap size={18} color="#000" />
                            <Text style={styles.submitAdvanceBtnText}>Transfer ₹{advanceAmount || '0'} to UPI Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RNModal>

                    {/* EDIT UPI MODAL */}
            <RNModal
                visible={upiModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setUpiModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.advanceModalContent, { maxWidth: 400 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={styles.modalTitle}>Update Payout UPI ID</Text>
                            <TouchableOpacity onPress={() => setUpiModalVisible(false)}>
                                <X size={20} color={COLORS.textTertiary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 12 }}>
                            Your 85% earnings will be transferred instantly via IMPS/UPI to this account upon customer OTP verification.
                        </Text>
                        <Text style={styles.inputLabel}>Enter UPI ID (Google Pay / PhonePe / Paytm / Bank)</Text>
                        <RNTextInput
                            style={styles.modalTextInput}
                            placeholder="e.g. mobile@upi or name@oksbi"
                            placeholderTextColor={COLORS.textTertiary}
                            value={upiInput}
                            onChangeText={setUpiInput}
                            autoCapitalize="none"
                        />
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                            <TouchableOpacity
                                style={[styles.modalBtnCancel, { flex: 1 }]}
                                onPress={() => setUpiModalVisible(false)}
                            >
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtnSubmit, { flex: 1, backgroundColor: '#10B981' }]}
                                onPress={handleSaveUpi}
                            >
                                <Text style={[styles.modalBtnSubmitText, { color: '#000', fontWeight: '800' }]}>Save & Activate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </RNModal>
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

    /* Micro-Advance Styles */
    advanceCard: {
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.25)',
    },
    advanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    advanceIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    advanceCardTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    advanceCardSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    advanceLimitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 12,
        borderRadius: 10,
    },
    advanceLimitLabel: {
        color: COLORS.textTertiary,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    advanceLimitValue: {
        color: COLORS.gold,
        fontWeight: '900',
        fontSize: 20,
    },
    drawAdvanceBtn: {
        backgroundColor: COLORS.gold,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    drawAdvanceBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 12,
    },
    recentAdvanceStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(234, 179, 8, 0.15)',
    },
    recentAdvanceText: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },

    /* Material Reimbursement Styles */
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    passThroughBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    passThroughBadgeText: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 9,
    },
    materialReimburseCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    materialReimburseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    materialStoreName: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 13,
    },
    materialStoreMeta: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    materialStoreDate: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    materialAmount: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 15,
    },
    payoutStatusPillPending: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    payoutStatusPillTextPending: {
        color: COLORS.gold,
        fontSize: 9,
        fontWeight: '800',
    },
    payoutStatusPillSettled: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    payoutStatusPillTextSettled: {
        color: COLORS.success,
        fontSize: 9,
        fontWeight: '800',
    },

    /* Advance Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    advanceModalContent: {
        width: '94%',
        maxWidth: 440,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    modalTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 16,
    },
    modalSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    modalCloseBtn: {
        padding: 4,
    },
    advanceBalanceStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 14,
    },
    advanceBalanceText: {
        color: COLORS.gold,
        fontWeight: '800',
        fontSize: 12,
    },
    inputFieldLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
    },
    quickChipsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    quickChip: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quickChipActive: {
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        borderColor: COLORS.gold,
    },
    quickChipText: {
        color: COLORS.textSecondary,
        fontWeight: '700',
        fontSize: 12,
    },
    quickChipTextActive: {
        color: COLORS.gold,
    },
    submitAdvanceBtn: {
        backgroundColor: COLORS.gold,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 18,
    },
    submitAdvanceBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 13,
    },


    /* Economics Explainer Styles */
    economicsExplainerCard: {
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.25)',
    },
    economicsExplainerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    economicsExplainerTitle: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    economicsPillRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 10,
    },
    economicsPill: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    economicsPillLabel: {
        color: COLORS.textTertiary,
        fontSize: 8,
        fontWeight: '700',
        textAlign: 'center',
    },
    economicsPillVal: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 12,
        marginTop: 2,
    },
    economicsExplainerText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
    },

});
