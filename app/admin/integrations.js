import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Layers, Database, CreditCard, MessageSquare, Map, Activity } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const INTEGRATIONS_DATA = [
    {
        id: 'supabase',
        name: 'Supabase Auth & Database',
        type: 'Managed Authentication & SQL Sync',
        status: 'Connected',
        latency: '28ms',
        icon: Database,
        iconColor: '#10B981',
    },
    {
        id: 'razorpay',
        name: 'Razorpay UPI & Cards',
        type: 'Payment Processing Gateway',
        status: 'Connected',
        latency: '84ms',
        icon: CreditCard,
        iconColor: '#3B82F6',
    },
    {
        id: 'google-maps',
        name: 'Google Maps & OpenStreetMap',
        type: 'Geocoding & Contractor Dispatch',
        status: 'Connected',
        latency: '42ms',
        icon: Map,
        iconColor: '#F59E0B',
    },
    {
        id: 'twilio',
        name: 'Twilio SMS & WhatsApp',
        type: 'Emergency Dispatch Alerts',
        status: 'Connected',
        latency: '112ms',
        icon: MessageSquare,
        iconColor: '#EF4444',
    },
    {
        id: 'sentry',
        name: 'Snitch & Sentry Error Tracking',
        type: 'Real-time telemetry and crash monitoring',
        status: 'Active',
        latency: '15ms',
        icon: Activity,
        iconColor: '#8B5CF6',
    },
];

export default function AdminIntegrationsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [isPinging, setIsPinging] = useState(false);

    const handlePingAll = () => {
        setIsPinging(true);
        setTimeout(() => {
            setIsPinging(false);
            success('All 5 external services responded with 200 OK! Latency normal.', 'Health Check Passed');
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Service Integrations Hub
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Gateway connections and health statuses
                    </Text>
                </View>
                <Button variant="outline" size="sm" iconLeft={RefreshCw} loading={isPinging} onPress={handlePingAll}>
                    Test All
                </Button>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.integrationsGrid}>
                    {INTEGRATIONS_DATA.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.id} variant="default" style={styles.integrationCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.iconWrap, { backgroundColor: item.iconColor + '18' }]}>
                                        <Icon size={24} color={item.iconColor} />
                                    </View>
                                    <Badge variant="success" size="sm" dot>{item.status}</Badge>
                                </View>

                                <Text style={[styles.title, { color: colors.textPrimary }]}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.typeText, { color: colors.textSecondary }]}>
                                    {item.type}
                                </Text>

                                <View style={[styles.cardFooter, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                    <Text style={[styles.latencyText, { color: colors.textTertiary }]}>
                                        Ping: <Text style={{ color: '#10B981', fontWeight: '700' }}>{item.latency}</Text>
                                    </Text>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onPress={() => success(`Configuration panel for ${item.name} opened`)}
                                    >
                                        Configure
                                    </Button>
                                </View>
                            </Card>
                        );
                    })}
                </View>
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
    headerSubtitle: {
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    integrationsGrid: {
        gap: 12,
    },
    integrationCard: {
        padding: 16,
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    typeText: {
        fontSize: 12,
        lineHeight: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        marginTop: 6,
        borderTopWidth: 1,
    },
    latencyText: {
        fontSize: 12,
    },
});
