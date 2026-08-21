import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, CheckCircle2, UserCheck, HardHat, FileText, Upload, AlertCircle, Wrench, Shield, Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

const PPE_CHECKLIST = [
    { id: 'ppe_1', label: '1000V VDE Insulated Screwdrivers & Pliers (IS 13772)', required: true },
    { id: 'ppe_2', label: '1.1kV Electrical Shock Resistant Rubber Gloves (IS 4770)', required: true },
    { id: 'ppe_3', label: 'Non-Contact AC Voltage Detector & Neon Tester Pen', required: true },
    { id: 'ppe_4', label: 'Industrial Grade Insulated Safety Boots (IS 15298)', required: true },
    { id: 'ppe_5', label: 'ISI Marked Polycarbonate Safety Helmet / Eyewear', required: true },
];

export default function PartnerOnboardingChecklistScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [eshramUAN, setEshramUAN] = useState('1294-8201-9482');
    const [kselbPermit, setKselbPermit] = useState('KL-EL-2021-9482');
    const [pvcDocNumber, setPvcDocNumber] = useState('KLP-PVC-2026-8812');
    const [ppeChecked, setPpeChecked] = useState({
        ppe_1: true,
        ppe_2: true,
        ppe_3: true,
        ppe_4: true,
        ppe_5: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePpe = (id) => {
        setPpeChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleVerifyAndSubmit = () => {
        if (!eshramUAN.trim() || !kselbPermit.trim() || !pvcDocNumber.trim()) {
            showError('Please provide all statutory registration numbers');
            return;
        }

        const allPpeVerified = Object.values(ppeChecked).every(Boolean);
        if (!allPpeVerified) {
            showError('All 5 mandatory PPE safety gear items must be verified before field dispatch');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            success('Statutory BGV & Safety Checklist approved! You are active for dispatch.', 'Partner Onboarded');
            router.replace('/partner');
        }, 1200);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Partner BGV & Safety Verification
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">Code on Social Security 2020</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Electrician Statutory Onboarding & Toolkit Audit
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Mandatory compliance verification ensuring Kerala government licensing, e-Shram welfare registry, police clearance, and 1000V shock protection standards.
                    </Text>
                </View>

                {/* Section 1: Statutory Registrations */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    1. STATUTORY LABOR & LICENSING REGISTRATIONS
                </Text>

                <Card variant="default" style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                                e-Shram Universal Account Number (UAN) *
                            </Text>
                            <Badge variant="success" size="sm">Govt Welfare</Badge>
                        </View>
                        <Input
                            value={eshramUAN}
                            onChangeText={setEshramUAN}
                            placeholder="12-digit UAN number"
                            keyboardType="number-pad"
                        />
                        <Text style={[styles.helperText, { color: colors.textTertiary }]}>
                            Mandatory under Code on Social Security 2020 for accidental insurance corpus allocation.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                                KSELB Wireman / Supervisor Permit Number *
                            </Text>
                            <Badge variant="info" size="sm">KSELB Verified</Badge>
                        </View>
                        <Input
                            value={kselbPermit}
                            onChangeText={setKselbPermit}
                            placeholder="e.g. KL-EL-2021-9482"
                        />
                        <Text style={[styles.helperText, { color: colors.textTertiary }]}>
                            Issued by Kerala State Electricity Licensing Board under Central Electricity Authority regulations.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                                Police Verification Certificate (PVC) Docket *
                            </Text>
                            <Badge variant="neutral" size="sm">Kerala Police</Badge>
                        </View>
                        <Input
                            value={pvcDocNumber}
                            onChangeText={setPvcDocNumber}
                            placeholder="PVC Reference Number"
                        />
                        <Text style={[styles.helperText, { color: colors.textTertiary }]}>
                            Character and criminal background clearance from Kerala Police Thuna portal.
                        </Text>
                    </View>
                </Card>

                {/* Section 2: Mandatory PPE Toolkit Standards */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    2. MANDATORY PERSONAL PROTECTIVE EQUIPMENT (PPE)
                </Text>

                <Card variant="elevated" style={styles.ppeCard}>
                    <View style={styles.ppeHeader}>
                        <HardHat size={24} color="#F59E0B" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.ppeTitle, { color: colors.textPrimary }]}>
                                BIS & IS Code Safety Gear Checklist
                            </Text>
                            <Text style={[styles.ppeSub, { color: colors.textSecondary }]}>
                                Field technicians must carry these verified tools on every domestic dispatch.
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <View style={styles.checklist}>
                        {PPE_CHECKLIST.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => togglePpe(item.id)}
                                style={[
                                    styles.checkItem,
                                    {
                                        backgroundColor: ppeChecked[item.id] ? (isDark ? '#27272A50' : '#EFF6FF80') : 'transparent',
                                        borderColor: ppeChecked[item.id] ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                    }
                                ]}
                            >
                                <Checkbox
                                    checked={ppeChecked[item.id]}
                                    onChange={() => togglePpe(item.id)}
                                    label={item.label}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                {/* Section 3: Platform Welfare & Insurance Terms */}
                <Card variant="default" style={styles.insuranceNoticeCard}>
                    <ShieldCheck size={22} color="#10B981" />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.insuranceTitle, { color: colors.textPrimary }]}>
                            ₹5,00,000 Group Personal Accident (GPA) Cover Activated
                        </Text>
                        <Text style={[styles.insuranceDesc, { color: colors.textSecondary }]}>
                            Upon successful verification, your platform GPA insurance policy automatically activates, covering accidental disability, medical treatment, and death benefits during active duty.
                        </Text>
                    </View>
                </Card>

                {/* Submit Action */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    onPress={handleVerifyAndSubmit}
                    iconLeft={CheckCircle2}
                    style={{ marginTop: 14 }}
                >
                    Approve BGV & Activate Field Status
                </Button>
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
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 12,
        gap: 6,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.4,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    formCard: {
        padding: 16,
        gap: 14,
    },
    inputGroup: {
        gap: 4,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
    },
    helperText: {
        fontSize: 11,
        marginTop: 2,
        lineHeight: 15,
    },
    ppeCard: {
        padding: 16,
        gap: 12,
    },
    ppeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ppeTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    ppeSub: {
        fontSize: 12,
        marginTop: 1,
    },
    divider: {
        height: 1,
    },
    checklist: {
        gap: 8,
    },
    checkItem: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    insuranceNoticeCard: {
        padding: 14,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginTop: 14,
    },
    insuranceTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    insuranceDesc: {
        fontSize: 11,
        marginTop: 2,
        lineHeight: 16,
    },
});
