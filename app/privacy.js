import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Eye, Database, Share2, RefreshCw, UserCheck } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                >
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intro Card */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                    <Lock size={36} color={COLORS.primary || '#3b82f6'} style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Your Privacy Matters</Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        Sheriyakam is committed to protecting your personal data. This Privacy Policy details how we collect, store, share, and protect your information when using our application and home services platform.
                    </Text>
                    <Text style={[styles.lastUpdated, { color: colors.textTertiary }]}>Last Updated: June 2026</Text>
                </View>

                {/* Section 1: Data Inventory */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Eye size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. What Data We Collect</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We collect information necessary to register accounts, process bookings, and dispatch electrical contractors:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **Account Metadata**: Name, Email address, and Mobile number.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **Location Information**: Approximate coordinates and booking address details to match and route nearby technicians.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **Service Data**: Service requests, timestamps, job photos, feedback, and payment completion status.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **Device Metadata**: IP address, operating system, and unique device identifier for security logs.</Text>
                    </View>
                </View>

                {/* Section 2: Purpose of Collection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Database size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. How We Use Your Data</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Your data is used strictly to provide a secure and reliable service:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Matching customers with independent licensed electrical contractors.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Sending transactional SMS, push notifications, and email booking receipts.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Enforcing security limits (IP rate limiting, login locks, security logs).</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Analysing usage behaviours to improve user interfaces and service delivery.</Text>
                    </View>
                </View>

                {/* Section 3: Third-Party Disclosures */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Share2 size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>3. Third-Party Disclosures</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We do not sell your personal data. We disclose specific metadata only to trusted integration partners:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **Supabase Auth**: Authentication data is securely managed by Supabase; passwords are never visible or stored on our servers.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• **MapMyIndia / OpenStreetMap**: Location inputs are processed to calculate routing coordinates.</Text>
                    </View>
                </View>

                {/* Section 4: Retention Period */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <RefreshCw size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>4. Data Retention & Deletion</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We retain your profile data as long as your account remains active. If you request account deletion, your metadata (names, emails, addresses) will be purged or fully anonymised within 30 days, subject to legal bookkeeping obligations.
                    </Text>
                </View>

                {/* Section 5: User Rights */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <UserCheck size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>5. Your Rights (GDPR & CCPA)</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        You hold complete control over your personal data. You are entitled to:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Access the metadata we store about your profile.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Request corrections to outdated email addresses or phone contacts.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Request complete deletion of your account and related booking profiles.</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary, marginTop: 8 }]}>
                        To exercise these rights, please contact our support team directly.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
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
        paddingHorizontal: SPACING.md || 16,
        paddingVertical: SPACING.sm || 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: SPACING.md || 16,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
        textAlign: 'center',
    },
    cardIcon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 12,
    },
    lastUpdated: {
        fontSize: 12,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bulletList: {
        marginTop: 8,
        paddingLeft: 8,
        gap: 6,
    },
    bulletPoint: {
        fontSize: 13,
        lineHeight: 18,
    },
});
