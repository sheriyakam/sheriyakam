import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, X, ShieldCheck, Zap, Star } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const MATRIX = [
    {
        feature: 'Govt Electrical License Verification',
        sheriyakam: true,
        local: false,
        megaApp: false,
        desc: 'Every contractor must hold a valid Kerala wireman license',
    },
    {
        feature: '30-Minute Emergency Dispatch',
        sheriyakam: true,
        local: false,
        megaApp: false,
        desc: 'Dedicated rapid standby electricians across Kozhikode zones',
    },
    {
        feature: '30-Day Free Rework Warranty',
        sheriyakam: true,
        local: false,
        megaApp: true,
        desc: 'Free return visit if the same problem recurs within 30 days',
    },
    {
        feature: 'Fixed Transparent Labor Tariff',
        sheriyakam: true,
        local: false,
        megaApp: true,
        desc: 'Standard pricing known before work starts — zero bargaining',
    },
    {
        feature: 'Local Malayalam Phone & Chat Support',
        sheriyakam: true,
        local: true,
        megaApp: false,
        desc: 'Direct Kerala dispatch team, not a remote chatbot',
    },
    {
        feature: 'GST Digital Invoice & Audit Log',
        sheriyakam: true,
        local: false,
        megaApp: true,
        desc: 'Official tax invoice for warranty & domestic insurance claims',
    },
];

export default function CompareScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Service Comparison</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info">Standard of Excellence</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Why Homeowners in Kerala Choose Sheriyakam
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        See how we stack up against unverified neighborhood handymen and generic national booking apps.
                    </Text>
                </View>

                {/* Comparison Matrix Table */}
                <Card variant="default" style={styles.matrixCard}>
                    {/* Header Columns */}
                    <View style={[styles.tableHeaderRow, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <Text style={[styles.colFeature, { color: colors.textTertiary }]}>BENCHMARKS</Text>
                        <Text style={[styles.colSheriyakam, { color: colors.accent, fontWeight: '800' }]}>SHERIYAKAM</Text>
                        <Text style={[styles.colOther, { color: colors.textTertiary }]}>LOCAL HANDYMAN</Text>
                    </View>

                    {MATRIX.map((item, idx) => (
                        <View 
                            key={idx} 
                            style={[
                                styles.row,
                                { borderBottomColor: isDark ? '#27272A50' : '#F4F4F5' }
                            ]}
                        >
                            <View style={styles.featureCol}>
                                <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                                    {item.feature}
                                </Text>
                                <Text style={[styles.featureDesc, { color: colors.textTertiary }]}>
                                    {item.desc}
                                </Text>
                            </View>

                            {/* Sheriyakam status */}
                            <View style={styles.statusCol}>
                                <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                                    <Check size={16} color="#10B981" strokeWidth={3} />
                                </View>
                            </View>

                            {/* Local Handyman status */}
                            <View style={styles.statusCol}>
                                {item.local ? (
                                    <View style={[styles.iconCircle, { backgroundColor: '#10B98115' }]}>
                                        <Check size={14} color="#10B981" />
                                    </View>
                                ) : (
                                    <View style={[styles.iconCircle, { backgroundColor: '#EF444415' }]}>
                                        <X size={14} color="#EF4444" />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Bottom CTA */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/search')}
                    style={{ marginTop: 20 }}
                >
                    Experience the Difference — Book Now
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
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    matrixCard: {
        padding: 14,
        marginVertical: 10,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    colFeature: {
        flex: 1.6,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    colSheriyakam: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    colOther: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    featureCol: {
        flex: 1.6,
        paddingRight: 6,
    },
    featureText: {
        fontSize: 13,
        fontWeight: '600',
    },
    featureDesc: {
        fontSize: 11,
        marginTop: 2,
        lineHeight: 15,
    },
    statusCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
