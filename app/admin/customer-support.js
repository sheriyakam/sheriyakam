import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Search, User, Phone, MapPin, DollarSign,
    RotateCcw, Gift, CheckCircle, Clock, ShieldCheck,
    AlertCircle, ChevronRight, Zap, RefreshCw
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    searchCustomerBookings, issueCustomerRefund,
    issueCustomerCredit, getCustomerCredits
} from '../../constants/bookingStore';

export default function CustomerSupportLookupScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('94471'); // Pre-fill sample search
    const [results, setResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSearch = (q) => {
        setSearchQuery(q);
        const matches = searchCustomerBookings(q);
        setResults(matches);
        if (matches.length > 0) {
            setSelectedCustomer({
                name: matches[0].customerName,
                phone: matches[0].customerPhone,
                address: matches[0].address,
                district: matches[0].district,
                bookings: matches
            });
        } else {
            setSelectedCustomer(null);
        }
    };

    // Run initial search on mount
    React.useEffect(() => {
        handleSearch('94471');
    }, []);

    const handleCall = (phone) => {
        Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', `Could not dial ${phone}`));
    };

    const handleIssueCredit = () => {
        if (!selectedCustomer) return;
        Alert.alert(
            'Issue Courtesy Wallet Credit',
            `Add ₹100 convenience credit to ${selectedCustomer.name}'s phone (${selectedCustomer.phone}) for service delay or loyalty compensation?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm ₹100 Credit',
                    onPress: () => {
                        const res = issueCustomerCredit(selectedCustomer.phone, 100, 'Late arrival courtesy credit');
                        Alert.alert('✅ Credit Issued', `₹100 added. New customer wallet balance: ₹${res.newBalance}`);
                        handleSearch(searchQuery);
                    }
                }
            ]
        );
    };

    const handleIssueRefund = (booking) => {
        Alert.alert(
            'Issue Booking Refund',
            `Issue direct Razorpay/UPI refund for Job #${booking.id} (${booking.service})?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Full Refund (₹' + (booking.finalPrice || booking.price) + ')',
                    onPress: () => {
                        const amount = booking.finalPrice || booking.price;
                        const res = issueCustomerRefund(booking.id, amount, 'Customer satisfaction waiver');
                        if (res.success) {
                            Alert.alert('✅ Refund Processed', `Refund #${res.refundId} for ₹${amount} issued via Razorpay.`);
                            handleSearch(searchQuery);
                        }
                    }
                }
            ]
        );
    };

    const walletBalance = selectedCustomer ? getCustomerCredits(selectedCustomer.phone) : 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Customer Support 360° Lookup</Text>
                    <Text style={styles.headerSub}>Search by phone or booking ID, issue refunds & service credits</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Search size={18} color={COLORS.textTertiary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter customer phone (e.g. 94471) or booking ID (e.g. b-active-1)..."
                    placeholderTextColor={COLORS.textTertiary}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {selectedCustomer ? (
                    <>
                        {/* Customer 360 Profile Hero */}
                        <View style={styles.profileCard}>
                            <View style={styles.profileTopRow}>
                                <View style={styles.avatarCircle}>
                                    <User size={22} color={COLORS.accent} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.customerName}>{selectedCustomer.name}</Text>
                                    <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
                                    <Text style={styles.customerAddress} numberOfLines={1}>{selectedCustomer.address}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.callBtn}
                                    onPress={() => handleCall(selectedCustomer.phone)}
                                >
                                    <Phone size={14} color="#fff" />
                                    <Text style={styles.callBtnText}>Call</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileDivider} />

                            <View style={styles.profileStatsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Lifetime Orders</Text>
                                    <Text style={styles.statVal}>{selectedCustomer.bookings.length}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Wallet Credits</Text>
                                    <Text style={[styles.statVal, { color: COLORS.success }]}>₹{walletBalance}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>District Hub</Text>
                                    <Text style={[styles.statVal, { color: COLORS.accent }]}>{selectedCustomer.district || 'Kannur'}</Text>
                                </View>
                            </View>

                            {/* Quick Action: Issue Service Credit */}
                            <TouchableOpacity
                                style={styles.issueCreditAction}
                                onPress={handleIssueCredit}
                            >
                                <Gift size={15} color={COLORS.gold} />
                                <Text style={styles.issueCreditActionText}>Issue ₹100 Courtesy Service Credit to Customer</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Customer Order History */}
                        <Text style={styles.sectionHeader}>ORDER & DISPATCH HISTORY ({selectedCustomer.bookings.length})</Text>

                        <View style={styles.ordersList}>
                            {selectedCustomer.bookings.map(b => (
                                <View key={b.id} style={styles.orderCard}>
                                    <View style={styles.orderCardTop}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <Text style={styles.orderId}>Job #{b.id}</Text>
                                                <View style={styles.statusBadge}>
                                                    <Text style={styles.statusBadgeText}>{b.status?.toUpperCase()}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.orderService}>{b.service}</Text>
                                            <Text style={styles.orderPartner}>
                                                Assigned Wireman: {b.partnerName || 'Unassigned'}
                                            </Text>
                                        </View>

                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={styles.orderPrice}>₹{b.finalPrice || b.price}</Text>
                                            <Text style={styles.orderPriceSub}>{b.paymentStatus || 'Pending'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.orderMetaRow}>
                                        <View style={styles.orderMetaItem}>
                                            <Clock size={11} color={COLORS.textTertiary} />
                                            <Text style={styles.orderMetaText}>{b.date} • {b.time}</Text>
                                        </View>
                                        <View style={styles.orderMetaItem}>
                                            <ShieldCheck size={11} color={COLORS.success} />
                                            <Text style={styles.orderMetaText}>₹5L Cover Protected</Text>
                                        </View>
                                        {b.refundIssued && (
                                            <View style={styles.orderMetaItem}>
                                                <RotateCcw size={11} color={COLORS.danger} />
                                                <Text style={[styles.orderMetaText, { color: COLORS.danger }]}>₹{b.refundIssued} Refunded</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.cardDivider} />

                                    <View style={styles.orderActionsRow}>
                                        <TouchableOpacity
                                            style={styles.refundBtn}
                                            onPress={() => handleIssueRefund(b)}
                                        >
                                            <RotateCcw size={13} color={COLORS.danger} />
                                            <Text style={styles.refundBtnText}>Issue Refund</Text>
                                        </TouchableOpacity>

                                        {b.assignedPartnerPhone && (
                                            <TouchableOpacity
                                                style={styles.callWiremanBtn}
                                                onPress={() => handleCall(b.assignedPartnerPhone)}
                                            >
                                                <Phone size={13} color={COLORS.accent} />
                                                <Text style={styles.callWiremanBtnText}>Call Wireman</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyCard}>
                        <Search size={36} color={COLORS.textTertiary} />
                        <Text style={styles.emptyTitle}>No Customer Found</Text>
                        <Text style={styles.emptySub}>Enter a 10-digit phone number or booking ID to retrieve records.</Text>
                    </View>
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
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        margin: SPACING.md,
        paddingHorizontal: 12,
        height: 42,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    content: {
        paddingHorizontal: SPACING.md,
        paddingBottom: 40,
        gap: 14,
    },
    profileCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.35)',
    },
    profileTopRow: {
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
    customerName: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    customerPhone: {
        fontSize: 12,
        color: COLORS.accent,
        fontWeight: '600',
        marginTop: 1,
    },
    customerAddress: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    callBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    callBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    profileDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    profileStatsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    statVal: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.border,
    },
    issueCreditAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    issueCreditActionText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.gold,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    ordersList: {
        gap: 12,
    },
    orderCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    orderCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderId: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.accent,
    },
    statusBadge: {
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    orderService: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    orderPartner: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    orderPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    orderPriceSub: {
        fontSize: 10,
        color: COLORS.textTertiary,
    },
    orderMetaRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    orderMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    orderMetaText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    cardDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    orderActionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    refundBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    refundBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.danger,
    },
    callWiremanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.bgTertiary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    callWiremanBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textPrimary,
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
