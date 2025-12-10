import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch, ActivityIndicator, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { MapPin, Clock, DollarSign, Calendar, ChevronRight, CheckCircle, MessageSquare, Award } from 'lucide-react-native';

import { getCurrentPartner, logoutPartner, togglePartnerAvailability, getSupervisorForPartner, getCommunityMuteStatus } from '../../constants/partnerStore';
import ChatWidget from '../../components/ChatWidget';
import NotificationPopup from '../../components/NotificationPopup';

const MOCK_REQUESTS = [
    // Electrician Jobs
    {
        id: 'req1',
        customer: 'Alice Smith',
        service: 'Emergency Repair',
        serviceType: 'Electrician',
        address: 'Calicut Beach Road, Kozhikode',
        distance: '1.2 km',
        price: '₹500',
        date: 'Today, 2:00 PM',
        status: 'open'
    },
    {
        id: 'req2',
        customer: 'Bob Brown',
        service: 'Fan Installation',
        serviceType: 'Electrician',
        address: 'Mavoor Road, Kozhikode',
        distance: '3.5 km',
        price: '₹350',
        date: 'Tomorrow, 10:00 AM',
        status: 'open'
    },
    {
        id: 'req3',
        customer: 'City Cafe',
        service: 'Wiring Check',
        serviceType: 'Electrician',
        address: 'Mananchira, Kozhikode',
        distance: '0.8 km',
        price: '₹800',
        date: 'Today, 4:30 PM',
        status: 'open'
    },
    {
        id: 'req4',
        customer: 'Villa 42',
        service: 'Switch Replacement',
        serviceType: 'Electrician',
        address: 'Chevayur, Kozhikode',
        distance: '4.2 km',
        price: '₹250',
        date: 'Today, 6:00 PM',
        status: 'open'
    },

    // AC Jobs
    {
        id: 'ac1',
        customer: 'David Green',
        service: 'AC Cleaning',
        serviceType: 'AC',
        address: 'Thondayad, Kozhikode',
        distance: '2.0 km',
        price: '₹1200',
        date: 'Today, 5:00 PM',
        status: 'open'
    },
    {
        id: 'ac2',
        customer: 'Tech Park',
        service: 'AC Gas Filling',
        serviceType: 'AC',
        address: 'Cyber Park, Kozhikode',
        distance: '8.5 km',
        price: '₹2500',
        date: 'Tomorrow, 11:00 AM',
        status: 'open'
    },

    // Inverter Jobs
    {
        id: 'inv1',
        customer: 'Sarah White',
        service: 'Inverter Battery Check',
        serviceType: 'Inverter',
        address: 'Feroke, Kozhikode',
        distance: '12 km',
        price: '₹400',
        date: 'Today, 3:00 PM',
        status: 'open'
    },
    {
        id: 'inv2',
        customer: 'Grand Residence',
        service: 'New Inverter Setup',
        serviceType: 'Inverter',
        address: 'Medical College, Kozhikode',
        distance: '5.5 km',
        price: '₹8000',
        date: 'Tomorrow, 9:30 AM',
        status: 'open'
    },

    // CCTV Jobs
    {
        id: 'cctv1',
        customer: 'Office Complex',
        service: 'CCTV Installation',
        serviceType: 'CCTV',
        address: 'Hilite City, Kozhikode',
        distance: '5.0 km',
        price: '₹5000',
        date: 'Tomorrow, 9:00 AM',
        status: 'open'
    },
    {
        id: 'cctv2',
        customer: 'Metro Store',
        service: 'Camera Signal Loss',
        serviceType: 'CCTV',
        address: 'SM Street, Kozhikode',
        distance: '1.0 km',
        price: '₹600',
        date: 'Today, 1:00 PM',
        status: 'open'
    },

    // Home Automation Jobs
    {
        id: 'auto1',
        customer: 'Luxury Villa',
        service: 'Smart Switch Setup',
        serviceType: 'Home Automation',
        address: 'Bypass Road, Kozhikode',
        distance: '6.5 km',
        price: '₹1500',
        date: 'Sat, 10:00 AM',
        status: 'open'
    },
    {
        id: 'auto2',
        customer: 'Mr. Rahul',
        service: 'Gate Automation Fix',
        serviceType: 'Home Automation',
        address: 'Palazhi, Kozhikode',
        distance: '7.0 km',
        price: '₹2000',
        date: 'Sun, 2:00 PM',
        status: 'open'
    }
];

