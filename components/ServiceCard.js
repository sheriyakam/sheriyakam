import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Star, Clock, MapPin, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

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
    const isSmallScreen = width < 768;
    const cardWidth = isSmallScreen
        ? (width - SPACING.md * 3) / 2
        : (width - SPACING.md * 4) / 4;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.card,
                fullWidth ? { width: '100%' } : { width: cardWidth },
                !fullWidth && !isSmallScreen && { maxWidth: 300 }, // Max width for desktop cards
                isEmergency && styles.emergencyCard
            ]}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={[styles.badge, isEmergency ? styles.badgeEmergency : styles.badgeRegular]}>
                    <Star size={12} color={isEmergency ? "#fff" : "#000"} fill={isEmergency ? "#fff" : "#000"} />
                    <Text style={[styles.badgeText, isEmergency && { color: '#fff' }]}>{rating}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text numberOfLines={1} style={styles.name}>{name}</Text>
                    {isEmergency && <Zap size={16} color={COLORS.danger} fill={COLORS.danger} />}
                </View>

                <Text numberOfLines={1} style={styles.specialty}>{specialty}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <MapPin size={12} color={COLORS.textTertiary} />
                        <Text style={styles.metaText}>{distance}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={12} color={COLORS.textTertiary} />
                        <Text style={styles.metaText}>{time}</Text>
                    </View>
                </View>

                {/* Price & Action */}
                <View style={styles.footer}>
                    <Text style={styles.price}>₹{price}</Text>
                    <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
                        <Text style={styles.bookBtnText}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
    emergencyCard: {
        borderColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
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
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeRegular: {
        backgroundColor: COLORS.gold,
    },
    badgeEmergency: {
        backgroundColor: COLORS.danger,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
    },
    specialty: {
        fontSize: 12,
        color: COLORS.accent,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    bookBtn: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    bookBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default ServiceCard;
