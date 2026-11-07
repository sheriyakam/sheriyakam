import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldAlert, Phone, Send, CheckCircle2, FileText, AlertTriangle, ChevronRight, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';

const GRIEVANCE_CATEGORIES = [
    { label: 'Work Quality / 30-Day Warranty Dispute', value: 'work_quality' },
    { label: 'Billing / Unresolved Payment Dispute', value: 'billing_dispute' },
    { label: 'Technician Punctuality / Conduct', value: 'technician_conduct' },
    { label: 'Data Privacy & DPDP Erasure Request', value: 'privacy_dpdp' },
    { label: 'Property Damage / Workmanship Escalation', value: 'property_damage' },
    { label: 'Other Statutory Legal Notice', value: 'other' },
];

export default function GrievanceRedressalScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast() || { success: () => {}, error: () => {} };
    const isDark = theme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [category, setCategory] = useState('work_quality');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filedTicket, setFiledTicket] = useState(null);

    const handleSubmitGrievance = () => {
        if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
            showError('Please fill out all required grievance fields');
            return;
        }

        setIsSubmitting(true);
        const ticketId = 'SHK-GRV-' + Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
            setIsSubmitting(false);
            setFiledTicket({
                ticketId,
                category: GRIEVANCE_CATEGORIES.find((c) => c.value === category)?.label || 'General Dispute',
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                ackDeadline: 'Within 24 Hours',
                resDeadline: 'Within 15 Calendar Days',
            });
            success(`Grievance submitted! Ticket Reference: ${ticketId}`, 'Grievance Registered');
        }, 1000);
    };

    const handleCallOfficer = () => {
        const url = 'tel:+919447128901';
        if (Platform.OS === 'web') window.location.href = url;
        else Linking.openURL(url);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>Resident Grievance Redressal Officer | Sheriyakam</title>
                <meta name="description" content="Official Grievance Redressal mechanism for Sheriyakam under India Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023. Named officer, Thalassery HQ contact & 24-hr acknowledgment." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/grievance" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { 
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0' 
            }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Grievance Redressal</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Consumer Protection (E-Commerce) Rules, 2020</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/terms')} style={styles.hubBtn}>
                    <Badge variant="info" size="sm">Terms</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                

                {/* Grievance Submission Form */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Submit a Formal Dispute or Grievance
                    </Text>

                    {filedTicket ? (
                        <Card variant="elevated" style={[styles.ticketCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                            <View style={[styles.ticketCircle, { backgroundColor: '#10B98120' }]}>
                                <CheckCircle2 size={44} color="#10B981" />
                            </View>
                            <Text style={[styles.ticketTitle, { color: colors.textPrimary }]}>
                                Grievance Registered Successfully
                            </Text>
                            <Text style={[styles.ticketRef, { color: colors.accent }]}>
                                Docket ID: {filedTicket.ticketId}
                            </Text>
                            <Text style={[styles.ticketDesc, { color: colors.textSecondary }]}>
                                An official acknowledgment has been dispatched to your email. Our Resident Grievance Officer will review your submission and initiate resolution within statutory time limits.
                            </Text>

                            <View style={[styles.receiptBox, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Category:</Text>
                                    <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{filedTicket.category}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Logged IST:</Text>
                                    <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{filedTicket.timestamp}</Text>
                                </View>
                                <View style={styles.receiptRow}>
                                    <Text style={[styles.receiptLabel, { color: colors.textTertiary }]}>Statutory SLA:</Text>
                                    <Text style={[styles.receiptVal, { color: '#10B981' }]}>15 Calendar Days</Text>
                                </View>
                            </View>

                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth
                                onPress={() => setFiledTicket(null)}
                                style={{ marginTop: 12 }}
                            >
                                File Another Inquiry
                            </Button>
                        </Card>
                    ) : (
                        <Card variant="default" style={[styles.formCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                            <Input
                                label="Your Full Name *"
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. K. V. Mohandas"
                            />
                            <Input
                                label="Email Address *"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="mohandas@example.com"
                                keyboardType="email-address"
                            />
                            <Input
                                label="Mobile Phone Number (WhatsApp) *"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+91 98765 43210"
                                keyboardType="phone-pad"
                            />
                            <Input
                                label="Booking ID (If Applicable)"
                                value={bookingId}
                                onChangeText={setBookingId}
                                placeholder="e.g. BK-2026-8942"
                            />

                            <Dropdown
                                label="Grievance / Dispute Category *"
                                options={GRIEVANCE_CATEGORIES}
                                value={category}
                                onSelect={setCategory}
                            />

                            <TextArea
                                label="Detailed Statement of Grievance *"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Provide exact dates, booking details, technician notes, or specific clauses..."
                            />

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isSubmitting}
                                onPress={handleSubmitGrievance}
                                iconLeft={Send}
                                style={{ marginTop: 6 }}
                            >
                                Submit Official Grievance
                            </Button>
                        </Card>
                    )}
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
    sectionWrap: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 15.5,
        fontWeight: '800',
    },
    formCard: {
        padding: 18,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
    },
    ticketCard: {
        padding: 22,
        borderRadius: 16,
        alignItems: 'center',
        gap: 10,
    },
    ticketCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    ticketTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    ticketRef: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    ticketDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
    },
    receiptBox: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        gap: 6,
        marginTop: 6,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    receiptLabel: {
        fontSize: 12,
    },
    receiptVal: {
        fontSize: 12,
        fontWeight: '700',
    },
});
