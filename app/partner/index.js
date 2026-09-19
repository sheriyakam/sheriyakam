import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
    ActivityIndicator, Linking, Platform, ScrollView, Animated, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import {
    MapPin, Clock, Calendar, ChevronRight, CheckCircle, Phone,
    Navigation, User, Power, Briefcase, TrendingUp, Star, Zap,
    IndianRupee, Shield, Award, AlertTriangle, BookOpen, Headphones,
    X, Bell, Radio, ArrowUpRight, Flame, Trophy, Gift, Target, Sparkles
} from 'lucide-react-native';

import {
    getCurrentPartner, logoutPartner, togglePartnerAvailability, DEFAULT_PARTNER_MOCK
} from '../../constants/partnerStore';
import {
    getBookings, bookingEvents, acceptBookingByPartner, triggerMockJobPing
} from '../../constants/bookingStore';

export default function PartnerDashboard() {
    const router = useRouter();
    const [currentPartner, setCurrentPartner] = useState(getCurrentPartner() || DEFAULT_PARTNER_MOCK);
    const [isAvailable, setIsAvailable] = useState(currentPartner?.isAvailable ?? false);
    const [myJobs, setMyJobs] = useState([]);
    const [openRequests, setOpenRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'requests', 'completed'

    // Incoming Job Ping Modal state (Screen 3)
    const [activePing, setActivePing] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const countdownTimerRef = useRef(null);

    // Pulse animation for Online status & Ping
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pingScaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.25, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const refreshData = () => {
        const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
        setCurrentPartner(partner);
        setIsAvailable(partner.isAvailable ?? false);

        const allBookings = getBookings();
        const partnerName = partner.name || 'Shyam Prasad';

        const mine = allBookings.filter(b =>
            ['accepted', 'arrived', 'in_progress', 'completed'].includes(b.status) &&
            (b.partnerName === partnerName || b.assignedPartnerName === partnerName)
        );
        setMyJobs(mine);

        const openList = allBookings.filter(b => b.status === 'open');
        setOpenRequests(openList);
    };

    useEffect(() => {
        refreshData();
        bookingEvents.on('change', refreshData);
        return () => bookingEvents.off('change', refreshData);
    }, []);

    // Toggle Online/Offline (Default Offline)
    const handleToggleAvailability = () => {
        const newState = togglePartnerAvailability();
        setIsAvailable(newState);
        if (newState) {
            Alert.alert(
                '⚡ You are now Online',
                'Ready to receive high-priority emergency and scheduled job pings across Thalassery & Kannur.'
            );
        } else {
            Alert.alert('Offline Mode', 'You are now offline and will not receive new incoming job pings.');
            if (activePing) {
                dismissPing();
            }
        }
    };

    // Trigger Job Ping simulation
    const handleSimulateJobPing = () => {
        if (!isAvailable) {
            Alert.alert(
                'Go Online First',
                'Please toggle your status to ONLINE to receive incoming job pings.',
                [
                    { text: 'Go Online', onPress: handleToggleAvailability },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            return;
        }

        const newPing = triggerMockJobPing();
        startJobPing(newPing);
    };

    const startJobPing = (job) => {
        setActivePing(job);
        setCountdown(25);

        Animated.spring(pingScaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();

        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownTimerRef.current);
                    dismissPing('Job Reassigned', 'The timer expired and the job was auto-reassigned to the next available partner.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const dismissPing = (title = null, message = null) => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        setActivePing(null);
        if (title) Alert.alert(title, message);
    };

    const handleAcceptPing = (job) => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        const partnerName = currentPartner?.name || 'Shyam Prasad';
        acceptBookingByPartner(job.id, partnerName);
        setActivePing(null);

        Alert.alert(
            '✅ Job Accepted!',
            'Proceed to customer location. Live GPS arrived tracking is enabled.',
            [
                {
                    text: 'View Active Job',
                    onPress: () => router.push({ pathname: `/partner/job/${job.id}`, params: job })
                }
            ]
        );
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

    // Calculate Summary
    const activeJobsList = myJobs.filter(j => ['accepted', 'arrived', 'in_progress'].includes(j.status));
    const completedJobs = myJobs.filter(j => j.status === 'completed');
    const todayGross = completedJobs.reduce((sum, j) => sum + (j.finalPrice || j.price || 0), 0) + (currentPartner.todayEarnings || 0);
    const todayNet = Math.round(todayGross * 0.90);

    const nextScheduled = currentPartner.schedule?.[0];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Partner Brand Header */}
            <View style={styles.topHeader}>
                <View style={styles.brandRow}>
                    <View style={styles.brandLogo}>
                        <Zap size={18} color="#fff" fill="#fff" />
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.brandName}>Sheriyakam Partner</Text>
                            <View style={styles.kselbBadge}>
                                <Text style={styles.kselbText}>KSELB LICENSED</Text>
                            </View>
                        </View>
                        <Text style={styles.brandSub}>Thalassery HQ • Kerala District Hub</Text>
                    </View>
                </View>

                <View style={styles.headerRightActions}>
                    <TouchableOpacity
                        style={styles.headerIconBtn}
                        onPress={() => router.push('/partner/profile')}
                    >
                        <User size={18} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.headerIconBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]}
                        onPress={() => {
                            Alert.alert('Logout', 'Are you sure you want to end your session?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Logout', style: 'destructive', onPress: () => { logoutPartner(); router.replace('/partner/auth'); } }
                            ]);
                        }}
                    >
                        <Power size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Online / Offline Floating Switcher (Swiggy / Urban Company Pattern) */}
                <View style={[
                    styles.availabilityCard,
                    {
                        borderColor: isAvailable ? COLORS.success : 'rgba(239, 68, 68, 0.4)',
                        backgroundColor: isAvailable ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.06)'
                    }
                ]}>
                    <View style={styles.availLeft}>
                        <View style={styles.radarWrapper}>
                            {isAvailable && (
                                <Animated.View style={[
                                    styles.radarPulse,
                                    { transform: [{ scale: pulseAnim }], borderColor: COLORS.success }
                                ]} />
                            )}
                            <View style={[styles.statusDot, { backgroundColor: isAvailable ? COLORS.success : COLORS.danger }]} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.availTitle, { color: isAvailable ? COLORS.success : COLORS.textPrimary }]}>
                                {isAvailable ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                            </Text>
                            <Text style={styles.availSub}>
                                {isAvailable
                                    ? 'Ready for incoming on-demand emergency pings in Thalassery'
                                    : 'Toggle online to receive live jobs and boost daily payout'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.toggleActionBtn,
                            { backgroundColor: isAvailable ? COLORS.success : COLORS.bgTertiary }
                        ]}
                        onPress={handleToggleAvailability}
                        activeOpacity={0.8}
                    >
                        <Power size={16} color="#fff" />
                        <Text style={styles.toggleActionBtnText}>{isAvailable ? 'Go Offline' : 'Go Online'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Insurance & Safety Guarantee Strip */}
                <View style={styles.insuranceStrip}>
                    <Shield size={16} color={COLORS.gold} />
                    <Text style={styles.insuranceText}>
                        <Text style={{ fontWeight: '800', color: COLORS.gold }}>₹5 Lakh Cover: </Text>
                        On-duty accidental & third-party trade protection active.
                    </Text>
                </View>

                {/* Surge & Loyalty Badges Row */}
                <View style={styles.perksRow}>
                    <View style={styles.surgeBadge}>
                        <Zap size={14} color="#F59E0B" />
                        <Text style={styles.surgeBadgeText}>1.25x Night Surge Active</Text>
                    </View>
                    <View style={styles.loyaltyBadge}>
                        <Award size={14} color="#10B981" />
                        <Text style={styles.loyaltyBadgeText}>Gold Partner (1.5x Priority)</Text>
                    </View>
                </View>

                {/* Weekly Incentive Milestone Progress Card */}
                <View style={styles.incentiveCard}>
                    <View style={styles.incentiveHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Target size={18} color={COLORS.accent} />
                            <Text style={styles.incentiveTitle}>WEEKLY EARNING INCENTIVE</Text>
                        </View>
                        <View style={styles.incentiveRewardBadge}>
                            <Text style={styles.incentiveRewardText}>+₹500 Bonus</Text>
                        </View>
                    </View>
                    <Text style={styles.incentiveSub}>
                        Complete 10 jobs this week to unlock ₹500 extra payout. <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>3 jobs remaining!</Text>
                    </Text>
                    <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: '70%' }]} />
                    </View>
                    <View style={styles.incentiveFooter}>
                        <Text style={styles.incentiveStats}>7 / 10 Jobs Completed (70%)</Text>
                        <Text style={styles.incentiveExpiry}>Expires in 3 days</Text>
                    </View>
                </View>

                {/* Today's Earnings & Performance Summary */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <View style={styles.metricIconWrap}>
                            <IndianRupee size={16} color={COLORS.success} />
                        </View>
                        <Text style={styles.metricValue}>₹{todayNet}</Text>
                        <Text style={styles.metricLabel}>Today's Net Payout</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(79, 70, 229, 0.15)' }]}>
                            <Briefcase size={16} color={COLORS.accent} />
                        </View>
                        <Text style={styles.metricValue}>{completedJobs.length + 3}</Text>
                        <Text style={styles.metricLabel}>Jobs Completed</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
                            <Clock size={16} color={COLORS.gold} />
                        </View>
                        <Text style={styles.metricValue}>4.5 h</Text>
                        <Text style={styles.metricLabel}>Online Hours</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <Star size={16} color={COLORS.success} />
                        </View>
                        <Text style={styles.metricValue}>4.92 ★</Text>
                        <Text style={styles.metricLabel}>Rating Tier 1</Text>
                    </View>
                </View>

                {/* Next Scheduled Job Card (if any pre-booked / AMC) */}
                {nextScheduled && (
                    <View style={styles.scheduledBanner}>
                        <View style={styles.scheduledBannerHeader}>
                            <View style={styles.scheduledBadge}>
                                <Calendar size={12} color="#fff" />
                                <Text style={styles.scheduledBadgeText}>NEXT SCHEDULED JOB</Text>
                            </View>
                            <Text style={styles.scheduledTime}>{nextScheduled.date} • {nextScheduled.time}</Text>
                        </View>
                        <Text style={styles.scheduledService}>{nextScheduled.service}</Text>
                        <Text style={styles.scheduledCustomer}>{nextScheduled.customer} • {nextScheduled.address}</Text>
                        <View style={styles.scheduledFooter}>
                            <Text style={styles.scheduledPayout}>Est. Payout: ₹{nextScheduled.payout}</Text>
                            <TouchableOpacity
                                style={styles.viewScheduleBtn}
                                onPress={() => router.push('/partner/schedule')}
                            >
                                <Text style={styles.viewScheduleText}>Open Calendar →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Quick Companion Services Menu (Screens 5-9) */}
                <Text style={styles.sectionHeaderTitle}>PARTNER SUITE</Text>
                <View style={styles.menuGrid}>
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/earnings')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <TrendingUp size={20} color={COLORS.success} />
                        </View>
                        <Text style={styles.menuCardTitle}>Earnings</Text>
                        <Text style={styles.menuCardSub}>Statements & bank payout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/ratings')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
                            <Star size={20} color={COLORS.gold} />
                        </View>
                        <Text style={styles.menuCardTitle}>Ratings & Priority</Text>
                        <Text style={styles.menuCardSub}>Reviews & dispatch tier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/training')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(79, 70, 229, 0.15)' }]}>
                            <BookOpen size={20} color={COLORS.accent} />
                        </View>
                        <Text style={styles.menuCardTitle}>Certifications</Text>
                        <Text style={styles.menuCardSub}>Unlock new job types</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/schedule')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                            <Calendar size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.menuCardTitle}>Schedule</Text>
                        <Text style={styles.menuCardSub}>AMC & pre-booked slots</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/support')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                            <Headphones size={20} color={COLORS.danger} />
                        </View>
                        <Text style={styles.menuCardTitle}>Partner SOS</Text>
                        <Text style={styles.menuCardSub}>Supervisor line & disputes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/leaderboard')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
                            <Trophy size={20} color={COLORS.gold} />
                        </View>
                        <Text style={styles.menuCardTitle}>Leaderboard</Text>
                        <Text style={styles.menuCardSub}>Kerala weekly rankings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => router.push('/partner/referrals')}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <Gift size={20} color={COLORS.success} />
                        </View>
                        <Text style={styles.menuCardTitle}>Refer & Earn</Text>
                        <Text style={styles.menuCardSub}>₹500 per electrician</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuCard, { borderColor: COLORS.accent }]}
                        onPress={handleSimulateJobPing}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: 'rgba(79, 70, 229, 0.2)' }]}>
                            <Flame size={20} color={COLORS.accent} />
                        </View>
                        <Text style={[styles.menuCardTitle, { color: COLORS.accent }]}>Simulate Ping</Text>
                        <Text style={styles.menuCardSub}>Test 30s incoming alert</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Jobs & Live Requests Tabs */}
                <View style={styles.jobsSectionHeader}>
                    <Text style={styles.sectionHeaderTitle}>CURRENT WORKLOAD</Text>
                    <View style={styles.tabsRow}>
                        <TouchableOpacity
                            style={[styles.tabChip, activeTab === 'active' && styles.tabChipActive]}
                            onPress={() => setActiveTab('active')}
                        >
                            <Text style={[styles.tabChipText, activeTab === 'active' && styles.tabChipTextActive]}>
                                Active Jobs ({activeJobsList.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabChip, activeTab === 'requests' && styles.tabChipActive]}
                            onPress={() => setActiveTab('requests')}
                        >
                            <Text style={[styles.tabChipText, activeTab === 'requests' && styles.tabChipTextActive]}>
                                Open Requests ({openRequests.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabChip, activeTab === 'completed' && styles.tabChipActive]}
                            onPress={() => setActiveTab('completed')}
                        >
                            <Text style={[styles.tabChipText, activeTab === 'completed' && styles.tabChipTextActive]}>
                                History ({completedJobs.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Job Cards Render */}
                {activeTab === 'active' && (
                    activeJobsList.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Briefcase size={36} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Active Jobs Assigned</Text>
                            <Text style={styles.emptySubtitle}>
                                Turn online to receive direct dispatch alerts from customers nearby.
                            </Text>
                            <TouchableOpacity style={styles.emptyActionBtn} onPress={handleSimulateJobPing}>
                                <Text style={styles.emptyActionBtnText}>Simulate Incoming Job Ping</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        activeJobsList.map(job => (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.jobCardTop}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                            <Text style={styles.jobServiceName}>{job.service}</Text>
                                            {job.status === 'arrived' && (
                                                <View style={styles.arrivedBadge}>
                                                    <Text style={styles.arrivedBadgeText}>ARRIVED</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.jobCustomerName}>{job.customerName}</Text>
                                    </View>
                                    <View style={styles.jobPriceBadge}>
                                        <Text style={styles.jobPriceText}>₹{job.finalPrice || job.price}</Text>
                                    </View>
                                </View>

                                <View style={styles.jobAddressRow}>
                                    <MapPin size={14} color={COLORS.textTertiary} />
                                    <Text style={styles.jobAddressText} numberOfLines={1}>{job.address}</Text>
                                </View>

                                <View style={styles.jobDetailsChipRow}>
                                    <View style={styles.chipPill}>
                                        <Clock size={12} color={COLORS.textTertiary} />
                                        <Text style={styles.chipPillText}>{job.time || 'Immediate'}</Text>
                                    </View>
                                    <View style={styles.chipPill}>
                                        <Compass size={12} color={COLORS.textTertiary} />
                                        <Text style={styles.chipPillText}>{job.distance || '1.5 km'}</Text>
                                    </View>
                                </View>

                                <View style={styles.jobActionButtons}>
                                    <TouchableOpacity
                                        style={styles.callCustomerBtn}
                                        onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                                    >
                                        <Phone size={15} color={COLORS.accent} />
                                        <Text style={styles.callCustomerText}>Call</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.navMapBtn}
                                        onPress={() => openMap(job.address)}
                                    >
                                        <Navigation size={15} color="#fff" />
                                        <Text style={styles.navMapText}>Navigate</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.manageJobBtn}
                                        onPress={() => router.push({ pathname: `/partner/job/${job.id}`, params: job })}
                                    >
                                        <Text style={styles.manageJobText}>Open Job Flow →</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )
                )}

                {activeTab === 'requests' && (
                    openRequests.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Bell size={36} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Pending Broadcasts</Text>
                            <Text style={styles.emptySubtitle}>
                                All open customer requests in your district have been claimed.
                            </Text>
                        </View>
                    ) : (
                        openRequests.map(job => (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.jobCardTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.jobServiceName}>{job.service}</Text>
                                        <Text style={styles.jobCustomerName}>{job.customerName}</Text>
                                    </View>
                                    <View style={[styles.jobPriceBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                        <Text style={[styles.jobPriceText, { color: COLORS.success }]}>₹{job.price}</Text>
                                    </View>
                                </View>
                                <View style={styles.jobAddressRow}>
                                    <MapPin size={14} color={COLORS.textTertiary} />
                                    <Text style={styles.jobAddressText}>{job.address}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.acceptDirectBtn}
                                    onPress={() => handleAcceptPing(job)}
                                >
                                    <Zap size={16} color="#000" />
                                    <Text style={styles.acceptDirectBtnText}>Claim Job Now</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )
                )}

                {activeTab === 'completed' && (
                    completedJobs.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <CheckCircle size={36} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Completed Jobs Yet</Text>
                            <Text style={styles.emptySubtitle}>Your completed services and payment logs will be stored here.</Text>
                        </View>
                    ) : (
                        completedJobs.map(job => (
                            <View key={job.id} style={[styles.jobCard, { borderColor: 'rgba(255,255,255,0.06)' }]}>
                                <View style={styles.jobCardTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.jobServiceName}>{job.service}</Text>
                                        <Text style={styles.jobCustomerName}>{job.customerName} • {job.address}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={[styles.jobPriceText, { color: COLORS.success }]}>₹{job.finalPrice || job.price}</Text>
                                        <Text style={{ fontSize: 10, color: COLORS.textTertiary, fontWeight: '700' }}>COMPLETED</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )
                )}
            </ScrollView>

            {/* SCREEN 3: HIGH-PRIORITY INCOMING JOB PING OVERLAY (Swiggy / Urban Company Pattern) */}
            <Modal
                visible={!!activePing}
                transparent={true}
                animationType="slide"
                onRequestClose={() => dismissPing()}
            >
                <View style={styles.pingOverlay}>
                    <Animated.View style={[styles.pingCard, { transform: [{ scale: pingScaleAnim }] }]}>
                        {/* Countdown Header */}
                        <View style={styles.pingCountdownHeader}>
                            <View style={styles.liveAlarmPill}>
                                <Radio size={14} color="#fff" />
                                <Text style={styles.liveAlarmText}>NEW JOB PING</Text>
                            </View>
                            <View style={styles.timerCircle}>
                                <Text style={styles.timerText}>{countdown}s</Text>
                            </View>
                        </View>

                        {/* Payout & Service */}
                        <View style={styles.pingHero}>
                            <Text style={styles.pingEstLabel}>ESTIMATED NET PAYOUT</Text>
                            <Text style={styles.pingEstAmount}>₹{Math.round((activePing?.price || 550) * 0.90)}</Text>
                            <Text style={styles.pingServiceTitle}>{activePing?.service}</Text>
                        </View>

                        {/* Location Details */}
                        <View style={styles.pingLocationCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <MapPin size={16} color={COLORS.accent} />
                                <Text style={styles.pingDistance}>{activePing?.distance || '1.8 km away'}</Text>
                            </View>
                            <Text style={styles.pingAddress}>{activePing?.address}</Text>
                            {activePing?.notes && (
                                <Text style={styles.pingNotes}>Note: "{activePing.notes}"</Text>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.pingActions}>
                            <TouchableOpacity
                                style={styles.pingDeclineBtn}
                                onPress={() => dismissPing('Job Declined', 'The request was passed to another electrician.')}
                            >
                                <X size={18} color={COLORS.danger} />
                                <Text style={styles.pingDeclineText}>Decline</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.pingAcceptBtn}
                                onPress={() => handleAcceptPing(activePing)}
                                activeOpacity={0.8}
                            >
                                <Zap size={20} color="#000" fill="#000" />
                                <Text style={styles.pingAcceptText}>ACCEPT JOB ({countdown}s)</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandLogo: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    brandSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    kselbBadge: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    kselbText: {
        color: COLORS.gold,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 40,
    },

    /* Online/Offline Card */
    availabilityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 18,
        borderWidth: 1.5,
        marginBottom: 12,
    },
    availLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 10,
    },
    radarWrapper: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    radarPulse: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
    },
    statusDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    availTitle: {
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    availSub: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
        lineHeight: 16,
    },
    toggleActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    toggleActionBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
    },

    /* Insurance Strip */
    insuranceStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
        gap: 8,
    },
    insuranceText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        flex: 1,
    },

    /* Perks & Surge Badges */
    perksRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    surgeBadge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 10,
    },
    surgeBadgeText: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: '800',
    },
    loyaltyBadge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 10,
    },
    loyaltyBadgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '800',
    },

    /* Weekly Incentive Card */
    incentiveCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        gap: 8,
    },
    incentiveHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incentiveTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    incentiveRewardBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.4)',
    },
    incentiveRewardText: {
        color: '#60A5FA',
        fontWeight: '900',
        fontSize: 11,
    },
    incentiveSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 16,
    },
    progressBarTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 4,
    },
    incentiveFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incentiveStats: {
        color: COLORS.textPrimary,
        fontSize: 11,
        fontWeight: '700',
    },
    incentiveExpiry: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },

    /* Metrics Grid */
    metricsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    metricCard: {
        flex: 1,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    metricIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    metricValue: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    metricLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
        textAlign: 'center',
    },

    /* Scheduled Banner */
    scheduledBanner: {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        marginBottom: 20,
    },
    scheduledBannerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scheduledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    scheduledBadgeText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 9,
        letterSpacing: 0.5,
    },
    scheduledTime: {
        color: '#93C5FD',
        fontSize: 12,
        fontWeight: '700',
    },
    scheduledService: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
        marginBottom: 4,
    },
    scheduledCustomer: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginBottom: 12,
    },
    scheduledFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(59, 130, 246, 0.15)',
        paddingTop: 8,
    },
    scheduledPayout: {
        color: COLORS.success,
        fontWeight: '800',
        fontSize: 13,
    },
    viewScheduleBtn: {
        paddingVertical: 4,
    },
    viewScheduleText: {
        color: '#60A5FA',
        fontWeight: '700',
        fontSize: 12,
    },

    /* Companion Suite Grid */
    sectionHeaderTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 10,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    menuCard: {
        width: '48%',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    menuCardTitle: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 14,
    },
    menuCardSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },

    /* Current Workload Section */
    jobsSectionHeader: {
        marginBottom: 12,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    tabChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    tabChipText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    tabChipTextActive: {
        color: '#fff',
        fontWeight: '800',
    },

    /* Job Card */
    jobCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },
    jobCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    jobServiceName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 15,
    },
    arrivedBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    arrivedBadgeText: {
        color: '#60A5FA',
        fontWeight: '900',
        fontSize: 9,
    },
    jobCustomerName: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    jobPriceBadge: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    jobPriceText: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    jobAddressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    jobAddressText: {
        color: COLORS.textTertiary,
        fontSize: 12,
        flex: 1,
    },
    jobDetailsChipRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    chipPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    chipPillText: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    jobActionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    callCustomerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    callCustomerText: {
        color: COLORS.accent,
        fontWeight: '700',
        fontSize: 12,
    },
    navMapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#2563EB',
    },
    navMapText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    manageJobBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.accent,
    },
    manageJobText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 13,
    },
    acceptDirectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.gold,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
        marginTop: 6,
    },
    acceptDirectBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 13,
    },

    emptyCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 8,
    },
    emptyTitle: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 15,
        marginTop: 4,
    },
    emptySubtitle: {
        color: COLORS.textTertiary,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    emptyActionBtn: {
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.accent,
        marginTop: 8,
    },
    emptyActionBtnText: {
        color: COLORS.accent,
        fontWeight: '700',
        fontSize: 12,
    },

    /* Screen 3: Job Ping Modal Overlay */
    pingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pingCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        borderColor: COLORS.gold,
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    pingCountdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    liveAlarmPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.danger,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    liveAlarmText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 1,
    },
    timerCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: COLORS.gold,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
    },
    timerText: {
        color: COLORS.gold,
        fontWeight: '900',
        fontSize: 15,
    },
    pingHero: {
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    pingEstLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    pingEstAmount: {
        color: COLORS.success,
        fontSize: 34,
        fontWeight: '900',
        marginVertical: 4,
    },
    pingServiceTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 17,
        textAlign: 'center',
    },
    pingLocationCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        marginBottom: 20,
    },
    pingDistance: {
        color: COLORS.accent,
        fontWeight: '800',
        fontSize: 13,
    },
    pingAddress: {
        color: COLORS.textPrimary,
        fontSize: 13,
        lineHeight: 18,
    },
    pingNotes: {
        color: COLORS.gold,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 6,
    },
    pingActions: {
        flexDirection: 'row',
        gap: 12,
    },
    pingDeclineBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    pingDeclineText: {
        color: COLORS.danger,
        fontWeight: '800',
        fontSize: 14,
    },
    pingAcceptBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: COLORS.gold,
    },
    pingAcceptText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 14,
    },
});
