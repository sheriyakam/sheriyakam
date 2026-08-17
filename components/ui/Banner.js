import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, Info, Zap, X, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Banner = ({
    title,
    message,
    type = 'info', // 'info', 'warning', 'emergency', 'success'
    actionLabel,
    onAction,
    dismissible = true,
    onDismiss,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const getColors = () => {
        switch (type) {
            case 'emergency':
                return { bg: '#EF444418', border: '#EF444450', text: '#EF4444', Icon: Zap };
            case 'warning':
                return { bg: '#F59E0B18', border: '#F59E0B50', text: '#F59E0B', Icon: AlertCircle };
            case 'success':
                return { bg: '#10B98118', border: '#10B98150', text: '#10B981', Icon: AlertCircle };
            case 'info':
            default:
                return { bg: colors.accent + '15', border: colors.accent + '40', text: colors.accent, Icon: Info };
        }
    };

    const c = getColors();
    const Icon = c.Icon;

    return (
        <View style={[
            styles.banner,
            {
                backgroundColor: c.bg,
                borderColor: c.border,
            },
            style
        ]}>
            <View style={styles.iconWrap}>
                <Icon size={18} color={c.text} />
            </View>

            <View style={styles.textWrap}>
                {title ? (
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        {title}
                    </Text>
                ) : null}
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                    {message}
                </Text>
            </View>

            {actionLabel && onAction ? (
                <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
                    <Text style={[styles.actionText, { color: c.text }]}>
                        {actionLabel}
                    </Text>
                    <ChevronRight size={14} color={c.text} />
                </TouchableOpacity>
            ) : null}

            {dismissible ? (
                <TouchableOpacity
                    onPress={() => {
                        setDismissed(true);
                        if (onDismiss) onDismiss();
                    }}
                    style={styles.closeBtn}
                >
                    <X size={16} color={colors.textTertiary} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 6,
    },
    iconWrap: {
        marginRight: 10,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 2,
    },
    message: {
        fontSize: 12,
        lineHeight: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '700',
        marginRight: 2,
    },
    closeBtn: {
        padding: 4,
        marginLeft: 4,
    },
});
