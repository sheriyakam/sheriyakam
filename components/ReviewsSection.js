import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Star, CheckCircle, ThumbsUp, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';

const REVIEWS_DATA = [
    {
        id: 'rev-1',
        name: 'Arun K. Nair',
        location: 'Kozhikode (Mavoor Road)',
        service: 'Ceiling Fan Capacitor & Speed Fix',
        category: 'electrical',
        rating: 5,
        date: '18 Sep 2026',
        text: 'The technician arrived in 35 minutes with a genuine 3.15uF capacitor. Fixed the humming noise and restored full fan speed without any hidden charges.',
        verified: true
    },
    {
        id: 'rev-2',
        name: 'Deepa Nambiar',
        location: 'Ernakulam (Kakkanad / InfoPark)',
        service: 'AC Foam Jet Deep Cleaning',
        category: 'ac',
        rating: 5,
        date: '16 Sep 2026',
        text: 'Hospital-grade jet wash with the protective waterproof jacket. No mess on walls or bed. Cooling is ice cold again and the foul odor is completely gone!',
        verified: true
    },
    {
        id: 'rev-3',
        name: 'Sujith M. V.',
        location: 'Kannur (Thalassery)',
        service: 'MCB & Earth Leakage Tripping Overhaul',
        category: 'electrical',
        rating: 5,
        date: '14 Sep 2026',
        text: 'Emergency tripped RCCB at 9:30 PM. Electrician arrived with a megger meter, found neutral wire short in porch light, and fixed it safely within 40 mins.',
        verified: true
    },
    {
        id: 'rev-4',
        name: 'Fathima Raheem',
        location: 'Malappuram (Manjeri)',
        service: 'Water Motor Starter & Air-Lock Fix',
        category: 'plumbing',
        rating: 5,
        date: '12 Sep 2026',
        text: 'Our openwell motor was humming and not lifting water to the overhead tank. The plumber primed the suction line and replaced the start capacitor quickly.',
        verified: true
    },
    {
        id: 'rev-5',
        name: 'Mathew George',
        location: 'Kottayam (Pala)',
        service: '4-Channel CCTV & Remote Phone Setup',
        category: 'cctv',
        rating: 5,
        date: '09 Sep 2026',
        text: 'CCTV setup for our rubber estate villa. Configured Hik-Connect app on my iPhone and my daughter\'s Android. Super clear 2K night vision streaming.',
        verified: true
    },
    {
        id: 'rev-6',
        name: 'Dr. Radhakrishnan P.',
        location: 'Thrissur (Swaraj Round)',
        service: 'Clinic Commercial Safety Audit',
        category: 'commercial',
        rating: 5,
        date: '04 Sep 2026',
        text: 'Class-A engineer provided thermal camera busbar scan and certified earth resistance sign-off for our clinic insurance renewal. Very professional.',
        verified: true
    }
];

const STAR_BREAKDOWN = [
    { stars: 5, percentage: 92, count: '2,282' },
    { stars: 4, percentage: 6, count: '148' },
    { stars: 3, percentage: 1.5, count: '38' },
    { stars: 2, percentage: 0.3, count: '8' },
    { stars: 1, percentage: 0.2, count: '4' },
];

