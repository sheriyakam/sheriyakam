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
    MessageSquare, Plus, Minus, Trash2, QrCode,
    Share2, Sparkles, ExternalLink, Banknote, Receipt, Key, PenTool, Upload, Lock, Unlock, CheckCheck, FileCheck, ShieldAlert, CheckSquare2
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import {
    completeBookingByPartner, checkInBookingByPartner,
    markArrivedByPartner, getPartnerJobs, recordCashPayment,
    getBookingById, bookingEvents,
    recordDiagnosticAssessment, submitEstimateQuote, approveEstimateQuote,
    addHardwareBill, signOffBooking
} from '../../../constants/bookingStore';
import { getSupervisorForPartner, getCurrentPartner, DEFAULT_PARTNER_MOCK } from '../../../constants/partnerStore';
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

    // Dual Settlement states
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [cashPaid, setCashPaid] = useState(false);

    // Diagnostic Assessment Gate States
    const [diagnosticPhoto, setDiagnosticPhoto] = useState(null);
    const [diagnosticNotes, setDiagnosticNotes] = useState('');
    const [diagnosticVerified, setDiagnosticVerified] = useState(false);

    // Instant Digital Estimate Approval States
    const [estimateSubmitted, setEstimateSubmitted] = useState(false);
    const [estimateClientApproved, setEstimateClientApproved] = useState(false);
    const [estimateNotes, setEstimateNotes] = useState('');

    // Local Hardware Bill Snapper States
    const [hardwareModalVisible, setHardwareModalVisible] = useState(false);
    const [hwSupplier, setHwSupplier] = useState('');
    const [hwBillNo, setHwBillNo] = useState('');
    const [hwAmount, setHwAmount] = useState('');
    const [hwItems, setHwItems] = useState('');
    const [hwPhoto, setHwPhoto] = useState(null);
    const [hardwareBills, setHardwareBills] = useState([]);

    // Digital Sign-Off States
    const [signOffType, setSignOffType] = useState('otp');
    const [customerSigned, setCustomerSigned] = useState(false);
    const [signName, setSignName] = useState(params.customerName || 'K.V. Raghu');

    // Site Dispute Escalation Line
    const [disputeModalVisible, setDisputeModalVisible] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeSubmitted, setDisputeSubmitted] = useState(false);
    const [payoutModalVisible, setPayoutModalVisible] = useState(false);
    const [settledPayout, setSettledPayout] = useState(null);

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
                if (updated.diagnosticAssessment) {
                    setDiagnosticVerified(true);
                    if (updated.diagnosticAssessment.photoUri) setDiagnosticPhoto(updated.diagnosticAssessment.photoUri);
                    if (updated.diagnosticAssessment.faultDescription) setDiagnosticNotes(updated.diagnosticAssessment.faultDescription);
                }
                if (updated.estimateApproval) {
                    setEstimateSubmitted(true);
                    if (updated.estimateApproval.isApproved) setEstimateClientApproved(true);
                }
                if (Array.isArray(updated.hardwareBills) && updated.hardwareBills.length > 0) {
                    setHardwareBills(updated.hardwareBills);
                }
                if (updated.customerSignature) {
                    setCustomerSigned(true);
                }
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
        if (signOffType === 'otp' && completionOtp.length < 4) {
            Alert.alert("Validation Error", "Please enter the 4-digit completion OTP to verify satisfactory finish.");
            return;
        }
        if (signOffType === 'signature' && !customerSigned) {
            Alert.alert("Customer Signature Required", "Please have the customer sign off or confirm completion.");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            const extraH = Math.max(0, (parseInt(hours) || 1) - 1);
            const otpToSubmit = signOffType === 'signature' ? (job.otp || '1234') : completionOtp;
            const res = completeBookingByPartner(
                job.id,
                otpToSubmit,
                parseInt(hours) || 1,
                partsTotalCost,
                {
                    checklist,
                    beforePhoto: diagnosticPhoto || beforePhoto,
                    afterPhoto,
                    workNotes,
                    sparePartsUsed: selectedParts,
                    customerSignature: customerSigned ? `Signed on-site by ${signName || job.customerName}` : null,
                    diagnosticAssessment: { photoUri: diagnosticPhoto, faultDescription: diagnosticNotes }
                }
            );

            if (res.success) {
                setLiveJob(prev => ({
                    ...prev,
                    status: 'completed',
                    finalPrice: res.booking.finalPrice,
                    netPartnerPayout: res.booking.netPartnerPayout,
                    payoutUtr: res.booking.payoutUtr
                }));
                setSettledPayout(res.booking);
                setPayoutModalVisible(true);
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


    // Diagnostic Assessment Handlers
    const handlePickDiagnosticPhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted' && Platform.OS !== 'web') {
                Alert.alert('Permission Needed', 'Camera permission required to capture pre-work fault condition.');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
                setDiagnosticPhoto(result.assets[0].uri);
            }
        } catch (e) {
            setDiagnosticPhoto('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500');
        }
    };

    const handleSubmitDiagnosticGate = () => {
        if (!diagnosticPhoto) {
            Alert.alert('Mandatory Photo Required', 'Please photograph the existing fault/distribution board condition before unscrewing panels. This protects you from pre-existing liability.');
            return;
        }
        recordDiagnosticAssessment(job.id, {
            photoUri: diagnosticPhoto,
            faultDescription: diagnosticNotes || 'Initial fault condition inspected on arrival.'
        });
        setDiagnosticVerified(true);
        Alert.alert('✅ Diagnostic Gate Verified', 'Pre-work fault condition stamped with KSELB audit timestamp. You may now generate estimate or proceed to repairs.');
    };

    // Digital Estimate Quote Handlers
    const handleSubmitEstimateQuote = () => {
        const estTotal = (job.price || 0) + (extraHoursCount * 100) + partsTotalCost;
        submitEstimateQuote(job.id, {
            parts: selectedParts,
            extraHours: extraHoursCount,
            totalEstimate: estTotal,
            quoteNotes: estimateNotes || 'Genuine ISI replacement parts & labor hours quote'
        });
        setEstimateSubmitted(true);
        Alert.alert('📋 Digital Quote Generated', `Quote for ₹${estTotal} ready for client review on-site.`);
    };

    const handleClientApproveEstimate = () => {
        approveEstimateQuote(job.id);
        setEstimateSubmitted(true);
        setEstimateClientApproved(true);
        Alert.alert('✍️ Client Approved Quote', 'Customer has signed off on the digital quote. All additional parts and labor are officially authorized.');
    };

    const handleSkipEstimate = () => {
        setEstimateSubmitted(true);
        setEstimateClientApproved(true);
    };

    // Local Hardware Bill Snapper Handlers
    const handleSnapHardwarePhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
                setHwPhoto(result.assets[0].uri);
            }
        } catch (e) {
            setHwPhoto('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500');
        }
    };

    const handleSaveHardwareBill = () => {
        if (!hwAmount || isNaN(Number(hwAmount)) || Number(hwAmount) <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid bill amount in ₹.');
            return;
        }
        const res = addHardwareBill(job.id, {
            photoUri: hwPhoto || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
            supplierName: hwSupplier || 'Local Electrical Hardware Store',
            billNo: hwBillNo || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            amount: Number(hwAmount),
            items: hwItems || 'MCBs / Finolex Wire / Conduit'
        });
        if (res.success) {
            setHardwareBills(res.hardwareBills);
            setHardwareModalVisible(false);
            setHwSupplier('');
            setHwBillNo('');
            setHwAmount('');
            setHwItems('');
            setHwPhoto(null);
            Alert.alert('🧾 Hardware Bill Added', `₹${hwAmount} added to final invoice. 100% of this amount is reimbursed directly to your payout without platform commission deduction!`);
        }
    };

    // Priority Site Dispute Escalation Line
    const handleEscalateDispute = () => {
        if (!disputeReason.trim()) {
            Alert.alert('Selection Required', 'Please describe the site issue or hazard.');
            return;
        }
        setDisputeSubmitted(true);
        setDisputeModalVisible(false);
        Alert.alert(
            '🚨 Priority Escalation Broadcasted',
            `Supervisor Suresh Kumar (Thalassery Ops Room) alerted.\nJob ID: #${job.id}\nIssue: ${disputeReason}\nContact: +91 98765 43210`,
            [
                { text: 'Call Supervisor Now', onPress: () => Linking.openURL('tel:9876543210') },
                { text: 'Done', style: 'default' }
            ]
        );
    };

    // Calculations
    const hardwareBillsTotal = (hardwareBills || []).reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const extraHoursCount = Math.max(0, (parseInt(hours) || 1) - 1);
    const baseLaborPrice = Math.max(499, job.price || 499);
    const laborPrice = baseLaborPrice + (extraHoursCount * 100);
    const currentTotalBill = laborPrice + partsTotalCost + hardwareBillsTotal;
    // 10% platform fee applies to service labor & catalog spares only; local hardware bills are 100% reimbursed to partner!
    const platformDeduction = Math.round((laborPrice + partsTotalCost) * 0.15);
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
                {/* 6-Stage Standardized Field Workflow */}
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
                            <Text style={styles.stepLabel}>Check-In</Text>
                        </View>
                        <View style={[styles.stepLine, (diagnosticVerified || ['completed'].includes(job.status)) && { backgroundColor: COLORS.accent }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: diagnosticVerified ? COLORS.success : (job.status === 'in_progress' ? COLORS.gold : COLORS.bgTertiary) }
                            ]}>
                                <Text style={styles.stepNum}>3</Text>
                            </View>
                            <Text style={styles.stepLabel}>Diagnostic</Text>
                        </View>
                        <View style={[styles.stepLine, (estimateClientApproved || ['completed'].includes(job.status)) && { backgroundColor: COLORS.accent }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: estimateClientApproved ? COLORS.success : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>4</Text>
                            </View>
                            <Text style={styles.stepLabel}>Estimate</Text>
                        </View>
                        <View style={[styles.stepLine, (job.status === 'completed') && { backgroundColor: COLORS.success }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: (job.status === 'in_progress' && diagnosticVerified && estimateClientApproved) ? COLORS.accent : (job.status === 'completed' ? COLORS.success : COLORS.bgTertiary) }
                            ]}>
                                <Text style={styles.stepNum}>5</Text>
                            </View>
                            <Text style={styles.stepLabel}>Execution</Text>
                        </View>
                        <View style={[styles.stepLine, (job.status === 'completed') && { backgroundColor: COLORS.success }]} />

                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: job.status === 'completed' ? COLORS.success : COLORS.bgTertiary }
                            ]}>
                                <Text style={styles.stepNum}>6</Text>
                            </View>
                            <Text style={styles.stepLabel}>Sign-Off</Text>
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
                    <View style={styles.distanceBadgeStrip}>
                        <Compass size={13} color={COLORS.gold} />
                        <Text style={styles.distanceBadgeText}>{job.distance || '1.4 km'} away • Within 8–10 km Service Limit</Text>
                    </View>

                    {/* Pre-Visit Client Site Notes (Integrated Routing & Site Access) */}
                    <View style={styles.siteNotesContainer}>
                        <View style={styles.siteNotesHeader}>
                            <Key size={14} color={COLORS.accent} />
                            <Text style={styles.siteNotesTitle}>PRE-VISIT CLIENT SITE NOTES</Text>
                        </View>
                        <View style={styles.siteNoteRow}>
                            <Text style={styles.siteNoteLabel}>⚡ Meter Box Location:</Text>
                            <Text style={styles.siteNoteVal}>{job.siteNotes?.meterLocation || 'Ground floor external stairwell on left'}</Text>
                        </View>
                        <View style={styles.siteNoteRow}>
                            <Text style={styles.siteNoteLabel}>📜 Reported Fault History:</Text>
                            <Text style={styles.siteNoteVal}>{job.siteNotes?.faultHistory || 'Main MCB tripped twice during rainfall; sparking smell'}</Text>
                        </View>
                        <View style={styles.siteAdvisoryBox}>
                            <AlertTriangle size={13} color="#F59E0B" />
                            <Text style={styles.siteAdvisoryText}>{job.siteNotes?.siteAdvisory || 'Beware of pet dog in front porch. Ring calling bell twice.'}</Text>
                        </View>
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

                {/* STAGE 3: MANDATORY DIAGNOSTIC ASSESSMENT GATE */}
                {job.status === 'in_progress' && !diagnosticVerified && (
                    <View style={[styles.stageCard, { borderColor: COLORS.gold }]}>
                        <View style={styles.stageCardHeader}>
                            <Camera size={20} color={COLORS.gold} />
                            <Text style={styles.stageTitle}>Step 3: Diagnostic Gate (Mandatory Pre-Work)</Text>
                        </View>
                        <View style={styles.diagnosticWarningBox}>
                            <Shield size={16} color={COLORS.gold} />
                            <Text style={styles.diagnosticWarningText}>
                                Mandatory KSELB Gate: Take a clear photo of the faulty DB, meter, or appliance BEFORE unscrewing or replacing parts. This prevents disputes regarding pre-existing damage.
                            </Text>
                        </View>

                        {/* Photo capture */}
                        <View style={styles.diagnosticPhotoWrap}>
                            {diagnosticPhoto ? (
                                <View style={styles.diagnosticPreviewWrap}>
                                    <Image source={{ uri: diagnosticPhoto }} style={styles.diagnosticImage} />
                                    <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => setDiagnosticPhoto(null)}>
                                        <X size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.diagnosticUploadBtn} onPress={handlePickDiagnosticPhoto}>
                                    <Camera size={28} color={COLORS.gold} />
                                    <Text style={styles.diagnosticUploadText}>Capture Fault Condition Photo *</Text>
                                    <Text style={styles.diagnosticUploadSub}>Distribution box, burnt wire, or tripped switchgear</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={[styles.inputFieldLabel, { marginTop: 12 }]}>Diagnostic Observations & Root Cause</Text>
                        <TextInput
                            style={styles.diagnosticTextInput}
                            placeholder="e.g., Water ingress on 32A MCB busbar terminal causing direct earth leak."
                            placeholderTextColor={COLORS.textTertiary}
                            value={diagnosticNotes}
                            onChangeText={setDiagnosticNotes}
                            multiline
                        />

                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.gold, marginTop: 14 }]}
                            onPress={handleSubmitDiagnosticGate}
                        >
                            <Shield size={18} color="#000" />
                            <Text style={[styles.primaryActionBtnText, { color: '#000' }]}>Verify Diagnostic Gate & Proceed</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STAGE 4: INSTANT DIGITAL ESTIMATE APPROVAL */}
                {job.status === 'in_progress' && diagnosticVerified && !estimateClientApproved && (
                    <View style={[styles.stageCard, { borderColor: COLORS.accent }]}>
                        <View style={styles.stageCardHeader}>
                            <FileText size={20} color={COLORS.accent} />
                            <Text style={styles.stageTitle}>Step 4: Digital Estimate Approval</Text>
                        </View>
                        <Text style={styles.stageDescription}>
                            If replacement parts or extra labor hours are required, generate an instant itemized digital quote for the customer to authorize before fitting parts.
                        </Text>

                        {/* Estimate Summary Box */}
                        <View style={styles.estimateBox}>
                            <View style={styles.estimateRow}>
                                <Text style={styles.estimateLabel}>Base Service Fare:</Text>
                                <Text style={styles.estimateVal}>₹{job.price}</Text>
                            </View>
                            <View style={styles.estimateRow}>
                                <Text style={styles.estimateLabel}>Catalog Spares ({selectedParts.length} items):</Text>
                                <Text style={styles.estimateVal}>+₹{partsTotalCost}</Text>
                            </View>
                            <View style={styles.estimateRow}>
                                <Text style={styles.estimateLabel}>Estimated Total Quote:</Text>
                                <Text style={[styles.estimateVal, { color: COLORS.accent, fontWeight: '900', fontSize: 16 }]}>
                                    ₹{(job.price || 0) + partsTotalCost}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.estimateActionRow}>
                            <TouchableOpacity
                                style={styles.addPartsMiniBtn}
                                onPress={() => setPartsModalVisible(true)}
                            >
                                <Plus size={15} color="#fff" />
                                <Text style={styles.addPartsMiniBtnText}>Select Spare Parts</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.standardWorkBtn}
                                onPress={handleSkipEstimate}
                            >
                                <Text style={styles.standardWorkBtnText}>Standard Work (No Extra Estimate)</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.accent, marginTop: 12 }]}
                            onPress={handleClientApproveEstimate}
                        >
                            <CheckCheck size={18} color="#fff" />
                            <Text style={styles.primaryActionBtnText}>Client Reviewed & Approved Quote On-Site</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STAGE 5: WORK EXECUTION & LOCAL HARDWARE BILL SNAPPER */}
                {job.status === 'in_progress' && diagnosticVerified && estimateClientApproved && (
                    <View style={styles.stageCard}>
                        <View style={styles.stageCardHeader}>
                            <FileCheck size={20} color={COLORS.success} />
                            <Text style={styles.stageTitle}>Step 5: Work Execution & Expense Tracker</Text>
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

                        {/* After Photo Upload */}
                        <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>AFTER REPAIR VERIFICATION PHOTO</Text>
                        <View style={styles.photoGrid}>
                            <View style={[styles.photoBox, { flex: 1 }]}>
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
                                        <Text style={styles.photoUploadText}>Capture Completed Work Photo</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Local Hardware Store Bill Snapper */}
                        <View style={styles.hardwareExpenseSection}>
                            <View style={styles.hardwareHeaderRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.subSectionTitle}>LOCAL HARDWARE STORE EXPENSE BILLS</Text>
                                    <Text style={styles.hardwareSubText}>Bought from local supplier? Snap bill for 100% reimbursement!</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.snapReceiptBtn}
                                    onPress={() => setHardwareModalVisible(true)}
                                >
                                    <Receipt size={15} color="#fff" />
                                    <Text style={styles.snapReceiptBtnText}>Snap Bill</Text>
                                </TouchableOpacity>
                            </View>

                            {hardwareBills.length > 0 ? (
                                <View style={styles.hwBillsList}>
                                    {hardwareBills.map(hb => (
                                        <View key={hb.id} style={styles.hwBillItem}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.hwSupplierName}>{hb.supplierName}</Text>
                                                <Text style={styles.hwBillMeta}>Bill #{hb.billNo} • {hb.items}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={styles.hwBillAmount}>₹{hb.amount}</Text>
                                                <View style={styles.reimbursePill}>
                                                    <Text style={styles.reimbursePillText}>100% REIMBURSED</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                    <View style={styles.hwTotalRow}>
                                        <Text style={styles.hwTotalLabel}>Total Material Reimbursement:</Text>
                                        <Text style={styles.hwTotalVal}>₹{hardwareBillsTotal}</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.noHwBox}>
                                    <Text style={styles.noHwText}>No local supplier bills added yet. Tap "Snap Bill" to add.</Text>
                                </View>
                            )}
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
                                <Text style={styles.inputFieldLabel}>Total Hours Worked (First hour included in base)</Text>
                                <TextInput
                                    style={styles.numericInput}
                                    value={hours}
                                    onChangeText={setHours}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Live Itemized Invoice Preview */}
                        <View style={styles.invoicePreviewCard}>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Base Service Labor</Text>
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
                                    <Text style={styles.invoiceLabel}>Catalog Spares (ISI Certified)</Text>
                                    <Text style={styles.invoiceValue}>+₹{partsTotalCost}</Text>
                                </View>
                            )}
                            {hardwareBillsTotal > 0 && (
                                <View style={styles.invoiceRow}>
                                    <Text style={[styles.invoiceLabel, { color: COLORS.accent }]}>Local Supplier Bills (100% Reimbursed)</Text>
                                    <Text style={[styles.invoiceValue, { color: COLORS.accent }]}>+₹{hardwareBillsTotal}</Text>
                                </View>
                            )}
                            <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                                <Text style={styles.invoiceTotalLabel}>Customer Final Bill</Text>
                                <Text style={styles.invoiceTotalValue}>₹{currentTotalBill}</Text>
                            </View>
                            <View style={styles.invoiceRow}>
                                <Text style={{ color: COLORS.textTertiary, fontSize: 11 }}>Platform Fee (15% Split • ₹499 Floor)</Text>
                                <Text style={{ color: COLORS.textTertiary, fontSize: 11 }}>-₹{platformDeduction}</Text>
                            </View>
                            <View style={[styles.invoiceRow, { paddingTop: 4 }]}>
                                <Text style={{ color: COLORS.success, fontWeight: '800', fontSize: 13 }}>Your Net Take-Home (85% Labor + 100% Material Reimbursement)</Text>
                                <Text style={{ color: COLORS.success, fontWeight: '900', fontSize: 16 }}>₹{partnerNetEarning}</Text>
                            </View>
                        </View>

                        {/* STAGE 6: CUSTOMER JOB SIGN-OFF */}
                        <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>STEP 6: CUSTOMER SIGN-OFF & VERIFICATION</Text>
                        
                        {/* Sign-off mode selector */}
                        <View style={styles.signOffTypeRow}>
                            <TouchableOpacity
                                style={[styles.signOffTypeTab, signOffType === 'otp' && styles.signOffTypeTabActive]}
                                onPress={() => setSignOffType('otp')}
                            >
                                <Key size={14} color={signOffType === 'otp' ? '#fff' : COLORS.textTertiary} />
                                <Text style={[styles.signOffTypeTabText, signOffType === 'otp' && styles.signOffTypeTabTextActive]}>Completion OTP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.signOffTypeTab, signOffType === 'signature' && styles.signOffTypeTabActive]}
                                onPress={() => setSignOffType('signature')}
                            >
                                <PenTool size={14} color={signOffType === 'signature' ? '#fff' : COLORS.textTertiary} />
                                <Text style={[styles.signOffTypeTabText, signOffType === 'signature' && styles.signOffTypeTabTextActive]}>Digital Signature</Text>
                            </TouchableOpacity>
                        </View>

                        {signOffType === 'otp' ? (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.stageDescription}>Ask customer for their 4-digit Completion OTP (Code: 1234):</Text>
                                <TextInput
                                    style={styles.otpInputBox}
                                    placeholder="Enter 4-Digit Completion OTP"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={completionOtp}
                                    onChangeText={t => setCompletionOtp(t.replace(/[^0-9]/g, '').slice(0, 4))}
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                            </View>
                        ) : (
                            <View style={styles.signaturePadBox}>
                                <Text style={styles.signaturePadTitle}>Client Work Sign-Off</Text>
                                <Text style={styles.signaturePadSub}>Customer acknowledges safe inspection & accepts final bill of ₹{currentTotalBill}.</Text>
                                <TextInput
                                    style={styles.signNameInput}
                                    placeholder="Customer / Signer Full Name"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={signName}
                                    onChangeText={setSignName}
                                />
                                <TouchableOpacity
                                    style={[styles.signConfirmBtn, customerSigned && { backgroundColor: COLORS.success }]}
                                    onPress={() => setCustomerSigned(!customerSigned)}
                                >
                                    <CheckCheck size={16} color="#fff" />
                                    <Text style={styles.signConfirmBtnText}>
                                        {customerSigned ? '✓ Digital Signature Captured & Stamped' : 'Tap to Capture Client Signature on Device'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.primaryActionBtn, { backgroundColor: COLORS.success, marginTop: 16 }]}
                            onPress={handleCompleteJob}
                            disabled={isSubmitting}
                        >
                            <CheckCircle size={18} color="#fff" />
                            <Text style={styles.primaryActionBtnText}>
                                {isSubmitting ? 'Finalizing Closeout...' : 'Submit & Close Job (Generate Bill)'}
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
                                <Text style={styles.invoiceLabel}>Platform Commission (15%)</Text>
                                <Text style={styles.invoiceValue}>-₹{Math.round((job.finalPrice || currentTotalBill) * 0.15)}</Text>
                            </View>
                            <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                                <Text style={styles.invoiceTotalLabel}>Net Credited to Partner Wallet</Text>
                                <Text style={[styles.invoiceTotalValue, { color: COLORS.success }]}>
                                    ₹{job.netPartnerPayout || Math.round((job.finalPrice || currentTotalBill) * 0.85)}
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

            
        
            {/* LOCAL HARDWARE BILL SNAPPER MODAL */}
            <Modal
                visible={hardwareModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setHardwareModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.hwModalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Snap Local Hardware Bill</Text>
                                <Text style={styles.modalSub}>100% reimbursed on customer invoice</Text>
                            </View>
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setHardwareModalVisible(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputFieldLabel}>Local Supplier / Hardware Shop Name *</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g., Malabar Electrical Hardware, Thalassery"
                            placeholderTextColor={COLORS.textTertiary}
                            value={hwSupplier}
                            onChangeText={setHwSupplier}
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Bill / Cash Memo No.</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g., ME-8841"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={hwBillNo}
                                    onChangeText={setHwBillNo}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputFieldLabel}>Total Bill Amount (₹) *</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g., 380"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={hwAmount}
                                    onChangeText={setHwAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <Text style={[styles.inputFieldLabel, { marginTop: 8 }]}>Items Purchased</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g., 32A C-Curve MCB + 2m Finolex 2.5sq mm wire"
                            placeholderTextColor={COLORS.textTertiary}
                            value={hwItems}
                            onChangeText={setHwItems}
                        />

                        {/* Snap Receipt Photo */}
                        <TouchableOpacity style={styles.hwReceiptPickBtn} onPress={handleSnapHardwarePhoto}>
                            <Receipt size={20} color={COLORS.accent} />
                            <Text style={styles.hwReceiptPickBtnText}>
                                {hwPhoto ? '✓ Receipt Photo Attached (Tap to retake)' : 'Snap Photo of Hardware Receipt Memo'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalDoneBtn} onPress={handleSaveHardwareBill}>
                            <Text style={styles.modalDoneBtnText}>Add to Customer Bill & Reimburse</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* INSTANT 85/15 PARTNER SPLIT-PAYOUT MODAL */}
            <Modal
                visible={payoutModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setPayoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.qrModalContent, { borderColor: '#10B981', maxWidth: 420 }]}>
                        <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: 14, borderRadius: 50, marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={36} color="#10B981" />
                        </View>
                        <Text style={[styles.qrModalTitle, { color: '#10B981', fontSize: 18, textAlign: 'center' }]}>
                            ⚡ ₹{settledPayout?.netPartnerPayout || liveJob.netPartnerPayout || 467} DISPATCHED!
                        </Text>
                        <Text style={[styles.qrModalSub, { textAlign: 'center' }]}>
                            Instant 85/15 Split Payout transferred directly to your UPI ID upon customer OTP verification.
                        </Text>

                        {/* Payout Breakdown Card */}
                        <View style={{ backgroundColor: '#18181B', borderRadius: 12, padding: 14, width: '100%', marginVertical: 12, borderWidth: 1, borderColor: '#27272A' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ color: '#A1A1AA', fontSize: 13 }}>Gross Job Bill</Text>
                                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>₹{settledPayout?.finalPrice || liveJob.finalPrice || liveJob.price || 550}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>Your Net Payout (85%)</Text>
                                <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 15 }}>₹{settledPayout?.netPartnerPayout || liveJob.netPartnerPayout || 467}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text style={{ color: '#71717A', fontSize: 12 }}>Platform Assurance & Insurance (15%)</Text>
                                <Text style={{ color: '#71717A', fontSize: 12 }}>-₹{settledPayout?.platformFee || Math.round((liveJob.price || 550) * 0.15)}</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: '#27272A', marginVertical: 4 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ color: '#A1A1AA', fontSize: 11 }}>Destination UPI</Text>
                                <Text style={{ color: '#38BDF8', fontWeight: '700', fontSize: 11 }}>{getCurrentPartner()?.bankDetails?.upiId || 'shyam.electrician@oksbi'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={{ color: '#A1A1AA', fontSize: 11 }}>Bank Reference (UTR)</Text>
                                <Text style={{ color: '#E4E4E7', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11 }}>
                                    {settledPayout?.payoutUtr || liveJob.payoutUtr || 'UPI/2026/891024'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={{ color: '#A1A1AA', fontSize: 11 }}>Status</Text>
                                <Text style={{ color: '#10B981', fontWeight: '800', fontSize: 11 }}>🟢 SETTLED INSTANTLY</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                            <TouchableOpacity
                                style={[styles.sosCancelBtn, { flex: 1 }]}
                                onPress={() => setPayoutModalVisible(false)}
                            >
                                <Text style={styles.sosCancelBtnText}>Dismiss</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.sosTriggerBtn, { flex: 1.5, backgroundColor: '#10B981' }]}
                                onPress={() => {
                                    setPayoutModalVisible(false);
                                    router.push('/partner/earnings');
                                }}
                            >
                                <Text style={[styles.sosTriggerBtnText, { color: '#000' }]}>VIEW EARNINGS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PRIORITY DISPUTE & SAFETY SOS LINE MODAL */}
            <Modal
                visible={disputeModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setDisputeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.qrModalContent, { borderColor: '#F59E0B' }]}>
                        <ShieldAlert size={48} color="#F59E0B" />
                        <Text style={[styles.qrModalTitle, { color: '#F59E0B' }]}>SUPERVISOR DISPUTE & SOS LINE</Text>
                        <Text style={styles.qrModalSub}>
                            Facing an on-site pricing dispute, abusive client, or dangerous un-isolated live wiring? Escalate directly to your Thalassery HQ Supervisor.
                        </Text>

                        <View style={styles.disputeSupervisorCard}>
                            <Text style={styles.disputeSupervisorName}>Supervisor: Suresh Kumar</Text>
                            <Text style={styles.disputeSupervisorHub}>Thalassery Malabar Hub Lead • Available 24/7</Text>
                            <TouchableOpacity
                                style={styles.disputeCallNowBtn}
                                onPress={() => Linking.openURL('tel:9876543210')}
                            >
                                <Phone size={15} color="#fff" />
                                <Text style={styles.disputeCallNowBtnText}>Call Supervisor Now (+91 98765 43210)</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.inputFieldLabel, { marginTop: 8, width: '100%', textAlign: 'left' }]}>Log Dispute / Hazard Reason</Text>
                        <TextInput
                            style={[styles.modalInput, { width: '100%', height: 44 }]}
                            placeholder="e.g., Client refuses to isolate illegal bypass wiring"
                            placeholderTextColor={COLORS.textTertiary}
                            value={disputeReason}
                            onChangeText={setDisputeReason}
                        />

                        <View style={styles.sosActionRow}>
                            <TouchableOpacity style={styles.sosCancelBtn} onPress={() => setDisputeModalVisible(false)}>
                                <Text style={styles.sosCancelBtnText}>Dismiss</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.sosTriggerBtn, { backgroundColor: '#F59E0B' }]} onPress={handleEscalateDispute}>
                                <Text style={[styles.sosTriggerBtnText, { color: '#000' }]}>LOG ESCALATION</Text>
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

    /* Site Notes Styles */
    siteNotesContainer: {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.25)',
        gap: 6,
    },
    siteNotesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    siteNotesTitle: {
        color: '#60A5FA',
        fontWeight: '900',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    siteNoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4,
    },
    siteNoteLabel: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '600',
    },
    siteNoteVal: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    gateCodeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    gateCodeText: {
        color: COLORS.accent,
        fontWeight: '900',
        fontSize: 12,
    },
    siteAdvisoryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        padding: 8,
        borderRadius: 8,
        marginTop: 4,
    },
    siteAdvisoryText: {
        color: '#F59E0B',
        fontSize: 11,
        flex: 1,
        fontWeight: '600',
    },

    /* Dispute Header Btn */
    disputeHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 1,
        borderColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    disputeHeaderBtnText: {
        color: '#F59E0B',
        fontWeight: '900',
        fontSize: 10,
    },

    /* Diagnostic Gate Styles */
    diagnosticWarningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        padding: 10,
        borderRadius: 10,
        marginBottom: 12,
    },
    diagnosticWarningText: {
        color: COLORS.gold,
        fontSize: 11,
        flex: 1,
        lineHeight: 16,
        fontWeight: '600',
    },
    diagnosticPhotoWrap: {
        width: '100%',
        minHeight: 140,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    diagnosticPreviewWrap: {
        width: '100%',
        height: 160,
        position: 'relative',
    },
    diagnosticImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    diagnosticUploadBtn: {
        alignItems: 'center',
        padding: 20,
        gap: 6,
    },
    diagnosticUploadText: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
    },
    diagnosticUploadSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    diagnosticTextInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        padding: 10,
        fontSize: 12,
        minHeight: 60,
        textAlignVertical: 'top',
        marginTop: 6,
    },

    /* Estimate Approval Styles */
    estimateBox: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        padding: 12,
        marginVertical: 10,
        gap: 6,
    },
    estimateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    estimateLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    estimateVal: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 13,
    },
    estimateActionRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    addPartsMiniBtn: {
        flex: 1,
        backgroundColor: 'rgba(79, 70, 229, 0.3)',
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    addPartsMiniBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 11,
    },
    standardWorkBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    standardWorkBtnText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'center',
    },

    /* Hardware Store Expense Styles */
    hardwareExpenseSection: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    hardwareHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    hardwareSubText: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },
    snapReceiptBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    snapReceiptBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 11,
    },
    hwBillsList: {
        gap: 8,
        marginTop: 6,
    },
    hwBillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 8,
        borderRadius: 8,
    },
    hwSupplierName: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 12,
    },
    hwBillMeta: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },
    hwBillAmount: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 13,
    },
    reimbursePill: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 2,
    },
    reimbursePillText: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 8,
    },
    hwTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        paddingTop: 8,
        marginTop: 4,
    },
    hwTotalLabel: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '700',
    },
    hwTotalVal: {
        color: COLORS.success,
        fontWeight: '900',
        fontSize: 13,
    },
    noHwBox: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    noHwText: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },

    /* Sign-Off Styles */
    signOffTypeRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 3,
        marginBottom: 8,
    },
    signOffTypeTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 6,
    },
    signOffTypeTabActive: {
        backgroundColor: COLORS.accent,
    },
    signOffTypeTabText: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '700',
    },
    signOffTypeTabTextActive: {
        color: '#fff',
    },
    signaturePadBox: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        padding: 12,
        gap: 8,
    },
    signaturePadTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
    },
    signaturePadSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
        lineHeight: 16,
    },
    signNameInput: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 12,
    },
    signConfirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.25)',
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 8,
        paddingVertical: 10,
    },
    signConfirmBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 11,
    },

    /* Hardware Bill Modal */
    hwModalContent: {
        width: '94%',
        maxWidth: 480,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 12,
        marginTop: 4,
    },
    hwReceiptPickBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.accent,
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
        justifyContent: 'center',
    },
    hwReceiptPickBtnText: {
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: '700',
    },

    /* Dispute Modal Styles */
    disputeSupervisorCard: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.25)',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        marginVertical: 8,
        gap: 4,
    },
    disputeSupervisorName: {
        color: '#F59E0B',
        fontWeight: '800',
        fontSize: 13,
    },
    disputeSupervisorHub: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },
    disputeCallNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 6,
    },
    disputeCallNowBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 11,
    },


    distanceBadgeStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    distanceBadgeText: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: '700',
    },

});
