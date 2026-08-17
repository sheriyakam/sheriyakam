import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Toggle = ({
    value = false,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const width = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
    const height = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;
    const thumbSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    const offset = width - thumbSize - 4;

    const translateX = useRef(new Animated.Value(value ? offset : 0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? offset : 0,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, [value, offset]);

    return (
        <TouchableOpacity
            onPress={() => !disabled && onChange && onChange(!value)}
            disabled={disabled}
            activeOpacity={0.8}
            style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
        >
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

            <View style={[
                styles.track,
                {
                    width,
                    height,
                    borderRadius: height / 2,
                    backgroundColor: value ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <Animated.View style={[
                    styles.thumb,
                    {
                        width: thumbSize,
                        height: thumbSize,
                        borderRadius: thumbSize / 2,
                        transform: [{ translateX }],
                    }
                ]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        gap: 12,
    },
    textWrap: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    description: {
        fontSize: 12,
        marginTop: 2,
    },
    track: {
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    thumb: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
});
