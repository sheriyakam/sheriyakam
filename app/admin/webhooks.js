import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Webhook, ShieldCheck, AlertTriangle, CheckCircle2, Lock, RefreshCw, Send, DollarSign, Activity } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { handleWebhookEvent } from '../../services/paymentWebhookHandler';

const SAMPLE_WEBHOOKS = [
    {
        id: 'evt_pay_captured',
        event: 'payment.captured',
        label: 'Payment Captured (₹730.00)',
        payload: {
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        id: 'pay_L29d819Ks74',
                        amount: 73000,
                        currency: 'INR',
                        status: 'captured',
                        notes: { booking_id: 'BK-9981273' },
                    }
                }
            }
        }
    },
    {
        id: 'evt_xfer_processed',
        event: 'transfer.processed',
        label: 'Split Transfer Settled (₹540.00 to Technician)',
        payload: {
            event: 'transfer.processed',
            payload: {
                transfer: {
                    id: 'trf_99482109',
                    account: 'acc_TechRajesh_7731',
                    amount: 54000,
                    currency: 'INR',
                }
            }
        }
    },
    {
        id: 'evt_dispute_created',
        event: 'dispute.created',
        label: 'Dispute Created (Locks Escrow & Holds Tech)',
        payload: {
            event: 'dispute.created',
            payload: {
                dispute: {
                    id: 'dsp_8819284',
                    payment_id: 'pay_L29d819Ks74',
                    reason: 'Property Damage Allegation',
                }
            }
        }
    },
];

