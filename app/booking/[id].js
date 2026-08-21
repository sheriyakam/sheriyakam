import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, MessageSquare, MapPin, Calendar, Clock, Download, AlertTriangle, ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ActionSheet } from '../../components/ui/ActionSheet';

const STATUS_STEPS = [
    { key: 'received', title: 'Booking Received', desc: 'Auto-assigned to Kozhikode zone' },
    { key: 'assigned', title: 'Technician Assigned', desc: 'Sanoop K. accepted the task' },
    { key: 'transit', title: 'In Transit', desc: 'Electrician on the way • ETA 15 mins' },
    { key: 'working', title: 'Diagnostic & Repair', desc: 'Work in progress' },
    { key: 'completed', title: 'Completed & Verified', desc: '30-day warranty started' },
];

export default function SingleBookingTrackingScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, warning } = useToast();
    const isDark = theme === 'dark';

    const [currentStatusIndex, setCurrentStatusIndex] = useState(2); // 'In Transit'
    const [showActionSheet, setShowActionSheet] = useState(false);

    const bookingId = id || 'SHK-829104';

    const handleCallContractor = () => {
        Linking.openURL('tel:+919876543210').catch(() => {
            success('Connecting phone call to Sanoop (+91 98765 43210)...');
        });
    };

    const handleDownloadInvoice = () => {
        success(`Digital Tax Invoice #${bookingId}.pdf downloaded!`, 'Receipt Saved');
    };

    const handleCancelBooking = () => {
        warning('Booking cancellation requested. Zero penalty if canceled 2 hours prior.', 'Cancellation');
    };

    const handleReschedule = () => {
        success('Reschedule calendar opened. Please pick a new slot.', 'Reschedule');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Booking #{bookingId}
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Ceiling & Exhaust Fan Repair
                    </Text>
                </View>
                <TouchableOpacity onPress={() => setShowActionSheet(true)} style={styles.actionBtn}>
                    <Text style={[styles.actionBtnText, { color: colors.accent }]}>Manage</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Live Status Progress Stepper */}
                <Card variant="elevated" style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <Text style={[styles.statusCardTitle, { color: colors.textPrimary }]}>
                            Live Dispatch Status
                        </Text>
                        <Badge variant="info" dot>In Transit</Badge>
                    </View>

                    <View style={styles.timeline}>
                        {STATUS_STEPS.map((step, idx) => {
                            const isPast = idx < currentStatusIndex;
                            const isCurrent = idx === currentStatusIndex;
                            return (
                                <View key={step.key} style={styles.timelineRow}>
                                    <View style={styles.bulletCol}>
                                        <View style={[
                                            styles.bullet,
                                            {
                                                backgroundColor: isPast || isCurrent ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                                borderColor: isCurrent ? colors.accent : 'transparent',
                                                borderWidth: isCurrent ? 3 : 0,
                                            }
                                        ]}>
                                            {isPast ? (
                                                <CheckCircle2 size={12} color="#FFFFFF" />
                                            ) : null}
                                        </View>
                                        {idx < STATUS_STEPS.length - 1 ? (
                                            <View style={[
                                                styles.timelineLine,
                                                { backgroundColor: isPast ? colors.accent : isDark ? '#27272A' : '#E4E4E7' }
                                            ]} />
                                        ) : null}
                                    </View>

                                    <View style={styles.timelineTextWrap}>
                                        <Text style={[
                                            styles.stepTitle,
                                            {
                                                color: isPast || isCurrent ? colors.textPrimary : colors.textTertiary,
                                                fontWeight: isCurrent ? '800' : '600',
                                            }
                                        ]}>
                                            {step.title}
                                        </Text>
                                        <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                            {step.desc}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* Assigned Contractor Card */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    ASSIGNED TECHNICIAN
                </Text>
                <Card variant="default" style={styles.contractorCard}>
                    <View style={styles.contractorRow}>
                        <Avatar name="Sanoop K" status="online" size={48} />
                        <View style={styles.contractorDetails}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.contractorName, { color: colors.textPrimary }]}>
                                    Sanoop K.
                                </Text>
                                <Badge variant="success" size="sm">Govt Licensed</Badge>
                            </View>
                            <Text style={[styles.contractorLicense, { color: colors.textTertiary }]}>
                                Lic #: KL-EL-2021-9482 • 4.9★ (340+ jobs)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.contractorActions}>
                        <Button
                            variant="primary"
                            size="md"
                            iconLeft={MessageSquare}
                            onPress={() => router.push('/chat')}
                            style={{ flex: 1 }}
                        >
                            Chat with Sanoop
                        </Button>
                        <Button
                            variant="outline"
                            size="md"
                            iconLeft={Phone}
                            onPress={handleCallContractor}
                            style={{ flex: 1 }}
                        >
                            Call
                        </Button>
                    </View>
                </Card>

                {/* Address & Slot Card */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    SERVICE DETAILS
                </Text>
                <Card variant="default" style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <MapPin size={18} color={colors.accent} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.detailTitle, { color: colors.textPrimary }]}>Civil Station, Wayanad Road</Text>
                            <Text style={[styles.detailSub, { color: colors.textTertiary }]}>Kozhikode - 673020</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <View style={styles.detailRow}>
                        <Calendar size={18} color={colors.accent} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.detailTitle, { color: colors.textPrimary }]}>Today, 10:00 AM - 12:00 PM</Text>
                            <Text style={[styles.detailSub, { color: colors.textTertiary }]}>Standard 2-Hour Window</Text>
                        </View>
                    </View>
                </Card>

                {/* Invoice & Guarantee */}
                <Card variant="default" style={styles.invoiceCard}>
                    <View style={styles.invoiceRow}>
                        <View>
                            <Text style={[styles.invoiceTitle, { color: colors.textPrimary }]}>
                                Payment: ₹294 Paid (SAC 9987)
                            </Text>
                            <Text style={[styles.invoiceSub, { color: colors.textTertiary }]}>
                                GST Invoice #INV-2026-8291 • 100% Genuine ISI Spares
                            </Text>
                        </View>

                        <Button
                            variant="secondary"
                            size="sm"
                            iconLeft={Download}
                            onPress={handleDownloadInvoice}
                        >
                            Invoice
                        </Button>
                    </View>
                </Card>

                {/* Fair Policy Quick Link */}
                <TouchableOpacity
                    onPress={() => router.push('/cancellation-policy')}
                    style={[styles.policyLinkCard, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                >
                    <ShieldCheck size={16} color="#10B981" />
                    <Text style={[styles.policyLinkText, { color: colors.textSecondary }]}>
                        View Doorstep Cancellation & Refund Matrix
                    </Text>
                    <ChevronRight size={16} color={colors.textTertiary} />
                </TouchableOpacity>
            </ScrollView>

            {/* Manage Booking ActionSheet */}
            <ActionSheet
                visible={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                title="Manage Booking"
                subtitle={`Booking #${bookingId}`}
                actions={[
                    {
                        label: 'Reschedule Appointment',
                        icon: Calendar,
                        onPress: handleReschedule,
                    },
                    {
                        label: 'Download Digital Invoice',
                        icon: Download,
                        onPress: handleDownloadInvoice,
                    },
                    {
                        label: 'Cancellation & Refund Rules',
                        icon: ShieldCheck,
                        onPress: () => router.push('/cancellation-policy'),
                    },
                    {
                        label: 'Cancel Booking',
                        icon: AlertTriangle,
                        isDestructive: true,
                        onPress: handleCancelBooking,
                    },
                ]}
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
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: 12,
    },
    actionBtn: {
        padding: 6,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    statusCard: {
        padding: 16,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusCardTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    timeline: {
        gap: 4,
    },
    timelineRow: {
        flexDirection: 'row',
    },
    bulletCol: {
        alignItems: 'center',
        width: 24,
        marginRight: 12,
    },
    bullet: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        minHeight: 28,
    },
    timelineTextWrap: {
        flex: 1,
        paddingBottom: 14,
    },
    stepTitle: {
        fontSize: 13,
    },
    stepDesc: {
        fontSize: 11,
        marginTop: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    contractorCard: {
        padding: 16,
        gap: 14,
    },
    contractorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contractorDetails: {
        flex: 1,
    },
    contractorName: {
        fontSize: 15,
        fontWeight: '700',
    },
    contractorLicense: {
        fontSize: 11,
        marginTop: 2,
    },
    contractorActions: {
        flexDirection: 'row',
        gap: 10,
    },
    detailsCard: {
        padding: 16,
        gap: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailTitle: {
        fontSize: 13,
        fontWeight: '600',
    },
    detailSub: {
        fontSize: 11,
        marginTop: 1,
    },
    divider: {
        height: 1,
    },
    invoiceCard: {
        padding: 16,
        marginTop: 12,
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    invoiceSub: {
        fontSize: 12,
        marginTop: 2,
    },
    policyLinkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 12,
    },
    policyLinkText: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: '600',
        marginLeft: 8,
    },
});
