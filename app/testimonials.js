import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, CheckCircle2, MessageSquarePlus, Clock, ShieldCheck, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { getVerifiedReviews, submitVerifiedReview, bookingEvents } from '../constants/bookingStore';

export default function TestimonialsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [reviews, setReviews] = useState(getVerifiedReviews());
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [jobId, setJobId] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const update = () => setReviews(getVerifiedReviews());
        bookingEvents.on('change', update);
        return () => bookingEvents.off('change', update);
    }, []);

    const handleSubmitReview = () => {
        if (!jobId.trim()) {
            Alert.alert('Job ID Required', 'Please enter your completed Booking ID from your service receipt.');
            return;
        }
        if (!reviewText.trim()) {
            Alert.alert('Review Required', 'Please share your honest experience.');
            return;
        }

        setIsSubmitting(true);
        const res = submitVerifiedReview(jobId.trim(), rating, reviewText.trim(), reviewerName.trim());
        setIsSubmitting(false);

        if (res.success) {
            setReviews(getVerifiedReviews());
            setReviewModalVisible(false);
            setJobId('');
            setReviewText('');
            setReviewerName('');
            Alert.alert('Feedback Published', 'Thank you for your authentic local review!');
        } else {
            Alert.alert('Verification Check', res.message);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Verified Local Feedback</Text>
                <TouchableOpacity 
                    onPress={() => setReviewModalVisible(true)}
                    style={styles.reviewBtn}
                >
                    <MessageSquarePlus size={20} color={colors.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Authentic Trust Header */}
                <Card variant="elevated" style={styles.scoreCard}>
                    <View style={styles.scoreTop}>
                        <View style={styles.pilotIconWrap}>
                            <ShieldCheck size={28} color="#10B981" />
                        </View>
                        <View style={{ flex: 1, gap: 4 }}>
                            <Badge variant="success" size="sm">100% Genuine Local Feedback</Badge>
                            <Text style={[styles.scoreTitle, { color: colors.textPrimary }]}>
                                Thalassery & Mahe Pilot Feedback
                            </Text>
                            <Text style={[styles.scoreMeta, { color: colors.textTertiary }]}>
                                Zero fake testimonials. Zero fabricated stars. Only reviews from customer OTP-verified jobs.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Reviews List or Honest Zero State */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    VERIFIED RESIDENTIAL REVIEWS
                </Text>

                {reviews.length === 0 ? (
                    <Card variant="default" style={styles.pilotZeroCard}>
                        <Clock size={32} color="#F59E0B" style={{ marginBottom: 10 }} />
                        <Text style={[styles.pilotZeroTitle, { color: colors.textPrimary }]}>
                            Live Local Trial in Progress
                        </Text>
                        <Text style={[styles.pilotZeroDesc, { color: colors.textSecondary }]}>
                            We are currently running our live local trial across Thalassery and Mahe. Book a service and be among our first verified local homeowners to leave an authenticated review.
                        </Text>
                        <TouchableOpacity
                            style={styles.submitPromptBtn}
                            onPress={() => setReviewModalVisible(true)}
                        >
                            <MessageSquarePlus size={16} color="#000" />
                            <Text style={styles.submitPromptText}>Verify Job ID & Submit Review</Text>
                        </TouchableOpacity>
                    </Card>
                ) : (
                    <View style={styles.reviewsList}>
                        {reviews.map((rev) => (
                            <Card key={rev.id} variant="default" style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Avatar name={rev.reviewerName || 'Customer'} size={42} />
                                    <View style={styles.reviewerInfo}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={[styles.reviewerName, { color: colors.textPrimary }]}>
                                                {rev.reviewerName || 'Local Homeowner'}
                                            </Text>
                                            <CheckCircle2 size={14} color="#10B981" />
                                        </View>
                                        <Text style={[styles.reviewerLoc, { color: colors.textTertiary }]}>
                                            {rev.taluk || 'Thalassery–Mahe Corridor'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.serviceBadgeRow}>
                                    <Badge variant="info" size="sm">{rev.service || 'Electrical Service'}</Badge>
                                    <View style={{ flexDirection: 'row', gap: 2 }}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={13} color="#F59E0B" fill={s <= (rev.customerRating || 5) ? '#F59E0B' : 'transparent'} />
                                        ))}
                                    </View>
                                </View>

                                <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                                    "{rev.reviewText}"
                                </Text>
                            </Card>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Review Submission Modal */}
            <Modal
                visible={reviewModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderColor: isDark ? '#27272A' : '#E2E8F0'
                    }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Verify Job & Review</Text>
                                <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Enter your completed job reference.</Text>
                            </View>
                            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                                <X size={20} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Job / Booking ID *</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                color: colors.textPrimary
                            }]}
                            placeholder="e.g. b-active-1"
                            placeholderTextColor={colors.textTertiary}
                            value={jobId}
                            onChangeText={setJobId}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 10 }]}>Your Name & Area (Optional)</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                color: colors.textPrimary
                            }]}
                            placeholder="e.g. Sreekumar, Dharmadam"
                            placeholderTextColor={colors.textTertiary}
                            value={reviewerName}
                            onChangeText={setReviewerName}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 10 }]}>Rating</Text>
                        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Star size={24} color="#F59E0B" fill={s <= rating ? '#F59E0B' : 'transparent'} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 8 }]}>Your Feedback *</Text>
                        <TextInput
                            style={[styles.input, { height: 70, textAlignVertical: 'top', backgroundColor: isDark ? '#27272A' : '#F8FAFC', borderColor: isDark ? '#3F3F46' : '#CBD5E1', color: colors.textPrimary }]}
                            placeholder="Describe how the repair was completed..."
                            placeholderTextColor={colors.textTertiary}
                            multiline
                            numberOfLines={3}
                            value={reviewText}
                            onChangeText={setReviewText}
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setReviewModalVisible(false)}>
                                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: '#10B981' }]} onPress={handleSubmitReview} disabled={isSubmitting}>
                                <Text style={styles.modalSubmitText}>{isSubmitting ? 'Verifying...' : 'Submit Feedback'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '700' },
    reviewBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: SPACING.md, paddingBottom: 60 },
    scoreCard: { padding: 18, borderRadius: 16, marginBottom: 12 },
    scoreTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    pilotIconWrap: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        padding: 10,
        borderRadius: 50,
    },
    scoreTitle: { fontSize: 16, fontWeight: '800' },
    scoreMeta: { fontSize: 12, lineHeight: 17 },
    sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
    pilotZeroCard: { padding: 24, borderRadius: 16, alignItems: 'center' },
    pilotZeroTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
    pilotZeroDesc: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 16 },
    submitPromptBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    submitPromptText: { color: '#000', fontSize: 13, fontWeight: '800' },
    reviewsList: { gap: 12 },
    reviewCard: { padding: 16, borderRadius: 14 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
    reviewerInfo: { flex: 1 },
    reviewerName: { fontSize: 14, fontWeight: '700' },
    reviewerLoc: { fontSize: 11, marginTop: 2 },
    serviceBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    commentText: { fontSize: 13, lineHeight: 19, fontStyle: 'italic' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
    },
    modalCard: { width: '100%', maxWidth: 440, borderRadius: 16, borderWidth: 1, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
    modalTitle: { fontSize: 16, fontWeight: '800' },
    modalSub: { fontSize: 11, marginTop: 2 },
    fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
    modalCancelBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    modalCancelText: { fontSize: 13, fontWeight: '600' },
    modalSubmitBtn: { flex: 1.5, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    modalSubmitText: { color: '#000', fontSize: 13, fontWeight: '800' },
});
