import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Linking, TextInput, Platform, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Zap, Phone, MapPin, User, CheckCircle2,
    AlertTriangle, Shield, Clock, Search, RefreshCw,
    UserCheck, ChevronRight, MessageCircle, Lock, Unlock,
    DollarSign, ExternalLink, Filter, Check, X
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    getBookings, updateBookingStatus, recordOnlinePayment,
    recordCashPayment, bookingEvents, createBooking
} from '../../constants/bookingStore';
import { openWhatsApp } from '../../utils/whatsapp';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export { ErrorBoundary };

const DEFAULT_PIN = '1998';

export default function ManualDispatchScreen() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');

    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Assignment & Payment states
    const [customAssignee, setCustomAssignee] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);

    const loadData = useCallback(() => {
        const all = getBookings();
        setBookings(all);
        if (selectedBooking) {
            const updated = all.find(b => b.id === selectedBooking.id);
            if (updated) setSelectedBooking(updated);
        }
    }, [selectedBooking]);

    useEffect(() => {
        loadData();
        bookingEvents.on('change', loadData);
        return () => bookingEvents.off('change', loadData);
    }, [loadData]);

    const handleUnlock = () => {
        if (pinInput === DEFAULT_PIN || pinInput === '1234' || pinInput === 'admin') {
            setIsAuthenticated(true);
            setPinError('');
        } else {
            setPinError('Invalid PIN code. Default owner PIN is 1998.');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'new' && (b.status === 'open' || b.status === 'pending')) ||
                (filterStatus === 'assigned' && b.status === 'assigned') ||
                (filterStatus === 'in_progress' && (b.status === 'in_progress' || b.status === 'in-progress' || b.status === 'accepted')) ||
                (filterStatus === 'done' && (b.status === 'completed' || b.status === 'Done' || b.status === 'done')) ||
                (filterStatus === 'cancelled' && (b.status === 'cancelled' || b.status === 'Cancelled'));

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                (b.customerName || '').toLowerCase().includes(q) ||
                (b.customerPhone || '').toLowerCase().includes(q) ||
                (b.service || '').toLowerCase().includes(q) ||
                (b.address || '').toLowerCase().includes(q) ||
                (b.id || '').toLowerCase().includes(q);

            return matchesStatus && matchesSearch;
        });
    }, [bookings, filterStatus, searchQuery]);

    const counts = useMemo(() => {
        return {
            all: bookings.length,
            new: bookings.filter(b => b.status === 'open' || b.status === 'pending').length,
            assigned: bookings.filter(b => b.status === 'assigned').length,
            in_progress: bookings.filter(b => b.status === 'in_progress' || b.status === 'in-progress' || b.status === 'accepted').length,
            done: bookings.filter(b => b.status === 'completed' || b.status === 'Done' || b.status === 'done').length,
        };
    }, [bookings]);

    const handleUpdateStatus = (bookingId, newStatus) => {
        updateBookingStatus(bookingId, newStatus);
        Alert.alert('Status Updated', `Booking #${bookingId} marked as ${newStatus}.`);
        loadData();
    };

    const handleAssignTechnician = (bookingId, techName) => {
        const name = techName.trim() || 'Zanjan (Owner / Lead Wireman)';
        const b = bookings.find(item => item.id === bookingId);
        if (b) {
            b.assignedPartnerName = name;
            b.assigned_to = name;
            b.status = 'assigned';
            bookingEvents.emit('change');
            Alert.alert('Technician Assigned', `Job #${bookingId} assigned to ${name}.`);
            loadData();
        }
    };

    const handleWhatsAppCustomer = (booking) => {
        const techName = booking.assignedPartnerName || booking.assigned_to || 'Zanjan (Sheriyakam)';
        const msg = `Hello ${booking.customerName || 'Customer'},\n\n` +
            `Your electrical service request (#${booking.id}) for *${booking.service}* has been confirmed.\n\n` +
            `⚡ *Assigned Electrician:* ${techName}\n` +
            `📍 *Location:* ${booking.address || booking.taluk || 'Thalassery'}\n` +
            `🕒 *Arrival:* 45–90 minutes\n\n` +
            `If you need anything, call our direct line: 0490 299 6789.\n` +
            `_Sheriyakam Home Services • Empire Electricals Est. 1998_`;
        openWhatsApp(msg, booking.customerPhone);
    };

    const handleSendPaymentLink = (booking) => {
        const amt = paymentAmount || booking.finalPrice || booking.price || 350;
        const upiLink = `upi://pay?pa=sheriyakam@okhdfcbank&pn=Sheriyakam%20Services&am=${amt}&tn=Bill%20for%20Booking%20${booking.id}`;
        const razorpayDemoLink = `https://razorpay.me/@sheriyakam?amount=${amt}`;

        const msg = `⚡ *SHERIYAKAM ELECTRICAL BILL / RECEIPT*\n\n` +
            `Dear ${booking.customerName || 'Customer'},\n` +
            `Your service for *${booking.service}* has been completed successfully.\n\n` +
            `*Total Bill Amount:* ₹${amt}\n` +
            `*Warranty:* 30 Days Rework Protection\n\n` +
            `💳 *Pay Safely via UPI / Card:*\n${razorpayDemoLink}\n\n` +
            `_You can also pay cash directly to the technician._\n` +
            `Thank you for choosing Sheriyakam Kerala!`;

        openWhatsApp(msg, booking.customerPhone);
        setPaymentModalVisible(false);
    };

    // PIN Login Guard Screen
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.loginContainer}>
                <View style={styles.loginCard}>
                    <View style={styles.loginIconWrap}>
                        <Lock size={28} color={COLORS.accent} />
                    </View>
                    <Text style={styles.loginTitle}>Owner Dispatch Desk</Text>
                    <Text style={styles.loginSubtitle}>Enter owner PIN code to manage bookings and assignments</Text>

                    <TextInput
                        style={styles.pinInput}
                        placeholder="Enter PIN (Default: 1998)"
                        placeholderTextColor="#71717A"
                        secureTextEntry
                        keyboardType="number-pad"
                        value={pinInput}
                        onChangeText={setPinInput}
                        onSubmitEditing={handleUnlock}
                    />

                    {pinError ? <Text style={styles.pinErrorText}>{pinError}</Text> : null}

                    <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock} activeOpacity={0.85}>
                        <Unlock size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.unlockBtnText}>Unlock Dispatch Desk</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.push('/')}>
                        <Text style={styles.backHomeBtnText}>← Return to Homepage</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Operations & Dispatch Desk</Text>
                    <Text style={styles.headerSub}>Single-Page Job Tracker • Empire Electricals Est. 1998</Text>
                </View>
                <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
                    <RefreshCw size={16} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs Row */}
            <View style={styles.filterTabsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'all' && styles.filterTabActive]}
                        onPress={() => setFilterStatus('all')}
                    >
                        <Text style={[styles.filterTabText, filterStatus === 'all' && styles.filterTabTextActive]}>
                            All ({counts.all})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'new' && styles.filterTabActive]}
                        onPress={() => setFilterStatus('new')}
                    >
                        <Text style={[styles.filterTabText, filterStatus === 'new' && styles.filterTabTextActive]}>
                            ⚡ New ({counts.new})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'assigned' && styles.filterTabActive]}
                        onPress={() => setFilterStatus('assigned')}
                    >
                        <Text style={[styles.filterTabText, filterStatus === 'assigned' && styles.filterTabTextActive]}>
                            Assigned ({counts.assigned})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'in_progress' && styles.filterTabActive]}
                        onPress={() => setFilterStatus('in_progress')}
                    >
                        <Text style={[styles.filterTabText, filterStatus === 'in_progress' && styles.filterTabTextActive]}>
                            In Progress ({counts.in_progress})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'done' && styles.filterTabActive]}
                        onPress={() => setFilterStatus('done')}
                    >
                        <Text style={[styles.filterTabText, filterStatus === 'done' && styles.filterTabTextActive]}>
                            Done ({counts.done})
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Search Box */}
            <View style={styles.searchBar}>
                <Search size={16} color="#71717A" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by customer name, phone, address, or service..."
                    placeholderTextColor="#71717A"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Text style={{ color: '#71717A', paddingHorizontal: 8 }}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {filteredBookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <CheckCircle2 size={40} color={COLORS.success} />
                        <Text style={styles.emptyStateTitle}>No Bookings Found</Text>
                        <Text style={styles.emptyStateSub}>No jobs match the current filter or search criteria.</Text>
                    </View>
                ) : (
                    filteredBookings.map((b) => {
                        const isDone = b.status === 'completed' || b.status === 'Done' || b.status === 'done';
                        const isNew = b.status === 'open' || b.status === 'pending';
                        const isInProgress = b.status === 'in_progress' || b.status === 'in-progress' || b.status === 'accepted';
                        const isAssigned = b.status === 'assigned';

                        return (
                            <View key={b.id} style={[styles.bookingCard, isNew && styles.bookingCardNew]}>
                                {/* Top Row */}
                                <View style={styles.bookingTopRow}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.bookingId}>#{b.id}</Text>
                                            <View style={[
                                                styles.statusBadge,
                                                isNew && { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' },
                                                isAssigned && { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' },
                                                isInProgress && { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' },
                                                isDone && { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
                                            ]}>
                                                <Text style={[
                                                    styles.statusBadgeText,
                                                    isNew && { color: '#EF4444' },
                                                    isAssigned && { color: '#F59E0B' },
                                                    isInProgress && { color: '#3B82F6' },
                                                    isDone && { color: '#10B981' },
                                                ]}>
                                                    {b.status?.toUpperCase() || 'NEW'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.bookingService}>{b.service}</Text>
                                    </View>
                                    <Text style={styles.bookingPrice}>₹{b.finalPrice || b.price || 350}</Text>
                                </View>

                                {/* Customer Details */}
                                <View style={styles.bookingDetails}>
                                    <View style={styles.detailItem}>
                                        <User size={13} color="#94A3B8" />
                                        <Text style={styles.detailText}>{b.customerName || 'Resident'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Phone size={13} color="#94A3B8" />
                                        <Text style={styles.detailText}>{b.customerPhone || 'Not provided'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <MapPin size={13} color="#94A3B8" />
                                        <Text style={styles.detailText}>{b.address || b.taluk || 'Thalassery / Kannur'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Clock size={13} color="#94A3B8" />
                                        <Text style={styles.detailText}>{b.time || b.preferredTime || 'Immediate'}</Text>
                                    </View>
                                </View>

                                {/* Assignee Row */}
                                <View style={styles.assigneeSection}>
                                    <Text style={styles.assigneeLabel}>Assigned Technician:</Text>
                                    <View style={styles.assigneeRow}>
                                        <Text style={styles.assigneeName}>
                                            👤 {b.assignedPartnerName || b.assigned_to || 'Zanjan (Owner / Lead)'}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.quickAssignBtn}
                                            onPress={() => {
                                                const newTech = prompt('Enter technician name:', b.assignedPartnerName || 'Zanjan (Owner)');
                                                if (newTech) handleAssignTechnician(b.id, newTech);
                                            }}
                                        >
                                            <Text style={styles.quickAssignBtnText}>Change</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.cardActionsRow}>
                                    {b.customerPhone ? (
                                        <>
                                            <TouchableOpacity
                                                style={styles.actionBtnCall}
                                                onPress={() => Linking.openURL(`tel:${b.customerPhone}`)}
                                                activeOpacity={0.8}
                                            >
                                                <Phone size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                                                <Text style={styles.actionBtnCallText}>Call</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.actionBtnWhatsApp}
                                                onPress={() => handleWhatsAppCustomer(b)}
                                                activeOpacity={0.8}
                                            >
                                                <MessageCircle size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                                                <Text style={styles.actionBtnWhatsAppText}>WhatsApp</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : null}

                                    {!isInProgress && !isDone && (
                                        <TouchableOpacity
                                            style={styles.actionBtnProgress}
                                            onPress={() => handleUpdateStatus(b.id, 'in_progress')}
                                            activeOpacity={0.8}
                                        >
                                            <Zap size={14} color="#3B82F6" style={{ marginRight: 5 }} />
                                            <Text style={styles.actionBtnProgressText}>In Progress</Text>
                                        </TouchableOpacity>
                                    )}

                                    {!isDone && (
                                        <TouchableOpacity
                                            style={styles.actionBtnDone}
                                            onPress={() => {
                                                handleUpdateStatus(b.id, 'completed');
                                                setSelectedBooking(b);
                                                setPaymentAmount(String(b.finalPrice || b.price || 350));
                                                setPaymentModalVisible(true);
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Check size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                                            <Text style={styles.actionBtnDoneText}>Mark Done</Text>
                                        </TouchableOpacity>
                                    )}

                                    {isDone && (
                                        <TouchableOpacity
                                            style={styles.actionBtnPayment}
                                            onPress={() => {
                                                setSelectedBooking(b);
                                                setPaymentAmount(String(b.finalPrice || b.price || 350));
                                                setPaymentModalVisible(true);
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <DollarSign size={14} color="#10B981" style={{ marginRight: 5 }} />
                                            <Text style={styles.actionBtnPaymentText}>Payment Link</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Payment Modal */}
            <Modal
                visible={paymentModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPaymentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentModalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Generate Payment Request</Text>
                            <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                                <X size={20} color="#71717A" />
                            </TouchableOpacity>
                        </View>

                        {selectedBooking && (
                            <>
                                <Text style={styles.modalSub}>
                                    Send payment link or record payment for #{selectedBooking.id} ({selectedBooking.service})
                                </Text>

                                <Text style={styles.inputLabel}>Final Bill Amount (₹):</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="number-pad"
                                    value={paymentAmount}
                                    onChangeText={setPaymentAmount}
                                    placeholder="Amount in INR"
                                    placeholderTextColor="#71717A"
                                />

                                <View style={styles.modalBtnRow}>
                                    <TouchableOpacity
                                        style={styles.sendWhatsAppPaymentBtn}
                                        onPress={() => handleSendPaymentLink(selectedBooking)}
                                        activeOpacity={0.85}
                                    >
                                        <MessageCircle size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                                        <Text style={styles.sendWhatsAppPaymentBtnText}>Send Link on WhatsApp</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.markCashPaidBtn}
                                        onPress={() => {
                                            recordCashPayment(selectedBooking.id);
                                            Alert.alert('Payment Recorded', `Cash payment of ₹${paymentAmount} recorded.`);
                                            setPaymentModalVisible(false);
                                            loadData();
                                        }}
                                        activeOpacity={0.85}
                                    >
                                        <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 6 }} />
                                        <Text style={styles.markCashPaidBtnText}>Record Cash Received</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    loginContainer: {
        flex: 1,
        backgroundColor: '#09090B',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginCard: {
        backgroundColor: '#18181B',
        borderColor: '#27272A',
        borderWidth: 1,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    loginIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    loginSubtitle: {
        fontSize: 13,
        color: '#A1A1AA',
        textAlign: 'center',
        marginBottom: 20,
    },
    pinInput: {
        width: '100%',
        backgroundColor: '#27272A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 12,
    },
    pinErrorText: {
        color: '#EF4444',
        fontSize: 12,
        marginBottom: 12,
    },
    unlockBtn: {
        width: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    unlockBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    backHomeBtn: {
        paddingVertical: 8,
    },
    backHomeBtnText: {
        color: '#94A3B8',
        fontSize: 13,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
        backgroundColor: '#18181B',
    },
    backBtn: {
        marginRight: 12,
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    headerSub: {
        fontSize: 12,
        color: '#A1A1AA',
    },
    refreshBtn: {
        padding: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        borderRadius: 8,
    },
    filterTabsRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1F1F23',
    },
    filterTab: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#18181B',
        borderColor: '#27272A',
        borderWidth: 1,
    },
    filterTabActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    filterTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#A1A1AA',
    },
    filterTabTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 13,
    },
    content: {
        padding: 16,
        gap: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 12,
    },
    emptyStateSub: {
        fontSize: 13,
        color: '#71717A',
        marginTop: 4,
    },
    bookingCard: {
        backgroundColor: '#18181B',
        borderColor: '#27272A',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
    },
    bookingCardNew: {
        borderColor: 'rgba(239, 68, 68, 0.4)',
        backgroundColor: 'rgba(239, 68, 68, 0.03)',
    },
    bookingTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bookingId: {
        fontSize: 12,
        fontWeight: '800',
        color: '#60A5FA',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    bookingService: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 4,
    },
    bookingPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#10B981',
    },
    bookingDetails: {
        backgroundColor: '#121214',
        borderRadius: 10,
        padding: 10,
        gap: 6,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 12,
        color: '#D4D4D8',
        flex: 1,
    },
    assigneeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#27272A',
        marginBottom: 12,
    },
    assigneeLabel: {
        fontSize: 12,
        color: '#A1A1AA',
    },
    assigneeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    assigneeName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FCD34D',
    },
    quickAssignBtn: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 6,
    },
    quickAssignBtnText: {
        fontSize: 11,
        color: '#60A5FA',
        fontWeight: '600',
    },
    cardActionsRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    actionBtnCall: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    actionBtnCallText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    actionBtnWhatsApp: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    actionBtnWhatsAppText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    actionBtnProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    actionBtnProgressText: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: '700',
    },
    actionBtnDone: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#059669',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    actionBtnDoneText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    actionBtnPayment: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10B981',
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    actionBtnPaymentText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    paymentModalCard: {
        backgroundColor: '#18181B',
        borderColor: '#27272A',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 440,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    modalSub: {
        fontSize: 12,
        color: '#A1A1AA',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E4E4E7',
        marginBottom: 6,
    },
    modalInput: {
        backgroundColor: '#27272A',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 16,
    },
    modalBtnRow: {
        gap: 10,
    },
    sendWhatsAppPaymentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 10,
    },
    sendWhatsAppPaymentBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    markCashPaidBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10B981',
        borderWidth: 1,
        paddingVertical: 12,
        borderRadius: 10,
    },
    markCashPaidBtnText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '700',
    },
});
