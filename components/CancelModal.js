import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

const CANCEL_REASONS = [
    "Changed my plans",
    "Found another professional",
    "Booked by mistake"
];

export default function CancelModal({ visible, onClose, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState(null);
    const { colors } = useTheme();

    const handleSubmit = () => {
        if (selectedReason) {
            onSubmit(selectedReason);
            setSelectedReason(null); // Reset
        }
    };

    if (!visible) return null;

    const dynamicStyles = {
        popup: {
            backgroundColor: colors.bgSecondary,
            borderColor: colors.border,
        },
        title: {
            color: colors.textPrimary,
        },
        option: {
            backgroundColor: colors.bgPrimary,
            borderColor: colors.border,
        },
        selectedOption: {
            backgroundColor: colors.accent + '20', // transparent accent
            borderColor: colors.accent,
        },
        optionText: {
            color: colors.textPrimary,
        },
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.popup, dynamicStyles.popup]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, dynamicStyles.title]}>Cancel Booking</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Please tell us why you are cancelling.
                    </Text>

                    <View style={styles.optionsContainer}>
                        {CANCEL_REASONS.map((reason, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    dynamicStyles.option,
                                    selectedReason === reason && dynamicStyles.selectedOption
                                ]}
                                onPress={() => setSelectedReason(reason)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    dynamicStyles.optionText,
                                    selectedReason === reason && { color: colors.accent, fontWeight: 'bold' }
                                ]}>
                                    {reason}
                                </Text>
                                <View style={[
                                    styles.radioCircle,
                                    { borderColor: selectedReason === reason ? colors.accent : colors.textTertiary }
                                ]}>
                                    {selectedReason === reason && (
                                        <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            !selectedReason && { backgroundColor: colors.bgTertiary, opacity: 0.5 }
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedReason}
                    >
                        <Text style={styles.submitBtnText}>Confirm Cancellation</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    popup: {
        borderRadius: 20,
        padding: SPACING.lg,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    closeBtn: {
        padding: 4,
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    submitBtn: {
        backgroundColor: COLORS.danger,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
