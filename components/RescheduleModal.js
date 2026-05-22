import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { X, Calendar, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const RescheduleModal = ({ booking, visible, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('Tomorrow');
    const [step, setStep] = useState(1);
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const currentHour = new Date().getHours();
    const isTodayOver = currentHour >= 18; // 6 PM
    const availableDays = isTodayOver ? ['Tomorrow'] : ['Today', 'Tomorrow'];

    useEffect(() => {
        if (visible) {
            setStep(1);
            const initialDate = isTodayOver ? 'Tomorrow' : 'Today';
            setSelectedDate(initialDate);
        }
    }, [visible]);

    if (!booking) return null;

    const handleConfirm = () => {
        setStep(2);
    };

    const SelectionChip = ({ label, subLabel, selected, onClick, isDate = false }) => (
        <TouchableOpacity
            onPress={onClick}
            style={[
                styles.chip,
                {
                    borderColor: selected ? colors.accent : colors.border,
                    backgroundColor: selected ? colors.accent : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
                },
                isDate && styles.chipDate
            ]}
        >
            <Text style={[
                styles.chipText,
                {
                    color: selected ? '#ffffff' : colors.textSecondary,
                    fontWeight: selected ? 'bold' : '500',
                }
            ]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={[styles.chipSubLabel, { color: colors.textTertiary }]}>{subLabel}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={[styles.container, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[
                                styles.closeBtn,
                                {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                    borderColor: colors.border
                                }
                            ]}
                        >
                            <X size={22} color={colors.textPrimary} />
                        </TouchableOpacity>

                        {step === 1 ? (
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView contentContainerStyle={styles.content}>
                                    <Text style={[styles.title, { color: colors.textPrimary }]}>Reschedule Booking</Text>
                                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                        For: <Text style={{ color: colors.accent }}>{booking.service}</Text>
                                    </Text>

                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={colors.textTertiary} />
                                            <Text style={[styles.label, { color: colors.textSecondary }]}>New Date</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isSelected = selectedDate === day;
                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={day}
                                                        selected={isSelected}
                                                        onClick={() => setSelectedDate(day)}
                                                        isDate
                                                    />
                                                );
                                            })}
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={[styles.footer, { backgroundColor: colors.bgSecondary }]}>
                                    <TouchableOpacity
                                        onPress={handleConfirm}
                                        style={[styles.confirmBtn, { backgroundColor: colors.accent }]}
                                    >
                                        <Text style={[styles.confirmBtnText, { color: '#ffffff' }]}>Confirm Reschedule</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={colors.success} />
                                <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Rescheduled!</Text>
                                <Text style={[styles.successText, { color: colors.textSecondary }]}>
                                    Your booking has been moved to <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{selectedDate}</Text>.
                                </Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[styles.confirmBtn, styles.outlineBtn, { borderColor: colors.border }]}
                                >
                                    <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
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
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipSubLabel: {
        fontSize: 10,
        marginTop: 2,
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    confirmBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
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
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        width: '100%',
    },
});

export default RescheduleModal;
