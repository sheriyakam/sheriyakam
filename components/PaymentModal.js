import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { CheckCircle, DollarSign, CreditCard, Banknote } from 'lucide-react-native';

const PaymentModal = ({ visible, booking, onClose, onPay }) => {
    const [loading, setLoading] = useState(false);

    if (!booking) return null;

    const basePrice = booking.price;
    const hours = booking.hoursWorked || 1;
    const extraHours = Math.max(0, hours - 1);
    const extraCharge = extraHours * 100;
    const finalPrice = booking.finalPrice || basePrice;

    const handlePayment = (method) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onPay(booking.id, method);
            Alert.alert('Payment Successful', `Paid ₹${finalPrice} via ${method}`);
            onClose();
        }, 1500);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
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
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Processing Payment...</Text>
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
});

export default PaymentModal;
