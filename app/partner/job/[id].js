import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform, Dimensions, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Phone, Navigation, ArrowLeft, Clock, Calendar, CheckCircle, Shield, User, IndianRupee, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import { completeBookingByPartner, checkInBookingByPartner, getPartnerJobs } from '../../../constants/bookingStore';
import JobMap from '../../../components/JobMap';

const { width } = Dimensions.get('window');

export default function JobDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [modalType, setModalType] = useState('complete');
    const [otp, setOtp] = useState('');
    const [hours, setHours] = useState('1');
    const [loading, setLoading] = useState(false);

    const [liveJob, setLiveJob] = useState({
        id: params.id,
        customerName: params.customerName || params.customer,
        phone: params.customerPhone,
        service: params.service,
        address: params.address,
        price: params.price,
        date: params.date,
        time: params.time,
        distance: params.distance,
        latitude: params.latitude ? parseFloat(params.latitude) : 11.2588,
        longitude: params.longitude ? parseFloat(params.longitude) : 75.7804,
        status: params.status || 'accepted',
    });

    useEffect(() => {
        const allJobs = getPartnerJobs();
        const updatedJob = allJobs.find(j => j.id === params.id);
        if (updatedJob) {
            setLiveJob(prev => ({ ...prev, status: updatedJob.status }));
        }
    }, [otpModalVisible]);

    const job = liveJob;

    const statusConfig = {
        open: { label: 'Open', color: COLORS.accent, bg: 'rgba(37,99,235,0.1)' },
        accepted: { label: 'Accepted', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        in_progress: { label: 'In Progress', color: COLORS.accent, bg: 'rgba(37,99,235,0.1)' },
        completed: { label: 'Completed', color: COLORS.success, bg: 'rgba(34,197,94,0.1)' },
    };
    const status = statusConfig[job.status] || statusConfig.open;

    const handleCall = () => {
        if (job.phone) Linking.openURL(`tel:${job.phone}`);
        else Alert.alert("Info", "Phone number not available.");
    };

    const handleDirections = () => {
        const query = encodeURIComponent(job.address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });
        Linking.openURL(url);
    };

    const handleVerifyOtp = () => {
        if (otp.length < 4) { alert("Enter a valid 4-digit OTP."); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (modalType === 'checkin') {
                const result = checkInBookingByPartner(job.id, otp);
                if (result.success) {
                    setOtpModalVisible(false); setOtp('');
                    setLiveJob({ ...job, status: 'in_progress' });
                    Alert.alert("✅ Checked In", "Job status: Work In Progress.");
                } else { alert(result.message || "Invalid Check-In OTP!"); setOtp(''); }
            } else {
                const result = completeBookingByPartner(job.id, otp, parseInt(hours) || 1);
                if (result.success) {
                    setOtpModalVisible(false);
                    Alert.alert("✅ Job Complete", "Customer has been notified for payment.", [
                        { text: "OK", onPress: () => router.replace('/partner') }
                    ]);
                } else { alert(result.message || "Invalid OTP!"); setOtp(''); }
            }
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <View style={[styles.headerStatus, { backgroundColor: status.bg }]}>
                    <Text style={[styles.headerStatusText, { color: status.color }]}>{status.label}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Customer Card */}
                <View style={styles.customerCard}>
                    <View style={styles.customerTop}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {job.customerName ? job.customerName.charAt(0).toUpperCase() : 'C'}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.customerName}>{job.customerName}</Text>
                            <Text style={styles.serviceName}>{job.service}</Text>
                        </View>
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>₹{job.price}</Text>
                        </View>
                    </View>

                    {/* Quick Info Chips */}
                    <View style={styles.chipRow}>
                        <View style={styles.chip}>
                            <Calendar size={13} color={COLORS.textTertiary} />
                            <Text style={styles.chipText}>{job.date || 'Today'}</Text>
                        </View>
                        <View style={styles.chip}>
                            <Clock size={13} color={COLORS.textTertiary} />
                            <Text style={styles.chipText}>{job.time || 'Flexible'}</Text>
                        </View>
                        <View style={styles.chip}>
                            <MapPin size={13} color={COLORS.textTertiary} />
                            <Text style={styles.chipText}>{job.distance}</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionBtns}>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Phone size={18} color={COLORS.accent} />
                            <Text style={styles.callBtnText}>Call Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dirBtn} onPress={handleDirections}>
                            <Navigation size={18} color="#fff" />
                            <Text style={styles.dirBtnText}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Location</Text>
                    <View style={styles.addressCard}>
                        <MapPin size={20} color={COLORS.accent} />
                        <Text style={styles.addressText}>{job.address}</Text>
                    </View>

                    <View style={styles.mapContainer}>
                        {Platform.OS === 'web' ? (
                            <TouchableOpacity style={styles.webMap} onPress={handleDirections}>
                                <MapPin size={32} color={COLORS.accent} />
                                <Text style={styles.webMapText}>Open in Google Maps</Text>
                            </TouchableOpacity>
                        ) : (
                            <JobMap latitude={job.latitude} longitude={job.longitude} />
                        )}
                    </View>
                </View>

                {/* Job Flow Actions */}
                <View style={styles.flowSection}>
                    {(job.status === 'accepted' || job.status === 'open') && (
                        <TouchableOpacity
                            style={[styles.flowBtn, { backgroundColor: COLORS.accent }]}
                            onPress={() => { setModalType('checkin'); setOtpModalVisible(true); }}
                        >
                            <Shield size={20} color="#000" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.flowBtnTitle}>Arrived — Check In</Text>
                                <Text style={styles.flowBtnSub}>Enter the customer's Check-In OTP</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {job.status === 'in_progress' && (
                        <TouchableOpacity
                            style={[styles.flowBtn, { backgroundColor: COLORS.success }]}
                            onPress={() => { setModalType('complete'); setOtpModalVisible(true); }}
                        >
                            <CheckCircle size={20} color="#fff" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.flowBtnTitle, { color: '#fff' }]}>Mark Job Completed</Text>
                                <Text style={[styles.flowBtnSub, { color: 'rgba(255,255,255,0.7)' }]}>Enter hours + Completion OTP</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {job.status === 'completed' && (
                        <View style={[styles.flowBtn, { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)' }]}>
                            <CheckCircle size={20} color={COLORS.success} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.flowBtnTitle, { color: COLORS.success }]}>✅ Completed</Text>
                                <Text style={[styles.flowBtnSub, { color: COLORS.textTertiary }]}>Awaiting customer payment</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* OTP Modal */}
            {otpModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIcon}>
                            {modalType === 'checkin'
                                ? <Shield size={32} color={COLORS.accent} />
                                : <CheckCircle size={32} color={COLORS.success} />
                            }
                        </View>
                        <Text style={styles.modalTitle}>
                            {modalType === 'checkin' ? 'Check-In to Job' : 'Complete Job'}
                        </Text>
                        <Text style={styles.modalText}>
                            {modalType === 'checkin'
                                ? 'Ask the customer for their Check-In OTP to start work.'
                                : 'Enter hours worked and the Completion OTP to finish.'}
                        </Text>

                        {modalType === 'complete' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>HOURS WORKED</Text>
                                <TextInput
                                    style={styles.numberInput}
                                    value={hours}
                                    onChangeText={setHours}
                                    keyboardType="numeric"
                                    placeholder="1"
                                    placeholderTextColor={COLORS.textTertiary}
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {modalType === 'checkin' ? 'CHECK-IN OTP' : 'COMPLETION OTP'}
                            </Text>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, '').slice(0, 4))}
                                keyboardType="numeric"
                                placeholder="0000"
                                maxLength={4}
                                placeholderTextColor={COLORS.textTertiary}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyBtn, loading && { opacity: 0.6 }]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            <Text style={styles.verifyBtnText}>
                                {loading ? 'Verifying...' : modalType === 'checkin' ? 'Verify & Check In' : 'Verify & Complete'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => { setOtpModalVisible(false); setOtp(''); }}
                            disabled={loading}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgPrimary },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
        borderBottomWidth: 1, borderColor: COLORS.border, gap: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, flex: 1 },
    headerStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    headerStatusText: { fontSize: 12, fontWeight: 'bold' },
    content: { padding: SPACING.lg, paddingBottom: 40 },

    // Customer Card
    customerCard: {
        backgroundColor: COLORS.bgSecondary, borderRadius: 16, padding: SPACING.lg,
        marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
    },
    customerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    avatar: {
        width: 48, height: 48, borderRadius: 14,
        backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    customerName: { fontSize: 17, fontWeight: 'bold', color: COLORS.textPrimary },
    serviceName: { fontSize: 13, color: COLORS.textSecondary, marginTop: 1 },
    priceBadge: {
        backgroundColor: 'rgba(34,197,94,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    },
    priceText: { color: COLORS.success, fontWeight: 'bold', fontSize: 16 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    },
    chipText: { color: COLORS.textTertiary, fontSize: 12 },
    actionBtns: { flexDirection: 'row', gap: 10 },
    callBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.accent,
    },
    callBtnText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },
    dirBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 12, borderRadius: 10, backgroundColor: COLORS.accent,
    },
    dirBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    // Location
    section: { marginBottom: SPACING.lg },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.sm },
    addressCard: {
        flexDirection: 'row', gap: 10, backgroundColor: COLORS.bgSecondary,
        padding: SPACING.md, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm,
    },
    addressText: { flex: 1, fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
    mapContainer: {
        height: 180, borderRadius: 14, overflow: 'hidden',
        borderWidth: 1, borderColor: COLORS.border,
    },
    webMap: {
        flex: 1, backgroundColor: COLORS.bgSecondary,
        alignItems: 'center', justifyContent: 'center',
    },
    webMapText: { marginTop: 8, color: COLORS.textSecondary, fontSize: 14 },

    // Flow Actions
    flowSection: { marginTop: SPACING.sm },
    flowBtn: {
        flexDirection: 'row', alignItems: 'center',
        padding: SPACING.lg, borderRadius: 14, marginBottom: SPACING.md,
    },
    flowBtnTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    flowBtnSub: { fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 2 },

    // OTP Modal
    modalOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24,
    },
    modalContent: {
        backgroundColor: COLORS.bgSecondary, width: '100%', maxWidth: 400,
        borderRadius: 20, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
    },
    modalIcon: { marginBottom: SPACING.md },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
    modalText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 20 },
    inputGroup: { width: '100%', marginBottom: SPACING.md },
    inputLabel: {
        color: COLORS.textTertiary, fontSize: 11, fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign: 'center',
    },
    numberInput: {
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, padding: 14, fontSize: 18, fontWeight: 'bold',
        color: COLORS.textPrimary, textAlign: 'center',
    },
    otpInput: {
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, padding: 16, fontSize: 28, fontWeight: 'bold',
        color: COLORS.accent, textAlign: 'center', letterSpacing: 8,
    },
    verifyBtn: {
        backgroundColor: COLORS.success, paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', width: '100%', marginBottom: 12,
    },
    verifyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelBtn: { paddingVertical: 12, alignItems: 'center' },
    cancelBtnText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
});
