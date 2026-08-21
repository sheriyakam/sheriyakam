import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Eye, Database, Share2, RefreshCw, UserCheck, ShieldCheck, Scale, ShieldAlert, Globe, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConsentManagerModal } from '../components/ConsentManagerModal';

export default function PrivacyScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [showConsentModal, setShowConsentModal] = useState(false);

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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Privacy Policy & Legal Disclosures</Text>
                <TouchableOpacity onPress={() => router.push('/compliance')} style={styles.hubBtn}>
                    <Badge variant="gold" size="sm">Compliance Hub</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intro Card */}
                <Card variant="elevated" style={styles.heroCard}>
                    <ShieldCheck size={36} color="#10B981" style={styles.cardIcon} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                        Data Privacy & Statutory Protection Policy
                    </Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        Sheriyakam Technologies Pvt Ltd is committed to the highest standards of data governance. This policy complies with the **Digital Personal Data Protection (DPDP) Act, 2023**, **Information Technology (IT) Rules, 2021**, **CERT-In Cyber Guidelines (2022)**, and **Consumer Protection (E-Commerce) Rules, 2020**.
                    </Text>
                    <View style={styles.statutoryBadges}>
                        <Badge variant="success">DPDP Act 2023</Badge>
                        <Badge variant="info">IT Rules 2021 (Rule 3(2))</Badge>
                        <Badge variant="neutral">CERT-In Mandate</Badge>
                        <Badge variant="purple">CCPA 2020</Badge>
                    </View>
                    <Text style={[styles.lastUpdated, { color: colors.textTertiary }]}>
                        Last Legally Reviewed & Updated: August 2026 • Kozhikode Jurisdiction
                    </Text>
                </Card>

                {/* Consent Management Shortcut */}
                <TouchableOpacity
                    onPress={() => setShowConsentModal(true)}
                    style={[styles.consentBanner, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: '#10B98150' }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                            <Lock size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                                Manage DPDP Consent Preferences
                            </Text>
                            <Text style={[styles.bannerSub, { color: colors.textTertiary }]}>
                                Review or withdraw granular permissions (GPS, WhatsApp, Telemetry)
                            </Text>
                        </View>
                    </View>
                    <ChevronRight size={18} color={colors.accent} />
                </TouchableOpacity>

                {/* Section 1: DPDP Act 2023 Notice & Data Inventory */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Eye size={20} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            1. Data Inventory & Section 5 Notice (DPDP Act, 2023)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        In compliance with Section 5 of the DPDP Act 2023, we collect only minimal data strictly necessary for processing domestic electrical repair contracts:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Identity & Authentication</Text>: Name, verified phone number, email address, encrypted authentication tokens managed by Supabase Auth.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Doorstep Geolocation</Text>: Address, landmark, taluk, and precise latitude/longitude used solely for dispatching Kerala licensed electricians during active appointments.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Transactional & Billing Data</Text>: Service requests, timestamps, job photos, 18% GST (CGST/SGST SAC 9987) breakdown, and Razorpay payment identifiers.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Technical Logs (CERT-In Mandate)</Text>: IP addresses, session timestamps, and device identifiers retained in encrypted format for 180 days with IST NTP synchronization.
                        </Text>
                    </View>
                </View>

                {/* Section 2: Section 9 Child Data Protection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ShieldAlert size={20} color="#EF4444" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            2. Protection of Children's Data (Section 9, DPDP Act)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam does not knowingly process personal data of individuals under the age of 18 without verifiable parental consent. All users must confirm their age during registration. We strictly prohibit behavioral monitoring, targeted tracking, or commercial advertisements directed at minors.
                    </Text>
                </View>

                {/* Section 3: Data Principal Rights & Deletion */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <UserCheck size={20} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            3. Data Principal Rights (Access, Correction & Erasure)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Under Sections 11 to 14 of the DPDP Act 2023, you have the statutory right to:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Access</Text>: Obtain a summary of personal data processed and third-party recipients.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Correction & Completion</Text>: Update inaccurate profile contact details directly inside account settings.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Right to Erasure</Text>: Instant 1-tap permanent account deletion via Account & Security settings, executing cryptographic purge from all production databases within statutory limits.
                        </Text>
                    </View>
                </View>

                {/* Section 4: Resident Grievance Officer Details (IT Rules 2021) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color="#8B5CF6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            4. Resident Grievance Officer (Rule 3(2) IT Rules, 2021)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        For privacy grievances, dispute escalations, or content takedown requests under the IT Rules 2021, contact our designated Resident Grievance Officer:
                    </Text>
                    <Card variant="default" style={styles.officerBox}>
                        <Text style={[styles.officerName, { color: colors.textPrimary }]}>
                            Adv. Arun V. Nair (Chief Grievance Redressal Officer)
                        </Text>
                        <Text style={[styles.officerDetail, { color: colors.textSecondary }]}>
                            Sheriyakam Technologies Pvt Ltd, 3rd Floor, Malabar Trade Centre, Civil Station Road, Kozhikode, Kerala - 673020
                        </Text>
                        <Text style={[styles.officerContact, { color: colors.accent }]}>
                            Email: grievance@sheriyakam.com • dpo@sheriyakam.com
                        </Text>
                        <Text style={[styles.officerContact, { color: colors.textSecondary }]}>
                            Phone: +91 495 280 0001 (Mon–Sat, 9:30 AM – 6:00 PM IST)
                        </Text>
                        <View style={styles.slaBadgeRow}>
                            <Badge variant="success" size="sm">24-Hr Ack SLA</Badge>
                            <Badge variant="info" size="sm">15-Day Resolution SLA</Badge>
                            <Badge variant="neutral" size="sm">36-Hr Takedown Support</Badge>
                        </View>
                    </Card>
                </View>

                {/* Section 5: CERT-In 6-Hour Reporting Window */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Lock size={20} color="#EF4444" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            5. Cybersecurity Governance & CERT-In Protocol
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We enforce strict technical safeguards including TLS 1.3 encryption in transit, AES-256 at rest, and zero-knowledge password hashing. Pursuant to CERT-In directions under Section 70B of the IT Act, any cyber incident or unauthorized breach is reportable to CERT-In (incident@cert-in.org.in) within 6 hours.
                    </Text>
                </View>

                {/* Section 6: CCPA Dark Patterns Prohibition */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Eye size={20} color="#F59E0B" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            6. Ban on Dark Patterns (CCPA Guidelines, 2023)
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam strictly prohibits deceptive design practices:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• No false urgency timers or fabricated demand counters.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• No basket sneaking (spare parts are strictly opt-in).</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• No confirm shaming or disguised advertisements.</Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Full itemized billing including SAC 9987 (9% CGST + 9% Kerala SGST).</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Consent Modal */}
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
    officerBox: {
        padding: 14,
        gap: 6,
        marginTop: 4,
    },
    officerName: {
        fontSize: 14,
        fontWeight: '800',
    },
    officerDetail: {
        fontSize: 12,
        lineHeight: 16,
    },
    officerContact: {
        fontSize: 12,
        fontWeight: '600',
    },
    slaBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 6,
    },
});
