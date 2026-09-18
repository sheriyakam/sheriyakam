import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
    useWindowDimensions, Platform, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, PhoneCall, AlertTriangle, Zap, ShieldAlert,
    Clock, CheckCircle, Flame, Shield, MapPin, Send, MessageCircle
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { KERALA_DISTRICTS } from '../constants/locations';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useBookings } from '../constants/bookingStore';

const EMERGENCY_HAZARDS = [
    {
        id: 'sparking',
        title: 'Sparking Switchboard / Burning Smell',
        severity: 'Critical Hazard (Level 1)',
        icon: Flame,
        color: '#EF4444',
        advice: 'Turn OFF the Main DP Switch immediately. Do NOT touch switches with bare hands.'
    },
    {
        id: 'rccb-trip',
        title: 'RCCB / ELCB Constant Tripping & Earth Leakage',
        severity: 'High Hazard (Level 1)',
        icon: Zap,
        color: '#F97316',
        advice: 'Indicates live current leaking to ground or wet appliance. Do not force-hold breaker up.'
    },
    {
        id: 'smoke-db',
        title: 'Smoke from DB Box / Main Service Wire Overheating',
        severity: 'Critical Hazard (Level 1)',
        icon: AlertTriangle,
        color: '#EF4444',
        advice: 'Evacuate area near DB board. Cut mains if safe; call emergency dispatch immediately.'
    },
    {
        id: 'blackout',
        title: 'Phase Failure / Neutral Open Voltage Surge',
        severity: 'Urgent Hazard (Level 2)',
        icon: ShieldAlert,
        color: '#EAB308',
        advice: 'Unplug sensitive electronics (AC, Fridge, TV) immediately to avoid burnouts.'
    },
    {
        id: 'water-electrocution',
        title: 'Water Ingress / Flooded Inverter or Submersible DB',
        severity: 'Critical Hazard (Level 1)',
        icon: ShieldAlert,
        color: '#EF4444',
        advice: 'Stay completely clear of wet floor. Do not step into water until main cut-off is confirmed.'
    }
];

