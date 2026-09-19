import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Linking, Platform, Modal, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Calendar, Clock, MapPin, Phone, Navigation,
    CheckCircle, Shield, AlertTriangle, ChevronRight, X,
    CalendarCheck, UserCheck, CalendarOff, Plus, Route, Compass, Trash2, Check
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    getCurrentPartner, DEFAULT_PARTNER_MOCK,
    getBlockedSlots, addBlockedSlot, removeBlockedSlot
} from '../../constants/partnerStore';

export default function PartnerSchedule() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;

    // Day Strip for the current week
    const daysOfWeek = [
        { key: 'today', label: 'Today', date: '19 Sep', activeCount: 0 },
        { key: 'tomorrow', label: 'Tomorrow', date: '20 Sep', activeCount: 1 },
        { key: 'thu', label: 'Thu', date: '21 Sep', activeCount: 1 },
        { key: 'fri', label: 'Fri', date: '22 Sep', activeCount: 1 },
        { key: 'sat', label: 'Sat', date: '23 Sep', activeCount: 0 },
        { key: 'sun', label: 'Sun', date: '24 Sep', activeCount: 0 },
        { key: 'mon', label: 'Mon', date: '25 Sep', activeCount: 0 }
    ];

    const [selectedDay, setSelectedDay] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all'); // all, amc, audit, install
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveDay, setLeaveDay] = useState('Tomorrow');
    const [blockedSlotsList, setBlockedSlotsList] = useState(getBlockedSlots());
    const [routeOptimized, setRouteOptimized] = useState(false);

    const [scheduledJobs, setScheduledJobs] = useState([
        {
            id: 'sch-1',
            dayKey: 'tomorrow',
            date: 'Tomorrow, 20 Sep',
            time: '10:00 AM - 12:00 PM',
            service: 'Split AC Annual Maintenance (AMC Contract)',
            category: 'amc',
            customer: 'Dr. Vivek Menon',
            phone: '9847123456',
            address: 'Sea View Ward, Thalassery, Kannur District',
            distance: '2.4 km away',
            payout: 750,
            gross: 830,
            typeBadge: 'Quarterly AMC (Visit 2 of 4)',
            notes: 'Customer requested indoor evaporator coil foaming and blower wheel high-pressure rinse.'
        },
        {
            id: 'sch-2',
            dayKey: 'thu',
            date: 'Thursday, 21 Sep',
            time: '02:00 PM - 04:00 PM',
            service: 'Earth Resistance Audit & Grounding Spike Installation',
            category: 'audit',
            customer: 'Kottayam House',
            phone: '9447654321',
            address: 'Temple Gate, Thalassery',
            distance: '3.1 km away',
            payout: 1200,
            gross: 1330,
            typeBadge: 'Safety Inspection Audit',
            notes: 'Test earth loop impedance below 5 Ohms per KSELB standards. Chemical copper earthing spike needed.'
        },
        {
            id: 'sch-3',
            dayKey: 'fri',
            date: 'Friday, 22 Sep',
            time: '11:30 AM - 01:30 PM',
            service: '8-Channel IP CCTV & Dahua NVR Setup',
            category: 'install',
            customer: 'Rainbow Supermarket',
            phone: '9745112233',
            address: 'Logan\'s Road, Thalassery',
            distance: '1.8 km away',
            payout: 2100,
            gross: 2330,
            typeBadge: 'Commercial Installation',
            notes: 'Pre-laid Cat6 cable termination and mobile DMSS app cloud setup on owner phone.'
        }
    ]);

    const filteredJobs = scheduledJobs.filter(job => {
        const matchesDay = selectedDay === 'all' || job.dayKey === selectedDay;
        const matchesCat = filterCategory === 'all' || job.category === filterCategory;
        return matchesDay && matchesCat;
    });

    const totalPayout = scheduledJobs.reduce((sum, j) => sum + j.payout, 0);

    const handleCallCustomer = (phone) => {
        Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', 'Unable to initiate phone call.'));
    };

    const handleOpenMap = (address) => {
        const query = encodeURIComponent(address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });
        Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open map.'));
    };

    const handleRescheduleRequest = (job) => {
        Alert.alert(
            'Request Slot Reschedule',
            `Do you want to request a slot change for ${job.customer}? Our Thalassery dispatch desk will contact the customer to confirm an alternate time.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Request Change',
                    onPress: () => {
                        Alert.alert('Request Logged', 'Reschedule ticket #RS-992 created. Dispatcher will update within 2 hours.');
                    }
                }
            ]
        );
    };

    const handleConfirmLeave = () => {
        if (!leaveReason.trim()) {
            Alert.alert('Missing Detail', 'Please briefly provide a reason for blocking time off.');
            return;
        }

        const added = addBlockedSlot({
            date: leaveDay,
            timeSlot: '02:00 PM - 06:00 PM',
            reason: leaveReason.trim()
        });

        setBlockedSlotsList(getBlockedSlots());
        setIsLeaveModalOpen(false);
        Alert.alert(
            '✅ Slot Blocked',
            `Your unavailability for ${leaveDay} has been registered. No scheduled or pre-booked jobs will be assigned during this slot.`
        );
        setLeaveReason('');
    };

    const handleRemoveBlockedSlot = (id) => {
        removeBlockedSlot(id);
        setBlockedSlotsList(getBlockedSlots());
        Alert.alert('Slot Restored', 'You are now open to receive scheduled bookings during this time window.');
    };

    const handleOptimizeRoute = () => {
        setRouteOptimized(true);
        Alert.alert('⚡ Route Optimized', 'Waypoints re-sequenced by proximity (Logan\'s Road → Sea View → Temple Gate). Estimated fuel savings: 4.2 km.');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Schedule & AMC Calendar</Text>
                    <Text style={styles.headerSub}>Pre-booked Slots & AMC Retainers</Text>
                </View>
                <TouchableOpacity
                    style={styles.blockTimeBtn}
                    onPress={() => setIsLeaveModalOpen(true)}
                >
                    <CalendarOff size={14} color={COLORS.gold} />
                    <Text style={styles.blockTimeBtnText}>Block Leave</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Metrics Bar */}
                <View style={styles.summaryBar}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{scheduledJobs.length}</Text>
                        <Text style={styles.summaryLabel}>Upcoming Jobs</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: COLORS.success }]}>₹{totalPayout}</Text>
                        <Text style={styles.summaryLabel}>Est. Net Payout</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>2 Active</Text>
                        <Text style={styles.summaryLabel}>AMC Retainers</Text>
                    </View>
                </View>

                {/* Weekday Strip */}
                <Text style={styles.sectionTitle}>SELECT CALENDAR DAY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                    <TouchableOpacity
                        style={[styles.dayCard, selectedDay === 'all' && styles.dayCardActive]}
                        onPress={() => setSelectedDay('all')}
                    >
                        <Text style={[styles.dayLabel, selectedDay === 'all' && styles.dayLabelActive]}>All Days</Text>
                        <Text style={[styles.dayDate, selectedDay === 'all' && styles.dayDateActive]}>This Week</Text>
                        <View style={[styles.jobDot, { backgroundColor: COLORS.accent }]} />
                    </TouchableOpacity>

                    {daysOfWeek.map((d) => {
                        const isSel = selectedDay === d.key;
                        return (
                            <TouchableOpacity
                                key={d.key}
                                style={[styles.dayCard, isSel && styles.dayCardActive]}
                                onPress={() => setSelectedDay(d.key)}
                            >
                                <Text style={[styles.dayLabel, isSel && styles.dayLabelActive]}>{d.label}</Text>
                                <Text style={[styles.dayDate, isSel && styles.dayDateActive]}>{d.date}</Text>
                                {d.activeCount > 0 ? (
                                    <View style={[styles.jobDot, { backgroundColor: COLORS.gold }]} />
                                ) : (
                                    <View style={[styles.jobDot, { backgroundColor: 'transparent' }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Category Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
                        onPress={() => setFilterCategory('all')}
                    >
                        <Text style={[styles.filterChipText, filterCategory === 'all' && styles.filterChipTextActive]}>
                            All ({scheduledJobs.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filterCategory === 'amc' && styles.filterChipActive]}
                        onPress={() => setFilterCategory('amc')}
                    >
                        <Text style={[styles.filterChipText, filterCategory === 'amc' && styles.filterChipTextActive]}>
                            AMC Retainers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filterCategory === 'audit' && styles.filterChipActive]}
                        onPress={() => setFilterCategory('audit')}
                    >
                        <Text style={[styles.filterChipText, filterCategory === 'audit' && styles.filterChipTextActive]}>
                            Audits & Grounding
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filterCategory === 'install' && styles.filterChipActive]}
                        onPress={() => setFilterCategory('install')}
                    >
                        <Text style={[styles.filterChipText, filterCategory === 'install' && styles.filterChipTextActive]}>
                            Installations
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Multi-Job Route Optimizer */}
                <View style={styles.routeOptimizerCard}>
                    <View style={styles.routeHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Route size={18} color={COLORS.accent} />
                            <Text style={styles.routeTitle}>OPTIMIZED WAYPOINT ROUTE</Text>
                        </View>
                        <TouchableOpacity style={styles.reorderBtn} onPress={handleOptimizeRoute}>
                            <Compass size={14} color="#60A5FA" />
                            <Text style={styles.reorderBtnText}>{routeOptimized ? 'Route Optimized ✓' : 'Optimize Sequence'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.routeSub}>
                        {routeOptimized
                            ? 'Sequence reordered by GPS proximity. Saves ~4.2 km two-wheeler fuel across Thalassery.'
                            : '3 scheduled stops in Thalassery hub. Tap optimize to calculate shortest driving order.'}
                    </Text>
                    <View style={styles.waypointRow}>
                        <View style={styles.waypointPill}>
                            <Text style={styles.waypointNum}>1</Text>
                            <Text style={styles.waypointLabel}>Logan's Rd (1.8 km)</Text>
                        </View>
                        <View style={styles.waypointArrow}>
                            <ChevronRight size={14} color={COLORS.textTertiary} />
                        </View>
                        <View style={styles.waypointPill}>
                            <Text style={styles.waypointNum}>2</Text>
                            <Text style={styles.waypointLabel}>Sea View (2.4 km)</Text>
                        </View>
                        <View style={styles.waypointArrow}>
                            <ChevronRight size={14} color={COLORS.textTertiary} />
                        </View>
                        <View style={styles.waypointPill}>
                            <Text style={styles.waypointNum}>3</Text>
                            <Text style={styles.waypointLabel}>Temple Gate (3.1 km)</Text>
                        </View>
                    </View>
                </View>

                {/* Blocked Slots Section */}
                {blockedSlotsList.length > 0 && (
                    <View style={styles.blockedSection}>
                        <View style={styles.blockedHeader}>
                            <CalendarOff size={16} color={COLORS.gold} />
                            <Text style={styles.blockedTitle}>ADVANCE TIME-OFF BLOCKS ({blockedSlotsList.length})</Text>
                        </View>
                        <View style={styles.blockedGrid}>
                            {blockedSlotsList.map(block => (
                                <View key={block.id} style={styles.blockedItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.blockedDate}>{block.date} • {block.timeSlot}</Text>
                                        <Text style={styles.blockedReason}>{block.reason}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.unblockBtn}
                                        onPress={() => handleRemoveBlockedSlot(block.id)}
                                    >
                                        <Trash2 size={14} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Scheduled Jobs List */}
                <View style={styles.jobsList}>
                    {filteredJobs.length === 0 ? (
                        <View style={styles.emptyState}>
                            <CalendarCheck size={40} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Scheduled Jobs for Selected Filter</Text>
                            <Text style={styles.emptySubtitle}>You have no pre-booked appointments for this time slot.</Text>
                        </View>
                    ) : (
                        filteredJobs.map(job => (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.badgeWrapper}>
                                        <Text style={styles.typeBadgeText}>{job.typeBadge}</Text>
                                    </View>
                                    <View style={styles.payoutTag}>
                                        <Text style={styles.payoutTagText}>Net ₹{job.payout}</Text>
                                    </View>
                                </View>

                                <Text style={styles.serviceTitle}>{job.service}</Text>

                                <View style={styles.timeRow}>
                                    <Calendar size={14} color={COLORS.gold} />
                                    <Text style={styles.timeText}>{job.date} • {job.time}</Text>
                                </View>

                                <View style={styles.locRow}>
                                    <MapPin size={14} color={COLORS.accent} />
                                    <Text style={styles.locText} numberOfLines={1}>{job.customer} • {job.address}</Text>
                                </View>

                                {job.notes && (
                                    <View style={styles.notesBox}>
                                        <Text style={styles.notesText}>📝 {job.notes}</Text>
                                    </View>
                                )}

                                <View style={styles.cardDivider} />

                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={styles.actionBtnSecondary}
                                        onPress={() => handleCallCustomer(job.phone)}
                                    >
                                        <Phone size={14} color={COLORS.textPrimary} />
                                        <Text style={styles.actionBtnSecondaryText}>Call</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionBtnSecondary}
                                        onPress={() => handleOpenMap(job.address)}
                                    >
                                        <Navigation size={14} color={COLORS.accent} />
                                        <Text style={[styles.actionBtnSecondaryText, { color: COLORS.accent }]}>Maps</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.rescheduleBtn}
                                        onPress={() => handleRescheduleRequest(job)}
                                    >
                                        <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* AMC Partner Perks Banner */}
                <View style={styles.amcPerksCard}>
                    <Shield size={22} color={COLORS.gold} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.amcPerksTitle}>Predictable Monthly Income via AMCs</Text>
                        <Text style={styles.amcPerksDesc}>
                            Sheriyakam partners who service AMC contracts retain 90% of repeat quarterly visits with guaranteed advance slot allocations.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Block Time Off Modal */}
            <Modal
                visible={isLeaveModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsLeaveModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>AVAILABILITY MANAGEMENT</Text>
                                <Text style={styles.modalTitle}>Block Time Off / Leave</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsLeaveModalOpen(false)} style={styles.closeBtn}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Select Day to Block:</Text>
                            <View style={styles.leaveDaysRow}>
                                {['Tomorrow', 'Thursday', 'Friday', 'Weekend'].map((day) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[
                                            styles.leaveDayChip,
                                            leaveDay === day && styles.leaveDayChipSelected
                                        ]}
                                        onPress={() => setLeaveDay(day)}
                                    >
                                        <Text style={[
                                            styles.leaveDayText,
                                            leaveDay === day && styles.leaveDayTextSelected
                                        ]}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Reason / Field Note:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="e.g. Personal errand, tool maintenance, family function"
                                placeholderTextColor={COLORS.textTertiary}
                                value={leaveReason}
                                onChangeText={setLeaveReason}
                            />

                            <Text style={styles.leaveNotice}>
                                ⚠️ Blocking time off prevents pre-booked jobs from filling your calendar. Active live pings can still be switched on/off via the dashboard switch.
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.confirmLeaveBtn}
                                onPress={handleConfirmLeave}
                            >
                                <CalendarOff size={18} color="#fff" />
                                <Text style={styles.confirmLeaveBtnText}>Confirm Unavailable Slot</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    blockTimeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    blockTimeBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.gold,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    summaryBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    summaryLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        height: 28,
        backgroundColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    dayScroll: {
        marginBottom: 16,
    },
    dayCard: {
        width: 74,
        height: 72,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        padding: 6,
    },
    dayCardActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    dayLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    dayLabelActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    dayDate: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginVertical: 2,
    },
    dayDateActive: {
        color: COLORS.textPrimary,
    },
    jobDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 3,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
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
    jobsList: {
        gap: 14,
    },
    emptyState: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 10,
    },
    emptySubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },
    jobCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgeWrapper: {
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: '700',
    },
    payoutTag: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    payoutTagText: {
        color: COLORS.success,
        fontSize: 13,
        fontWeight: '800',
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
        lineHeight: 20,
        marginBottom: 8,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    locRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    locText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flex: 1,
    },
    notesBox: {
        backgroundColor: COLORS.bgTertiary,
        padding: 10,
        borderRadius: 8,
        marginVertical: 6,
    },
    notesText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 16,
    },
    cardDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    actionBtnSecondaryText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    rescheduleBtn: {
        marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rescheduleBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    amcPerksCard: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.25)',
    },
    amcPerksTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.gold,
    },
    amcPerksDesc: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
        lineHeight: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 12,
    },
    modalBadge: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.gold,
        letterSpacing: 0.5,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
    },
    modalBody: {
        marginTop: 14,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    leaveDaysRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    leaveDayChip: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    leaveDayChipSelected: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
    },
    leaveDayText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    leaveDayTextSelected: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    textInput: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    leaveNotice: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 12,
        lineHeight: 16,
    },
    modalFooter: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 12,
    },
    confirmLeaveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.danger,
        paddingVertical: 14,
        borderRadius: 10,
    },
    confirmLeaveBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },

    /* Route Optimizer */
    routeOptimizerCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        gap: 8,
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routeTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    reorderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    reorderBtnText: {
        color: '#60A5FA',
        fontSize: 11,
        fontWeight: '700',
    },
    routeSub: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 16,
    },
    waypointRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 4,
    },
    waypointPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
    },
    waypointNum: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.accent,
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 18,
    },
    waypointLabel: {
        color: COLORS.textPrimary,
        fontSize: 10,
        fontWeight: '600',
        flex: 1,
    },
    waypointArrow: {
        paddingHorizontal: 2,
    },

    /* Blocked Slots */
    blockedSection: {
        backgroundColor: 'rgba(234, 179, 8, 0.05)',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.2)',
        marginBottom: 16,
        gap: 8,
    },
    blockedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    blockedTitle: {
        color: COLORS.gold,
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 0.8,
    },
    blockedGrid: {
        gap: 6,
    },
    blockedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    blockedDate: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '700',
    },
    blockedReason: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    unblockBtn: {
        padding: 6,
    },
});
