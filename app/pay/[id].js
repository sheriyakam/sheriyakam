import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    ActivityIndicator, Platform, Alert, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ShieldCheck, ArrowLeft, CheckCircle2, QrCode, CreditCard,
    Banknote, FileText, ChevronRight, Zap, Info, Phone,
    Clock, AlertTriangle, Download, ExternalLink, Sparkles
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    getBookingById, recordOnlinePayment, recordCashPayment,
    bookingEvents, getBookings
} from '../../constants/bookingStore';
import { openRazorpayCheckout } from '../../services/razorpayService';

export default function CustomerPaymentScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const bookingId = params.id || 'b-active-1';

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [cashModalVisible, setCashModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('online'); // 'online' | 'cash'

    // Load booking and subscribe to store changes
    useEffect(() => {
        const load = () => {
            const found = getBookingById(bookingId) || getBookings()[0];
            setBooking(found);
            setLoading(false);
        };
        load();

        const handleChange = () => load();
        bookingEvents.on('change', handleChange);
        return () => bookingEvents.off('change', handleChange);
    }, [bookingId]);

    if (loading || !booking) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loadingText}>Loading post-service bill...</Text>
            </SafeAreaView>
        );
    }

    // Calculations
    const basePrice = booking.price || 499;
    const extraHours = Math.max(0, (booking.hoursWorked || 1) - 1);
    const extraHoursFare = extraHours * 100;
    const spareParts = booking.sparePartsUsed || [];
    const partsCost = booking.materialCost || spareParts.reduce((sum, p) => sum + ((p.rate || 0) * (p.quantity || 1)), 0);
    const subtotal = basePrice + extraHoursFare + partsCost;
    const cgst = Number((subtotal * 0.09).toFixed(2));
    const sgst = Number((subtotal * 0.09).toFixed(2));
    const totalTax = Number((cgst + sgst).toFixed(2));
    const grandTotal = booking.finalPrice || Math.round(subtotal + totalTax);

    const isPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'paid_online' || booking.paymentStatus === 'paid_cash';

    // Handler: Online Razorpay Checkout
    const handleOnlinePayment = () => {
        setProcessingPayment(true);
        openRazorpayCheckout({
            bookingId: booking.id,
            amountRupees: grandTotal,
            customerName: booking.customerName || 'Valued Customer',
            customerPhone: booking.customerPhone || '+91 94471 28901',
            serviceName: booking.service || 'Electrical Repair Service',
            onSuccess: (paymentDetails) => {
                setProcessingPayment(false);
                recordOnlinePayment(booking.id, paymentDetails);
                if (Platform.OS !== 'web') {
                    Alert.alert('🎉 Payment Received!', `₹${grandTotal} settled successfully via UPI / Razorpay.`);
                }
            },
            onDismiss: (reason) => {
                setProcessingPayment(false);
                console.log('[Payment Dismissed]', reason);
            }
        });
    };

    // Handler: Cash on Doorstep
    const handleConfirmCashPayment = () => {
        recordCashPayment(booking.id);
        setCashModalVisible(false);
        if (Platform.OS !== 'web') {
            Alert.alert('✅ Cash Payment Recorded', `Technician has confirmed receipt of ₹${grandTotal} cash.`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Post-Service Settlement</Text>
                    <Text style={styles.headerSub}>Booking ID #{booking.id} • Thalassery Hub</Text>
                </View>
                <View style={[
                    styles.badgeStatus,
                    { backgroundColor: isPaid ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)' }
                ]}>
                    <Text style={[
                        styles.badgeStatusText,
                        { color: isPaid ? COLORS.success : COLORS.gold }
                    ]}>
                        {isPaid ? 'PAID SAFELY' : 'PAY AFTER WORK'}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Pay Safely Promise Banner */}
                <View style={styles.guaranteeBanner}>
                    <ShieldCheck size={22} color={COLORS.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.guaranteeTitle}>Pay Safely — Only After Work Is Done</Text>
                        <Text style={styles.guaranteeSub}>
                            Work is verified by KSELB standards. Zero upfront fees were charged at booking time.
                        </Text>
                    </View>
                </View>

                {/* Technician Profile Card */}
                <View style={styles.techCard}>
                    <View style={styles.techAvatar}>
                        <Zap size={22} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.techName}>{booking.partnerName || 'Shyam Prasad'}</Text>
                        <Text style={styles.techMeta}>
                            KSELB License: <Text style={{ color: COLORS.accent, fontWeight: '700' }}>#{booking.kselbLicense || 'KSELB/WB-4102/KL'}</Text>
                        </Text>
                        <Text style={styles.techMeta}>
                            Service: <Text style={{ color: COLORS.textPrimary }}>{booking.service}</Text>
                        </Text>
                    </View>
                    <View style={styles.verifiedPill}>
                        <CheckCircle2 size={14} color={COLORS.success} />
                        <Text style={styles.verifiedPillText}>Verified</Text>
                    </View>
                </View>

                {/* If already paid */}
                {isPaid ? (
                    <View style={styles.paidSuccessCard}>
                        <CheckCircle2 size={48} color={COLORS.success} />
                        <Text style={styles.paidSuccessTitle}>Payment Completed Successfully</Text>
                        <Text style={styles.paidSuccessSub}>
                            ₹{grandTotal} paid via {booking.paymentMethod || 'UPI / Razorpay'}.
                            {booking.razorpayPaymentId ? ` (Ref: ${booking.razorpayPaymentId})` : ''}
                        </Text>

                        <View style={styles.paidActions}>
                            <TouchableOpacity
                                style={styles.invoiceBtn}
                                onPress={() => router.push(`/invoice/${booking.id}`)}
                            >
                                <FileText size={18} color="#fff" />
                                <Text style={styles.invoiceBtnText}>View & Download Tax Invoice</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.homeBtn}
                                onPress={() => router.push('/')}
                            >
                                <Text style={styles.homeBtnText}>Return to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Itemized Bill Card */}
                        <View style={styles.billCard}>
                            <View style={styles.billHeader}>
                                <FileText size={18} color={COLORS.accent} />
                                <Text style={styles.billTitle}>ITEMIZED BILL BREAKDOWN</Text>
                            </View>

                            {/* Base Fare */}
                            <View style={styles.billRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.billItemTitle}>Base Service & Diagnosis</Text>
                                    <Text style={styles.billItemSub}>Covers first hour labor & travel (SAC: 9987)</Text>
                                </View>
                                <Text style={styles.billItemAmt}>₹{basePrice}</Text>
                            </View>

                            {/* Extra Hours if logged */}
                            {extraHours > 0 && (
                                <View style={styles.billRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.billItemTitle}>Additional Labor</Text>
                                        <Text style={styles.billItemSub}>{extraHours} extra hour(s) @ ₹100/hr</Text>
                                    </View>
                                    <Text style={styles.billItemAmt}>+₹{extraHoursFare}</Text>
                                </View>
                            )}

                            {/* Genuine Spare Parts */}
                            {spareParts.length > 0 ? (
                                <View style={styles.partsSection}>
                                    <Text style={styles.partsSectionTitle}>GENUINE SPARE PARTS USED (HSN 8536/8544)</Text>
                                    {spareParts.map((part, idx) => (
                                        <View key={idx} style={styles.partItemRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.partItemName}>{part.name}</Text>
                                                <Text style={styles.partItemSub}>
                                                    Qty: {part.quantity || 1} • {part.isiMark || 'ISI Mark'} • {part.manufacturer}
                                                </Text>
                                            </View>
                                            <Text style={styles.partItemPrice}>
                                                ₹{(part.rate || 0) * (part.quantity || 1)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ) : partsCost > 0 ? (
                                <View style={styles.billRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.billItemTitle}>Approved Spare Parts</Text>
                                        <Text style={styles.billItemSub}>Technician logged replacement parts</Text>
                                    </View>
                                    <Text style={styles.billItemAmt}>+₹{partsCost}</Text>
                                </View>
                            ) : null}

                            {/* Tax Breakdown */}
                            <View style={styles.taxBox}>
                                <View style={styles.taxRow}>
                                    <Text style={styles.taxLabel}>Subtotal</Text>
                                    <Text style={styles.taxVal}>₹{subtotal}</Text>
                                </View>
                                <View style={styles.taxRow}>
                                    <Text style={styles.taxLabel}>Kerala GST (9% CGST + 9% SGST)</Text>
                                    <Text style={styles.taxVal}>₹{totalTax}</Text>
                                </View>
                            </View>

                            {/* Grand Total */}
                            <View style={styles.grandTotalRow}>
                                <View>
                                    <Text style={styles.grandTotalLabel}>TOTAL AMOUNT DUE</Text>
                                    <Text style={styles.grandTotalSub}>Inclusive of all taxes & insurance</Text>
                                </View>
                                <Text style={styles.grandTotalVal}>₹{grandTotal}</Text>
                            </View>
                        </View>

                        {/* Payment Method Selector */}
                        <View style={styles.methodCard}>
                            <Text style={styles.methodCardTitle}>CHOOSE PAYMENT METHOD</Text>

                            <View style={styles.methodTabs}>
                                <TouchableOpacity
                                    style={[styles.tabButton, selectedTab === 'online' && styles.tabButtonActive]}
                                    onPress={() => setSelectedTab('online')}
                                >
                                    <CreditCard size={18} color={selectedTab === 'online' ? '#fff' : COLORS.textTertiary} />
                                    <Text style={[styles.tabButtonText, selectedTab === 'online' && styles.tabButtonTextActive]}>
                                        Pay Online (UPI / Card)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tabButton, selectedTab === 'cash' && styles.tabButtonActive]}
                                    onPress={() => setSelectedTab('cash')}
                                >
                                    <Banknote size={18} color={selectedTab === 'cash' ? '#fff' : COLORS.textTertiary} />
                                    <Text style={[styles.tabButtonText, selectedTab === 'cash' && styles.tabButtonTextActive]}>
                                        Cash on Doorstep
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {selectedTab === 'online' ? (
                                <View style={styles.onlineOptionBox}>
                                    <View style={styles.onlineLogosRow}>
                                        <View style={styles.logoPill}>
                                            <Text style={styles.logoPillText}>Google Pay</Text>
                                        </View>
                                        <View style={styles.logoPill}>
                                            <Text style={styles.logoPillText}>PhonePe</Text>
                                        </View>
                                        <View style={styles.logoPill}>
                                            <Text style={styles.logoPillText}>Paytm</Text>
                                        </View>
                                        <View style={styles.logoPill}>
                                            <Text style={styles.logoPillText}>Any Cards</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.onlineDescription}>
                                        Instant bank verification via Razorpay hosted checkout. 256-bit SSL encrypted.
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.payNowBtn}
                                        onPress={handleOnlinePayment}
                                        disabled={processingPayment}
                                    >
                                        {processingPayment ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <>
                                                <QrCode size={20} color="#fff" />
                                                <Text style={styles.payNowBtnText}>Pay ₹{grandTotal} with Razorpay / UPI</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.cashOptionBox}>
                                    <Banknote size={36} color={COLORS.gold} />
                                    <Text style={styles.cashNoticeTitle}>Pay Cash to Technician</Text>
                                    <Text style={styles.cashNoticeSub}>
                                        Please hand exactly <Text style={{ color: COLORS.textPrimary, fontWeight: '800' }}>₹{grandTotal}</Text> cash to wireman {booking.partnerName || 'Shyam Prasad'}.
                                    </Text>

                                    <TouchableOpacity
                                        style={[styles.payNowBtn, { backgroundColor: COLORS.gold }]}
                                        onPress={() => setCashModalVisible(true)}
                                    >
                                        <CheckCircle2 size={20} color="#000" />
                                        <Text style={[styles.payNowBtnText, { color: '#000' }]}>Confirm Cash Handover (₹{grandTotal})</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Invoice & Guarantee Footer */}
                        <View style={styles.footerInfo}>
                            <View style={styles.footerRow}>
                                <Info size={14} color={COLORS.textTertiary} />
                                <Text style={styles.footerText}>
                                    A downloadable GST Tax Receipt (SAC 9987 & HSN 8536) will be generated immediately upon payment.
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.previewInvoiceLink}
                                onPress={() => router.push(`/invoice/${booking.id}`)}
                            >
                                <Text style={styles.previewInvoiceLinkText}>Preview Digital Tax Invoice</Text>
                                <ExternalLink size={14} color={COLORS.accent} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Cash Confirmation Modal */}
            <Modal
                visible={cashModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCashModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Banknote size={44} color={COLORS.gold} />
                        <Text style={styles.modalTitle}>Confirm Cash Payment</Text>
                        <Text style={styles.modalSub}>
                            Have you handed ₹{grandTotal} in cash to technician {booking.partnerName || 'Shyam Prasad'}?
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setCashModalVisible(false)}
                            >
                                <Text style={styles.modalCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmBtn}
                                onPress={handleConfirmCashPayment}
                            >
                                <Text style={styles.modalConfirmBtnText}>Yes, Paid in Cash</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: COLORS.textSecondary,
        marginTop: 12,
        fontSize: 14,
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
    badgeStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeStatusText: {
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },

    /* Guarantee Banner */
    guaranteeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.3)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
    },
    guaranteeTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
    },
    guaranteeSub: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2,
    },

    /* Technician Profile Card */
    techCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    techAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    techName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 15,
    },
    techMeta: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    verifiedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(34,197,94,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    verifiedPillText: {
        color: COLORS.success,
        fontSize: 10,
        fontWeight: '700',
    },

    /* Bill Breakdown */
    billCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    billHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        marginBottom: 12,
    },
    billTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    billItemTitle: {
        color: COLORS.textPrimary,
        fontSize: 13,
        fontWeight: '600',
    },
    billItemSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    billItemAmt: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '700',
    },

    /* Parts Breakdown */
    partsSection: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    partsSectionTitle: {
        color: COLORS.accent,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    partItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    partItemName: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    partItemSub: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    partItemPrice: {
        color: COLORS.textPrimary,
        fontSize: 13,
        fontWeight: '700',
    },

    /* Tax Box */
    taxBox: {
        paddingTop: 10,
        marginTop: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        gap: 4,
    },
    taxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    taxLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    taxVal: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },

    /* Grand Total */
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1.5,
        borderTopColor: 'rgba(255,255,255,0.15)',
    },
    grandTotalLabel: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 14,
    },
    grandTotalSub: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    grandTotalVal: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 22,
    },

    /* Payment Methods */
    methodCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    methodCardTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    methodTabs: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    tabButtonText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    tabButtonTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    onlineOptionBox: {
        gap: 12,
    },
    onlineLogosRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
    },
    logoPill: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    logoPillText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },
    onlineDescription: {
        color: COLORS.textTertiary,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
    payNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 6,
    },
    payNowBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 14,
    },
    cashOptionBox: {
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
    },
    cashNoticeTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    cashNoticeSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },

    /* Paid State Card */
    paidSuccessCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.success,
        marginBottom: 16,
        gap: 10,
    },
    paidSuccessTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
        marginTop: 6,
    },
    paidSuccessSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    paidActions: {
        width: '100%',
        gap: 10,
        marginTop: 10,
    },
    invoiceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 12,
    },
    invoiceBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    homeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    homeBtnText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },

    /* Footer Info */
    footerInfo: {
        gap: 8,
        alignItems: 'center',
        paddingVertical: 8,
    },
    footerRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textTertiary,
        fontSize: 11,
        textAlign: 'center',
        flex: 1,
    },
    previewInvoiceLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    previewInvoiceLinkText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '700',
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 12,
    },
    modalTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
    },
    modalSub: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginTop: 10,
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    modalCancelBtnText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },
    modalConfirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: COLORS.gold,
        alignItems: 'center',
    },
    modalConfirmBtnText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '900',
    },
});
