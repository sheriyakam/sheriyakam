import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { MapPin, Clock, DollarSign, Calendar, ChevronRight, CheckCircle, MessageSquare, Phone, Navigation, User } from 'lucide-react-native';

import { getCurrentPartner, logoutPartner, togglePartnerAvailability } from '../../constants/partnerStore';

import { getBookings, bookingEvents, acceptBookingByPartner } from '../../constants/bookingStore';

const MOCK_REQUESTS = getBookings();

export default function PartnerDashboard() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my'
    const [myJobs, setMyJobs] = useState([]);
    const [isAvailable, setIsAvailable] = useState(currentPartner?.isAvailable ?? true);

    const handleToggle = () => {
        const newState = togglePartnerAvailability();
        setIsAvailable(newState);
    };

    const refreshData = () => {
        const allBookings = getBookings();

        // Filter Open Jobs logic
        const openJobs = allBookings.filter(job =>
            job.status === 'open' &&
            currentPartner?.serviceTypes?.includes(job.serviceType) &&
            parseFloat(job.distance) <= (currentPartner?.location?.radius || 10)
        );
        setAvailableJobs(openJobs);

        // Filter My Jobs logic
        const myJobsList = allBookings.filter(job =>
            (job.status === 'accepted' || job.status === 'completed') &&
            (job.partnerName === currentPartner?.name) // Ensure we claim the job in store
        );
        setMyJobs(myJobsList);
    };

    const [availableJobs, setAvailableJobs] = useState([]);

    useEffect(() => {
        refreshData();
        bookingEvents.on('change', refreshData);
        return () => bookingEvents.off('change', refreshData);
    }, [currentPartner]);

    if (!currentPartner) {
        // Redirect to login if accessed directly without session (simple protection)
        // In a real app we'd use a layout/context guard
        setTimeout(() => router.replace('/partner/auth'), 0);
        return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    const handleLogout = () => {
        logoutPartner();
        router.replace('/partner/auth');
    };

    const acceptJob = (job) => {
        Alert.alert(
            'Accept Job',
            `Are you sure you want to accept the service for ${job.customerName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        console.log('Accepting job:', job.id);
                        const success = acceptBookingByPartner(job.id, currentPartner.name);
                        if (success) {
                            Alert.alert('Success', 'Job accepted! You can now contact the customer.');
                            // Store event will trigger refreshData
                        } else {
                            Alert.alert('Error', 'Could not accept job. It may have been taken.');
                        }
                    }
                }
            ]
        );
    };

    const openMap = (address) => {
        const query = encodeURIComponent(address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });

        Linking.openURL(url).catch(err => {
            console.error("Error opening map:", err);
            Alert.alert("Error", "Could not open map.");
        });
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.serviceTitle}>{item.service}</Text>
                    <Text style={styles.customerName}>{item.customerName}</Text>
                </View>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <MapPin size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MapPin size={16} color={COLORS.accent} />
                    <Text style={[styles.infoText, { color: COLORS.accent }]}>{item.distance} away</Text>
                </View>
                <View style={styles.infoRow}>
                    <Calendar size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>

                {/* Contact & Navigation for Accepted Jobs */}
                {activeTab !== 'new' && (
                    <View style={styles.contactSection}>
                        <View style={styles.divider} />
                        <View style={styles.contactRow}>
                            <Phone size={18} color={COLORS.primary} />
                            <Text style={styles.contactText}>{item.customerPhone || 'No number'}</Text>
                            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}>
                                <Text style={styles.callBtnText}>Call</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.navBtn} onPress={() => openMap(item.address)}>
                            <Navigation size={16} color="#fff" />
                            <Text style={styles.navBtnText}>Navigate to Location</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {activeTab === 'new' ? (
                <TouchableOpacity style={styles.acceptButton} onPress={() => acceptJob(item)}>
                    <Text style={styles.acceptButtonText}>Accept Job</Text>
                </TouchableOpacity>
            ) : (
                item.status === 'completed' ? (
                    <View style={[styles.statusButton, { backgroundColor: COLORS.success, opacity: 0.8 }]}>
                        <CheckCircle size={16} color="#fff" />
                        <Text style={styles.statusButtonText}>Completed</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => router.push({ pathname: `/partner/job/${item.id}`, params: item })}
                    >
                        <CheckCircle size={16} color="#fff" />
                        <Text style={styles.statusButtonText}>Mark Job Completed</Text>
                    </TouchableOpacity>
                )
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome, {currentPartner?.name || 'Partner'}</Text>
                    <Text style={styles.subGreeting}>
                        {(currentPartner?.serviceTypes || []).join(', ')}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => router.push('/partner/messages')}
                        style={styles.actionBtn}
                    >
                        <MessageSquare size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/partner/profile')}
                        style={styles.actionBtn}
                    >
                        <User size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Availability Toggle Button */}
            <TouchableOpacity
                style={[
                    styles.availabilityBtn,
                    { backgroundColor: isAvailable ? COLORS.success : COLORS.danger }
                ]}
                onPress={handleToggle}
            >
                <Text style={styles.availabilityBtnText}>
                    {isAvailable ? 'I AM AVAILABLE' : 'I AM NOT AVAILABLE'}
                </Text>
            </TouchableOpacity>



            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                    onPress={() => setActiveTab('new')}
                >
                    <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>New Requests</Text>
                    {availableJobs.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{availableJobs.length}</Text></View>}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'my' && styles.activeTab]}
                    onPress={() => setActiveTab('my')}
                >
                    <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Jobs</Text>
                    {myJobs.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{myJobs.length}</Text></View>}
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={activeTab === 'new' ? (isAvailable ? availableJobs : []) : myJobs}
                keyExtractor={item => item.id}
                renderItem={renderJobItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {!isAvailable && activeTab === 'new'
                                ? "You are currently offline. Go online to see requests."
                                : `No ${activeTab === 'new' ? 'new requests' : 'active jobs'} found.`}
                        </Text>
                    </View>
                }
            />
            {/* Floating Chat Button */}
            <TouchableOpacity
                style={styles.fabChat}
                onPress={() => router.push('/partner/messages')}
            >
                <MessageSquare size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subGreeting: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutBtn: {
        padding: 8,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    tab: {
        paddingVertical: SPACING.md,
        marginRight: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.primary,
    },
    badge: {
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    listContent: {
        padding: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    customerName: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    priceTag: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priceText: {
        color: COLORS.success,
        fontWeight: 'bold',
    },
    cardBody: {
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    infoText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    acceptButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusButton: {
        backgroundColor: COLORS.success,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textTertiary,
    },
    availabilityBtn: {
        marginHorizontal: SPACING.lg,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    availabilityBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionBtn: {
        padding: 8,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 8,
    },
    contactSection: {
        marginTop: SPACING.sm,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.sm,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 8,
    },
    contactText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: 'bold',
        flex: 1,
    },
    callBtn: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    callBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.accent,
        padding: 10,
        borderRadius: 8,
        gap: 8,
    },
    navBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fabChat: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
