import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { ShieldCheck, Star, MessageSquarePlus, CheckCircle2, Clock, X, Award } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { getVerifiedReviews, submitVerifiedReview, bookingEvents } from '../constants/bookingStore';

export default function ReviewsSection() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const [reviews, setReviews] = useState(getVerifiedReviews());
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [jobId, setJobId] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const updateReviews = () => {
            setReviews(getVerifiedReviews());
        };
        bookingEvents.on('change', updateReviews);
        return () => bookingEvents.off('change', updateReviews);
    }, []);

    const handleSubmitReview = () => {
        if (!jobId.trim()) {
            Alert.alert('Verification Required', 'Please enter your Booking / Job ID (from your completion receipt) to verify your service.');
            return;
        }
        if (!reviewText.trim()) {
            Alert.alert('Review Required', 'Please share your honest experience with the electrician.');
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
            Alert.alert('Thank You!', 'Your verified review has been published.');
        } else {
            Alert.alert('Verification Check', res.message);
        }
    };

    return (
        <View style={[styles.section, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            {/* Header */}
            <View style={styles.headerWrap}>
                <View style={styles.badgeWrap}>
                    <ShieldCheck size={14} color="#10B981" />
                    <Text style={styles.badgeText}>100% VERIFIED LOCAL FEEDBACK ONLY</Text>
                </View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Early Pilot Feedback
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    No fabricated testimonials. No synthetic ratings. Only genuine feedback from verified doorstep jobs in the Thalassery–Mahe corridor.
                </Text>
            </View>

            {/* Zero Fake Reviews: Transparent Early Pilot Banner */}
            {reviews.length === 0 ? (
                <View style={[styles.pilotCard, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'
                }]}>
                    <View style={styles.pilotIconWrap}>
                        <Clock size={28} color="#F59E0B" />
                    </View>

                    <Text style={[styles.pilotTitle, { color: colors.textPrimary }]}>
                        Live Local Pilot Active in Thalassery & Mahe
                    </Text>

                    <Text style={[styles.pilotDesc, { color: colors.textSecondary }]}>
                        We are currently running our live local trial across Thalassery, Mahe, Dharmadam, Kadirur, Chokli, and Azhiyur. We refuse to publish fake marketing reviews or inflated ratings. Book a service and be among our first verified local homeowners to leave an authentic review.
                    </Text>

                    <View style={styles.pilotPillRow}>
                        <View style={styles.pilotPill}>
                            <CheckCircle2 size={12} color="#10B981" />
                            <Text style={styles.pilotPillText}>OTP-Verified Jobs Only</Text>
                        </View>
                        <View style={styles.pilotPill}>
                            <Award size={12} color="#3B82F6" />
                            <Text style={styles.pilotPillText}>Real Homeowners</Text>
                        </View>
                        <View style={styles.pilotPill}>
                            <ShieldCheck size={12} color="#8B5CF6" />
                            <Text style={styles.pilotPillText}>Zero Fake Stars</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.reviewBtn}
                        onPress={() => setReviewModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <MessageSquarePlus size={16} color="#000" />
                        <Text style={styles.reviewBtnText}>Verify Job ID & Submit Feedback</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.reviewsList}>
                    {reviews.map((rev, idx) => (
                        <View key={rev.id || idx} style={[styles.reviewCard, {
                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E2E8F0'
                        }]}>
                            <View style={styles.reviewHeader}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.reviewerName, { color: colors.textPrimary }]}>{rev.reviewerName || 'Local Homeowner'}</Text>
                                        <View style={styles.verifiedTag}>
                                            <CheckCircle2 size={10} color="#10B981" />
                                            <Text style={styles.verifiedTagText}>VERIFIED JOB</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.reviewMeta, { color: colors.textTertiary }]}>
                                        {rev.service || 'Electrical Repair'} • {rev.taluk || 'Thalassery'}
                                    </Text>
                                </View>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            color="#F59E0B"
                                            fill={star <= (rev.customerRating || 5) ? '#F59E0B' : 'transparent'}
                                        />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                                "{rev.reviewText}"
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.reviewBtn, { marginTop: 14 }]}
                        onPress={() => setReviewModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <MessageSquarePlus size={16} color="#000" />
                        <Text style={styles.reviewBtnText}>Have a Completed Job ID? Leave Feedback</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Genuine Review Modal */}
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
                                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Verified Job Review</Text>
                                <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Only completed jobs with valid OTP are eligible.</Text>
                            </View>
                            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                                <X size={20} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Your Booking ID *</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                color: colors.textPrimary
                            }]}
                            placeholder="e.g. b-active-1 or booking ID"
                            placeholderTextColor={colors.textTertiary}
                            value={jobId}
                            onChangeText={setJobId}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 10 }]}>Your Name (Optional)</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                color: colors.textPrimary
                            }]}
                            placeholder="e.g. Radhakrishnan, Dharmadam"
                            placeholderTextColor={colors.textTertiary}
                            value={reviewerName}
                            onChangeText={setReviewerName}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 10 }]}>Rating</Text>
                        <View style={styles.starSelectRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)} style={{ padding: 4 }}>
                                    <Star
                                        size={24}
                                        color="#F59E0B"
                                        fill={s <= rating ? '#F59E0B' : 'transparent'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 10 }]}>Your Honest Feedback *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, {
                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                color: colors.textPrimary
                            }]}
                            placeholder="Describe how the electrician diagnosed and fixed the issue..."
                            placeholderTextColor={colors.textTertiary}
                            multiline
                            numberOfLines={3}
                            value={reviewText}
                            onChangeText={setReviewText}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setReviewModalVisible(false)}
                            >
                                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalSubmitBtn, { backgroundColor: '#10B981' }]}
                                onPress={handleSubmitReview}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.modalSubmitText}>{isSubmitting ? 'Verifying...' : 'Submit Review'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: 36,
        paddingHorizontal: SPACING.md,
        borderTopWidth: 1,
    },
    headerWrap: {
        alignItems: 'center',
        marginBottom: 24,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 8,
    },
    badgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        maxWidth: 580,
        lineHeight: 19,
    },
    pilotCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        maxWidth: 640,
        alignSelf: 'center',
        width: '100%',
    },
    pilotIconWrap: {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        padding: 12,
        borderRadius: 50,
        marginBottom: 12,
    },
    pilotTitle: {
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    pilotDesc: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 16,
    },
    pilotPillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 18,
    },
    pilotPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    pilotPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#A1A1AA',
    },
    reviewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    reviewBtnText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '800',
    },
    reviewsList: {
        maxWidth: 640,
        alignSelf: 'center',
        width: '100%',
        gap: 12,
    },
    reviewCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '700',
    },
    verifiedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    verifiedTagText: {
        color: '#10B981',
        fontSize: 9,
        fontWeight: '800',
    },
    reviewMeta: {
        fontSize: 11,
        marginTop: 2,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewText: {
        fontSize: 13,
        lineHeight: 19,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
    },
    modalCard: {
        width: '100%',
        maxWidth: 440,
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    modalSub: {
        fontSize: 11,
        marginTop: 2,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
    },
    textArea: {
        height: 72,
        textAlignVertical: 'top',
    },
    starSelectRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 18,
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    modalCancelText: {
        fontSize: 13,
        fontWeight: '600',
    },
    modalSubmitBtn: {
        flex: 1.5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    modalSubmitText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '800',
    },
});
