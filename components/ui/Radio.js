import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Radio = ({
    selected = false,
    onSelect,
    label,
    description,
    disabled = false,
    size = 'md',
    style,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const circleSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;
    const dotSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;

    return (
        <TouchableOpacity
            onPress={() => !disabled && onSelect && onSelect()}
            disabled={disabled}
            activeOpacity={0.7}
            style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
            {...props}
        >
            <View style={[
                styles.circle,
                {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    borderWidth: 2,
                    borderColor: selected ? colors.accent : isDark ? '#3F3F46' : '#D4D4D8',
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                }
            ]}>
                {selected ? (
                    <View style={[
                        styles.innerDot,
                        {
                            width: dotSize,
                            height: dotSize,
                            borderRadius: dotSize / 2,
                            backgroundColor: colors.accent,
                        }
                    ]} />
                ) : null}
            </View>

            {label || description ? (
                <View style={styles.textWrap}>
                    {label ? (
                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                            {label}
                        </Text>
                    ) : null}
                    {description ? (
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {description}
                        </Text>
                    ) : null}
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export const RadioGroup = ({
    options = [],
    value,
    onChange,
    label,
    error,
    style,
}) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <View style={[styles.group, style]}>
            {label ? (
                <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
                    {label}
                </Text>
            ) : null}

            {options.map((opt) => (
                <Radio
                    key={opt.value}
                    selected={value === opt.value}
                    onSelect={() => onChange(opt.value)}
                    label={opt.label}
                    description={opt.description}
                    disabled={opt.disabled}
                />
            ))}

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginVertical: 4,
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    innerDot: {},
    textWrap: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 2,
    },
    group: {
        gap: 6,
        marginBottom: 12,
    },
    groupLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 2,
    },
});
