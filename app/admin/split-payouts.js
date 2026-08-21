import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Split, Lock, Unlock, DollarSign, Copy, CheckCircle2, ShieldCheck, Code2, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from 'react-native';
import { calculateSplitBreakdown, buildSplitOrderPayload } from '../../utils/paymentSplit';

export default function SplitPayoutsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [labor, setLabor] = useState('350');
    const [platformFee, setPlatformFee] = useState('29');
    const [materials, setMaterials] = useState('240');
    const [travel, setTravel] = useState('0');
    const [isHighRisk, setIsHighRisk] = useState(false);
    const [isEscrowReleased, setIsEscrowReleased] = useState(false);

    const breakdown = calculateSplitBreakdown({
        laborCharge: parseFloat(labor) || 0,
        platformFee: parseFloat(platformFee) || 0,
        materialsCharge: parseFloat(materials) || 0,
        travelAllowance: parseFloat(travel) || 0,
    });

    const payload = buildSplitOrderPayload({
        orderId: 'order_VF_2026_89102',
        technicianAccountId: 'acc_TechRajesh_7731',
        corporateAccountId: 'acc_VoltFix_Corporate_Main',
        isHighRiskJob: isHighRisk && !isEscrowReleased,
        breakdown,
    });

    const payloadJson = JSON.stringify(payload, null, 2);

    const handleCopyJson = () => {
        if (Platform.OS === 'web' && navigator?.clipboard) {
            navigator.clipboard.writeText(payloadJson);
        }
        success('Razorpay Route payload copied to clipboard!', 'Payload Copied');
    };

    const handleReleaseEscrow = () => {
        setIsEscrowReleased(true);
        success('Escrow released! ₹' + breakdown.technicianShareRupees + ' transferred to technician.', 'Escrow Settled');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Split-Payout API & Escrow Engine
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <Card variant="elevated" style={styles.heroCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge variant="purple" size="md">Razorpay Route & Cashfree API</Badge>
                        <Text style={[styles.paiseBadge, { color: colors.accent }]}>Amounts in Paise (₹1 = 100p)</Text>
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Automated Marketplace Fund Distribution
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Splits incoming customer payments instantly at checkout into technician labor/materials and corporate platform commission + GST, with optional escrow hold protection.
                    </Text>
                </Card>

                {/* Calculator Inputs */}
                <Card variant="default" style={styles.calcCard}>
                    <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>
                        TRANSACTION PARAMETERS (INR)
                    </Text>
                    <View style={styles.inputGrid}>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Labor (SAC 9987)"
                                value={labor}
                                onChangeText={setLabor}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Platform Fee"
                                value={platformFee}
                                onChangeText={setPlatformFee}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                    <View style={styles.inputGrid}>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Materials (HSN 8536)"
                                value={materials}
                                onChangeText={setMaterials}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Travel Compensation"
                                value={travel}
                                onChangeText={setTravel}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    {/* High Risk Escrow Toggle */}
                    <View style={[styles.toggleRow, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1, gap: 2 }}>
                            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
                                High-Value Escrow Hold (`on_hold: true`)
                            </Text>
                            <Text style={[styles.toggleDesc, { color: colors.textTertiary }]}>
                                Locks technician share until customer submits 4-digit completion OTP.
                            </Text>
                        </View>
                        <Switch
                            value={isHighRisk}
                            onValueChange={(val) => {
                                setIsHighRisk(val);
                                setIsEscrowReleased(false);
                            }}
                            trackColor={{ false: '#3F3F46', true: colors.accent }}
                        />
                    </View>
                </Card>

                {/* Split Distribution Breakdown */}
                <View style={styles.splitDistributionGrid}>
                    <Card variant="default" style={[styles.shareCard, { borderColor: '#10B981', borderWidth: 1 }]}>
                        <Text style={[styles.shareLabel, { color: colors.textTertiary }]}>TECHNICIAN PAYOUT (85% + SPARES)</Text>
                        <Text style={[styles.shareAmount, { color: '#10B981' }]}>₹{breakdown.technicianShareRupees}</Text>
                        <Text style={[styles.sharePaise, { color: colors.textSecondary }]}>
                            {breakdown.technicianSharePaise} Paise
                        </Text>
                        <Badge variant={isHighRisk && !isEscrowReleased ? "warning" : "success"} size="sm" style={{ marginTop: 4 }}>
                            {isHighRisk && !isEscrowReleased ? "LOCKED IN ESCROW" : "INSTANT SETTLEMENT"}
                        </Badge>
                    </Card>

                    <Card variant="default" style={[styles.shareCard, { borderColor: '#3B82F6', borderWidth: 1 }]}>
                        <Text style={[styles.shareLabel, { color: colors.textTertiary }]}>PLATFORM REVENUE + 18% GST</Text>
                        <Text style={[styles.shareAmount, { color: '#3B82F6' }]}>₹{breakdown.platformShareRupees}</Text>
                        <Text style={[styles.sharePaise, { color: colors.textSecondary }]}>
                            {breakdown.platformSharePaise} Paise
                        </Text>
                        <Badge variant="info" size="sm" style={{ marginTop: 4 }}>
                            GST SAC 9987: ₹{breakdown.totalTax}
                        </Badge>
                    </Card>
                </View>

                {/* Escrow Release Button */}
                {isHighRisk && !isEscrowReleased && (
                    <Button
                        variant="primary"
                        size="md"
                        iconLeft={Unlock}
                        onPress={handleReleaseEscrow}
                        style={{ marginVertical: 4 }}
                    >
                        Simulate Customer OTP Escrow Release
                    </Button>
                )}

                {/* JSON Payload Viewer */}
                <Card variant="default" style={styles.jsonCard}>
                    <View style={styles.jsonHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Code2 size={16} color={colors.accent} />
                            <Text style={[styles.jsonTitle, { color: colors.textPrimary }]}>
                                POST /v1/orders (Live Payload)
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleCopyJson} style={styles.copyBtn} accessibilityRole="button" accessibilityLabel="Copy Payload">
                            <Copy size={15} color={colors.accent} />
                            <Text style={[styles.copyBtnText, { color: colors.accent }]}>Copy</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={[styles.jsonCode, { color: isDark ? '#A1A1AA' : '#334155' }]}>
                            {payloadJson}
                        </Text>
                    </ScrollView>
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
    paiseBadge: {
        fontSize: 11,
        fontWeight: '700',
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
    calcCard: {
        padding: 16,
        gap: 10,
    },
    cardHeading: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    inputGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 10,
        marginTop: 4,
    },
    toggleTitle: {
        fontSize: 12.5,
        fontWeight: '700',
    },
    toggleDesc: {
        fontSize: 11,
    },
    splitDistributionGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    shareCard: {
        flex: 1,
        padding: 14,
        gap: 4,
        alignItems: 'center',
    },
    shareLabel: {
        fontSize: 9.5,
        fontWeight: '800',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    shareAmount: {
        fontSize: 22,
        fontWeight: '900',
    },
    sharePaise: {
        fontSize: 11,
        fontFamily: 'monospace',
    },
    jsonCard: {
        padding: 14,
        gap: 8,
    },
    jsonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    jsonTitle: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    copyBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    jsonCode: {
        fontFamily: 'monospace',
        fontSize: 11.5,
        lineHeight: 16,
        paddingVertical: 6,
    },
});
