import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, DollarSign, Zap, Users, Star, Clock, Download } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { StatCard, Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const TALUK_METRICS = [
    { name: 'Kozhikode Taluk', bookings: 642, revenue: '₹1,58,400', sla: '19 mins', satisfaction: 4.9 },
    { name: 'Vadakara Taluk', bookings: 218, revenue: '₹54,200', sla: '24 mins', satisfaction: 4.8 },
    { name: 'Thamarassery Taluk', bookings: 145, revenue: '₹38,900', sla: '26 mins', satisfaction: 4.9 },
    { name: 'Koyilandy Taluk', bookings: 98, revenue: '₹24,500', sla: '28 mins', satisfaction: 4.7 },
];

const SERVICE_BREAKDOWN = [
    { title: 'Ceiling & Exhaust Fan Fixes', percent: 38, count: '420 jobs', color: '#6366F1' },
    { title: 'Short Circuit & MCB Overhaul', percent: 28, count: '310 jobs', color: '#10B981' },
    { title: 'Inverter & Battery Wiring', percent: 18, count: '198 jobs', color: '#F59E0B' },
    { title: 'AC Isolator Mounting', percent: 16, count: '175 jobs', color: '#EC4899' },
];

export default function AdminAnalyticsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleExport = () => {
        success('Monthly Business & Tax Report CSV exported successfully!', 'Report Generated');
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
                        Analytics & Performance
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Real-time revenue, SLAs, and growth metrics
                    </Text>
                </View>
                <Button variant="secondary" size="sm" iconLeft={Download} onPress={handleExport}>
                    Export CSV
                </Button>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Core Top Metrics */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Gross Bookings"
                        value="₹2,76,000"
                        change="24%"
                        isPositive={true}
                        icon={DollarSign}
                        iconColor="#10B981"
                    />
                    <StatCard
                        title="Total Jobs"
                        value="1,103"
                        change="18%"
                        isPositive={true}
                        icon={Zap}
                        iconColor={colors.accent}
                    />
                </View>

                <View style={[styles.statsGrid, { marginTop: 10 }]}>
                    <StatCard
                        title="Average Arrival ETA"
                        value="21 Mins"
                        change="3 mins faster"
                        isPositive={true}
                        icon={Clock}
                        iconColor="#3B82F6"
                    />
                    <StatCard
                        title="Customer Rating"
                        value="4.9 ★"
                        change="98.6% positive"
                        isPositive={true}
                        icon={Star}
                        iconColor="#F59E0B"
                    />
                </View>

                {/* Service Category Share */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    BOOKINGS BY SERVICE TYPE
                </Text>
                <Card variant="default" style={styles.categoryCard}>
                    {SERVICE_BREAKDOWN.map((item, idx) => (
                        <View key={idx} style={styles.categoryRow}>
                            <View style={styles.categoryInfo}>
                                <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.categoryCount, { color: colors.textTertiary }]}>
                                    {item.count} ({item.percent}%)
                                </Text>
                            </View>
                            <View style={[styles.progressTrack, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                <View style={[styles.progressBar, { width: `${item.percent}%`, backgroundColor: item.color }]} />
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Taluk Regional Breakdown */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    REGIONAL TALUK PERFORMANCE
                </Text>
                <View style={styles.talukGrid}>
                    {TALUK_METRICS.map((taluk, idx) => (
                        <Card key={idx} variant="default" style={styles.talukCard}>
                            <View style={styles.talukTop}>
                                <Text style={[styles.talukName, { color: colors.textPrimary }]}>
                                    {taluk.name}
                                </Text>
                                <Badge variant="success" size="sm">{taluk.satisfaction} ★</Badge>
                            </View>

                            <View style={styles.talukStats}>
                                <View>
                                    <Text style={[styles.talukStatLabel, { color: colors.textTertiary }]}>Revenue</Text>
                                    <Text style={[styles.talukStatVal, { color: colors.accent }]}>{taluk.revenue}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.talukStatLabel, { color: colors.textTertiary }]}>Bookings</Text>
                                    <Text style={[styles.talukStatVal, { color: colors.textPrimary }]}>{taluk.bookings}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.talukStatLabel, { color: colors.textTertiary }]}>Avg ETA</Text>
                                    <Text style={[styles.talukStatVal, { color: colors.textPrimary }]}>{taluk.sla}</Text>
                                </View>
                            </View>
                        </Card>
                    ))}
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
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    categoryCard: {
        padding: 16,
        gap: 14,
    },
    categoryRow: {
        gap: 6,
    },
    categoryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryTitle: {
        fontSize: 13,
        fontWeight: '600',
    },
    categoryCount: {
        fontSize: 12,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    talukGrid: {
        gap: 10,
    },
    talukCard: {
        padding: 14,
    },
    talukTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    talukName: {
        fontSize: 14,
        fontWeight: '700',
    },
    talukStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    talukStatLabel: {
        fontSize: 11,
        marginBottom: 2,
    },
    talukStatVal: {
        fontSize: 14,
        fontWeight: '700',
    },
});
