import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Linking, Platform, Dimensions, TextInput, Alert, Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
    MapPin, Phone, Navigation, ArrowLeft, Clock, Calendar,
    CheckCircle, Shield, User, IndianRupee, Zap, Camera,
    FileText, AlertTriangle, CheckSquare, Square, X, ChevronRight
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import {
    completeBookingByPartner, checkInBookingByPartner,
    markArrivedByPartner, getPartnerJobs
} from '../../../constants/bookingStore';
import JobMap from '../../../components/JobMap';
import { snitch } from '../../../utils/snitch';

export default function JobDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [liveJob, setLiveJob] = useState({
        id: params.id,
        customerName: params.customerName || params.customer || 'Customer',
        phone: params.customerPhone || params.phone || '+91 94471 28901',
        service: params.service || 'Electrical Service',
        address: params.address || 'Goods Shed Road, Thalassery',
        price: parseInt(params.price) || 550,
        date: params.date || 'Today',
        time: params.time || 'Immediate (90-Min Emergency)',
        distance: params.distance || '1.4 km',
        latitude: params.latitude ? parseFloat(params.latitude) : 11.7495,
        longitude: params.longitude ? parseFloat(params.longitude) : 75.4891,
        status: params.status || 'accepted',
        notes: params.notes || 'Emergency repair required',
        checkInOtp: params.checkInOtp || '1234',
        otp: params.otp || '4321',
    });

    // Active Job Flow States
    const [startOtp, setStartOtp] = useState('');
    const [completionOtp, setCompletionOtp] = useState('');
    const [hours, setHours] = useState('1');
    const [materialCost, setMaterialCost] = useState('0');
    const [workNotes, setWorkNotes] = useState('');
    const [beforePhoto, setBeforePhoto] = useState(null);
    const [afterPhoto, setAfterPhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Interactive Checklist
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Mains Switch / MCB Isolated & Verified No Current', checked: false },
        { id: 2, text: 'Root Cause & Circuit Continuity Inspected', checked: false },
        { id: 3, text: 'Wiring / Switchgear / Component Replaced', checked: false },
        { id: 4, text: 'Earth Resistance & Load Voltage Tested Safe', checked: false }
    ]);

    useEffect(() => {
        const allJobs = getPartnerJobs();
        const updated = allJobs.find(j => j.id === params.id);
        if (updated) {
            setLiveJob(prev => ({
                ...prev,
                status: updated.status,
                finalPrice: updated.finalPrice,
                netPartnerPayout: updated.netPartnerPayout
            }));
        }
    }, [params.id]);

    const job = liveJob;

    const toggleChecklist = (id) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

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

    // Stage 1 Action: Mark Arrived
    const handleMarkArrived = () => {
        const success = markArrivedByPartner(job.id);
        if (success) {
            setLiveJob(prev => ({ ...prev, status: 'arrived' }));
            Alert.alert(
                '📍 Status Updated: Arrived',
                'Customer has received a live notification that you are outside at the location.'
            );
        }
    };

    // Stage 2 Action: Verify Start Check-In OTP
    const handleVerifyStartOtp = () => {
        if (startOtp.length < 4) {
            Alert.alert("Validation Error", "Please enter the 4-digit start OTP provided by the customer.");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            const res = checkInBookingByPartner(job.id, startOtp);
            if (res.success) {
                setLiveJob(prev => ({ ...prev, status: 'in_progress' }));
                Alert.alert("✅ Job Started!", "Work is now in progress. Complete task checklist and photos before closing.");
            } else {
                Alert.alert("Error", res.message || "Invalid Check-In OTP. Ask customer to view booking screen (Code: 1234).");
            }
        }, 600);
    };

    // Photo Capture helper
    const pickImage = async (type) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted' && Platform.OS !== 'web') {
                Alert.alert('Permission Needed', 'Camera permission is required to document work.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                if (type === 'before') setBeforePhoto(result.assets[0].uri);
                else setAfterPhoto(result.assets[0].uri);
            }
        } catch (e) {
            // Mock fallback photo for web testing
            const mockUri = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500';
            if (type === 'before') setBeforePhoto(mockUri);
            else setAfterPhoto(mockUri);
        }
    };

    // Stage 4 Action: Complete Job with Second OTP
    const handleCompleteJob = () => {
        if (completionOtp.length < 4) {
            Alert.alert("Validation Error", "Please enter the 4-digit completion OTP to verify satisfactory finish.");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            const extraH = Math.max(0, (parseInt(hours) || 1) - 1);
            const mats = parseInt(materialCost) || 0;
            const res = completeBookingByPartner(
                job.id,
                completionOtp,
                parseInt(hours) || 1,
                mats,
                { checklist, beforePhoto, afterPhoto, workNotes }
            );

            if (res.success) {
                setLiveJob(prev => ({
                    ...prev,
                    status: 'completed',
                    finalPrice: res.booking.finalPrice,
                    netPartnerPayout: res.booking.netPartnerPayout
                }));
                Alert.alert("🎉 Job Completed & Verified!", "Invoice summary has been generated for customer payment.");
            } else {
                Alert.alert("Error", res.message || "Invalid Completion OTP. Customer code: 1234");
            }
        }, 700);
    };

    // Calculations
    const extraHoursCount = Math.max(0, (parseInt(hours) || 1) - 1);
    const materialCostNum = parseInt(materialCost) || 0;
    const currentTotalBill = (job.price || 0) + (extraHoursCount * 100) + materialCostNum;
    const platformDeduction = Math.round(currentTotalBill * 0.10);
    const partnerNetEarning = currentTotalBill - platformDeduction;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Job Execution Flow</Text>
                    <Text style={styles.headerSub}>ID #{job.id} • KSELB Protocol</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    {
                        backgroundColor: job.status === 'completed'
                            ? 'rgba(34,197,94,0.2)'
                            : job.status === 'in_progress'
                                ? 'rgba(234,179,8,0.2)'
                                : 'rgba(59,130,246,0.2)'
                    }
                ]}>
                    <Text style={[
                        styles.statusBadgeText,
                        {
                            color: job.status === 'completed'
                                ? COLORS.success
                                : job.status === 'in_progress'
                                    ? COLORS.gold
                                    : '#60A5FA'
                        }
                    ]}>
                        {job.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* 4-Stage Progressive Workflow Indicator */}
                <View style={styles.stepperContainer}>
                    <View style={styles.stepperRow}>
                        <View style={[styles.stepItem, styles.stepActive]}>
                            <View style={[styles.stepCircle, { backgroundColor: COLORS.accent }]}>
                                <Text style={styles.stepNum}>1</Text>
                            </View>
                            <Text style={styles.stepLabel}>En Route</Text>
                        </View>
                        <View style={[styles.stepLine, (job.status !== 'accepted') && { backgroundColor: COLORS.accent }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: (['arrived', 'in_progress', 'completed'].includes(job.status)) ? COLORS.accent : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>2</Text>
                            </View>
                            <Text style={styles.stepLabel}>Start OTP</Text>
                        </View>
                        <View style={[styles.stepLine, (['in_progress', 'completed'].includes(job.status)) && { backgroundColor: COLORS.accent }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: (['in_progress', 'completed'].includes(job.status)) ? COLORS.accent : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>3</Text>
                            </View>
                            <Text style={styles.stepLabel}>Evidence</Text>
                        </View>
                        <View style={[styles.stepLine, (job.status === 'completed') && { backgroundColor: COLORS.success }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: job.status === 'completed' ? COLORS.success : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>4</Text>
                            </View>
                            <Text style={styles.stepLabel}>Invoice</Text>
                        </View>
                    </View>
                </View>

                {/* Customer Location & Contact Card */}
                <View style={styles.customerCard}>
                    <View style={styles.customerTop}>
                        <View style={styles.customerAvatar}>
                            <User size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.customerName}>{job.customerName}</Text>
                            <Text style={styles.serviceName}>{job.service}</Text>
                        </View>
                        <View style={styles.fareTag}>
                            <Text style={styles.fareTagText}>₹{job.price}</Text>
                        </View>
                    </View>

                    <View style={styles.addressBox}>
                        <MapPin size={16} color={COLORS.accent} />
                        <Text style={styles.addressText}>{job.address}</Text>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Phone size={16} color={COLORS.accent} />
                            <Text style={styles.callBtnText}>Call Customer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navBtn} onPress={handleDirections}>
                            <Navigation size={16} color="#fff" />
                            <Text style={styles.navBtnText}>Navigate (Maps)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STAGE 1: EN ROUTE / MARK ARRIVED */}
                {job.status === 'accepted' && (
                    <View style={styles.stageCard}>
                        <View style={styles.stageCardHeader}>
                            <MapPin size={20} color="#60A5FA" />
                            <Text style={styles.stageTitle}>Step 1: Heading to Customer Location</Text>
                        </View>
                        <Text style={styles.stageDescription}>
                            Once you arrive at the gate/door, tap below to notify the customer and prepare for safety verification.
                        </Text>
                        <TouchableOpacity style={styles.primaryActionBtn} onPress={handleMarkArrived}>
                            <MapPin size={18} color="#fff" />
                            <Text style={styles.primaryActionBtnText}>I Have Arrived at Location</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STAGE 2: START JOB OTP VERIFICATION */}
                {job.status === 'arrived' && (
                    <View style={[styles.stageCard, { borderColor: COLORS.gold }]}>
                        <View style={styles.stageCardHeader}>
                            <Shield size={20} color={COLORS.gold} />
                            <Text style={styles.stageTitle}>Step 2: Customer Check-In OTP</Text>
                        </View>
                        <Text style={styles.stageDescription}>
                            Ask the customer for their 4-digit Safety Start OTP (displayed on their Sheriyakam booking screen).
                        </Text>
                        <TextInput
                            style={styles.otpInputBox}
                            placeholder="Enter 4-Digit Start OTP"
                            placeholderTextColor={COLORS.textTertiary}
                            value={startOtp}
                            onChangeText={t => setStartOtp(t.replace(/[^0-9]/g, '').slice(0, 4))}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.gold }]}
                            onPress={handleVerifyStartOtp}
                            disabled={isSubmitting}
                        >
                            <Zap size={18} color="#000" />
                            <Text style={[styles.primaryActionBtnText, { color: '#000' }]}>
                                {isSubmitting ? 'Verifying...' : 'Verify OTP & Start Work'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STAGE 3: WORK EXECUTION & EVIDENCE (CHECKLIST, PHOTOS, EXTRA CHARGES) */}
                {job.status === 'in_progress' && (
                    <View style={styles.stageCard}>
                        <View style={styles.stageCardHeader}>
                            <FileText size={20} color={COLORS.accent} />
                            <Text style={styles.stageTitle}>Step 3: Work Execution & Evidence</Text>
                        </View>

                        {/* Checklist */}
                        <Text style={styles.subSectionTitle}>KSELB SAFETY CHECKLIST</Text>
                        {checklist.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.checkItemRow}
                                onPress={() => toggleChecklist(item.id)}
                            >
                                {item.checked ? (
                                    <CheckSquare size={20} color={COLORS.success} />
                                ) : (
                                    <Square size={20} color={COLORS.textTertiary} />
                                )}
                                <Text style={[styles.checkItemText, item.checked && { color: COLORS.textPrimary }]}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Before & After Photo Uploads */}
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>WORK PHOTO VERIFICATION</Text>
                        <View style={styles.photoGrid}>
                            <View style={styles.photoBox}>
                                <Text style={styles.photoLabel}>Before Work</Text>
                                {beforePhoto ? (
                                    <View style={styles.photoPreviewWrapper}>
                                        <Image source={{ uri: beforePhoto }} style={styles.photoPreview} />
                                        <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => setBeforePhoto(null)}>
                                            <X size={14} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.photoUploadBtn} onPress={() => pickImage('before')}>
                                        <Camera size={22} color={COLORS.textTertiary} />
                                        <Text style={styles.photoUploadText}>Capture Before</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.photoBox}>
                                <Text style={styles.photoLabel}>After Work</Text>
                                {afterPhoto ? (
                                    <View style={styles.photoPreviewWrapper}>
                                        <Image source={{ uri: afterPhoto }} style={styles.photoPreview} />
                                        <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => setAfterPhoto(null)}>
                                            <X size={14} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.photoUploadBtn} onPress={() => pickImage('after')}>
                                        <Camera size={22} color={COLORS.textTertiary} />
                                        <Text style={styles.photoUploadText}>Capture After</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Extra Time & Materials Adjuster */}
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>ADDITIONAL CHARGES & MATERIALS</Text>
                        <View style={styles.inputFieldRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Total Hours (Base covers 1 hr)</Text>
                                <TextInput
                                    style={styles.numericInput}
                                    value={hours}
                                    onChangeText={setHours}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Material Cost (₹)</Text>
                                <TextInput
                                    style={styles.numericInput}
                                    value={materialCost}
                                    onChangeText={t => setMaterialCost(t.replace(/[^0-9]/g, ''))}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Live Invoice Preview */}
                        <View style={styles.invoicePreviewCard}>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Base Service Fare</Text>
                                <Text style={styles.invoiceValue}>₹{job.price}</Text>
                            </View>
                            {extraHoursCount > 0 && (
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Extra Hours ({extraHoursCount} × ₹100)</Text>
                                    <Text style={styles.invoiceValue}>+₹{extraHoursCount * 100}</Text>
                                </View>
                            )}
                            {materialCostNum > 0 && (
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Materials Cost</Text>
                                    <Text style={styles.invoiceValue}>+₹{materialCostNum}</Text>
                                </View>
                            )}
                            <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                                <Text style={styles.invoiceTotalLabel}>Customer Total Bill</Text>
                                <Text style={styles.invoiceTotalValue}>₹{currentTotalBill}</Text>
                            </View>
                            <View style={styles.invoiceRow}>
                                <Text style={{ color: COLORS.textTertiary, fontSize: 11 }}>Platform Fee (10%)</Text>
                                <Text style={{ color: COLORS.textTertiary, fontSize: 11 }}>-₹{platformDeduction}</Text>
                            </View>
                            <View style={[styles.invoiceRow, { paddingTop: 4 }]}>
                                <Text style={{ color: COLORS.success, fontWeight: '800', fontSize: 13 }}>Your Net Payout</Text>
                                <Text style={{ color: COLORS.success, fontWeight: '900', fontSize: 16 }}>₹{partnerNetEarning}</Text>
                            </View>
                        </View>

                        {/* Completion OTP */}
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>CLOSEOUT VERIFICATION</Text>
                        <TextInput
                            style={styles.otpInputBox}
                            placeholder="Enter 4-Digit Completion OTP"
                            placeholderTextColor={COLORS.textTertiary}
                            value={completionOtp}
                            onChangeText={t => setCompletionOtp(t.replace(/[^0-9]/g, '').slice(0, 4))}
                            keyboardType="numeric"
                            maxLength={4}
                        />

                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.success }]}
                            onPress={handleCompleteJob}
                            disabled={isSubmitting}
                        >
                            <CheckCircle size={18} color="#fff" />
                            <Text style={styles.primaryActionBtnText}>
                                {isSubmitting ? 'Finalizing...' : 'Submit & Close Job'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STAGE 4: COMPLETED INVOICE RECEIPT */}
                {job.status === 'completed' && (
                    <View style={[styles.stageCard, { borderColor: COLORS.success }]}>
                        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                            <CheckCircle size={48} color={COLORS.success} />
                            <Text style={styles.completedHeaderTitle}>Job Successfully Completed</Text>
                            <Text style={styles.completedHeaderSub}>Customer has been billed. Payment status: PENDING SETTLEMENT</Text>
                        </View>

                        <View style={styles.invoicePreviewCard}>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Total Billed to Customer</Text>
                                <Text style={[styles.invoiceValue, { fontWeight: '900' }]}>₹{job.finalPrice || currentTotalBill}</Text>
                            </View>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Platform Commission (10%)</Text>
                                <Text style={styles.invoiceValue}>-₹{Math.round((job.finalPrice || currentTotalBill) * 0.10)}</Text>
                            </View>
                            <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                                <Text style={styles.invoiceTotalLabel}>Net Credited to Partner Wallet</Text>
                                <Text style={[styles.invoiceTotalValue, { color: COLORS.success }]}>
                                    ₹{job.netPartnerPayout || Math.round((job.finalPrice || currentTotalBill) * 0.90)}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.bgTertiary }]}
                            onPress={() => router.push('/partner')}
                        >
                            <Text style={styles.primaryActionBtnText}>Return to Dashboard</Text>
                        </TouchableOpacity>
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        gap: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    headerSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },

    /* Stepper */
    stepperContainer: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    stepNum: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 11,
    },
    stepLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: '600',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 4,
        marginBottom: 14,
    },

    /* Customer Card */
    customerCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    customerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    customerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    serviceName: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    fareTag: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    fareTagText: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 16,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 10,
        marginBottom: 14,
    },
    addressText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    callBtnText: {
        color: COLORS.accent,
        fontWeight: '700',
        fontSize: 13,
    },
    navBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#2563EB',
    },
    navBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    /* Stage Cards */
    stageCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    stageCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    stageTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 15,
    },
    stageDescription: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 16,
    },
    primaryActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    primaryActionBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    otpInputBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: 12,
    },

    /* Evidence Subsections */
    subSectionTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 10,
    },
    checkItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
    },
    checkItemText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        flex: 1,
    },
    photoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    photoBox: {
        flex: 1,
    },
    photoLabel: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginBottom: 6,
        fontWeight: '600',
    },
    photoUploadBtn: {
        height: 100,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    photoUploadText: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '600',
    },
    photoPreviewWrapper: {
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
    },
    photoRemoveBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputFieldRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },
    inputFieldLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginBottom: 4,
    },
    numericInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 14,
    },
    invoicePreviewCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 14,
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    invoiceLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    invoiceValue: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '700',
    },
    invoiceTotalRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 8,
        marginTop: 4,
    },
    invoiceTotalLabel: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
    },
    invoiceTotalValue: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 16,
    },
    completedHeaderTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 18,
        marginTop: 8,
    },
    completedHeaderSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 18,
    },
});
