import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput, Modal, Image, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Users, Shield, Award, CheckCircle, XCircle,
    AlertTriangle, Search, Star, Phone, MapPin, Eye,
    RotateCcw, FileText, Lock, Unlock, X, ChevronRight
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    getPartners, approvePartner, rejectPartner,
    suspendPartner, reactivatePartner
} from '../../constants/partnerStore';

export default function AdminPartnersScreen() {
    const router = useRouter();
    const [partnersList, setPartnersList] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, approved, suspended
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for suspension
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');

    // Modal state for license doc review
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [viewingDocPartner, setViewingDocPartner] = useState(null);

    const reloadData = () => {
        setPartnersList([...getPartners()]);
    };

    useEffect(() => {
        reloadData();
    }, []);

    const handleApprove = (id, name) => {
        approvePartner(id);
        reloadData();
        Alert.alert('✅ Partner Approved', `${name} is now approved to receive live emergency dispatches.`);
    };

    const handleReject = (id, name) => {
        rejectPartner(id);
        reloadData();
        Alert.alert('Application Rejected', `Application for ${name} has been marked rejected.`);
    };

    const handleOpenSuspend = (p) => {
        setSelectedPartner(p);
        setSuspendReason('');
        setIsSuspendModalOpen(true);
    };

    const handleConfirmSuspend = () => {
        if (!suspendReason.trim()) {
            Alert.alert('Reason Required', 'Please enter a documented reason for account suspension.');
            return;
        }

        suspendPartner(selectedPartner.id, suspendReason.trim(), 'Ops Admin');
        setIsSuspendModalOpen(false);
        reloadData();
        Alert.alert('⚠️ Account Suspended', `${selectedPartner.name} has been suspended. Offline status enforced.`);
    };

    const handleReactivate = (p) => {
        Alert.alert(
            'Reactivate Partner',
            `Restore active status for ${p.name}? They will be able to turn online and accept jobs again.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reactivate',
                    onPress: () => {
                        reactivatePartner(p.id, 'Ops Admin');
                        reloadData();
                        Alert.alert('✅ Account Reinstated', `${p.name} is now active.`);
                    }
                }
            ]
        );
    };

    const handleViewDoc = (p) => {
        setViewingDocPartner(p);
        setIsDocModalOpen(true);
    };

    const filtered = partnersList.filter(p => {
        const matchesFilter = filter === 'all' || p.status === filter;
        const matchesQuery = !searchQuery ||
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.phone?.includes(searchQuery) ||
            p.taluk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.kselbLicense?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesQuery;
    });

    const pendingCount = partnersList.filter(p => p.status === 'pending').length;
    const suspendedCount = partnersList.filter(p => p.status === 'suspended').length;
    const approvedCount = partnersList.filter(p => p.status === 'approved').length;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Partner & Contractor Management</Text>
                    <Text style={styles.headerSub}>KSELB Verification, category ratings & suspension desk</Text>
                </View>
            </View>

            {/* Metrics Bar */}
            <View style={styles.metricsBar}>
                <TouchableOpacity style={styles.metricItem} onPress={() => setFilter('all')}>
                    <Text style={styles.metricVal}>{partnersList.length}</Text>
                    <Text style={styles.metricLabel}>Total Wiremen</Text>
                </TouchableOpacity>
                <View style={styles.metricDivider} />
                <TouchableOpacity style={styles.metricItem} onPress={() => setFilter('approved')}>
                    <Text style={[styles.metricVal, { color: COLORS.success }]}>{approvedCount}</Text>
                    <Text style={styles.metricLabel}>Active Approved</Text>
                </TouchableOpacity>
                <View style={styles.metricDivider} />
                <TouchableOpacity style={styles.metricItem} onPress={() => setFilter('pending')}>
                    <Text style={[styles.metricVal, { color: COLORS.gold }]}>{pendingCount}</Text>
                    <Text style={styles.metricLabel}>Pending Review</Text>
                </TouchableOpacity>
                <View style={styles.metricDivider} />
                <TouchableOpacity style={styles.metricItem} onPress={() => setFilter('suspended')}>
                    <Text style={[styles.metricVal, { color: COLORS.danger }]}>{suspendedCount}</Text>
                    <Text style={styles.metricLabel}>Suspended</Text>
                </TouchableOpacity>
            </View>

            {/* Search and Tabs */}
            <View style={styles.searchBox}>
                <Search size={16} color={COLORS.textTertiary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, phone, taluk, license #..."
                    placeholderTextColor={COLORS.textTertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.tabsRow}>
                {[
                    { id: 'all', label: 'All Wiremen' },
                    { id: 'pending', label: `Pending Review (${pendingCount})` },
                    { id: 'approved', label: 'Active Approved' },
                    { id: 'suspended', label: `Suspended (${suspendedCount})` }
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

            {/* List */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Users size={36} color={COLORS.textTertiary} />
                        <Text style={styles.emptyTitle}>No Contractors Found</Text>
                        <Text style={styles.emptySub}>Try adjusting the filter or search keywords.</Text>
                    </View>
                ) : (
                    filtered.map(p => {
                        const isPending = p.status === 'pending';
                        const isSuspended = p.status === 'suspended';
                        const isApproved = p.status === 'approved';

                        return (
                            <View
                                key={p.id}
                                style={[
                                    styles.partnerCard,
                                    isPending && styles.cardPending,
                                    isSuspended && styles.cardSuspended
                                ]}
                            >
                                <View style={styles.cardTop}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{(p.name || '?')[0]}</Text>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.name}>{p.name}</Text>
                                            <View style={[
                                                styles.statusBadge,
                                                isApproved && styles.statusApproved,
                                                isPending && styles.statusPending,
                                                isSuspended && styles.statusSuspended
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    isApproved && { color: COLORS.success },
                                                    isPending && { color: COLORS.gold },
                                                    isSuspended && { color: COLORS.danger }
                                                ]}>
                                                    {p.status.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.subText}>{p.phone} • {p.taluk} ({p.district || 'Kerala'})</Text>
                                        <Text style={styles.licenseText}>License: {p.kselbLicense || 'Under Verification'}</Text>
                                    </View>
                                </View>

                                {/* Rating & Jobs */}
                                <View style={styles.metaStrip}>
                                    <View style={styles.metaStripItem}>
                                        <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
                                        <Text style={styles.metaStripText}>{p.ratings?.overall || 'New'} ★</Text>
                                    </View>
                                    <View style={styles.metaStripItem}>
                                        <Award size={12} color={COLORS.accent} />
                                        <Text style={styles.metaStripText}>{p.totalJobsCompleted || 0} Completed</Text>
                                    </View>
                                    <View style={styles.metaStripItem}>
                                        <Shield size={12} color={p.insuranceCover === 'Suspended' ? COLORS.danger : COLORS.success} />
                                        <Text style={styles.metaStripText}>{p.insuranceCover || '₹5 Lakh Cover'}</Text>
                                    </View>
                                </View>

                                {/* Category Badges */}
                                <View style={styles.certRow}>
                                    {(p.serviceTypes || ['Electrical']).map(c => (
                                        <View key={c} style={styles.certBadge}>
                                            <Text style={styles.certBadgeText}>{c} Certified</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Suspension Log Notice if suspended */}
                                {isSuspended && p.suspensionLogs?.length > 0 && (
                                    <View style={styles.suspensionNoticeBox}>
                                        <AlertTriangle size={13} color={COLORS.danger} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.suspensionNoticeTitle}>
                                                Suspended on {p.suspensionLogs[0].suspendedAt} by {p.suspensionLogs[0].suspendedBy}:
                                            </Text>
                                            <Text style={styles.suspensionNoticeReason}>{p.suspensionLogs[0].reason}</Text>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.divider} />

                                {/* Action Buttons */}
                                <View style={styles.actionRow}>
                                    {isPending ? (
                                        <>
                                            <TouchableOpacity
                                                style={styles.viewDocBtn}
                                                onPress={() => handleViewDoc(p)}
                                            >
                                                <Eye size={13} color={COLORS.accent} />
                                                <Text style={styles.viewDocBtnText}>Review License Doc</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.rejectBtn}
                                                onPress={() => handleReject(p.id, p.name)}
                                            >
                                                <XCircle size={13} color={COLORS.danger} />
                                                <Text style={styles.rejectBtnText}>Reject</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.approveBtn}
                                                onPress={() => handleApprove(p.id, p.name)}
                                            >
                                                <CheckCircle size={13} color="#fff" />
                                                <Text style={styles.approveBtnText}>Approve</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : isSuspended ? (
                                        <TouchableOpacity
                                            style={styles.reactivateBtn}
                                            onPress={() => handleReactivate(p)}
                                        >
                                            <Unlock size={14} color="#fff" />
                                            <Text style={styles.reactivateBtnText}>Reactivate Account</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                style={styles.callBtn}
                                                onPress={() => Alert.alert('Contact Wireman', `Call ${p.name} on ${p.phone}?`, [
                                                    { text: 'Cancel' },
                                                    { text: 'Call', onPress: () => Linking.openURL(`tel:${p.phone}`) }
                                                ])}
                                            >
                                                <Phone size={13} color={COLORS.textPrimary} />
                                                <Text style={styles.callBtnText}>Call</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.suspendBtn}
                                                onPress={() => handleOpenSuspend(p)}
                                            >
                                                <Lock size={13} color={COLORS.danger} />
                                                <Text style={styles.suspendBtnText}>Suspend Account</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Suspend Account Modal */}
            <Modal
                visible={isSuspendModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsSuspendModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>ACCOUNT AUDIT ENFORCEMENT</Text>
                                <Text style={styles.modalTitle}>Suspend {selectedPartner?.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsSuspendModalOpen(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalLabel}>Select / Enter Mandatory Reason Log:</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="e.g. Failure to adhere to KSELB live wire safety standards, or customer billing dispute..."
                                placeholderTextColor={COLORS.textTertiary}
                                multiline
                                numberOfLines={3}
                                value={suspendReason}
                                onChangeText={setSuspendReason}
                            />
                            <Text style={styles.modalNotice}>
                                ⚠️ Suspending an account turns the partner offline immediately, stops all auto-dispatch pings, and flags pending payouts for audit.
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.confirmSuspendBtn}
                                onPress={handleConfirmSuspend}
                            >
                                <Lock size={16} color="#fff" />
                                <Text style={styles.confirmSuspendBtnText}>Confirm Suspension & Log Audit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* License Doc Review Modal */}
            <Modal
                visible={isDocModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDocModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>KSELB VERIFICATION DOSSIER</Text>
                                <Text style={styles.modalTitle}>{viewingDocPartner?.name} Documents</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsDocModalOpen(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.docInfoRow}>
                                <Text style={styles.docInfoLabel}>KSELB License Number:</Text>
                                <Text style={styles.docInfoVal}>{viewingDocPartner?.kselbLicense || 'KSELB/AP-8821/KL'}</Text>
                            </View>
                            <View style={styles.docInfoRow}>
                                <Text style={styles.docInfoLabel}>Police Clearance Status:</Text>
                                <Text style={[styles.docInfoVal, { color: COLORS.success }]}>
                                    {viewingDocPartner?.policeClearanceStatus || 'Verified (Local Station)'}
                                </Text>
                            </View>

                            <View style={styles.docPreviewPlaceholder}>
                                <FileText size={40} color={COLORS.accent} />
                                <Text style={styles.docPreviewTitle}>Official KSELB Wireman Certificate</Text>
                                <Text style={styles.docPreviewSub}>Class-A Wireman Competency • Certified by Kerala Electrical Inspectorate</Text>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.approveFromModalBtn}
                                onPress={() => {
                                    setIsDocModalOpen(false);
                                    handleApprove(viewingDocPartner.id, viewingDocPartner.name);
                                }}
                            >
                                <CheckCircle size={16} color="#fff" />
                                <Text style={styles.approveFromModalBtnText}>Approve & Enrol Contractor</Text>
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
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        marginHorizontal: SPACING.md,
        marginTop: 12,
        paddingHorizontal: 10,
        height: 38,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginTop: 10,
        gap: 8,
        flexWrap: 'wrap',
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
    partnerCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardPending: {
        borderColor: 'rgba(234, 179, 8, 0.4)',
    },
    cardSuspended: {
        borderColor: 'rgba(239, 68, 68, 0.4)',
        opacity: 0.85,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.accent,
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    subText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
    licenseText: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusApproved: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    statusPending: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
    },
    statusSuspended: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    metaStrip: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        backgroundColor: COLORS.bgTertiary,
        padding: 8,
        borderRadius: 8,
    },
    metaStripItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaStripText: {
        fontSize: 11,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    certRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    certBadge: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    certBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: COLORS.accent,
    },
    suspensionNoticeBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    suspensionNoticeTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.danger,
    },
    suspensionNoticeReason: {
        fontSize: 11,
        color: COLORS.textPrimary,
        marginTop: 1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    callBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    callBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    suspendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    suspendBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.danger,
    },
    viewDocBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    viewDocBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.accent,
    },
    rejectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    rejectBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.danger,
    },
    approveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
    reactivateBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        borderRadius: 8,
    },
    reactivateBtnText: {
        fontSize: 12,
        fontWeight: '700',
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
        marginTop: 14,
    },
    modalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    textArea: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 10,
        color: COLORS.textPrimary,
        fontSize: 13,
        textAlignVertical: 'top',
        height: 70,
    },
    modalNotice: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 10,
        lineHeight: 16,
    },
    modalFooter: {
        marginTop: 14,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    confirmSuspendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.danger,
        paddingVertical: 12,
        borderRadius: 10,
    },
    confirmSuspendBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    },
    docInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    docInfoLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    docInfoVal: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    docPreviewPlaceholder: {
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.border,
    },
    docPreviewTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 8,
    },
    docPreviewSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },
    approveFromModalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.success,
        paddingVertical: 12,
        borderRadius: 10,
    },
    approveFromModalBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    }
});
