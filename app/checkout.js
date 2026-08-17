import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2, ChevronRight, Zap, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Toggle } from '../components/ui/Toggle';
import { DatePicker } from '../components/ui/DatePicker';
import { Radio } from '../components/ui/Radio';

const PAYMENT_METHODS = [
    {
        id: 'upi',
        title: 'UPI (GPay / PhonePe / Paytm)',
        subtitle: 'Instant verification via UPI App or QR',
        icon: QrCode,
        badge: 'Fastest',
    },
    {
        id: 'card',
        title: 'Credit / Debit Card',
        subtitle: 'Visa, Mastercard, RuPay & Corporate',
        icon: CreditCard,
        badge: null,
    },
    {
        id: 'cash',
        title: 'Pay after Service (Cash / UPI)',
        subtitle: 'Pay technician directly upon job completion',
        icon: Banknote,
        badge: 'Zero Risk',
    },
];

export default function CheckoutScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const {
        items,
        total,
        subtotal,
        promoDiscount,
        gst,
        platformFee,
        emergencyFee,
        selectedAddress,
        addresses,
        setSelectedAddressId,
        bookingSchedule,
        setBookingSchedule,
        clearCart,
    } = useCart();

    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            showError('Please select a service address');
            return;
        }

        setIsPlacingOrder(true);
        const generatedId = 'SHK-' + Math.floor(100000 + Math.random() * 900000);
        setBookingRef(generatedId);

        setTimeout(() => {
            setIsPlacingOrder(false);
            setShowSuccessModal(true);
        }, 1500);
    };

    const handleDone = () => {
        setShowSuccessModal(false);
        clearCart();
        router.replace('/bookings');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Checkout & Schedule</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Step 1: Address */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    1. CONFIRM SERVICE LOCATION
                </Text>
                <Card variant="default" style={styles.sectionCard}>
                    {addresses.map((addr) => {
                        const isSelected = selectedAddress?.id === addr.id;
                        return (
                            <TouchableOpacity
                                key={addr.id}
                                onPress={() => setSelectedAddressId(addr.id)}
                                style={[
                                    styles.addrOption,
                                    {
                                        borderColor: isSelected ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                        backgroundColor: isSelected ? (isDark ? '#27272A' : '#EFF6FF80') : 'transparent',
                                    }
                                ]}
                            >
                                <Radio selected={isSelected} onSelect={() => setSelectedAddressId(addr.id)} />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={[styles.addrTitle, { color: colors.textPrimary }]}>{addr.title}</Text>
                                    <Text style={[styles.addrDetail, { color: colors.textSecondary }]}>
                                        {addr.line1}, {addr.taluk} - {addr.pincode}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Card>

                {/* Step 2: Date & Slot */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    2. SERVICE DATE & TIME SLOT
                </Text>
                <Card variant="default" style={styles.sectionCard}>
                    <DatePicker
                        value={bookingSchedule.date}
                        selectedSlot={bookingSchedule.slot}
                        onSelectDate={(d) => setBookingSchedule((prev) => ({ ...prev, date: d }))}
                        onSelectSlot={(s) => setBookingSchedule((prev) => ({ ...prev, slot: s }))}
                        label="Appointment Slot"
                    />

                    <View style={[styles.emergencyToggleWrap, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Zap size={16} color="#EF4444" />
                                <Text style={[styles.emergencyTitle, { color: colors.textPrimary }]}>
                                    Priority Emergency Dispatch (30 Mins)
                                </Text>
                            </View>
                            <Text style={[styles.emergencyDesc, { color: colors.textTertiary }]}>
                                Dispatches the closest standby electrician immediately (+25% surcharge)
                            </Text>
                        </View>
                        <Toggle
                            value={bookingSchedule.isEmergency}
                            onChange={(v) => setBookingSchedule((prev) => ({ ...prev, isEmergency: v }))}
                        />
                    </View>
                </Card>

                {/* Step 3: Payment Method */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    3. PAYMENT METHOD
                </Text>
                <Card variant="default" style={styles.sectionCard}>
                    {PAYMENT_METHODS.map((method) => {
                        const isSelected = selectedPayment === method.id;
                        const Icon = method.icon;
                        return (
                            <TouchableOpacity
                                key={method.id}
                                onPress={() => setSelectedPayment(method.id)}
                                style={[
                                    styles.paymentOption,
                                    {
                                        borderColor: isSelected ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                        backgroundColor: isSelected ? (isDark ? '#27272A' : '#EFF6FF80') : 'transparent',
                                    }
                                ]}
                            >
                                <Radio selected={isSelected} onSelect={() => setSelectedPayment(method.id)} />
                                <View style={styles.paymentIconWrap}>
                                    <Icon size={20} color={colors.accent} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.paymentTitle, { color: colors.textPrimary }]}>
                                            {method.title}
                                        </Text>
                                        {method.badge ? (
                                            <Badge variant="success" size="sm">{method.badge}</Badge>
                                        ) : null}
                                    </View>
                                    <Text style={[styles.paymentSubtitle, { color: colors.textTertiary }]}>
                                        {method.subtitle}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Card fields if card selected */}
                    {selectedPayment === 'card' && (
                        <View style={[styles.cardForm, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Text style={[styles.cardFormTitle, { color: colors.textSecondary }]}>Enter Card Details</Text>
                            <TextInput
                                placeholder="4111 2222 3333 4444"
                                placeholderTextColor={colors.textTertiary}
                                keyboardType="number-pad"
                                maxLength={19}
                                style={[styles.cardInput, { color: colors.textPrimary, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                            />
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                                <TextInput
                                    placeholder="MM/YY"
                                    placeholderTextColor={colors.textTertiary}
                                    maxLength={5}
                                    style={[styles.cardInput, { flex: 1, color: colors.textPrimary, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                                />
                                <TextInput
                                    placeholder="CVV"
                                    placeholderTextColor={colors.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    secureTextEntry
                                    style={[styles.cardInput, { flex: 1, color: colors.textPrimary, borderColor: isDark ? '#3F3F46' : '#E4E4E7' }]}
                                />
                            </View>
                        </View>
                    )}
                </Card>

                {/* Final Order Review */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    ORDER SUMMARY
                </Text>
                <Card variant="default" style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Services ({items.length} items)</Text>
                        <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{subtotal}</Text>
                    </View>
                    {promoDiscount > 0 ? (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Promo Savings</Text>
                            <Text style={[styles.summaryVal, { color: '#10B981' }]}>-₹{promoDiscount}</Text>
                        </View>
                    ) : null}
                    {emergencyFee > 0 ? (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#EF4444' }]}>Emergency Surcharge</Text>
                            <Text style={[styles.summaryVal, { color: '#EF4444' }]}>+₹{emergencyFee}</Text>
                        </View>
                    ) : null}
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>GST & Safety Fees</Text>
                        <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{gst + platformFee}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.grandTotalText, { color: colors.textPrimary }]}>Total Payable</Text>
                        <Text style={[styles.grandTotalAmount, { color: colors.accent }]}>₹{total}</Text>
                    </View>
                </Card>
            </ScrollView>

            {/* Sticky Place Booking Button */}
            <View style={[
                styles.bottomAction,
                {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <View>
                    <Text style={[styles.bottomPriceLabel, { color: colors.textTertiary }]}>Total to Pay</Text>
                    <Text style={[styles.bottomPriceVal, { color: colors.textPrimary }]}>₹{total}</Text>
                </View>

                <Button
                    variant="primary"
                    size="lg"
                    loading={isPlacingOrder}
                    onPress={handlePlaceOrder}
                    style={{ minWidth: 200 }}
                >
                    Confirm Booking
                </Button>
            </View>

            {/* Booking Success Confirmation Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.successBackdrop}>
                    <View style={[
                        styles.successCard,
                        {
                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}>
                        <View style={[styles.successIconCircle, { backgroundColor: '#10B98120' }]}>
                            <CheckCircle2 size={48} color="#10B981" />
                        </View>

                        <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                            Booking Confirmed!
                        </Text>
                        <Text style={[styles.successRef, { color: colors.accent }]}>
                            Reference ID: {bookingRef}
                        </Text>

                        <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                            A certified electrician in Kozhikode has been notified. You will receive an SMS and push notification once they begin transit.
                        </Text>

                        <View style={[styles.receiptCard, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Appointment:</Text>
                                <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{bookingSchedule.date} ({bookingSchedule.slot.split(' ')[0]})</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Amount Paid:</Text>
                                <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>₹{total}</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Payment Mode:</Text>
                                <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{selectedPayment.toUpperCase()}</Text>
                            </View>
                        </View>

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={handleDone}
                            style={{ marginTop: 18 }}
                        >
                            Track Live Booking
                        </Button>
                    </View>
                </View>
            </Modal>
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
        paddingBottom: 110,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    sectionCard: {
        padding: 14,
        marginBottom: 10,
        gap: 10,
    },
    addrOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    addrTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    addrDetail: {
        fontSize: 12,
        marginTop: 2,
    },
    emergencyToggleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 8,
        borderTopWidth: 1,
    },
    emergencyTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    emergencyDesc: {
        fontSize: 11,
        marginTop: 2,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    paymentIconWrap: {
        marginHorizontal: 8,
    },
    paymentTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    paymentSubtitle: {
        fontSize: 12,
        marginTop: 1,
    },
    cardForm: {
        paddingTop: 12,
        marginTop: 4,
        borderTopWidth: 1,
    },
    cardFormTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
    },
    summaryCard: {
        padding: 16,
        gap: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 13,
    },
    summaryVal: {
        fontSize: 13,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 4,
    },
    grandTotalText: {
        fontSize: 16,
        fontWeight: '800',
    },
    grandTotalAmount: {
        fontSize: 20,
        fontWeight: '800',
    },
    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
    },
    bottomPriceLabel: {
        fontSize: 11,
    },
    bottomPriceVal: {
        fontSize: 20,
        fontWeight: '800',
    },
    successBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    successCard: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        borderWidth: 1.5,
        padding: 24,
        alignItems: 'center',
    },
    successIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    successRef: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        fontFamily: 'monospace',
    },
    successMessage: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 18,
    },
    receiptCard: {
        width: '100%',
        padding: 14,
        borderRadius: 14,
        gap: 6,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    receiptLabel: {
        fontSize: 12,
    },
    receiptVal: {
        fontSize: 12,
        fontWeight: '700',
    },
});
