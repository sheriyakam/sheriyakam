import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';

interface PricingSectionProps {
    onSelectPlan?: (plan: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <Text style={styles.eyebrow}>PRICING</Text>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                Simple pricing, no subscription
            </Text>
            <Text style={[styles.subtext, { color: colors.textSecondary }]}>
                Start free. Buy 30-day packs via one-time payment (UPI, cards, netbanking via Razorpay). Zero recurring subscriptions or auto-renewals.
            </Text>

            <View style={styles.cardsGrid}>
                {/* Free Tier */}
                <View style={[styles.pricingCard, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={[styles.planTitle, { color: colors.textPrimary }]}>Free Tier</Text>
                            <Text style={styles.planSub}>Rolling 5-hour token refill</Text>
                        </View>
                        <Text style={styles.planPriceFree}>$0 Forever</Text>
                    </View>
                    <View style={styles.featuresList}>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Full dual-pane workspace form editor</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 3 tailored rewrites every 5 hours</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 5 ATS score checks every 5 hours</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 5 tailored cover letters every 5 hours</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 15 AI bullet refinements per day</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 1 permanent Canonical Base Resume</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Clean text-selectable single-color vector PDF export</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                        onPress={() => onSelectPlan && onSelectPlan('free')}
                    >
                        <Text style={[styles.btnText, { color: colors.textPrimary }]}>Use Free Tier</Text>
                    </TouchableOpacity>
                </View>

                {/* Lite Pack (Most Popular Ribbon) */}
                <View style={[styles.pricingCard, styles.popularCard, { backgroundColor: isDark ? '#101F1B' : '#F0FDF4' }]}>
                    {/* Ribbon */}
                    <View style={styles.popularRibbon}>
                        <Text style={styles.popularRibbonText}>★ MOST POPULAR</Text>
                    </View>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={[styles.planTitle, { color: colors.textPrimary }]}>Lite Pack</Text>
                            <Text style={styles.planSub}>For active job applications</Text>
                        </View>
                        <Text style={styles.planPriceEmerald}>$2 / 30 Days</Text>
                    </View>
                    <View style={styles.featuresList}>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 30 tailored resumes with ATS score + cover letter</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 50 ATS score audits</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Unlimited AI bullet refinements</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 2 Base Resumes</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Word (.doc) & Vector PDF Export</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: '#10B981' }]}
                        onPress={() => onSelectPlan && onSelectPlan('lite')}
                    >
                        <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Get Lite Pack ($2 USD / ₹169)</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Search Pack */}
                <View style={[styles.pricingCard, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={[styles.planTitle, { color: colors.textPrimary }]}>Active Search</Text>
                            <Text style={styles.planSub}>For intensive search sprints</Text>
                        </View>
                        <Text style={[styles.planPricePrimary, { color: colors.textPrimary }]}>$5 / 30 Days</Text>
                    </View>
                    <View style={styles.featuresList}>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 80 tailored resumes with ATS score + cover letter</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 100 ATS score checks</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Unlimited AI refinements</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• 5 Base Resumes</Text>
                        <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Full LinkedIn Profile Optimizer suite included</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                        onPress={() => onSelectPlan && onSelectPlan('active_search')}
                    >
                        <Text style={[styles.btnText, { color: colors.textPrimary }]}>Get Active Search ($5 USD / ₹419)</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Credit Stacking Explainer Note (FIFO) */}
            <View style={[styles.stackingNote, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: '#3B82F640' }]}>
                <Text style={styles.stackingTitle}>ℹ Credit Stacking Rule (Zero Waste Guarantee):</Text>
                <Text style={[styles.stackingText, { color: colors.textSecondary }]}>
                    Packs stack cleanly, each with its own 30-day validity window. Credits are consumed from the soonest-expiring pack first (FIFO queue). Renewing early never wastes existing credits.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 12
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 0.5
    },
    headline: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3
    },
    subtext: {
        fontSize: 12,
        lineHeight: 18
    },
    cardsGrid: {
        gap: 12
    },
    pricingCard: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
        position: 'relative'
    },
    popularCard: {
        borderWidth: 1.5,
        borderColor: '#10B981'
    },
    popularRibbon: {
        position: 'absolute',
        top: -10,
        right: 12,
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    popularRibbonText: {
        fontSize: 9.5,
        fontWeight: '900',
        color: '#FFFFFF'
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    planTitle: {
        fontSize: 14.5,
        fontWeight: '900'
    },
    planSub: {
        fontSize: 10.5,
        color: '#64748B'
    },
    planPriceFree: {
        fontSize: 16,
        fontWeight: '900',
        color: '#10B981'
    },
    planPriceEmerald: {
        fontSize: 16,
        fontWeight: '900',
        color: '#10B981'
    },
    planPricePrimary: {
        fontSize: 16,
        fontWeight: '900'
    },
    featuresList: {
        gap: 3
    },
    featureItem: {
        fontSize: 11.5,
        lineHeight: 17
    },
    btn: {
        paddingVertical: 9,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 4
    },
    btnText: {
        fontSize: 11.5,
        fontWeight: '800'
    },
    stackingNote: {
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        gap: 2,
        marginTop: 4
    },
    stackingTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#3B82F6'
    },
    stackingText: {
        fontSize: 11,
        lineHeight: 16
    }
});
