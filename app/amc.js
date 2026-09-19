import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
    useWindowDimensions, Platform, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, ShieldCheck, Check, Zap, Clock, Calendar,
    Building2, Home, Sparkles, MessageCircle, Phone, ArrowRight
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { sendAMCSubscriptionWhatsApp } from '../utils/whatsapp';
import { validateIndianPhone } from '../utils/validation';

const AMC_PLANS = [
    {
        id: 'home-care',
        title: 'Residential Home Care',
        category: 'Villas & Apartments',
        price: 1999,
        period: '/ year',
        badge: 'Most Popular for Homes',
        badgeVariant: 'warning',
        icon: Home,
        description: 'Complete quarterly preventive electrical care & zero-worry breakdown cover for your home.',
        features: [
            '4 Scheduled Preventive Visits (Every 3 months)',
            'Full DB Board & RCCB Earth Leakage Test',
            'Switchboard terminal tightening & thermal scan',
            'Inverter battery gravity check & terminal cleaning',
            'Fan capacitor speed check & motor lubrication',
            'Unlimited emergency breakdown visits (Priority SLA)',
            '15% Flat Discount on all genuine spare parts',
            'Digital Health Inspection Certificate per visit'
        ]
    },
    {
        id: 'commercial-care',
        title: 'Commercial & Retail Care',
        category: 'Offices, Shops & Clinics',
        price: 4999,
        period: '/ year',
        badge: 'Recommended for Business',
        badgeVariant: 'info',
        icon: Building2,
        description: 'Ensure 99.9% power uptime, fire safety compliance, and energy savings for your facility.',
        features: [
            '6 Bi-Monthly Comprehensive Electrical Audits',
            '3-Phase Load Balancing & Power Factor Check',
            'HVAC / AC MCB trip sensitivity analysis',
            'Dedicated KSELB Licensed Supervisor',
            'Priority 45-Minute Emergency Dispatch Hotline',
            '20% Discount on industrial switchgear & spares',
            'Itemized SAC 9987 GST Input Tax Invoicing',
            'Quarterly Compliance & Energy Efficiency Report'
        ]
    },
    {
        id: 'apartment-care',
        title: 'Apartment & Community Care',
        category: 'Associations & Gated Communities',
        price: 12499,
        period: '/ year',
        badge: 'Enterprise Association',
        badgeVariant: 'success',
        icon: Sparkles,
        description: 'Centralized maintenance for common area switchgear, DG sets, and water booster pumps.',
        features: [
            '12 Monthly Preventive Inspection Visits',
            'Automatic Mains Failure (AMF) & DG Panel Sync',
            'Submersible & Booster Pump Starter Health Check',
            'Common Area Lighting & Solar Inverter Check',
            'Annual Chemical Earth Pit Resistance Testing (<1 Ω)',
            'Official KSELB Safety Sign-off for Building Insurance',
            '24/7 Dedicated Resident Welfare Association Hotline',
            'Customizable SLA with Guaranteed Technicians'
        ]
    }
];

