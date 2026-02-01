import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Switch,
    ScrollView,
    Animated
} from 'react-native';
import {
    X, User, LogIn, UserPlus, Info, FileText, ChevronRight, Moon, Sun, LogOut,
    Settings, Bell, HelpCircle, Star, Gift, Zap, TrendingUp, Calendar, MapPin, Shield
} from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.85, 360);

const MenuModal = ({ visible, onClose }) => {
    const router = useRouter();
    const { theme, toggleTheme, colors } = useTheme();
    const { user, logout } = useAuth();
    const isDark = theme === 'dark';
    const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: visible ? 0 : -MENU_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11
        }).start();
    }, [visible]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    // AI-powered recommendations based on user behavior
    const getAIRecommendations = () => {
        if (!user) return null;

        return {
            title: "AI Recommendations",
            items: [
                { icon: TrendingUp, label: "Most Booked: AC Service", count: "3 times" },
                { icon: Calendar, label: "Book Your Regular Service", subtitle: "Due in 5 days" }
            ]
        };
    };

    const MenuItem = ({ icon: Icon, label, onPress, color, badge, subtitle, rightText }) => {
        const iconColor = color || colors.textPrimary;
        return (
            <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.15)' }]}>
                        <Icon size={20} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.menuItemText, { color: iconColor }]}>{label}</Text>
                            {badge && (
                                <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            )}
                        </View>
                        {subtitle && (
                            <Text style={[styles.menuItemSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {rightText && (
                        <Text style={[styles.rightText, { color: colors.textTertiary }]}>{rightText}</Text>
                    )}
                    <ChevronRight size={16} color={colors.textTertiary} />
                </View>
            </TouchableOpacity>
        );
    };

    const aiRecommendations = getAIRecommendations();

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            backgroundColor: colors.bgPrimary,
                            borderColor: isDark ? colors.border : 'transparent',
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.title, { color: colors.textPrimary }]}>Menu</Text>
                                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome Guest'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* User Profile Card */}
                        {user && (
                            <View style={[styles.profileCard, {
                                backgroundColor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.15)',
                                borderColor: colors.accent
                            }]}>
                                <View style={styles.profileRow}>
                                    <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                                        <Text style={styles.avatarText}>
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user.name}</Text>
                                        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                                    </View>
                                    <Star size={16} color={colors.accent} fill={colors.accent} />
                                </View>
                            </View>
                        )}

                        {/* AI Recommendations */}
                        {aiRecommendations && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Zap size={14} color={colors.accent} />
                                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>{aiRecommendations.title}</Text>
                                    <View style={[styles.aiBadge, { backgroundColor: colors.accent }]}>
                                        <Text style={styles.aiBadgeText}>AI</Text>
                                    </View>
                                </View>
                                {aiRecommendations.items.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        icon={item.icon}
                                        label={item.label}
                                        subtitle={item.subtitle || item.count}
                                        onPress={() => { router.push('/bookings'); onClose(); }}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Account Section */}
                        {!user && (
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT</Text>
                                <MenuItem
                                    icon={LogIn}
                                    label="Login or Sign Up"
                                    subtitle="Get personalized recommendations"
                                    onPress={() => { router.push('/auth/login'); onClose(); }}
                                />
                            </View>
                        )}

                        {/* Dashboard Section */}
                        {user && (
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>DASHBOARD</Text>
                                <MenuItem
                                    icon={User}
                                    label="My Profile"
                                    subtitle="Manage your account"
                                    onPress={() => { router.push('/profile'); onClose(); }}
                                />
                                <MenuItem
                                    icon={FileText}
                                    label="My Bookings"
                                    subtitle="View booking history"
                                    badge="3"
                                    onPress={() => { router.push('/bookings'); onClose(); }}
                                />
                                <MenuItem
                                    icon={Gift}
                                    label="Rewards & Offers"
                                    subtitle="Exclusive deals for you"
                                    badge="NEW"
                                    onPress={() => { /* TODO */ onClose(); }}
                                />
                            </View>
                        )}

                        {/* Services Section */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>SERVICES</Text>
                            <MenuItem
                                icon={MapPin}
                                label="Service Areas"
                                subtitle="Check availability in your area"
                                onPress={() => { router.push('/'); onClose(); }}
                            />
                            {user && (
                                <MenuItem
                                    icon={Star}
                                    label="Rate Our Service"
                                    subtitle="Help us improve"
                                    onPress={() => { /* TODO */ onClose(); }}
                                />
                            )}
                        </View>

                        {/* App Section */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>APP</Text>
                            <MenuItem
                                icon={Info}
                                label="About Sheriyakam"
                                subtitle="Learn more about us"
                                onPress={() => { router.push('/about'); onClose(); }}
                            />
                            <MenuItem
                                icon={HelpCircle}
                                label="Help & Support"
                                subtitle="Get assistance"
                                onPress={() => { /* TODO */ onClose(); }}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Privacy & Safety"
                                subtitle="Your data is secure"
                                onPress={() => { /* TODO */ onClose(); }}
                            />
                        </View>

                        {/* Partner Section */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>PARTNER WITH US</Text>
                            <MenuItem
                                icon={TrendingUp}
                                label="Become a Partner"
                                subtitle="Grow your business with us"
                                onPress={() => { router.push('/partner/auth'); onClose(); }}
                            />
                        </View>

                        {/* Settings Section */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>PREFERENCES</Text>
                            {user && (
                                <MenuItem
                                    icon={Bell}
                                    label="Notifications"
                                    subtitle="Manage notification preferences"
                                    rightText="On"
                                    onPress={() => { /* TODO */ onClose(); }}
                                />
                            )}
                            <View style={[styles.menuItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.15)' }]}>
                                        {isDark ? (
                                            <Moon size={20} color={colors.textPrimary} />
                                        ) : (
                                            <Sun size={20} color={colors.textPrimary} />
                                        )}
                                    </View>
                                    <View>
                                        <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>
                                            {isDark ? "Dark Mode" : "Light Mode"}
                                        </Text>
                                        <Text style={[styles.menuItemSubtitle, { color: colors.textTertiary }]}>
                                            Automatic theme switching
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: colors.accent }}
                                    thumbColor={isDark ? "#fff" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleTheme}
                                    value={isDark}
                                />
                            </View>
                        </View>

                        {/* Logout */}
                        {user && (
                            <View style={[styles.section, { borderBottomWidth: 0 }]}>
                                <MenuItem
                                    icon={LogOut}
                                    label="Logout"
                                    subtitle="Sign out of your account"
                                    onPress={handleLogout}
                                    color={colors.danger}
                                />
                            </View>
                        )}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={[styles.version, { color: colors.textTertiary }]}>Sheriyakam v1.0.0</Text>
                            <Text style={[styles.powered, { color: colors.textTertiary }]}>Powered by AI • Made with ❤️</Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: COLORS.bgPrimary,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        borderRightWidth: 1,
        borderColor: COLORS.border,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    closeBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    profileCard: {
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: SPACING.lg,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 12,
        marginTop: 2,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    aiBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 4,
    },
    aiBadgeText: {
        color: '#000',
        fontSize: 9,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 6,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '600',
    },
    menuItemSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    rightText: {
        fontSize: 12,
    },
    footer: {
        marginTop: SPACING.lg,
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    version: {
        color: COLORS.textTertiary,
        fontSize: 12,
        marginBottom: 4,
    },
    powered: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },
});

export default MenuModal;
