import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    hint,
    iconLeft: IconLeft,
    iconRight: IconRight,
    secureTextEntry = false,
    clearable = false,
    onClear,
    disabled = false,
    style,
    inputStyle,
    containerStyle,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    const hasError = !!error;

    const getBorderColor = () => {
        if (hasError) return '#EF4444';
        if (isFocused) return colors.accent;
        return isDark ? '#27272A' : '#E4E4E7';
    };

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label ? (
                <Text style={[styles.label, { color: hasError ? '#EF4444' : colors.textSecondary }]}>
                    {label}
                </Text>
            ) : null}

            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                    borderColor: getBorderColor(),
                    opacity: disabled ? 0.6 : 1,
                },
                style,
            ]}>
                {IconLeft ? (
                    <View style={styles.iconLeft}>
                        <IconLeft size={18} color={hasError ? '#EF4444' : isFocused ? colors.accent : colors.textTertiary} />
                    </View>
                ) : null}

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    editable={!disabled}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[
                        styles.input,
                        {
                            color: colors.textPrimary,
                        },
                        inputStyle,
                    ]}
                    {...props}
                />

                {clearable && value ? (
                    <TouchableOpacity 
                        onPress={onClear || (() => onChangeText(''))} 
                        style={styles.actionIcon}
                    >
                        <X size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                ) : null}

                {secureTextEntry ? (
                    <TouchableOpacity 
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                        style={styles.actionIcon}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={18} color={colors.textTertiary} />
                        ) : (
                            <Eye size={18} color={colors.textTertiary} />
                        )}
                    </TouchableOpacity>
                ) : null}

                {!secureTextEntry && IconRight ? (
                    <View style={styles.actionIcon}>
                        <IconRight size={18} color={colors.textTertiary} />
                    </View>
                ) : null}
            </View>

            {hasError ? (
                <View style={styles.errorRow}>
                    <AlertCircle size={13} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : hint ? (
                <Text style={[styles.hintText, { color: colors.textTertiary }]}>{hint}</Text>
            ) : null}
        </View>
    );
};

export const TextArea = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    hint,
    numberOfLines = 4,
    style,
    ...props
}) => {
    return (
        <Input
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            error={error}
            hint={hint}
            multiline
            numberOfLines={numberOfLines}
            inputStyle={[{ minHeight: 90, textAlignVertical: 'top', paddingTop: 10 }, style]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        minHeight: 46,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 10,
        outlineStyle: 'none',
    },
    iconLeft: {
        marginRight: 8,
    },
    actionIcon: {
        padding: 4,
        marginLeft: 4,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        paddingLeft: 2,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '500',
    },
    hintText: {
        fontSize: 12,
        marginTop: 4,
        paddingLeft: 2,
    },
});
