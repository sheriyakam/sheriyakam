import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Scale, Lock, ShieldCheck, FileCheck, Phone, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function TermsScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Terms of Service</Text>
                <TouchableOpacity onPress={() => router.push('/compliance')} style={styles.hubBtn}>
                    <Badge variant="gold" size="sm">Compliance Hub</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intro Card */}
                <Card variant="elevated" style={styles.heroCard}>
                    <Scale size={36} color={colors.accent} style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                        Terms of Service & Statutory Agreement
                    </Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        Welcome to Sheriyakam (operated by Sheriyakam Technologies Pvt Ltd). These Terms govern your access to our mobile applications, website, and on-demand electrical services in Kerala under Indian Federal and State statutory frameworks.
                    </Text>
                    <View style={styles.statutoryBadges}>
                        <Badge variant="info">IT Act, 2000 & IT Rules 2021</Badge>
                        <Badge variant="success">Consumer Protection Rules 2020</Badge>
                        <Badge variant="purple">KSELB & CEA 2010</Badge>
                    </View>
                    <Text style={[styles.lastUpdated, { color: colors.textTertiary }]}>
                        Last Updated: August 2026 • Governing Law: Kozhikode, Kerala, India
                    </Text>
                </Card>

                {/* Section 1: Permitted Use & IT Rules 2021 */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CheckCircle size={20} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            1. Permitted Use & Platform Rules (IT Rules, 2021)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam connects homeowners with verified, government-licensed wiremen and contractors in Kerala. Under Rule 3(1)(b) of the Information Technology Rules, you agree NOT to host, upload, or transmit any content that:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Belongs to another person without authorization or infringes trade rights.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Is defamatory, obscene, pornographic, pedophilic, or invasive of bodily privacy.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Contains deepfakes, AI impersonation, or knowingly false misinformation.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Threatens the unity, integrity, defense, or public order of India.</Text>
                    </View>
                </View>

                {/* Section 2: Kerala Electrical Licensing & Standards */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ShieldCheck size={20} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            2. Electrician Qualifications & Kerala Trade Regulations
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        All electrical repairs, MCB diagnostics, and wiring installations are performed exclusively by technicians holding valid competency licenses issued by the **Kerala State Electricity Licensing Board (KSELB)** under the *Central Electricity Authority (Safety) Regulations, 2010*.
                    </Text>
                </View>

                {/* Section 3: Pricing, Dark Patterns & 30-Day Warranty */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FileCheck size={20} color="#F59E0B" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            3. Transparent Tariff, Dark Patterns Ban & 30-Day Warranty
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Under the Consumer Protection (E-Commerce) Rules 2020 and Guidelines for Prevention of Dark Patterns 2023:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Upfront Tariffs</Text>: Exact base labor charges and 18% GST (9% CGST + 9% Kerala SGST SAC 9987) are disclosed before checkout.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Zero Dark Patterns</Text>: All spare parts and surge protection addons are strictly opt-in with zero basket sneaking or forced subscriptions.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>30-Day Free Rework Warranty</Text>: If any fault recurs within 30 days of completion, a senior master wireman will revisit and resolve it with ₹0 visit fees.
                        </Text>
                    </View>
                </View>

                {/* Section 4: Property Damage Safety Protection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Shield size={20} color="#8B5CF6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            4. ₹5,00,000 Domestic Safety Protection Cover
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Every verified domestic booking on Sheriyakam is backed by our ₹5,00,000 property damage safety guarantee covering accidental electrical equipment damage occurring during an authorized repair.
                    </Text>
                </View>

                {/* Section 5: Grievance Redressal & Jurisdiction */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color="#EC4899" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            5. Grievance Redressal & Jurisdiction
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Any dispute, consumer complaint, or statutory notice shall be submitted to our Resident Grievance Officer (<Text style={{ color: colors.accent, fontWeight: '700' }}>grievance@sheriyakam.com</Text>) with guaranteed acknowledgment within 24 hours and resolution within 15 calendar days. These Terms shall be governed exclusively by the laws of India, and courts in Kozhikode, Kerala shall have exclusive jurisdiction.
                    </Text>

                    <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onPress={() => router.push('/grievance')}
                        style={{ marginTop: 10 }}
                    >
                        File a Statutory Dispute / Grievance
                    </Button>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    hubBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 14,
    },
    heroCard: {
        padding: 18,
        gap: 8,
    },
    cardIcon: {
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    cardText: {
        fontSize: 13,
        lineHeight: 19,
    },
    statutoryBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    lastUpdated: {
        fontSize: 11,
        marginTop: 4,
    },
    section: {
        gap: 8,
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    sectionText: {
        fontSize: 13,
        lineHeight: 19,
    },
    bulletList: {
        gap: 6,
        paddingLeft: 4,
    },
    bulletPoint: {
        fontSize: 12.5,
        lineHeight: 18,
    },
});
