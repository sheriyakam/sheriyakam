import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Calendar, User } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    // Hide BottomNav on admin, partner, and login pages
    const hiddenPaths = ['/admin', '/partner', '/auth/login'];
    const isHidden = hiddenPaths.some(path => pathname.startsWith(path));

    if (isHidden) return null;

    const navItems = [
        {
            name: 'Home',
            icon: Home,
            path: '/',
        },
        {
            name: 'Bookings',
            icon: Calendar,
            path: '/bookings',
        },
        {
            name: user ? 'Account' : 'Login',
            icon: User,
            path: user ? '/profile' : '/auth/login',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => router.push(item.path)}
                            activeOpacity={0.7}
                        >
                            <Icon 
                                size={24} 
                                color={isActive ? COLORS.accent : COLORS.textSecondary} 
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <Text style={[
                                styles.navText,
                                isActive && styles.navTextActive
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#18181b',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    navText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 4,
        fontWeight: '500',
    },
    navTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
});
