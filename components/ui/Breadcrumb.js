import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Breadcrumb = ({
    items = [], // [{ label, onPress, active }]
    style,
}) => {
    const { colors } = useTheme() || { colors: COLORS };

    return (
        <View style={[styles.container, style]}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <View key={index} style={styles.itemWrap}>
                        <TouchableOpacity
                            onPress={item.onPress}
                            disabled={isLast || !item.onPress}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.label,
                                {
                                    color: isLast ? colors.textPrimary : colors.textTertiary,
                                    fontWeight: isLast ? '700' : '500',
                                }
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>

                        {!isLast ? (
                            <ChevronRight size={14} color={colors.textTertiary} style={styles.separator} />
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    itemWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
    },
    separator: {
        marginHorizontal: 6,
    },
});
