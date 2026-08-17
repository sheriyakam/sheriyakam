import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Loading = ({
    message = 'Loading...',
    size = 'small',
    fullScreen = false,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    if (fullScreen) {
        return (
            <Modal transparent visible animationType="fade">
                <View style={styles.fullscreenBackdrop}>
                    <View style={[
                        styles.loadingCard,
                        {
                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        {message ? (
                            <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
                                {message}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={[styles.inlineLoading, style]}>
            <ActivityIndicator size={size} color={colors.accent} />
            {message ? (
                <Text style={[styles.inlineText, { color: colors.textSecondary }]}>
                    {message}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    inlineLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },
    inlineText: {
        fontSize: 14,
        fontWeight: '500',
    },
    fullscreenBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingCard: {
        padding: 24,
        borderRadius: 18,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        minWidth: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
