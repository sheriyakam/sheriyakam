import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, CheckCircle2, ShieldCheck, Scale, Award, HardHat, Lock, Send, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';

const AGREEMENT_CLAUSES = [
    {
        title: '1. Independent Contractor Relationship',
        text: 'The Technician is an independent freelance partner and NOT an employee of Sheriyakam Technologies Pvt Ltd. You set your own schedule and maintain full freedom to go online/offline.'
    },
    {
        title: '2. 85% Direct Payout & 15% Platform Commission',
        text: 'You receive 85% of labor charges deposited directly into your bank account via automated gateway splits, plus 100% of approved material costs and doorstep travel allowances.'
    },
    {
        title: '3. Mandatory ISI-Marked Safety Gear (PPE)',
        text: 'You warrant ownership and continuous use of 1000V insulated screwdrivers (IS 13772), 1.1kV shock gloves (IS 4770), safety shoes (IS 15298), and a non-contact voltage tester.'
    },
    {
        title: '4. 30-Day Free Rework Obligation',
        text: 'If a diagnosed electrical repair recurs within 30 days due to execution errors, you agree to revisit and rectify the defect with ₹0 additional visit charges to the customer.'
    },
    {
        title: '5. Zero Arbitrary Deactivation & 48-Hr Right of Appeal',
        text: 'Sheriyakam guarantees zero arbitrary account suspensions. You are entitled to written reasons and a 48-hour right of appeal to the Grievance Redressal Officer.'
    },
];

export default function PartnerAgreementScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [partnerName, setPartnerName] = useState('Sanoop K.');
    const [permitNumber, setPermitNumber] = useState('KL-EL-2021-9482');
    const [agreedTerms, setAgreedTerms] = useState(true);
    const [agreedSafety, setAgreedSafety] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const [isSigned, setIsSigned] = useState(false);

    const handleSignAgreement = () => {
        if (!partnerName.trim() || !permitNumber.trim()) {
            showError('Please confirm your full name and KSELB permit number');
            return;
        }

        if (!agreedTerms || !agreedSafety) {
            showError('You must accept both the independent partner terms and safety covenants');
            return;
        }

        setIsSigning(true);
        setTimeout(() => {
            setIsSigning(false);
            setIsSigned(true);
            success('Technician Partner Agreement signed and registered digitally!', 'Agreement Executed');
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
                    Partner Onboarding Agreement (SLA)
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">Indian Contract Act, 1872</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Independent Electrician Service Agreement
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Binding digital agreement between Sheriyakam Technologies Pvt Ltd and Independent Electrician Partner establishing commission splits, safety standards, and dispute rights.
                    </Text>
                </View>

                {/* Signed Success View or Agreement Form */}
                {isSigned ? (
                    <Card variant="elevated" style={styles.signedCard}>
                        <View style={[styles.signedCircle, { backgroundColor: '#10B98120' }]}>
                            <CheckCircle2 size={48} color="#10B981" />
                        </View>
                        <Text style={[styles.signedTitle, { color: colors.textPrimary }]}>
                            Agreement Digitally Executed
                        </Text>
                        <Text style={[styles.signedDocket, { color: colors.accent }]}>
                            Contract Reference: SHK-SLA-2026-{Math.floor(100000 + Math.random() * 900000)}
                        </Text>
                        <Text style={[styles.signedDesc, { color: colors.textSecondary }]}>
                            Signed by <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{partnerName}</Text> (License: {permitNumber}) on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST.
                        </Text>
                        <Badge variant="success" size="sm" style={{ marginTop: 4 }}>
                            Aadhaar e-KYC Digitally Verified
                        </Badge>
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onPress={() => router.replace('/partner')}
                            style={{ marginTop: 14 }}
                        >
                            Return to Partner Dashboard
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Clauses List */}
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            CORE CONTRACTUAL TERMS & CONDITIONS
                        </Text>

                        <View style={styles.clausesList}>
                            {AGREEMENT_CLAUSES.map((clause, idx) => (
                                <Card key={idx} variant="default" style={styles.clauseCard}>
                                    <Text style={[styles.clauseTitle, { color: colors.textPrimary }]}>
                                        {clause.title}
                                    </Text>
                                    <Text style={[styles.clauseText, { color: colors.textSecondary }]}>
                                        {clause.text}
                                    </Text>
                                </Card>
                            ))}
                        </View>

                        {/* Signer Verification Form */}
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                            ELECTRONIC SIGNATURE & VERIFICATION
                        </Text>

                        <Card variant="default" style={styles.signerCard}>
                            <Input
                                label="Electrician Full Name (as per Aadhaar) *"
                                value={partnerName}
                                onChangeText={setPartnerName}
                                placeholder="Full Legal Name"
                            />

                            <Input
                                label="KSELB Wireman / Supervisor License No *"
                                value={permitNumber}
                                onChangeText={setPermitNumber}
                                placeholder="e.g. KL-EL-2021-9482"
                            />

                            <View style={styles.checksGroup}>
                                <Checkbox
                                    checked={agreedTerms}
                                    onChange={setAgreedTerms}
                                    label="I confirm I am an independent contractor, agree to the 15% platform commission, and understand I am not an employee."
                                />
                                <Checkbox
                                    checked={agreedSafety}
                                    onChange={setAgreedSafety}
                                    label="I warrant ownership of 1000V insulated PPE tools and agree to the 30-day rework warranty on my services."
                                />
                            </View>

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isSigning}
                                onPress={handleSignAgreement}
                                iconLeft={ShieldCheck}
                                style={{ marginTop: 8 }}
                            >
                                e-Sign Partner Agreement
                            </Button>
                        </Card>
                    </>
                )}
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
        lineHeight: 30,
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
    clausesList: {
        gap: 10,
    },
    clauseCard: {
        padding: 14,
        gap: 4,
    },
    clauseTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    clauseText: {
        fontSize: 12,
        lineHeight: 17,
    },
    signerCard: {
        padding: 16,
        gap: 12,
    },
    checksGroup: {
        gap: 10,
        marginVertical: 4,
    },
    signedCard: {
        padding: 22,
        alignItems: 'center',
        gap: 10,
        marginVertical: 14,
    },
    signedCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    signedTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    signedDocket: {
        fontSize: 14,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    signedDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
});