import {
    getOpenRequests,
    getPartnerJobs,
    acceptBookingByPartner,
    completeBookingByPartner,
    bookingEvents
} from '../../constants/bookingStore';

// ... (other imports)

export default function PartnerDashboard() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const [activeTab, setActiveTab] = useState('new');
    const [availableJobs, setAvailableJobs] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [isAvailable, setIsAvailable] = useState(currentPartner?.isAvailable ?? true);

    // OTP Modal State
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(false);

    // ... (notification logic remains same)

    const loadJobs = () => {
        setAvailableJobs(getOpenRequests());
        setMyJobs(getPartnerJobs());
    };

    React.useEffect(() => {
        loadJobs();
        bookingEvents.on('change', loadJobs);
        return () => bookingEvents.off('change', loadJobs);
    }, []);

    // ... (handleToggle etc)

    const acceptJob = (job) => {
        const confirmAccept = () => {
            const success = acceptBookingByPartner(job.id, currentPartner?.name);
            if (success) {
                Alert.alert('Success', 'Job accepted! You can now contact the customer.');
                // Auto switch to my jobs
                setActiveTab('my');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Accept job for ${job.customerName}?`)) confirmAccept();
        } else {
            Alert.alert(
                'Accept Job',
                `Accept service for ${job.customerName}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Accept', onPress: confirmAccept }
                ]
            );
        }
    };

    const handleCompletePress = (job) => {
        setSelectedJob(job);
        setOtpInput('');
        setOtpModalVisible(true);
    };

    const submitOtp = () => {
        if (!otpInput || otpInput.length !== 4) {
            Alert.alert('Error', 'Please enter 4-digit OTP');
            return;
        }

        const result = completeBookingByPartner(selectedJob.id, otpInput);
        if (result.success) {
            setOtpModalVisible(false);
            Alert.alert('Success', 'Job marked as COMPLETED!');
        } else {
            Alert.alert('Verification Failed', 'Incorrect OTP. Please ask the customer for the correct code.');
        }
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.serviceTitle}>{item.service}</Text>
                    <Text style={styles.customerName}>{item.customerName || item.customer}</Text>
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
            </View>

            {item.status === 'open' ? (
                <TouchableOpacity style={styles.acceptButton} onPress={() => acceptJob(item)}>
                    <Text style={styles.acceptButtonText}>Accept Job</Text>
                </TouchableOpacity>
            ) : item.status === 'accepted' ? (
                <TouchableOpacity style={styles.completeButton} onPress={() => handleCompletePress(item)}>
                    <CheckCircle size={16} color="#fff" />
                    <Text style={styles.completeButtonText}>Complete Service</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.completedBadge}>
                    <CheckCircle size={16} color={COLORS.success} />
                    <Text style={styles.completedText}>Completed</Text>
                </View>
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
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Text style={{ color: COLORS.danger }}>Logout</Text>
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
            {/* Notification Popup */}
            <NotificationPopup
                visible={notification.visible}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                onPress={handleNotificationPress}
                onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
            />

            <ChatWidget />

            {/* OTP Modal */}
            <Modal
                visible={otpModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Complete Service</Text>
                        <Text style={styles.modalSubtitle}>Enter the OTP provided by the customer to verify service completion.</Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="Ex: 1234"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            maxLength={4}
                            value={otpInput}
                            onChangeText={setOtpInput}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: COLORS.bgSecondary }]}
                                onPress={() => setOtpModalVisible(false)}
                            >
                                <Text style={{ color: COLORS.textSecondary }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: COLORS.success }]}
                                onPress={submitOtp}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Verify & Complete</Text>
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
    certificateCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        backgroundColor: '#FFFBE6', // Light gold/yellow background
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#D4AF37', // Gold border
    },
    certificateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    certificateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
    },
    certificateBody: {
        alignItems: 'center',
    },
    certificateText: {
        color: '#856404',
        textAlign: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    scoreText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    completeButton: {
        backgroundColor: COLORS.success,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.success,
    },
    completedText: {
        color: COLORS.success,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.bgPrimary,
        width: '100%',
        maxWidth: 340,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    otpInput: {
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        textAlign: 'center',
        color: COLORS.textPrimary,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