export default function EmergencyElectricianScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const { success, error: toastError } = useToast();
    const { createBooking } = useBookings();

    const [selectedHazard, setSelectedHazard] = useState(EMERGENCY_HAZARDS[0].id);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [district, setDistrict] = useState('Kozhikode');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCallHelpline = () => {
        const phoneUrl = 'tel:+914952800000';
        if (Platform.OS === 'web') {
            window.location.href = phoneUrl;
        } else {
            Linking.openURL(phoneUrl);
        }
    };

    const handleWhatsAppDispatch = () => {
        const hazardObj = EMERGENCY_HAZARDS.find(h => h.id === selectedHazard);
        const text = `🚨 *EMERGENCY ELECTRICAL DISPATCH REQUEST*\n\n*Hazard:* ${hazardObj?.title || 'Electrical Emergency'}\n*Location:* ${district}${address ? ' - ' + address : ''}\n*Contact:* ${phone || 'Immediate Dispatch'}\n\nPlease dispatch the nearest KSELB licensed emergency technician immediately.`;
        const url = `https://wa.me/914952800000?text=${encodeURIComponent(text)}`;
        if (Platform.OS === 'web') {
            window.open(url, '_blank');
        } else {
            Linking.openURL(url);
        }
    };

    const handleEmergencySubmit = () => {
        if (!phone.trim() || phone.trim().length < 10) {
            toastError('Please enter a valid 10-digit mobile number for emergency callback.', 'Required');
            return;
        }

        setIsSubmitting(true);
        const hazardObj = EMERGENCY_HAZARDS.find(h => h.id === selectedHazard);

        try {
            const newBooking = createBooking({
                serviceTitle: `🚨 Emergency: ${hazardObj?.title || 'Short Circuit Tripping'}`,
                serviceCategory: 'electrical',
                price: 499,
                customerName: name.trim() || 'Emergency Caller',
                customerPhone: phone.trim(),
                address: address.trim() || `${district}, Kerala`,
                district: district,
                timeSlot: 'Immediate (90-min Emergency Dispatch)',
                status: 'assigned',
                isEmergency: true
            });

            success('Emergency request logged! Technicians in your district alerted.', 'Dispatching 🚨');
            setIsSubmitting(false);
            if (newBooking?.id) {
                router.push(`/booking/${newBooking.id}`);
            } else {
                router.push('/dashboard');
            }
        } catch (e) {
            setIsSubmitting(false);
            toastError('Could not auto-dispatch. Calling emergency hotline...', 'Dispatching');
            handleCallHelpline();
        }
    };

    const activeHazardObj = EMERGENCY_HAZARDS.find(h => h.id === selectedHazard) || EMERGENCY_HAZARDS[0];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>24/7 Emergency Electrician Kerala | 90-Min Response | Sheriyakam</title>
                <meta name="description" content="24/7 Emergency Electrical Breakdown Service in Kerala. Burning smells, sparking switchboards, RCCB tripping & total blackouts. 90-min technician dispatch across all 14 districts." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/emergency-electrician" />
            </Head>

            {/* Top Navigation */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle, { color: '#EF4444' }]}>24/7 Emergency Triage</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Immediate KSELB Technician Dispatch</Text>
                </View>
                <TouchableOpacity onPress={handleCallHelpline} style={styles.directCallHeaderBtn}>
                    <PhoneCall size={16} color="#FFFFFF" />
                    <Text style={styles.directCallHeaderText}>Call 24/7</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Emergency Hero Alert */}
                <View style={[styles.heroAlert, { borderColor: '#EF4444' }]}>
                    <View style={styles.heroAlertTop}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.heroAlertTitle}>KERALA 24/7 ELECTRICAL EMERGENCY DISPATCH</Text>
                    </View>
                    <Text style={styles.heroAlertDesc}>
                        Sparking wires, burning smell, or power phase blackouts? Average arrival time is <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>45–90 minutes</Text> across all 14 Kerala districts.
                    </Text>

                    <View style={styles.heroActionRow}>
                        <TouchableOpacity onPress={handleCallHelpline} style={styles.callNowBtn}>
                            <PhoneCall size={18} color="#FFFFFF" />
                            <Text style={styles.callNowBtnText}>Call Emergency Hotline: +91 495 280 0000</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleWhatsAppDispatch} style={styles.whatsappNowBtn}>
                            <MessageCircle size={18} color="#FFFFFF" />
                            <Text style={styles.whatsappNowBtnText}>WhatsApp SOS</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content Layout */}
                <View style={[styles.gridWrap, isDesktop && styles.desktopGrid]}>
                    {/* Left Column: Safety First Instructions & Hazard Selector */}
                    <View style={{ flex: 1 }}>
                        {/* Critical Immediate Safety Checklist */}
                        <Card variant="default" style={[styles.safetyCard, { borderColor: '#F97316' }]}>
                            <View style={styles.cardHeaderRow}>
                                <ShieldAlert size={20} color="#F97316" />
                                <Text style={[styles.safetyCardTitle, { color: colors.textPrimary }]}>
                                    Critical Immediate Safety Steps (Do This Right Now)
                                </Text>
                            </View>

                            <View style={styles.safetyList}>
                                <View style={styles.safetyStepItem}>
                                    <View style={[styles.stepNumBadge, { backgroundColor: '#EF4444' }]}>
                                        <Text style={styles.stepNumText}>1</Text>
                                    </View>
                                    <Text style={[styles.safetyStepText, { color: colors.textPrimary }]}>
                                        <Text style={{ fontWeight: '700' }}>Switch OFF Main DP switch / RCCB</Text> on your distribution board to isolate power immediately.
                                    </Text>
                                </View>

                                <View style={styles.safetyStepItem}>
                                    <View style={[styles.stepNumBadge, { backgroundColor: '#F97316' }]}>
                                        <Text style={styles.stepNumText}>2</Text>
                                    </View>
                                    <Text style={[styles.safetyStepText, { color: colors.textPrimary }]}>
                                        <Text style={{ fontWeight: '700' }}>Never throw water</Text> on an electrical fire. Use a Dry Chemical Powder (DCP/CO2) fire extinguisher if available.
                                    </Text>
                                </View>

                                <View style={styles.safetyStepItem}>
                                    <View style={[styles.stepNumBadge, { backgroundColor: '#EAB308' }]}>
                                        <Text style={styles.stepNumText}>3</Text>
                                    </View>
                                    <Text style={[styles.safetyStepText, { color: colors.textPrimary }]}>
                                        <Text style={{ fontWeight: '700' }}>Unplug sensitive electronics</Text> (ACs, Inverters, LED TVs, Refrigerators) to prevent high-voltage spike damage.
                                    </Text>
                                </View>

                                <View style={styles.safetyStepItem}>
                                    <View style={[styles.stepNumBadge, { backgroundColor: '#10B981' }]}>
                                        <Text style={styles.stepNumText}>4</Text>
                                    </View>
                                    <Text style={[styles.safetyStepText, { color: colors.textPrimary }]}>
                                        <Text style={{ fontWeight: '700' }}>Keep children & elders away</Text> from damp walls, floor standing inverters, or humming switchgear.
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Select Your Emergency Hazard */}
                        <Text style={[styles.sectionHeading, { color: colors.textPrimary, marginTop: 20 }]}>
                            Select Your Emergency Situation
                        </Text>

                        <View style={styles.hazardOptions}>
                            {EMERGENCY_HAZARDS.map((hazard) => {
                                const isSelected = selectedHazard === hazard.id;
                                const IconComp = hazard.icon;
                                return (
                                    <TouchableOpacity
                                        key={hazard.id}
                                        onPress={() => setSelectedHazard(hazard.id)}
                                        style={[
                                            styles.hazardItem,
                                            {
                                                backgroundColor: isSelected ? (isDark ? '#1C1917' : '#FEF2F2') : (isDark ? '#18181B' : '#FFFFFF'),
                                                borderColor: isSelected ? '#EF4444' : (isDark ? '#27272A' : '#E4E4E7')
                                            }
                                        ]}
                                    >
                                        <View style={[styles.hazardIconWrap, { backgroundColor: hazard.color + '22' }]}>
                                            <IconComp size={20} color={hazard.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.hazardTitleRow}>
                                                <Text style={[styles.hazardTitle, { color: colors.textPrimary }]}>{hazard.title}</Text>
                                                <Badge variant="error" size="sm">{hazard.severity}</Badge>
                                            </View>
                                            <Text style={[styles.hazardAdvice, { color: colors.textSecondary }]}>
                                                {hazard.advice}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Right Column: Instant Dispatch Form */}
                    <View style={[{ flex: 1 }, isDesktop && { maxWidth: 440 }]}>
                        <Card variant="default" style={[styles.dispatchFormCard, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <View style={styles.formHeader}>
                                <Zap size={22} color="#EF4444" />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                                        Request 90-Min Emergency Visit
                                    </Text>
                                    <Text style={[styles.formSub, { color: colors.textSecondary }]}>
                                        KSELB licensed electrician dispatched with emergency tool kit
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.formBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Your Name</Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="Enter your name"
                                        placeholderTextColor={colors.textTertiary}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                        Mobile Number for Immediate Callback <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="10-digit mobile number"
                                        placeholderTextColor={colors.textTertiary}
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>District</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.districtChipsScroll}>
                                        {KERALA_DISTRICTS.map((d) => (
                                            <TouchableOpacity
                                                key={d.id}
                                                onPress={() => setDistrict(d.name)}
                                                style={[
                                                    styles.districtChip,
                                                    {
                                                        backgroundColor: district === d.name ? '#EF4444' : (isDark ? '#27272A' : '#F4F4F5'),
                                                        borderColor: district === d.name ? '#EF4444' : (isDark ? '#3F3F46' : '#E4E4E7')
                                                    }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.districtChipText,
                                                    { color: district === d.name ? '#FFFFFF' : colors.textSecondary }
                                                ]}>
                                                    {d.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>House Name / Landmark / Locality</Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="e.g. Near Kadavanthra Junction, Flat 3B"
                                        placeholderTextColor={colors.textTertiary}
                                        value={address}
                                        onChangeText={setAddress}
                                    />
                                </View>

                                <View style={[styles.hazardSummaryBox, { backgroundColor: isDark ? '#27272A55' : '#F4F4F5' }]}>
                                    <Text style={[styles.hazardSummaryLabel, { color: colors.textTertiary }]}>Selected Incident:</Text>
                                    <Text style={[styles.hazardSummaryValue, { color: colors.textPrimary }]}>{activeHazardObj.title}</Text>
                                    <View style={styles.feeBreakdownRow}>
                                        <Text style={[styles.feeLabel, { color: colors.textSecondary }]}>Emergency Diagnostic & Triage Fee:</Text>
                                        <Text style={[styles.feeValue, { color: colors.accent }]}>₹499</Text>
                                    </View>
                                    <Text style={[styles.feeNote, { color: colors.textTertiary }]}>
                                        Covers immediate arrival, safety disconnection & up to 60 minutes breakdown rectification.
                                    </Text>
                                </View>

                                <Button
                                    variant="error"
                                    size="lg"
                                    onPress={handleEmergencySubmit}
                                    loading={isSubmitting}
                                    iconLeft={Zap}
                                    style={{ marginTop: 12 }}
                                >
                                    {isSubmitting ? 'Dispatching Nearest Tech...' : '🚨 DISPATCH EMERGENCY TECHNICIAN NOW'}
                                </Button>

                                <View style={styles.guaranteeRow}>
                                    <Shield size={14} color="#10B981" />
                                    <Text style={[styles.guaranteeText, { color: colors.textSecondary }]}>
                                        KSELB Class-A Licensed • ₹5 Lakh Damage Insurance • 30-Day Work Warranty
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                </View>

                {/* Kerala District Response Time Guarantee Table */}
                <View style={styles.slaSection}>
                    <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                        Kerala District Response Times (24/7 Coverage)
                    </Text>

                    <View style={styles.districtGrid}>
                        {KERALA_DISTRICTS.slice(0, 8).map((dist) => (
                            <View key={dist.id} style={[styles.districtCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                <View style={styles.districtCardHeader}>
                                    <MapPin size={16} color={colors.accent} />
                                    <Text style={[styles.districtName, { color: colors.textPrimary }]}>{dist.name}</Text>
                                </View>
                                <Text style={[styles.districtMalayalam, { color: colors.textTertiary }]}>{dist.malayalam}</Text>
                                <View style={styles.districtCardFooter}>
                                    <Badge variant="success" size="sm">{dist.averageArrivalMins} min avg arrival</Badge>
                                    <Text style={[styles.techCount, { color: colors.textSecondary }]}>{dist.availableTechnicians} active tech</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    headerSub: {
        fontSize: 12,
    },
    directCallHeaderBtn: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    directCallHeaderText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroAlert: {
        backgroundColor: '#7F1D1D',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1.5,
        marginBottom: 20,
    },
    heroAlertTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    pulseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
    },
    heroAlertTitle: {
        color: '#FCA5A5',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    heroAlertDesc: {
        color: '#FEE2E2',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    heroActionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    callNowBtn: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        minWidth: 260,
        justifyContent: 'center',
    },
    callNowBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    whatsappNowBtn: {
        backgroundColor: '#25D366',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    whatsappNowBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    gridWrap: {
        gap: 20,
    },
    desktopGrid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    safetyCard: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    safetyCardTitle: {
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
    },
    safetyList: {
        gap: 12,
    },
    safetyStepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepNumBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    stepNumText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    safetyStepText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
    sectionHeading: {
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 12,
    },
    hazardOptions: {
        gap: 10,
    },
    hazardItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        gap: 12,
    },
    hazardIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hazardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
        flexWrap: 'wrap',
        gap: 6,
    },
    hazardTitle: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
    },
    hazardAdvice: {
        fontSize: 12,
        lineHeight: 18,
    },
    dispatchFormCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    formSub: {
        fontSize: 12,
        marginTop: 2,
    },
    formBody: {
        gap: 14,
    },
    inputGroup: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputField: {
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    districtChipsScroll: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    districtChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 6,
    },
    districtChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    hazardSummaryBox: {
        padding: 12,
        borderRadius: 10,
        gap: 4,
    },
    hazardSummaryLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    hazardSummaryValue: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 6,
    },
    feeBreakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feeLabel: {
        fontSize: 12,
    },
    feeValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    feeNote: {
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2,
    },
    guaranteeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
    },
    guaranteeText: {
        fontSize: 11,
        textAlign: 'center',
    },
    slaSection: {
        marginTop: 28,
    },
    districtGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    districtCard: {
        width: '48%',
        flexGrow: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    districtCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    districtName: {
        fontSize: 14,
        fontWeight: '700',
    },
    districtMalayalam: {
        fontSize: 11,
        marginBottom: 8,
    },
    districtCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    techCount: {
        fontSize: 11,
    },
});
