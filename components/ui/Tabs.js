import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Tabs = ({
    tabs = [], // [{ id, label, count, icon: Icon }]
    activeTab,
    onChange,
    variant = 'pills', // 'pills' or 'underline' or 'segmented'
    scrollable = false,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const renderTabs = () => {
        return tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            if (variant === 'underline') {
                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onChange(tab.id)}
                        style={[
                            styles.underlineTab,
                            isActive && { borderBottomColor: colors.accent, borderBottomWidth: 2.5 }
                        ]}
                    >
                        {Icon ? (
                            <Icon size={16} color={isActive ? colors.accent : colors.textTertiary} style={{ marginRight: 6 }} />
                        ) : null}

                        <Text style={[
                            styles.tabText,
                            {
                                color: isActive ? colors.accent : colors.textTertiary,
                                fontWeight: isActive ? '700' : '500',
                            }
                        ]}>
                            {tab.label}
                        </Text>

                        {tab.count !== undefined ? (
                            <View style={[
                                styles.badge,
                                { backgroundColor: isActive ? colors.accent + '20' : isDark ? '#27272A' : '#E4E4E7' }
                            ]}>
                                <Text style={[
                                    styles.badgeText,
                                    { color: isActive ? colors.accent : colors.textSecondary }
                                ]}>
                                    {tab.count}
                                </Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                );
            }

            if (variant === 'segmented') {
                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onChange(tab.id)}
                        style={[
                            styles.segmentedTab,
                            {
                                backgroundColor: isActive ? (isDark ? '#27272A' : '#FFFFFF') : 'transparent',
                                shadowOpacity: isActive ? 0.12 : 0,
                            }
                        ]}
                    >
                        {Icon ? (
                            <Icon size={15} color={isActive ? colors.textPrimary : colors.textTertiary} style={{ marginRight: 6 }} />
                        ) : null}

                        <Text style={[
                            styles.tabText,
                            {
                                color: isActive ? colors.textPrimary : colors.textTertiary,
                                fontWeight: isActive ? '700' : '500',
                            }
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            }

            // Default 'pills'
            return (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => onChange(tab.id)}
                    style={[
                        styles.pillTab,
                        {
                            backgroundColor: isActive ? colors.accent : isDark ? '#18181B' : '#F4F4F5',
                            borderColor: isActive ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}
                >
                    {Icon ? (
                        <Icon size={15} color={isActive ? '#FFFFFF' : colors.textTertiary} style={{ marginRight: 6 }} />
                    ) : null}

                    <Text style={[
                        styles.tabText,
                        {
                            color: isActive ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isActive ? '700' : '500',
                        }
                    ]}>
                        {tab.label}
                    </Text>

                    {tab.count !== undefined ? (
                        <View style={[
                            styles.badge,
                            { backgroundColor: isActive ? '#FFFFFF30' : isDark ? '#27272A' : '#E4E4E7' }
                        ]}>
                            <Text style={[
                                styles.badgeText,
                                { color: isActive ? '#FFFFFF' : colors.textSecondary }
                            ]}>
                                {tab.count}
                            </Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            );
        });
    };

    if (scrollable) {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.scrollContainer, style]}>
                <View style={styles.scrollInner}>
                    {renderTabs()}
                </View>
            </ScrollView>
        );
    }

    return (
        <View style={[
            variant === 'segmented' ? [styles.segmentedContainer, { backgroundColor: isDark ? '#18181B' : '#E4E4E780' }] : styles.container,
            style
        ]}>
            {renderTabs()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 8,
    },
    scrollContainer: {
        marginVertical: 8,
    },
    scrollInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 2,
    },
    pillTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    underlineTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 8,
    },
    segmentedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderRadius: 12,
        marginVertical: 8,
    },
    segmentedTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
