import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Gift, DollarSign, Users, Award, CheckCircle2, ChevronRight, Copy } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card, StatCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function AffiliateScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [copied, setCopied] = useState(false);
    const affiliateUrl = 'https://sheriyakam.com/partner?ref=AFF-KERALA948';

    const handleCopy = () => {
        setCopied(true);
        success('Affiliate tracking link copied!', 'Link Ready');
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Affiliate & Partner Program</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold">Earn With Sheriyakam</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Monetize Your Local Community Network
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Earn recurring commissions and cash payouts by recommending Kerala’s #1 certified electrical repair service to homeowners, apartment associations, and businesses.
                    </Text>
                </View>

                {/* Earnings Highlight Cards */}
                <View style={styles.statsRow}>
                    <StatCard
                        title="Per Booking Payout"
                        value="₹150"
                        icon={DollarSign}
                        iconColor="#10B981"
                    />
                    <StatCard
                        title="VIP Club Cut"
                        value="20%"
                        icon={Award}
                        iconColor="#F59E0B"
                    />
                </View>

                {/* Tracking Link Box */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    YOUR DEDICATED TRACKING LINK
                </Text>
                <Card variant="default" style={styles.linkCard}>
                    <Text numberOfLines={1} style={[styles.urlText, { color: colors.accent }]}>
                        {affiliateUrl}
                    </Text>
                    <Button
                        variant="secondary"
                        size="sm"
                        iconLeft={Copy}
                        onPress={handleCopy}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </Card>

                {/* Tier Perks */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    COMMISSION TIERS
                </Text>
                <Card variant="default" style={styles.tiersCard}>
                    <View style={styles.tierItem}>
                        <View style={[styles.tierBullet, { backgroundColor: colors.accent }]}>
                            <Text style={styles.tierBulletText}>1</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.tierName, { color: colors.textPrimary }]}>
                                Community Advocate (1 - 20 Bookings)
                            </Text>
                            <Text style={[styles.tierDesc, { color: colors.textSecondary }]}>
                                ₹100 per completed booking • Direct weekly UPI payout
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tierItem}>
                        <View style={[styles.tierBullet, { backgroundColor: '#F59E0B' }]}>
                            <Text style={styles.tierBulletText}>2</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.tierName, { color: colors.textPrimary }]}>
                                Master Partner (20+ Bookings / Month)
                            </Text>
                            <Text style={[styles.tierDesc, { color: colors.textSecondary }]}>
                                ₹150 per booking + 20% recurring cut on all VIP Annual Memberships
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* FAQ Prompt */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => success('Partner affiliate dashboard registration complete!', 'Account Upgraded')}
                    style={{ marginTop: 20 }}
                >
                    Apply for Master Affiliate Status
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
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    linkCard: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    urlText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'monospace',
    },
    tiersCard: {
        padding: 16,
        gap: 16,
    },
    tierItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    tierBullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tierBulletText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 11,
    },
    tierName: {
        fontSize: 14,
        fontWeight: '700',
    },
    tierDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
});
