import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions, Linking } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Phone, Zap, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS } from '../constants/theme';
import { openWhatsApp } from '../utils/whatsapp';

export default function StickyMobileCTA({ onBookPress }) {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const { colors, theme } = useTheme();
    const { itemCount } = useCart();
    const isDark = theme === 'dark';

    // Only display on mobile screen sizes (< 768px)
    if (width >= 768) return null;

    // Yield to FloatingCartBar when cart has items
    if (itemCount && itemCount > 0) return null;

    // Hide on checkout, cart, login, admin, partner, and career platform pages
    const hiddenPaths = ['/cart', '/checkout', '/auth/login', '/admin', '/partner', '/cv-linkedin-optimize'];
    if (pathname && hiddenPaths.some(p => pathname.startsWith(p))) return null;

    const handleCall = () => {
        const phoneUrl = 'tel:+914952800000';
        if (Platform.OS === 'web') {
            window.location.href = phoneUrl;
        } else {
            Linking.openURL(phoneUrl);
        }
    };

    const handleBook = () => {
        if (onBookPress) {
            onBookPress();
        } else {
            router.push('/services');
        }
    };

    return (
        <View style={styles.outerContainer}>
            <View style={[
                styles.barContainer,
                {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                }
            ]}>
                {/* Secondary: Quick 24/7 Helpline */}
                <TouchableOpacity
                    onPress={handleCall}
                    style={[
                        styles.helplineBtn,
                        {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
                        }
                    ]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Call 24/7 Helpline"
                >
                    <Phone size={16} color={colors.accent || '#3B82F6'} />
                    <Text style={[styles.helplineText, { color: colors.textPrimary }]}>
                        Call 24/7
                    </Text>
                </TouchableOpacity>

                {/* Primary: Book Electrician */}
                <TouchableOpacity
                    onPress={handleBook}
                    style={[
                        styles.bookBtn,
                        { backgroundColor: colors.accent || '#2563EB' }
                    ]}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Book Electrician in 60 seconds"
                >
                    <Zap size={16} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.bookBtnText}>Book in 60 Sec</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: 58, // Sits directly above the bottom tab bar on mobile
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingBottom: 6,
        zIndex: 9990,
        pointerEvents: 'box-none',
        alignItems: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 500,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            },
            default: {}
        })
    },
    helplineBtn: {
        flex: 1,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    helplineText: {
        fontSize: 13,
        fontWeight: '700',
    },
    bookBtn: {
        flex: 1.4,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 14,
        borderRadius: 12,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    bookBtnText: {
        color: '#FFFFFF',
        fontSize: 13.5,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});