export default function AMCPlansScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const { success, error: toastError } = useToast();

    const [selectedPlan, setSelectedPlan] = useState(AMC_PLANS[0].id);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('Kozhikode');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activePlanObj = AMC_PLANS.find(p => p.id === selectedPlan) || AMC_PLANS[0];

    const handleSubscribeInquiry = () => {
        const phoneValidation = validateIndianPhone(phone);
        if (!phoneValidation.isValid) {
            toastError(phoneValidation.error || 'Please enter your 10-digit mobile number for membership activation.', 'Required');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            success(`Thank you! Your ${activePlanObj.title} activation request is logged. Our representative will contact you to schedule your 1st Preventive Audit.`, 'AMC Activated');
            setName('');
            setPhone('');
        }, 1000);
    };

    const handleWhatsAppConsult = (planTitle) => {
        sendAMCSubscriptionWhatsApp({
            planTitle: planTitle || activePlanObj.title,
            price: activePlanObj.price,
            city,
            name,
            phone
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>Annual Electrical Maintenance Plans (AMC) Kerala | Sheriyakam</title>
                <meta name="description" content="Sheriyakam Care AMC: Preventive quarterly electrical maintenance, earth leakage testing, load balancing & zero-cost breakdown visits for homes and commercial facilities across Kerala." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/amc" />
            </Head>

            {/* Top Navigation */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Sheriyakam Care AMC</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Annual Maintenance Contracts for Kerala</Text>
                </View>
                <TouchableOpacity onPress={() => handleWhatsAppConsult(activePlanObj.title)} style={styles.whatsAppHeaderBtn}>
                    <MessageCircle size={16} color="#FFFFFF" />
                    <Text style={styles.whatsAppHeaderText}>Chat</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <View style={[styles.heroBanner, { backgroundColor: isDark ? '#18181B' : '#0F172A', borderColor: isDark ? '#27272A' : '#1E293B' }]}>
                    <Badge variant="warning" size="md">Zero Breakdown Guarantee</Badge>
                    <Text style={styles.heroTitle}>
                        Annual Electrical Maintenance Contracts (AMC)
                    </Text>
                    <Text style={styles.heroSub}>
                        Prevent hazardous short circuits, avoid costly appliance burnouts, and ensure continuous power reliability with scheduled certified engineer inspections.
                    </Text>

                    <View style={styles.heroPerks}>
                        <View style={styles.heroPerkItem}>
                            <ShieldCheck size={16} color="#10B981" />
                            <Text style={styles.heroPerkText}>KSELB Supervisor Audits</Text>
                        </View>
                        <View style={styles.heroPerkItem}>
                            <Clock size={16} color="#F59E0B" />
                            <Text style={styles.heroPerkText}>Priority 45-Min SLA</Text>
                        </View>
                        <View style={styles.heroPerkItem}>
                            <Zap size={16} color="#3B82F6" />
                            <Text style={styles.heroPerkText}>Free Breakdown Visits</Text>
                        </View>
                    </View>
                </View>

                {/* Plan Selector Cards */}
                <View style={[styles.plansGrid, isDesktop && styles.desktopPlansGrid]}>
                    {AMC_PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        const IconComp = plan.icon;
                        return (
                            <TouchableOpacity
                                key={plan.id}
                                activeOpacity={0.9}
                                onPress={() => setSelectedPlan(plan.id)}
                                style={[
                                    styles.planCard,
                                    {
                                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isSelected ? colors.accent : (isDark ? '#27272A' : '#E4E4E7'),
                                        borderWidth: isSelected ? 2 : 1
                                    }
                                ]}
                            >
                                <View style={styles.planCardHeader}>
                                    <View style={[styles.planIconWrap, { backgroundColor: colors.accent + '22' }]}>
                                        <IconComp size={22} color={colors.accent} />
                                    </View>
                                    <Badge variant={plan.badgeVariant} size="sm">{plan.badge}</Badge>
                                </View>

                                <Text style={[styles.planTitle, { color: colors.textPrimary }]}>{plan.title}</Text>
                                <Text style={[styles.planCategory, { color: colors.textTertiary }]}>{plan.category}</Text>

                                <View style={styles.planPriceRow}>
                                    <Text style={[styles.planCurrency, { color: colors.accent }]}>₹</Text>
                                    <Text style={[styles.planPriceVal, { color: colors.accent }]}>{plan.price.toLocaleString('en-IN')}</Text>
                                    <Text style={[styles.planPeriod, { color: colors.textTertiary }]}>{plan.period}</Text>
                                </View>

                                <Text style={[styles.planDesc, { color: colors.textSecondary }]}>{plan.description}</Text>

                                <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                                <View style={styles.featuresList}>
                                    {plan.features.map((feat, idx) => (
                                        <View key={idx} style={styles.featureItem}>
                                            <Check size={15} color="#10B981" style={{ marginTop: 2 }} />
                                            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feat}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Button
                                    variant={isSelected ? "primary" : "outline"}
                                    size="md"
                                    onPress={() => setSelectedPlan(plan.id)}
                                    style={{ marginTop: 16 }}
                                >
                                    {isSelected ? "Selected Plan" : "Choose Plan"}
                                </Button>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Activation Form */}
                <Card variant="default" style={[styles.activationCard, { marginTop: 24 }]}>
                    <View style={styles.activationHeader}>
                        <Zap size={22} color={colors.accent} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.activationTitle, { color: colors.textPrimary }]}>
                                Activate {activePlanObj.title} (₹{activePlanObj.price.toLocaleString('en-IN')}/yr)
                            </Text>
                            <Text style={[styles.activationSub, { color: colors.textSecondary }]}>
                                Our certified team will schedule your initial comprehensive electrical audit.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Your Name</Text>
                            <TextInput
                                style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                placeholder="Enter your full name"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Mobile Number *</Text>
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
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>City / District</Text>
                            <TextInput
                                style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                placeholder="e.g. Kozhikode, Kannur, Kochi"
                                placeholderTextColor={colors.textTertiary}
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                    </View>

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleSubscribeInquiry}
                        loading={isSubmitting}
                        iconRight={ArrowRight}
                        style={{ marginTop: 14 }}
                    >
                        Request Membership Activation • ₹{activePlanObj.price.toLocaleString('en-IN')}/yr
                    </Button>
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
    },
    headerSub: {
        fontSize: 12,
    },
    whatsAppHeaderBtn: {
        backgroundColor: '#25D366',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    whatsAppHeaderText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroBanner: {
        padding: 24,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 20,
        gap: 12,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.3,
        lineHeight: 32,
    },
    heroSub: {
        color: '#CBD5E1',
        fontSize: 14,
        lineHeight: 22,
    },
    heroPerks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 8,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    heroPerkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    heroPerkText: {
        color: '#E2E8F0',
        fontSize: 12,
        fontWeight: '700',
    },
    plansGrid: {
        gap: 16,
    },
    desktopPlansGrid: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    planCard: {
        flex: 1,
        padding: 20,
        borderRadius: 18,
        justifyContent: 'space-between',
    },
    planCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    planIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 2,
    },
    planCategory: {
        fontSize: 12,
        marginBottom: 12,
    },
    planPriceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
        marginBottom: 10,
    },
    planCurrency: {
        fontSize: 18,
        fontWeight: '800',
    },
    planPriceVal: {
        fontSize: 32,
        fontWeight: '900',
    },
    planPeriod: {
        fontSize: 13,
        marginLeft: 4,
    },
    planDesc: {
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    featuresList: {
        gap: 10,
        flex: 1,
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    featureText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
    },
    activationCard: {
        padding: 20,
        borderRadius: 18,
    },
    activationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    activationTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    activationSub: {
        fontSize: 12,
        marginTop: 2,
    },
    formRow: {
        gap: 12,
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
});
