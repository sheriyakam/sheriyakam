import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Search } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import RescheduleModal from '../components/RescheduleModal';
import ReviewModal from '../components/ReviewModal';
import CancelModal from '../components/CancelModal';

const MOCK_BOOKINGS = [
    {
        id: '1',
        service: 'Emergency Repair Specialist',
        date: 'Today',
        time: 'Morning',
        status: 'Upcoming',
        price: 500,
        address: 'Home - Calicut'
    },
    {
        id: '2',
        service: 'AC Service Expert',
        date: 'Dec 12',
        time: 'Afternoon',
        status: 'Completed',
        price: 550,
        address: 'Office - Calicut'
    },
    {
        id: '3',
        service: 'Wiring Check',
        date: 'Nov 28',
        time: 'Evening',
        status: 'Cancelled',
        price: 450,
        address: 'Home - Calicut'
    }
];

import { getBookings, bookingEvents } from '../constants/bookingStore';

export default function BookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [rescheduleBooking, setRescheduleBooking] = useState(null);

    const [cancelBooking, setCancelBooking] = useState(null);
    const [reviewBooking, setReviewBooking] = useState(null);

    useEffect(() => {
        const load = () => {
            setBookings([...getBookings()]);
        };
        load();
        bookingEvents.on('change', load);
        return () => bookingEvents.off('change', load);
    }, []);

    const filteredBookings = bookings
        .filter(b => {
            const status = b.status.toLowerCase();
            if (activeTab === 'Upcoming') return status === 'open' || status === 'accepted';
            return status === activeTab.toLowerCase();
        })
        .sort((a, b) => {
            // Show accepted first
            if (a.status === 'accepted' && b.status !== 'accepted') return -1;
            if (a.status !== 'accepted' && b.status === 'accepted') return 1;
            return 0;
        });

    const handleCancelBooking = (reason) => {
        if (!cancelBooking) return;
        // In real app, call store method
        setCancelBooking(null);
    };

    const BookingCard = ({ booking }) => {
        const getStatusColor = (status) => {
            switch (status.toLowerCase()) {
                case 'upcoming': return COLORS.accent;
                case 'open': return COLORS.textSecondary;
                case 'accepted': return COLORS.primary;
                case 'completed': return COLORS.success;
                case 'cancelled': return COLORS.danger;
                default: return COLORS.textSecondary;
            }
        };

        const isAccepted = booking.status.toLowerCase() === 'accepted';

        return (
            <View style={[styles.card, isAccepted && styles.acceptedCard]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>{booking.service}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                            {booking.status === 'open' ? 'Requested' : booking.status}
                        </Text>
                    </View>
                </View>

                {isAccepted && (
                    <View style={styles.otpContainer}>
                        <Text style={styles.otpTitle}>Service OTP</Text>
                        <Text style={styles.otpCode}>{booking.otp}</Text>
                        <Text style={styles.otpInstruction}>
                            Share this code with the partner ONLY after the service is completed.
                        </Text>
                    </View>
                )}

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

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.priceLabel}>Total Amount</Text>
                        <Text style={styles.priceValue}>₹{booking.price}</Text>
                    </View>
                    {(booking.status === 'open' || booking.status === 'Upcoming') && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setCancelBooking(booking);
                                }}
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

                    {booking.status.toLowerCase() === 'completed' && (
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
            />


            <RescheduleModal
                booking={rescheduleBooking}
                visible={!!rescheduleBooking}
                onClose={() => setRescheduleBooking(null)}
                onConfirm={() => {
                    // Refresh logic if needed
                    setRescheduleBooking(null);
                }}
            />

            <ReviewModal
                booking={reviewBooking}
                visible={!!reviewBooking}
                onClose={() => setReviewBooking(null)}
                onSubmit={(reviewData) => {
                    console.log("Review Submitted:", reviewData);
                    // Here you would send data to backend
                }}
            />

            <CancelModal
                visible={!!cancelBooking}
                onClose={() => setCancelBooking(null)}
                onSubmit={handleCancelBooking}
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
    acceptedCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
    },
    otpContainer: {
        backgroundColor: COLORS.bgSecondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    otpTitle: {
        color: COLORS.textSecondary,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    otpCode: {
        color: COLORS.primary,
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 8,
        marginBottom: 8,
    },
    otpInstruction: {
        color: COLORS.danger,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
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
});