export default function ReviewsSection() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredReviews = activeCategory === 'all'
        ? REVIEWS_DATA
        : REVIEWS_DATA.filter(r => r.category === activeCategory);

    return (
        <View style={[styles.section, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.headerWrap}>
                <View style={styles.badgeWrap}>
                    <ShieldCheck size={14} color="#10B981" />
                    <Text style={styles.badgeText}>100% VERIFIED KERALA HOMEOWNER REVIEWS</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Customer Ratings & Real Feedback
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Rated 4.9/5 across 2,480+ completed electrical, AC & home service jobs in Kerala.
                </Text>
            </View>

            {/* Aggregate Score & Star Distribution Bar */}
            <View style={[
                styles.summaryCard,
                {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                },
                isDesktop && styles.summaryCardDesktop
            ]}>
                {/* Left: Big Score */}
                <View style={styles.scoreBlock}>
                    <Text style={[styles.bigScore, { color: colors.textPrimary }]}>4.9</Text>
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={18} color="#F59E0B" fill="#F59E0B" />
                        ))}
                    </View>
                    <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
                        Based on 2,480 verified ratings
                    </Text>
                </View>

                {/* Right: Breakdown Bars */}
                <View style={styles.breakdownBlock}>
                    {STAR_BREAKDOWN.map((item) => (
                        <View key={item.stars} style={styles.barRow}>
                            <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                                {item.stars} ★
                            </Text>
                            <View style={[styles.barTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}>
                                <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                            </View>
                            <Text style={[styles.barCount, { color: colors.textTertiary }]}>
                                {item.percentage}%
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {[
                    { id: 'all', label: 'All Reviews (2,480)' },
                    { id: 'electrical', label: '⚡ Electrical & Fans' },
                    { id: 'ac', label: '❄️ AC Foam Jet' },
                    { id: 'plumbing', label: '💧 Water Motors & Taps' },
                    { id: 'cctv', label: '📹 CCTV Surveillance' },
                    { id: 'commercial', label: '🏢 Commercial Audits' }
                ].map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                            style={[
                                styles.pill,
                                isSelected ? {
                                    backgroundColor: colors.accent,
                                    borderColor: colors.accent,
                                } : {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                                }
                            ]}
                        >
                            <Text style={[
                                styles.pillText,
                                { color: isSelected ? '#FFFFFF' : (isDark ? '#D4D4D8' : '#475569') }
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Scrollable / Grid Reviews List */}
            <View style={[styles.reviewsGrid, isDesktop && styles.reviewsGridDesktop]}>
                {filteredReviews.map((rev) => (
                    <View
                        key={rev.id}
                        style={[
                            styles.reviewCard,
                            {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                                borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0',
                            },
                            isDesktop && { width: '48.5%' }
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.userMeta}>
                                <View style={styles.avatarCircle}>
                                    <Text style={styles.avatarInitials}>
                                        {rev.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </Text>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                        <Text style={[styles.userName, { color: colors.textPrimary }]}>{rev.name}</Text>
                                        <CheckCircle size={13} color="#10B981" />
                                    </View>
                                    <Text style={[styles.userLoc, { color: colors.textSecondary }]}>{rev.location}</Text>
                                </View>
                            </View>
                            <Text style={[styles.revDate, { color: colors.textTertiary }]}>{rev.date}</Text>
                        </View>

                        <View style={styles.serviceTagWrap}>
                            <Text style={styles.serviceTag}>Booked: {rev.service}</Text>
                        </View>

                        <View style={styles.starsRowSmall}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
                            ))}
                        </View>

                        <Text style={[styles.reviewBody, { color: colors.textSecondary }]}>
                            "{rev.text}"
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: SPACING.xl + 8,
        paddingHorizontal: SPACING.md,
        borderTopWidth: 1,
    },
    headerWrap: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
        gap: 6,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 540,
        lineHeight: 20,
    },
    summaryCard: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        marginBottom: SPACING.lg,
        flexDirection: 'column',
        gap: 20,
    },
    summaryCardDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    scoreBlock: {
        alignItems: 'center',
        gap: 6,
    },
    bigScore: {
        fontSize: 48,
        fontWeight: '900',
        lineHeight: 52,
        letterSpacing: -1,
    },
    starRow: {
        flexDirection: 'row',
        gap: 4,
    },
    totalReviews: {
        fontSize: 12,
        fontWeight: '500',
    },
    breakdownBlock: {
        flex: 1,
        maxWidth: 380,
        gap: 8,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    barLabel: {
        width: 30,
        fontSize: 12,
        fontWeight: '700',
    },
    barTrack: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 4,
    },
    barCount: {
        width: 35,
        fontSize: 11,
        textAlign: 'right',
        fontWeight: '600',
    },
    filterRow: {
        gap: 8,
        paddingBottom: SPACING.md,
    },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '700',
    },
    reviewsGrid: {
        gap: SPACING.md,
    },
    reviewsGridDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    reviewCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
    },
    userLoc: {
        fontSize: 11,
    },
    revDate: {
        fontSize: 11,
    },
    serviceTagWrap: {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    serviceTag: {
        fontSize: 11,
        color: '#3B82F6',
        fontWeight: '600',
    },
    starsRowSmall: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewBody: {
        fontSize: 13,
        lineHeight: 19,
        fontStyle: 'italic',
    }
});
