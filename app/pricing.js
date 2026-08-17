import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Crown, ShieldCheck, Zap, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const STANDARD_RATES = [
    { title: 'Home Inspection & Fault Diagnostic', price: '₹149', desc: 'Full testing of switchboard, earthing, and line shorts. Waived if service booked.' },
    { title: 'Ceiling / Exhaust Fan Repair', price: '₹249', desc: 'Capacitor fix, noise troubleshooting, and regulator replacement.' },
    { title: 'Modular Switchboard Fix (Up to 4 switches)', price: '₹299', desc: 'Burn repair, wiring restoration, and socket replacement.' },
    { title: 'MCB Tripping & Short Circuit Resolution', price: '₹499', desc: 'High-voltage leakage detection and distribution box repair.' },
    { title: 'Inverter & Battery Wiring Setup', price: '₹599', desc: 'DC cabling, bypass wiring, and power balancing.' },
    { title: 'Emergency Night Breakdown Callout (Post 7 PM)', price: '₹799', desc: 'Immediate dispatch within 30 minutes in Kozhikode.' },
];

export default function PricingScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Standard Pricing & Plans</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">100% Fixed Rate Guarantee</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Clear, Transparent Rates. No Bargaining.
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Standardized labor tariffs approved across Kerala. All services include 30-day warranty coverage.
                    </Text>
                </View>

                {/* VIP Membership Callout Card */}
                <Card variant="elevated" style={styles.vipCard}>
                    <View style={styles.vipHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Crown size={22} color="#F59E0B" />
                            <Text style={[styles.vipTitle, { color: colors.textPrimary }]}>
                                VIP Annual Protection Club
                            </Text>
                        </View>
                        <Badge variant="gold">₹1,999 / Year</Badge>
                    </View>

                    <Text style={[styles.vipDesc, { color: colors.textSecondary }]}>
                        Get unlimited ₹0 visit fees, 2 full-home electrical safety audits, and 20% discount on all spare parts and rewiring.
                    </Text>

                    <Button
                        variant="primary"
                        size="md"
                        onPress={() => router.push('/paywall')}
                        style={{ alignSelf: 'flex-start', marginTop: 10 }}
                    >
                        Explore VIP Club
                    </Button>
                </Card>

                {/* Standard Rate Cards List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    STANDARD RESIDENTIAL RATE CARD
                </Text>

                <View style={styles.ratesList}>
                    {STANDARD_RATES.map((rate, idx) => (
                        <Card key={idx} variant="default" style={styles.rateCard}>
                            <View style={styles.rateHeader}>
                                <Text style={[styles.rateTitle, { color: colors.textPrimary }]}>
                                    {rate.title}
                                </Text>
                                <Text style={[styles.ratePrice, { color: colors.accent }]}>
                                    {rate.price}
                                </Text>
                            </View>
                            <Text style={[styles.rateDesc, { color: colors.textSecondary }]}>
                                {rate.desc}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Compare link */}
                <Card variant="default" style={styles.compareCard} onPress={() => router.push('/compare')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.compareTitle, { color: colors.textPrimary }]}>
                                How Does Sheriyakam Compare?
                            </Text>
                            <Text style={[styles.compareSub, { color: colors.textTertiary }]}>
                                See our comparison vs local unverified technicians and agencies.
                            </Text>
                        </View>
                        <ChevronRight size={20} color={colors.accent} />
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
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    vipCard: {
        padding: 18,
        marginVertical: 10,
        gap: 8,
    },
    vipHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vipTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    vipDesc: {
        fontSize: 13,
        lineHeight: 19,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    ratesList: {
        gap: 10,
    },
    rateCard: {
        padding: 14,
        gap: 6,
    },
    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    rateTitle: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    ratePrice: {
        fontSize: 16,
        fontWeight: '800',
    },
    rateDesc: {
        fontSize: 12,
        lineHeight: 17,
    },
    compareCard: {
        padding: 16,
        marginTop: 16,
    },
    compareTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    compareSub: {
        fontSize: 12,
        marginTop: 2,
    },
});
