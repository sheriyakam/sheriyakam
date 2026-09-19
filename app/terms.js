import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Scale, Lock, ShieldCheck, FileCheck, Phone, ChevronRight, MapPin, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function TermsScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme() || { theme: 'dark', colors: COLORS };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>Terms of Service & Customer Guarantee | Sheriyakam</title>
                <meta name="description" content="Sheriyakam Terms of Service: Transparent pricing, OTP verification, Pay Safely terms, 30-day rework warranty, and ₹5 Lakh property damage protection across 14 Kerala districts." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/terms" />
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
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Terms of Service</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Empire Electricals Est. 1998 • KSELB Licence #KSELB/CA-7821/KL</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/grievance')} style={styles.hubBtn}>
                    <Badge variant="gold" size="sm">Grievance Desk</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <Card variant="elevated" style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <Badge variant="info" size="md">Transparent • Plain Language • Fair Terms</Badge>
                    <Text style={styles.heroTitle}>
                        Terms of Service & Customer Protection Agreement
                    </Text>
                    <Text style={styles.heroSub}>
                        Welcome to Sheriyakam, operated under Empire Electricals (Est. 1998, Class-A KSELB Licence #KSELB/CA-7821/KL, Thalassery, Kerala). We believe in simple, transparent terms without fine-print traps.
                    </Text>
                    <View style={styles.badgeRow}>
                        <Badge variant="success">Pay After Work</Badge>
                        <Badge variant="info">30-Day Free Rework</Badge>
                        <Badge variant="gold">₹5 Lakh Safety Cover</Badge>
                        <Badge variant="purple">All 14 Kerala Districts</Badge>
                    </View>
                    <Text style={styles.lastUpdatedText}>
                        Last Updated: September 2026 • Governed by the Laws of Kerala, India
                    </Text>
                </Card>

                {/* Section 1: Service Area Limitation */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <MapPin size={20} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            1. Service Area & Kerala District Coverage
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam operates exclusively across all 14 revenue districts of Kerala:
                    </Text>
                    <Text style={[styles.highlightText, { color: colors.accent }]}>
                        Kasaragod, Kannur (HQ Thalassery), Wayanad, Kozhikode, Malappuram, Palakkad, Thrissur, Ernakulam (Kochi), Idukki, Kottayam, Alappuzha, Pathanamthitta, Kollam, and Thiruvananthapuram.
                    </Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Bookings are accepted for residential homes, apartments, commercial offices, and retail establishments located within our active service pin codes.
                    </Text>
                </Card>

                {/* Section 2: Booking, OTP Verification & 30-Day Warranty */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <ShieldCheck size={20} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            2. Booking, OTP Job Verification & 30-Day Warranty
                        </Text>
                    </View>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>KSELB Certified Wiremen</Text>: All dispatches are assigned to technicians holding active wireman/supervisor permits issued by the Kerala Electrical Inspectorate.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Two-Way OTP Verification</Text>: For your security, the electrician will request a Start-OTP upon arrival to begin work, and an End-OTP after you test and confirm the completed fix.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>30-Day Rework Warranty</Text>: If any repaired switch, MCB, wiring connection, or fan installation exhibits the same fault within 30 days, we send a senior technician to re-inspect and fix it at ₹0 charge.
                        </Text>
                    </View>
                </Card>

                {/* Section 3: "Pay Safely" — Payment Terms & Dispute Process */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <FileCheck size={20} color="#3B82F6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            3. "Pay Safely" Terms & Payment Dispute Resolution
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        To ensure complete trust, Sheriyakam operates on a <Text style={{ fontWeight: '700', color: colors.textPrimary }}>"Pay After Work Done"</Text> model:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Zero Advance Required</Text>: You only pay after the electrical work has been finished, demonstrated, and verified by you.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Accepted Payment Modes</Text>: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, or Direct Cash to the wireman against an instant digital SMS/WhatsApp receipt.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Payment Refusal & Dispute Process</Text>: If you are genuinely dissatisfied with the workmanship or dispute an itemized material bill:
                        </Text>
                        <View style={{ paddingLeft: 16, gap: 4 }}>
                            <Text style={[styles.subBullet, { color: colors.textSecondary }]}>
                                1. Inform the technician and raise a dispute in the app or call support (+91 495 280 0000).
                            </Text>
                            <Text style={[styles.subBullet, { color: colors.textSecondary }]}>
                                2. An Empire Electricals senior supervisor will review the job photos and multitester readings within 24 hours.
                            </Text>
                            <Text style={[styles.subBullet, { color: colors.textSecondary }]}>
                                3. If the work was unsatisfactory, charges are adjusted or a free rework is dispatched. Customers may not arbitrarily withhold legitimate labor/material fees for completed code-compliant work.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Section 4: ₹5,00,000 Property Damage Protection Cover */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: '#10B98144' }]}>
                    <View style={styles.sectionHeader}>
                        <Shield size={20} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            4. ₹5 Lakh Property Damage Protection Cover
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Every verified booking completed through the Sheriyakam platform is backed by our commercial third-party domestic protection policy up to <Text style={{ fontWeight: '700', color: '#10B981' }}>₹5,00,000</Text>:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>What is Covered</Text>: Accidental short-circuit fires, appliance burnouts, or structural electrical damage proven to have occurred directly during authorized on-platform work due to technician oversight.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>What is NOT Covered</Text>: Pre-existing degraded wiring beyond the repair scope, acts of nature (direct lightning strikes, flood waterlogging), appliances with pre-existing internal board failures, or unapproved side-deals arranged outside the Sheriyakam platform.
                        </Text>
                        <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Claim Process</Text>: Submit claim within 72 hours via the app or <Text style={{ color: colors.accent, fontWeight: '700' }}>claims@sheriyakam.in</Text> with photos and description. An Empire Electricals engineer will inspect on-site within 24 hours.
                        </Text>
                    </View>
                </Card>

                {/* Section 5: Limitation of Liability */}
                <Card variant="default" style={[styles.sectionCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <View style={styles.sectionHeader}>
                        <Scale size={20} color="#8B5CF6" />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            5. Platform Liability & Governing Jurisdiction
                        </Text>
                    </View>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam operates as a technology intermediary connecting consumers with licensed electrical wiremen under the supervision of Empire Electricals. In all non-insured claims, platform liability is capped at the total fee charged for that specific service visit. These terms are governed exclusively by the laws of India, and courts in Kannur / Kozhikode, Kerala hold jurisdiction.
                    </Text>
                </Card>

                {/* Statutory Contact */}
                <View style={styles.contactRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>Have questions about these terms?</Text>
                        <Text style={[styles.contactSub, { color: colors.textSecondary }]}>Our Resident Grievance Officer is available Mon–Sat, 9:00 AM – 6:00 PM IST.</Text>
                    </View>
                    <Button variant="primary" size="sm" onPress={() => router.push('/grievance')}>
                        Grievance Desk
                    </Button>
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
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    lastUpdatedText: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 2,
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
    highlightText: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 20,
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        padding: 10,
        borderRadius: 10,
    },
    bulletList: {
        gap: 8,
    },
    bulletPoint: {
        fontSize: 13,
        lineHeight: 20,
    },
    subBullet: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        backgroundColor: 'rgba(37, 99, 235, 0.06)',
        marginTop: 6,
        gap: 12,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    contactSub: {
        fontSize: 12,
        marginTop: 2,
    },
});
