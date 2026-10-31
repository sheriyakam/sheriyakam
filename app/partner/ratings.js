import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Star, Award, Shield, CheckCircle,
    TrendingUp, ThumbsUp, HeartHandshake, Zap, Info,
    Lock, CheckCheck, Flame, Compass, Sparkles, Building
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK, TIERS_CONFIG } from '../../constants/partnerStore';

export default function PartnerRatings() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const ratings = partner.ratings || DEFAULT_PARTNER_MOCK.ratings;

    const customerReviews = [
        {
            id: 'rev-1',
            name: 'Anoop Krishnan',
            district: 'Kozhikode District',
            date: 'Yesterday',
            service: 'Short Circuit & MCB Tripping',
            rating: 5,
            comment: 'Arrived within 20 minutes at night! Isolated the fault in the distribution box immediately without cutting off other rooms. Very professional and followed all KSELB safety codes.',
        },
        {
            id: 'rev-2',
            name: 'Sreelakshmi R.',
            district: 'Ernakulam District',
            date: '16 Sep 2026',
            service: 'Inverter AC Maintenance',
            rating: 5,
            comment: 'Very clean workmanship. Showed me the before and after coil condition and explained the gas pressure readings transparently.',
        },
        {
            id: 'rev-3',
            name: 'Mohammed Faisal',
            district: 'Kannur District',
            date: '12 Sep 2026',
            service: 'Three-Phase DB Rewiring',
            rating: 4.8,
            comment: 'Punctual, professional tools, tested all earth leakages before taking payment. Best service in Malabar region.',
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Ratings & Job Priority</Text>
                    <Text style={styles.headerSub}>Quality Performance Scoring</Text>
                </View>
                <View style={styles.tierPill}>
                    <Award size={14} color={COLORS.gold} />
                    <Text style={styles.tierPillText}>TIER 1</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Score Hero */}
                <View style={styles.scoreHero}>
                    <View style={styles.starCircle}>
                        <Star size={36} color={COLORS.gold} fill={COLORS.gold} />
                    </View>
                    <Text style={styles.overallRating}>{ratings.overall} ★</Text>
                    <Text style={styles.totalReviewsText}>Based on {ratings.totalReviews} customer reviews</Text>

                    <View style={styles.breakdownRow}>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownVal}>{ratings.punctuality} ★</Text>
                            <Text style={styles.breakdownLabel}>Punctuality</Text>
                        </View>
                        <View style={styles.breakdownDivider} />
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownVal}>{ratings.quality} ★</Text>
                            <Text style={styles.breakdownLabel}>Work Quality</Text>
                        </View>
                        <View style={styles.breakdownDivider} />
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownVal}>{ratings.safety} ★</Text>
                            <Text style={styles.breakdownLabel}>Safety & Codes</Text>
                        </View>
                    </View>
                </View>

                {/* Transparent 4-Tier Performance Matrix */}
                <View style={styles.priorityCard}>
                    <View style={styles.priorityHeader}>
                        <Award size={20} color={COLORS.gold} />
                        <Text style={styles.priorityTitle}>Tiered Grading & Commercial Dispatch</Text>
                    </View>
                    <Text style={styles.priorityDescription}>
                        Your rating, on-time punctuality, and job completion rate directly determine your priority dispatch multiplier and unlock high-value commercial leads across Kerala:
                    </Text>

                    {/* Operational Performance Metrics */}
                    <View style={styles.metricsSummaryRow}>
                        <View style={styles.metricSummaryBox}>
                            <Text style={styles.metricSummaryVal}>{partner.punctualityRate || 97}%</Text>
                            <Text style={styles.metricSummaryLabel}>Punctuality</Text>
                        </View>
                        <View style={styles.metricSummaryBox}>
                            <Text style={styles.metricSummaryVal}>{partner.completionRate || 98}%</Text>
                            <Text style={styles.metricSummaryLabel}>Completion Rate</Text>
                        </View>
                        <View style={styles.metricSummaryBox}>
                            <Text style={[styles.metricSummaryVal, { color: COLORS.gold }]}>1.5x</Text>
                            <Text style={styles.metricSummaryLabel}>Ping Priority</Text>
                        </View>
                    </View>

                    {/* 4 Tiers List */}
                    <View style={styles.tierList}>
                        {TIERS_CONFIG.map(t => {
                            const isCurrent = (partner.loyaltyTier?.tier || 'Gold') === t.tier;
                            return (
                                <View
                                    key={t.tier}
                                    style={[
                                        styles.tierCard,
                                        isCurrent && { borderColor: t.color, backgroundColor: t.bgColor }
                                    ]}
                                >
                                    <View style={styles.tierCardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <Text style={[styles.tierCardBadge, { color: t.color }]}>{t.badge}</Text>
                                                {isCurrent && (
                                                    <View style={[styles.currentTierTag, { backgroundColor: t.color }]}>
                                                        <Text style={styles.currentTierTagText}>CURRENT STATUS</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.tierReqText}>
                                                Rating ≥ {t.minRating}★ • Punctuality ≥ {t.minPunctuality}% • Completion ≥ {t.minCompletion}%
                                            </Text>
                                        </View>
                                        <View style={[styles.multiplierBadge, { borderColor: t.color }]}>
                                            <Text style={[styles.multiplierBadgeText, { color: t.color }]}>{t.multiplier} Pings</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.tierPerksText}>• {t.perks}</Text>

                                    {/* Commercial Leads Scope */}
                                    <View style={styles.leadsScopeBox}>
                                        <Text style={styles.leadsScopeTitle}>COMMERCIAL DISPATCH ACCESS:</Text>
                                        <View style={styles.leadsList}>
                                            {t.unlockedLeads.map((lead, idx) => (
                                                <View key={idx} style={styles.unlockedLeadRow}>
                                                    <CheckCheck size={13} color={COLORS.success} />
                                                    <Text style={styles.unlockedLeadText}>{lead}</Text>
                                                </View>
                                            ))}
                                            {t.lockedLeads.map((lead, idx) => (
                                                <View key={idx} style={styles.lockedLeadRow}>
                                                    <Lock size={12} color={COLORS.textTertiary} />
                                                    <Text style={styles.lockedLeadText}>{lead} (Locked)</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Customer Reviews List */}
                <Text style={styles.sectionTitle}>RECENT CUSTOMER FEEDBACK</Text>
                {customerReviews.map(rev => (
                    <View key={rev.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.reviewName}>{rev.name}</Text>
                                <Text style={styles.reviewDistrict}>{rev.district} • {rev.service}</Text>
                            </View>
                            <View style={styles.ratingTag}>
                                <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
                                <Text style={styles.ratingTagText}>{rev.rating}</Text>
                            </View>
                        </View>
                        <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        gap: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 16,
    },
    headerSub: {
        color: COLORS.textTertiary,
        fontSize: 11,
    },
    tierPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    tierPillText: {
        color: COLORS.gold,
        fontWeight: '900',
        fontSize: 10,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    scoreHero: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        marginBottom: 16,
    },
    starCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    overallRating: {
        color: COLORS.textPrimary,
        fontSize: 34,
        fontWeight: '900',
    },
    totalReviewsText: {
        color: COLORS.textTertiary,
        fontSize: 12,
        marginTop: 2,
    },
    breakdownRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        paddingTop: 14,
        marginTop: 14,
    },
    breakdownItem: {
        flex: 1,
        alignItems: 'center',
    },
    breakdownDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    breakdownVal: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    breakdownLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    priorityCard: {
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.25)',
        marginBottom: 20,
    },
    priorityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    priorityTitle: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    priorityDescription: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    tierList: {
        gap: 8,
    },
    tierRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    activeTierRow: {
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.3)',
    },
    tierDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    tierName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 12,
    },
    tierBenefit: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    sectionTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 12,
    },
    reviewCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewName: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    reviewDistrict: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    ratingTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    ratingTagText: {
        color: COLORS.gold,
        fontWeight: '800',
        fontSize: 11,
    },
    reviewComment: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    reviewDate: {
        color: COLORS.textTertiary,
        fontSize: 10,
    },

    /* Enhanced Tier Grading Styles */
    metricsSummaryRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 12,
    },
    metricSummaryBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    metricSummaryVal: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 18,
    },
    metricSummaryLabel: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    tierCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    tierCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    tierCardBadge: {
        fontWeight: '900',
        fontSize: 14,
    },
    currentTierTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    currentTierTagText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 8,
        letterSpacing: 0.5,
    },
    tierReqText: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    multiplierBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    multiplierBadgeText: {
        fontWeight: '900',
        fontSize: 11,
    },
    tierPerksText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 16,
        marginBottom: 8,
    },
    leadsScopeBox: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 8,
        padding: 8,
        marginTop: 4,
    },
    leadsScopeTitle: {
        color: COLORS.textTertiary,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    leadsList: {
        gap: 3,
    },
    unlockedLeadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    unlockedLeadText: {
        color: COLORS.textPrimary,
        fontSize: 11,
        fontWeight: '600',
    },
    lockedLeadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        opacity: 0.6,
    },
    lockedLeadText: {
        color: COLORS.textTertiary,
        fontSize: 10,
        textDecorationLine: 'line-through',
    },

});
