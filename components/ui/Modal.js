import React from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Modal = ({
    visible = false,
    onClose,
    title,
    subtitle,
    children,
    footer,
    maxWidth = 460,
    showClose = true,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <TouchableOpacity 
                    style={styles.backdropTouch} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />

                <View style={[
                    styles.dialogCard,
                    {
                        maxWidth,
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                    },
                    style,
                ]}>
                    {title || showClose ? (
                        <View style={styles.header}>
                            <View style={styles.headerText}>
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

                            {showClose ? (
                                <TouchableOpacity 
                                    onPress={onClose} 
                                    style={[styles.closeBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}
                                >
                                    <X size={18} color={colors.textTertiary} />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    ) : null}

                    <View style={styles.body}>
                        {children}
                    </View>

                    {footer ? (
                        <View style={[styles.footer, { borderTopColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                            {footer}
                        </View>
                    ) : null}
                </View>
            </View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    backdropTouch: {
        ...StyleSheet.absoluteFillObject,
    },
    dialogCard: {
        width: '100%',
        borderRadius: 20,
        borderWidth: 1.5,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerText: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 13,
        marginTop: 3,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        paddingTop: 16,
        borderTopWidth: 1,
        marginTop: 12,
    },
});
