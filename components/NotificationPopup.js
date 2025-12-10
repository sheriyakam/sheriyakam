import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { MessageSquare, X, Users, User } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

const NotificationPopup = ({ visible, title, message, type, onPress, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: SPACING.lg + (Platform.OS === 'ios' ? 40 : 0), // Adjust for status bar
                useNativeDriver: true,
                speed: 12,
                bounciness: 8
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -150,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

    if (!visible && slideAnim._value === -150) return null;

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity style={styles.content} onPress={onPress}>
                <View style={[styles.iconContainer, { backgroundColor: type === 'community' ? COLORS.accent : COLORS.primary }]}>
                    {type === 'community' ? <Users size={20} color="#fff" /> : <User size={20} color="#fff" />}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{message}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <X size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: SPACING.md,
        right: SPACING.md,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 2000,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    closeBtn: {
        padding: 4,
        marginTop: 2,
    },
});

export default NotificationPopup;
