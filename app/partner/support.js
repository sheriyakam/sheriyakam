import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Linking, TextInput, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, ShieldAlert, PhoneCall, MessageCircle, AlertTriangle,
    Shield, Headphones, FileText, ChevronRight, CheckCircle,
    X, Send, Info, LifeBuoy
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, DEFAULT_PARTNER_MOCK, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerSupport() {
    const router = useRouter();
    const partner = getCurrentPartner() || DEFAULT_PARTNER_MOCK;
    const supervisor = getSupervisorForPartner(partner) || {
        name: 'Suresh Kumar',
        phone: '9876543210',
        taluk: 'Thalassery'
    };

    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Customer Absent / Door Locked');
    const [issueDescription, setIssueDescription] = useState('');
    const [activeTickets, setActiveTickets] = useState([
        {
            id: 'TKT-8842',
            date: '14 Sep 2026',
            category: 'Customer Absent / Door Locked',
            status: 'Resolved',
            resolution: '₹150 travel reimbursement credited to partner wallet.'
        },
        {
            id: 'TKT-7719',
            date: '02 Sep 2026',
            category: 'Billing Discrepancy',
            status: 'Resolved',
            resolution: 'Extra capacitor charge adjusted in invoice #INV-4412.'
        }
    ]);

    const handleTriggerSOS = () => {
        Alert.alert(
            '🚨 FIELD EMERGENCY (SOS)',
            'Trigger emergency assistance? This immediately alerts Supervisor Suresh Kumar and logs high-priority safety escalation at the Thalassery dispatch center.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: '🚨 CONFIRM SOS',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            '⚠️ SOS Broadcasted',
                            'Field SOS logged! Dispatcher is dialing you now. If you face life-threatening electrical arcing or fire, dial KSEB emergency 1912 immediately.',
                            [
                                { text: 'Call KSEB 1912', onPress: () => Linking.openURL('tel:1912') },
                                { text: 'Call Police 112', onPress: () => Linking.openURL('tel:112') },
                                { text: 'OK' }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const handleWhatsAppSupervisor = () => {
        const text = encodeURIComponent(
            `Hello Suresh Kumar, this is Partner ${partner.name} (KSELB: ${partner.kselbLicense || 'KSELB/CA-7821/KL'}). I need urgent field support in ${partner.taluk || 'Thalassery'} taluk.`
        );
        const url = `whatsapp://send?phone=91${supervisor.phone}&text=${text}`;
        Linking.openURL(url).catch(() => {
            Alert.alert(
                'WhatsApp Not Available',
                `Could not launch WhatsApp. Supervisor phone: +91 ${supervisor.phone}`
            );
        });
    };

    const handleCallSupervisor = () => {
        Linking.openURL(`tel:+91${supervisor.phone}`).catch(() => {
            Alert.alert('Call Failed', `Could not initiate call to +91 ${supervisor.phone}`);
        });
    };

    const handleOpenIssueModal = (cat) => {
        setSelectedCategory(cat);
        setIsIssueModalOpen(true);
    };

    const handleSubmitTicket = () => {
        if (!issueDescription.trim()) {
            Alert.alert('Missing Detail', 'Please provide a brief description of what occurred on site.');
            return;
        }

        const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket = {
            id: newId,
            date: 'Today',
            category: selectedCategory,
            status: 'In Review',
            resolution: 'Assigned to Area Supervisor. Response within 30 minutes.'
        };

        setActiveTickets(prev => [newTicket, ...prev]);
        setIsIssueModalOpen(false);
        setIssueDescription('');

        Alert.alert(
            '✅ Ticket Created',
            `Ticket #${newId} has been lodged. Our Thalassery operations desk will review the logs and contact you shortly.`
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Partner Support & SOS</Text>
                    <Text style={styles.headerSub}>Dedicated Field & Safety Helpline</Text>
                </View>
                <View style={styles.helplineBadge}>
                    <LifeBuoy size={14} color={COLORS.accent} />
                    <Text style={styles.helplineBadgeText}>24/7 HELPLINE</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Emergency SOS Banner */}
                <View style={styles.sosCard}>
                    <View style={styles.sosHeader}>
                        <ShieldAlert size={26} color="#fff" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.sosTitle}>ELECTRICAL FIELD SOS</Text>
                            <Text style={styles.sosSub}>High-voltage danger, arcing, or severe site conflict</Text>
                        </View>
                    </View>
                    <Text style={styles.sosText}>
                        If you encounter uninsulated live mains, neutral burnouts, fire hazards, or violent customer hostility, tap below for instant dispatch intervention.
                    </Text>

                    <View style={styles.sosActionsRow}>
                        <TouchableOpacity
                            style={styles.sosEmergencyBtn}
                            onPress={handleTriggerSOS}
                        >
                            <AlertTriangle size={18} color="#fff" />
                            <Text style={styles.sosEmergencyBtnText}>TRIGGER FIELD SOS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sosKsebBtn}
                            onPress={() => Linking.openURL('tel:1912')}
                        >
                            <PhoneCall size={16} color="#fff" />
                            <Text style={styles.sosKsebBtnText}>KSEB 1912</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Assigned Taluk Supervisor Card */}
                <Text style={styles.sectionHeader}>ASSIGNED TALUK SUPERVISOR</Text>
                <View style={styles.supervisorCard}>
                    <View style={styles.supervisorTop}>
                        <View style={styles.supervisorAvatar}>
                            <Headphones size={24} color={COLORS.accent} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.supervisorName}>{supervisor.name}</Text>
                            <Text style={styles.supervisorRole}>Thalassery & Kannur Field Supervisor</Text>
                            <Text style={styles.supervisorPhone}>Direct Mobile: +91 {supervisor.phone}</Text>
                        </View>
                        <View style={styles.activeDot} />
                    </View>

                    <View style={styles.supervisorDivider} />

                    <View style={styles.supervisorActions}>
                        <TouchableOpacity
                            style={styles.waBtn}
                            onPress={handleWhatsAppSupervisor}
                        >
                            <MessageCircle size={16} color="#25D366" />
                            <Text style={styles.waBtnText}>WhatsApp Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.callBtn}
                            onPress={handleCallSupervisor}
                        >
                            <PhoneCall size={16} color={COLORS.accent} />
                            <Text style={styles.callBtnText}>Call Supervisor</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Common Issue Reports (Quick Actions) */}
                <Text style={styles.sectionHeader}>COMMON FIELD DISPUTES</Text>
                <View style={styles.issueGrid}>
                    {[
                        {
                            title: 'Customer Absent / Door Locked',
                            desc: 'Waited 10 mins without response. Request ₹150 travel credit.',
                        },
                        {
                            title: 'Wrong Address / Inaccessible Location',
                            desc: 'Location pin inaccurate by > 3 km or unpaved road block.',
                        },
                        {
                            title: 'Demanding Unreasonable Extra Work',
                            desc: 'Customer insists on unpaid wiring work outside booked scope.',
                        },
                        {
                            title: 'Payment / 90-10 Split Discrepancy',
                            desc: 'Query regarding itemized billing deduction or tip payout.',
                        }
                    ].map((issue, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.issueItem}
                            onPress={() => handleOpenIssueModal(issue.title)}
                            activeOpacity={0.75}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.issueItemTitle}>{issue.title}</Text>
                                <Text style={styles.issueItemDesc}>{issue.desc}</Text>
                            </View>
                            <ChevronRight size={18} color={COLORS.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ₹5 Lakh Cover & Insurance Assistance */}
                <View style={styles.insuranceCard}>
                    <Shield size={24} color={COLORS.gold} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.insuranceTitle}>₹5 Lakh Active Trade Protection</Text>
                        <Text style={styles.insuranceDesc}>
                            Policy #SH-KL-9921 protects all verified KSELB partners against accidental property damage, electrocution risks, and third-party liabilities during active jobs.
                        </Text>
                        <TouchableOpacity
                            onPress={() => Alert.alert('Insurance Support', 'Toll-free insurance claims desk: 1800-425-SHER (Mon-Sun, 24 Hours)')}
                        >
                            <Text style={styles.insuranceLink}>View Policy Coverage Details →</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Past Tickets Section */}
                <Text style={styles.sectionHeader}>RECENT DISPUTE TICKETS</Text>
                <View style={styles.ticketsContainer}>
                    {activeTickets.map(tkt => (
                        <View key={tkt.id} style={styles.ticketCard}>
                            <View style={styles.ticketHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <FileText size={14} color={COLORS.accent} />
                                    <Text style={styles.ticketId}>{tkt.id}</Text>
                                </View>
                                <View style={[
                                    styles.ticketStatusBadge,
                                    tkt.status === 'Resolved' ? styles.statusResolved : styles.statusReview
                                ]}>
                                    <Text style={[
                                        styles.ticketStatusText,
                                        tkt.status === 'Resolved' ? { color: COLORS.success } : { color: COLORS.gold }
                                    ]}>
                                        {tkt.status}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.ticketCategory}>{tkt.category}</Text>
                            <Text style={styles.ticketResolution}>{tkt.resolution}</Text>
                            <Text style={styles.ticketDate}>Logged: {tkt.date}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Lodge Dispute Modal */}
            <Modal
                visible={isIssueModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsIssueModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>DISPUTE RESOLUTION</Text>
                                <Text style={styles.modalTitle}>Report Field Issue</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsIssueModalOpen(false)} style={styles.closeBtn}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.fieldLabel}>Dispute Category:</Text>
                            <View style={styles.catPill}>
                                <Text style={styles.catPillText}>{selectedCategory}</Text>
                            </View>

                            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Describe What Happened on Site:</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Explain customer behavior, uncooperative conditions, or exact dispute details..."
                                placeholderTextColor={COLORS.textTertiary}
                                multiline
                                numberOfLines={4}
                                value={issueDescription}
                                onChangeText={setIssueDescription}
                            />

                            <View style={styles.policyNotice}>
                                <Info size={14} color={COLORS.accent} />
                                <Text style={styles.policyNoticeText}>
                                    If the customer was absent, our system checks the OTP and your GPS arrival ping to automatically credit your travel allowance.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.submitTicketBtn}
                                onPress={handleSubmitTicket}
                            >
                                <Send size={16} color="#fff" />
                                <Text style={styles.submitTicketBtnText}>Submit to Thalassery Desk</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    helplineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.35)',
    },
    helplineBadgeText: {
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    sosCard: {
        backgroundColor: '#dc2626',
        borderRadius: 16,
        padding: SPACING.md,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#b91c1c',
    },
    sosHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sosTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    sosSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
    },
    sosText: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 18,
        marginBottom: 14,
    },
    sosActionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    sosEmergencyBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#7f1d1d',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    sosEmergencyBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    sosKsebBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sosKsebBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.textTertiary,
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 6,
        textTransform: 'uppercase',
    },
    supervisorCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    supervisorTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    supervisorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    supervisorName: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    supervisorRole: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
    supervisorPhone: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.accent,
        marginTop: 2,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
    },
    supervisorDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    supervisorActions: {
        flexDirection: 'row',
        gap: 10,
    },
    waBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(37, 211, 102, 0.12)',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(37, 211, 102, 0.3)',
    },
    waBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#25D366',
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.3)',
    },
    callBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.accent,
    },
    issueGrid: {
        gap: 10,
        marginBottom: 20,
    },
    issueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bgSecondary,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    issueItemTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 3,
    },
    issueItemDesc: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    insuranceCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 14,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(234, 179, 8, 0.25)',
        marginBottom: 20,
    },
    insuranceTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.gold,
    },
    insuranceDesc: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 4,
        lineHeight: 16,
    },
    insuranceLink: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.gold,
        marginTop: 8,
    },
    ticketsContainer: {
        gap: 10,
    },
    ticketCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    ticketId: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    ticketStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    statusResolved: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    statusReview: {
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
    },
    ticketStatusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    ticketCategory: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    ticketResolution: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    ticketDate: {
        fontSize: 10,
        color: COLORS.textTertiary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 12,
    },
    modalBadge: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.accent,
        letterSpacing: 0.5,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
    },
    modalBody: {
        marginTop: 14,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    catPill: {
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.3)',
    },
    catPillText: {
        color: COLORS.accent,
        fontSize: 13,
        fontWeight: '700',
    },
    textArea: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        color: COLORS.textPrimary,
        fontSize: 13,
        textAlignVertical: 'top',
        height: 90,
    },
    policyNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.bgTertiary,
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    policyNoticeText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        flex: 1,
        lineHeight: 16,
    },
    modalFooter: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 12,
    },
    submitTicketBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 14,
        borderRadius: 10,
    },
    submitTicketBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    }
});
