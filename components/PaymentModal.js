import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { CheckCircle, DollarSign, CreditCard, Banknote } from 'lucide-react-native';

const PaymentModal = ({ visible, booking, onClose, onPay }) => {
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
        if (method === 'googlepay') {
            setPaymentSubState('Connecting to Google Pay (Pomili)...');
            setTimeout(() => {
                setPaymentSubState('Authorizing with secure biometrics...');
                setTimeout(() => {
                    setPaymentSubState('Processing UPI payment with bank...');
                    setTimeout(() => {
                        setLoading(false);
                        setPaymentSubState('');
                        onPay(booking.id, 'googlepay');
                        setStep('receipt');
                    }, 1000);
                }, 1000);
            }, 1000);
        } else {
            setPaymentSubState('Processing Payment...');
            setTimeout(() => {
                setLoading(false);
                setPaymentSubState('');
                onPay(booking.id, method);
                setStep('receipt');
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
                <View style={[styles.container, step === 'receipt' && { backgroundColor: '#fff' }]}>
                    {step === 'payment' ? (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Complete Payment</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.closeText}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.billContainer}>
                                <Text style={styles.billTitle}>Bill Details</Text>

                                <View style={styles.billRow}>
                                    <Text style={styles.rowLabel}>Base Service Charge (1 hr)</Text>
                                    <Text style={styles.rowValue}>₹{basePrice}</Text>
                                </View>

                                {extraHours > 0 && (
                                    <View style={styles.billRow}>
                                        <Text style={styles.rowLabel}>Extra Hours ({extraHours} hrs @ ₹100/hr)</Text>
                                        <Text style={styles.rowValue}>₹{extraCharge}</Text>
                                    </View>
                                )}

                                <View style={styles.divider} />

                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total Payable</Text>
                                    <Text style={styles.totalValue}>₹{finalPrice}</Text>
                                </View>
                            </View>

                            <Text style={styles.methodTitle}>Select Payment Method</Text>

                            {/* Google Pay Pomili Button */}
                            <TouchableOpacity
                                style={[styles.methodCard, styles.gpayBtn]}
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
                                style={styles.methodCard}
                                onPress={() => handlePayment('online')}
                                disabled={loading}
                            >
                                <View style={styles.iconBox}>
                                    <CreditCard size={24} color={COLORS.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.methodName}>Online Payment</Text>
                                    <Text style={styles.methodSub}>UPI, Cards, Netbanking</Text>
                                </View>
                                <CheckCircle size={20} color={COLORS.border} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.methodCard}
                                onPress={() => handlePayment('cash')}
                                disabled={loading}
                            >
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                                    <Banknote size={24} color={COLORS.success} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.methodName}>Cash on Delivery</Text>
                                    <Text style={styles.methodSub}>Pay directly to partner</Text>
                                </View>
                                <CheckCircle size={20} color={COLORS.border} />
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
                                <CheckCircle size={48} color={COLORS.success} />
                                <Text style={styles.receiptTitle}>Payment Successful</Text>
                                <Text style={styles.receiptDate}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</Text>
                            </View>
                            <View style={styles.receiptBody}>
                                <Text style={styles.receiptLogo}>Sheri<Text style={{ color: COLORS.accent }}>yakam</Text></Text>
                                <View style={styles.divider} />
                                <View style={styles.receiptRow}>
                                    <Text style={styles.receiptLabel}>Technician:</Text>
                                    <Text style={styles.receiptValue}>{booking.partnerName || 'Assigned Partner'}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={styles.receiptLabel}>Service:</Text>
                                    <Text style={styles.receiptValue}>{booking.service}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={styles.receiptLabel}>Amount Paid:</Text>
                                    <Text style={[styles.receiptValue, { color: COLORS.success, fontSize: 18, fontWeight: 'bold' }]}>₹{finalPrice}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={styles.receiptLabel}>Transaction ID:</Text>
                                    <Text style={styles.receiptValue}>TXN{Math.floor(100000 + Math.random() * 900000)}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
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
