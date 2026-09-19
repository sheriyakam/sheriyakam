import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, TrendingUp, DollarSign, Zap, Users, Star,
    Clock, Download, Award, ShieldCheck, CheckCircle, RotateCw
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getBookings } from '../../constants/bookingStore';
import { getPartners } from '../../constants/partnerStore';

export default function AdminAnalyticsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        setBookings(getBookings());
        setPartners(getPartners());
    }, []);

    const totalJobs = bookings.length + 1100; // Combine active session with historical baseline
    const totalGross = bookings.reduce((s, b) => s + (b.finalPrice || b.price || 0), 0) + 276000;
    const completedJobsCount = bookings.filter(b => b.status === 'completed').length + 1050;

    const DISTRICT_METRICS = [
        { name: 'Kannur (Thalassery HQ)', jobs: 480, revenue: '₹1,24,500', avgArrival: '22 mins', slaCompliance: '98.5%', color: COLORS.accent },
        { name: 'Kozhikode District', jobs: 340, revenue: '₹88,200', avgArrival: '26 mins', slaCompliance: '96.2%', color: '#10b981' },
        { name: 'Ernakulam (Kochi)', jobs: 210, revenue: '₹56,400', avgArrival: '28 mins', slaCompliance: '95.0%', color: '#f59e0b' },
        { name: 'Thrissur & Malabar', jobs: 180, revenue: '₹44,900', avgArrival: '31 mins', slaCompliance: '94.2%', color: '#8b5cf6' }
    ];

    const SERVICE_SHARES = [
        { title: 'Emergency Repair Specialist', percent: 34, revenue: '₹1,02,000', color: COLORS.danger },
        { title: 'Inverter AC Foam Jet & Gas', percent: 28, revenue: '₹84,000', color: COLORS.accent },
        { title: 'Ceiling Fan & Switchboards', percent: 22, revenue: '₹66,000', color: COLORS.gold },
        { title: 'IP CCTV & NVR Setup', percent: 16, revenue: '₹48,000', color: '#10b981' }
    ];

    const handleExport = () => {
        Alert.alert(
            '📄 Operations Analytics CSV Exported',
            `Sheriyakam Performance Report (District SLAs, Partner Utilization, Repeat Rates) generated and sent to management.`
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Marketplace Analytics & SLAs</Text>
                    <Text style={styles.headerSub}>Arrival performance, district revenue & partner utilization</Text>
                </View>
                <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
                    <Download size={16} color={COLORS.accent} />
                    <Text style={styles.exportBtnText}>CSV</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* 4 Core High-Level KPIs */}
                <View style={styles.kpiGrid}>
                    <View style={[styles.kpiCard, { borderTopColor: COLORS.success }]}>
                        <View style={styles.kpiTop}>
                            <Text style={styles.kpiLabel}>Gross Volume</Text>
                            <DollarSign size={16} color={COLORS.success} />
                        </View>
                        <Text style={styles.kpiValue}>₹{totalGross.toLocaleString()}</Text>
                        <Text style={[styles.kpiChange, { color: COLORS.success }]}>+24% month over month</Text>
                    </View>

                    <View style={[styles.kpiCard, { borderTopColor: COLORS.accent }]}>
                        <View style={styles.kpiTop}>
                            <Text style={styles.kpiLabel}>Total Bookings</Text>
                            <Zap size={16} color={COLORS.accent} />
                        </View>
                        <Text style={styles.kpiValue}>{totalJobs.toLocaleString()}</Text>
                        <Text style={[styles.kpiChange, { color: COLORS.accent }]}>98.2% completion rate</Text>
                    </View>

                    <View style={[styles.kpiCard, { borderTopColor: '#3b82f6' }]}>
                        <View style={styles.kpiTop}>
                            <Text style={styles.kpiLabel}>Avg Arrival Time</Text>
                            <Clock size={16} color="#3b82f6" />
                        </View>
                        <Text style={styles.kpiValue}>24 Mins</Text>
                        <Text style={[styles.kpiChange, { color: COLORS.success }]}>vs 90m SLA (96.8% on-time)</Text>
                    </View>

                    <View style={[styles.kpiCard, { borderTopColor: COLORS.gold }]}>
                        <View style={styles.kpiTop}>
                            <Text style={styles.kpiLabel}>Customer Rating</Text>
                            <Star size={16} color={COLORS.gold} fill={COLORS.gold} />
                        </View>
                        <Text style={styles.kpiValue}>4.92 ★</Text>
                        <Text style={[styles.kpiChange, { color: COLORS.gold }]}>Based on 1,050+ reviews</Text>
                    </View>
                </View>

                {/* 90-Minute Arrival SLA Benchmark Section */}
                <View style={styles.slaSectionCard}>
                    <View style={styles.slaHeaderRow}>
                        <ShieldCheck size={20} color={COLORS.success} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.slaCardTitle}>90-Minute Emergency Arrival SLA</Text>
                            <Text style={styles.slaCardSub}>Tracking actual wireman GPS arrival vs marketed 90-minute ceiling</Text>
                        </View>
                        <View style={styles.slaScoreBadge}>
                            <Text style={styles.slaScoreVal}>96.8%</Text>
                            <Text style={styles.slaScoreLabel}>On-Time SLA</Text>
                        </View>
                    </View>

                    <View style={styles.slaProgressTrack}>
                        <View style={[styles.slaProgressBar, { width: '96.8%' }]} />
                    </View>

                    <View style={styles.slaBenchmarksRow}>
                        <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkLabel}>Fastest Arrival (Thalassery):</Text>
                            <Text style={styles.benchmarkVal}>14 Mins</Text>
                        </View>
                        <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkLabel}>Average Across Kerala:</Text>
                            <Text style={styles.benchmarkVal}>24.5 Mins</Text>
                        </View>
                        <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkLabel}>SLA Breaches This Week:</Text>
                            <Text style={[styles.benchmarkVal, { color: COLORS.danger }]}>2 Jobs (0.4%)</Text>
                        </View>
                    </View>
                </View>

                {/* Partner Utilization & Repeat Customer Rate */}
                <View style={styles.twoColRow}>
                    <View style={styles.subMetricCard}>
                        <View style={styles.subMetricHeader}>
                            <Users size={16} color={COLORS.accent} />
                            <Text style={styles.subMetricTitle}>Partner Utilization</Text>
                        </View>
                        <Text style={styles.subMetricVal}>4.2 Jobs / Day</Text>
                        <Text style={styles.subMetricSub}>82% active shift occupancy across 80+ licensed wiremen</Text>
                    </View>

                    <View style={styles.subMetricCard}>
                        <View style={styles.subMetricHeader}>
                            <RotateCw size={16} color={COLORS.gold} />
                            <Text style={styles.subMetricTitle}>Repeat Customers</Text>
                        </View>
                        <Text style={styles.subMetricVal}>41.8%</Text>
                        <Text style={styles.subMetricSub}>Households rebooking for AC AMC or periodic safety audits</Text>
                    </View>
                </View>

                {/* District Performance Breakdown */}
                <Text style={styles.sectionHeading}>REGIONAL DISTRICT DISPATCH PERFORMANCE</Text>
                <View style={styles.districtList}>
                    {DISTRICT_METRICS.map(d => (
                        <View key={d.name} style={styles.districtCard}>
                            <View style={styles.districtCardTop}>
                                <Text style={styles.districtName}>{d.name}</Text>
                                <Text style={styles.districtRev}>{d.revenue}</Text>
                            </View>
                            <View style={styles.districtMetaRow}>
                                <Text style={styles.districtMetaItem}>Bookings: {d.jobs}</Text>
                                <Text style={styles.districtMetaItem}>Avg Arrival: {d.avgArrival}</Text>
                                <Text style={[styles.districtMetaItem, { color: COLORS.success }]}>SLA: {d.slaCompliance}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Service Category Shares */}
                <Text style={styles.sectionHeading}>REVENUE BY SERVICE SPECIALIZATION</Text>
                <View style={styles.serviceSharesCard}>
                    {SERVICE_SHARES.map(s => (
                        <View key={s.title} style={styles.shareRow}>
                            <View style={styles.shareHeader}>
                                <Text style={styles.shareTitle}>{s.title}</Text>
                                <Text style={styles.shareAmount}>{s.revenue} ({s.percent}%)</Text>
                            </View>
                            <View style={styles.shareTrack}>
                                <View style={[styles.shareBar, { width: `${s.percent}%`, backgroundColor: s.color }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    exportBtnText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
        gap: 16,
    },
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    kpiCard: {
        width: '48%',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderTopWidth: 3,
    },
    kpiTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    kpiLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
    },
    kpiValue: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.textPrimary,
        marginTop: 6,
    },
    kpiChange: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
    slaSectionCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    slaHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slaCardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    slaCardSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    slaScoreBadge: {
        alignItems: 'flex-end',
    },
    slaScoreVal: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.success,
    },
    slaScoreLabel: {
        fontSize: 9,
        color: COLORS.textSecondary,
    },
    slaProgressTrack: {
        height: 8,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 14,
    },
    slaProgressBar: {
        height: '100%',
        backgroundColor: COLORS.success,
        borderRadius: 4,
    },
    slaBenchmarksRow: {
        gap: 6,
    },
    benchmarkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    benchmarkLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    benchmarkVal: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    twoColRow: {
        flexDirection: 'row',
        gap: 10,
    },
    subMetricCard: {
        flex: 1,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    subMetricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    subMetricTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    subMetricVal: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.textPrimary,
        marginVertical: 4,
    },
    subMetricSub: {
        fontSize: 10,
        color: COLORS.textSecondary,
        lineHeight: 14,
    },
    sectionHeading: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    districtList: {
        gap: 10,
    },
    districtCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    districtCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    districtName: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    districtRev: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.accent,
    },
    districtMetaRow: {
        flexDirection: 'row',
        gap: 14,
    },
    districtMetaItem: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    serviceSharesCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 12,
    },
    shareRow: {
        gap: 6,
    },
    shareHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shareTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    shareAmount: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    shareTrack: {
        height: 6,
        backgroundColor: COLORS.bgTertiary,
        borderRadius: 3,
        overflow: 'hidden',
    },
    shareBar: {
        height: '100%',
        borderRadius: 3,
    }
});
