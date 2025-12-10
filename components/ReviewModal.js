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

const ReviewModal = ({ booking, visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setRating(0);
            setComment('');
        }
    }, [visible]);

    if (!booking) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        // Mock submission
        setStep(2);
        if (onSubmit) {
            onSubmit({ bookingId: booking.id, rating, comment });
        }
    };

    const StarRating = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Star
                            size={32}
                            color={star <= rating ? COLORS.gold : COLORS.textTertiary}
                            fill={star <= rating ? COLORS.gold : 'transparent'}
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
                        <View style={styles.container}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {step === 1 ? (
                                <View style={styles.content}>
                                    <Text style={styles.title}>Write a Review</Text>
                                    <Text style={styles.subtitle}>
                                        How was your experience with <Text style={{ color: COLORS.accent }}>{booking.service}</Text>?
                                    </Text>

                                    <Text style={styles.label}>Rate your experience</Text>
                                    <StarRating />

                                    <Text style={styles.label}>Share your feedback</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tell us what you liked or didn't like..."
                                        placeholderTextColor={COLORS.textTertiary}
                                        multiline
                                        numberOfLines={4}
                                        value={comment}
                                        onChangeText={setComment}
                                        textAlignVertical="top"
                                    />

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[styles.submitBtn, rating === 0 && styles.disabledBtn]}
                                        disabled={rating === 0}
                                    >
                                        <Text style={styles.submitBtnText}>Submit Review</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={[styles.content, styles.successContent]}>
                                    <CheckCircle size={64} color={COLORS.success} />
                                    <Text style={styles.successTitle}>Thank You!</Text>
                                    <Text style={styles.successText}>
                                        Your review helps us improve our service.
                                    </Text>
                                    <TouchableOpacity onPress={onClose} style={[styles.submitBtn, styles.outlineBtn]}>
                                        <Text style={[styles.submitBtnText, { color: COLORS.textPrimary }]}>Close</Text>
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
});

export default ReviewModal;
