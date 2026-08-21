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
    RefreshCw, LayoutDashboard, Layers, Calendar, Users,
    TrendingUp, Split, Webhook, Award, HardHat, Clock, MessageSquare
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.90, 390);

const PERSONA_TABS = [
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'partner', label: 'Partner', icon: HardHat },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard },
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
                                {user ? `Namaskaram, ${user.name ? user.name.split(' ')[0] : 'User'}` : 'Certified Electrical Services'}
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

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT & BOOKINGS</Text>
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
                                                subtitle="Live tracking & GST tax invoices"
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
                                                subtitle="Customer onboarding walkthrough"
                                                onPress={() => navigateTo('/onboarding')}
                                            />
                                        </>
                                    )}
                                </View>

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
                                        label="24/7 Helpline & Contact"
                                        subtitle="Kozhikode support desk"
                                        onPress={() => navigateTo('/contact')}
                                    />
                                    <MenuItem
                                        icon={ShieldAlert}
                                        label="₹5 Lakh Damage Claim Desk"
                                        subtitle="Emergency on-site fire & burnout"
                                        badge="2-Hr SLA"
                                        onPress={() => navigateTo('/damage-claim')}
                                    />
                                </View>
                            </>
                        )}

                        {/* ─────────────────── 2. PARTNER PERSONA ─────────────────── */}
                        {activePersona === 'partner' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>TECHNICIAN DISPATCH & EARNINGS</Text>
                                    <MenuItem
                                        icon={Briefcase}
                                        label="Partner Dashboard"
                                        subtitle="Live job leads & map routing"
                                        highlight
                                        onPress={() => navigateTo('/partner')}
                                    />
                                    <MenuItem
                                        icon={MessageSquare}
                                        label="Customer Chat & Masked Calls"
                                        subtitle="VoIP telephone bridge"
                                        onPress={() => navigateTo('/partner/messages')}
                                    />
                                    <MenuItem
                                        icon={Zap}
                                        label="Active Job Workflow"
                                        subtitle="Check-in & completion OTP"
                                        onPress={() => navigateTo('/partner/job/JOB-101')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>COMPLIANCE & SAFETY</Text>
                                    <MenuItem
                                        icon={FileText}
                                        label="Independent Partner SLA"
                                        subtitle="85% payout & 15% commission terms"
                                        badge="e-Sign"
                                        onPress={() => navigateTo('/partner/agreement')}
                                    />
                                    <MenuItem
                                        icon={HardHat}
                                        label="Safety & PPE Onboarding"
                                        subtitle="e-Shram UAN & 5-point PPE audit"
                                        badge="KSELB"
                                        onPress={() => navigateTo('/partner/onboarding-checklist')}
                                    />
                                    <MenuItem
                                        icon={Award}
                                        label="BIS Material Standards"
                                        subtitle="100% genuine ISI certified spares"
                                        onPress={() => navigateTo('/materials-safety')}
                                    />
                                </View>
                            </>
                        )}

                        {/* ─────────────────── 3. ADMIN PERSONA ─────────────────── */}
                        {activePersona === 'admin' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>OPERATIONS & DISPATCH</Text>
                                    <MenuItem
                                        icon={LayoutDashboard}
                                        label="Admin Dashboard"
                                        subtitle="Central metrics & quick controls"
                                        highlight
                                        onPress={() => navigateTo('/admin')}
                                    />
                                    <MenuItem
                                        icon={Layers}
                                        label="Live Dispatch Kanban"
                                        subtitle="Real-time order board"
                                        onPress={() => navigateTo('/admin/kanban')}
                                    />
                                    <MenuItem
                                        icon={Calendar}
                                        label="Contractor Schedule Gantt"
                                        subtitle="Visual zone timeline"
                                        onPress={() => navigateTo('/admin/schedule')}
                                    />
                                    <MenuItem
                                        icon={Users}
                                        label="User & Partner Directory"
                                        subtitle="KYC & license approvals"
                                        onPress={() => navigateTo('/admin/users')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>FINANCIAL & API ENGINES</Text>
                                    <MenuItem
                                        icon={Split}
                                        label="Split-Payout API & Escrow"
                                        subtitle="Razorpay Route payload engine"
                                        badge="Paise API"
                                        onPress={() => navigateTo('/admin/split-payouts')}
                                    />
                                    <MenuItem
                                        icon={Webhook}
                                        label="Payment Webhook Engine"
                                        subtitle="Dispute lockdown & events"
                                        badge="HMAC-256"
                                        onPress={() => navigateTo('/admin/webhooks')}
                                    />
                                    <MenuItem
                                        icon={TrendingUp}
                                        label="Analytics & Revenue Growth"
                                        subtitle="Financial and SLA reports"
                                        onPress={() => navigateTo('/admin/analytics')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>FOUNDER & SUPPORT TOOLS</Text>
                                    <MenuItem
                                        icon={Sparkles}
                                        label="Founder Legal & Tech Roadmap"
                                        subtitle="4-phase pre-launch checklist"
                                        badge="4 Steps"
                                        onPress={() => navigateTo('/founder-checklist')}
                                    />
                                    <MenuItem
                                        icon={Award}
                                        label="Startup India (DPIIT) Hub"
                                        subtitle="80-IAC tax holiday & grants"
                                        badge="Tax Relief"
                                        onPress={() => navigateTo('/startup-benefits')}
                                    />
                                    <MenuItem
                                        icon={HelpCircle}
                                        label="Support Dispute SOP"
                                        subtitle="Agent de-escalation playbooks"
                                        onPress={() => navigateTo('/dispute-sop')}
                                    />
                                </View>
                            </>
                        )}

                        {/* ─────────────────── 4. LEGAL PERSONA ─────────────────── */}
                        {activePersona === 'legal' && (
                            <>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>CONSUMER LEGAL CONTRACTS</Text>
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
                                        label="Cancellation & Refund Policy"
                                        subtitle="Doorstep travel allowance matrix"
                                        onPress={() => navigateTo('/cancellation-policy')}
                                    />
                                    <MenuItem
                                        icon={Scale}
                                        label="Grievance Redressal Desk"
                                        subtitle="Rule 3(2) IT Rules 2021"
                                        badge="24-Hr Ack"
                                        onPress={() => navigateTo('/grievance')}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>STATUTORY & CYBER FRAMEWORKS</Text>
                                    <MenuItem
                                        icon={Scale}
                                        label="Compliance & DPDP Hub"
                                        subtitle="National & Kerala frameworks"
                                        badge="DPDP 2023"
                                        onPress={() => navigateTo('/compliance')}
                                    />
                                    <MenuItem
                                        icon={Clock}
                                        label="Data Retention Schedule"
                                        subtitle="CERT-In 1-year logs & GPS purge"
                                        onPress={() => navigateTo('/data-retention')}
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
