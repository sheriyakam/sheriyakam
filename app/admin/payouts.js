import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, DollarSign, Download, CheckCircle, AlertTriangle,
    Shield, Building, FileText, ChevronRight, Split, Layers,
    Clock, Lock, Unlock, RefreshCw
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getBookings, batchApprovePayouts, flagPayout, bookingEvents } from '../../constants/bookingStore';

export default function AdminPayoutsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, approved, flagged
    const [adminRole, setAdminRole] = useState(true); // Lean single-operator mode defaults to privileged ops

    const reloadData = () => {
        const all = getBookings();
        // Show completed jobs and disputed jobs affecting payout
        const payoutJobs = all.filter(b => b.status === 'completed' || b.payoutStatus);
        setBookings(payoutJobs);
    };

    useEffect(() => {
        reloadData();
        bookingEvents.on('change', reloadData);
        return () => bookingEvents.off('change', reloadData);
    }, []);

    const pendingPayouts = bookings.filter(b => b.payoutStatus === 'pending');
    const approvedPayouts = bookings.filter(b => b.payoutStatus === 'approved');
    const flaggedPayouts = bookings.filter(b => b.payoutStatus === 'flagged');

    const totalGross = bookings.reduce((sum, b) => sum + (b.finalPrice || b.price || 0), 0);
    const pendingTotal = pendingPayouts.reduce((sum, b) => sum + (b.netPartnerPayout || Math.round((b.finalPrice || b.price || 0) * 0.9)), 0);
    const platformShareTotal = Math.round(pendingTotal * (10 / 90));
    const gstOnPlatform = (platformShareTotal * 0.18).toFixed(2); // 18% GST on platform convenience fee under HSN 998713

    const handleBatchApprove = () => {
        if (!adminRole) {
            Alert.alert('Permission Denied', 'Batch payout approval requires Admin authorization.');
            return;
        }

        if (pendingPayouts.length === 0) {
            Alert.alert('No Pending Payouts', 'All eligible payouts are already approved or settled.');
            return;
        }

        Alert.alert(
            'Batch Approve Weekly Payouts',
            `Approve ${pendingPayouts.length} pending payouts totaling ₹${pendingTotal}? Direct NEFT/UPI settlement will be queued for Tuesday dispatch.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm Batch Release ⚡',
                    onPress: () => {
                        const ids = pendingPayouts.map(p => p.id);
                        const res = batchApprovePayouts(ids, 'Admin Operator');
                        reloadData();
                        Alert.alert('✅ Payouts Released', `${res.approvedCount} payouts approved under Batch #${res.batchId}`);
                    }
                }
            ]
        );
    };

    const handleFlag = (job) => {
        Alert.prompt
            ? Alert.prompt(
                'Hold Partner Payout',
                `Enter reason for withholding payout for Job #${job.id}:`,
                [
                    { text: 'Cancel' },
                    { text: 'Hold Payout', onPress: (reason) => { flagPayout(job.id, reason || 'Ops audit check'); reloadData(); } }
                ]
            )
            : (() => {
                flagPayout(job.id, 'Customer dispute review in progress');
                reloadData();
                Alert.alert('⚠️ Payout Held', `Payout for #${job.id} held pending review.`);
            })();
    };

    const handleExportGst = () => {
        Alert.alert(
            '📄 GST Reconciliation CSV Exported',
            `Sheriyakam GST Return File (HSN 998713 Electrical Repair Services) generated.\nGross Value: ₹${totalGross}\nPlatform GST (18%): ₹${gstOnPlatform}\nFile dispatched to accounts@sheriyakam.com.`
        );
    };

    const filtered = bookings.filter(b => {
        if (filter === 'pending') return b.payoutStatus === 'pending';
        if (filter === 'approved') return b.payoutStatus === 'approved';
        if (filter === 'flagged') return b.payoutStatus === 'flagged';
        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Partner Payouts & GST Desk</Text>
                    <Text style={styles.headerSub}>Weekly Tuesday Settlements & HSN 998713 Reconciliation</Text>
                </View>
                <TouchableOpacity onPress={handleExportGst} style={styles.exportBtn}>
                    <Download size={16} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Financial Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryTopRow}>
                        <View>
                            <Text style={styles.summarySubTitle}>PENDING PARTNER DISBURSEMENT</Text>
                            <Text style={styles.summaryVal}>₹{pendingTotal.toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.batchBtn}
                            onPress={handleBatchApprove}
                        >
                            <CheckCircle size={15} color="#fff" />
                            <Text style={styles.batchBtnText}>Batch Approve ({pendingPayouts.length})</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryGrid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>Platform Split (10%)</Text>
                            <Text style={styles.gridVal}>₹{platformShareTotal}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>GST 18% (HSN 998713)</Text>
                            <Text style={styles.gridVal}>₹{gstOnPlatform}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridLabel}>Settlement Cycle</Text>
                            <Text style={[styles.gridVal, { color: COLORS.accent }]}>Every Tuesday</Text>
                        </View>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabsRow}>
                    {[
                        { id: 'all', label: `All Settlements (${bookings.length})` },
                        { id: 'pending', label: `Pending Approval (${pendingPayouts.length})` },
                        { id: 'approved', label: `Approved (${approvedPayouts.length})` },
                        { id: 'flagged', label: `Flagged (${flaggedPayouts.length})` }
                    ].map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.filterTab, filter === t.id && styles.filterTabActive]}
                            onPress={() => setFilter(t.id)}
                        >
                            <Text style={[styles.filterTabText, filter === t.id && styles.filterTabTextActive]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Payouts Itemized List */}
                <View style={styles.listContainer}>
                    {filtered.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <DollarSign size={36} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>No Payouts for Selected Filter</Text>
                            <Text style={styles.emptySub}>All settlements matching this criteria are up to date.</Text>
                        </View>
                    ) : (
                        filtered.map(b => {
                            const isPending = b.payoutStatus === 'pending';
                            const isApproved = b.payoutStatus === 'approved';
                            const isFlagged = b.payoutStatus === 'flagged';
                            const net = b.netPartnerPayout || Math.round((b.finalPrice || b.price || 0) * 0.9);
                            const fee = b.platformFee || Math.round((b.finalPrice || b.price || 0) * 0.1);

                            return (
                                <View key={b.id} style={styles.payoutCard}>
                                    <View style={styles.payoutCardTop}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <Text style={styles.jobId}>Job #{b.id}</Text>
                                                <View style={[
                                                    styles.statusBadge,
                                                    isApproved && styles.statusApproved,
                                                    isPending && styles.statusPending,
                                                    isFlagged && styles.statusFlagged
                                                ]}>
                                                    <Text style={[
                                                        styles.statusText,
                                                        isApproved && { color: COLORS.success },
                                                        isPending && { color: COLORS.gold },
                                                        isFlagged && { color: COLORS.danger }
                                                    ]}>
                                                        {isApproved ? 'APPROVED FOR TUESDAY' : isFlagged ? 'HELD / AUDIT' : 'PENDING APPROVAL'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.serviceName}>{b.service}</Text>
                                            <Text style={styles.contractorName}>
                                                Contractor: {b.partnerName || 'Shyam Prasad'} ({b.taluk || 'Thalassery'})
                                            </Text>
                                        </View>

                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={styles.netAmount}>₹{net}</Text>
                                            <Text style={styles.netAmountSub}>Net Payout (90%)</Text>
                                        </View>
                                    </View>

                                    <View style={styles.feeBreakdownRow}>
                                        <Text style={styles.breakdownItem}>Customer Paid: ₹{b.finalPrice || b.price}</Text>
                                        <Text style={styles.breakdownItem}>Platform Fee (10%): ₹{fee}</Text>
                                        {b.payoutBatchId && (
                                            <Text style={[styles.breakdownItem, { color: COLORS.accent }]}>Batch: {b.payoutBatchId}</Text>
                                        )}
                                    </View>

                                    {isFlagged && b.payoutFailureReason && (
                                        <View style={styles.flagReasonBox}>
                                            <AlertTriangle size={12} color={COLORS.danger} />
                                            <Text style={styles.flagReasonText}>Reason: {b.payoutFailureReason}</Text>
                                        </View>
                                    )}

                                    <View style={styles.divider} />

                                    <View style={styles.cardActionsRow}>
                                        {isPending && (
                                            <>
                                                <TouchableOpacity
                                                    style={styles.flagBtn}
                                                    onPress={() => handleFlag(b)}
                                                >
                                                    <AlertTriangle size={12} color={COLORS.danger} />
                                                    <Text style={styles.flagBtnText}>Hold Payout</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.approveBtn}
                                                    onPress={() => {
                                                        batchApprovePayouts([b.id], 'Admin Operator');
                                                        reloadData();
                                                        Alert.alert('✅ Payout Approved', `Approved payout for #${b.id}`);
                                                    }}
                                                >
                                                    <CheckCircle size={12} color="#fff" />
                                                    <Text style={styles.approveBtnText}>Approve ₹{net}</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}

                                        {isFlagged && (
                                            <TouchableOpacity
                                                style={styles.releaseBtn}
                                                onPress={() => {
                                                    b.payoutStatus = 'pending';
                                                    reloadData();
                                                    Alert.alert('Hold Removed', `Payout for #${b.id} returned to pending queue.`);
                                                }}
                                            >
                                                <Unlock size={12} color="#fff" />
                                                <Text style={styles.releaseBtnText}>Remove Hold</Text>
                                            </TouchableOpacity>
                                        )}

                                        {isApproved && (
                                            <View style={styles.approvedBadgeRow}>
                                                <CheckCircle size={13} color={COLORS.success} />
                                                <Text style={styles.approvedNoticeText}>Queued for Next Direct Bank Settlement</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })
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
    exportBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        gap: 14,
    },
    summaryCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    summaryTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summarySubTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
    },
    summaryVal: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    batchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.success,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    batchBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gridItem: {
        flex: 1,
    },
    gridLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    gridVal: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    filterTabsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    filterTab: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterTabActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    filterTabText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    filterTabTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    listContainer: {
        gap: 12,
    },
    payoutCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    payoutCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobId: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.accent,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusApproved: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    statusPending: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
    },
    statusFlagged: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    statusText: {
        fontSize: 9,
        fontWeight: '800',
    },
    serviceName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    contractorName: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    netAmount: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    netAmountSub: {
        fontSize: 10,
        color: COLORS.textTertiary,
    },
    feeBreakdownRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        backgroundColor: COLORS.bgTertiary,
        padding: 6,
        borderRadius: 6,
        flexWrap: 'wrap',
    },
    breakdownItem: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    flagReasonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 6,
        borderRadius: 6,
        marginTop: 6,
    },
    flagReasonText: {
        fontSize: 11,
        color: COLORS.danger,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    cardActionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    flagBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    flagBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.danger,
    },
    approveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.success,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    approveBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#fff',
    },
    releaseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    releaseBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#fff',
    },
    approvedBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    approvedNoticeText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.success,
    },
    emptyCard: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
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
        marginTop: 2,
    }
});
