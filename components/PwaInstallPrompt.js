import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Download, WifiOff, X, Sparkles } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'web' || typeof window === 'undefined') return;

        // Offline / Online listeners
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);

        if (!navigator.onLine) {
            setIsOffline(true);
        }

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // PWA beforeinstallprompt event
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    if (isDismissed) return null;

    if (isOffline) {
        return (
            <View style={[styles.container, styles.offlineContainer]}>
                <WifiOff size={16} color="#FBBF24" />
                <Text style={styles.offlineText}>
                    You are offline. Showing cached Kerala emergency rate cards & contacts.
                </Text>
                <TouchableOpacity onPress={() => setIsDismissed(true)} style={styles.closeBtn}>
                    <X size={14} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        );
    }

    if (isInstallable) {
        return (
            <View style={[styles.container, styles.installContainer]}>
                <View style={styles.installLeft}>
                    <View style={styles.iconWrap}>
                        <Sparkles size={14} color="#3B82F6" />
                    </View>
                    <View>
                        <Text style={styles.installTitle}>Install Sheriyakam App</Text>
                        <Text style={styles.installSub}>Fast 1-click booking on your home screen</Text>
                    </View>
                </View>
                <View style={styles.installRight}>
                    <TouchableOpacity style={styles.installBtn} onPress={handleInstallClick}>
                        <Download size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.installBtnText}>Install</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsDismissed(true)} style={styles.closeBtn}>
                        <X size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 74, // Sits comfortably above BottomNav
        left: 16,
        right: 16,
        maxWidth: 500,
        marginHorizontal: 'auto',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    offlineContainer: {
        backgroundColor: '#1E1B18',
        borderColor: '#78350F',
        gap: 10,
    },
    offlineText: {
        color: '#FDE68A',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    installContainer: {
        backgroundColor: '#111827',
        borderColor: '#1F2937',
    },
    installLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    installTitle: {
        color: '#F9FAFB',
        fontSize: 13,
        fontWeight: '700',
    },
    installSub: {
        color: '#9CA3AF',
        fontSize: 11,
    },
    installRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    installBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    installBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 4,
    },
});
