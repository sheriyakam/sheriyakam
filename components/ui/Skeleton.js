import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Skeleton = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const { theme } = useTheme() || { theme: 'dark' };
    const isDark = theme === 'dark';

    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.8,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: isDark ? '#27272A' : '#E4E4E7',
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const SkeletonCard = ({ style }) => {
    return (
        <View style={[styles.cardContainer, style]}>
            <Skeleton height={140} borderRadius={12} style={{ marginBottom: 12 }} />
            <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={14} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Skeleton width="30%" height={24} borderRadius={6} />
                <Skeleton width="25%" height={32} borderRadius={8} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
    cardContainer: {
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.1)',
        marginBottom: 12,
    },
});
