import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, TextInput, FlatList, RefreshControl, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ShieldAlert, Users, Briefcase, TrendingUp, CheckCircle,
    Clock, LogOut, BarChart2, Activity, XCircle, AlertTriangle,
    MapPin, Phone, Star, RefreshCw, Settings, Zap, Search
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { getPartners, approvePartner, rejectPartner } from '../../constants/partnerStore';
import { getBookings } from '../../constants/bookingStore';
import { bookingEvents } from '../../constants/bookingStore';

// ─── COLORS ───────────────────────────────────────────────────────────────────
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <View style={[s.statCard, { borderTopColor: color }]}>
        <Icon size={20} color={color} />
        <Text style={[s.statValue, { color }]}>{value}</Text>
        <Text style={s.statLabel}>{label}</Text>
        {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </View>
);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
    const MAP = {
        open:        { label: 'Open',        color: C.warning },
        assigned:    { label: 'Assigned',    color: C.accent },
        in_progress: { label: 'In Progress', color: '#8b5cf6' },
        completed:   { label: 'Completed',   color: C.success },
        Cancelled:   { label: 'Cancelled',   color: C.danger },
        pending:     { label: 'Pending',     color: C.warning },
        approved:    { label: 'Approved',    color: C.success },
        rejected:    { label: 'Rejected',    color: C.danger },
    };
    const b = MAP[status] || { label: status || 'Unknown', color: C.sub };
    return (
        <View style={[s.badge, { backgroundColor: b.color + '22', borderColor: b.color + '44' }]}>
            <Text style={[s.badgeText, { color: b.color }]}>{b.label}</Text>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const router = useRouter();

    // Auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Data
    const [partners, setPartners] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
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

    const handleLogin = () => {
        if (username === 'admin' && password === 'sheri@25') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials. Check username and password.');
        }
    };

    // ─── COMPUTED STATS ──────────────────────────────────────────────────────
    const totalPartners   = partners.length;
    const approvedPartners = partners.filter(p => p.status === 'approved').length;
    const pendingPartners  = partners.filter(p => p.status === 'pending');
    const totalBookings   = bookings.length;
    const openJobs        = bookings.filter(b => b.status === 'open').length;
    const assignedJobs    = bookings.filter(b => b.status === 'assigned').length;
    const completedJobs   = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue    = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.finalPrice || 0), 0);

    const filteredBookings = bookings.filter(b =>
        !searchQuery ||
        b.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.assignedPartnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id?.includes(searchQuery)
    );

    const filteredPartners = partners.filter(p =>
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
    );

    // ─── LOGIN SCREEN ────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={s.loginBg}>
                <View style={s.loginCard}>
                    <View style={s.loginIconWrap}>
                        <ShieldAlert size={32} color={C.danger} />
                    </View>
                    <Text style={s.loginTitle}>Admin Portal</Text>
                    <Text style={s.loginSub}>SHERIYAKAM · RESTRICTED ACCESS</Text>

                    {loginError ? <Text style={s.loginError}>{loginError}</Text> : null}

                    <TextInput
                        style={s.loginInput}
                        placeholder="Username"
                        placeholderTextColor={C.muted}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={s.loginInput}
                        placeholder="Password"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={s.loginBtn} onPress={handleLogin}>
                        <Text style={s.loginBtnText}>Sign In Securely</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={() => router.replace('/')}>
                        <Text style={{ color: C.muted, fontSize: 13 }}>← Back to Sheriyakam</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ─── TABS ────────────────────────────────────────────────────────────────
    const TABS = [
        { id: 'overview',  label: 'Overview',  icon: BarChart2 },
        { id: 'bookings',  label: 'Bookings',  icon: Briefcase, badge: openJobs },
        { id: 'partners',  label: 'Partners',  icon: Users,     badge: pendingPartners.length },
        { id: 'dispatch',  label: 'Dispatch',  icon: Zap },
        { id: 'settings',  label: 'Settings',  icon: Settings },
    ];

    // ─── DASHBOARD ───────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={s.container}>

            {/* HEADER */}
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>Command Center</Text>
                    <Text style={s.headerSub}>Sheriyakam Administration</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
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

            {/* TAB BAR */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabBar} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[s.tabItem, activeTab === tab.id && s.tabItemActive]}
                        onPress={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                    >
                        <tab.icon size={14} color={activeTab === tab.id ? C.accent : C.sub} />
                        <Text style={[s.tabText, activeTab === tab.id && s.tabTextActive]}>{tab.label}</Text>
                        {tab.badge > 0 && (
                            <View style={s.tabBadge}><Text style={s.tabBadgeText}>{tab.badge}</Text></View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* CONTENT */}
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
                showsVerticalScrollIndicator={false}
            >
                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                    <View style={s.tabContent}>
                        {/* Stat Cards */}
                        <View style={s.statsGrid}>
                            <StatCard icon={Users}     label="Partners"   value={approvedPartners} color={C.accent}   sub={`${pendingPartners.length} pending`} />
                            <StatCard icon={Briefcase} label="Total Jobs"  value={totalBookings}   color="#8b5cf6"   sub={`${openJobs} open`} />
                            <StatCard icon={Zap}       label="Assigned"    value={assignedJobs}    color={C.warning} sub="auto-dispatched" />
                            <StatCard icon={CheckCircle} label="Completed" value={completedJobs}   color={C.success} sub="this session" />
                            <StatCard icon={TrendingUp} label="Revenue"    value={`₹${totalRevenue.toLocaleString()}`} color={C.success} sub="paid bookings" />
                            <StatCard icon={AlertTriangle} label="Unassigned" value={openJobs}     color={C.danger}  sub="needs partner" />
                        </View>

                        {/* System Status */}
                        <View style={s.sectionCard}>
                            <Text style={s.sectionTitle}>System Status</Text>
                            {[
                                { label: 'Auto-Assignment Engine', status: 'Online', color: C.success },
                                { label: 'Partner GPS Tracking',    status: 'Active', color: C.success },
                                { label: 'OTP Verification',        status: 'Active', color: C.success },
                                { label: 'Beta Mode (0% Commission)', status: isBetaMode ? 'Enabled' : 'Disabled', color: isBetaMode ? C.warning : C.muted },
                            ].map((item, i) => (
                                <View key={i} style={s.statusRow}>
                                    <View style={[s.statusDot, { backgroundColor: item.color }]} />
                                    <Text style={s.statusLabel}>{item.label}</Text>
                                    <Text style={[s.statusValue, { color: item.color }]}>{item.status}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Recent Bookings */}
                        <View style={s.sectionCard}>
                            <Text style={s.sectionTitle}>Recent Bookings</Text>
                            {bookings.length === 0 ? (
                                <Text style={s.emptyNote}>No bookings yet.</Text>
                            ) : (
                                bookings.slice().reverse().slice(0, 5).map(b => (
                                    <View key={b.id} style={s.miniRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.miniTitle}>{b.serviceName}</Text>
                                            <Text style={s.miniSub}>{b.assignedPartnerName || 'Unassigned'} · {b.distance}</Text>
                                        </View>
                                        <Badge status={b.status} />
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                )}

                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                    <View style={s.tabContent}>
                        <View style={s.searchBar}>
                            <Search size={16} color={C.sub} />
                            <TextInput
                                style={s.searchInput}
                                placeholder="Search by service, partner, booking ID..."
                                placeholderTextColor={C.muted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {filteredBookings.length === 0 ? (
                            <View style={s.emptyState}>
                                <Briefcase size={40} color={C.border} />
                                <Text style={s.emptyTitle}>No Bookings Found</Text>
                                <Text style={s.emptyDesc}>Bookings will appear here as customers place orders.</Text>
                            </View>
                        ) : (
                            filteredBookings.slice().reverse().map(b => (
                                <View key={b.id} style={s.bookingCard}>
                                    <View style={s.bookingCardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.bookingTitle}>{b.serviceName}</Text>
                                            <Text style={s.bookingSub}>ID: {b.id}</Text>
                                        </View>
                                        <Badge status={b.status} />
                                    </View>
                                    <View style={s.bookingDetails}>
                                        <View style={s.detailRow}>
                                            <MapPin size={13} color={C.sub} />
                                            <Text style={s.detailText}>{b.address || b.location || 'Location not set'}</Text>
                                        </View>
                                        <View style={s.detailRow}>
                                            <Users size={13} color={C.sub} />
                                            <Text style={s.detailText}>
                                                {b.assignedPartnerName
                                                    ? `${b.assignedPartnerName} · ${b.distance}`
                                                    : 'No partner assigned'}
                                            </Text>
                                        </View>
                                        <View style={s.detailRow}>
                                            <TrendingUp size={13} color={C.sub} />
                                            <Text style={s.detailText}>₹{b.finalPrice || b.price || 0} · {b.paymentStatus || 'pending'}</Text>
                                        </View>
                                        {b.issues && (
                                            <View style={s.detailRow}>
                                                <AlertTriangle size={13} color={C.warning} />
                                                <Text style={[s.detailText, { color: C.warning }]}>{b.issues}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* ── PARTNERS TAB ── */}
                {activeTab === 'partners' && (
                    <View style={s.tabContent}>
                        <View style={s.searchBar}>
                            <Search size={16} color={C.sub} />
                            <TextInput
                                style={s.searchInput}
                                placeholder="Search partners by name or phone..."
                                placeholderTextColor={C.muted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {filteredPartners.length === 0 ? (
                            <View style={s.emptyState}>
                                <Users size={40} color={C.border} />
                                <Text style={s.emptyTitle}>No Partners Yet</Text>
                                <Text style={s.emptyDesc}>Partners who apply via the app will appear here for review.</Text>
                            </View>
                        ) : (
                            filteredPartners.map(p => (
                                <View key={p.id} style={s.partnerCard}>
                                    <View style={s.partnerCardHeader}>
                                        <View style={s.partnerAvatar}>
                                            <Text style={s.partnerAvatarText}>{(p.name || '?')[0].toUpperCase()}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={s.partnerName}>{p.name || 'Unknown'}</Text>
                                            <Text style={s.partnerSub}>{p.phone} · {p.serviceTypes?.join(', ') || 'N/A'}</Text>
                                        </View>
                                        <Badge status={p.status} />
                                    </View>
                                    <View style={s.partnerMeta}>
                                        {p.latitude && (
                                            <View style={s.detailRow}>
                                                <MapPin size={13} color={C.sub} />
                                                <Text style={s.detailText}>{p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}</Text>
                                            </View>
                                        )}
                                        <View style={s.detailRow}>
                                            <Activity size={13} color={p.isAvailable ? C.success : C.muted} />
                                            <Text style={[s.detailText, { color: p.isAvailable ? C.success : C.muted }]}>
                                                {p.isAvailable ? 'Available' : 'Unavailable'}
                                            </Text>
                                        </View>
                                    </View>
                                    {p.status === 'pending' && (
                                        <View style={s.actionRow}>
                                            <TouchableOpacity
                                                style={[s.actionBtn, { backgroundColor: C.danger + '22', borderColor: C.danger + '44' }]}
                                                onPress={() => {
                                                    rejectPartner(p.id);
                                                    loadData();
                                                }}
                                            >
                                                <XCircle size={14} color={C.danger} />
                                                <Text style={[s.actionBtnText, { color: C.danger }]}>Reject</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[s.actionBtn, { backgroundColor: C.success + '22', borderColor: C.success + '44' }]}
                                                onPress={() => {
                                                    approvePartner(p.id);
                                                    loadData();
                                                }}
                                            >
                                                <CheckCircle size={14} color={C.success} />
                                                <Text style={[s.actionBtnText, { color: C.success }]}>Approve Partner</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* ── DISPATCH TAB ── */}
                {activeTab === 'dispatch' && (
                    <View style={s.tabContent}>
                        <View style={s.sectionCard}>
                            <View style={s.dispatchHeader}>
                                <Zap size={22} color={C.accent} />
                                <Text style={s.dispatchTitle}>Smart Auto-Assignment</Text>
                            </View>
                            <Text style={s.dispatchDesc}>
                                When a customer books a service, the system automatically finds and assigns the nearest available partner within the 20km range using GPS distance calculation.
                            </Text>
                            {[
                                { icon: MapPin,      label: 'Max Assignment Range',      value: '20 km' },
                                { icon: Users,       label: 'Available Partners',         value: `${partners.filter(p => p.status === 'approved' && p.isAvailable).length}` },
                                { icon: Zap,         label: 'Auto-Assigned Today',        value: `${assignedJobs}` },
                                { icon: AlertTriangle, label: 'Awaiting Manual Dispatch', value: `${openJobs}` },
                            ].map((row, i) => (
                                <View key={i} style={s.dispatchRow}>
                                    <row.icon size={16} color={C.sub} />
                                    <Text style={s.dispatchRowLabel}>{row.label}</Text>
                                    <Text style={s.dispatchRowValue}>{row.value}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Open/Unassigned jobs needing manual dispatch */}
                        <Text style={s.sectionTitle}>Pending Manual Dispatch</Text>
                        {bookings.filter(b => b.status === 'open').length === 0 ? (
                            <View style={s.emptyState}>
                                <CheckCircle size={40} color={C.success} />
                                <Text style={s.emptyTitle}>All Jobs Dispatched!</Text>
                                <Text style={s.emptyDesc}>No bookings are waiting for a partner.</Text>
                            </View>
                        ) : (
                            bookings.filter(b => b.status === 'open').map(b => (
                                <View key={b.id} style={[s.bookingCard, { borderLeftColor: C.danger, borderLeftWidth: 3 }]}>
                                    <Text style={s.bookingTitle}>{b.serviceName}</Text>
                                    <Text style={s.bookingSub}>{b.address || 'No address set'}</Text>
                                    <Text style={[s.bookingSub, { color: C.danger, marginTop: 4 }]}>⚠ No partner in range or all unavailable</Text>
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* ── SETTINGS TAB ── */}
                {activeTab === 'settings' && (
                    <View style={s.tabContent}>
                        <View style={s.sectionCard}>
                            <Text style={s.sectionTitle}>Platform Settings</Text>

                            <View style={s.settingRow}>
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Text style={s.settingLabel}>Beta Mode (0% Commission)</Text>
                                    <Text style={s.settingDesc}>Reduces partner commission to ₹0 for Thalassery / Mahe launch regions during beta phase.</Text>
                                </View>
                                <Switch
                                    value={isBetaMode}
                                    onValueChange={setIsBetaMode}
                                    trackColor={{ false: C.border, true: C.accent }}
                                    thumbColor="#fff"
                                />
                            </View>

                            <View style={s.settingRow}>
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Text style={s.settingLabel}>Auto-Assignment Range</Text>
                                    <Text style={s.settingDesc}>Maximum radius to search for available partners when a booking is placed.</Text>
                                </View>
                                <View style={[s.badge, { borderColor: C.accent + '44', backgroundColor: C.accent + '22' }]}>
                                    <Text style={[s.badgeText, { color: C.accent }]}>20 km</Text>
                                </View>
                            </View>

                            <View style={s.settingRow}>
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Text style={s.settingLabel}>OTP Verification</Text>
                                    <Text style={s.settingDesc}>Check-in and job-completion OTPs are required for all bookings.</Text>
                                </View>
                                <View style={[s.badge, { borderColor: C.success + '44', backgroundColor: C.success + '22' }]}>
                                    <Text style={[s.badgeText, { color: C.success }]}>Enabled</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    // LOGIN
    loginBg: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loginCard: { width: '100%', maxWidth: 380, backgroundColor: C.surface, padding: 36, borderRadius: 20, borderWidth: 1, borderColor: C.border },
    loginIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.danger + '15', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
    loginTitle: { fontSize: 22, fontWeight: 'bold', color: C.text, textAlign: 'center', marginBottom: 4 },
    loginSub: { fontSize: 11, color: C.muted, textAlign: 'center', marginBottom: 28, letterSpacing: 1.5, textTransform: 'uppercase' },
    loginInput: { backgroundColor: C.bg, borderRadius: 10, padding: 15, color: C.text, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: C.border },
    loginBtn: { backgroundColor: C.danger, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 4 },
    loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    loginError: { color: C.danger, textAlign: 'center', marginBottom: 14, fontSize: 13, fontWeight: '600' },

    // DASHBOARD
    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: C.text },
    headerSub: { fontSize: 12, color: C.sub, marginTop: 2 },
    refreshBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.accent + '15', alignItems: 'center', justifyContent: 'center' },
    logoutBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.danger + '15', alignItems: 'center', justifyContent: 'center' },

    // TABS
    tabBar: { borderBottomWidth: 1, borderBottomColor: C.border, maxHeight: 48 },
    tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabItemActive: { borderBottomColor: C.accent },
    tabText: { fontSize: 13, color: C.sub, fontWeight: '600' },
    tabTextActive: { color: C.accent },
    tabBadge: { backgroundColor: C.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    tabBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    // CONTENT
    tabContent: { padding: 16, gap: 14 },

    // STAT CARDS
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statCard: { width: '31%', backgroundColor: C.card, padding: 14, borderRadius: 12, alignItems: 'center', gap: 4, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 11, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5 },
    statSub: { fontSize: 10, color: C.muted },

    // SECTION CARD
    sectionCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, gap: 12 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: C.sub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },

    // STATUS
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusLabel: { flex: 1, color: C.text, fontSize: 14 },
    statusValue: { fontSize: 13, fontWeight: '600' },

    // SEARCH
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 1, borderColor: C.border },
    searchInput: { flex: 1, color: C.text, fontSize: 14 },

    // BOOKING CARD
    bookingCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
    bookingCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    bookingTitle: { fontSize: 15, fontWeight: '700', color: C.text },
    bookingSub: { fontSize: 12, color: C.sub, marginTop: 2 },
    bookingDetails: { gap: 6 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { fontSize: 13, color: C.sub, flex: 1 },

    // PARTNER CARD
    partnerCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, gap: 10 },
    partnerCardHeader: { flexDirection: 'row', alignItems: 'center' },
    partnerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.accent + '20', alignItems: 'center', justifyContent: 'center' },
    partnerAvatarText: { color: C.accent, fontWeight: 'bold', fontSize: 18 },
    partnerName: { fontSize: 15, fontWeight: '700', color: C.text },
    partnerSub: { fontSize: 12, color: C.sub, marginTop: 2 },
    partnerMeta: { gap: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: C.border },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 8, borderWidth: 1 },
    actionBtnText: { fontSize: 13, fontWeight: '700' },

    // BADGE
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

    // MINI ROW
    miniRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border + '80' },
    miniTitle: { fontSize: 14, fontWeight: '600', color: C.text },
    miniSub: { fontSize: 12, color: C.sub, marginTop: 2 },

    // DISPATCH
    dispatchHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    dispatchTitle: { fontSize: 17, fontWeight: 'bold', color: C.text },
    dispatchDesc: { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 8 },
    dispatchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.border },
    dispatchRowLabel: { flex: 1, fontSize: 14, color: C.sub },
    dispatchRowValue: { fontSize: 15, fontWeight: 'bold', color: C.text },

    // SETTINGS
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.border },
    settingLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 },
    settingDesc: { fontSize: 12, color: C.sub, lineHeight: 18 },

    // EMPTY
    emptyState: { alignItems: 'center', padding: 40, gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: C.sub },
    emptyDesc: { fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 },
    emptyNote: { color: C.muted, fontSize: 13, textAlign: 'center', paddingVertical: 20 },
});
