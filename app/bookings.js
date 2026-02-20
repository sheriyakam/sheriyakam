import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Search, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import RescheduleModal from '../components/RescheduleModal';
import ReviewModal from '../components/ReviewModal';
import CancelModal from '../components/CancelModal';
import PaymentModal from '../components/PaymentModal';

import { getBookings, bookingEvents, payBooking } from '../constants/bookingStore';

export default function BookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState(getBookings());
    const [activeTab, setActiveTab] = useState('Upcoming');

    // Modals
    const [rescheduleBooking, setRescheduleBooking] = useState(null);
    const [cancelBooking, setCancelBooking] = useState(null);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [paymentBooking, setPaymentBooking] = useState(null);

    // Sync with store
    useEffect(() => {
        const updateBookings = () => setBookings([...getBookings()]);
        bookingEvents.on('change', updateBookings);
        return () => bookingEvents.off('change', updateBookings);
    }, []);

    // Refresh Logic
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate network request or fetching fresh data from store
        setTimeout(() => {
            setBookings([...getBookings()]);
            setRefreshing(false);
        }, 1000);
    }, []);

    // Live Time Check Logic
    const getFilteredBookings = () => {
        const now = new Date();
        const currentHour = now.getHours();

        return bookings.filter(b => {
            // Status mapping for tabs
            // 'Upcoming' includes 'open', 'accepted'
            // 'Completed' includes 'completed'
            // 'Cancelled' includes 'Cancelled'

            let tabMatch = false;
            if (activeTab === 'Upcoming') tabMatch = (['open', 'accepted', 'in_progress'].includes(b.status));
            else if (activeTab === 'Completed') tabMatch = (b.status === 'completed');
            else if (activeTab === 'Cancelled') tabMatch = (b.status === 'Cancelled');

            if (!tabMatch) return false;

            // Time filtering for 'Today' bookings
            if (activeTab === 'Upcoming' && b.date === 'Today') {
                if (b.time === 'Morning' && currentHour >= 12) return false;
                if (b.time === 'Afternoon' && currentHour >= 17) return false;
            }

            return true;
        });
    };

    const filteredBookings = getFilteredBookings();

    const handleCancelBooking = (reason) => {
        if (!cancelBooking) return;
        // In real app, call cancelBooking(id) from store
        // For now, local update logic is handled by store events if we implemented cancel in store
        // Let's assume store handles it, or just log it
        console.log(`Cancelling booking ${cancelBooking.id}`);
        setCancelBooking(null);
    };

    const handlePayment = (method) => {
        if (paymentBooking) {
            payBooking(paymentBooking.id, method);
            setPaymentBooking(null);
            Alert.alert("Success", "Payment Successful!");
        }
    };

    const BookingCard = ({ booking }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'open':
                case 'accepted': return COLORS.accent;
                case 'in_progress': return COLORS.gold;
                case 'completed': return COLORS.success;
                case 'Cancelled': return COLORS.danger;
                default: return COLORS.textSecondary;
            }
        };

        const displayStatus = booking.status === 'open' ? 'Requested' :
            booking.status === 'accepted' ? 'Accepted' :
                booking.status === 'in_progress' ? 'Work in Progress' :
                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>{booking.service}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                            {displayStatus}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardDetailRow}>
                    <View style={styles.detailItem}>
                        <Calendar size={14} color={COLORS.textTertiary} />
                        <Text style={styles.detailText}>{booking.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Clock size={14} color={COLORS.textTertiary} />
                        <Text style={styles.detailText}>{booking.time}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <MapPin size={14} color={COLORS.textTertiary} />
                    <Text style={styles.detailText}>{booking.address}</Text>
                </View>

                {/* OTP Display for Active Jobs */}
                {(booking.status === 'open' || booking.status === 'accepted') && booking.checkInOtp && (
                    <View style={styles.otpContainer}>
                        <Text style={styles.otpLabel}>Check-In OTP:</Text>
                        <Text style={styles.otpValue}>{booking.checkInOtp || booking.otp}</Text>
                    </View>
                )}

                {booking.status === 'in_progress' && booking.otp && (
                    <View style={[styles.otpContainer, { borderColor: COLORS.accent, backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                        <Text style={[styles.otpLabel, { color: COLORS.accent }]}>Completion OTP:</Text>
                        <Text style={[styles.otpValue, { color: COLORS.accent }]}>{booking.otp}</Text>
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.priceLabel}>Total Amount</Text>
                        <Text style={styles.priceValue}>₹{booking.finalPrice || booking.price}</Text>
                        {booking.paymentStatus === 'paid' && <Text style={{ color: COLORS.success, fontSize: 10, fontWeight: 'bold' }}>PAID</Text>}
                    </View>

                    {/* Actions */}
                    {(booking.status === 'open' || booking.status === 'accepted') && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setCancelBooking(booking)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rescheduleBtn}
                                onPress={() => setRescheduleBooking(booking)}
                            >
                                <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Pay Button for Completed Jobs */}
                    {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                            style={styles.payBtn}
                            onPress={() => setPaymentBooking(booking)}
                        >
                            <CreditCard size={14} color="#000" />
                            <Text style={styles.payBtnText}>Pay Now</Text>
                        </TouchableOpacity>
                    )}

                    {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                        <TouchableOpacity
                            style={styles.reviewBtn}
                            onPress={() => setReviewBooking(booking)}
                        >
                            <Text style={styles.reviewBtnText}>Write Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const TabButton = ({ title }) => (
        <TouchableOpacity
            style={[styles.tabBtn, activeTab === title && styles.activeTabBtn]}
            onPress={() => setActiveTab(title)}
        >
            <Text style={[styles.tabText, activeTab === title && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    <TabButton title="Upcoming" />
                    <TabButton title="Completed" />
                    <TabButton title="Cancelled" />
                </ScrollView>
            </View>

            <FlatList
                data={filteredBookings}
                renderItem={({ item }) => <BookingCard booking={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Search size={48} color={COLORS.textTertiary} />
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
                }
            />

            <RescheduleModal
                booking={rescheduleBooking}
                visible={!!rescheduleBooking}
                onClose={() => setRescheduleBooking(null)}
                onConfirm={() => setRescheduleBooking(null)}
            />

            <ReviewModal
                booking={reviewBooking}
                visible={!!reviewBooking}
                onClose={() => setReviewBooking(null)}
                onSubmit={(reviewData) => console.log("Review Submitted:", reviewData)}
            />

            <CancelModal
                visible={!!cancelBooking}
                onClose={() => setCancelBooking(null)}
                onSubmit={handleCancelBooking}
            />

            <PaymentModal
                visible={!!paymentBooking}
                amount={paymentBooking?.finalPrice || 0}
                onClose={() => setPaymentBooking(null)}
                onPaymentComplete={handlePayment}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    tabsContainer: {
        marginBottom: SPACING.md,
    },
    tabsScroll: {
        paddingHorizontal: SPACING.md,
        gap: 12,
    },
    tabBtn: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTabBtn: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    tabText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    listContent: {
        padding: SPACING.md,
        paddingTop: 0,
        gap: 16,
    },
    card: {
        backgroundColor: '#18181b', // Slightly lighter than bg
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 12,
    },
    cardDetailRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    otpContainer: {
        marginBottom: 16,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.gold
    },
    otpLabel: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 12
    },
    otpValue: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 2
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginHorizontal: -16,
        marginBottom: -16,
        padding: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    priceLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    priceValue: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
    },
    emptyText: {
        color: COLORS.textTertiary,
        marginTop: 16,
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    rescheduleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    rescheduleBtnText: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.15)', // Red tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    cancelBtnText: {
        color: COLORS.danger,
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(234, 179, 8, 0.15)', // Gold/Yellow tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gold,
    },
    reviewBtnText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 14,
    },
    payBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    payBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    }
});
