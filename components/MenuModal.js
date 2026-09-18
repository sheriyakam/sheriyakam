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
    Settings, HelpCircle, Zap, Shield, Search,
    ShoppingCart, Phone, Scale, HardHat, Award, Building2,
    Sparkles, AlertTriangle, Briefcase, CheckCircle2
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.90, 390);

const PERSONA_TABS = [
    { id: 'customer', label: 'Services', icon: User },
    { id: 'business', label: 'B2B & Care', icon: Building2 },
    { id: 'legal', label: 'Legal', icon: Scale },
];

export default function MenuModal({ visible, onClose }) {
    const router = useRouter();
    const { theme, toggleTheme, colors } = useTheme();
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const isDark = theme === 'dark';
    const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));
    const [activePersona, setActivePersona] = useState('customer');

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
                <View style={[styles.badge, { backgroundColor: highlight ? colors.accent : (isDark ? '#27272A' : '#E4E4E7') }]}>
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
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Sheriyakam</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {user ? `Namaskaram, ${user.name ? user.name.split(' ')[0] : 'User'}` : 'Kerala Home-Services Platform'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close Menu">
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Persona Tabs / Segment Switcher */}
                    <View style={[styles.personaTabBar, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7', backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
                        {PERSONA_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activePersona === tab.id;
                            return (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[
                                        styles.personaTabBtn,
                                        isActive && { backgroundColor: colors.accent, borderColor: colors.accent }
                                    ]}
                                    onPress={() => setActivePersona(tab.id)}
                                    activeOpacity={0.7}
                                    accessibilityRole="tab"
                                    accessibilityState={{ selected: isActive }}
                                >
                                    <Icon size={14} color={isActive ? '#FFFFFF' : colors.textSecondary} />
                                    <Text style={[
                                        styles.personaTabText,
                                        { color: isActive ? '#FFFFFF' : colors.textSecondary }
                                    ]}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>

                        {/* ─────────────────── 1. CUSTOMER PERSONA ─────────────────── */}
                        {activePersona === 'customer' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>MARKETPLACE SERVICES</Text>
                                    <MenuItem
                                        icon={Zap}
                                        label="All Services & Rate Cards"
                                        subtitle="Browse full multi-category directory"
                                        highlight
                                        onPress={() => navigateTo('/services')}
                                    />
                                    <MenuItem
                                        icon={AlertTriangle}
                                        label="24/7 Emergency Triage"
                                        subtitle="90-min urgent dispatch across Kerala"
                                        badge="24/7"
                                        onPress={() => navigateTo('/emergency-electrician')}
                                    />
                                    <MenuItem
                                        icon={ShoppingCart}
                                        label="Cart & Checkout"
                                        subtitle="Review selected services & spares"
                                        badge={itemCount > 0 ? `${itemCount}` : null}
                                        onPress={() => navigateTo('/cart')}
                                    />
                                    <MenuItem
                                        icon={Search}
                                        label="Search Directory"
                                        subtitle="Find fan, MCB, AC & wiring repairs"
                                        onPress={() => navigateTo('/search')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT & TRACKING</Text>
                                    <MenuItem
                                        icon={FileText}
                                        label="Customer Dashboard"
                                        subtitle="Live GPS tracking, OTP & GST Invoices"
                                        onPress={() => navigateTo('/dashboard')}
                                    />
                                    {user ? (
                                        <>
                                            <MenuItem
                                                icon={User}
                                                label="My Profile"
                                                subtitle={user.email}
                                                onPress={() => navigateTo('/profile')}
                                            />
                                            <MenuItem
                                                icon={Settings}
                                                label="Settings"
                                                subtitle="Account & app preferences"
                                                onPress={() => navigateTo('/settings')}
                                            />
                                        </>
                                    ) : (
                                        <MenuItem
                                            icon={LogIn}
                                            label="Login / Sign Up"
                                            subtitle="Save bookings & warranty cards"
                                            highlight
                                            onPress={() => navigateTo('/auth/login')}
                                        />
                                    )}
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>PORTFOLIO & TRUST</Text>
                                    <MenuItem
                                        icon={Award}
                                        label="Work Portfolio & Gallery"
                                        subtitle="Before & after installations in Kerala"
                                        onPress={() => navigateTo('/work')}
                                    />
                                    <MenuItem
                                        icon={Shield}
                                        label="30-Day Workmanship Warranty"
                                        subtitle="Zero-cost rework policy"
                                        onPress={() => navigateTo('/refund-policy')}
                                    />
                                    <MenuItem
                                        icon={Phone}
                                        label="24/7 Helpline Support"
                                        subtitle="+91 495 280 0000"
                                        onPress={() => navigateTo('/contact')}
                                    />
                                </View>
                            </>
                        )}

                        {/* ─────────────────── 2. BUSINESS & CARE PERSONA ─────────────────── */}
                        {activePersona === 'business' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>ANNUAL CONTRACTS & B2B</Text>
                                    <MenuItem
                                        icon={Shield}
                                        label="Sheriyakam Care AMC"
                                        subtitle="Preventive care plans for homes & shops"
                                        highlight
                                        onPress={() => navigateTo('/amc')}
                                    />
                                    <MenuItem
                                        icon={Building2}
                                        label="Commercial Contracting"
                                        subtitle="Offices, clinics & apartment switchgear"
                                        highlight
                                        onPress={() => navigateTo('/commercial')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>TECHNICIAN NETWORK</Text>
                                    <MenuItem
                                        icon={HardHat}
                                        label="Partner Technician Portal"
                                        subtitle="KSELB wireman jobs & dispatch dashboard"
                                        onPress={() => navigateTo('/partner')}
                                    />
                                    <MenuItem
                                        icon={FileText}
                                        label="Partner Agreement & Payouts"
                                        subtitle="Fair transparent revenue sharing"
                                        onPress={() => navigateTo('/partner/agreement')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>FREE ELECTRICIAN CAREER TOOL</Text>
                                    <MenuItem
                                        icon={Sparkles}
                                        label="CV & LinkedIn Optimizer"
                                        subtitle="Gulf & industrial electrical CV tailoring"
                                        badge="FREE"
                                        onPress={() => navigateTo('/cv-linkedin-optimize')}
                                    />
                                </View>
                            </>
                        )}

                        {/* ─────────────────── 3. LEGAL PERSONA ─────────────────── */}
                        {activePersona === 'legal' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>CONSUMER LEGAL CONTRACTS</Text>
                                    <MenuItem
                                        icon={FileText}
                                        label="Terms of Service"
                                        subtitle="Customer terms & liability rules"
                                        onPress={() => navigateTo('/terms')}
                                    />
                                    <MenuItem
                                        icon={Shield}
                                        label="Privacy Policy"
                                        subtitle="Data protection & privacy notice"
                                        onPress={() => navigateTo('/privacy')}
                                    />
                                    <MenuItem
                                        icon={Scale}
                                        label="Grievance Redressal Desk"
                                        subtitle="Statutory escalation & support"
                                        onPress={() => navigateTo('/grievance')}
                                    />
                                    <MenuItem
                                        icon={Award}
                                        label="Materials & Safety Policy"
                                        subtitle="BIS/ISI standard compliance"
                                        onPress={() => navigateTo('/materials-safety')}
                                    />
                                </View>
                            </>
                        )}

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
        paddingBottom: 14,
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
    personaTabBar: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        gap: 6,
    },
    personaTabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 4,
    },
    personaTabText: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    section: {
        paddingTop: 14,
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
        paddingVertical: 9,
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
