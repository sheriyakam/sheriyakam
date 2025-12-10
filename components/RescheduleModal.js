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
import { X, Calendar, Clock, CheckCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING } from '../constants/theme';

const RescheduleModal = ({ booking, visible, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('Tomorrow');
    const [customDate, setCustomDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('Morning');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setSelectedDate('Tomorrow');
            setCustomDate('');
            setSelectedSlot('Morning');
            setDate(new Date());
        }
    }, [visible]);

    if (!booking) return null;

    const availableDays = ['Today', 'Tomorrow', 'Pick Date'];

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            setSelectedDate('Custom');
            setCustomDate(formattedDate);
        }
    };

    const handleConfirm = () => {
        // Here you would typically make an API call to update the booking
        setStep(2); // Show success message
    };

    const SelectionChip = ({ label, subLabel, selected, onClick, isDate = false }) => (
        <TouchableOpacity
            onPress={onClick}
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                isDate && styles.chipDate
            ]}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={styles.chipSubLabel}>{subLabel}</Text>
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
                    <View style={styles.container}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {step === 1 ? (
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView contentContainerStyle={styles.content}>
                                    <Text style={styles.title}>Reschedule Booking</Text>
                                    <Text style={styles.subtitle}>
                                        For: <Text style={{ color: COLORS.accent }}>{booking.service}</Text>
                                    </Text>

                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>New Date</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isCustom = day === 'Pick Date';
                                                const isSelected = isCustom ? selectedDate === 'Custom' : selectedDate === day;
                                                const label = (isCustom && selectedDate === 'Custom') ? customDate : day;

                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={label}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (isCustom) {
                                                                setShowDatePicker(true);
                                                            } else {
                                                                setSelectedDate(day);
                                                                setCustomDate('');
                                                            }
                                                        }}
                                                        isDate
                                                    />
                                                );
                                            })}
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={date}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onDateChange}
                                                    minimumDate={new Date()}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Time Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Clock size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>New Time</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {['Morning', 'Afternoon', 'Evening'].map(slot => (
                                                <SelectionChip
                                                    key={slot}
                                                    label={slot}
                                                    selected={selectedSlot === slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={styles.footer}>
                                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                                        <Text style={styles.confirmBtnText}>Confirm Reschedule</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={COLORS.success} />
                                <Text style={styles.successTitle}>Rescheduled!</Text>
                                <Text style={styles.successText}>
                                    Your booking has been moved to <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedDate === 'Custom' ? customDate : selectedDate}</Text> in the <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedSlot}</Text>.
                                </Text>
                                <TouchableOpacity onPress={onClose} style={[styles.confirmBtn, styles.outlineBtn]}>
                                    <Text style={[styles.confirmBtnText, { color: COLORS.textPrimary }]}>Done</Text>
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
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
        color: COLORS.textSecondary,
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
        borderColor: COLORS.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipSelected: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    chipUnselected: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    chipTextUnselected: {
        color: COLORS.textTertiary,
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 0,
        backgroundColor: '#18181b',
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
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
        marginBottom: 16,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
});

export default RescheduleModal;
