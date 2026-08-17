import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Searchbar = ({
    value,
    onChangeText,
    placeholder = 'Search services, electricians, wiring...',
    onSearch,
    onClear,
    onFilterPress,
    showFilter = false,
    filterActive = false,
    autoFocus = false,
    style,
    ...props
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <View style={[
                styles.searchBox,
                {
                    backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                    borderColor: isFocused ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                }
            ]}>
                <Search size={18} color={isFocused ? colors.accent : colors.textTertiary} style={styles.searchIcon} />

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    autoFocus={autoFocus}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onSubmitEditing={() => onSearch && onSearch(value)}
                    returnKeyType="search"
                    style={[styles.input, { color: colors.textPrimary }]}
                    {...props}
                />

                {value ? (
                    <TouchableOpacity
                        onPress={() => {
                            if (onClear) onClear();
                            if (onChangeText) onChangeText('');
                        }}
                        style={styles.actionBtn}
                    >
                        <X size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                ) : null}

                {showFilter ? (
                    <TouchableOpacity
                        onPress={onFilterPress}
                        style={[
                            styles.filterBtn,
                            {
                                backgroundColor: filterActive ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                            }
                        ]}
                    >
                        <SlidersHorizontal size={14} color={filterActive ? '#FFFFFF' : colors.textPrimary} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 8,
        outlineStyle: 'none',
    },
    actionBtn: {
        padding: 4,
        marginLeft: 4,
    },
    filterBtn: {
        padding: 7,
        borderRadius: 8,
        marginLeft: 6,
    },
});
