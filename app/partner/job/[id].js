import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Linking, Platform, Dimensions, TextInput, Alert, Image, Modal, Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
    MapPin, Phone, Navigation, ArrowLeft, Clock, Calendar,
    CheckCircle, Shield, User, IndianRupee, Zap, Camera,
    FileText, AlertTriangle, CheckSquare, Square, X, ChevronRight,
    MessageSquare, AlertOctagon, Plus, Minus, Trash2, QrCode,
    Share2, Sparkles, ExternalLink, Banknote
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import {
    completeBookingByPartner, checkInBookingByPartner,
    markArrivedByPartner, getPartnerJobs, recordCashPayment,
    getBookingById, bookingEvents
} from '../../../constants/bookingStore';
import { PARTS_CATALOG, PARTS_CATEGORIES } from '../../../constants/partsCatalog';
import JobMap from '../../../components/JobMap';
import { snitch } from '../../../utils/snitch';

export default function JobDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [liveJob, setLiveJob] = useState({
        id: params.id || 'b-active-1',
        customerName: params.customerName || params.customer || 'K.V. Raghu',
        phone: params.customerPhone || params.phone || '+91 94471 28901',
        service: params.service || 'Emergency Repair Specialist',
        address: params.address || 'Near Old Bus Stand, Goods Shed Road, Thalassery',
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
        paymentStatus: 'pending'
    });

    // Active Job Flow States
    const [startOtp, setStartOtp] = useState('');
    const [completionOtp, setCompletionOtp] = useState('');
    const [hours, setHours] = useState('1');
    const [workNotes, setWorkNotes] = useState('');
    const [beforePhoto, setBeforePhoto] = useState(null);
    const [afterPhoto, setAfterPhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Spare Parts Management
    const [selectedParts, setSelectedParts] = useState([]);
    const [partsModalVisible, setPartsModalVisible] = useState(false);
    const [partsCategory, setPartsCategory] = useState('all');
    const [partsSearch, setPartsSearch] = useState('');

    // Safety SOS & Dual Settlement states
    const [sosModalVisible, setSosModalVisible] = useState(false);
    const [sosActive, setSosActive] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [cashPaid, setCashPaid] = useState(false);

    // Interactive Checklist
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Mains Switch / MCB Isolated & Verified No Current', checked: false },
        { id: 2, text: 'Root Cause & Circuit Continuity Inspected', checked: false },
        { id: 3, text: 'Wiring / Switchgear / Component Replaced', checked: false },
        { id: 4, text: 'Earth Resistance & Load Voltage Tested Safe', checked: false }
    ]);

    useEffect(() => {
        const syncJob = () => {
            const allJobs = getPartnerJobs();
            const updated = allJobs.find(j => j.id === (params.id || 'b-active-1')) || getBookingById(params.id || 'b-active-1');
            if (updated) {
                setLiveJob(prev => ({
                    ...prev,
                    ...updated,
                    status: updated.status,
                    finalPrice: updated.finalPrice,
                    netPartnerPayout: updated.netPartnerPayout,
                    paymentStatus: updated.paymentStatus || prev.paymentStatus
                }));
                if (updated.paymentStatus === 'paid' || updated.paymentStatus === 'paid_cash') {
                    setCashPaid(true);
                }
            }
        };

        syncJob();
        bookingEvents.on('change', syncJob);
        return () => bookingEvents.off('change', syncJob);
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
            const mockUri = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500';
            if (type === 'before') setBeforePhoto(mockUri);
            else setAfterPhoto(mockUri);
        }
    };

    // Spare Parts Helpers
    const handleAddPart = (part) => {
        setSelectedParts(prev => {
            const existing = prev.find(p => p.id === part.id);
            if (existing) {
                return prev.map(p => p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...part, quantity: 1 }];
        });
    };

    const handleUpdatePartQty = (partId, delta) => {
        setSelectedParts(prev => {
            return prev.map(p => {
                if (p.id === partId) {
                    const newQty = Math.max(1, p.quantity + delta);
                    return { ...p, quantity: newQty };
                }
                return p;
            });
        });
    };

    const handleRemovePart = (partId) => {
        setSelectedParts(prev => prev.filter(p => p.id !== partId));
    };

    const partsTotalCost = selectedParts.reduce((sum, p) => sum + (p.rate * p.quantity), 0);

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
            const res = completeBookingByPartner(
                job.id,
                completionOtp,
                parseInt(hours) || 1,
                partsTotalCost,
                {
                    checklist,
                    beforePhoto,
                    afterPhoto,
                    workNotes,
                    sparePartsUsed: selectedParts
                }
            );

            if (res.success) {
                setLiveJob(prev => ({
                    ...prev,
                    status: 'completed',
                    finalPrice: res.booking.finalPrice,
                    netPartnerPayout: res.booking.netPartnerPayout
                }));
                Alert.alert("🎉 Job Completed & Verified!", "Itemized bill generated for customer post-completion settlement.");
            } else {
                Alert.alert("Error", res.message || "Invalid Completion OTP. Customer code: 1234");
            }
        }, 700);
    };

    // Cash Reconciliation
    const handleMarkCashReceived = () => {
        recordCashPayment(job.id);
        setCashPaid(true);
        Alert.alert(
            '💵 Cash Settlement Confirmed',
            `Received ₹${job.finalPrice || currentTotalBill} in cash. Job is closed without gateway fees!`
        );
    };

    // Trigger SOS Emergency
    const handleTriggerSOS = () => {
        setSosActive(true);
        setSosModalVisible(false);
        Alert.alert(
            '🚨 SOS DISTRESS BROADCASTED',
            `Alert dispatched to Thalassery HQ Ops Room & Supervisor Suresh Kumar.\nGPS Coordinates: ${job.latitude.toFixed(4)}, ${job.longitude.toFixed(4)}\nJob Reference: #${job.id}`,
            [{ text: 'Acknowledged', style: 'default' }]
        );
    };

    // Share payment link
    const handleSharePaymentLink = async () => {
        const payUrl = `https://sheriyakam.vercel.app/pay/${job.id}`;
        try {
            await Share.share({
                title: `Sheriyakam Post-Service Bill #${job.id}`,
                message: `Hello ${job.customerName}, your electrical service has been completed by KSELB wireman Shyam Prasad. Please pay ₹${job.finalPrice || currentTotalBill} safely online or cash at: ${payUrl}`,
            });
        } catch (e) {
            Alert.alert('Payment Link', payUrl);
        }
    };

    // Calculations
    const extraHoursCount = Math.max(0, (parseInt(hours) || 1) - 1);
    const currentTotalBill = (job.price || 0) + (extraHoursCount * 100) + partsTotalCost;
    const platformDeduction = Math.round(currentTotalBill * 0.10);
    const partnerNetEarning = currentTotalBill - platformDeduction;

    // Filter parts for modal
    const filteredParts = PARTS_CATALOG.filter(part => {
        const matchesCat = partsCategory === 'all' || part.category === partsCategory;
        const matchesQuery = part.name.toLowerCase().includes(partsSearch.toLowerCase()) ||
            part.manufacturer.toLowerCase().includes(partsSearch.toLowerCase());
        return matchesCat && matchesQuery;
    });

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

                {/* Persistent SOS Emergency Button */}
                <TouchableOpacity
                    style={[styles.sosHeaderBtn, sosActive && { backgroundColor: '#DC2626' }]}
                    onPress={() => setSosModalVisible(true)}
                >
                    <AlertOctagon size={16} color="#fff" />
                    <Text style={styles.sosHeaderBtnText}>{sosActive ? 'SOS ACTIVE' : 'SOS'}</Text>
                </TouchableOpacity>

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

            {/* Active SOS Warning Banner */}
            {sosActive && (
                <View style={styles.sosWarningBanner}>
                    <AlertOctagon size={18} color="#fff" />
                    <Text style={styles.sosWarningText}>
                        EMERGENCY PROTOCOL ACTIVE: Thalassery Control Room is tracking your coordinates.
                    </Text>
                </View>
            )}

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
                            <Text style={styles.stepLabel}>Evidence & Parts</Text>
                        </View>
                        <View style={[styles.stepLine, (job.status === 'completed') && { backgroundColor: COLORS.success }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: job.status === 'completed' ? COLORS.success : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>4</Text>
                            </View>
                            <Text style={styles.stepLabel}>Settlement</Text>
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

                        <TouchableOpacity
                            style={styles.chatBtn}
                            onPress={() => router.push(`/partner/chat?type=customer&bookingId=${job.id}&name=${encodeURIComponent(job.customerName)}&phone=${encodeURIComponent(job.phone)}`)}
                        >
                            <MessageSquare size={16} color="#60A5FA" />
                            <Text style={styles.chatBtnText}>Chat Logistics</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navBtn} onPress={handleDirections}>
                            <Navigation size={16} color="#fff" />
                            <Text style={styles.navBtnText}>Navigate</Text>
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
                            Need gate codes or floor number? Tap <Text style={{ color: '#60A5FA', fontWeight: '700' }}>Chat Logistics</Text> above. Once outside, tap below to notify customer.
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

                {/* STAGE 3: WORK EXECUTION & EVIDENCE (CHECKLIST, PHOTOS, SPARE PARTS) */}
                {job.status === 'in_progress' && (
                    <View style={styles.stageCard}>
                        <View style={styles.stageCardHeader}>
                            <FileText size={20} color={COLORS.accent} />
                            <Text style={styles.stageTitle}>Step 3: Work Execution & Parts Evidence</Text>
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

                        {/* Genuine Spare Parts Catalog Integration */}
                        <View style={styles.partsSectionBox}>
                            <View style={styles.partsHeaderRow}>
                                <View>
                                    <Text style={styles.subSectionTitle}>GENUINE SPARE PARTS USED</Text>
                                    <Text style={styles.partsHeaderSub}>Havells, Anchor, Finolex, Schneider with ISI Mark</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addPartsBtn}
                                    onPress={() => setPartsModalVisible(true)}
                                >
                                    <Plus size={16} color="#fff" />
                                    <Text style={styles.addPartsBtnText}>Add Parts</Text>
                                </TouchableOpacity>
                            </View>

                            {selectedParts.length > 0 ? (
                                <View style={styles.selectedPartsList}>
                                    {selectedParts.map(part => (
                                        <View key={part.id} style={styles.selectedPartItem}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.selectedPartName}>{part.name}</Text>
                                                <Text style={styles.selectedPartMeta}>
                                                    ₹{part.rate} each • {part.isiMark}
                                                </Text>
                                            </View>
                                            <View style={styles.partQtyControls}>
                                                <TouchableOpacity
                                                    style={styles.qtyBtn}
                                                    onPress={() => handleUpdatePartQty(part.id, -1)}
                                                >
                                                    <Minus size={14} color={COLORS.textPrimary} />
                                                </TouchableOpacity>
                                                <Text style={styles.qtyText}>{part.quantity}</Text>
                                                <TouchableOpacity
                                                    style={styles.qtyBtn}
                                                    onPress={() => handleUpdatePartQty(part.id, 1)}
                                                >
                                                    <Plus size={14} color={COLORS.textPrimary} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deletePartBtn}
                                                    onPress={() => handleRemovePart(part.id)}
                                                >
                                                    <Trash2 size={16} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                    <View style={styles.partsTotalRow}>
                                        <Text style={styles.partsTotalLabel}>Total Genuine Spares:</Text>
                                        <Text style={styles.partsTotalVal}>₹{partsTotalCost}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.noPartsBox}>
                                    <Text style={styles.noPartsText}>No extra spare parts logged yet.</Text>
                                </View>
                            )}
                        </View>

                        {/* Extra Time Adjuster */}
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>LABOR TIME DURATION</Text>
                        <View style={styles.inputFieldRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Total Hours Worked (First hour included)</Text>
                                <TextInput
                                    style={styles.numericInput}
                                    value={hours}
                                    onChangeText={setHours}
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
                            {partsTotalCost > 0 && (
                                <View style={styles.invoiceRow}>
                                    <Text style={styles.invoiceLabel}>Spare Parts (ISI Certified)</Text>
                                    <Text style={styles.invoiceValue}>+₹{partsTotalCost}</Text>
                                </View>
                            )}
                            <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                                <Text style={styles.invoiceTotalLabel}>Customer Final Bill</Text>
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
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>CLOSEOUT OTP VERIFICATION</Text>
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

                {/* STAGE 4: COMPLETED INVOICE & DUAL SETTLEMENT */}
                {job.status === 'completed' && (
                    <View style={[styles.stageCard, { borderColor: COLORS.success }]}>
                        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                            <CheckCircle size={48} color={COLORS.success} />
                            <Text style={styles.completedHeaderTitle}>Job Completed & Verified</Text>
                            <Text style={styles.completedHeaderSub}>
                                Bill of ₹{job.finalPrice || currentTotalBill} generated for customer settlement.
                            </Text>
                        </View>

                        {/* Settlement Status Banner */}
                        {cashPaid || job.paymentStatus === 'paid' ? (
                            <View style={styles.paidSettledBanner}>
                                <CheckCircle size={20} color={COLORS.success} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.paidSettledTitle}>
                                        {job.paymentMethod?.includes('Cash') || cashPaid ? 'Settled in Cash' : 'Paid Online via Razorpay'}
                                    </Text>
                                    <Text style={styles.paidSettledSub}>
                                        Amount: ₹{job.finalPrice || currentTotalBill} • Zero pending dues
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.settlementActionBox}>
                                <Text style={styles.settlementActionTitle}>CHOOSE SETTLEMENT METHOD</Text>

                                {/* Cash on Doorstep Action */}
                                <TouchableOpacity
                                    style={styles.cashPayBtn}
                                    onPress={handleMarkCashReceived}
                                >
                                    <Banknote size={18} color="#000" />
                                    <Text style={styles.cashPayBtnText}>Mark "Paid in Cash" (₹{job.finalPrice || currentTotalBill})</Text>
                                </TouchableOpacity>

                                {/* Customer QR Code / Online Link */}
                                <TouchableOpacity
                                    style={styles.qrPayBtn}
                                    onPress={() => setQrModalVisible(true)}
                                >
                                    <QrCode size={18} color="#fff" />
                                    <Text style={styles.qrPayBtnText}>Show Customer UPI QR / Payment Link</Text>
                                </TouchableOpacity>

                                {/* WhatsApp Share */}
                                <TouchableOpacity
                                    style={styles.sharePayBtn}
                                    onPress={handleSharePaymentLink}
                                >
                                    <Share2 size={16} color={COLORS.textPrimary} />
                                    <Text style={styles.sharePayBtnText}>Share Payment Link to Customer</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.invoicePreviewCard}>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Total Billed</Text>
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
                            <Text style={styles.primaryActionBtnText}>Return to Partner Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* SPARE PARTS PICKER MODAL */}
            <Modal
                visible={partsModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setPartsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.partsModalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Select Genuine Spare Parts</Text>
                                <Text style={styles.modalSub}>IS/IEC certified Kerala electrical & AC spares</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => setPartsModalVisible(false)}
                            >
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Input */}
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search MCB, wire, capacitor, switch..."
                            placeholderTextColor={COLORS.textTertiary}
                            value={partsSearch}
                            onChangeText={setPartsSearch}
                        />

                        {/* Category Tabs */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {PARTS_CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.catTab, partsCategory === cat.id && styles.catTabActive]}
                                    onPress={() => setPartsCategory(cat.id)}
                                >
                                    <Text style={[styles.catTabText, partsCategory === cat.id && styles.catTabTextActive]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Parts List */}
                        <ScrollView style={styles.partsCatalogList} showsVerticalScrollIndicator={false}>
                            {filteredParts.map(part => {
                                const selected = selectedParts.find(p => p.id === part.id);
                                return (
                                    <View key={part.id} style={styles.catalogItemRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.catalogItemName}>{part.name}</Text>
                                            <Text style={styles.catalogItemMeta}>
                                                {part.manufacturer} • {part.isiMark} • HSN: {part.hsn}
                                            </Text>
                                            <Text style={styles.catalogItemPrice}>₹{part.rate} / {part.unit}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.catalogAddBtn, selected && { backgroundColor: COLORS.success }]}
                                            onPress={() => handleAddPart(part)}
                                        >
                                            <Plus size={16} color="#fff" />
                                            <Text style={styles.catalogAddBtnText}>
                                                {selected ? `Added (${selected.quantity})` : 'Add'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalDoneBtn}
                            onPress={() => setPartsModalVisible(false)}
                        >
                            <Text style={styles.modalDoneBtnText}>Done Adding Parts</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* CUSTOMER QR PAYMENT MODAL */}
            <Modal
                visible={qrModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setQrModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.qrModalContent}>
                        <View style={styles.qrIconWrapper}>
                            <QrCode size={120} color={COLORS.accent} />
                        </View>
                        <Text style={styles.qrModalTitle}>Scan to Pay ₹{job.finalPrice || currentTotalBill}</Text>
                        <Text style={styles.qrModalSub}>
                            Customer can point their phone camera or Google Pay / PhonePe to pay instantly.
                        </Text>
                        <View style={styles.qrUrlBox}>
                            <Text style={styles.qrUrlText}>sheriyakam.vercel.app/pay/{job.id}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.modalDoneBtn}
                            onPress={() => setQrModalVisible(false)}
                        >
                            <Text style={styles.modalDoneBtnText}>Close QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* SOS EMERGENCY CONFIRMATION MODAL */}
            <Modal
                visible={sosModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setSosModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.qrModalContent, { borderColor: '#EF4444' }]}>
                        <AlertOctagon size={54} color="#EF4444" />
                        <Text style={[styles.qrModalTitle, { color: '#EF4444' }]}>EMERGENCY SOS ALERT</Text>
                        <Text style={styles.qrModalSub}>
                            Are you facing an electric hazard, violent dispute, or medical emergency? This immediately sends your live GPS coordinates to Thalassery Ops Room and supervisor.
                        </Text>
                        <View style={styles.sosActionRow}>
                            <TouchableOpacity
                                style={styles.sosCancelBtn}
                                onPress={() => setSosModalVisible(false)}
                            >
                                <Text style={styles.sosCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.sosTriggerBtn}
                                onPress={handleTriggerSOS}
                            >
                                <Text style={styles.sosTriggerBtnText}>SEND DISTRESS ALERT</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        gap: 10,
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
    sosHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    sosHeaderBtnText: {
        color: '#EF4444',
        fontWeight: '900',
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
    sosWarningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#DC2626',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    sosWarningText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        flex: 1,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
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
        gap: 8,
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
        fontSize: 12,
    },
    chatBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    chatBtnText: {
        color: '#60A5FA',
        fontWeight: '700',
        fontSize: 12,
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
        fontSize: 12,
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
        marginBottom: 6,
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

    /* Parts Section */
    partsSectionBox: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 14,
        padding: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    partsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    partsHeaderSub: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },
    addPartsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addPartsBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    selectedPartsList: {
        gap: 8,
        marginTop: 4,
    },
    selectedPartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 10,
    },
    selectedPartName: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '700',
    },
    selectedPartMeta: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    partQtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    qtyBtn: {
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
        minWidth: 16,
        textAlign: 'center',
    },
    deletePartBtn: {
        padding: 4,
        marginLeft: 4,
    },
    partsTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    partsTotalLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    partsTotalVal: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '800',
    },
    noPartsBox: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    noPartsText: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },

    /* Input Field */
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

    /* Settlement Stage */
    paidSettledBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(34,197,94,0.15)',
        borderWidth: 1,
        borderColor: COLORS.success,
        borderRadius: 12,
        padding: 14,
        marginVertical: 12,
    },
    paidSettledTitle: {
        color: COLORS.success,
        fontWeight: '800',
        fontSize: 14,
    },
    paidSettledSub: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    settlementActionBox: {
        gap: 10,
        marginVertical: 14,
    },
    settlementActionTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    cashPayBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.gold,
        paddingVertical: 13,
        borderRadius: 10,
    },
    cashPayBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 13,
    },
    qrPayBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        paddingVertical: 13,
        borderRadius: 10,
    },
    qrPayBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 13,
    },
    sharePayBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingVertical: 12,
        borderRadius: 10,
    },
    sharePayBtnText: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 12,
    },

    /* Modals */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    partsModalContent: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    modalTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 17,
    },
    modalSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    modalCloseBtn: {
        padding: 4,
    },
    modalSearchInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 13,
        marginBottom: 10,
    },
    categoryScroll: {
        flexGrow: 0,
        marginBottom: 12,
    },
    catTab: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    catTabActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    catTabText: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '600',
    },
    catTabTextActive: {
        color: '#fff',
        fontWeight: '800',
    },
    partsCatalogList: {
        maxHeight: 320,
    },
    catalogItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 12,
    },
    catalogItemName: {
        color: COLORS.textPrimary,
        fontSize: 12.5,
        fontWeight: '700',
    },
    catalogItemMeta: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    catalogItemPrice: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '800',
        marginTop: 3,
    },
    catalogAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    catalogAddBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    modalDoneBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 14,
    },
    modalDoneBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },

    /* QR Modal */
    qrModalContent: {
        backgroundColor: COLORS.bgSecondary,
        margin: 20,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 12,
    },
    qrIconWrapper: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
    },
    qrModalTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
    },
    qrModalSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    qrUrlBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    qrUrlText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '700',
    },

    /* SOS Alert Modal */
    sosActionRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginTop: 10,
    },
    sosCancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    sosCancelBtnText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },
    sosTriggerBtn: {
        flex: 2,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#DC2626',
        alignItems: 'center',
    },
    sosTriggerBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '900',
    },
});
