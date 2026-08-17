import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wrench, RefreshCw, Phone, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function MaintenanceScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleRefresh = () => {
        success('Platform systems verified! Returning to home...', 'Systems Online');
        router.replace('/');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <View style={styles.centerBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
                    <Wrench size={48} color="#F59E0B" />
                </View>

                <Badge variant="gold" size="md">Scheduled Upgrade</Badge>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    System Maintenance
                </Text>

                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    We are currently deploying regular security and dispatch algorithm upgrades to serve you better. We'll be back online in just a few minutes.
                </Text>

                <View style={styles.actions}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        iconLeft={RefreshCw}
                        onPress={handleRefresh}
                    >
                        Check Status & Reload
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        fullWidth
                        iconLeft={Phone}
                        onPress={() => success('Emergency hotline: 0495 280 0000')}
                        style={{ marginTop: 8 }}
                    >
                        Emergency Hotline (0495 280 0000)
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    centerBox: {
        alignItems: 'center',
        maxWidth: 380,
        width: '100%',
        gap: 12,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    desc: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    actions: {
        width: '100%',
        marginTop: 14,
    },
});
