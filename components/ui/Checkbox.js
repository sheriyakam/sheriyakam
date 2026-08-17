import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Checkbox = ({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
    style,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const boxSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;
    const checkSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

    return (
        <TouchableOpacity
            onPress={() => !disabled && onChange && onChange(!checked)}
            disabled={disabled}
            activeOpacity={0.7}
            style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
            {...props}
        >
            <View style={[
                styles.box,
                {
                    width: boxSize,
                    height: boxSize,
                    borderRadius: 6,
                    borderWidth: 1.8,
                    borderColor: checked ? colors.accent : isDark ? '#3F3F46' : '#D4D4D8',
                    backgroundColor: checked ? colors.accent : isDark ? '#18181B' : '#FFFFFF',
                }
            ]}>
                {checked ? (
                    <Check size={checkSize} color="#FFFFFF" strokeWidth={3} />
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginVertical: 4,
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
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
});
