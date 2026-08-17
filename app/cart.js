import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Tag, ShieldCheck, MapPin, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Stepper } from '../components/ui/Slider';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export default function CartScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const {
        items,
        updateQuantity,
        removeItem,
        clearCart,
        promoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        availablePromoCodes,
        subtotal,
        gst,
        platformFee,
        total,
        selectedAddress,
    } = useCart();

    const [inputCode, setInputCode] = useState('');

    const handleApplyCode = (codeToApply) => {
        const target = codeToApply || inputCode;
        if (!target) {
            showError('Please enter a promo code');
            return;
        }
        const result = applyPromoCode(target);
        if (result.success) {
            success(result.message, 'Coupon Applied');
            setInputCode('');
        } else {
            showError(result.message);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Your Booking Cart</Text>
                    <View style={{ width: 32 }} />
                </View>
                <EmptyState
                    title="Your cart is empty"
                    description="Browse our verified electrician repair services and add items to your cart."
                    actionLabel="Explore Services"
                    onAction={() => router.push('/search')}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Your Booking Cart</Text>
                <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
                    <Text style={[styles.clearText, { color: colors.danger }]}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Service Items List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    SELECTED SERVICES ({items.length})
                </Text>

                {items.map((item) => (
                    <Card key={item.id} variant="default" style={styles.itemCard}>
                        <View style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />

                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.itemCategory, { color: colors.textTertiary }]}>
                                    {item.category} • {item.duration}
                                </Text>
                                <Text style={[styles.itemPrice, { color: colors.accent }]}>
                                    ₹{item.price * item.quantity}
                                </Text>
                            </View>

                            <View style={styles.itemActions}>
                                <TouchableOpacity 
                                    onPress={() => removeItem(item.id)} 
                                    style={styles.deleteBtn}
                                >
                                    <Trash2 size={16} color={colors.danger} />
                                </TouchableOpacity>

                                <Stepper
                                    value={item.quantity}
                                    onChange={(q) => updateQuantity(item.id, q)}
                                    size="sm"
                                    min={1}
                                    max={10}
                                />
                            </View>
                        </View>
                    </Card>
                ))}

                {/* Service Address Card */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    SERVICE ADDRESS
                </Text>
                <Card variant="default" style={styles.addressCard}>
                    <View style={styles.addressRow}>
                        <View style={[styles.addressIconWrap, { backgroundColor: colors.accent + '15' }]}>
                            <MapPin size={20} color={colors.accent} />
                        </View>
                        <View style={styles.addressTextWrap}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.addressTitle, { color: colors.textPrimary }]}>
                                    {selectedAddress?.title || 'Home'}
                                </Text>
                                <Badge variant="success" size="sm">Active</Badge>
                            </View>
                            <Text style={[styles.addressDetail, { color: colors.textSecondary }]}>
                                {selectedAddress?.line1}, {selectedAddress?.taluk}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Promo Code Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    OFFERS & PROMO CODES
                </Text>
                <Card variant="default" style={styles.promoCard}>
                    {promoCode ? (
                        <View style={styles.appliedPromoRow}>
                            <View style={styles.appliedPromoLeft}>
                                <CheckCircle2 size={18} color="#10B981" />
                                <View>
                                    <Text style={[styles.appliedCode, { color: colors.textPrimary }]}>
                                        {promoCode} Applied
                                    </Text>
                                    <Text style={[styles.appliedSavings, { color: '#10B981' }]}>
                                        You saved ₹{promoDiscount}!
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={removePromoCode}>
                                <Text style={[styles.removePromoText, { color: colors.danger }]}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <View style={styles.promoInputRow}>
                                <Tag size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
                                <TextInput
                                    value={inputCode}
                                    onChangeText={(t) => setInputCode(t.toUpperCase())}
                                    placeholder="Enter coupon code (e.g. KERALA20)"
                                    placeholderTextColor={colors.textTertiary}
                                    autoCapitalize="characters"
                                    style={[styles.promoInput, { color: colors.textPrimary }]}
                                />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onPress={() => handleApplyCode()}
                                >
                                    Apply
                                </Button>
                            </View>

                            {/* Suggested coupons */}
                            <View style={styles.suggestedCoupons}>
                                {Object.entries(availablePromoCodes).slice(0, 2).map(([code, p]) => (
                                    <TouchableOpacity
                                        key={code}
                                        onPress={() => handleApplyCode(code)}
                                        style={[
                                            styles.couponChip,
                                            {
                                                backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                                                borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.couponCodeText, { color: colors.accent }]}>
                                            {code}
                                        </Text>
                                        <Text style={[styles.couponDescText, { color: colors.textSecondary }]}>
                                            • {p.desc}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </Card>

                {/* Price Breakdown Summary */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    BILL DETAILS
                </Text>
                <Card variant="default" style={styles.billCard}>
                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Item Total</Text>
                        <Text style={[styles.billVal, { color: colors.textPrimary }]}>₹{subtotal}</Text>
                    </View>

                    {promoDiscount > 0 ? (
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: '#10B981' }]}>Promo Discount ({promoCode})</Text>
                            <Text style={[styles.billVal, { color: '#10B981', fontWeight: '700' }]}>-₹{promoDiscount}</Text>
                        </View>
                    ) : null}

                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>GST (18% Govt Tax)</Text>
                        <Text style={[styles.billVal, { color: colors.textPrimary }]}>₹{gst}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Platform Safety & Insurance</Text>
                        <Text style={[styles.billVal, { color: colors.textPrimary }]}>₹{platformFee}</Text>
                    </View>

                    <View style={[styles.totalDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <View style={styles.billRow}>
                        <Text style={[styles.grandTotalLabel, { color: colors.textPrimary }]}>To Pay</Text>
                        <Text style={[styles.grandTotalVal, { color: colors.accent }]}>₹{total}</Text>
                    </View>
                </Card>

                {/* Guarantee Banner */}
                <View style={[styles.guaranteeBanner, { backgroundColor: isDark ? '#18181B' : '#ECFDF5' }]}>
                    <ShieldCheck size={20} color="#10B981" />
                    <Text style={[styles.guaranteeText, { color: colors.textPrimary }]}>
                        Sheriyakam Promise: 30-Day Free Rework Warranty on all electrical jobs.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Checkout Bar */}
            <View style={[
                styles.bottomBar,
                {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <View>
                    <Text style={[styles.bottomPriceLabel, { color: colors.textTertiary }]}>Total Amount</Text>
                    <Text style={[styles.bottomPriceVal, { color: colors.textPrimary }]}>₹{total}</Text>
                </View>

                <Button
                    variant="primary"
                    size="lg"
                    onPress={() => router.push('/checkout')}
                    iconRight={ChevronRight}
                    style={{ minWidth: 180 }}
                >
                    Proceed to Book
                </Button>
            </View>
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
    clearBtn: {
        padding: 4,
    },
    clearText: {
        fontSize: 13,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    itemCard: {
        marginBottom: 10,
        padding: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    itemCategory: {
        fontSize: 12,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '800',
    },
    itemActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 8,
    },
    deleteBtn: {
        padding: 4,
    },
    addressCard: {
        padding: 14,
        marginBottom: 10,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addressIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressTextWrap: {
        flex: 1,
    },
    addressTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    addressDetail: {
        fontSize: 12,
        marginTop: 2,
    },
    promoCard: {
        padding: 14,
        marginBottom: 10,
    },
    appliedPromoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appliedPromoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    appliedCode: {
        fontSize: 14,
        fontWeight: '700',
    },
    appliedSavings: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 1,
    },
    removePromoText: {
        fontSize: 13,
        fontWeight: '600',
    },
    promoInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    promoInput: {
        flex: 1,
        fontSize: 13,
        paddingVertical: 6,
        paddingHorizontal: 8,
        outlineStyle: 'none',
    },
    suggestedCoupons: {
        gap: 6,
    },
    couponChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    couponCodeText: {
        fontSize: 12,
        fontWeight: '800',
        marginRight: 6,
    },
    couponDescText: {
        fontSize: 11,
    },
    billCard: {
        padding: 16,
        gap: 10,
        marginBottom: 14,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    billLabel: {
        fontSize: 13,
    },
    billVal: {
        fontSize: 13,
        fontWeight: '600',
    },
    totalDivider: {
        height: 1,
        marginVertical: 4,
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: '800',
    },
    grandTotalVal: {
        fontSize: 18,
        fontWeight: '800',
    },
    guaranteeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 14,
    },
    guaranteeText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '500',
    },
    bottomBar: {
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
});
