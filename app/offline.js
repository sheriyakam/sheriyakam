import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, WifiOff, RefreshCw, Phone, ShieldCheck, Home } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function OfflineScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { showToast } = useToast() || { showToast: () => {} };
    const isDark = theme === 'dark';
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            setIsRetrying(false);
            if (typeof navigator !== 'undefined' && navigator.onLine) {
                showToast('Internet connection restored!', 'success');
                router.replace('/');
            } else {
                showToast('Still offline. Please check your WiFi or Mobile Data.', 'error');
            }
        }, 1200);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go Home">
                    <Home size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Connection Offline
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Card variant="elevated" style={styles.card}>
                    <View style={[styles.iconCircle, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}>
                        <WifiOff size={44} color="#EF4444" />
                    </View>
                    <Badge variant="danger" size="md">No Internet Connection</Badge>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        You're Currently Offline
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        We couldn't connect to Sheriyakam's booking network. Check your mobile data or Wi-Fi settings and tap retry.
                    </Text>

                    <Button variant="primary" style={{ width: '100%' }} onPress={handleRetry}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <RefreshCw size={16} color="#000" />
                            <Text style={{ fontWeight: '700', color: '#000' }}>
                                {isRetrying ? 'Checking Network...' : 'Retry Connection'}
                            </Text>
                        </View>
                    </Button>

                    {/* Emergency Offline Callout */}
                    <Card variant="outline" style={styles.emergencyCard}>
                        <Phone size={20} color={colors.accent} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.emergencyTitle, { color: colors.textPrimary }]}>
                                Urgent Emergency in Kerala?
                            </Text>
                            <Text style={[styles.emergencyText, { color: colors.textSecondary }]}>
                                For active electrical sparks, smoke, or urgent power outages, call our offline emergency helpline directly at +91 98765 43210.
                            </Text>
                        </View>
                    </Card>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        maxWidth: 540,
        width: '100%',
        marginHorizontal: 'auto',
        alignSelf: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    card: {
        padding: 24,
        alignItems: 'center',
        gap: 14,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
    },
    emergencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        width: '100%',
        marginTop: 8,
    },
    emergencyTitle: {
        fontSize: 13.5,
        fontWeight: '700',
    },
    emergencyText: {
        fontSize: 11.5,
        lineHeight: 16,
        marginTop: 2,
    },
});
