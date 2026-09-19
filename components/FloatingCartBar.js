import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { formatINR } from '../utils/validation';

export default function FloatingCartBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { itemCount, cartTotal } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Hide on cart and checkout pages to avoid redundancy
    if (!itemCount || itemCount === 0 || pathname === '/cart' || pathname === '/checkout') {
        return null;
    }

    return (
        <View style={styles.outerWrapper}>
            <View style={[
                styles.container,
                {
                    backgroundColor: isDark ? '#18181B' : '#0F172A',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.1)',
                }
            ]}>
                <View style={styles.leftInfo}>
                    <View style={styles.iconCircle}>
                        <ShoppingBag size={18} color="#FFFFFF" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{itemCount}</Text>
                        </View>
                    </View>
                    <View style={styles.textWrap}>
                        <Text style={styles.itemCountText}>
                            {itemCount} {itemCount === 1 ? 'Service' : 'Services'} Selected
                        </Text>
                        <Text style={styles.totalText}>
                            Total: <Text style={styles.totalAmount}>{formatINR(cartTotal)}</Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/cart')}
                    activeOpacity={0.85}
                    style={styles.ctaButton}
                    accessibilityRole="button"
                    accessibilityLabel="View Cart and Checkout"
                >
                    <Text style={styles.ctaText}>View Cart</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerWrapper: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 9999,
        pointerEvents: 'box-none',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 720,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
        ...Platform.select({
            web: {
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(12px)',
            },
            default: {}
        })
    },
    leftInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#0F172A',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    textWrap: {
        gap: 2,
    },
    itemCountText: {
        color: '#94A3B8',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    totalText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    totalAmount: {
        color: '#60A5FA',
        fontWeight: '800',
        fontSize: 16,
    },
    ctaButton: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
    },
    ctaText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    }
});
