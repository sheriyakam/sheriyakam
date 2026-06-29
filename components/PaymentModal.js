import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, DollarSign, CreditCard, Banknote } from 'lucide-react-native';
import { snitch } from '../utils/snitch';

const PaymentModal = ({ visible, booking, onClose, onPay }) => {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('payment'); // 'payment' | 'receipt'
    const [paymentSubState, setPaymentSubState] = useState('');

    // Reset step on new open
    React.useEffect(() => {
        if (visible) {
            setStep('payment');
            setPaymentSubState('');
        }
    }, [visible]);

    if (!booking) return null;

    const basePrice = booking.price;
    const hours = booking.hoursWorked || 1;
    const extraHours = Math.max(0, hours - 1);
    const extraCharge = extraHours * 100;
    const finalPrice = booking.finalPrice || basePrice;

    const handlePayment = (method) => {
        setLoading(true);
        snitch.logEvent('payment_started', { bookingId: booking.id, method, amount: finalPrice });
        
        if (method === 'googlepay') {
            setPaymentSubState('Connecting to Google Pay...');
            snitch.logEvent('googlepay_intent_created', { amount: finalPrice });
            
            setTimeout(() => {
                setPaymentSubState('Authorizing with secure biometrics...');
                snitch.logEvent('googlepay_biometrics_requested', { amount: finalPrice });
                
                setTimeout(() => {
                    setPaymentSubState('Processing UPI payment with bank...');
                    snitch.logEvent('googlepay_upi_started', { amount: finalPrice });
                    
                    setTimeout(() => {
                        try {
                            setLoading(false);
                            setPaymentSubState('');
                            snitch.logEvent('googlepay_transaction_success', { bookingId: booking.id, amount: finalPrice });
                            snitch.logEvent('payment_success', { bookingId: booking.id, method: 'googlepay', amount: finalPrice });
                            onPay(booking.id, 'googlepay');
                            setStep('receipt');
                        } catch (err) {
                            snitch.logError(err, 'Google Pay success handler');
                            Alert.alert('Payment Error', 'Google Pay transaction failed.');
                        }
                    }, 1000);
                }, 1000);
            }, 1000);
        } else {
            setPaymentSubState('Processing Payment...');
            setTimeout(() => {
                try {
                    setLoading(false);
                    setPaymentSubState('');
                    snitch.logEvent('payment_success', { bookingId: booking.id, method, amount: finalPrice });
                    onPay(booking.id, method);
                    setStep('receipt');
                } catch (err) {
                    snitch.logError(err, 'Standard Payment success handler');
                    Alert.alert('Payment Error', 'Payment processing failed.');
                }
            }, 1500);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
                    {step === 'payment' ? (
                        <>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: colors.textPrimary }]}>Complete Payment</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={[styles.closeText, { color: colors.textSecondary }]}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.billContainer, { backgroundColor: colors.bgPrimary, borderColor: colors.border }]}>
                                <Text style={[styles.billTitle, { color: colors.textPrimary }]}>Bill Details</Text>

                                <View style={styles.billRow}>
                                    <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Base Service Charge (1 hr)</Text>
                                    <Text style={[styles.rowValue, { color: colors.textPrimary }]}>₹{basePrice}</Text>
                                </View>

                                {extraHours > 0 && (
                                    <View style={styles.billRow}>
                                        <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Extra Hours ({extraHours} hrs @ ₹100/hr)</Text>
                                        <Text style={[styles.rowValue, { color: colors.textPrimary }]}>₹{extraCharge}</Text>
                                    </View>
                                )}

                                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                                <View style={styles.totalRow}>
                                    <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total Payable</Text>
                                    <Text style={styles.totalValue}>₹{finalPrice}</Text>
                                </View>
                            </View>

                            <Text style={[styles.methodTitle, { color: colors.textPrimary }]}>Select Payment Method</Text>

                            {/* Google Pay Pomili Button */}
                            <TouchableOpacity
                                style={[styles.methodCard, styles.gpayBtn, { borderColor: colors.border }]}
                                onPress={() => handlePayment('googlepay')}
                                disabled={loading}
                            >
                                <View style={styles.gpayContent}>
                                    <Text style={styles.gpayText}>Pay with </Text>
                                    <View style={styles.gpayLogo}>
                                        <Text style={{ color: '#4285F4', fontWeight: '900', fontSize: 18 }}>G</Text>
                                        <Text style={{ color: '#EA4335', fontWeight: '900', fontSize: 18 }}>o</Text>
                                        <Text style={{ color: '#FBBC05', fontWeight: '900', fontSize: 18 }}>o</Text>
                                        <Text style={{ color: '#4285F4', fontWeight: '900', fontSize: 18 }}>g</Text>
                                        <Text style={{ color: '#34A853', fontWeight: '900', fontSize: 18 }}>l</Text>
                                        <Text style={{ color: '#EA4335', fontWeight: '900', fontSize: 18 }}>e </Text>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Pay</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.methodCard, { backgroundColor: colors.bgPrimary, borderColor: colors.border }]}
                                onPress={() => handlePayment('online')}
                                disabled={loading}
                            >
                                <View style={[styles.iconBox, { backgroundColor: colors.accent + '15' }]}>
                                    <CreditCard size={24} color={colors.accent} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.methodName, { color: colors.textPrimary }]}>Online Payment</Text>
                                    <Text style={[styles.methodSub, { color: colors.textSecondary }]}>UPI, Cards, Netbanking</Text>
                                </View>
                                <CheckCircle size={20} color={colors.border} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.methodCard, { backgroundColor: colors.bgPrimary, borderColor: colors.border }]}
                                onPress={() => handlePayment('cash')}
                                disabled={loading}
                            >
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                    <Banknote size={24} color={colors.success} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.methodName, { color: colors.textPrimary }]}>Cash on Delivery</Text>
                                    <Text style={[styles.methodSub, { color: colors.textSecondary }]}>Pay directly to partner</Text>
                                </View>
                                <CheckCircle size={20} color={colors.border} />
                            </TouchableOpacity>

                            {loading && (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color="#ffffff" />
                                    <Text style={{ marginTop: 16, color: '#ffffff', fontWeight: 'bold', fontSize: 15 }}>{paymentSubState || 'Processing Payment...'}</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.receiptContainer}>
                            <View style={styles.receiptHeader}>
                                <CheckCircle size={48} color={colors.success} />
                                <Text style={[styles.receiptTitle, { color: colors.textPrimary }]}>Payment Successful</Text>
                                <Text style={[styles.receiptDate, { color: colors.textSecondary }]}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</Text>
                            </View>
                            <View style={[styles.receiptBody, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa', borderColor: colors.border }]}>
                                <Text style={[styles.receiptLogo, { color: colors.textPrimary }]}>Sheri<Text style={{ color: colors.accent }}>yakam</Text></Text>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Technician:</Text>
                                    <Text style={[styles.receiptValue, { color: colors.textPrimary }]}>{booking.partnerName || 'Assigned Partner'}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Service:</Text>
                                    <Text style={[styles.receiptValue, { color: colors.textPrimary }]}>{booking.service}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Amount Paid:</Text>
                                    <Text style={[styles.receiptValue, { color: colors.success, fontSize: 18, fontWeight: 'bold' }]}>₹{finalPrice}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Transaction ID:</Text>
                                    <Text style={[styles.receiptValue, { color: colors.textPrimary }]}>TXN{Math.floor(100000 + Math.random() * 900000)}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[styles.doneBtn, { backgroundColor: colors.accent }]} onPress={onClose}>
                                <Text style={styles.doneBtnText}>Close Receipt</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.bgPrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.xl,
        minHeight: 500,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    closeText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    billContainer: {
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    rowLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    rowValue: {
        color: COLORS.textPrimary,
        fontWeight: '500',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        color: COLORS.success,
        fontSize: 24,
        fontWeight: 'bold',
    },
    methodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    methodSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    receiptContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    receiptHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    receiptTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: SPACING.md,
    },
    receiptDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    receiptBody: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    receiptLogo: {
        fontSize: 24,
        fontWeight: '900',
        color: '#001F3F',
        textAlign: 'center',
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    receiptLabel: {
        color: '#666',
        fontSize: 14,
    },
    receiptValue: {
        color: '#1a1a1a',
        fontSize: 14,
        fontWeight: '600',
    },
    doneBtn: {
        backgroundColor: COLORS.accent,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpayBtn: {
        backgroundColor: '#000000',
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 16,
    },
    gpayContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpayText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    gpayLogo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default PaymentModal;
