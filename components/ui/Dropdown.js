import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Dropdown = ({
    options = [],
    value,
    onSelect,
    label,
    placeholder = 'Select an option',
    disabled = false,
    error,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View style={[styles.container, style]}>
            {label ? (
                <Text style={[styles.label, { color: error ? '#EF4444' : colors.textSecondary }]}>
                    {label}
                </Text>
            ) : null}

            <TouchableOpacity
                onPress={() => !disabled && setIsOpen(true)}
                disabled={disabled}
                style={[
                    styles.trigger,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                        borderColor: error ? '#EF4444' : isDark ? '#27272A' : '#E4E4E7',
                        opacity: disabled ? 0.6 : 1,
                    }
                ]}
            >
                <Text style={[
                    styles.triggerText,
                    {
                        color: selectedOption ? colors.textPrimary : colors.textTertiary,
                        fontWeight: selectedOption ? '600' : '400',
                    }
                ]}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <ChevronDown size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <Modal visible={isOpen} transparent animationType="fade">
                <TouchableOpacity 
                    style={styles.modalBackdrop} 
                    activeOpacity={1} 
                    onPress={() => setIsOpen(false)}
                >
                    <View style={[
                        styles.menuCard,
                        {
                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                        }
                    ]}>
                        <View style={styles.menuHeader}>
                            <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
                                {label || 'Select'}
                            </Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)}>
                                <X size={18} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item.value)}
                            renderItem={({ item }) => {
                                const isSelected = item.value === value;
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelect(item.value);
                                            setIsOpen(false);
                                        }}
                                        style={[
                                            styles.optionItem,
                                            {
                                                backgroundColor: isSelected ? (isDark ? '#27272A' : '#EFF6FF') : 'transparent',
                                            }
                                        ]}
                                    >
                                        <View style={styles.optionLeft}>
                                            <Text style={[
                                                styles.optionLabel,
                                                {
                                                    color: isSelected ? colors.accent : colors.textPrimary,
                                                    fontWeight: isSelected ? '700' : '500',
                                                }
                                            ]}>
                                                {item.label}
                                            </Text>
                                            {item.description ? (
                                                <Text style={[styles.optionDesc, { color: colors.textTertiary }]}>
                                                    {item.description}
                                                </Text>
                                            ) : null}
                                        </View>
                                        {isSelected ? (
                                            <Check size={16} color={colors.accent} />
                                        ) : null}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
        width: '100%',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        minHeight: 46,
    },
    triggerText: {
        fontSize: 14,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    menuCard: {
        width: '100%',
        maxWidth: 380,
        maxHeight: 420,
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 12,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginVertical: 2,
    },
    optionLeft: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 14,
    },
    optionDesc: {
        fontSize: 12,
        marginTop: 2,
    },
});
