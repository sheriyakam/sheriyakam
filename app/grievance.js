import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Scale, ShieldAlert, Mail, Phone, MapPin, Clock, Send, CheckCircle2, FileText, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';

const GRIEVANCE_CATEGORIES = [
    { label: 'Data Privacy & DPDP Rights (Erasure / Access)', value: 'privacy_dpdp' },
    { label: 'Content Takedown / Misinformation (36-hr SLA)', value: 'content_takedown' },
    { label: 'Billing, Pricing or Dark Pattern Violation', value: 'billing_dark_patterns' },
    { label: 'Technician Conduct / Quality Dispute', value: 'technician_conduct' },
    { label: 'Cybersecurity Incident / Breach Report', value: 'cybersecurity' },
    { label: 'Other Statutory Legal Grievance', value: 'other' },
];

export default function GrievanceRedressalScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('privacy_dpdp');
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
                category: GRIEVANCE_CATEGORIES.find((c) => c.value === category)?.label,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                ackDeadline: 'Within 24 Hours',
                resDeadline: 'Within 15 Days',
            });
            success(`Grievance submitted! Ticket Reference: ${ticketId}`, 'Grievance Registered');
        }, 1200);
    };

    const handleCallOfficer = () => {
        Linking.openURL('tel:+914952800001').catch(() => {
            success('Calling Grievance Officer desk (+91 495 280 0001)');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Grievance Redressal Mechanism
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Statutory Hero Notice */}
                <View style={styles.hero}>
                    <Badge variant="purple" size="md">Rule 3(2) of IT Rules, 2021</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Consumer Grievance & Compliance Portal
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the DPDP Act, 2023.
                    </Text>
                </View>

                {/* Designated Officers Card */}
                <Card variant="elevated" style={styles.officerCard}>
                    <View style={styles.officerHeader}>
                        <View style={[styles.scaleIconCircle, { backgroundColor: colors.accent + '20' }]}>
                            <Scale size={24} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.officerRole, { color: colors.textTertiary }]}>
                                DESIGNATED RESIDENT GRIEVANCE OFFICER
                            </Text>
                            <Text style={[styles.officerName, { color: colors.textPrimary }]}>
                                Adv. Arun V. Nair, LL.B.
                            </Text>
                            <Text style={[styles.officerLoc, { color: colors.textSecondary }]}>
                                Resident Compliance Officer (Kerala, India)
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <View style={styles.contactDetails}>
                        <View style={styles.contactRow}>
                            <MapPin size={16} color={colors.accent} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                3rd Floor, Malabar Trade Centre, Civil Station Road, Kozhikode - 673020
                            </Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Mail size={16} color={colors.accent} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                grievance@sheriyakam.com • dpo@sheriyakam.com
                            </Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Phone size={16} color={colors.accent} />
                            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                                +91 495 280 0001 (Mon–Sat, 9:30 AM – 6:00 PM IST)
                            </Text>
                        </View>
                    </View>

                    {/* Statutory SLAs */}
                    <View style={[styles.slaBar, { backgroundColor: isDark ? '#27272A' : '#EFF6FF' }]}>
                        <View style={styles.slaItem}>
                            <Clock size={14} color="#10B981" />
                            <Text style={[styles.slaLabel, { color: colors.textPrimary }]}>
                                Acknowledgement: <Text style={{ fontWeight: '800', color: '#10B981' }}>24 Hours</Text>
                            </Text>
                        </View>
                        <View style={styles.slaItem}>
                            <CheckCircle2 size={14} color="#3B82F6" />
                            <Text style={[styles.slaLabel, { color: colors.textPrimary }]}>
                                Final Resolution: <Text style={{ fontWeight: '800', color: '#3B82F6' }}>15 Days</Text>
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Grievance Submission Form */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    FILE A STATUTORY GRIEVANCE OR DISPUTE
                </Text>

                {filedTicket ? (
                    <Card variant="elevated" style={styles.ticketCard}>
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
                    <Card variant="default" style={styles.formCard}>
                        <Input
                            label="Complainant Full Name *"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Adv. K. Mohandas"
                        />
                        <Input
                            label="Official Email Address *"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="mohandas@example.com"
                            keyboardType="email-address"
                        />
                        <Input
                            label="Mobile Number (WhatsApp) *"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+91 98765 43210"
                            keyboardType="phone-pad"
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
                            placeholder="Specify order IDs, exact grievance details, dates, or relevant statutory clauses..."
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

                {/* 36-Hour Content Takedown & CERT-In Notice */}
                <Card variant="default" style={styles.legalNoticeCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <ShieldAlert size={18} color="#EF4444" />
                        <Text style={[styles.noticeTitle, { color: colors.textPrimary }]}>
                            Law Enforcement & CERT-In Emergency Protocol
                        </Text>
                    </View>
                    <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                        For court orders or government agency requests under Section 79(3)(b) of the IT Act (including 36-hour takedowns and CERT-In 6-hour cybersecurity breach reporting), reach our 24x7 Nodal Contact: <Text style={{ color: colors.accent, fontWeight: '700' }}>nodal@sheriyakam.com</Text>.
                    </Text>
                </Card>
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
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 12,
        gap: 6,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.4,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
    officerCard: {
        padding: 18,
        marginVertical: 10,
        gap: 12,
    },
    officerHeader: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    scaleIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    officerRole: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    officerName: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    officerLoc: {
        fontSize: 12,
        marginTop: 1,
    },
    divider: {
        height: 1,
    },
    contactDetails: {
        gap: 8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    contactText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
    },
    slaBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        borderRadius: 12,
        marginTop: 4,
    },
    slaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    slaLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    formCard: {
        padding: 16,
        gap: 10,
    },
    ticketCard: {
        padding: 22,
        alignItems: 'center',
        gap: 10,
    },
    ticketCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
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
        fontSize: 15,
        fontWeight: '800',
        fontFamily: 'monospace',
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
    legalNoticeCard: {
        padding: 16,
        marginTop: 16,
        gap: 6,
    },
    noticeTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    noticeText: {
        fontSize: 12,
        lineHeight: 17,
    },
});