export default function WebhooksConsoleScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [selectedEvent, setSelectedEvent] = useState(SAMPLE_WEBHOOKS[0]);
    const [eventLog, setEventLog] = useState([]);
    const [techStatus, setTechStatus] = useState('ACTIVE');
    const [escrowStatus, setEscrowStatus] = useState('NORMAL');

    const handleFireWebhook = () => {
        const result = handleWebhookEvent(selectedEvent.payload);
        const logEntry = {
            id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
            timestamp: new Date().toLocaleTimeString(),
            event: selectedEvent.event,
            action: result.action,
            status: result.status,
        };

        if (result.action === 'FREEZE_ESCROW_AND_TECH_STATUS') {
            setTechStatus('ON_HOLD');
            setEscrowStatus('FROZEN');
            showError('Technician profile placed ON HOLD and gateway escrow FROZEN!', 'Dispute Lockdown');
        } else if (result.action === 'CREDIT_TECHNICIAN_WALLET') {
            success('Technician wallet credited with ₹' + result.amountRupees, 'Transfer Settled');
        } else {
            success(`Webhook ${selectedEvent.event} processed with 200 OK`, 'Webhook Handled');
        }

        setEventLog((prev) => [logEntry, ...prev.slice(0, 9)]);
    };

    const handleResetStatus = () => {
        setTechStatus('ACTIVE');
        setEscrowStatus('NORMAL');
        success('Technician profile and escrow status restored to ACTIVE', 'Status Restored');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Payment Gateway Webhook Engine
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <Card variant="elevated" style={styles.heroCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge variant="purple" size="md">HMAC-SHA256 Signature Verified</Badge>
                        <Text style={[styles.endpointText, { color: colors.accent }]}>POST /api/webhooks/razorpay</Text>
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Real-Time Payment & Split Event Engine
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Listens for Razorpay/Cashfree webhook notifications, executes automated ledger credits, and triggers automated escrow freeze actions during customer disputes.
                    </Text>
                </Card>

                {/* Live System Status */}
                <View style={styles.statusRow}>
                    <Card variant="default" style={[styles.statusCard, { borderColor: techStatus === 'ON_HOLD' ? '#EF4444' : '#10B981', borderWidth: 1 }]}>
                        <Text style={[styles.statusLabel, { color: colors.textTertiary }]}>TECHNICIAN STATUS</Text>
                        <Text style={[styles.statusVal, { color: techStatus === 'ON_HOLD' ? '#EF4444' : '#10B981' }]}>
                            {techStatus}
                        </Text>
                    </Card>

                    <Card variant="default" style={[styles.statusCard, { borderColor: escrowStatus === 'FROZEN' ? '#EF4444' : '#3B82F6', borderWidth: 1 }]}>
                        <Text style={[styles.statusLabel, { color: colors.textTertiary }]}>ESCROW GATEWAY</Text>
                        <Text style={[styles.statusVal, { color: escrowStatus === 'FROZEN' ? '#EF4444' : '#3B82F6' }]}>
                            {escrowStatus}
                        </Text>
                    </Card>
                </View>

                {techStatus === 'ON_HOLD' && (
                    <Button
                        variant="outline"
                        size="sm"
                        iconLeft={RefreshCw}
                        onPress={handleResetStatus}
                    >
                        Restore Technician to Active Status
                    </Button>
                )}

                {/* Event Simulator */}
                <Card variant="default" style={styles.simulatorCard}>
                    <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>
                        TEST WEBHOOK EVENT SIMULATOR
                    </Text>

                    <View style={styles.eventsGrid}>
                        {SAMPLE_WEBHOOKS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.eventBtn,
                                    {
                                        backgroundColor: selectedEvent.id === item.id ? colors.accent + '20' : (isDark ? '#18181B' : '#F4F4F5'),
                                        borderColor: selectedEvent.id === item.id ? colors.accent : 'transparent',
                                    }
                                ]}
                                onPress={() => setSelectedEvent(item)}
                            >
                                <Text style={[styles.eventBtnText, { color: selectedEvent.id === item.id ? colors.accent : colors.textPrimary }]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        iconLeft={Send}
                        onPress={handleFireWebhook}
                        style={{ marginTop: 8 }}
                    >
                        Simulate Incoming Webhook Payload
                    </Button>
                </Card>

                {/* Live Activity Log */}
                <Card variant="default" style={styles.logCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Activity size={16} color={colors.accent} />
                        <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>
                            WEBHOOK PROCESSING LOGS
                        </Text>
                    </View>

                    {eventLog.length === 0 ? (
                        <Text style={[styles.emptyLogText, { color: colors.textTertiary }]}>
                            No webhooks fired in this session yet. Click the button above to simulate.
                        </Text>
                    ) : (
                        eventLog.map((log) => (
                            <View key={log.id} style={[styles.logItem, { borderBottomColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.logEvent, { color: colors.textPrimary }]}>{log.event}</Text>
                                    <Text style={[styles.logAction, { color: colors.accent }]}>Action: {log.action}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Badge variant={log.status === 'SUCCESS' ? 'success' : (log.status === 'DISPUTE_LOCKED' ? 'danger' : 'neutral')} size="sm">
                                        {log.status}
                                    </Badge>
                                    <Text style={[styles.logTime, { color: colors.textTertiary }]}>{log.timestamp}</Text>
                                </View>
                            </View>
                        ))
                    )}
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
        gap: 14,
    },
    heroCard: {
        padding: 16,
        gap: 8,
    },
    endpointText: {
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    heroSubtitle: {
        fontSize: 12.5,
        lineHeight: 17,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 10,
    },
    statusCard: {
        flex: 1,
        padding: 14,
        alignItems: 'center',
        gap: 2,
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    statusVal: {
        fontSize: 18,
        fontWeight: '900',
    },
    simulatorCard: {
        padding: 16,
        gap: 10,
    },
    cardHeading: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    eventsGrid: {
        gap: 8,
    },
    eventBtn: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    eventBtnText: {
        fontSize: 12.5,
        fontWeight: '700',
    },
    logCard: {
        padding: 16,
        gap: 10,
    },
    emptyLogText: {
        fontSize: 12,
        fontStyle: 'italic',
        paddingVertical: 8,
        textAlign: 'center',
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    logEvent: {
        fontSize: 12.5,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    logAction: {
        fontSize: 11,
        marginTop: 2,
    },
    logTime: {
        fontSize: 10,
        marginTop: 2,
    },
});
