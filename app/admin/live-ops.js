import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Linking, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Clock, AlertTriangle, AlertCircle, CheckCircle,
    MapPin, Phone, User, Zap, Filter, Search, Layers, RefreshCw,
    Navigation, Radio, Shield, ChevronRight, Activity, Eye
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getBookings, calculateSLA, bookingEvents } from '../../constants/bookingStore';

const KERALA_DISTRICTS = [
    'All Districts', 'Kannur', 'Kozhikode', 'Ernakulam', 'Thrissur',
    'Malappuram', 'Thiruvananthapuram', 'Kollam', 'Alappuzha',
    'Kottayam', 'Palakkad', 'Wayanad', 'Kasaragod', 'Pathanamthitta', 'Idukki'
];

const CATEGORIES = ['All Categories', 'Electrical', 'AC', 'Emergency', 'CCTV', 'Plumbing'];

export default function LiveOpsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [districtFilter, setDistrictFilter] = useState('All Districts');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    const refreshBookings = useCallback(() => {
        setBookings([...getBookings()]);
    }, []);

    useEffect(() => {
        refreshBookings();
        bookingEvents.on('change', refreshBookings);
        const timer = setInterval(refreshBookings, 30000); // 30s auto-refresh for SLA timers
        return () => {
            bookingEvents.off('change', refreshBookings);
            clearInterval(timer);
        };
    }, [refreshBookings]);

    // SLA Metrics calculation
    const allSla = bookings.map(b => calculateSLA(b));
    const breachedCount = allSla.filter(s => s.isBreached).length;
    const warningCount = allSla.filter(s => s.isWarning).length;
    const activeJobs = bookings.filter(b => ['open', 'assigned', 'accepted', 'arrived', 'in_progress'].includes(b.status));

    // Filter logic
    const filteredJobs = bookings.filter(b => {
        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'pending' ? b.status === 'open' || b.status === 'assigned'
            : statusFilter === 'active' ? ['accepted', 'arrived', 'in_progress'].includes(b.status)
            : statusFilter === 'disputed' ? b.status === 'disputed'
            : statusFilter === 'completed' ? b.status === 'completed'
            : b.status === statusFilter;

        const matchesDistrict = districtFilter === 'All Districts' || b.district === districtFilter;
        const matchesCat = categoryFilter === 'All Categories' || b.serviceType === categoryFilter || b.category === categoryFilter;

        const matchesSearch = !searchQuery ||
            b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesDistrict && matchesCat && matchesSearch;
    });

    const handleCall = (phone, name) => {
        if (!phone) {
            Alert.alert('No Phone', 'No contact number available.');
            return;
        }
        Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Dialer Error', `Could not dial ${phone}`));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Operations Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.headerTitle}>Live Operations Board</Text>
                        <View style={styles.livePulseBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.livePulseText}>LIVE DISPATCH</Text>
                        </View>
                    </View>
                    <Text style={styles.headerSub}>Kerala 14-District Real-Time SLA Monitor</Text>
                </View>
                <TouchableOpacity onPress={refreshBookings} style={styles.refreshBtn}>
                    <RefreshCw size={16} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            {/* SLA Alert Strip */}
            {(breachedCount > 0 || warningCount > 0) && (
                <View style={styles.slaBanner}>
                    <AlertTriangle size={18} color="#fff" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.slaBannerTitle}>
                            {breachedCount > 0
                                ? `🚨 ${breachedCount} JOB(S) BREACHED 90-MIN SLA!`
                                : `⚠️ ${warningCount} Job(s) Approaching 90-Min SLA Threshold`}
                        </Text>
                        <Text style={styles.slaBannerSub}>
                            Immediate manual dispatch or customer delay notification required.
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.slaActionBtn}
                        onPress={() => router.push('/admin/manual-dispatch')}
                    >
                        <Text style={styles.slaActionBtnText}>Manual Dispatch →</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Operations Metrics Row */}
            <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricVal}>{activeJobs.length}</Text>
                    <Text style={styles.metricLabel}>Active Jobs</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCard}>
                    <Text style={[styles.metricVal, { color: breachedCount > 0 ? COLORS.danger : COLORS.success }]}>
                        {breachedCount}
                    </Text>
                    <Text style={styles.metricLabel}>SLA Breached</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCard}>
                    <Text style={[styles.metricVal, { color: COLORS.gold }]}>{warningCount}</Text>
                    <Text style={styles.metricLabel}>SLA Warning</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCard}>
                    <Text style={[styles.metricVal, { color: COLORS.accent }]}>28m</Text>
                    <Text style={styles.metricLabel}>Avg Arrival</Text>
                </View>
            </View>

            {/* Search & View Mode Switcher */}
            <View style={styles.searchAndToggleRow}>
                <View style={styles.searchBox}>
                    <Search size={16} color={COLORS.textTertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by customer, service, address..."
                        placeholderTextColor={COLORS.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View style={styles.viewToggleGroup}>
                    <TouchableOpacity
                        style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
                        onPress={() => setViewMode('list')}
                    >
                        <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.viewToggleBtn, viewMode === 'map' && styles.viewToggleBtnActive]}
                        onPress={() => setViewMode('map')}
                    >
                        <Text style={[styles.viewToggleText, viewMode === 'map' && styles.viewToggleTextActive]}>Radar Map</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Status Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {[
                    { id: 'all', label: `All (${bookings.length})` },
                    { id: 'pending', label: 'Pending Dispatch' },
                    { id: 'active', label: 'En Route & In Progress' },
                    { id: 'disputed', label: 'Disputed ⚠️' },
                    { id: 'completed', label: 'Completed' }
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.filterChip, statusFilter === tab.id && styles.filterChipActive]}
                        onPress={() => setStatusFilter(tab.id)}
                    >
                        <Text style={[styles.filterChipText, statusFilter === tab.id && styles.filterChipTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* District Filter Strip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterScroll, { marginTop: 6 }]}>
                {KERALA_DISTRICTS.map(dist => (
                    <TouchableOpacity
                        key={dist}
                        style={[styles.districtChip, districtFilter === dist && styles.districtChipActive]}
                        onPress={() => setDistrictFilter(dist)}
                    >
                        <Text style={[styles.districtChipText, districtFilter === dist && styles.districtChipTextActive]}>
                            {dist}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Main Content Area */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {viewMode === 'map' ? (
                    /* Radar Map Simulation */
                    <View style={styles.radarContainer}>
                        <View style={styles.radarHeader}>
                            <Navigation size={18} color={COLORS.accent} />
                            <Text style={styles.radarTitle}>Kerala District Proximity Dispatch Hub</Text>
                        </View>
                        <Text style={styles.radarSub}>
                            Visualizing GPS clusters across Thalassery, Kozhikode, and Ernakulam hubs.
                        </Text>

                        <View style={styles.radarBoard}>
                            {/* Thalassery Cluster */}
                            <View style={[styles.hubCluster, { top: 40, left: 30 }]}>
                                <View style={styles.hubDot} />
                                <Text style={styles.hubName}>Thalassery HQ (Kannur)</Text>
                                <Text style={styles.hubStats}>2 Active • 1 Warning</Text>
                            </View>

                            {/* Kozhikode Cluster */}
                            <View style={[styles.hubCluster, { top: 120, left: 90 }]}>
                                <View style={[styles.hubDot, { backgroundColor: COLORS.danger }]} />
                                <Text style={styles.hubName}>Kozhikode Zone</Text>
                                <Text style={[styles.hubStats, { color: COLORS.danger }]}>1 SLA Breached!</Text>
                            </View>

                            {/* Ernakulam Cluster */}
                            <View style={[styles.hubCluster, { top: 220, right: 40 }]}>
                                <View style={[styles.hubDot, { backgroundColor: COLORS.gold }]} />
                                <Text style={styles.hubName}>Kochi / Aluva Zone</Text>
                                <Text style={styles.hubStats}>1 Disputed • 1 Completed</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.switchToListBtn}
                            onPress={() => setViewMode('list')}
                        >
                            <Text style={styles.switchToListText}>View Itemized Dispatch List ({filteredJobs.length})</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* List View */
                    filteredJobs.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Clock size={40} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Jobs Matching Filters</Text>
                            <Text style={styles.emptySub}>Adjust status or district filter to view active orders.</Text>
                        </View>
                    ) : (
                        filteredJobs.map(job => {
                            const sla = calculateSLA(job);
                            const isUnassigned = !job.partnerName && (job.status === 'open' || job.status === 'assigned');

                            return (
                                <View
                                    key={job.id}
                                    style={[
                                        styles.jobCard,
                                        sla.isBreached && styles.jobCardBreached,
                                        sla.isWarning && styles.jobCardWarning
                                    ]}
                                >
                                    {/* Card Header & SLA Banner */}
                                    <View style={styles.cardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                <Text style={styles.bookingId}>#{job.id}</Text>
                                                <View style={styles.districtBadge}>
                                                    <Text style={styles.districtBadgeText}>{job.district || 'Kannur'} • {job.taluk || 'Thalassery'}</Text>
                                                </View>
                                                <View style={styles.catBadge}>
                                                    <Text style={styles.catBadgeText}>{job.serviceType || 'Electrical'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.serviceTitle}>{job.service}</Text>
                                        </View>

                                        {/* SLA Pill */}
                                        <View style={[
                                            styles.slaPill,
                                            sla.isBreached && styles.slaPillBreached,
                                            sla.isWarning && styles.slaPillWarning,
                                            !sla.isBreached && !sla.isWarning && styles.slaPillNormal
                                        ]}>
                                            <Clock size={12} color={sla.isBreached ? '#fff' : sla.isWarning ? COLORS.gold : COLORS.success} />
                                            <Text style={[
                                                styles.slaPillText,
                                                sla.isBreached && { color: '#fff', fontWeight: '800' },
                                                sla.isWarning && { color: COLORS.gold },
                                                !sla.isBreached && !sla.isWarning && { color: COLORS.success }
                                            ]}>
                                                {sla.label}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Customer & Location Details */}
                                    <View style={styles.detailsBlock}>
                                        <View style={styles.detailRow}>
                                            <User size={13} color={COLORS.textSecondary} />
                                            <Text style={styles.detailTextBold}>{job.customerName}</Text>
                                            <Text style={styles.detailTextSub}>({job.customerPhone})</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <MapPin size={13} color={COLORS.textSecondary} />
                                            <Text style={styles.detailText} numberOfLines={1}>{job.address}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Zap size={13} color={COLORS.accent} />
                                            <Text style={[styles.detailText, { color: isUnassigned ? COLORS.danger : COLORS.textPrimary }]}>
                                                {isUnassigned ? '⚠️ Unassigned • Needs Immediate Dispatcher' : `Assigned Wireman: ${job.partnerName} (${job.assignedPartnerPhone || 'Active'})`}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Card Footer & Action Buttons */}
                                    <View style={styles.cardFooter}>
                                        <View>
                                            <Text style={styles.priceText}>₹{job.finalPrice || job.price}</Text>
                                            <Text style={styles.priceSub}>{job.paymentStatus === 'paid' ? 'Paid Online' : 'Pay After Service'}</Text>
                                        </View>

                                        <View style={styles.actionBtnsRow}>
                                            <TouchableOpacity
                                                style={styles.phoneActionBtn}
                                                onPress={() => handleCall(job.customerPhone, job.customerName)}
                                            >
                                                <Phone size={13} color={COLORS.textPrimary} />
                                                <Text style={styles.phoneActionText}>Customer</Text>
                                            </TouchableOpacity>

                                            {job.assignedPartnerPhone && (
                                                <TouchableOpacity
                                                    style={styles.phoneActionBtn}
                                                    onPress={() => handleCall(job.assignedPartnerPhone, job.partnerName)}
                                                >
                                                    <Phone size={13} color={COLORS.accent} />
                                                    <Text style={[styles.phoneActionText, { color: COLORS.accent }]}>Wireman</Text>
                                                </TouchableOpacity>
                                            )}

                                            {isUnassigned && (
                                                <TouchableOpacity
                                                    style={styles.dispatchActionBtn}
                                                    onPress={() => router.push('/admin/manual-dispatch')}
                                                >
                                                    <Zap size={13} color="#fff" />
                                                    <Text style={styles.dispatchActionText}>Dispatch</Text>
                                                </TouchableOpacity>
                                            )}

                                            {job.status === 'disputed' && (
                                                <TouchableOpacity
                                                    style={[styles.dispatchActionBtn, { backgroundColor: COLORS.danger }]}
                                                    onPress={() => router.push('/admin/disputes')}
                                                >
                                                    <AlertCircle size={13} color="#fff" />
                                                    <Text style={styles.dispatchActionText}>Review Dispute</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    livePulseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
    },
    livePulseText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.success,
    },
    refreshBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    slaBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc2626',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
    },
    slaBannerTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
    slaBannerSub: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 11,
    },
    slaActionBtn: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    slaActionBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    metricCard: {
        alignItems: 'center',
    },
    metricVal: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    metricLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    metricDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.border,
    },
    searchAndToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingTop: 12,
        gap: 10,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 38,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    viewToggleGroup: {
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 2,
    },
    viewToggleBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    viewToggleBtnActive: {
        backgroundColor: COLORS.accent,
    },
    viewToggleText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    viewToggleTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    filterScroll: {
        paddingHorizontal: SPACING.md,
        marginTop: 10,
        maxHeight: 36,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 6,
    },
    filterChipActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    filterChipText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    districtChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: COLORS.bgTertiary,
        marginRight: 6,
    },
    districtChipActive: {
        backgroundColor: COLORS.accent,
    },
    districtChipText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    districtChipTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        gap: 12,
    },
    jobCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    jobCardBreached: {
        borderColor: COLORS.danger,
        borderWidth: 1.5,
    },
    jobCardWarning: {
        borderColor: COLORS.gold,
        borderWidth: 1.5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
        marginBottom: 10,
    },
    bookingId: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
    },
    districtBadge: {
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    districtBadgeText: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    catBadge: {
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    catBadgeText: {
        fontSize: 10,
        color: COLORS.accent,
        fontWeight: '700',
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 4,
    },
    slaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    slaPillBreached: {
        backgroundColor: '#dc2626',
    },
    slaPillWarning: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
    },
    slaPillNormal: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    slaPillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    detailsBlock: {
        gap: 6,
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailTextBold: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    detailTextSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    detailText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    priceSub: {
        fontSize: 10,
        color: COLORS.textTertiary,
    },
    actionBtnsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    phoneActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    phoneActionText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    dispatchActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    dispatchActionText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 10,
    },
    emptySub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    radarContainer: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    radarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radarTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    radarSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    radarBoard: {
        height: 320,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 12,
        marginTop: 14,
        position: 'relative',
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    hubCluster: {
        position: 'absolute',
        backgroundColor: COLORS.bgSecondary,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'flex-start',
    },
    hubDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.success,
        marginBottom: 4,
    },
    hubName: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    hubStats: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    switchToListBtn: {
        marginTop: 14,
        backgroundColor: COLORS.accent,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    switchToListText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    }
});
