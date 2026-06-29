import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Scale, Lock } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function TermsScreen() {
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Terms of Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intro Card */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                    <Shield size={36} color={COLORS.primary || '#3b82f6'} style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Legal Agreement</Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        Welcome to Sheriyakam. These Terms of Service ("Terms") govern your access to and use of our mobile application, website, and home services matching platform. By registering or using our platform, you accept and agree to be bound by these Terms.
                    </Text>
                    <Text style={[styles.lastUpdated, { color: colors.textTertiary }]}>Last Updated: June 2026</Text>
                </View>

                {/* Section 1: Permitted Use */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CheckCircle size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. Permitted Use & Rules</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Our platform connects customers with certified electrical contractors in Kerala. You agree to use the service only for lawful purposes. You are strictly prohibited from:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Providing false, inaccurate, or misleading details during sign-up.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Engaging in scanning, scraping, hacking, or violating platform security.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Harassing, abusing, or threatening matching technicians or customers.</Text>
                    </View>
                </View>

                {/* Section 2: Account Termination */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Lock size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. Account Suspension & Termination</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We reserve the right to suspend or terminate your account and restrict access to the platform immediately, without prior notice, if you violate any rules, breach security protocols, or engage in fraudulent activities.
                    </Text>
                </View>

                {/* Section 3: User Generated Content */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>3. User Reviews & Content</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Users may post reviews, comments, or job photos. You retain ownership of your content but grant Sheriyakam a royalty-free, perpetual license to use, display, and distribute it. All user-generated content must remain respectful, accurate, and free of intellectual property infringement.
                    </Text>
                </View>

                {/* Section 4: Liability Disclaimer */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AlertTriangle size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>4. Liability Disclaimers</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam matches users with independent local partners. To the maximum extent permitted by law:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• We provide services "as is" and do not warrant 100% platform uptime or error-free operations.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• We are not liable for any direct, indirect, or consequential damages resulting from matching technician visits, delayed work, or pricing disputes.</Text>
                    </View>
                </View>

                {/* Section 5: Dispute Resolution */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>5. Jurisdiction & Dispute Resolution</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of your use of the platform shall be settled through binding arbitration in Kozhikode, Kerala, India, or resolved under the exclusive jurisdiction of the state courts located in Kerala.
                    </Text>
                </View>

                {/* Section 6: Right to Modify */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Shield size={20} color={COLORS.primary || '#3b82f6'} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>6. Modifications to Terms</Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We reserve the right to modify these Terms at any time. Continued use of the platform following any modifications constitutes your explicit acceptance of the revised Terms of Service.
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
