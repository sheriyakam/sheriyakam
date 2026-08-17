import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bell, ShieldCheck, Zap, X } from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';

export const PushNotificationModal = ({
    visible = false,
    onClose,
    onEnable,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleEnable = () => {
        if (onEnable) onEnable();
        success('Push notifications enabled for technician dispatch alerts!', 'Notifications Active');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showClose={true}
            maxWidth={420}
        >
            <View style={styles.content}>
                <View style={[
                    styles.iconCircle,
                    {
                        backgroundColor: colors.accent + '18',
                        borderColor: colors.accent + '40',
                    }
                ]}>
                    <Bell size={36} color={colors.accent} />
                </View>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Never Miss an Electrician Update
                </Text>

                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Get real-time alerts when your certified technician is dispatched, arrives at your home, or sends an urgent message.
                </Text>

                <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                        <Zap size={16} color="#10B981" />
                        <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                            Instant dispatch & ETA updates
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <ShieldCheck size={16} color="#10B981" />
                        <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                            Job completion & digital invoice alerts
                        </Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleEnable}
                        iconLeft={Bell}
                    >
                        Allow Notifications
                    </Button>

                    <Button
                        variant="ghost"
                        size="md"
                        fullWidth
                        onPress={onClose}
                        style={{ marginTop: 6 }}
                    >
                        Maybe Later
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    featuresList: {
        width: '100%',
        gap: 10,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        fontSize: 13,
        fontWeight: '600',
    },
    buttons: {
        width: '100%',
    },
});
