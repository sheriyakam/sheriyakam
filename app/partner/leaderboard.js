import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Trophy, Award, Star, Flame, MapPin,
    IndianRupee, ChevronRight, Zap, CheckCircle2, TrendingUp
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getKeralaLeaderboard, getCurrentPartner, DEFAULT_PARTNER_MOCK } from '../../constants/partnerStore';

export default function PartnerLeaderboard() {
    const router = useRouter();
    const currentPartner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const leaderboard = getKeralaLeaderboard();

    const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'district' | 'malabar'

    const filteredBoard = leaderboard.filter(item => {
        if (activeFilter === 'district') return item.district === 'Kannur';
        if (activeFilter === 'malabar') return ['Kannur', 'Kozhikode', 'Wayanad', 'Kasargod'].includes(item.district);
        return true;
    });

    const topThree = filteredBoard.slice(0, 3);
    const restOfBoard = filteredBoard.slice(3);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Kerala Electrician Leaderboard</Text>
                    <Text style={styles.headerSub}>Week of 15 - 21 September 2026</Text>
                </View>
                <View style={styles.trophyIconWrap}>
                    <Trophy size={20} color={COLORS.gold} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Current Partner Rank Spotlight */}
                <View style={styles.spotlightCard}>
                    <View style={styles.spotlightBadge}>
                        <Flame size={16} color="#F59E0B" />
                        <Text style={styles.spotlightBadgeText}>YOU ARE RANK #1</Text>
                    </View>
                    <Text style={styles.spotlightTitle}>Outstanding Performance, Shyam!</Text>
                    <Text style={styles.spotlightSub}>
                        You have completed 28 jobs this week with a 4.98★ rating. You qualify for the maximum <Text style={{ color: COLORS.success, fontWeight: '800' }}>₹1,800 Weekly Performance Bonus</Text>.
                    </Text>
                    <View style={styles.spotlightMetrics}>
                        <View style={styles.spotlightMetricItem}>
                            <Text style={styles.spotlightMetricVal}>28</Text>
                            <Text style={styles.spotlightMetricLbl}>Jobs Done</Text>
                        </View>
                        <View style={styles.spotlightMetricDivider} />
                        <View style={styles.spotlightMetricItem}>
                            <Text style={styles.spotlightMetricVal}>4.98 ★</Text>
                            <Text style={styles.spotlightMetricLbl}>Customer Rating</Text>
                        </View>
                        <View style={styles.spotlightMetricDivider} />
                        <View style={styles.spotlightMetricItem}>
                            <Text style={[styles.spotlightMetricVal, { color: COLORS.success }]}>+₹1,800</Text>
                            <Text style={styles.spotlightMetricLbl}>Bonus Payout</Text>
                        </View>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
                        onPress={() => setActiveFilter('all')}
                    >
                        <Text style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
                            All 14 Districts
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, activeFilter === 'district' && styles.filterTabActive]}
                        onPress={() => setActiveFilter('district')}
                    >
                        <Text style={[styles.filterTabText, activeFilter === 'district' && styles.filterTabTextActive]}>
                            Kannur / Thalassery
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, activeFilter === 'malabar' && styles.filterTabActive]}
                        onPress={() => setActiveFilter('malabar')}
                    >
                        <Text style={[styles.filterTabText, activeFilter === 'malabar' && styles.filterTabTextActive]}>
                            North Malabar
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Podium for Top 3 */}
                {topThree.length >= 3 && (
                    <View style={styles.podiumContainer}>
                        {/* 2nd Place */}
                        <View style={[styles.podiumCol, styles.podiumSecond]}>
                            <Text style={styles.podiumMedal}>🥈</Text>
                            <View style={styles.podiumAvatar}>
                                <Text style={styles.avatarInitials}>AK</Text>
                            </View>
                            <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].name}</Text>
                            <Text style={styles.podiumTaluk}>{topThree[1].taluk}</Text>
                            <Text style={styles.podiumJobs}>{topThree[1].jobsCompleted} jobs</Text>
                            <View style={styles.podiumBarSecond}>
                                <Text style={styles.podiumBarRank}>2</Text>
                                <Text style={styles.podiumBarBonus}>+₹{topThree[1].bonusEarned}</Text>
                            </View>
                        </View>

                        {/* 1st Place */}
                        <View style={[styles.podiumCol, styles.podiumFirst]}>
                            <Text style={styles.podiumMedal}>👑 🥇</Text>
                            <View style={[styles.podiumAvatar, styles.avatarFirst]}>
                                <Text style={[styles.avatarInitials, { color: '#000' }]}>SP</Text>
                            </View>
                            <Text style={[styles.podiumName, { fontWeight: '900' }]} numberOfLines={1}>{topThree[0].name}</Text>
                            <Text style={styles.podiumTaluk}>{topThree[0].taluk}</Text>
                            <Text style={styles.podiumJobs}>{topThree[0].jobsCompleted} jobs</Text>
                            <View style={styles.podiumBarFirst}>
                                <Text style={styles.podiumBarRank}>1</Text>
                                <Text style={styles.podiumBarBonus}>+₹{topThree[0].bonusEarned}</Text>
                            </View>
                        </View>

                        {/* 3rd Place */}
                        <View style={[styles.podiumCol, styles.podiumThird]}>
                            <Text style={styles.podiumMedal}>🥉</Text>
                            <View style={styles.podiumAvatar}>
                                <Text style={styles.avatarInitials}>SK</Text>
                            </View>
                            <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].name}</Text>
                            <Text style={styles.podiumTaluk}>{topThree[2].taluk}</Text>
                            <Text style={styles.podiumJobs}>{topThree[2].jobsCompleted} jobs</Text>
                            <View style={styles.podiumBarThird}>
                                <Text style={styles.podiumBarRank}>3</Text>
                                <Text style={styles.podiumBarBonus}>+₹{topThree[2].bonusEarned}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Ranks 4-10 List */}
                <Text style={styles.listSectionTitle}>REST OF LEADERBOARD</Text>
                <View style={styles.leaderboardList}>
                    {restOfBoard.map(item => (
                        <View key={item.rank} style={styles.boardItemRow}>
                            <View style={styles.rankCircle}>
                                <Text style={styles.rankNum}>{item.rank}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.boardItemName}>{item.name}</Text>
                                <Text style={styles.boardItemMeta}>
                                    {item.taluk}, {item.district} • {item.rating} ★
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.boardItemJobs}>{item.jobsCompleted} Jobs</Text>
                                <Text style={styles.boardItemBonus}>+₹{item.bonusEarned} Bonus</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Rules & Rewards Footer */}
                <View style={styles.rulesCard}>
                    <Text style={styles.rulesTitle}>HOW LEADERBOARD REWARDS WORK</Text>
                    <Text style={styles.rulesText}>
                        • Rank 1 receives ₹1,800 direct bank bonus on Tuesday payout.{'\n'}
                        • Ranks 2-3 receive ₹1,200 - ₹1,500.{'\n'}
                        • Ranks 4-10 receive ₹500 - ₹1,000 cash rewards.{'\n'}
                        • Rankings reset every Sunday at 11:59 PM. Ties broken by customer rating.
                    </Text>
                </View>
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
    trophyIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },

    /* Spotlight Card */
    spotlightCard: {
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(37, 99, 235, 0.4)',
        marginBottom: 16,
        gap: 8,
    },
    spotlightBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245, 158, 11, 0.18)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    spotlightBadgeText: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    spotlightTitle: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 17,
    },
    spotlightSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
    spotlightMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 4,
    },
    spotlightMetricItem: {
        alignItems: 'center',
    },
    spotlightMetricVal: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 16,
    },
    spotlightMetricLbl: {
        color: COLORS.textTertiary,
        fontSize: 10,
        marginTop: 2,
    },
    spotlightMetricDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    /* Filters */
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    filterTabActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    filterTabText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    filterTabTextActive: {
        color: '#fff',
        fontWeight: '800',
    },

    /* Podium */
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 14,
        paddingHorizontal: 8,
    },
    podiumCol: {
        flex: 1,
        alignItems: 'center',
    },
    podiumFirst: {
        zIndex: 2,
    },
    podiumSecond: {},
    podiumThird: {},
    podiumMedal: {
        fontSize: 18,
        marginBottom: 4,
    },
    podiumAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    avatarFirst: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.gold,
        borderColor: '#fff',
    },
    avatarInitials: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 14,
    },
    podiumName: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    podiumTaluk: {
        color: COLORS.textTertiary,
        fontSize: 10,
        textAlign: 'center',
    },
    podiumJobs: {
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: '800',
        marginTop: 2,
        marginBottom: 6,
    },
    podiumBarFirst: {
        width: '100%',
        height: 100,
        backgroundColor: 'rgba(234, 179, 8, 0.25)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumBarSecond: {
        width: '100%',
        height: 75,
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: '#94A3B8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumBarThird: {
        width: '100%',
        height: 55,
        backgroundColor: 'rgba(217, 119, 6, 0.2)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderColor: '#D97706',
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumBarRank: {
        color: COLORS.textPrimary,
        fontWeight: '900',
        fontSize: 20,
    },
    podiumBarBonus: {
        color: COLORS.success,
        fontWeight: '800',
        fontSize: 11,
    },

    /* Rest of Leaderboard */
    listSectionTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginTop: 16,
        marginBottom: 10,
    },
    leaderboardList: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    boardItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    rankCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankNum: {
        color: COLORS.textSecondary,
        fontWeight: '800',
        fontSize: 12,
    },
    boardItemName: {
        color: COLORS.textPrimary,
        fontSize: 13,
        fontWeight: '700',
    },
    boardItemMeta: {
        color: COLORS.textTertiary,
        fontSize: 11,
        marginTop: 2,
    },
    boardItemJobs: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        fontSize: 13,
    },
    boardItemBonus: {
        color: COLORS.success,
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },

    /* Rules Card */
    rulesCard: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 14,
        padding: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    rulesTitle: {
        color: COLORS.textTertiary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    rulesText: {
        color: COLORS.textSecondary,
        fontSize: 11.5,
        lineHeight: 18,
    },
});
