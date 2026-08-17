import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Button = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    iconLeft: IconLeft,
    iconRight: IconRight,
    fullWidth = false,
    style,
    textStyle,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    bg: isDark ? '#27272A' : '#F4F4F5',
                    border: 'transparent',
                    text: isDark ? '#F4F4F5' : '#18181B',
                };
            case 'outline':
                return {
                    bg: 'transparent',
                    border: isDark ? '#3F3F46' : '#E4E4E7',
                    text: colors.textPrimary,
                };
            case 'ghost':
                return {
                    bg: 'transparent',
                    border: 'transparent',
                    text: colors.textPrimary,
                };
            case 'danger':
                return {
                    bg: '#EF4444',
                    border: 'transparent',
                    text: '#FFFFFF',
                };
            case 'gold':
                return {
                    bg: '#F59E0B',
                    border: 'transparent',
                    text: '#000000',
                };
            case 'link':
                return {
                    bg: 'transparent',
                    border: 'transparent',
                    text: colors.accent,
                };
            case 'primary':
            default:
                return {
                    bg: colors.accent,
                    border: 'transparent',
                    text: '#FFFFFF',
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                    fontSize: 13,
                    iconSize: 14,
                    borderRadius: 8,
                    minHeight: 34,
                };
            case 'lg':
                return {
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    fontSize: 16,
                    iconSize: 20,
                    borderRadius: 14,
                    minHeight: 52,
                };
            case 'icon':
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    iconSize: 18,
                    borderRadius: 10,
                    minHeight: 40,
                    minWidth: 40,
                };
            case 'md':
            default:
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    fontSize: 14,
                    iconSize: 16,
                    borderRadius: 10,
                    minHeight: 44,
                };
        }
    };

    const vStyle = getVariantStyles();
    const sStyle = getSizeStyles();
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.baseButton,
                {
                    backgroundColor: vStyle.bg,
                    borderColor: vStyle.border,
                    borderWidth: vStyle.border !== 'transparent' ? 1.5 : 0,
                    paddingVertical: sStyle.paddingVertical,
                    paddingHorizontal: sStyle.paddingHorizontal,
                    borderRadius: sStyle.borderRadius,
                    minHeight: sStyle.minHeight,
                    width: fullWidth ? '100%' : undefined,
                    opacity: isDisabled ? 0.55 : 1,
                },
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={vStyle.text} 
                    style={{ marginRight: children ? 8 : 0 }} 
                />
            ) : null}

            {!loading && IconLeft ? (
                <View style={{ marginRight: children ? 8 : 0 }}>
                    <IconLeft size={sStyle.iconSize} color={vStyle.text} />
                </View>
            ) : null}

            {children ? (
                <Text style={[
                    styles.buttonText,
                    {
                        color: vStyle.text,
                        fontSize: sStyle.fontSize,
                        fontWeight: '700',
                    },
                    textStyle,
                ]}>
                    {children}
                </Text>
            ) : null}

            {!loading && IconRight ? (
                <View style={{ marginLeft: children ? 8 : 0 }}>
                    <IconRight size={sStyle.iconSize} color={vStyle.text} />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    buttonText: {
        letterSpacing: 0.2,
    },
});
