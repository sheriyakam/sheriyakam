import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldAlert, Phone, Camera, CheckCircle2, Clock, AlertTriangle, FileText, Send, ChevronRight, ShieldCheck, DollarSign, Wrench } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';

const INCIDENT_TYPES = [
    { label: 'Appliance Burnout (AC, Inverter, Fridge)', value: 'appliance_burnout' },
    { label: 'Distribution Board (DB) Fire / Smoldering', value: 'db_fire' },
    { label: 'High Voltage Short Circuit / Flashover', value: 'short_circuit' },
    { label: 'Conduit / Wall Structural Wire Damage', value: 'structural_wire' },
    { label: 'Other Accidental Workmanship Damage', value: 'other' },
];

export default function DamageClaimScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [bookingId, setBookingId] = useState('BK-9482');
    const [incidentType, setIncidentType] = useState('appliance_burnout');
    const [estimatedLoss, setEstimatedLoss] = useState('15000');
    const [description, setDescription] = useState('');
    const [photosCount, setPhotosCount] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filedClaim, setFiledClaim] = useState(null);

    const handleAttachEvidence = () => {
        setPhotosCount((prev) => prev + 1);
        success(`High-resolution damage photo #${photosCount + 1} attached successfully`, 'Photo Attached');
    };

    const handleSubmitClaim = () => {
        if (!bookingId.trim() || !description.trim()) {
            showError('Please provide booking ID and incident description');
            return;
        }

        setIsSubmitting(true);
        const claimDocket = 'SHK-CLM-' + Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
            setIsSubmitting(false);
            setFiledClaim({
                docketId: claimDocket,
                bookingId,
                incident: INCIDENT_TYPES.find((t) => t.value === incidentType)?.label,
                loss: `₹${estimatedLoss}`,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                status: 'SUPERVISOR_DISPATCHED',
                eta: 'Within 2 Hours',
            });
            success(`Emergency Claim Registered: ${claimDocket}`, 'Claim Submitted');
        }, 1200);
    };

    const handleEmergencyCall = () => {
        Linking.openURL('tel:+914952800001').catch(() => {
            success('Calling Emergency Safety Desk (+91 495 280 0001)');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    ₹5 Lakh Property Damage Claim Desk
                </Text>
                <TouchableOpacity onPress={handleEmergencyCall} style={styles.sosBtn} accessibilityRole="button" accessibilityLabel="Emergency SOS Call">
                    <Phone size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Emergency Containment Box */}
                <Card variant="elevated" style={[styles.emergencyBanner, { borderColor: '#EF4444', borderWidth: 1.5 }]}>
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <ShieldAlert size={26} color="#EF4444" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                                Immediate On-Site Safety Protocol
                            </Text>
                            <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
                                1. Trip main isolator/ELCB • 2. Do NOT use water on electrical sparks • 3. Call emergency hotline below.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">₹5,00,000 Safety Cover Guarantee</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Property Damage & Burnout Claims
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Underwritten by Commercial General Liability (CGL Policy #CGL-2026-SHK-9482). Guaranteed rapid inspection by a Senior KSELB Supervisor within 2 hours.
                    </Text>
                </View>

                {/* Claim Submitted View or Form */}
                {filedClaim ? (
                    <Card variant="elevated" style={styles.claimStatusCard}>
                        <View style={[styles.statusIconCircle, { backgroundColor: '#10B98120' }]}>
                            <CheckCircle2 size={44} color="#10B981" />
                        </View>
                        <Text style={[styles.claimStatusTitle, { color: colors.textPrimary }]}>
                            Emergency Claim Registered
                        </Text>
                        <Text style={[styles.claimDocketText, { color: colors.accent }]}>
                            Claim Reference: {filedClaim.docketId}
                        </Text>
                        <Text style={[styles.claimStatusDesc, { color: colors.textSecondary }]}>
                            A senior KSELB Class A Electrical Supervisor has been assigned to inspect the property in Kozhikode.
                        </Text>

                        {/* Progress Stepper */}
                        <View style={styles.stepperContainer}>
                            <View style={styles.stepRow}>
                                <View style={[styles.stepDot, { backgroundColor: '#10B981' }]} />
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>1. Incident Logged & Evidence Locked</Text>
                                    <Text style={[styles.stepSub, { color: colors.textTertiary }]}>{filedClaim.timestamp}</Text>
                                </View>
                            </View>

                            <View style={styles.stepLine} />

                            <View style={styles.stepRow}>
                                <View style={[styles.stepDot, { backgroundColor: colors.accent }]} />
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>2. Senior KSELB Supervisor Inspection</Text>
                                    <Text style={[styles.stepSub, { color: '#10B981', fontWeight: '700' }]}>En Route (ETA: Within 2 Hours)</Text>
                                </View>
                            </View>

                            <View style={styles.stepLine} />

                            <View style={styles.stepRow}>
                                <View style={[styles.stepDot, { backgroundColor: '#71717A' }]} />
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepTitle, { color: colors.textTertiary }]}>3. Insurance Surveyor Appraisal</Text>
                                    <Text style={[styles.stepSub, { color: colors.textTertiary }]}>Within 48 Hours</Text>
                                </View>
                            </View>

                            <View style={styles.stepLine} />

                            <View style={styles.stepRow}>
                                <View style={[styles.stepDot, { backgroundColor: '#71717A' }]} />
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepTitle, { color: colors.textTertiary }]}>4. Direct Bank Settlement / Appliance Replacement</Text>
                                    <Text style={[styles.stepSub, { color: colors.textTertiary }]}>Guaranteed within 7 Business Days</Text>
                                </View>
                            </View>
                        </View>

                        <Button
                            variant="secondary"
                            size="md"
                            fullWidth
                            onPress={() => setFiledClaim(null)}
                            style={{ marginTop: 14 }}
                        >
                            Submit Additional Incident Information
                        </Button>
                    </Card>
                ) : (
                    <Card variant="default" style={styles.formCard}>
                        <Input
                            label="Booking Reference ID *"
                            value={bookingId}
                            onChangeText={setBookingId}
                            placeholder="e.g. BK-9482"
                        />

                        <Dropdown
                            label="Incident Category *"
                            options={INCIDENT_TYPES}
                            value={incidentType}
                            onSelect={setIncidentType}
                        />

                        <Input
                            label="Estimated Appliance / Property Loss (INR) *"
                            value={estimatedLoss}
                            onChangeText={setEstimatedLoss}
                            placeholder="e.g. 15000"
                            keyboardType="number-pad"
                        />

                        <TextArea
                            label="Detailed Incident Statement *"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what occurred, affected appliances, circuit trips, or damage observations..."
                        />

                        {/* Evidence Upload */}
                        <View style={styles.evidenceBox}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[styles.evidenceLabel, { color: colors.textPrimary }]}>
                                    High-Resolution Photo Evidence ({photosCount} Attached)
                                </Text>
                                <Badge variant="info" size="sm">Timestamped</Badge>
                            </View>
                            <Button
                                variant="outline"
                                size="sm"
                                iconLeft={Camera}
                                onPress={handleAttachEvidence}
                                style={{ marginTop: 6 }}
                            >
                                Attach Damage Photo / Video
                            </Button>
                        </View>

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isSubmitting}
                            onPress={handleSubmitClaim}
                            iconLeft={Send}
                            style={{ marginTop: 8 }}
                        >
                            Submit Claim for 2-Hr Inspection
                        </Button>
                    </Card>
                )}

                {/* Statutory Guarantee Badge */}
                <Card variant="default" style={styles.guaranteeCard}>
                    <ShieldCheck size={22} color="#10B981" />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.guaranteeTitle, { color: colors.textPrimary }]}>
                            ₹5,00,000 Zero-Deductible Policy
                        </Text>
                        <Text style={[styles.guaranteeDesc, { color: colors.textSecondary }]}>
                            If an authorized on-platform electrician causes accidental electrical damage to your wiring, appliances, or premises, Sheriyakam covers 100% of approved repair/replacement costs.
                        </Text>
                    </View>
                </Card>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    sosBtn: {
        padding: 6,
        backgroundColor: '#EF444420',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    emergencyBanner: {
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: '800',
    },
    bannerSub: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 10,
        gap: 6,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.4,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
    formCard: {
        padding: 16,
        gap: 12,
    },
    evidenceBox: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 4,
    },
    evidenceLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    claimStatusCard: {
        padding: 20,
        alignItems: 'center',
        gap: 10,
    },
    statusIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    claimStatusTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    claimDocketText: {
        fontSize: 15,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    claimStatusDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    stepperContainer: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 8,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 2,
    },
    stepLine: {
        width: 2,
        height: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 6,
        marginVertical: 2,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    stepSub: {
        fontSize: 11,
        marginTop: 1,
    },
    guaranteeCard: {
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    guaranteeTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    guaranteeDesc: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 2,
    },
});
