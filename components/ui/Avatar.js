import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Avatar = ({
    source,
    name = '',
    size = 40,
    status, // 'online', 'offline', 'busy', 'away'
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const getInitials = (str) => {
        if (!str) return '?';
        const parts = str.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return str.substring(0, 2).toUpperCase();
    };

    const getStatusColor = () => {
        switch (status) {
            case 'online': return '#10B981';
            case 'busy': return '#EF4444';
            case 'away': return '#F59E0B';
            case 'offline':
            default:
                return '#71717A';
        }
    };

    const dotSize = Math.max(8, Math.round(size / 4));

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {source ? (
                <Image
                    source={typeof source === 'string' ? { uri: source } : source}
                    style={[
                        styles.image,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        }
                    ]}
                />
            ) : (
                <View style={[
                    styles.fallback,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: isDark ? '#27272A' : '#E4E4E7',
                        borderColor: isDark ? '#3F3F46' : '#D4D4D8',
                    }
                ]}>
                    <Text style={[
                        styles.initials,
                        {
                            fontSize: Math.round(size * 0.4),
                            color: colors.textPrimary,
                        }
                    ]}>
                        {getInitials(name)}
                    </Text>
                </View>
            )}

            {status ? (
                <View style={[
                    styles.statusDot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: getStatusColor(),
                        borderColor: isDark ? '#18181B' : '#FFFFFF',
                        borderWidth: 1.5,
                        bottom: 0,
                        right: 0,
                    }
                ]} />
            ) : null}
        </View>
    );
};

export const AvatarGroup = ({ avatars = [], max = 4, size = 32, style }) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const visibleAvatars = avatars.slice(0, max);
    const extraCount = avatars.length - max;

    return (
        <View style={[styles.group, style]}>
            {visibleAvatars.map((av, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.groupItem, 
                        { 
                            marginLeft: index === 0 ? 0 : -8,
                            borderColor: isDark ? '#18181B' : '#FFFFFF',
                        }
                    ]}
                >
                    <Avatar {...av} size={size} />
                </View>
            ))}

            {extraCount > 0 ? (
                <View style={[
                    styles.extraBadge,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: isDark ? '#27272A' : '#E4E4E7',
                        borderColor: isDark ? '#18181B' : '#FFFFFF',
                        marginLeft: -8,
                    }
                ]}>
                    <Text style={[styles.extraText, { color: colors.textSecondary, fontSize: Math.round(size * 0.35) }]}>
                        +{extraCount}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        resizeMode: 'cover',
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    initials: {
        fontWeight: '700',
    },
    statusDot: {
        position: 'absolute',
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupItem: {
        borderWidth: 2,
        borderRadius: 999,
    },
    extraBadge: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    extraText: {
        fontWeight: '700',
    },
});
