import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Wrench, History, User } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { colors, theme } = useTheme();

    // Hide BottomNav on admin, partner, and login pages
    const hiddenPaths = ['/admin', '/partner', '/auth/login', '/about'];
    const isHidden = hiddenPaths.some(path => pathname.startsWith(path));

    if (isHidden) return null;

    const isDark = theme === 'dark';

    const navItems = [
        {
            name: 'Home',
            icon: Home,
            path: '/',
            action: 'navigate',
        },
        {
            name: 'Services',
            icon: Wrench,
            path: '/',
            action: 'scrollToServices',
        },
        {
            name: 'History',
            icon: History,
            path: '/bookings',
            action: 'navigate',
        },
        {
            name: user ? 'Profile' : 'Login',
            icon: User,
            path: user ? '/profile' : '/auth/login',
            action: 'navigate',
        },
    ];

    const getIsActive = (item) => {
        if (item.name === 'Services') return false; // Services never stays "active"
        if (item.path === '/') return pathname === '/';
        return pathname === item.path;
    };

    const handlePress = (item) => {
        if (item.action === 'scrollToServices' && pathname === '/') {
            // Already on home — the scroll-to-services is handled by the parent
            // For now, just navigate to home (the services section is right there)
            return;
        }
        router.push(item.path);
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? 'rgba(9,9,11,0.96)' : 'rgba(255,255,255,0.97)',
                borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            }
        ]}>
            <View style={styles.navBar}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = getIsActive(item);

                    const activeColor = colors.accent;
                    const inactiveColor = isDark ? '#52525b' : '#a1a1aa';

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => handlePress(item)}
                            activeOpacity={0.6}
                        >
                            {/* Active indicator dot */}
                            {isActive && (
                                <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
                            )}

                            {/* Active pill background */}
                            {isActive && (
                                <View style={[
                                    styles.activePill,
                                    { backgroundColor: activeColor + '12' }
                                ]} />
                            )}

                            <View style={styles.iconWrap}>
                                <Icon
                                    size={21}
                                    color={isActive ? activeColor : inactiveColor}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                    fill={isActive && item.name === 'Home' ? activeColor : 'none'}
                                />
                            </View>

                            <Text style={[
                                styles.navText,
                                {
                                    color: isActive ? activeColor : inactiveColor,
                                    fontWeight: isActive ? '700' : '500',
                                }
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
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'ios' ? 26 : 8,
        paddingTop: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 12,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 16,
        position: 'relative',
        minWidth: 64,
    },
    activeIndicator: {
        position: 'absolute',
        top: -7,
        width: 20,
        height: 3,
        borderRadius: 2,
    },
    activePill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 4,
        right: 4,
        borderRadius: 14,
    },
    iconWrap: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 2,
        letterSpacing: 0.3,
    },
});
