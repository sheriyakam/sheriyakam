import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, X, User, Users } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { getCurrentPartner, getSupervisorForPartner } from '../constants/partnerStore';

const ChatWidget = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const scaleAnim = useState(new Animated.Value(0))[0];

    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const toggleMenu = () => {
        if (isOpen) {
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => setIsOpen(false));
        } else {
            setIsOpen(true);
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    };

    const navigateToChat = (type) => {
        const name = type === 'supervisor' ? supervisor.name : 'Community';
        const subtitle = type === 'supervisor' ? `Supervisor - ${supervisor.taluk}` : 'Community Group';

        router.push({
            pathname: '/partner/chat',
            params: { type, name, subtitle }
        });
        toggleMenu();
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Expanded Menu */}
            {isOpen && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigateToChat('community')}
                    >
                        <Animated.View style={[styles.menuLabelContainer, { opacity: scaleAnim, transform: [{ scale: scaleAnim }] }]}>
                            <Text style={styles.menuLabel}>Write Community</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuBtn, { backgroundColor: COLORS.accent, transform: [{ scale: scaleAnim }] }]}>
                            <Users size={20} color="#fff" />
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigateToChat('supervisor')}
                    >
                        <Animated.View style={[styles.menuLabelContainer, { opacity: scaleAnim, transform: [{ scale: scaleAnim }] }]}>
                            <Text style={styles.menuLabel}>Write Supervisor</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuBtn, { backgroundColor: COLORS.primary, transform: [{ scale: scaleAnim }] }]}>
                            <User size={20} color="#fff" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Main FAB */}
            <TouchableOpacity
                style={[styles.fab, isOpen && styles.fabOpen]}
                onPress={toggleMenu}
            >
                {isOpen ? (
                    <X size={28} color="#fff" />
                ) : (
                    <MessageCircle size={28} color="#fff" fill="#fff" />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        alignItems: 'flex-end',
    },
    menuContainer: {
        marginBottom: 16,
        alignItems: 'flex-end',
        gap: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    menuLabelContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    menuLabel: {
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontSize: 14,
    },
    menuBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    fabOpen: {
        backgroundColor: COLORS.textSecondary,
    },
});

export default ChatWidget;
