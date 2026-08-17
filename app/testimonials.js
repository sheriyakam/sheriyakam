import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Filter } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';

const TESTIMONIALS = [
    {
        id: 'rev_1',
        name: 'Dr. Radhakrishnan K.',
        location: 'Civil Station, Kozhikode',
        service: 'Main MCB Tripping Diagnostic',
        rating: 5,
        date: '3 days ago',
        comment: 'Sanoop arrived within 18 minutes of my emergency booking. He used digital insulation testers to locate a concealed wire short behind our kitchen tile. Outstanding trade discipline and zero bargaining.',
        likes: 24,
    },
    {
        id: 'rev_2',
        name: 'Fathima Noor',
        location: 'Nut Street, Vadakara',
        service: 'Inverter & Battery Wiring Setup',
        rating: 5,
        date: '1 week ago',
        comment: 'Very professional DC cabling for our 150Ah tubular battery setup. Left the work area completely clean and provided a digital GST invoice on WhatsApp right away.',
        likes: 18,
    },
    {
        id: 'rev_3',
        name: 'Manoj Kumar P.',
        location: 'Thamarassery Town',
        service: 'Ceiling Fan Noise Troubleshooting',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Fixed two old Usha fans that were wobbling and making clicking noise. Replaced capacitor and balanced the downrod. Cost only ₹249 per fan as stated on the rate card.',
        likes: 12,
    },
    {
        id: 'rev_4',
        name: 'Kavitha Ramachandran',
        location: 'Koyilandy Beach Road',
        service: 'AC 25A Isolator Mounting',
        rating: 4.8,
        date: '3 weeks ago',
        comment: 'Polite electrician, arrived exactly at 10 AM as scheduled. Tested earthing loop impedance before turning the breaker on. Highly recommend Sheriyakam for domestic safety.',
        likes: 9,
    },
];

export default function TestimonialsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [activeFilter, setActiveFilter] = useState('all');

    const handleLike = (id) => {
        success('Thank you for your feedback!');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Customer Reviews</Text>
                <TouchableOpacity 
                    onPress={() => success('Review submission modal opened')}
                    style={styles.reviewBtn}
                >
                    <MessageSquarePlus size={20} color={colors.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Score Header */}
                <Card variant="elevated" style={styles.scoreCard}>
                    <View style={styles.scoreTop}>
                        <Text style={[styles.scoreBig, { color: colors.textPrimary }]}>4.9</Text>
                        <View style={{ gap: 2 }}>
                            <View style={{ flexDirection: 'row', gap: 2 }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={18} color="#F59E0B" fill="#F59E0B" />
                                ))}
                            </View>
                            <Text style={[styles.scoreMeta, { color: colors.textTertiary }]}>
                                Based on 1,480+ verified Kerala domestic repairs
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Reviews List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    VERIFIED RESIDENTIAL REVIEWS
                </Text>

                <View style={styles.reviewsList}>
                    {TESTIMONIALS.map((rev) => (
                        <Card key={rev.id} variant="default" style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Avatar name={rev.name} size={42} />
                                <View style={styles.reviewerInfo}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.reviewerName, { color: colors.textPrimary }]}>
                                            {rev.name}
                                        </Text>
                                        <CheckCircle2 size={14} color="#10B981" />
                                    </View>
                                    <Text style={[styles.reviewerLoc, { color: colors.textTertiary }]}>
                                        {rev.location}
                                    </Text>
                                </View>
                                <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
                                    {rev.date}
                                </Text>
                            </View>

                            <View style={styles.serviceBadgeRow}>
                                <Badge variant="info" size="sm">{rev.service}</Badge>
                                <View style={{ flexDirection: 'row', gap: 2 }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />
                                    ))}
                                </View>
                            </View>

                            <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                                "{rev.comment}"
                            </Text>

                            <View style={styles.reviewFooter}>
                                <TouchableOpacity 
                                    onPress={() => handleLike(rev.id)}
                                    style={styles.likeBtn}
                                >
                                    <ThumbsUp size={14} color={colors.textTertiary} />
                                    <Text style={[styles.likeCount, { color: colors.textTertiary }]}>
                                        Helpful ({rev.likes})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
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
    reviewBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    scoreCard: {
        padding: 20,
    },
    scoreTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    scoreBig: {
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: -1,
    },
    scoreMeta: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    reviewsList: {
        gap: 12,
    },
    reviewCard: {
        padding: 16,
        gap: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '700',
    },
    reviewerLoc: {
        fontSize: 12,
        marginTop: 1,
    },
    reviewDate: {
        fontSize: 11,
    },
    serviceBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    commentText: {
        fontSize: 13,
        lineHeight: 19,
    },
    reviewFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 4,
    },
    likeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    likeCount: {
        fontSize: 12,
    },
});
