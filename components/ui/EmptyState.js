import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { Button } from './Button';

export const EmptyState = ({
    icon: Icon = Inbox,
    title = 'No records found',
    description = 'Items will appear here once you get started.',
    actionLabel,
    onAction,
    secondaryLabel,
    onSecondaryAction,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, style]}>
            <View style={[
                styles.iconWrap,
                {
                    backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                    borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                }
            ]}>
                <Icon size={32} color={colors.accent} />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
            </Text>

            {description ? (
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            ) : null}

            {actionLabel || secondaryLabel ? (
                <View style={styles.actions}>
                    {actionLabel && onAction ? (
                        <Button variant="primary" size="md" onPress={onAction}>
                            {actionLabel}
                        </Button>
                    ) : null}

                    {secondaryLabel && onSecondaryAction ? (
                        <Button variant="outline" size="md" onPress={onSecondaryAction}>
                            {secondaryLabel}
                        </Button>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 20,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 320,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
});
