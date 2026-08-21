import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Award, DollarSign, Shield, FileText, CheckCircle2, TrendingUp, Sparkles, Building2, ExternalLink } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const STARTUP_BENEFITS = [
    {
        title: 'Section 80-IAC 100% Income Tax Holiday',
        authority: 'Ministry of Finance / CBDT',
        tag: '3 Years 100% Tax Free',
        color: '#10B981',
        desc: 'Eligible DPIIT startups claim 100% deduction on corporate income profits for 3 consecutive financial years out of their first 10 years.',
    },
    {
        title: 'Section 56(2)(viib) Angel Tax Exemption',
        authority: 'Central Board of Direct Taxes',
        tag: 'Tax-Free Equity',
        color: '#3B82F6',
        desc: 'Complete exemption from taxes on angel investments received above Fair Market Value (FMV) up to an aggregate ₹25 Crore ceiling.',
    },
    {
        title: '80% Patent & 50% Trademark Rebate',
        authority: 'Controller General of Patents (CGPDTM)',
        tag: 'IPR Subsidies',
        color: '#F59E0B',
        desc: 'Substantial fee reductions on brand trademark and dispatch patent filings, with free government-empanelled legal facilitators.',
    },
    {
        title: 'GeM Government Tender Procurement',
        authority: 'Government e-Marketplace',
        tag: 'Zero Turnover Barrier',
        color: '#8B5CF6',
        desc: 'Exemption from "Prior Turnover" and "Prior Experience" criteria when bidding on state/central PSU electrical maintenance contracts.',
    },
    {
        title: 'Kerala Startup Mission (KSUM) Grants',
        authority: 'Government of Kerala',
        tag: '₹15 Lakhs Seed Grant',
        color: '#EC4899',
        desc: 'Direct state seed funding grants, subsidized co-working space in Kozhikode Cyberpark, and cloud hosting credits ($100k AWS/GCP).',
    },
    {
        title: '3-Year Self-Certification Compliance',
        authority: 'Ministry of Labour & Employment',
        tag: 'Zero Inspector Visits',
        color: '#6366F1',
        desc: 'Self-certification under 6 labor laws and 3 environmental laws for 36 months without random offline inspector audits.',
    },
];

export default function StartupBenefitsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleOpenPortal = () => {
        Linking.openURL('https://www.startupindia.gov.in').catch(() => {
            success('Opening National Startup India Portal...', 'Redirecting');
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
                    Startup India (DPIIT) Benefits
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <Card variant="elevated" style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={{ flex: 1 }}>
                            <Badge variant="gold" size="md">DPIIT Recognition</Badge>
                            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                                Startup Tax Exemptions & State Grants
                            </Text>
                            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                                Maximizing tax savings, angel funding exemptions, and Kerala Startup Mission (KSUM) incentives for Sheriyakam Technologies Pvt Ltd.
                            </Text>
                        </View>
                        <View style={[styles.heroIconWrap, { backgroundColor: '#F59E0B20' }]}>
                            <Sparkles size={28} color="#F59E0B" />
                        </View>
                    </View>
                </Card>

                {/* Benefits List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    FEDERAL & KERALA STATE STARTUP INCENTIVES
                </Text>

                <View style={styles.benefitsList}>
                    {STARTUP_BENEFITS.map((item, idx) => (
                        <Card key={idx} variant="default" style={styles.benefitCard}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Badge variant="neutral" size="sm">{item.tag}</Badge>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary, marginTop: 4 }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.cardAuth, { color: colors.textTertiary }]}>
                                        Authority: {item.authority}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                                {item.desc}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Apply Action Card */}
                <Card variant="default" style={styles.portalCard}>
                    <Building2 size={24} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.portalTitle, { color: colors.textPrimary }]}>
                            National Startup India Portal
                        </Text>
                        <Text style={[styles.portalSub, { color: colors.textSecondary }]}>
                            Manage DPIIT recognition certificate and Form-2 Section 80-IAC filings.
                        </Text>
                    </View>
                    <Button
                        variant="primary"
                        size="sm"
                        iconRight={ExternalLink}
                        onPress={handleOpenPortal}
                    >
                        Visit Portal
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
        gap: 14,
    },
    heroCard: {
        padding: 18,
        gap: 10,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginTop: 4,
    },
    heroSubtitle: {
        fontSize: 12.5,
        lineHeight: 17,
        marginTop: 2,
    },
    heroIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 2,
        paddingLeft: 2,
    },
    benefitsList: {
        gap: 10,
    },
    benefitCard: {
        padding: 14,
        gap: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    cardAuth: {
        fontSize: 11,
        marginTop: 1,
    },
    cardDesc: {
        fontSize: 12,
        lineHeight: 17,
    },
    portalCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    portalTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    portalSub: {
        fontSize: 11,
        marginTop: 1,
    },
});
