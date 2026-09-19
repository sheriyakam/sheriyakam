import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, TextInput, RefreshControl, Switch, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ShieldAlert, Users, Briefcase, TrendingUp, CheckCircle,
    Clock, LogOut, BarChart2, Activity, XCircle, AlertTriangle,
    MapPin, Phone, Star, RefreshCw, Settings, Zap, Search,
    ChevronRight, Split, Webhook, FileText, Layers, Calendar, Scale, Award,
    Radio, Headphones, DollarSign, HelpCircle, UserCheck, ShieldCheck
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { getPartners, approvePartner, rejectPartner } from '../../constants/partnerStore';
import { getBookings, calculateSLA, bookingEvents } from '../../constants/bookingStore';
import { isSupabaseConfigured } from '../../config/supabaseConfig';
import { UsersAPI } from '../../services/supabaseAPI';
import { checkRateLimit, hashPassword } from '../../utils/security';

// Brand tokens
const C = {
    bg: '#0a0f1e',
    surface: '#111827',
    card: '#1a2235',
    border: '#1f2d45',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#f8fafc',
    sub: '#94a3b8',
    muted: '#475569',
};

const StatCard = ({ icon: Icon, label, value, color, sub, onPress }) => (
    <TouchableOpacity
        style={[s.statCard, { borderTopColor: color }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.75 : 1}
    >
        <Icon size={20} color={color} />
        <Text style={[s.statValue, { color }]}>{value}</Text>
        <Text style={s.statLabel}>{label}</Text>
        {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </TouchableOpacity>
);

const Badge = ({ status }) => {
    const MAP = {
        open:        { label: 'Open',        color: C.warning },
        assigned:    { label: 'Assigned',    color: C.accent },
        arrived:     { label: 'Arrived',     color: '#8b5cf6' },
        in_progress: { label: 'In Progress', color: '#8b5cf6' },
        completed:   { label: 'Completed',   color: C.success },
        disputed:    { label: 'Disputed',    color: C.danger },
        Cancelled:   { label: 'Cancelled',   color: C.danger },
        pending:     { label: 'Pending',     color: C.warning },
        approved:    { label: 'Approved',    color: C.success },
        suspended:   { label: 'Suspended',   color: C.danger },
    };
    const b = MAP[status] || { label: status || 'Unknown', color: C.sub };
    return (
        <View style={[s.badge, { backgroundColor: b.color + '22', borderColor: b.color + '44' }]}>
            <Text style={[s.badgeText, { color: b.color }]}>{b.label}</Text>
        </View>
    );
};

export default function AdminDashboard() {
    const router = useRouter();

    // Authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Operator Role Switcher (Lean single-operator mode)
    const [opsRole, setOpsRole] = useState('ops'); // 'ops' (default) or 'admin'

    // Data State
    const [partners, setPartners] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('operations');
    const [searchQuery, setSearchQuery] = useState('');
    const [isBetaMode, setIsBetaMode] = useState(false);

    const loadData = useCallback(() => {
        setPartners([...getPartners()]);
        setBookings([...getBookings()]);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        loadData();
        bookingEvents.on('change', loadData);
        return () => bookingEvents.off('change', loadData);
    }, [isAuthenticated, loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        loadData();
        setTimeout(() => setRefreshing(false), 800);
    }, [loadData]);

    const handleLogin = async () => {
        const cleanUsername = username.trim().toLowerCase();
        const limitRes = checkRateLimit('admin_login', 5, 60000);
        if (!limitRes.allowed) {
            setLoginError(`Too many login attempts. Try again in ${Math.ceil(limitRes.retryAfterMs / 1000)} seconds.`);
            return;
        }

        setIsLoggingIn(true);
        setLoginError('');

        try {
            if (isSupabaseConfigured) {
                const { data: dbUser, error } = await UsersAPI.findByIdentifier(cleanUsername);
                if (dbUser && dbUser.role === 'admin') {
                    const hashed = hashPassword(password);
                    if (dbUser.password === password || dbUser.password === hashed) {
                        setIsAuthenticated(true);
                        setLoginError('');
                        setIsLoggingIn(false);
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("Admin authentication error:", err);
        }

        // Offline / Developer fallback credentials
        if (cleanUsername === 'admin' && password === 'sheri@25') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials. Check username and password.');
        }
        setIsLoggingIn(false);
    };

    // Computed Stats
    const totalPartners   = partners.length;
    const approvedPartners = partners.filter(p => p.status === 'approved').length;
    const pendingPartners  = partners.filter(p => p.status === 'pending');
    const totalBookings   = bookings.length;
    const openJobs        = bookings.filter(b => b.status === 'open').length;
    const assignedJobs    = bookings.filter(b => b.status === 'assigned' || b.status === 'accepted').length;
    const completedJobs   = bookings.filter(b => b.status === 'completed').length;
    const disputedJobs    = bookings.filter(b => b.status === 'disputed').length;
    const totalRevenue    = bookings.reduce((s, b) => s + (b.finalPrice || b.price || 0), 0);

    const slaList = bookings.map(b => calculateSLA(b));
    const breachedSlaCount = slaList.filter(s => s.isBreached).length;
    const warningSlaCount = slaList.filter(s => s.isWarning).length;

    // Login Screen
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={s.loginBg}>
                <View style={s.loginCard}>
                    <View style={s.loginIconWrap}>
                        <ShieldAlert size={32} color={C.danger} />
                    </View>
                    <Text style={s.loginTitle}>Operations Portal</Text>
                    <Text style={s.loginSub}>SHERIYAKAM · INTERNAL OPERATIONS</Text>

                    {loginError ? <Text style={s.loginError}>{loginError}</Text> : null}

                    <TextInput
                        style={s.loginInput}
                        placeholder="Username (e.g. admin)"
                        placeholderTextColor={C.muted}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={s.loginInput}
                        placeholder="Password (e.g. sheri@25)"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={s.loginBtn} onPress={handleLogin}>
                        <Text style={s.loginBtnText}>Sign In to Command Center</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={() => router.replace('/')}>
                        <Text style={{ color: C.muted, fontSize: 13 }}>← Back to Customer Marketplace</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const CORE_SCREENS = [
        {
            id: 'live_ops',
            title: '1. Live Ops View',
            sub: 'Real-time 90-min SLA countdowns, radar & district filters',
            route: '/admin/live-ops',
            icon: Activity,
            color: C.accent,
            badge: breachedSlaCount > 0 ? `${breachedSlaCount} Breached!` : `${bookings.length} Live`
        },
        {
            id: 'manual_dispatch',
            title: '2. Manual Dispatch',
            sub: 'Unassigned/stalled jobs & direct wireman calling desk',
            route: '/admin/manual-dispatch',
            icon: Zap,
            color: C.warning,
            badge: openJobs > 0 ? `${openJobs} Waiting` : null
        },
        {
            id: 'partners',
            title: '3. Partner Management',
            sub: 'KSELB license doc reviews, rating tiers & suspension logs',
            route: '/admin/partners',
            icon: Users,
            color: C.success,
            badge: pendingPartners.length > 0 ? `${pendingPartners.length} New` : null
        },
        {
            id: 'disputes',
            title: '4. Dispute Queue',
            sub: 'Customer complaints, photo audit & refund settlements',
            route: '/admin/disputes',
            icon: Scale,
            color: C.danger,
            badge: disputedJobs > 0 ? `${disputedJobs} Open` : null
        },
        {
            id: 'payouts',
            title: '5. Payouts & GST',
            sub: 'Weekly settlements, batch approvals & HSN 998713 tax export',
            route: '/admin/payouts',
            icon: DollarSign,
            color: '#10b981',
            badge: 'Tuesday Payout'
        },
        {
            id: 'analytics',
            title: '6. Analytics Hub',
            sub: 'Average arrival time vs 90m SLA, revenue & utilization',
            route: '/admin/analytics',
            icon: BarChart2,
            color: '#8b5cf6',
            badge: '96.8% SLA'
        },
        {
            id: 'customer_support',
            title: '7. Customer Support',
            sub: 'Phone/booking 360° lookup, wallet credits & refunds',
            route: '/admin/customer-support',
            icon: Headphones,
            color: '#ec4899',
            badge: '360° Search'
        },
        {
            id: 'cms',
            title: '8. Dynamic CMS',
            sub: 'Editable FAQs (no empty answers), rate cards & 14 districts',
            route: '/admin/cms',
            icon: HelpCircle,
            color: C.accent,
            badge: 'Instant Live'
        }
    ];

    return (
        <SafeAreaView style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={s.headerTitle}>Operations Command Center</Text>
                        <View style={s.hqBadge}>
                            <Text style={s.hqBadgeText}>THALASSERY HQ</Text>
                        </View>
                    </View>
                    <Text style={s.headerSub}>Kerala 14-District Electrician Marketplace Ops</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    {/* Lean Single Operator Role Switcher */}
                    <TouchableOpacity
                        style={[s.roleBtn, opsRole === 'admin' ? s.roleBtnAdmin : s.roleBtnOps]}
                        onPress={() => {
                            const next = opsRole === 'ops' ? 'admin' : 'ops';
                            setOpsRole(next);
                            Alert.alert(
                                'Role Switched',
                                next === 'admin'
                                    ? 'Switched to Admin/Owner Mode (Unlocks financial batch payouts & partner suspensions).'
                                    : 'Switched to Operator Mode (Focus on daily dispatch & customer support).'
                            );
                        }}
                    >
                        <Shield size={12} color={opsRole === 'admin' ? '#fff' : C.accent} />
                        <Text style={[s.roleBtnText, opsRole === 'admin' && { color: '#fff' }]}>
                            {opsRole === 'admin' ? 'ROLE: ADMIN / OWNER' : 'ROLE: OPS LEAD'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}>
                        <RefreshCw size={16} color={C.accent} />
                    </TouchableOpacity>

                    <TouchableOpacity style={s.logoutBtn} onPress={() => {
                        setIsAuthenticated(false);
                        setUsername('');
                        setPassword('');
                    }}>
                        <LogOut size={16} color={C.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* High-Priority Operations Alert Ticker */}
            {(breachedSlaCount > 0 || openJobs > 0 || disputedJobs > 0) && (
                <View style={s.urgentAlertStrip}>
                    <AlertTriangle size={15} color="#fff" />
                    <Text style={s.urgentAlertText} numberOfLines={1}>
                        {breachedSlaCount > 0 && `🚨 ${breachedSlaCount} SLA Breach! `}
                        {openJobs > 0 && `⚡ ${openJobs} Unassigned Job(s) `}
                        {disputedJobs > 0 && `⚠️ ${disputedJobs} Disputed Ticket `}
                    </Text>
                    <TouchableOpacity
                        style={s.urgentAlertBtn}
                        onPress={() => router.push(breachedSlaCount > 0 ? '/admin/live-ops' : openJobs > 0 ? '/admin/manual-dispatch' : '/admin/disputes')}
                    >
                        <Text style={s.urgentAlertBtnText}>Take Action →</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                style={{ flex: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
                showsVerticalScrollIndicator={false}
            >
                <View style={s.tabContent}>
                    {/* Live KPIs Top Grid */}
                    <View style={s.statsGrid}>
                        <StatCard
                            icon={Activity}
                            label="Active Jobs"
                            value={bookings.length}
                            color={C.accent}
                            sub={`${openJobs} unassigned`}
                            onPress={() => router.push('/admin/live-ops')}
                        />
                        <StatCard
                            icon={Clock}
                            label="90-Min SLA"
                            value={breachedSlaCount > 0 ? `${breachedSlaCount} Breach` : '96.8%'}
                            color={breachedSlaCount > 0 ? C.danger : C.success}
                            sub={breachedSlaCount > 0 ? 'Action required' : 'On-time target'}
                            onPress={() => router.push('/admin/live-ops')}
                        />
                        <StatCard
                            icon={Users}
                            label="KSELB Wiremen"
                            value={approvedPartners}
                            color={C.success}
                            sub={`${pendingPartners.length} pending review`}
                            onPress={() => router.push('/admin/partners')}
                        />
                        <StatCard
                            icon={Scale}
                            label="Dispute Queue"
                            value={disputedJobs}
                            color={disputedJobs > 0 ? C.danger : C.sub}
                            sub={disputedJobs > 0 ? 'Requires settlement' : 'Zero disputes'}
                            onPress={() => router.push('/admin/disputes')}
                        />
                        <StatCard
                            icon={DollarSign}
                            label="Gross Volume"
                            value={`₹${totalRevenue.toLocaleString()}`}
                            color={C.success}
                            sub="90/10 split active"
                            onPress={() => router.push('/admin/payouts')}
                        />
                        <StatCard
                            icon={Zap}
                            label="Avg Arrival"
                            value="24 Mins"
                            color={C.warning}
                            sub="Across 14 districts"
                            onPress={() => router.push('/admin/analytics')}
                        />
                    </View>

                    {/* 8 Core Operations Screens Navigation Grid */}
                    <Text style={s.sectionHeader}>CORE OPERATIONS DASHBOARD (SCREENS 1–8)</Text>
                    <View style={s.modulesGrid}>
                        {CORE_SCREENS.map((mod) => {
                            const IconComponent = mod.icon;
                            return (
                                <TouchableOpacity
                                    key={mod.id}
                                    style={s.moduleCard}
                                    onPress={() => router.push(mod.route)}
                                    activeOpacity={0.75}
                                >
                                    <View style={s.moduleTopRow}>
                                        <View style={[s.moduleIconBox, { backgroundColor: mod.color + '18' }]}>
                                            <IconComponent size={20} color={mod.color} />
                                        </View>
                                        {mod.badge && (
                                            <View style={[s.moduleBadge, { backgroundColor: mod.color + '22', borderColor: mod.color + '44' }]}>
                                                <Text style={[s.moduleBadgeText, { color: mod.color }]}>{mod.badge}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={s.moduleTitle}>{mod.title}</Text>
                                    <Text style={s.moduleSub}>{mod.sub}</Text>
                                    <View style={s.moduleFooter}>
                                        <Text style={[s.openModuleText, { color: mod.color }]}>Open Console →</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Live Order Queue Snapshot */}
                    <View style={s.sectionCard}>
                        <View style={s.sectionCardHeader}>
                            <View>
                                <Text style={s.sectionTitle}>Real-Time Marketplace Stream</Text>
                                <Text style={s.sectionSub}>Latest dispatches and contractor updates</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.push('/admin/live-ops')}>
                                <Text style={{ color: C.accent, fontSize: 12, fontWeight: '700' }}>Full Live Ops View →</Text>
                            </TouchableOpacity>
                        </View>

                        {bookings.slice(0, 4).map(b => {
                            const sla = calculateSLA(b);
                            return (
                                <View key={b.id} style={s.miniOrderRow}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={s.miniOrderService}>{b.service}</Text>
                                            <Badge status={b.status} />
                                        </View>
                                        <Text style={s.miniOrderSub}>
                                            {b.customerName} • {b.district} • {b.partnerName ? `Assigned: ${b.partnerName}` : 'Unassigned'}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={[s.miniOrderSla, sla.isBreached && { color: C.danger }]}>
                                            {sla.label}
                                        </Text>
                                        <Text style={s.miniOrderPrice}>₹{b.finalPrice || b.price}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Secondary Operations & Compliance Hub */}
                    <View style={s.sectionCard}>
                        <Text style={s.sectionTitle}>Compliance, Tax & Incident Playbooks</Text>
                        <View style={{ gap: 8 }}>
                            {[
                                { icon: Layers, label: 'Live Dispatch Kanban Board', route: '/admin/kanban', sub: 'Visual drag-and-drop job pipeline', color: C.accent },
                                { icon: Calendar, label: 'Contractor Schedule Timeline', route: '/admin/schedule', sub: 'Visual AMC timeline', color: '#8b5cf6' },
                                { icon: ShieldAlert, label: '₹5 Lakh Accidental Damage Desk', route: '/damage-claim', sub: 'Emergency field incident procedure', color: C.danger },
                                { icon: Scale, label: 'Customer Dispute Playbook (SOP)', route: '/dispute-sop', sub: 'Agent arbitration scripts & rules', color: C.sub },
                            ].map((mod, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={s.complianceRow}
                                    onPress={() => router.push(mod.route)}
                                >
                                    <View style={[s.complianceIcon, { backgroundColor: mod.color + '20' }]}>
                                        <mod.icon size={16} color={mod.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.complianceTitle}>{mod.label}</Text>
                                        <Text style={s.complianceSub}>{mod.sub}</Text>
                                    </View>
                                    <ChevronRight size={16} color={C.muted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    loginBg: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loginCard: { width: '100%', maxWidth: 400, backgroundColor: C.surface, padding: 32, borderRadius: 20, borderWidth: 1, borderColor: C.border },
    loginIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.danger + '15', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 18 },
    loginTitle: { fontSize: 22, fontWeight: 'bold', color: C.text, textAlign: 'center', marginBottom: 4 },
    loginSub: { fontSize: 11, color: C.muted, textAlign: 'center', marginBottom: 24, letterSpacing: 1.5, textTransform: 'uppercase' },
    loginInput: { backgroundColor: C.bg, borderRadius: 10, padding: 14, color: C.text, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    loginBtn: { backgroundColor: C.accent, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 4 },
    loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    loginError: { color: C.danger, textAlign: 'center', marginBottom: 14, fontSize: 13, fontWeight: '600' },

    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
    headerTitle: { fontSize: 18, fontWeight: '800', color: C.text },
    headerSub: { fontSize: 11, color: C.sub, marginTop: 1 },
    hqBadge: { backgroundColor: C.accent + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    hqBadgeText: { fontSize: 9, fontWeight: '800', color: C.accent },
    roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    roleBtnOps: { borderColor: C.accent, backgroundColor: C.accent + '15' },
    roleBtnAdmin: { borderColor: C.danger, backgroundColor: C.danger },
    roleBtnText: { fontSize: 10, fontWeight: '800', color: C.accent },
    refreshBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
    logoutBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.danger + '15', alignItems: 'center', justifyContent: 'center' },

    urgentAlertStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dc2626', paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
    urgentAlertText: { color: '#fff', fontSize: 11, fontWeight: '700', flex: 1 },
    urgentAlertBtn: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    urgentAlertBtnText: { color: '#fff', fontSize: 10, fontWeight: '800' },

    tabContent: { padding: 16, gap: 16 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statCard: { width: '31.5%', backgroundColor: C.card, padding: 12, borderRadius: 12, alignItems: 'center', gap: 3, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 10, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5 },
    statSub: { fontSize: 9, color: C.muted },

    sectionHeader: { fontSize: 11, fontWeight: '800', color: C.sub, letterSpacing: 0.8, textTransform: 'uppercase' },
    modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    moduleCard: { width: '48.5%', backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
    moduleTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    moduleIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    moduleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    moduleBadgeText: { fontSize: 9, fontWeight: '800' },
    moduleTitle: { fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 2 },
    moduleSub: { fontSize: 11, color: C.sub, lineHeight: 15, height: 30 },
    moduleFooter: { marginTop: 8, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 6 },
    openModuleText: { fontSize: 11, fontWeight: '700' },

    sectionCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, gap: 10 },
    sectionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 8 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: C.text },
    sectionSub: { fontSize: 11, color: C.sub },
    miniOrderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border + '60' },
    miniOrderService: { fontSize: 13, fontWeight: '700', color: C.text },
    miniOrderSub: { fontSize: 11, color: C.sub, marginTop: 2 },
    miniOrderSla: { fontSize: 11, fontWeight: '700', color: C.warning },
    miniOrderPrice: { fontSize: 13, fontWeight: '800', color: C.text, marginTop: 1 },

    complianceRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, gap: 10 },
    complianceIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    complianceTitle: { color: C.text, fontSize: 12, fontWeight: '700' },
    complianceSub: { color: C.muted, fontSize: 10, marginTop: 1 },

    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    badgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
});
