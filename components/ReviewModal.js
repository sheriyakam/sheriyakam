import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { X, Star, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ReviewModal = ({ booking, visible, onClose, onSubmit }) => {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [step, setStep] = useState(1);
    const [issueType, setIssueType] = useState(null); // 'technical' | 'behavioral' | null
    const [wantsRevisit, setWantsRevisit] = useState(false);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setRating(0);
            setComment('');
            setIssueType(null);
            setWantsRevisit(false);
        }
    }, [visible]);

    if (!booking) return null;

    const handleSubmit = () => {
        if (rating === 0) return;

        // Mock submission
        setStep(2);

        // Simulate sending red flag if 1 or 2 stars and technical issue
        if ((rating === 1 || rating === 2) && issueType === 'technical') {
            console.log("RED FLAG TICKET CREATED in Admin Dashboard.");
            if (wantsRevisit) {
                console.log("Re-visit requested by user at cost 0.");
            }
        }

        if (onSubmit) {
            onSubmit({ bookingId: booking.id, rating, comment, issueType, wantsRevisit });
        }
    };

    const StarRating = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Star
                            size={32}
                            color={star <= rating ? colors.gold : colors.textTertiary}
                            fill={star <= rating ? colors.gold : 'transparent'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={[styles.container, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>

                            {step === 1 ? (
                                <View style={styles.content}>
                                    <Text style={[styles.title, { color: colors.textPrimary }]}>Write a Review</Text>
                                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                        How was your experience with <Text style={{ color: colors.accent }}>{booking.service}</Text>?
                                    </Text>

                                    <Text style={[styles.label, { color: colors.textPrimary }]}>Rate your experience</Text>
                                    <StarRating />

                                    {(rating === 1 || rating === 2) && (
                                        <View style={[styles.disputeSection, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                                            <Text style={[styles.disputeLabel, { color: colors.danger }]}>Was the issue technical or behavioral?</Text>
                                            <View style={styles.disputeButtons}>
                                                <TouchableOpacity
                                                    style={[styles.disputeBtn, { borderColor: colors.danger }, issueType === 'technical' && { backgroundColor: colors.danger }]}
                                                    onPress={() => setIssueType('technical')}
                                                >
                                                    <Text style={[styles.disputeBtnText, { color: colors.danger }, issueType === 'technical' && { color: '#fff' }]}>Technical</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.disputeBtn, { borderColor: colors.danger }, issueType === 'behavioral' && { backgroundColor: colors.danger }]}
                                                    onPress={() => setIssueType('behavioral')}
                                                >
                                                    <Text style={[styles.disputeBtnText, { color: colors.danger }, issueType === 'behavioral' && { color: '#fff' }]}>Behavioral</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {issueType === 'technical' && (
                                                <View style={[styles.revisitBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                                                    <Text style={[styles.revisitText, { color: colors.textSecondary }]}>A Red Flag ticket will be generated for the Admin.</Text>
                                                    <TouchableOpacity
                                                        style={[styles.revisitBtn, { borderColor: colors.accent, backgroundColor: wantsRevisit ? colors.accent : 'transparent' }]}
                                                        onPress={() => setWantsRevisit(!wantsRevisit)}
                                                    >
                                                        <Text style={[styles.revisitBtnText, { color: wantsRevisit ? '#fff' : colors.accent }]}>
                                                            {wantsRevisit ? "Re-visit Requested" : "Request Re-visit (₹0)"}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    <Text style={[styles.label, { color: colors.textPrimary }]}>Share your feedback</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.bgPrimary }]}
                                        placeholder="Tell us what you liked or didn't like..."
                                        placeholderTextColor={colors.textTertiary}
                                        multiline
                                        numberOfLines={4}
                                        value={comment}
                                        onChangeText={setComment}
                                        textAlignVertical="top"
                                    />

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[styles.submitBtn, { backgroundColor: colors.accent }, rating === 0 && { backgroundColor: colors.bgTertiary, opacity: 0.5 }]}
                                        disabled={rating === 0}
                                    >
                                        <Text style={[styles.submitBtnText, { color: '#fff' }]}>Submit Review</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={[styles.content, styles.successContent]}>
                                    <CheckCircle size={64} color={colors.success} />
                                    <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Thank You!</Text>
                                    <Text style={[styles.successText, { color: colors.textSecondary }]}>
                                        Your review helps us improve our service.
                                    </Text>
                                    <TouchableOpacity onPress={onClose} style={[styles.submitBtn, styles.outlineBtn, { borderColor: colors.border }]}>
                                        <Text style={[styles.submitBtnText, { color: colors.textPrimary }]}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#18181b',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
        fontWeight: '600',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: COLORS.textPrimary,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    submitBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: COLORS.textTertiary,
        opacity: 0.5,
    },
    submitBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
    disputeSection: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    disputeLabel: {
        fontSize: 14,
        color: COLORS.danger,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    disputeButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    disputeBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.danger,
        alignItems: 'center',
    },
    disputeBtnActive: {
        backgroundColor: COLORS.danger,
    },
    disputeBtnText: {
        color: COLORS.danger,
        fontWeight: 'bold',
    },
    disputeBtnTextActive: {
        color: '#fff',
    },
    revisitBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    revisitText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 12,
        textAlign: 'center',
    },
    revisitBtn: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.accent,
        width: '100%',
        alignItems: 'center',
    },
    revisitBtnActive: {
        backgroundColor: COLORS.accent,
    },
    revisitBtnText: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    revisitBtnTextActive: {
        color: '#fff',
    }
});

export default ReviewModal;
