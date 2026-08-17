import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { Button } from './Button';

const TIME_SLOTS = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM (Emergency)',
];

export const DatePicker = ({
    value,
    onSelectDate,
    selectedSlot,
    onSelectSlot,
    label = 'Select Service Date & Time',
    includeTime = true,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const [tempDate, setTempDate] = useState(value || new Date().toISOString().split('T')[0]);
    const [tempSlot, setTempSlot] = useState(selectedSlot || TIME_SLOTS[0]);

    // Generate next 14 days
    const nextDays = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            dateStr: d.toISOString().split('T')[0],
            dayName: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        };
    });

    const handleConfirm = () => {
        if (onSelectDate) onSelectDate(tempDate);
        if (onSelectSlot && includeTime) onSelectSlot(tempSlot);
        setIsOpen(false);
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Select Date';
        const d = new Date(dateString + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    };

    return (
        <View style={[styles.container, style]}>
            {label ? (
                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            ) : null}

            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                style={[
                    styles.triggerBtn,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}
            >
                <View style={styles.triggerLeft}>
                    <CalendarIcon size={18} color={colors.accent} />
                    <Text style={[styles.triggerDate, { color: colors.textPrimary }]}>
                        {formatDateDisplay(value || tempDate)}
                    </Text>
                </View>

                {includeTime && (selectedSlot || tempSlot) ? (
                    <View style={[styles.slotBadge, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                        <Clock size={13} color={colors.textTertiary} />
                        <Text style={[styles.slotText, { color: colors.textSecondary }]}>
                            {selectedSlot || tempSlot}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={[
                        styles.modalCard,
                        {
                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                                    Choose Date & Slot
                                </Text>
                                <Text style={[styles.modalSubtitle, { color: colors.textTertiary }]}>
                                    Certified electrician will arrive during this window
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
                                <X size={20} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        {/* Date horizontal carousel */}
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Date</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                            {nextDays.map((d) => {
                                const isSelected = tempDate === d.dateStr;
                                return (
                                    <TouchableOpacity
                                        key={d.dateStr}
                                        onPress={() => setTempDate(d.dateStr)}
                                        style={[
                                            styles.dayCard,
                                            {
                                                backgroundColor: isSelected ? colors.accent : isDark ? '#27272A' : '#F4F4F5',
                                                borderColor: isSelected ? colors.accent : isDark ? '#3F3F46' : '#E4E4E7',
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.dayName,
                                            { color: isSelected ? '#FFFFFF' : colors.textTertiary }
                                        ]}>
                                            {d.dayName}
                                        </Text>
                                        <Text style={[
                                            styles.dayNum,
                                            { color: isSelected ? '#FFFFFF' : colors.textPrimary }
                                        ]}>
                                            {d.dayNum}
                                        </Text>
                                        <Text style={[
                                            styles.monthName,
                                            { color: isSelected ? '#FFFFFF' : colors.textTertiary }
                                        ]}>
                                            {d.monthName}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Time slots */}
                        {includeTime && (
                            <>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 14 }]}>
                                    Time Slot
                                </Text>
                                <View style={styles.slotsGrid}>
                                    {TIME_SLOTS.map((slot) => {
                                        const isSelected = tempSlot === slot;
                                        return (
                                            <TouchableOpacity
                                                key={slot}
                                                onPress={() => setTempSlot(slot)}
                                                style={[
                                                    styles.slotCard,
                                                    {
                                                        backgroundColor: isSelected ? (isDark ? '#27272A' : '#EFF6FF') : isDark ? '#27272A60' : '#F9FAFB',
                                                        borderColor: isSelected ? colors.accent : isDark ? '#3F3F46' : '#E5E7EB',
                                                    }
                                                ]}
                                            >
                                                <Clock size={13} color={isSelected ? colors.accent : colors.textTertiary} />
                                                <Text style={[
                                                    styles.slotCardText,
                                                    {
                                                        color: isSelected ? colors.accent : colors.textPrimary,
                                                        fontWeight: isSelected ? '700' : '500',
                                                    }
                                                ]}>
                                                    {slot}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        )}

                        <View style={styles.modalFooter}>
                            <Button variant="outline" onPress={() => setIsOpen(false)} style={{ flex: 1 }}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleConfirm} style={{ flex: 1 }} iconLeft={Check}>
                                Confirm
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    triggerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    triggerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    triggerDate: {
        fontSize: 14,
        fontWeight: '600',
    },
    slotBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    slotText: {
        fontSize: 11,
        fontWeight: '500',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        padding: 20,
        paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    closeBtn: {
        padding: 6,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    daysScroll: {
        marginBottom: 4,
    },
    dayCard: {
        width: 62,
        height: 76,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    dayName: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    dayNum: {
        fontSize: 18,
        fontWeight: '800',
    },
    monthName: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 1,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    slotCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    slotCardText: {
        fontSize: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
});
