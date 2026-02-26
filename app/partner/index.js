import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Linking, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { MapPin, Clock, DollarSign, Calendar, ChevronRight, CheckCircle, MessageSquare, Phone, Navigation, User, Power, Briefcase, TrendingUp, Star, Zap, IndianRupee } from 'lucide-react-native';

import { getCurrentPartner, logoutPartner, togglePartnerAvailability } from '../../constants/partnerStore';
import { getBookings, bookingEvents, acceptBookingByPartner } from '../../constants/bookingStore';

export default function PartnerDashboard() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const [activeTab, setActiveTab] = useState('new');
    const [myJobs, setMyJobs] = useState([]);
    const [isAvailable, setIsAvailable] = useState(currentPartner?.isAvailable ?? true);
    const [availableJobs, setAvailableJobs] = useState([]);

    const handleToggle = () => {
        const newState = togglePartnerAvailability();
        setIsAvailable(newState);
    };

    const refreshData = () => {
        const allBookings = getBookings();
        const openJobs = allBookings.filter(job =>
            job.status === 'open' &&
            currentPartner?.serviceTypes?.includes(job.serviceType) &&
            parseFloat(job.distance) <= (currentPartner?.location?.radius || 10)
        );
        setAvailableJobs(openJobs);

        const myJobsList = allBookings.filter(job =>
            ['accepted', 'in_progress', 'completed'].includes(job.status) &&
            (job.partnerName === currentPartner?.name)
        );
        setMyJobs(myJobsList);
    };

    useEffect(() => {
        refreshData();
        bookingEvents.on('change', refreshData);
        return () => bookingEvents.off('change', refreshData);
    }, [currentPartner]);

    if (!currentPartner) {
        setTimeout(() => router.replace('/partner/auth'), 0);
        return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.accent} /></View>;
    }

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => { logoutPartner(); router.replace('/partner/auth'); } }
        ]);
    };

    const acceptJob = (job) => {
        Alert.alert('Accept Job', `Accept service for ${job.customerName}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Accept', onPress: () => {
                    const success = acceptBookingByPartner(job.id, currentPartner.name);
                    if (success) Alert.alert('✅ Job Accepted', 'Navigate to the customer location.');
                    else Alert.alert('Error', 'Job may have been taken by another partner.');
                }
            }
        ]);
    };

    const openMap = (address) => {
        const query = encodeURIComponent(address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });
        Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open map."));
    };

    // Stats
    const completedJobs = myJobs.filter(j => j.status === 'completed');
    const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.finalPrice || job.price || 0), 0);
    const commission = totalEarnings * 0.10;
    const payout = totalEarnings - commission;
    const activeJobs = myJobs.filter(j => j.status === 'accepted' || j.status === 'in_progress');

    const renderJobCard = ({ item }) => {
        const isNew = activeTab === 'new';
        const statusColor = item.status === 'completed' ? COLORS.success : item.status === 'in_progress' ? '#f59e0b' : COLORS.accent;
        const statusLabel = item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : item.status === 'accepted' ? 'Accepted' : 'New';

        return (
            <View style={styles.card}>
                {/* Card Top */}
                <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardService}>{item.service}</Text>
                        <Text style={styles.cardCustomer}>{item.customerName}</Text>
                    </View>
                    <View style={[styles.priceBadge, isNew && { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                        <Text style={[styles.priceText, isNew && { color: COLORS.success }]}>₹{item.finalPrice || item.price}</Text>
                    </View>
                </View>

                {/* Card Details */}
                <View style={styles.cardDetails}>
                    <View style={styles.detailChip}>
                        <MapPin size={13} color={COLORS.textTertiary} />
                        <Text style={styles.detailChipText}>{item.distance}</Text>
                    </View>
                    <View style={styles.detailChip}>
                        <Calendar size={13} color={COLORS.textTertiary} />
                        <Text style={styles.detailChipText}>{item.date}</Text>
                    </View>
                    <View style={styles.detailChip}>
                        <Clock size={13} color={COLORS.textTertiary} />
                        <Text style={styles.detailChipText}>{item.time || 'Flexible'}</Text>
                    </View>
                </View>

                {/* Address */}
                <View style={styles.addressRow}>
                    <MapPin size={14} color={COLORS.textSecondary} />
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                </View>

                {/* Status Badge for My Jobs */}
                {!isNew && (
                    <View style={[styles.statusStrip, { backgroundColor: statusColor + '15' }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
                    </View>
                )}

                {/* Actions */}
                {isNew ? (
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptJob(item)}>
                        <Zap size={16} color="#000" />
                        <Text style={styles.acceptBtnText}>Accept Job</Text>
                    </TouchableOpacity>
                ) : item.status === 'completed' ? (
                    <View style={[styles.completedBar]}>
                        <CheckCircle size={16} color={COLORS.success} />
                        <Text style={styles.completedText}>Job Completed</Text>
                        {item.paymentStatus === 'paid' && <Text style={styles.paidBadge}>PAID</Text>}
                    </View>
                ) : (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}>
                            <Phone size={16} color={COLORS.accent} />
                            <Text style={styles.callBtnText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn} onPress={() => openMap(item.address)}>
                            <Navigation size={16} color="#fff" />
                            <Text style={styles.navBtnText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.jobBtn}
                            onPress={() => router.push({ pathname: `/partner/job/${item.id}`, params: item })}
                        >
                            <CheckCircle size={16} color="#fff" />
                            <Text style={styles.jobBtnText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderEarningsTab = () => (
        <ScrollView contentContainerStyle={styles.earningsScroll}>
            {/* Payout Hero */}
            <View style={styles.payoutHero}>
                <Text style={styles.payoutLabel}>Net Payout</Text>
                <Text style={styles.payoutAmount}>₹{payout.toFixed(0)}</Text>
                <Text style={styles.payoutSub}>{completedJobs.length} jobs completed</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <TrendingUp size={20} color={COLORS.accent} />
                    <Text style={styles.statValue}>₹{totalEarnings.toFixed(0)}</Text>
                    <Text style={styles.statLabel}>Revenue</Text>
                </View>
                <View style={styles.statCard}>
                    <IndianRupee size={20} color={COLORS.danger} />
                    <Text style={styles.statValue}>-₹{commission.toFixed(0)}</Text>
                    <Text style={styles.statLabel}>Commission (10%)</Text>
                </View>
                <View style={styles.statCard}>
                    <Star size={20} color={COLORS.gold} />
                    <Text style={styles.statValue}>{currentPartner.performanceScore || 0}</Text>
                    <Text style={styles.statLabel}>Score</Text>
                </View>
                <View style={styles.statCard}>
                    <Briefcase size={20} color={COLORS.success} />
                    <Text style={styles.statValue}>{activeJobs.length}</Text>
                    <Text style={styles.statLabel}>Active Jobs</Text>
                </View>
            </View>

            {/* Recent Completed */}
            {completedJobs.length > 0 && (
                <View style={styles.recentSection}>
                    <Text style={styles.recentTitle}>Recent Completions</Text>
                    {completedJobs.slice(0, 5).map(job => (
                        <View key={job.id} style={styles.recentItem}>
                            <View>
                                <Text style={styles.recentService}>{job.service}</Text>
                                <Text style={styles.recentCustomer}>{job.customerName}</Text>
                            </View>
                            <Text style={styles.recentPrice}>₹{job.finalPrice || job.price}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting}>Hi, {currentPartner?.name?.split(' ')[0] || 'Partner'} 👋</Text>
                    <Text style={styles.subGreeting}>{(currentPartner?.serviceTypes || []).join(' • ')}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/partner/profile')} style={styles.headerBtn}>
                    <User size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={[styles.headerBtn, { marginLeft: 8 }]}>
                    <Power size={20} color={COLORS.danger} />
                </TouchableOpacity>
            </View>

            {/* Availability Toggle */}
            <TouchableOpacity
                style={[styles.availToggle, { backgroundColor: isAvailable ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)', borderColor: isAvailable ? COLORS.success : COLORS.danger }]}
                onPress={handleToggle}
                activeOpacity={0.7}
            >
                <View style={[styles.toggleDot, { backgroundColor: isAvailable ? COLORS.success : COLORS.danger }]} />
                <Text style={[styles.toggleText, { color: isAvailable ? COLORS.success : COLORS.danger }]}>
                    {isAvailable ? 'ONLINE — Accepting Jobs' : 'OFFLINE — Not Accepting'}
                </Text>
            </TouchableOpacity>

            {/* Quick Stats Bar */}
            <View style={styles.quickStats}>
                <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatValue}>{availableJobs.length}</Text>
                    <Text style={styles.quickStatLabel}>Available</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatValue}>{activeJobs.length}</Text>
                    <Text style={styles.quickStatLabel}>Active</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatValue}>{completedJobs.length}</Text>
                    <Text style={styles.quickStatLabel}>Done</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStatItem}>
                    <Text style={[styles.quickStatValue, { color: COLORS.success }]}>₹{payout.toFixed(0)}</Text>
                    <Text style={styles.quickStatLabel}>Earnings</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {[
                    { key: 'new', label: 'New Requests', count: availableJobs.length },
                    { key: 'my', label: 'My Jobs', count: myJobs.length },
                    { key: 'earnings', label: 'Earnings', count: null },
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
                        {tab.count > 0 && (
                            <View style={[styles.badge, activeTab === tab.key && { backgroundColor: COLORS.accent }]}>
                                <Text style={styles.badgeText}>{tab.count}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {activeTab === 'earnings' ? renderEarningsTab() : (
                <FlatList
                    data={activeTab === 'new' ? (isAvailable ? availableJobs : []) : myJobs}
                    keyExtractor={item => item.id}
                    renderItem={renderJobCard}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Briefcase size={48} color={COLORS.border} />
                            <Text style={styles.emptyTitle}>
                                {!isAvailable && activeTab === 'new' ? 'You are Offline' : 'No Jobs Found'}
                            </Text>
                            <Text style={styles.emptyText}>
                                {!isAvailable && activeTab === 'new'
                                    ? 'Go online to start receiving job requests.'
                                    : activeTab === 'new' ? 'New requests will appear here when customers book.' : 'Accepted jobs will appear here.'}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Floating Chat */}
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/partner/messages')}>
                <MessageSquare size={22} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgPrimary },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    },
    greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
    subGreeting: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
    headerBtn: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.bgSecondary,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
    },
    availToggle: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginHorizontal: SPACING.lg, paddingVertical: 14, borderRadius: 12,
        borderWidth: 1.5, gap: 10, marginBottom: SPACING.sm,
    },
    toggleDot: { width: 10, height: 10, borderRadius: 5 },
    toggleText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
    quickStats: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        marginHorizontal: SPACING.lg, paddingVertical: 12,
        backgroundColor: COLORS.bgSecondary, borderRadius: 12,
        borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm,
    },
    quickStatItem: { alignItems: 'center', flex: 1 },
    quickStatValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    quickStatLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
    quickStatDivider: { width: 1, height: 28, backgroundColor: COLORS.border },
    tabs: {
        flexDirection: 'row', paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1, borderColor: COLORS.border,
    },
    tab: {
        paddingVertical: 12, marginRight: SPACING.xl,
        flexDirection: 'row', alignItems: 'center', gap: 6,
    },
    activeTab: { borderBottomWidth: 2, borderColor: COLORS.accent },
    tabText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
    activeTabText: { color: COLORS.accent },
    badge: {
        backgroundColor: COLORS.danger, borderRadius: 10,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    listContent: { padding: SPACING.lg, paddingBottom: 100 },

    // Job Card
    card: {
        backgroundColor: COLORS.bgSecondary, borderRadius: 16, padding: SPACING.lg,
        marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    cardService: { fontSize: 17, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 2 },
    cardCustomer: { fontSize: 13, color: COLORS.textSecondary },
    priceBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    },
    priceText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 15 },
    cardDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    detailChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    },
    detailChipText: { color: COLORS.textTertiary, fontSize: 12 },
    addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    addressText: { color: COLORS.textSecondary, fontSize: 13, flex: 1 },
    statusStrip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 12,
    },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusLabel: { fontSize: 12, fontWeight: 'bold' },
    acceptBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.accent, paddingVertical: 13, borderRadius: 10,
    },
    acceptBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
    completedBar: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8,
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
    },
    completedText: { color: COLORS.success, fontWeight: '600', fontSize: 14, flex: 1 },
    paidBadge: {
        backgroundColor: COLORS.success, color: '#fff', fontSize: 10,
        fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden',
    },
    actionRow: { flexDirection: 'row', gap: 8 },
    callBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 11, borderRadius: 8, borderWidth: 1, borderColor: COLORS.accent,
    },
    callBtnText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 13 },
    navBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 11, borderRadius: 8, backgroundColor: COLORS.accent,
    },
    navBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    jobBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 11, borderRadius: 8, backgroundColor: COLORS.success,
    },
    jobBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

    // Empty State
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 16, marginBottom: 6 },
    emptyText: { color: COLORS.textTertiary, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },

    // Earnings Tab
    earningsScroll: { padding: SPACING.lg, paddingBottom: 100 },
    payoutHero: {
        alignItems: 'center', paddingVertical: SPACING.xl,
        backgroundColor: 'rgba(34,197,94,0.06)', borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)', marginBottom: SPACING.lg,
    },
    payoutLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
    payoutAmount: { fontSize: 40, fontWeight: '900', color: COLORS.success },
    payoutSub: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
    statCard: {
        flex: 1, minWidth: '45%', backgroundColor: COLORS.bgSecondary,
        padding: SPACING.md, borderRadius: 12, alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border,
    },
    statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 6 },
    statLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
    recentSection: {
        backgroundColor: COLORS.bgSecondary, borderRadius: 12, padding: SPACING.lg,
        borderWidth: 1, borderColor: COLORS.border,
    },
    recentTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.md },
    recentItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.border,
    },
    recentService: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    recentCustomer: { fontSize: 12, color: COLORS.textTertiary },
    recentPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.success },

    // FAB
    fab: {
        position: 'absolute', bottom: 24, right: 20,
        backgroundColor: COLORS.accent, width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
        elevation: 6, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8,
    },
});
