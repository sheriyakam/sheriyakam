import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, Activity, Server, Smartphone, CreditCard, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const SYSTEM_SERVICES = [
    { name: 'Customer Mobile & Web App', status: 'Operational', uptime: '100.0%', icon: Smartphone },
    { name: 'Technician Dispatch Engine', status: 'Operational', uptime: '99.98%', icon: Server },
    { name: 'Payment & UPI Webhook Sync', status: 'Operational', uptime: '100.0%', icon: CreditCard },
    { name: 'Emergency SMS Alert Gateway', status: 'Operational', uptime: '99.95%', icon: MessageSquare },
    { name: 'Supabase Managed Auth & DB', status: 'Operational', uptime: '100.0%', icon: ShieldCheck },
];

export default function StatusScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleSubscribe = () => {
        success('Subscribed to Sheriyakam system incident alerts!', 'Subscribed');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>System Status & Uptime</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Overall Banner */}
                <View style={[styles.statusBanner, { backgroundColor: '#10B98118', borderColor: '#10B98150' }]}>
                    <CheckCircle2 size={24} color="#10B981" />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                            All Systems Operational
                        </Text>
                        <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
                            Average API response time: 24ms • Zero active incidents
                        </Text>
                    </View>
                </View>

                {/* Services list */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    CORE PLATFORM COMPONENTS
                </Text>

                <View style={styles.servicesList}>
                    {SYSTEM_SERVICES.map((srv, idx) => {
                        const Icon = srv.icon;
                        return (
                            <Card key={idx} variant="default" style={styles.serviceCard}>
                                <View style={styles.serviceRow}>
                                    <View style={[styles.iconWrap, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                        <Icon size={18} color={colors.accent} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.srvName, { color: colors.textPrimary }]}>
                                            {srv.name}
                                        </Text>
                                        <Text style={[styles.srvUptime, { color: colors.textTertiary }]}>
                                            90-day uptime: {srv.uptime}
                                        </Text>
                                    </View>
                                    <Badge variant="success" size="sm" dot>{srv.status}</Badge>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* Uptime Bar representation */}
                <Card variant="default" style={styles.uptimeCard}>
                    <View style={styles.uptimeHeader}>
                        <Text style={[styles.uptimeTitle, { color: colors.textPrimary }]}>
                            90 Days Uptime History
                        </Text>
                        <Text style={[styles.uptimePercent, { color: '#10B981' }]}>99.99%</Text>
                    </View>
                    <View style={styles.barsGrid}>
                        {Array.from({ length: 45 }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.bar,
                                    { backgroundColor: '#10B981' }
                                ]}
                            />
                        ))}
                    </View>
                    <View style={styles.uptimeLegend}>
                        <Text style={[styles.legendText, { color: colors.textTertiary }]}>90 days ago</Text>
                        <Text style={[styles.legendText, { color: colors.textTertiary }]}>Today</Text>
                    </View>
                </Card>

                {/* Subscribe CTA */}
                <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onPress={handleSubscribe}
                    style={{ marginTop: 16 }}
                >
                    Subscribe to Incident Alerts
                </Button>
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
        paddingBottom: 40,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 14,
        marginVertical: 10,
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    bannerSub: {
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    servicesList: {
        gap: 10,
    },
    serviceCard: {
        padding: 14,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    srvName: {
        fontSize: 14,
        fontWeight: '700',
    },
    srvUptime: {
        fontSize: 12,
        marginTop: 1,
    },
    uptimeCard: {
        padding: 16,
        marginTop: 14,
        gap: 12,
    },
    uptimeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uptimeTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    uptimePercent: {
        fontSize: 14,
        fontWeight: '800',
    },
    barsGrid: {
        flexDirection: 'row',
        gap: 3,
        justifyContent: 'space-between',
    },
    bar: {
        flex: 1,
        height: 24,
        borderRadius: 3,
    },
    uptimeLegend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendText: {
        fontSize: 11,
    },
});
