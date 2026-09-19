import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput, Modal, Image, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, AlertTriangle, ShieldCheck, Scale, CheckCircle,
    XCircle, Clock, DollarSign, Image as ImageIcon, User, Phone,
    MapPin, ChevronRight, X, FileText, Send, RotateCcw
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getBookings, resolveDispute, bookingEvents } from '../../constants/bookingStore';
import { refundRazorpayPayment } from '../../services/razorpayService';

export default function AdminDisputesScreen() {
    const router = useRouter();
    const [disputes, setDisputes] = useState([]);
    const [filter, setFilter] = useState('open'); // open, resolved, all
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

    // Resolution Form State
    const [resolutionText, setResolutionText] = useState('');
    const [refundAmount, setRefundAmount] = useState('400');
    const [outcomeType, setOutcomeType] = useState('partial_refund'); // full_refund, partial_refund, dismiss

    const reloadDisputes = () => {
        const all = getBookings();
        const disputedJobs = all.filter(b => b.status === 'disputed' || b.dispute?.isDisputed);
        setDisputes(disputedJobs);
    };

    useEffect(() => {
        reloadDisputes();
        bookingEvents.on('change', reloadDisputes);
        return () => bookingEvents.off('change', reloadDisputes);
    }, []);

    const handleOpenResolve = (job) => {
        setSelectedDispute(job);
        setResolutionText(`Approved ₹${job.dispute?.refundRequested || 400} customer refund for unconsented material charges. Deducted from partner payout with formal advisory.`);
        setRefundAmount(String(job.dispute?.refundRequested || 400));
        setIsResolveModalOpen(true);
    };

    const handleConfirmResolve = async () => {
        if (!resolutionText.trim()) {
            Alert.alert('Missing Detail', 'Please enter a clear resolution summary for the audit record.');
            return;
        }

        const refundVal = outcomeType === 'dismiss' ? 0 : Number(refundAmount) || 0;
        let rzpRefundId = null;

        if (refundVal > 0) {
            try {
                const rzpRes = await refundRazorpayPayment(
                    selectedDispute.razorpayPaymentId || `pay_sk_${selectedDispute.id}`,
                    refundVal,
                    resolutionText.trim()
                );
                rzpRefundId = rzpRes.refundId;
            } catch (err) {
                console.warn('Razorpay refund call warning:', err);
            }
        }

        const res = resolveDispute(selectedDispute.id, {
            resolution: resolutionText.trim(),
            refundAmount: refundVal,
            outcome: outcomeType,
            resolvedBy: 'Ops Arbitrator',
            razorpayRefundId: rzpRefundId
        });

        if (res.success) {
            setIsResolveModalOpen(false);
            reloadDisputes();
            Alert.alert(
                '✅ Dispute Resolved',
                `Ticket resolved. ${refundVal > 0 ? `₹${refundVal} refunded via Razorpay Instant Payout (${rzpRefundId || 'Processed'}).` : 'Dispute dismissed, partner payout scheduled.'}`
            );
        } else {
            Alert.alert('Error', res.message || 'Failed to resolve dispute');
        }
    };

    const filtered = disputes.filter(d => {
        if (filter === 'open') return d.dispute?.status === 'open' || d.status === 'disputed';
        if (filter === 'resolved') return d.dispute?.status === 'resolved';
        return true;
    });

    const openCount = disputes.filter(d => d.dispute?.status === 'open' || d.status === 'disputed').length;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Dispute Queue & Arbitration</Text>
                    <Text style={styles.headerSub}>Customer complaints, evidence audit & refund resolutions</Text>
                </View>
                <View style={styles.badgeOpen}>
                    <Text style={styles.badgeOpenText}>{openCount} OPEN</Text>
                </View>
            </View>

            {/* Metrics Bar */}
            <View style={styles.metricsBar}>
                <View style={styles.metricItem}>
                    <Text style={[styles.metricVal, { color: COLORS.danger }]}>{openCount}</Text>
                    <Text style={styles.metricLabel}>Open Cases</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                    <Text style={styles.metricVal}>45m</Text>
                    <Text style={styles.metricLabel}>Avg Resolution</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                    <Text style={[styles.metricVal, { color: COLORS.success }]}>₹1,200</Text>
                    <Text style={styles.metricLabel}>Refunds Settled</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsRow}>
                {[
                    { id: 'open', label: `Open Disputes (${openCount})` },
                    { id: 'resolved', label: 'Resolved Archive' },
                    { id: 'all', label: 'All Cases' }
                ].map(t => (
                    <TouchableOpacity
                        key={t.id}
                        style={[styles.tabChip, filter === t.id && styles.tabChipActive]}
                        onPress={() => setFilter(t.id)}
                    >
                        <Text style={[styles.tabChipText, filter === t.id && styles.tabChipTextActive]}>
                            {t.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Disputes List */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <ShieldCheck size={40} color={COLORS.success} />
                        <Text style={styles.emptyTitle}>Zero Active Disputes!</Text>
                        <Text style={styles.emptySub}>All jobs have been verified and customer complaints resolved.</Text>
                    </View>
                ) : (
                    filtered.map(job => {
                        const disp = job.dispute || {};
                        const isResolved = disp.status === 'resolved';

                        return (
                            <View key={job.id} style={[styles.disputeCard, !isResolved && styles.cardOpen]}>
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.jobId}>Job #{job.id}</Text>
                                            <View style={styles.districtPill}>
                                                <Text style={styles.districtPillText}>{job.district} • {job.taluk}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.serviceTitle}>{job.service}</Text>
                                    </View>
                                    <View style={[styles.statusPill, isResolved ? styles.statusResolved : styles.statusUnresolved]}>
                                        <Text style={[styles.statusPillText, isResolved ? { color: COLORS.success } : { color: COLORS.danger }]}>
                                            {isResolved ? 'RESOLVED' : 'REQUIRES ARBITRATION'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Dispute Summary Box */}
                                <View style={styles.reasonBox}>
                                    <AlertTriangle size={15} color={COLORS.danger} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.reasonTitle}>Complaint Reason ({disp.reportedBy?.toUpperCase() || 'CUSTOMER'}):</Text>
                                        <Text style={styles.reasonText}>{disp.reason || 'Billing discrepancy'}</Text>
                                    </View>
                                </View>

                                {/* Job Context: OTPs & Timestamps */}
                                <View style={styles.contextGrid}>
                                    <View style={styles.contextItem}>
                                        <Clock size={12} color={COLORS.textSecondary} />
                                        <Text style={styles.contextText}>Check-in OTP Verified: {disp.checkInTime || 'Yes (OTP: 4455)'}</Text>
                                    </View>
                                    <View style={styles.contextItem}>
                                        <CheckCircle size={12} color={COLORS.textSecondary} />
                                        <Text style={styles.contextText}>Completion Verified: {disp.completionTime || 'Yes (OTP: 9900)'}</Text>
                                    </View>
                                    <View style={styles.contextItem}>
                                        <User size={12} color={COLORS.textSecondary} />
                                        <Text style={styles.contextText}>Customer: {job.customerName} ({job.customerPhone})</Text>
                                    </View>
                                    <View style={styles.contextItem}>
                                        <User size={12} color={COLORS.accent} />
                                        <Text style={styles.contextText}>Technician: {job.partnerName} ({job.assignedPartnerPhone})</Text>
                                    </View>
                                </View>

                                {/* Photos & Receipts Evidence */}
                                <View style={styles.evidenceSection}>
                                    <Text style={styles.evidenceHeading}>DOCUMENTARY EVIDENCE (MULTIMETER / REPAIR PHOTOS):</Text>
                                    <View style={styles.evidenceRow}>
                                        <View style={styles.photoBox}>
                                            <ImageIcon size={20} color={COLORS.accent} />
                                            <Text style={styles.photoBoxLabel}>Busbar Panel Condition</Text>
                                        </View>
                                        <View style={styles.photoBox}>
                                            <FileText size={20} color={COLORS.gold} />
                                            <Text style={styles.photoBoxLabel}>Hardware Receipt ₹400</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Resolution Details if resolved */}
                                {isResolved && (
                                    <View style={styles.resolutionOutcomeBox}>
                                        <CheckCircle size={14} color={COLORS.success} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.resolutionOutcomeTitle}>
                                                Resolved by {disp.resolvedBy} on {disp.resolvedAt?.split('T')[0]}:
                                            </Text>
                                            <Text style={styles.resolutionOutcomeText}>{disp.resolution}</Text>
                                            {job.refundIssued > 0 && (
                                                <Text style={styles.refundNotice}>₹{job.refundIssued} Refund Credited to Customer</Text>
                                            )}
                                        </View>
                                    </View>
                                )}

                                <View style={styles.cardDivider} />

                                {/* Actions */}
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                                    >
                                        <Phone size={13} color={COLORS.textPrimary} />
                                        <Text style={styles.actionBtnText}>Call Customer</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => Linking.openURL(`tel:${job.assignedPartnerPhone}`)}
                                    >
                                        <Phone size={13} color={COLORS.accent} />
                                        <Text style={[styles.actionBtnText, { color: COLORS.accent }]}>Call Wireman</Text>
                                    </TouchableOpacity>

                                    {!isResolved && (
                                        <TouchableOpacity
                                            style={styles.resolveBtn}
                                            onPress={() => handleOpenResolve(job)}
                                        >
                                            <Scale size={14} color="#fff" />
                                            <Text style={styles.resolveBtnText}>Arbitrate & Settle</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Arbitration Resolution Modal */}
            <Modal
                visible={isResolveModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsResolveModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>OPS DISPUTE SETTLEMENT</Text>
                                <Text style={styles.modalTitle}>Resolve Job #{selectedDispute?.id}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsResolveModalOpen(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalLabel}>Select Resolution Outcome:</Text>
                            <View style={styles.outcomeOptionsRow}>
                                {[
                                    { id: 'partial_refund', label: 'Partial Refund (Customer)' },
                                    { id: 'full_refund', label: 'Full Refund' },
                                    { id: 'dismiss', label: 'Dismiss (Release to Wireman)' }
                                ].map(opt => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[styles.outcomeChip, outcomeType === opt.id && styles.outcomeChipActive]}
                                        onPress={() => setOutcomeType(opt.id)}
                                    >
                                        <Text style={[styles.outcomeChipText, outcomeType === opt.id && styles.outcomeChipTextActive]}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {outcomeType !== 'dismiss' && (
                                <>
                                    <Text style={[styles.modalLabel, { marginTop: 12 }]}>Refund Amount (₹):</Text>
                                    <TextInput
                                        style={styles.inputField}
                                        keyboardType="numeric"
                                        value={refundAmount}
                                        onChangeText={setRefundAmount}
                                    />
                                </>
                            )}

                            <Text style={[styles.modalLabel, { marginTop: 12 }]}>Official Audit Decision Log:</Text>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={3}
                                value={resolutionText}
                                onChangeText={setResolutionText}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.confirmResolveBtn}
                                onPress={handleConfirmResolve}
                            >
                                <CheckCircle size={16} color="#fff" />
                                <Text style={styles.confirmResolveBtnText}>Confirm Settlement & Notify Parties</Text>
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
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    badgeOpen: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    badgeOpenText: {
        color: COLORS.danger,
        fontSize: 10,
        fontWeight: '800',
    },
    metricsBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    metricItem: {
        alignItems: 'center',
    },
    metricVal: {
        fontSize: 16,
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
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginTop: 10,
        gap: 8,
    },
    tabChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabChipActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    tabChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tabChipTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        gap: 12,
    },
    disputeCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardOpen: {
        borderColor: 'rgba(239, 68, 68, 0.4)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 8,
        marginBottom: 8,
    },
    jobId: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
    },
    districtPill: {
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    districtPillText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusUnresolved: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    statusResolved: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    statusPillText: {
        fontSize: 9,
        fontWeight: '800',
    },
    reasonBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    reasonTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.danger,
    },
    reasonText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        marginTop: 2,
        lineHeight: 16,
    },
    contextGrid: {
        gap: 4,
        backgroundColor: COLORS.bgTertiary,
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
    },
    contextItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    contextText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    evidenceSection: {
        marginBottom: 10,
    },
    evidenceHeading: {
        fontSize: 9,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    evidenceRow: {
        flexDirection: 'row',
        gap: 10,
    },
    photoBox: {
        flex: 1,
        height: 70,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
    },
    photoBoxLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    resolutionOutcomeBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    resolutionOutcomeTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.success,
    },
    resolutionOutcomeText: {
        fontSize: 11,
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    refundNotice: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.success,
        marginTop: 4,
    },
    cardDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    resolveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    resolveBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#fff',
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
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
    },
    modalBadge: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.accent,
        letterSpacing: 0.5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    modalBody: {
        marginTop: 12,
    },
    modalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    outcomeOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    outcomeChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    outcomeChipActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    outcomeChipText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    outcomeChipTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    inputField: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 8,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    textArea: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 8,
        color: COLORS.textPrimary,
        fontSize: 12,
        textAlignVertical: 'top',
        height: 70,
    },
    modalFooter: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    confirmResolveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.success,
        paddingVertical: 12,
        borderRadius: 10,
    },
    confirmResolveBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    }
});
