import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Animated, Pressable, Platform } from 'react-native';
import { Clock, MapPin, Zap, ShieldCheck } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ServiceCard = ({
    id,
    name,
    rating,
    specialty,
    distance,
    time,
    price,
    image,
    isEmergency = false,
    fullWidth = false,
    onPress,
    onBook
}) => {
    const { width } = useWindowDimensions();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const isSmallScreen = width < 768;
    const cardWidth = isSmallScreen
        ? (width - SPACING.md * 3) / 2
        : (width - SPACING.md * 4) / 4;

    const scaleValue = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 25,
            bounciness: 8,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 25,
            bounciness: 8,
        }).start();
    };

    const handleBookClick = (e) => {
        e?.stopPropagation?.();
        if (onPress) {
            onPress();
        } else if (onBook) {
            onBook();
        }
    };

    const cardBg = isDark ? '#18181b' : '#ffffff';
    const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    return (
        <Pressable
            onPress={handleBookClick}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={({ hovered }) => [
                fullWidth ? { width: '100%' } : { width: cardWidth },
                !fullWidth && !isSmallScreen && { maxWidth: 360 },
            ]}
        >
            {({ hovered }) => (
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: cardBg,
                            borderColor: hovered ? (isEmergency ? COLORS.danger : colors.accent) : borderCol,
                            shadowColor: isDark ? '#000' : 'rgba(0,0,0,0.12)',
                            shadowOpacity: isDark ? (hovered ? 0.6 : 0.4) : (hovered ? 0.15 : 0.08),
                            shadowRadius: hovered ? 16 : 12,
                        },
                        isEmergency && [styles.emergencyCard, {
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.03)',
                        }],
                        { transform: [{ scale: scaleValue }] }
                    ]}
                >
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={typeof image === 'string' ? { uri: image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80' } : (image || { uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80' })}
                            style={styles.image}
                            resizeMode="cover"
                            accessible={true}
                            accessibilityLabel={`Photo for ${name}`}
                        />
                        {/* Subtle gradient overlay */}
                        <View style={styles.imageOverlay} />

                        {/* Top-Left: 30-Day Warranty Badge */}
                        <View style={styles.warrantyBadge}>
                            <ShieldCheck size={11} color="#10B981" />
                            <Text style={styles.warrantyText}>30-DAY WARRANTY</Text>
                        </View>

                        {/* Top-Right: Estimated Duration Badge */}
                        <View style={[
                            styles.durationBadge,
                            {
                                backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.92)',
                            }
                        ]}>
                            <Clock size={11} color={colors.accent} />
                            <Text style={[styles.durationText, { color: isDark ? '#fff' : '#0F172A' }]}>
                                {(time || '30 MIN').toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.content}>
                        <View style={[styles.header, { alignItems: 'flex-start' }]}>
                            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>{name}</Text>
                            {isEmergency && <Zap size={16} color={COLORS.danger} fill={COLORS.danger} style={{ marginTop: 3 }} />}
                        </View>

                        <Text style={[styles.specialty, { color: colors.accent }]} numberOfLines={2}>{specialty}</Text>

                        <View style={styles.metaContainer}>
                            {distance && (
                                <View style={styles.metaItem}>
                                    <MapPin size={11} color={colors.textTertiary} />
                                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>{distance}</Text>
                                </View>
                            )}
                            <View style={styles.metaItem}>
                                <Clock size={11} color={colors.textTertiary} />
                                <Text style={[styles.metaText, { color: colors.textTertiary }]}>{time}</Text>
                            </View>
                        </View>

                        {/* Price & Action */}
                        <View style={styles.footer}>
                            <View>
                                <Text style={[{ fontSize: 10, color: colors.textTertiary, fontWeight: '500', letterSpacing: 0.3 }]}>Starting from</Text>
                                <Text style={[styles.price, { color: colors.textPrimary }]}>₹{price}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleBookClick}
                                activeOpacity={0.8}
                                style={[
                                    styles.bookBtn,
                                    {
                                        backgroundColor: isEmergency ? COLORS.danger : colors.accent
                                    }
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={`Book ${name}`}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Zap size={13} color="#fff" fill="#fff" />
                                    <Text style={styles.bookBtnText}>Book</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        marginBottom: SPACING.md,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },
    emergencyCard: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    imageContainer: {
        height: 130,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    warrantyBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        backgroundColor: 'rgba(6, 78, 59, 0.90)',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.35)',
        ...Platform.select({
            web: { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' },
            default: {},
        }),
    },
    warrantyText: {
        color: '#A7F3D0',
        fontSize: 9.5,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    durationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        ...Platform.select({
            web: { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' },
            default: {},
        }),
    },
    durationText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    content: {
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        letterSpacing: -0.2,
        lineHeight: 20,
    },
    specialty: {
        fontSize: 11.5,
        fontWeight: '500',
        marginBottom: 8,
        lineHeight: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontWeight: '400',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(128,128,128,0.12)',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    bookBtn: {
        minHeight: 40,
        minWidth: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 10,
    },
    bookBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12.5,
        letterSpacing: 0.2,
    },
});

export default React.memo(ServiceCard);
