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
    X, User, LogIn, Info, FileText, ChevronRight, Moon, Sun, LogOut,
    Settings, Bell, HelpCircle, Star, Gift, Zap, TrendingUp, Calendar, MapPin, Shield,
    Crown, Search, ShoppingCart, Activity, Briefcase, DollarSign, Award, CheckCircle2,
    Users, Newspaper, BookOpen, Layers, Phone, Key, Scale, ShieldCheck, RefreshCw,
    Clock, ShieldAlert, Sparkles, FileCheck, Headphones, Split, Webhook
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
            tension: 65,
            friction: 11
        }).start();
    }, [visible]);

    const navigateTo = (path) => {
        onClose();
        router.push(path);
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    const MenuItem = ({ icon: Icon, label, onPress, color, badge, subtitle, rightText }) => {
        const iconColor = color || colors.textPrimary;
        return (
            <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: isDark ? '#18181B' : '#F9FAFB' }]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#27272A' : '#EFF6FF' }]}>
                        <Icon size={18} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>{label}</Text>
                            {badge && (
                                <View style={[styles.badge, { backgroundColor: badge === 'VIP' ? '#F59E0B' : colors.accent }]}>
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            )}
                        </View>
                        {subtitle && (
                            <Text style={[styles.menuItemSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {rightText && (
                        <Text style={[styles.rightText, { color: colors.textTertiary }]}>{rightText}</Text>
                    )}
                    <ChevronRight size={14} color={colors.textTertiary} />
                </View>
            </TouchableOpacity>
        );
    };

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
                            backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.title, { color: colors.textPrimary }]}>Sheriyakam</Text>
                                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    {user ? `Namaskaram, ${user.name.split(' ')[0]}` : 'Certified Electrical Services'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Customer Quick Links */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>DISCOVER & BOOK</Text>
                            <MenuItem
                                icon={Search}
                                label="Search & Filter Services"
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
                                subtitle="₹0 visit fee protection"
                                badge="VIP"
                                onPress={() => navigateTo('/paywall')}
                            />
                        </View>

                        {/* Account & History */}
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
                                        subtitle="Live dispatch tracking"
                                        onPress={() => navigateTo('/bookings')}
                                    />
                                    <MenuItem
                                        icon={Bell}
                                        label="Notification Center"
                                        subtitle="Alerts and offers"
                                        onPress={() => navigateTo('/notifications')}
                                    />
                                    <MenuItem
                                        icon={Gift}
                                        label="Invite & Earn ₹100"
                                        subtitle="Share referral code"
                                        badge="₹100"
                                        onPress={() => navigateTo('/invite')}
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
                                        onPress={() => navigateTo('/auth/login')}
                                    />
                                    <MenuItem
                                        icon={Zap}
                                        label="Customer Onboarding"
                                        subtitle="Feature walkthrough"
                                        onPress={() => navigateTo('/onboarding')}
                                    />
                                </>
                            )}
                        </View>

                        {/* Public Marketing & Trust */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>STANDARDS & PRICING</Text>
                            <MenuItem
                                icon={Zap}
                                label="Features & Standards"
                                subtitle="30-min rapid emergency"
                                onPress={() => navigateTo('/features')}
                            />
                            <MenuItem
                                icon={DollarSign}
                                label="Tariff & Fixed Rates"
                                subtitle="Transparent labor rate card"
                                onPress={() => navigateTo('/pricing')}
                            />
                            <MenuItem
                                icon={Scale}
                                label="Why Sheriyakam"
                                subtitle="Comparison vs alternatives"
                                onPress={() => navigateTo('/compare')}
                            />
                            <MenuItem
                                icon={Star}
                                label="Customer Reviews"
                                subtitle="4.9★ from 1,480+ fixes"
                                onPress={() => navigateTo('/testimonials')}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Safety & Insurance"
                                subtitle="₹5,00,000 protection"
                                onPress={() => navigateTo('/security')}
                            />
                        </View>

                        {/* Admin & Dispatcher Control Center */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.accent }]}>ADMIN & ENTERPRISE HUB</Text>
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
                                subtitle="KYC & license vetting"
                                onPress={() => navigateTo('/admin/users')}
                            />
                            <MenuItem
                                icon={TrendingUp}
                                label="Analytics & Growth"
                                subtitle="Revenue and SLAs"
                                onPress={() => navigateTo('/admin/analytics')}
                            />
                            <MenuItem
                                icon={Key}
                                label="API Keys & Webhooks"
                                subtitle="REST integration tokens"
                                onPress={() => navigateTo('/admin/api-keys')}
                            />
                            <MenuItem
                                icon={Activity}
                                label="Gateways & Integrations"
                                subtitle="Supabase, Razorpay, Twilio"
                                onPress={() => navigateTo('/admin/integrations')}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Security Audit Trail"
                                subtitle="Immutable event logging"
                                onPress={() => navigateTo('/admin/audit-log')}
                            />
                        </View>

                        {/* Company & Community */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>COMPANY & RESOURCES</Text>
                            <MenuItem
                                icon={BookOpen}
                                label="Electrical Safety Blog"
                                subtitle="Monsoon & inverter guides"
                                onPress={() => navigateTo('/blog')}
                            />
                            <MenuItem
                                icon={MapPin}
                                label="District Waitlist"
                                subtitle="Vote for next city"
                                onPress={() => navigateTo('/waitlist')}
                            />
                            <MenuItem
                                icon={Award}
                                label="Affiliate Program"
                                subtitle="Earn 20% commissions"
                                onPress={() => navigateTo('/affiliate')}
                            />
                            <MenuItem
                                icon={Newspaper}
                                label="Press & Media Kit"
                                subtitle="Brand assets and news"
                                onPress={() => navigateTo('/press')}
                            />
                            <MenuItem
                                icon={Users}
                                label="Meet the Team"
                                subtitle="Engineers & master wiremen"
                                onPress={() => navigateTo('/team')}
                            />
                            <MenuItem
                                icon={Briefcase}
                                label="Careers & Jobs"
                                subtitle="Join our field crew"
                                onPress={() => navigateTo('/careers')}
                            />
                            <MenuItem
                                icon={Activity}
                                label="Live System Status"
                                subtitle="99.99% uptime telemetry"
                                onPress={() => navigateTo('/status')}
                            />
                            <MenuItem
                                icon={HelpCircle}
                                label="Help Center & FAQs"
                                subtitle="Instant guides & answers"
                                onPress={() => navigateTo('/help')}
                            />
                            <MenuItem
                                icon={Phone}
                                label="Contact & Emergency Desk"
                                subtitle="24/7 Kozhikode helpline"
                                onPress={() => navigateTo('/contact')}
                            />
                        </View>

                        {/* Legal & Statutory Compliance */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>LEGAL & STATUTORY COMPLIANCE</Text>
                            <MenuItem
                                icon={Scale}
                                label="Compliance & DPDP Hub"
                                subtitle="National & Kerala frameworks"
                                badge="DPDP 2023"
                                onPress={() => navigateTo('/compliance')}
                            />
                            <MenuItem
                                icon={ShieldCheck}
                                label="Grievance Redressal Officer"
                                subtitle="Rule 3(2) IT Rules 2021"
                                badge="24-Hr SLA"
                                onPress={() => navigateTo('/grievance')}
                            />
                            <MenuItem
                                icon={RefreshCw}
                                label="Cancellation & Refund Rules"
                                subtitle="Fair travel allowance matrix"
                                onPress={() => navigateTo('/cancellation-policy')}
                            />
                            <MenuItem
                                icon={Award}
                                label="BIS Material Standards"
                                subtitle="100% genuine ISI certified"
                                onPress={() => navigateTo('/materials-safety')}
                            />
                            <MenuItem
                                icon={FileText}
                                label="Terms of Service"
                                subtitle="Limitation of liability cap"
                                onPress={() => navigateTo('/terms')}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Privacy Policy"
                                subtitle="DPDP Section 5 & CERT-In"
                                onPress={() => navigateTo('/privacy')}
                            />
                            <MenuItem
                                icon={Clock}
                                label="Data Retention Schedule"
                                subtitle="180-day logs & GST 6-yr policy"
                                onPress={() => navigateTo('/data-retention')}
                            />
                            <MenuItem
                                icon={FileText}
                                label="Sample Digital Tax Invoice"
                                subtitle="SAC 9987 & ISI spare parts"
                                onPress={() => navigateTo('/invoice/INV-2026-8291')}
                            />
                            <MenuItem
                                icon={ShieldAlert}
                                label="₹5 Lakh Damage Claim Desk"
                                subtitle="On-site fire & burnout SOP"
                                badge="2-Hr Inspection"
                                onPress={() => navigateTo('/damage-claim')}
                            />
                            <MenuItem
                                icon={Sparkles}
                                label="Founder's Legal Roadmap"
                                subtitle="Pre-launch milestone tracker"
                                badge="4 Steps"
                                onPress={() => navigateTo('/founder-checklist')}
                            />
                            <MenuItem
                                icon={FileCheck}
                                label="Technician Partner SLA"
                                subtitle="Independent contractor terms"
                                onPress={() => navigateTo('/partner/agreement')}
                            />
                            <MenuItem
                                icon={Award}
                                label="Startup India (DPIIT) Hub"
                                subtitle="80-IAC tax holiday & grants"
                                badge="Tax Relief"
                                onPress={() => navigateTo('/startup-benefits')}
                            />
                            <MenuItem
                                icon={Headphones}
                                label="Support Dispute & Damage SOP"
                                subtitle="Resolution workflows & scripts"
                                onPress={() => navigateTo('/dispute-sop')}
                            />
                            <MenuItem
                                icon={Split}
                                label="Split-Payout & Escrow Engine"
                                subtitle="Razorpay Route API logic"
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
                        </View>

                        {/* Theme Toggle & Logout */}
                        <View style={[styles.footerSection, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <TouchableOpacity
                                style={[styles.themeBtn, { backgroundColor: isDark ? '#18181B' : '#F4F4F5' }]}
                                onPress={toggleTheme}
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
                                >
                                    <LogOut size={16} color={colors.danger} />
                                    <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
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
        paddingTop: Platform.OS === 'ios' ? 44 : 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    closeBtn: {
        padding: 6,
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 6,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.6,
        marginBottom: 6,
        paddingLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        fontSize: 13,
        fontWeight: '600',
    },
    menuItemSubtitle: {
        fontSize: 11,
        marginTop: 1,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
    },
    rightText: {
        fontSize: 11,
    },
    footerSection: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        gap: 10,
    },
    themeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
    },
    themeBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    logoutText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
