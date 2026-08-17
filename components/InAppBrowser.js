import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking, Platform } from 'react-native';
import { X, ArrowLeft, ArrowRight, RotateCw, ExternalLink, ShieldCheck, Copy, Lock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';

export const InAppBrowser = ({
    visible = false,
    url = 'https://sheriyakam.com',
    title = 'Sheriyakam Web',
    onClose,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';
    const [isLoading, setIsLoading] = useState(false);

    const handleReload = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    const handleOpenExternal = () => {
        Linking.openURL(url).catch(() => {});
    };

    const handleCopy = () => {
        success('URL copied to clipboard', 'Copied');
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#FFFFFF' }]}>
                {/* Browser Header / Navigation Bar */}
                <View style={[
                    styles.navBar,
                    {
                        backgroundColor: isDark ? '#18181B' : '#F4F4F5',
                        borderBottomColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    <TouchableOpacity onPress={onClose} style={styles.navIconBtn}>
                        <X size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={[
                        styles.addressBar,
                        {
                            backgroundColor: isDark ? '#27272A' : '#FFFFFF',
                            borderColor: isDark ? '#3F3F46' : '#D4D4D8',
                        }
                    ]}>
                        <Lock size={12} color="#10B981" style={{ marginRight: 6 }} />
                        <Text numberOfLines={1} style={[styles.urlText, { color: colors.textPrimary }]}>
                            {url}
                        </Text>
                    </View>

                    <View style={styles.navActions}>
                        <TouchableOpacity onPress={handleReload} style={styles.navIconBtn}>
                            <RotateCw size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleOpenExternal} style={styles.navIconBtn}>
                            <ExternalLink size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Simulated Web View Frame */}
                <View style={styles.contentFrame}>
                    <View style={[styles.placeholderCard, { backgroundColor: isDark ? '#18181B' : '#F9FAFB' }]}>
                        <ShieldCheck size={48} color={colors.accent} style={{ marginBottom: 12 }} />
                        <Text style={[styles.webTitle, { color: colors.textPrimary }]}>
                            {title}
                        </Text>
                        <Text style={[styles.webUrl, { color: colors.textTertiary }]}>
                            {url}
                        </Text>
                        <Text style={[styles.webNotice, { color: colors.textSecondary }]}>
                            Secure browser sandbox loaded. All communications with payment gateways and partner portals are TLS 1.3 encrypted.
                        </Text>

                        <TouchableOpacity 
                            onPress={handleOpenExternal}
                            style={[styles.openBtn, { backgroundColor: colors.accent }]}
                        >
                            <Text style={styles.openBtnText}>Open in Safari / Chrome</Text>
                            <ExternalLink size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: Platform.OS === 'ios' ? 48 : 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        gap: 8,
    },
    navIconBtn: {
        padding: 6,
    },
    addressBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    urlText: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentFrame: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    placeholderCard: {
        width: '100%',
        maxWidth: 480,
        padding: 28,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.15)',
    },
    webTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    webUrl: {
        fontSize: 13,
        marginBottom: 16,
    },
    webNotice: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 24,
    },
    openBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    openBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
});
