import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Linking, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Zap, Phone, MapPin, User, CheckCircle,
    AlertTriangle, Shield, Clock, Search, RefreshCw,
    UserCheck, ChevronRight, Award
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getBookings, manualAssignPartner, calculateSLA, bookingEvents } from '../../constants/bookingStore';
import { getPartners } from '../../constants/partnerStore';

export default function ManualDispatchScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [partners, setPartners] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [opsNote, setOpsNote] = useState('Dispatched via ops desk direct phone confirmation');

    const loadData = useCallback(() => {
        const allB = getBookings();
        const unassigned = allB.filter(b => b.status === 'open' || (b.status === 'assigned' && !b.assignedPartnerPhone));
        setBookings(unassigned);
        setPartners(getPartners());

        if (unassigned.length > 0 && !selectedJob) {
            setSelectedJob(unassigned[0]);
        }
    }, [selectedJob]);

    useEffect(() => {
        loadData();
        bookingEvents.on('change', loadData);
        return () => bookingEvents.off('change', loadData);
    }, [loadData]);

    const handleCall = (phone, name) => {
        if (!phone) {
            Alert.alert('No Contact', `No phone recorded for ${name}`);
            return;
        }
        Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', `Could not dial ${phone}`));
    };

    const handleAssign = (partner) => {
        if (!selectedJob) return;

        Alert.alert(
            'Confirm Manual Dispatch',
            `Assign #${selectedJob.id} (${selectedJob.service}) to ${partner.name} in ${partner.taluk}? This will trigger an immediate push notification to the partner app.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm Dispatch ⚡',
                    onPress: () => {
                        const res = manualAssignPartner(
                            selectedJob.id,
                            partner.id,
                            partner.name,
                            partner.phone,
                            'Ops Operator'
                        );
                        if (res.success) {
                            Alert.alert('✅ Dispatch Complete', `Job #${selectedJob.id} assigned to ${partner.name}. Partner notified.`);
                            setSelectedJob(null);
                            loadData();
                        } else {
                            Alert.alert('Error', res.message || 'Failed to dispatch');
                        }
                    }
                }
            ]
        );
    };

    const availablePartners = partners.filter(p => p.status === 'approved' && p.isAvailable);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Manual Dispatch Desk</Text>
                    <Text style={styles.headerSub}>Override auto-assignment & direct wireman allocation</Text>
                </View>
                <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
                    <RefreshCw size={16} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Notice Banner */}
                <View style={styles.noticeBanner}>
                    <Zap size={18} color={COLORS.accent} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.noticeTitle}>Emergency Dispatch SOP</Text>
                        <Text style={styles.noticeSub}>
                            Call the contractor before assigning to confirm tool readiness and transit route. Jobs assigned here bypass the 30s broadcast window.
                        </Text>
                    </View>
                </View>

                {/* Unassigned Jobs Selector */}
                <Text style={styles.sectionHeader}>STALLED / UNASSIGNED JOBS ({bookings.length})</Text>
                {bookings.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <CheckCircle size={36} color={COLORS.success} />
                        <Text style={styles.emptyTitle}>All Jobs Successfully Assigned!</Text>
                        <Text style={styles.emptySub}>No bookings are currently awaiting manual ops intervention.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobChipsScroll}>
                        {bookings.map(job => {
                            const isSelected = selectedJob?.id === job.id;
                            const sla = calculateSLA(job);
                            return (
                                <TouchableOpacity
                                    key={job.id}
                                    style={[
                                        styles.jobChipCard,
                                        isSelected && styles.jobChipCardSelected,
                                        sla.isBreached && styles.jobChipCardBreached
                                    ]}
                                    onPress={() => setSelectedJob(job)}
                                >
                                    <View style={styles.jobChipTop}>
                                        <Text style={styles.jobChipId}>#{job.id}</Text>
                                        <Text style={[
                                            styles.jobChipSla,
                                            sla.isBreached ? { color: COLORS.danger } : { color: COLORS.gold }
                                        ]}>
                                            {sla.remainingMinutes}m left
                                        </Text>
                                    </View>
                                    <Text style={styles.jobChipService} numberOfLines={1}>{job.service}</Text>
                                    <Text style={styles.jobChipLoc} numberOfLines={1}>{job.district} • {job.address}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                {/* Selected Job Detailed Context */}
                {selectedJob && (
                    <View style={styles.selectedJobBox}>
                        <View style={styles.selectedJobHeader}>
                            <View>
                                <Text style={styles.selectedJobTitle}>{selectedJob.service}</Text>
                                <Text style={styles.selectedJobCustomer}>
                                    Customer: {selectedJob.customerName} ({selectedJob.customerPhone})
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.callCustomerBtn}
                                onPress={() => handleCall(selectedJob.customerPhone, selectedJob.customerName)}
                            >
                                <Phone size={13} color="#fff" />
                                <Text style={styles.callCustomerText}>Call Customer</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectedJobLocRow}>
                            <MapPin size={13} color={COLORS.accent} />
                            <Text style={styles.selectedJobLocText}>{selectedJob.address}</Text>
                        </View>

                        <View style={styles.selectedJobMetaRow}>
                            <Text style={styles.selectedJobMetaItem}>Est. Tariff: ₹{selectedJob.finalPrice || selectedJob.price}</Text>
                            <Text style={styles.selectedJobMetaItem}>SLA Target: 90 Mins</Text>
                            <Text style={styles.selectedJobMetaItem}>District: {selectedJob.district || 'Kannur'}</Text>
                        </View>
                    </View>
                )}

                {/* Eligible Online Partners Nearby */}
                <Text style={styles.sectionHeader}>
                    ONLINE KSELB WIREMEN IN RANGE ({availablePartners.length} Available)
                </Text>

                <View style={styles.partnersList}>
                    {availablePartners.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <AlertTriangle size={36} color={COLORS.gold} />
                            <Text style={styles.emptyTitle}>No Partners Online</Text>
                            <Text style={styles.emptySub}>All contractors are currently offline or busy on active jobs.</Text>
                        </View>
                    ) : (
                        availablePartners.map(partner => (
                            <View key={partner.id} style={styles.partnerCard}>
                                <View style={styles.partnerCardTop}>
                                    <View style={styles.avatarCircle}>
                                        <User size={20} color={COLORS.accent} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.partnerName}>{partner.name}</Text>
                                            <View style={styles.kselbTag}>
                                                <Text style={styles.kselbTagText}>KSELB</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.partnerSub}>
                                            {partner.taluk} Taluk • {partner.ratings?.overall || 4.9} ★ ({partner.totalJobsCompleted || 100}+ Jobs)
                                        </Text>
                                        <Text style={styles.licenseNumber}>Lic: {partner.kselbLicense || 'KSELB/CA-7821/KL'}</Text>
                                    </View>
                                </View>

                                <View style={styles.categoriesRow}>
                                    {(partner.serviceTypes || ['Electrical']).map(c => (
                                        <View key={c} style={styles.categoryBadge}>
                                            <Text style={styles.categoryBadgeText}>{c}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.cardDivider} />

                                <View style={styles.partnerActionsRow}>
                                    <TouchableOpacity
                                        style={styles.callPartnerBtn}
                                        onPress={() => handleCall(partner.phone, partner.name)}
                                    >
                                        <Phone size={13} color={COLORS.textPrimary} />
                                        <Text style={styles.callPartnerBtnText}>Call Wireman</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.assignBtn,
                                            !selectedJob && { opacity: 0.5 }
                                        ]}
                                        disabled={!selectedJob}
                                        onPress={() => handleAssign(partner)}
                                    >
                                        <Zap size={13} color="#fff" />
                                        <Text style={styles.assignBtnText}>Assign to Job ⚡</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
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
    refreshBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        gap: 14,
    },
    noticeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.3)',
    },
    noticeTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
    },
    noticeSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
        lineHeight: 16,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    jobChipsScroll: {
        maxHeight: 110,
    },
    jobChipCard: {
        width: 220,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 10,
    },
    jobChipCardSelected: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    jobChipCardBreached: {
        borderColor: COLORS.danger,
    },
    jobChipTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    jobChipId: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.accent,
    },
    jobChipSla: {
        fontSize: 10,
        fontWeight: '700',
    },
    jobChipService: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    jobChipLoc: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    selectedJobBox: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1.5,
        borderColor: COLORS.accent,
    },
    selectedJobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    selectedJobTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    selectedJobCustomer: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    callCustomerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    callCustomerText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    selectedJobLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    selectedJobLocText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    selectedJobMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bgTertiary,
        padding: 8,
        borderRadius: 8,
    },
    selectedJobMetaItem: {
        fontSize: 11,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    partnersList: {
        gap: 12,
    },
    partnerCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    partnerCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    partnerName: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    kselbTag: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    kselbTagText: {
        fontSize: 9,
        fontWeight: '800',
        color: COLORS.gold,
    },
    partnerSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
    licenseNumber: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },
    categoryBadge: {
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    cardDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    partnerActionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    callPartnerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COLORS.bgTertiary,
        paddingVertical: 10,
        borderRadius: 8,
    },
    callPartnerBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    assignBtn: {
        flex: 1.3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COLORS.success,
        paddingVertical: 10,
        borderRadius: 8,
    },
    assignBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
    },
    emptyCard: {
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
        marginTop: 8,
    },
    emptySub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    }
});
