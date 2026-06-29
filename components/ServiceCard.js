import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Animated, Pressable, Platform } from 'react-native';
import { Star, Clock, MapPin, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ServiceCard = ({
    name,
    rating,
    specialty,
    distance,
    time,
    price,
    image,
    isEmergency = false,
    fullWidth = false,
    onPress
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
            toValue: 0.96,
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

    const cardBg = isDark ? '#18181b' : '#ffffff';
    const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={({ hovered }) => [
                fullWidth ? { width: '100%' } : { width: cardWidth },
                !fullWidth && !isSmallScreen && { maxWidth: 300 },
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
                            source={typeof image === 'string' ? { uri: image } : image}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {/* Subtle gradient overlay */}
                        <View style={styles.imageOverlay} />

                        <View style={[
                            styles.badge,
                            isEmergency ? styles.badgeEmergency : {
                                backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.92)',
                            }
                        ]}>
                            <Star size={11} color={isEmergency ? "#fff" : "#F59E0B"} fill={isEmergency ? "#fff" : "#F59E0B"} />
                            <Text style={[styles.badgeText, { color: isEmergency ? '#fff' : (isDark ? '#fff' : '#1a1a1a') }]}>{rating}</Text>
                        </View>

                        {rating >= 4.8 && (
                            <View style={styles.topRatedBadge}>
                                <Text style={styles.topRatedText}>TOP RATED</Text>
                            </View>
                        )}
                    </View>

                    {/* Content Section */}
                    <View style={styles.content}>
                        <View style={[styles.header, { alignItems: 'flex-start' }]}>
                            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>{name}</Text>
                            {isEmergency && <Zap size={16} color={COLORS.danger} fill={COLORS.danger} style={{ marginTop: 3 }} />}
                        </View>

                        <Text style={[styles.specialty, { color: colors.accent }]}>{specialty}</Text>

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
                            <View
                                style={[styles.bookBtn, { backgroundColor: isEmergency ? COLORS.danger : colors.accent }]}
                            >
                                <Text style={styles.bookBtnText}>Book</Text>
                            </View>
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
        height: 120,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
        ...Platform.select({
            ios: { backdropFilter: 'blur(10px)' },
            default: {},
        }),
    },
    badgeEmergency: {
        backgroundColor: COLORS.danger,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        letterSpacing: -0.2,
    },
    specialty: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 10,
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
        marginTop: 2,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(128,128,128,0.1)',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    bookBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    bookBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.2,
    },
    topRatedBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#1E40AF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#1E40AF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    topRatedText: {
        color: '#ffffff',
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    }
});

export default React.memo(ServiceCard);
