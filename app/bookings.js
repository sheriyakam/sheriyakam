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

import { getBookings, bookingEvents, payBooking, cancelBooking as cancelBookingInStore } from '../constants/bookingStore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function BookingsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
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
        if (!user) return []; // Security: don't show any if not logged in

        const now = new Date();
        const currentHour = now.getHours();

        return bookings.filter(b => {
            // Customer filtering
            if (b.customerEmail !== user.email && b.customerPhone !== user.mobile) return false;

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
        cancelBookingInStore(cancelBooking.id);
        setCancelBooking(null);
        Alert.alert('Cancelled', 'Your booking has been cancelled.');
    };

    const handlePayment = (bookingId, method) => {
        payBooking(bookingId, method);
        setPaymentBooking(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
            case 'accepted': return colors.accent;
            case 'in_progress': return COLORS.gold;
            case 'completed': return COLORS.success;
            case 'Cancelled': return COLORS.danger;
            default: return colors.textSecondary;
        }
    };

    const BookingCard = ({ booking }) => {
        const statusColor = getStatusColor(booking.status);

        const displayStatus = booking.status === 'open' ? 'Requested' :
            booking.status === 'accepted' ? 'Accepted' :
                booking.status === 'in_progress' ? 'Work in Progress' :
                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        return (
            <View style={[styles.card, { 
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.serviceName, { color: colors.textPrimary }]}>{booking.service}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {displayStatus}
                        </Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                <View style={styles.cardDetailRow}>
                    <View style={styles.detailItem}>
                        <Calendar size={14} color={colors.textTertiary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>{booking.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Clock size={14} color={colors.textTertiary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            {booking.time}
                            {booking.time === 'Morning' ? ' · 8–11 AM' :
                                booking.time === 'Afternoon' ? ' · 12–3 PM' :
                                    booking.time === 'Evening' ? ' · 4–7 PM' : ''}
                        </Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <MapPin size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{booking.address}</Text>
                </View>

                {/* Notifications & OTP Display for Active Jobs */}
                {booking.status === 'accepted' && (
                    <View style={[styles.notificationAlert, { 
                        backgroundColor: colors.accent + '12',
                        borderColor: colors.accent + '30',
                    }]}>
                        <Text style={[styles.notificationText, { color: colors.accent }]}>Electrician {booking.partnerName || 'assigned'} is 5 minutes away.</Text>
                    </View>
                )}

                {(booking.status === 'open' || booking.status === 'accepted') && booking.checkInOtp && (
                    <View style={[styles.otpContainer, { 
                        backgroundColor: COLORS.gold + '12',
                        borderColor: COLORS.gold + '40',
                    }]}>
                        <Text style={[styles.otpLabel, { color: COLORS.gold }]}>Security Alert:</Text>
                        <Text style={[styles.otpText, { color: COLORS.gold }]}>Your Safety OTP is <Text style={[styles.otpValue, { color: COLORS.gold }]}>{booking.checkInOtp || booking.otp}</Text>. Do not share it until the technician arrives.</Text>
                    </View>
                )}

                {booking.status === 'in_progress' && booking.otp && (
                    <View style={[styles.otpContainer, { borderColor: colors.accent + '40', backgroundColor: colors.accent + '12' }]}>
                        <Text style={[styles.otpLabel, { color: colors.accent }]}>Completion OTP:</Text>
                        <Text style={[styles.otpValue, { color: colors.accent }]}>{booking.otp}</Text>
                    </View>
                )}

                <View style={[styles.cardFooter, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
                    <View>
                        <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>Total Amount</Text>
                        <Text style={[styles.priceValue, { color: colors.accent }]}>₹{booking.finalPrice || booking.price}</Text>
                        {booking.paymentStatus === 'paid' && <Text style={{ color: COLORS.success, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>PAID</Text>}
                    </View>

                    {/* Actions */}
                    {(booking.status === 'open' || booking.status === 'accepted') && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { backgroundColor: COLORS.danger + '12', borderColor: COLORS.danger + '40' }]}
                                onPress={() => setCancelBooking(booking)}
                            >
                                <Text style={[styles.cancelBtnText, { color: COLORS.danger }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rescheduleBtn, { backgroundColor: colors.accent + '12', borderColor: colors.accent + '40' }]}
                                onPress={() => setRescheduleBooking(booking)}
                            >
                                <Text style={[styles.rescheduleBtnText, { color: colors.accent }]}>Reschedule</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Pay Button for Completed Jobs */}
                    {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                            style={[styles.payBtn, { backgroundColor: colors.accent }]}
                            onPress={() => setPaymentBooking(booking)}
                        >
                            <CreditCard size={14} color="#fff" />
                            <Text style={styles.payBtnText}>Pay Now</Text>
                        </TouchableOpacity>
                    )}

                    {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                        <TouchableOpacity
                            style={[styles.reviewBtn, { backgroundColor: COLORS.gold + '15', borderColor: COLORS.gold + '40' }]}
                            onPress={() => setReviewBooking(booking)}
                        >
                            <Text style={[styles.reviewBtnText, { color: COLORS.gold }]}>Write Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const TabButton = ({ title }) => {
        const isActive = activeTab === title;
        return (
            <TouchableOpacity
                style={[
                    styles.tabBtn,
                    {
                        backgroundColor: isActive ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                        borderColor: isActive ? colors.accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                    }
                ]}
                onPress={() => setActiveTab(title)}
            >
                <Text style={[
                    styles.tabText,
                    {
                        color: isActive ? '#fff' : colors.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                    }
                ]}>{title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Bookings</Text>
                <View style={{ width: 40 }} />
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
                        <Search size={44} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No {activeTab.toLowerCase()} bookings found</Text>
                        <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Your bookings will appear here</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
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
                booking={paymentBooking}
                onClose={() => setPaymentBooking(null)}
                onPay={handlePayment}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    tabsContainer: {
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    tabsScroll: {
        paddingHorizontal: SPACING.md,
        gap: 10,
    },
    tabBtn: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    tabText: {
        fontSize: 14,
    },
    listContent: {
        padding: SPACING.md,
        paddingTop: SPACING.xs,
        paddingBottom: 100, // Space for BottomNav
        gap: 14,
    },
    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
        letterSpacing: -0.2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    divider: {
        height: 1,
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
        fontSize: 13,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    otpContainer: {
        marginBottom: 14,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    otpLabel: {
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 4,
    },
    otpText: {
        fontSize: 12,
        lineHeight: 18,
    },
    otpValue: {
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 2
    },
    notificationAlert: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: -16,
        marginBottom: -16,
        padding: 14,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    priceLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 56,
        gap: 8,
    },
    emptyText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 13,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    rescheduleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    rescheduleBtnText: {
        fontWeight: '700',
        fontSize: 13,
    },
    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    cancelBtnText: {
        fontWeight: '700',
        fontSize: 13,
    },
    reviewBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    reviewBtnText: {
        fontWeight: '700',
        fontSize: 13,
    },
    payBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    payBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13
    }
});
