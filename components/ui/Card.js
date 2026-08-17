import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Card = ({
    children,
    variant = 'default', // 'default', 'elevated', 'glass', 'bento', 'outlined'
    onPress,
    padding = 16,
    borderRadius = 16,
    style,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E4E4E7',
                    borderWidth: 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: isDark ? 0.35 : 0.08,
                    shadowRadius: 16,
                    elevation: 6,
                };
            case 'glass':
                return {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    borderWidth: 1,
                    backdropFilter: 'blur(16px)',
                };
            case 'bento':
                return {
                    backgroundColor: isDark ? '#18181B' : '#F9FAFB',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                    borderWidth: 1.5,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderColor: isDark ? '#3F3F46' : '#D4D4D8',
                    borderWidth: 1.5,
                };
            case 'default':
            default:
                return {
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E4E4E7',
                    borderWidth: 1,
                };
        }
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            activeOpacity={onPress ? 0.75 : 1}
            style={[
                styles.baseCard,
                getVariantStyles(),
                {
                    padding,
                    borderRadius,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Container>
    );
};

export const StatCard = ({
    title,
    value,
    change,
    isPositive = true,
    icon: Icon,
    iconColor,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <Card variant="default" style={[styles.statCard, style]}>
            <View style={styles.statHeader}>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
                {Icon ? (
                    <View style={[
                        styles.statIconWrap,
                        { backgroundColor: (iconColor || colors.accent) + '15' }
                    ]}>
                        <Icon size={18} color={iconColor || colors.accent} />
                    </View>
                ) : null}
            </View>

            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>

            {change ? (
                <View style={styles.changeRow}>
                    <Text style={[
                        styles.changeText,
                        { color: isPositive ? '#10B981' : '#EF4444' }
                    ]}>
                        {isPositive ? '↑ ' : '↓ '}{change}
                    </Text>
                    <Text style={[styles.changePeriod, { color: colors.textTertiary }]}>vs last month</Text>
                </View>
            ) : null}
        </Card>
    );
};

const styles = StyleSheet.create({
    baseCard: {
        overflow: 'hidden',
    },
    statCard: {
        minWidth: 140,
        flex: 1,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    statIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    changePeriod: {
        fontSize: 11,
    },
});
