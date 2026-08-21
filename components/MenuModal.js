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
    ScrollView,
    Animated,
    Platform
} from 'react-native';
import {
    X, User, LogIn, FileText, ChevronRight, Moon, Sun, LogOut,
    Settings, Bell, HelpCircle, Zap, Shield, Crown, Search,
    ShoppingCart, Phone, Scale, ShieldAlert, Sparkles, Briefcase,
    RefreshCw, LayoutDashboard
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.88, 380);

export default function MenuModal({ visible, onClose }) {
    const router = useRouter();
    const { theme, toggleTheme, colors } = useTheme();
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const isDark = theme === 'dark';
    const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: visible ? 0 : -MENU_WIDTH,
            useNativeDriver: true,
            friction: 8,
            tension: 65
        }).start();
    }, [visible]);

    const navigateTo = (route) => {
        onClose();
        setTimeout(() => {
            router.push(route);
        }, 150);
    };

    const handleLogout = async () => {
        onClose();
        try {
            await logout();
            router.replace('/auth/login');
        } catch (e) {
            console.error('Logout error:', e);
        }
    };

    const MenuItem = ({ icon: Icon, label, subtitle, badge, onPress, isDestructive, highlight }) => (
        <TouchableOpacity
            style={[
                styles.menuItem,
                highlight && { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)' }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <View style={[
                styles.iconContainer,
                { backgroundColor: highlight ? colors.accent + '20' : (isDark ? '#18181B' : '#F4F4F5') }
            ]}>
                <Icon size={18} color={isDestructive ? '#EF4444' : (highlight ? colors.accent : colors.textPrimary)} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[
                    styles.menuLabel,
                    { color: isDestructive ? '#EF4444' : colors.textPrimary },
                    highlight && { fontWeight: '700', color: colors.accent }
                ]}>
                    {label}
                </Text>
                {subtitle ? (
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                        {subtitle}
                    </Text>
                ) : null}
            </View>
            {badge ? (
                <View style={[styles.badge, { backgroundColor: highlight ? colors.accent : colors.surface }]}>
                    <Text style={[styles.badgeText, { color: highlight ? '#FFFFFF' : colors.accent }]}>
                        {badge}
                    </Text>
                </View>
            ) : (
                <ChevronRight size={16} color={colors.textTertiary} />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
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
                            backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.title, { color: colors.textPrimary }]}>Sheriyakam</Text>
                                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    {user ? `Namaskaram, ${user.name ? user.name.split(' ')[0] : 'User'}` : 'Certified Electrical Services'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close Menu">
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* SECTION 1: DISCOVER & BOOK */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>DISCOVER & BOOK</Text>
                            <MenuItem
                                icon={Search}
                                label="Search & Book Services"
                                subtitle="Instant rate card & bookings"
                                onPress={() => navigateTo('/search')}
                            />
                            <MenuItem
                                icon={ShoppingCart}
                                label="Service Cart"
                                subtitle="Review parts & checkout"
                                badge={itemCount > 0 ? `${itemCount}` : null}
                                onPress={() => navigateTo('/cart')}
                            />
                            <MenuItem
                                icon={Crown}
                                label="Sheriyakam VIP Club"
                                subtitle="₹0 visit fee & priority dispatch"
                                badge="VIP"
                                onPress={() => navigateTo('/paywall')}
                            />
                        </View>

                        {/* SECTION 2: ACCOUNT & ACTIVITY */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT & ACTIVITY</Text>
                            {user ? (
                                <>
                                    <MenuItem
                                        icon={User}
                                        label="My Profile"
                                        subtitle={user.email}
                                        onPress={() => navigateTo('/profile')}
                                    />
                                    <MenuItem
                                        icon={FileText}
                                        label="My Bookings"
                                        subtitle="Live dispatch tracking & invoices"
                                        onPress={() => navigateTo('/bookings')}
                                    />
                                    <MenuItem
                                        icon={Bell}
                                        label="Notifications"
                                        subtitle="Booking alerts & updates"
                                        onPress={() => navigateTo('/notifications')}
                                    />
                                    <MenuItem
                                        icon={Settings}
                                        label="Settings & 2FA"
                                        subtitle="Security and preferences"
                                        onPress={() => navigateTo('/settings')}
                                    />
                                </>
                            ) : (
                                <>
                                    <MenuItem
                                        icon={LogIn}
                                        label="Login / Sign Up"
                                        subtitle="Track bookings and warranties"
                                        highlight
                                        onPress={() => navigateTo('/auth/login')}
                                    />
                                    <MenuItem
                                        icon={Zap}
                                        label="How It Works"
                                        subtitle="Onboarding walkthrough"
                                        onPress={() => navigateTo('/onboarding')}
                                    />
                                </>
                            )}
                        </View>

                        {/* SECTION 3: SAFETY & CUSTOMER SUPPORT */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>SUPPORT & SAFETY</Text>
                            <MenuItem
                                icon={HelpCircle}
                                label="Help Center & FAQs"
                                subtitle="Instant guides & support"
                                onPress={() => navigateTo('/help')}
                            />
                            <MenuItem
                                icon={Phone}
                                label="24/7 Support & Emergency Desk"
                                subtitle="Kozhikode helpline assistance"
                                onPress={() => navigateTo('/contact')}
                            />
                            <MenuItem
                                icon={ShieldAlert}
                                label="₹5 Lakh Property Damage Claim"
                                subtitle="Emergency fire & burnout desk"
                                badge="2-Hr SLA"
                                onPress={() => navigateTo('/damage-claim')}
                            />
                        </View>

                        {/* SECTION 4: LEGAL & POLICIES */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>LEGAL & POLICIES</Text>
                            <MenuItem
                                icon={FileText}
                                label="Terms of Service"
                                subtitle="₹5,000 liability cap & rules"
                                onPress={() => navigateTo('/terms')}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Privacy Policy"
                                subtitle="DPDP Act 2023 Section 5 Notice"
                                onPress={() => navigateTo('/privacy')}
                            />
                            <MenuItem
                                icon={RefreshCw}
                                label="Cancellation & Refund Rules"
                                subtitle="Fair travel allowance matrix"
                                onPress={() => navigateTo('/cancellation-policy')}
                            />
                            <MenuItem
                                icon={Scale}
                                label="Grievance Redressal Officer"
                                subtitle="Rule 3(2) IT Rules 2021"
                                badge="24-Hr Ack"
                                onPress={() => navigateTo('/grievance')}
                            />
                        </View>

                        {/* SECTION 5: PARTNERS & MANAGEMENT */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.accent }]}>PROFESSIONALS & OPERATIONS</Text>
                            <MenuItem
                                icon={Briefcase}
                                label="Partner / Electrician Portal"
                                subtitle="Jobs, earnings & safety SLA"
                                onPress={() => navigateTo('/partner')}
                            />
                            <MenuItem
                                icon={LayoutDashboard}
                                label="Admin & Operations Console"
                                subtitle="Dispatch, webhooks & analytics"
                                badge="Admin"
                                onPress={() => navigateTo('/admin')}
                            />
                        </View>

                        {/* Theme Toggle & Logout */}
                        <View style={[styles.footerSection, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <TouchableOpacity
                                style={[styles.themeBtn, { backgroundColor: isDark ? '#18181B' : '#F4F4F5' }]}
                                onPress={toggleTheme}
                                accessibilityRole="button"
                                accessibilityLabel="Toggle theme"
                            >
                                {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color={colors.textPrimary} />}
                                <Text style={[styles.themeBtnText, { color: colors.textPrimary }]}>
                                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                </Text>
                            </TouchableOpacity>

                            {user ? (
                                <TouchableOpacity
                                    style={[styles.logoutBtn, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                    onPress={handleLogout}
                                    accessibilityRole="button"
                                    accessibilityLabel="Log out"
                                >
                                    <LogOut size={16} color="#EF4444" />
                                    <Text style={styles.logoutBtnText}>Log Out</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        borderRightWidth: 1,
        zIndex: 10,
        ...Platform.select({
            web: {
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
            },
            default: {
                elevation: 16,
            }
        })
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 24,
        paddingBottom: 18,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    closeBtn: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
    },
    section: {
        paddingTop: 16,
        paddingHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 10.5,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 6,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 2,
    },
    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 13.5,
        fontWeight: '600',
    },
    menuSubtitle: {
        fontSize: 11,
        marginTop: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginRight: 4,
    },
    badgeText: {
        fontSize: 10.5,
        fontWeight: '700',
    },
    footerSection: {
        marginTop: 16,
        paddingTop: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        gap: 10,
    },
    themeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 11,
        borderRadius: 12,
        gap: 8,
    },
    themeBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
    },
    logoutBtnText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '600',
    },
});
