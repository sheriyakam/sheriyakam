import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform, Dimensions, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Phone, Navigation, ArrowLeft, Clock, Calendar, CheckCircle, Smartphone } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function JobDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    // Parse params if they are passed as strings or individual fields
    // In a real app, we might fetch job by params.id from a store/API
    const job = {
        id: params.id,
        customer: params.customer,
        service: params.service,
        address: params.address,
        price: params.price,
        date: params.date,
        distance: params.distance,
        // Mock coordinates for map (Calicut center approx + random offset if we had real data)
        // For now, let's just use a fixed location or derived if possible.
        // Let's use Calicut coordinates as base
        latitude: 11.2588,
        longitude: 75.7804,
        otp: '1234' // Mock OTP for this job
    };

    const handleCall = () => {
        Linking.openURL(`tel:+919876543210`);
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
        if (otp.length < 4) {
            alert("Please enter a valid 4-digit OTP");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Verify against job OTP (mocked as 1234 for now if not passed) or checking the one we added to job object
            if (otp === '1234') {
                setOtpModalVisible(false);
                alert("Job Marked as Completed!");
                router.replace('/partner/dashboard');
            } else {
                alert("Invalid OTP! Ask customer for the code.");
                setOtp('');
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
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Customer Info Card */}
                <View style={styles.card}>
                    <View style={styles.customerHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{job.customer?.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.customerName}>{job.customer}</Text>
                            <Text style={styles.serviceName}>{job.service}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Accepted</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Clock size={16} color={COLORS.textSecondary} />
                        <Text style={styles.detailText}>{job.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MapPin size={16} color={COLORS.textSecondary} />
                        <Text style={styles.detailText}>{job.distance} away</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Phone size={20} color={COLORS.primary} />
                            <Text style={styles.callBtnText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.directionBtn} onPress={handleDirections}>
                            <Navigation size={20} color="#fff" />
                            <Text style={styles.directionBtnText}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Location</Text>
                    <View style={styles.addressCard}>
                        <MapPin size={24} color={COLORS.accent} style={{ marginTop: 2 }} />
                        <Text style={styles.addressText}>{job.address}</Text>
                    </View>
                </View>

                {/* Map View */}
                {Platform.OS !== 'web' ? (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_DEFAULT}
                            initialRegion={{
                                latitude: job.latitude,
                                longitude: job.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{ latitude: job.latitude, longitude: job.longitude }}
                                title={job.customer}
                                description={job.service}
                            />
                        </MapView>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.webMapPlaceholder} onPress={handleDirections}>
                        <Text style={{ color: COLORS.accent }}>Open in Google Maps</Text>
                    </TouchableOpacity>
                )}

                {/* Job Completion Actions */}
                <View style={styles.footerActions}>
                    <TouchableOpacity style={styles.completeBtn} onPress={() => setOtpModalVisible(true)}>
                        <CheckCircle size={20} color="#fff" />
                        <Text style={styles.completeBtnText}>Mark Job Completed</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* OTP Modal */}
            {otpModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Complete Job</Text>
                        <Text style={styles.modalText}>
                            Ask the customer for the OTP to confirm job completion.
                        </Text>

                        <View style={styles.otpInputContainer}>
                            <Text style={styles.otpLabel}>Enter 4-Digit OTP</Text>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={(text) => {
                                    if (text.length <= 4) setOtp(text.replace(/[^0-9]/g, ''));
                                }}
                                keyboardType="numeric"
                                maxLength={4}
                                placeholder="0000"
                                placeholderTextColor={COLORS.textTertiary}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyBtn, loading && { opacity: 0.7 }]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            <Text style={styles.verifyBtnText}>
                                {loading ? 'Verifying...' : 'Verify & Complete'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelModalBtn}
                            onPress={() => setOtpModalVisible(false)}
                            disabled={loading}
                        >
                            <Text style={styles.cancelModalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    serviceName: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        marginLeft: 'auto',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: SPACING.md,
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: 'transparent',
    },
    callBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    directionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    directionBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    addressCard: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addressText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        lineHeight: 24,
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    webMapPlaceholder: {
        height: 150,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: SPACING.xl,
    },
    footerActions: {
        marginTop: SPACING.md,
    },
    completeBtn: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: COLORS.bgSecondary,
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    otpInputContainer: {
        marginBottom: 24,
    },
    otpLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    otpInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 8,
    },
    verifyBtn: {
        backgroundColor: COLORS.success,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    verifyBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelModalBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelModalText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
});
