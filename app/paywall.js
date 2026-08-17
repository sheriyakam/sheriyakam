import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Check, ShieldCheck, Zap, Sparkles, Star, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const PLANS = [
    {
        id: 'annual',
        title: 'VIP Home Protection Annual',
        price: '₹1,999',
        period: '/ year',
        savings: 'Save 45%',
        isPopular: true,
        monthlyEquivalent: '₹166/month',
    },
    {
        id: 'quarterly',
        title: 'Quarterly Maintenance Club',
        price: '₹699',
        period: '/ 3 months',
        savings: 'Flexible',
        isPopular: false,
        monthlyEquivalent: '₹233/month',
    },
];

const PERKS = [
    'Unlimited Free Technician Inspection Callouts (₹0 Visit Fee)',
    '2 Free Full-Home Electrical Safety Audits per year',
    'Priority 15-Minute Emergency Response in Kozhikode',
    'Flat 20% Discount on all material replacements & wiring',
    'Dedicated Master Electrician assigned to your property',
    'Free Digital Load Diagnostic Certificate for Insurance',
];

export default function PaywallScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [selectedPlan, setSelectedPlan] = useState('annual');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = () => {
        setIsSubscribing(true);
        setTimeout(() => {
            setIsSubscribing(false);
            success('VIP Electrical Maintenance Club Activated! Enjoy your perks.', 'Welcome to VIP');
            router.replace('/profile');
        }, 1200);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Header */}
                <View style={styles.heroSection}>
                    <View style={[styles.crownWrap, { backgroundColor: '#F59E0B20' }]}>
                        <Crown size={36} color="#F59E0B" />
                    </View>

                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Sheriyakam VIP Club
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Zero visit fees, priority emergency dispatch, and 24/7 electrical peace of mind for your home in Kerala.
                    </Text>
                </View>

                {/* Plan Selection Cards */}
                <View style={styles.plansContainer}>
                    {PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <TouchableOpacity
                                key={plan.id}
                                onPress={() => setSelectedPlan(plan.id)}
                                activeOpacity={0.8}
                                style={[
                                    styles.planCard,
                                    {
                                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isSelected ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                        borderWidth: isSelected ? 2 : 1,
                                    }
                                ]}
                            >
                                {plan.isPopular ? (
                                    <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                                        <Sparkles size={11} color="#FFFFFF" />
                                        <Text style={styles.popularText}>MOST POPULAR</Text>
                                    </View>
                                ) : null}

                                <View style={styles.planHeader}>
                                    <Text style={[styles.planTitle, { color: colors.textPrimary }]}>
                                        {plan.title}
                                    </Text>
                                    <Badge variant={isSelected ? 'gold' : 'neutral'} size="sm">
                                        {plan.savings}
                                    </Badge>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={[styles.planPrice, { color: colors.textPrimary }]}>
                                        {plan.price}
                                    </Text>
                                    <Text style={[styles.planPeriod, { color: colors.textTertiary }]}>
                                        {plan.period}
                                    </Text>
                                </View>

                                <Text style={[styles.monthlyEquiv, { color: colors.textSecondary }]}>
                                    {plan.monthlyEquivalent}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* VIP Perks Checklist */}
                <Card variant="default" style={styles.perksCard}>
                    <Text style={[styles.perksTitle, { color: colors.textPrimary }]}>
                        What's Included in VIP:
                    </Text>

                    <View style={styles.perksList}>
                        {PERKS.map((perk, idx) => (
                            <View key={idx} style={styles.perkRow}>
                                <View style={[styles.checkCircle, { backgroundColor: '#10B98120' }]}>
                                    <Check size={14} color="#10B981" />
                                </View>
                                <Text style={[styles.perkText, { color: colors.textSecondary }]}>
                                    {perk}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Customer Trust Quote */}
                <View style={[styles.trustBox, { backgroundColor: isDark ? '#18181B' : '#EFF6FF' }]}>
                    <View style={{ flexDirection: 'row', gap: 2, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
                        ))}
                    </View>
                    <Text style={[styles.trustQuote, { color: colors.textPrimary }]}>
                        "Saved over ₹4,500 on wiring overhaul and AC isolator setups during my home renovation in Kozhikode."
                    </Text>
                    <Text style={[styles.trustAuthor, { color: colors.textTertiary }]}>
                        — Dr. Radhakrishnan K., Wayanad Road
                    </Text>
                </View>
            </ScrollView>

            {/* Subscribe Action Footer */}
            <View style={[
                styles.footer,
                {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubscribing}
                    onPress={handleSubscribe}
                    iconLeft={Crown}
                >
                    Unlock VIP Membership ({selectedPlan === 'annual' ? '₹1,999/yr' : '₹699/qtr'})
                </Button>
                <Text style={[styles.cancelNotice, { color: colors.textTertiary }]}>
                    Cancel anytime in settings. 100% money-back guarantee within 14 days.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    backBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 110,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: 12,
    },
    crownWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
        maxWidth: 320,
    },
    plansContainer: {
        gap: 12,
        marginVertical: 16,
    },
    planCard: {
        padding: 18,
        borderRadius: 18,
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    popularText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: '800',
    },
    planPeriod: {
        fontSize: 13,
    },
    monthlyEquiv: {
        fontSize: 12,
    },
    perksCard: {
        padding: 18,
        marginVertical: 8,
    },
    perksTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 14,
    },
    perksList: {
        gap: 12,
    },
    perkRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    checkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    perkText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    trustBox: {
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
    },
    trustQuote: {
        fontSize: 13,
        fontStyle: 'italic',
        lineHeight: 19,
        marginBottom: 6,
    },
    trustAuthor: {
        fontSize: 11,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
        alignItems: 'center',
        gap: 8,
    },
    cancelNotice: {
        fontSize: 11,
    },
});
