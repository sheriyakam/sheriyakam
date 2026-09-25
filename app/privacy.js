import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { ArrowLeft, Lock, Eye, Database, Share2, RefreshCw, UserCheck, ShieldCheck, Scale, ShieldAlert, Globe, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConsentManagerModal } from '../components/ConsentManagerModal';

export default function PrivacyScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme() || { theme: 'dark', colors: COLORS };
    const isDark = theme === 'dark';
    const [showConsentModal, setShowConsentModal] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>Privacy Policy & DPDP Act Compliance | Sheriyakam</title>
                <meta name="description" content="Sheriyakam Privacy Policy: Compliant with India's DPDP Act 2023. Transparent data collection, strict partner sharing limits, zero third-party ad selling, and 1-tap data deletion." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/privacy" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { 
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0' 
            }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>India DPDP Act 2023 & IT Rules 2021 Compliant</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/grievance')} style={styles.hubBtn}>
                    <Badge variant="gold" size="sm">Grievance Desk</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <Card variant="elevated" style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <Badge variant="success" size="md">Digital Personal Data Protection (DPDP) Act, 2023</Badge>
                    <Text style={styles.heroTitle}>
                        Your Privacy, Protected by Plain-Language Principles
                    </Text>
                    <Text style={styles.heroSub}>
                        At Sheriyakam, we collect only the minimal information required to get a licensed electrician to your doorstep safely. We never sell, rent, or trade your personal data to advertisers.
                    </Text>
                    <View style={styles.statutoryBadges}>
                        <Badge variant="info">Zero Ad Selling</Badge>
                        <Badge variant="purple">Encrypted at Rest (AES-256)</Badge>
                        <Badge variant="gold">1-Tap Data Erasure</Badge>
                    </View>
                    <Text style={styles.lastUpdated}>
                        Last Updated: September 2026 • Thalassery & Kozhikode Jurisdiction
                    </Text>
                </Card>

                {/* Consent Management Banner */}
                <TouchableOpacity
                    onPress={() => setShowConsentModal(true)}
                    style={[styles.consentBanner, { 
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF', 
                        borderColor: '#10B98150' 
                    }]}
                    accessibilityRole="button"
                    accessibilityLabel="Manage DPDP Consent Preferences"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                            <Lock size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                                Manage DPDP Privacy & Cookie Preferences
                            </Text>
                            <Text style={[styles.bannerSub, { color: colors.textTertiary }]}>
                                Toggle location permissions, notification alerts & diagnostic telemetry
                            </Text>
                        </View>
                    </View>
                    <ChevronRight size={18} color={colors.accent} />
                </TouchableOpacity>

                {/* Section 1: What Data We Collect */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Eye size={20} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            1. What Information We Collect (Section 5 DPDP Notice)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We collect only data necessary to fulfill your doorstep electrical booking:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Contact Info</Text>: Your name and verified mobile phone number (used for booking status and two-way Start/End OTP verification).
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Doorstep Address & GPS</Text>: House name/number, street, municipality/taluk, pin code, and GPS coordinates used solely to navigate the nearest electrician to your location.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Payment Details</Text>: Transaction IDs, invoice amounts, and GST receipts. We do NOT store your full debit/credit card numbers or CVV; all transactions are processed via RBI-authorized payment gateways (Razorpay / UPI).
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Job Photos & Multimeter Logs</Text>: Optional photos of the switchboard or DB you upload to help diagnose the issue before dispatch.
                        </Text>
                    </View>
                </Card>

                {/* Section 2: How We Share Data with Electrician Partners */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Share2 size={20} color="#F59E0B" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            2. Sharing Data with Assigned Electrician Partners
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        To protect your personal privacy while enabling timely service:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Active Booking Only</Text>: The assigned electrician receives your first name, locality, address, and job description only during the active service window.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>No Private Marketing</Text>: Partner agreements strictly prohibit technicians from harvesting customer phone numbers for off-platform marketing or private soliciting.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Post-Job Masking</Text>: Once the job End-OTP is confirmed, direct location tracking is terminated.
                        </Text>
                    </View>
                </Card>

                {/* Section 3: Data Principal Rights under DPDP Act 2023 */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <UserCheck size={20} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            3. Your Rights Under DPDP Act 2023
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        As a Data Principal under Indian law, you have full control over your data:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Access & Summary</Text>: You can request an export of all personal data held about your account.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Correction</Text>: You can edit or update your address and contact info at any time inside the app.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Erasure (1-Tap Deletion)</Text>: You can delete your account permanently via Account Settings. All personal identifiers are cryptographically purged from production databases (except tax invoice logs legally mandated to be held for statutory audit).
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Nominate</Text>: You can designate a nominee in the event of death or incapacity.
                        </Text>
                    </View>
                </Card>

                {/* Section 4: Resident Grievance Officer */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color="#8B5CF6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            4. Resident Grievance Redressal Officer (IT Rules 2021)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        For privacy concerns, data deletion requests, or statutory grievances, contact our designated Grievance Officer:
                    </Text>
                    <View style={[styles.officerBox, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                        <Text style={[styles.officerName, { color: colors.textPrimary }]}>
                            K. Suresh Kumar (Chief Grievance Redressal Officer)
                        </Text>
                        <Text style={[styles.officerDetail, { color: colors.textSecondary }]}>
                            Sheriyakam Technologies, Main Road, Thalassery, Kannur, Kerala - 670101
                        </Text>
                        <Text style={[styles.officerContact, { color: colors.accent }]}>
                            Email: grievance@sheriyakam.in • dpo@sheriyakam.in
                        </Text>
                        <Text style={[styles.officerContact, { color: colors.textSecondary }]}>
                            Phone: +91 495 280 0000 (Mon–Sat, 9:00 AM – 6:00 PM IST)
                        </Text>
                        <View style={styles.slaBadgeRow}>
                            <Badge variant="success" size="sm">24-Hr Acknowledgment</Badge>
                            <Badge variant="info" size="sm">15-Day Resolution SLA</Badge>
                        </View>
                    </View>
                </Card>

                <View style={{ height: 40 }} />
            </ScrollView>

            <ConsentManagerModal
                visible={showConsentModal}
                onClose={() => setShowConsentModal(false)}
            />
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    headerSub: {
        fontSize: 11,
    },
    hubBtn: {
        padding: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        gap: 14,
        maxWidth: 960,
        width: '100%',
        alignSelf: 'center',
    },
    heroCard: {
        padding: 20,
        borderRadius: 18,
        gap: 12,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    heroSub: {
        color: '#CBD5E1',
        fontSize: 13.5,
        lineHeight: 20,
    },
    statutoryBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    lastUpdated: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 2,
    },
    consentBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    bannerSub: {
        fontSize: 11,
        marginTop: 1,
    },
    sectionCard: {
        padding: 18,
        borderRadius: 16,
        gap: 10,
        borderWidth: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15.5,
        fontWeight: '800',
        flex: 1,
    },
    sectionText: {
        fontSize: 13,
        lineHeight: 20,
    },
    bulletList: {
        gap: 8,
    },
    bulletPoint: {
        fontSize: 13,
        lineHeight: 20,
    },
    officerBox: {
        padding: 14,
        borderRadius: 12,
        gap: 6,
        marginTop: 4,
    },
    officerName: {
        fontSize: 14,
        fontWeight: '800',
    },
    officerDetail: {
        fontSize: 12,
        lineHeight: 17,
    },
    officerContact: {
        fontSize: 12,
        fontWeight: '600',
    },
    slaBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
});
