import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const ActionSheet = ({
    visible = false,
    onClose,
    title,
    subtitle,
    actions = [], // { label, onPress, icon: Icon, isDestructive, disabled }
    cancelLabel = 'Cancel',
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <View style={[
                    styles.sheetCard,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    <View style={styles.handleIndicator} />

                    {title || subtitle ? (
                        <View style={styles.header}>
                            {title ? (
                                <Text style={[styles.title, { color: colors.textPrimary }]}>
                                    {title}
                                </Text>
                            ) : null}
                            {subtitle ? (
                                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                                    {subtitle}
                                </Text>
                            ) : null}
                        </View>
                    ) : null}

                    <ScrollView style={styles.actionsList}>
                        {actions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (action.onPress) action.onPress();
                                        onClose();
                                    }}
                                    disabled={action.disabled}
                                    style={[
                                        styles.actionItem,
                                        {
                                            backgroundColor: isDark ? '#27272A60' : '#F4F4F560',
                                            opacity: action.disabled ? 0.4 : 1,
                                        }
                                    ]}
                                >
                                    {Icon ? (
                                        <View style={styles.actionIcon}>
                                            <Icon size={18} color={action.isDestructive ? '#EF4444' : colors.textPrimary} />
                                        </View>
                                    ) : null}

                                    <Text style={[
                                        styles.actionLabel,
                                        {
                                            color: action.isDestructive ? '#EF4444' : colors.textPrimary,
                                            fontWeight: action.isDestructive ? '700' : '600',
                                        }
                                    ]}>
                                        {action.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TouchableOpacity 
                        onPress={onClose} 
                        style={[
                            styles.cancelBtn,
                            {
                                backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                            }
                        ]}
                    >
                        <Text style={[styles.cancelText, { color: colors.textPrimary }]}>
                            {cancelLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'flex-end',
    },
    sheetCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        padding: 20,
        paddingBottom: 36,
        maxHeight: '75%',
    },
    handleIndicator: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(150,150,150,0.4)',
        alignSelf: 'center',
        marginBottom: 14,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 4,
        textAlign: 'center',
    },
    actionsList: {
        marginBottom: 14,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginVertical: 4,
    },
    actionIcon: {
        marginRight: 12,
    },
    actionLabel: {
        fontSize: 15,
    },
    cancelBtn: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
