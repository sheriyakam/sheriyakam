import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, ShieldCheck, Check, Plus, ShoppingCart, Zap, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Checkbox } from '../../components/ui/Checkbox';

const SERVICE_DETAILS_MOCK = {
    'fan-repair': {
        title: 'Ceiling & Exhaust Fan Repair',
        category: 'Fan & Light',
        price: 249,
        originalPrice: 349,
        rating: 4.9,
        reviewsCount: 342,
        duration: '30-45 mins',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        description: 'Comprehensive diagnostic and repair for all ceiling fans, exhaust fans, and pedestal fans. Covers noise troubleshooting, capacitor replacement, regulator wiring, and safety balancing.',
        inclusions: [
            'Inspection of motor winding and bearing friction',
            'Testing of step regulator and switchboard connection',
            'Capacitor replacement and blade angle balancing',
            'Full post-service speed test and safety check',
        ],
        exclusions: [
            'Cost of new replacement fan (if motor is burnt)',
            'Decorative chandelier lighting rewiring',
        ],
        addons: [
            { id: 'a1', title: 'Heavy Duty 3.15uF Capacitor', price: 90 },
            { id: 'a2', title: '5-Step Rotary Fan Regulator', price: 180 },
            { id: 'a3', title: 'Downrod Extension Pipe (1.5 ft)', price: 120 },
        ],
    },
    'default': {
        title: 'Electrical Diagnostics & Repair',
        category: 'Wiring & MCB',
        price: 299,
        originalPrice: 399,
        rating: 4.8,
        reviewsCount: 210,
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        description: 'Certified electrical troubleshooting for household wiring, tripped breakers, and power fluctuations.',
        inclusions: [
            'Complete phase and neutral line testing',
            'MCB trip sensitivity check',
            'Earthing voltage leakage measurement',
        ],
        exclusions: [
            'Concealed wall conduit chipping and plastering',
        ],
        addons: [
            { id: 'a1', title: '32A Double Pole MCB', price: 280 },
            { id: 'a2', title: 'Copper Earth Rod Spike', price: 450 },
        ],
    }
};

export default function SingleServiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { addItem, itemCount } = useCart();
    const { success } = useToast();
    const isDark = theme === 'dark';

    const service = SERVICE_DETAILS_MOCK[id] || SERVICE_DETAILS_MOCK['default'];
    const [selectedAddons, setSelectedAddons] = useState([]);

    const toggleAddon = (addon) => {
        setSelectedAddons((prev) => {
            const exists = prev.some((a) => a.id === addon.id);
            if (exists) return prev.filter((a) => a.id !== addon.id);
            return [...prev, addon];
        });
    };

    const handleAddToCart = () => {
        addItem({ id: id || 'service-1', ...service }, 1, selectedAddons);
        success(`Added "${service.title}" to cart!`, 'Cart Updated');
    };

    const handleBookNow = () => {
        addItem({ id: id || 'service-1', ...service }, 1, selectedAddons);
        router.push('/cart');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Top Navigation */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    {service.title}
                </Text>
                <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartIconBtn}>
                    <ShoppingCart size={20} color={colors.textPrimary} />
                    {itemCount > 0 ? (
                        <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.cartBadgeText}>{itemCount}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Image */}
                <View style={[styles.heroImageContainer, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <Image source={{ uri: service.image }} style={styles.heroImage} />
                    <View style={[styles.categoryBadgeWrap, { backgroundColor: isDark ? '#18181BE0' : '#FFFFFFE0' }]}>
                        <Badge variant="info">{service.category}</Badge>
                    </View>
                </View>

                {/* Title & Rating */}
                <View style={styles.titleSection}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        {service.title}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBadge}>
                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                            <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                                {service.rating} ({service.reviewsCount} reviews)
                            </Text>
                        </View>

                        <View style={styles.durationBadge}>
                            <Clock size={14} color={colors.textTertiary} />
                            <Text style={[styles.durationText, { color: colors.textTertiary }]}>
                                {service.duration}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={[styles.priceVal, { color: colors.accent }]}>
                            ₹{service.price}
                        </Text>
                        <Text style={[styles.originalPriceVal, { color: colors.textTertiary }]}>
                            ₹{service.originalPrice}
                        </Text>
                        <Badge variant="success" size="sm">Save 28%</Badge>
                    </View>
                </View>

                {/* Description */}
                <Card variant="default" style={styles.sectionCard}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>About this Service</Text>
                    <Text style={[styles.descText, { color: colors.textSecondary }]}>
                        {service.description}
                    </Text>
                </Card>

                {/* What's Included */}
                <Card variant="default" style={styles.sectionCard}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>What's Included</Text>
                    <View style={styles.listWrap}>
                        {service.inclusions.map((inc, i) => (
                            <View key={i} style={styles.listItem}>
                                <Check size={16} color="#10B981" style={{ marginTop: 2 }} />
                                <Text style={[styles.listText, { color: colors.textSecondary }]}>{inc}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Optional Add-on Parts */}
                <Card variant="default" style={styles.sectionCard}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Add Spare Parts (Optional)</Text>
                    <View style={styles.addonsList}>
                        {service.addons.map((addon) => {
                            const isChecked = selectedAddons.some((a) => a.id === addon.id);
                            return (
                                <TouchableOpacity
                                    key={addon.id}
                                    onPress={() => toggleAddon(addon)}
                                    style={[
                                        styles.addonItem,
                                        {
                                            backgroundColor: isChecked ? (isDark ? '#27272A' : '#EFF6FF') : 'transparent',
                                            borderColor: isChecked ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                        }
                                    ]}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={() => toggleAddon(addon)}
                                        label={addon.title}
                                    />
                                    <Text style={[styles.addonPrice, { color: colors.accent }]}>
                                        +₹{addon.price}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>
            </ScrollView>

            {/* Bottom Actions Bar */}
            <View style={[
                styles.bottomBar,
                {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <Button
                    variant="outline"
                    size="lg"
                    onPress={handleAddToCart}
                    iconLeft={ShoppingCart}
                    style={{ flex: 1 }}
                >
                    Add to Cart
                </Button>

                <Button
                    variant="primary"
                    size="lg"
                    onPress={handleBookNow}
                    style={{ flex: 1.3 }}
                >
                    Book Now • ₹{service.price + selectedAddons.reduce((s, a) => s + a.price, 0)}
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
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        marginHorizontal: 10,
    },
    cartIconBtn: {
        position: 'relative',
        padding: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 110,
    },
    heroImageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        position: 'relative',
        marginBottom: 16,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryBadgeWrap: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        borderRadius: 12,
        padding: 4,
    },
    titleSection: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '700',
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 13,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    priceVal: {
        fontSize: 24,
        fontWeight: '800',
    },
    originalPriceVal: {
        fontSize: 15,
        textDecorationLine: 'line-through',
    },
    sectionCard: {
        padding: 16,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 8,
    },
    descText: {
        fontSize: 13,
        lineHeight: 20,
    },
    listWrap: {
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    listText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    addonsList: {
        gap: 8,
    },
    addonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    addonPrice: {
        fontSize: 13,
        fontWeight: '700',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
    },
});
