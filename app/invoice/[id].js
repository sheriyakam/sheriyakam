import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, Share2, Printer, CheckCircle2, ShieldCheck, QrCode, FileText, Award, Scale, HelpCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function DigitalInvoiceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const invoiceId = params.id || 'VF-2026-89102';
    const bookingId = params.bookingId || 'BK-9981273';

    // 1. Service & Labor (SAC: 998732)
    const baseLabor = 350.00;
    const platformFee = 29.00;
    const subtotalA = baseLabor + platformFee; // 379.00
    const cgstA = Number((subtotalA * 0.09).toFixed(2)); // 34.11
    const sgstA = Number((subtotalA * 0.09).toFixed(2)); // 34.11

    // 2. Materials & Spares (HSN: 8536)
    const materials = [
        {
            name: 'Havells 32A Single Pole MCB (IS/IEC 60898-1)',
            qty: 1,
            rate: 220.00,
            origin: 'India',
            manufacturer: 'Havells India Ltd.',
        },
        {
            name: 'Anchor Insulated Electrical Tape (IS 7809)',
            qty: 1,
            rate: 20.00,
            origin: 'India',
            manufacturer: 'Panasonic Life Solutions India Pvt Ltd.',
        },
    ];
    const subtotalB = materials.reduce((acc, m) => acc + (m.rate * m.qty), 0); // 240.00
    const cgstB = Number((subtotalB * 0.09).toFixed(2)); // 21.60
    const sgstB = Number((subtotalB * 0.09).toFixed(2)); // 21.60

    // 3. Totals
    const totalTax = Number((cgstA + sgstA + cgstB + sgstB).toFixed(2)); // 111.42
    const grandTotal = Math.round(subtotalA + subtotalB + totalTax); // 730.00

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Sheriyakam Tax Invoice ${invoiceId} - Grand Total: ₹${grandTotal}. Download at https://sheriyakam.com/invoice/${invoiceId}`,
                title: `Tax Invoice ${invoiceId}`,
            });
        } catch (e) {}
    };

    const handleDownloadPdf = () => {
        success(`Tax Invoice ${invoiceId}.pdf downloaded successfully!`, 'Invoice Saved');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Tax Invoice & Digital Receipt
                </Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Share invoice">
                        <Share2 size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDownloadPdf} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Download invoice PDF">
                        <Download size={18} color={colors.accent} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Official Tax Invoice Container */}
                <Card variant="elevated" style={styles.invoicePaper}>
                    {/* Brand Header */}
                    <View style={styles.paperHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.brandTitle}>SHERIYAKAM</Text>
                            <Text style={[styles.companyLegal, { color: colors.textSecondary }]}>
                                Sheriyakam Technologies Private Limited
                            </Text>
                            <Text style={[styles.companyAddr, { color: colors.textTertiary }]}>
                                Regd. Office: 3rd Floor, Malabar Trade Centre, Civil Station Road, Kozhikode, Kerala - 673020
                            </Text>
                            <Text style={[styles.gstinText, { color: colors.textPrimary }]}>
                                CIN: <Text style={{ fontWeight: '700' }}>U72900KL2026PTC123456</Text> | GSTIN: <Text style={{ fontWeight: '800' }}>32AABCS8492K1Z8</Text> (Kerala: 32)
                            </Text>
                        </View>
                        <Badge variant="gold" size="sm">TAX INVOICE</Badge>
                    </View>

                    <View style={[styles.paperDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    {/* Metadata Grid */}
                    <View style={styles.metaGrid}>
                        <View style={styles.metaCol}>
                            <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>INVOICE NUMBER:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{invoiceId}</Text>

                            <Text style={[styles.metaLabel, { color: colors.textTertiary, marginTop: 8 }]}>DATE & TIME:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>
                                22-August-2026 • 11:30 AM IST
                            </Text>
                        </View>

                        <View style={styles.metaCol}>
                            <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>BOOKING ID:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{bookingId}</Text>

                            <Text style={[styles.metaLabel, { color: colors.textTertiary, marginTop: 8 }]}>PLACE OF SUPPLY:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>Kozhikode, Kerala (32)</Text>
                        </View>
                    </View>

                    {/* Customer Details */}
                    <View style={[styles.partyBox, { backgroundColor: isDark ? '#27272A50' : '#F4F4F5' }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.partyLabel, { color: colors.textTertiary }]}>CUSTOMER DETAILS (BILLED TO):</Text>
                            <Text style={[styles.partyName, { color: colors.textPrimary }]}>Rahul Menon</Text>
                            <Text style={[styles.partyAddr, { color: colors.textSecondary }]}>
                                Flat 4B, Emerald Residency, Civil Station, Kozhikode, Kerala - 673020
                            </Text>
                        </View>
                    </View>

                    {/* 1. Service & Labor Breakdown (SAC 998732) */}
                    <View style={styles.sectionBlock}>
                        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                            1. SERVICE & LABOR BREAKDOWN (SAC: 998732 - Electrical Installation)
                        </Text>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.lineItemDesc, { color: colors.textSecondary }]}>
                                Distribution Board (DB) Box Repair & MCB Replacement
                            </Text>
                            <Text style={[styles.lineItemAmt, { color: colors.textPrimary }]}>₹{baseLabor.toFixed(2)}</Text>
                        </View>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.lineItemDesc, { color: colors.textSecondary }]}>
                                Platform Convenience & Dispatch Safety Fee
                            </Text>
                            <Text style={[styles.lineItemAmt, { color: colors.textPrimary }]}>₹{platformFee.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.subtotalRow, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Text style={[styles.subtotalLabel, { color: colors.textPrimary }]}>SUBTOTAL (A):</Text>
                            <Text style={[styles.subtotalVal, { color: colors.textPrimary }]}>₹{subtotalA.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* 2. Material & Spare Parts Breakdown (HSN 8536) */}
                    <View style={styles.sectionBlock}>
                        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                            2. MATERIAL & SPARE PARTS BREAKDOWN (HSN: 8536 - Electrical Switches/MCB)
                        </Text>
                        {materials.map((m, idx) => (
                            <View key={idx} style={styles.materialItemWrap}>
                                <View style={styles.lineItemRow}>
                                    <Text style={[styles.lineItemDesc, { color: colors.textPrimary, fontWeight: '600' }]}>
                                        {m.name} (Qty: {m.qty})
                                    </Text>
                                    <Text style={[styles.lineItemAmt, { color: colors.textPrimary }]}>₹{m.rate.toFixed(2)}</Text>
                                </View>
                                <View style={styles.tagWrap}>
                                    <Text style={[styles.tagText, { color: colors.textTertiary }]}>
                                        • Country of Origin: <Text style={{ color: '#10B981', fontWeight: '700' }}>{m.origin}</Text>
                                    </Text>
                                    <Text style={[styles.tagText, { color: colors.textTertiary }]}>
                                        • Manufacturer: {m.manufacturer}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <View style={[styles.subtotalRow, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Text style={[styles.subtotalLabel, { color: colors.textPrimary }]}>SUBTOTAL (B):</Text>
                            <Text style={[styles.subtotalVal, { color: colors.textPrimary }]}>₹{subtotalB.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* 3. Tax & Duty Breakdown */}
                    <View style={styles.sectionBlock}>
                        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                            3. TAX & DUTY BREAKDOWN (18% GST: 9% CGST + 9% KERALA SGST)
                        </Text>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.taxLabel, { color: colors.textSecondary }]}>CGST on Service (A) @ 9%:</Text>
                            <Text style={[styles.taxVal, { color: colors.textPrimary }]}>₹{cgstA.toFixed(2)}</Text>
                        </View>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.taxLabel, { color: colors.textSecondary }]}>SGST on Service (A) @ 9%:</Text>
                            <Text style={[styles.taxVal, { color: colors.textPrimary }]}>₹{sgstA.toFixed(2)}</Text>
                        </View>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.taxLabel, { color: colors.textSecondary }]}>CGST on Materials (B) @ 9%:</Text>
                            <Text style={[styles.taxVal, { color: colors.textPrimary }]}>₹{cgstB.toFixed(2)}</Text>
                        </View>
                        <View style={styles.lineItemRow}>
                            <Text style={[styles.taxLabel, { color: colors.textSecondary }]}>SGST on Materials (B) @ 9%:</Text>
                            <Text style={[styles.taxVal, { color: colors.textPrimary }]}>₹{sgstB.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.subtotalRow, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Text style={[styles.subtotalLabel, { color: colors.textPrimary }]}>TOTAL TAXATION (C):</Text>
                            <Text style={[styles.subtotalVal, { color: colors.textPrimary }]}>₹{totalTax.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Grand Total */}
                    <View style={[styles.grandTotalBox, { backgroundColor: isDark ? '#18181B' : '#EFF6FF' }]}>
                        <View style={styles.grandTotalRow}>
                            <Text style={[styles.grandTotalLabel, { color: colors.textPrimary }]}>GRAND TOTAL (Rounded):</Text>
                            <Text style={[styles.grandTotalVal, { color: colors.accent }]}>₹{grandTotal.toFixed(2)}</Text>
                        </View>
                        <Text style={[styles.amountWords, { color: colors.textSecondary }]}>
                            Amount in Words: Seven Hundred and Thirty Rupees Only.
                        </Text>
                        <Badge variant="success" size="sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                            PAID VIA UPI • TRANSACTION ID: TXN-829148
                        </Badge>
                    </View>

                    {/* Provider Details */}
                    <View style={[styles.providerBox, { backgroundColor: isDark ? '#27272A50' : '#F4F4F5' }]}>
                        <Text style={[styles.providerHeading, { color: colors.textPrimary }]}>PROVIDER DETAILS</Text>
                        <Text style={[styles.providerText, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Assigned Technician</Text>: Rajesh Kumar / Sanoop K. (ID: TECH-7731)
                        </Text>
                        <Text style={[styles.providerText, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Electrical Wireman License No</Text>: LIC/EL/2021/99482 (KSELB Verified)
                        </Text>
                        <Text style={[styles.providerText, { color: colors.textSecondary }]}>
                            • <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Background Verification Status</Text>: <Text style={{ color: '#10B981', fontWeight: '800' }}>PASSED</Text> (Aadhaar e-KYC & Police PVC)
                        </Text>
                    </View>

                    {/* Grievance Redressal & Support */}
                    <View style={[styles.grievanceBox, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <Scale size={16} color={colors.accent} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.grievanceTitle, { color: colors.textPrimary }]}>
                                GRIEVANCE REDRESSAL & SUPPORT (48-HR SLA)
                            </Text>
                            <Text style={[styles.grievanceText, { color: colors.textSecondary }]}>
                                For complaints, contact our Grievance Officer at <Text style={{ color: colors.accent, fontWeight: '700' }}>grievance@sheriyakam.com</Text> or call +91 495 280 0001. Acknowledged within 48 hours under Indian E-Commerce Rules.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Actions */}
                <View style={styles.actionButtons}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        iconLeft={Download}
                        onPress={handleDownloadPdf}
                    >
                        Download PDF Tax Receipt
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
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    invoicePaper: {
        padding: 18,
        borderRadius: 16,
        gap: 12,
    },
    paperHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    brandTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#3B82F6',
        letterSpacing: 1,
    },
    companyLegal: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 2,
    },
    companyAddr: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
    gstinText: {
        fontSize: 11,
        marginTop: 4,
    },
    paperDivider: {
        height: 1,
    },
    metaGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaCol: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    metaVal: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 2,
    },
    partyBox: {
        padding: 12,
        borderRadius: 10,
    },
    partyLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    partyName: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
    partyAddr: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
    sectionBlock: {
        gap: 6,
        marginTop: 4,
    },
    sectionHeading: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    lineItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lineItemDesc: {
        fontSize: 12.5,
        flex: 1,
    },
    lineItemAmt: {
        fontSize: 12.5,
        fontWeight: '700',
        marginLeft: 10,
    },
    materialItemWrap: {
        gap: 2,
        marginVertical: 2,
    },
    tagWrap: {
        paddingLeft: 8,
        gap: 2,
    },
    tagText: {
        fontSize: 11,
    },
    subtotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        paddingTop: 4,
        marginTop: 2,
    },
    subtotalLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    subtotalVal: {
        fontSize: 12,
        fontWeight: '700',
    },
    taxLabel: {
        fontSize: 12,
    },
    taxVal: {
        fontSize: 12,
        fontWeight: '600',
    },
    grandTotalBox: {
        padding: 14,
        borderRadius: 12,
        gap: 4,
        marginTop: 6,
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    grandTotalLabel: {
        fontSize: 14,
        fontWeight: '900',
    },
    grandTotalVal: {
        fontSize: 18,
        fontWeight: '900',
    },
    amountWords: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    providerBox: {
        padding: 12,
        borderRadius: 10,
        gap: 4,
        marginTop: 4,
    },
    providerHeading: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    providerText: {
        fontSize: 11.5,
        lineHeight: 16,
    },
    grievanceBox: {
        flexDirection: 'row',
        gap: 10,
        borderTopWidth: 1,
        paddingTop: 10,
        marginTop: 6,
        alignItems: 'flex-start',
    },
    grievanceTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    grievanceText: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
    actionButtons: {
        marginTop: 16,
    },
});
