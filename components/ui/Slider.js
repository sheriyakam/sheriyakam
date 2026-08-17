import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Stepper = ({
    value = 1,
    onChange,
    min = 1,
    max = 99,
    step = 1,
    label,
    unit = '',
    disabled = false,
    size = 'md',
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const handleMinus = () => {
        if (value > min) {
            onChange(Math.max(min, value - step));
        }
    };

    const handlePlus = () => {
        if (value < max) {
            onChange(Math.min(max, value + step));
        }
    };

    const btnSize = size === 'sm' ? 28 : 36;
    const iconSize = size === 'sm' ? 14 : 18;

    return (
        <View style={[styles.container, style]}>
            {label ? (
                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            ) : null}

            <View style={[
                styles.stepperWrap,
                {
                    backgroundColor: isDark ? '#18181B' : '#F4F4F5',
                    borderColor: isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <TouchableOpacity
                    onPress={handleMinus}
                    disabled={disabled || value <= min}
                    style={[
                        styles.stepBtn,
                        {
                            width: btnSize,
                            height: btnSize,
                            borderRadius: btnSize / 2,
                            opacity: value <= min ? 0.3 : 1,
                            backgroundColor: isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}
                >
                    <Minus size={iconSize} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.valueWrap}>
                    <Text style={[styles.valueText, { color: colors.textPrimary }]}>
                        {value} {unit}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePlus}
                    disabled={disabled || value >= max}
                    style={[
                        styles.stepBtn,
                        {
                            width: btnSize,
                            height: btnSize,
                            borderRadius: btnSize / 2,
                            opacity: value >= max ? 0.3 : 1,
                            backgroundColor: colors.accent,
                        }
                    ]}
                >
                    <Plus size={iconSize} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const RangeSlider = ({
    value,
    onChange,
    options = [100, 300, 500, 1000, 2000, 5000],
    label,
    unit = '₹',
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[styles.rangeContainer, style]}>
            {label ? (
                <View style={styles.rangeHeader}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
                    <Text style={[styles.activeValue, { color: colors.accent }]}>
                        Up to {unit}{value}
                    </Text>
                </View>
            ) : null}

            <View style={styles.chipsWrap}>
                {options.map((opt) => {
                    const isSelected = value === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => onChange(opt)}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isSelected ? colors.accent : isDark ? '#27272A' : '#F4F4F5',
                                    borderColor: isSelected ? colors.accent : isDark ? '#3F3F46' : '#E4E4E7',
                                }
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                {
                                    color: isSelected ? '#FFFFFF' : colors.textPrimary,
                                    fontWeight: isSelected ? '700' : '500',
                                }
                            ]}>
                                {unit}{opt}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
    stepperWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 4,
        alignSelf: 'flex-start',
    },
    stepBtn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueWrap: {
        paddingHorizontal: 16,
        minWidth: 44,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 15,
        fontWeight: '700',
    },
    rangeContainer: {
        marginVertical: 8,
    },
    rangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 13,
    },
});
