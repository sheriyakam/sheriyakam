import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Badge = ({
    children,
    variant = 'neutral', // 'success', 'warning', 'danger', 'info', 'gold', 'neutral', 'purple'
    size = 'md', // 'sm', 'md', 'lg'
    dot = false,
    outline = false,
    icon: Icon,
    style,
    textStyle,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const getColors = () => {
        switch (variant) {
            case 'success':
                return { bg: isDark ? 'rgba(16,185,129,0.18)' : '#ECFDF5', text: '#10B981', border: '#10B98150' };
            case 'warning':
                return { bg: isDark ? 'rgba(245,158,11,0.18)' : '#FFFBEB', text: '#F59E0B', border: '#F59E0B50' };
            case 'danger':
                return { bg: isDark ? 'rgba(239,68,68,0.18)' : '#FEF2F2', text: '#EF4444', border: '#EF444450' };
            case 'info':
                return { bg: isDark ? 'rgba(59,130,246,0.18)' : '#EFF6FF', text: '#3B82F6', border: '#3B82F650' };
            case 'gold':
                return { bg: isDark ? 'rgba(234,179,8,0.2)' : '#FEF9C3', text: '#EAB308', border: '#EAB30860' };
            case 'purple':
                return { bg: isDark ? 'rgba(139,92,246,0.18)' : '#F5F3FF', text: '#8B5CF6', border: '#8B5CF650' };
            case 'neutral':
            default:
                return { bg: isDark ? '#27272A' : '#F4F4F5', text: colors.textSecondary, border: isDark ? '#3F3F46' : '#E4E4E7' };
        }
    };

    const c = getColors();

    const paddingV = size === 'sm' ? 2 : size === 'lg' ? 6 : 4;
    const paddingH = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
    const fontSize = size === 'sm' ? 10 : size === 'lg' ? 13 : 11;
    const dotSize = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;

    return (
        <View style={[
            styles.badge,
            {
                backgroundColor: outline ? 'transparent' : c.bg,
                borderColor: c.border,
                borderWidth: outline ? 1.5 : 1,
                paddingVertical: paddingV,
                paddingHorizontal: paddingH,
            },
            style
        ]}>
            {dot ? (
                <View style={[
                    styles.dot, 
                    { 
                        width: dotSize, 
                        height: dotSize, 
                        borderRadius: dotSize / 2, 
                        backgroundColor: c.text 
                    }
                ]} />
            ) : null}

            {Icon ? (
                <Icon size={fontSize + 2} color={c.text} style={{ marginRight: 4 }} />
            ) : null}

            <Text style={[
                styles.text,
                {
                    color: c.text,
                    fontSize,
                    fontWeight: '700',
                },
                textStyle,
            ]}>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    dot: {
        marginRight: 5,
    },
    text: {
        letterSpacing: 0.3,
    },
});
