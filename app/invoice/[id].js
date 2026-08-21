import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, Share2, Printer, CheckCircle2, ShieldCheck, QrCode, FileText, Award, Scale } from 'lucide-react-native';
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

    const invoiceId = params.id || 'INV-2026-8291';
    const bookingId = params.bookingId || 'BK-9482';

    const lineItems = [
        {
            desc: 'Short Circuit Diagnostic & Breaker Trip Rectification',
            sac: 'SAC 9987',
            rate: 199.00,
            gstPct: 18,
            type: 'labor'
        },
        {
            desc: 'Havells 32A Single Pole MCB (IS/IEC 60898-1)',
            hsn: 'HSN 8536',
            origin: 'Made in India',
            rate: 185.00,
            gstPct: 18,
            type: 'material'
        },
        {
            desc: 'Finolex 2.5 sq mm FR Copper Wire (IS 694) - 5m',
            hsn: 'HSN 8544',
            origin: 'Made in India',
            rate: 120.00,
            gstPct: 18,
            type: 'material'
        },
        {
            desc: 'Platform Safety, CGL Insurance & Emergency Dispatch Fee',
            sac: 'SAC 9987',
            rate: 25.00,
            gstPct: 18,
            type: 'fee'
        }
    ];

    const subtotal = lineItems.reduce((acc, item) => acc + item.rate, 0);
    const cgstAmount = Number(((subtotal * 0.09)).toFixed(2));
    const sgstAmount = Number(((subtotal * 0.09)).toFixed(2));
    const totalAmount = Number((subtotal + cgstAmount + sgstAmount).toFixed(2));

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Sheriyakam Tax Invoice ${invoiceId} - Total: ₹${totalAmount}. Download at https://sheriyakam.com/invoice/${invoiceId}`,
                title: `Tax Invoice ${invoiceId}`,
            });
        } catch (e) {}
    };

    const handleDownloadPdf = () => {
        success(`Tax Invoice ${invoiceId}.pdf generated and saved!`, 'Invoice Downloaded');
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
                    {/* Brand & GSTIN Header */}
                    <View style={styles.paperHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.brandTitle}>SHERIYAKAM</Text>
                            <Text style={[styles.companyLegal, { color: colors.textSecondary }]}>
                                Sheriyakam Technologies Private Limited
                            </Text>
                            <Text style={[styles.companyAddr, { color: colors.textTertiary }]}>
                                3rd Floor, Malabar Trade Centre, Civil Station Road, Kozhikode, Kerala - 673020
                            </Text>
                            <Text style={[styles.gstinText, { color: colors.textPrimary }]}>
                                GSTIN: <Text style={{ fontWeight: '800' }}>32AABCS8492K1Z8</Text> (State: Kerala - 32)
                            </Text>
                        </View>
                        <Badge variant="gold" size="sm">TAX INVOICE</Badge>
                    </View>

                    <View style={[styles.paperDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    {/* Metadata Grid */}
                    <View style={styles.metaGrid}>
                        <View style={styles.metaCol}>
                            <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>INVOICE NO:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{invoiceId}</Text>

                            <Text style={[styles.metaLabel, { color: colors.textTertiary, marginTop: 8 }]}>DATE OF ISSUE:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>
                                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Text>
                        </View>

                        <View style={styles.metaCol}>
                            <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>BOOKING ID:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{bookingId}</Text>

                            <Text style={[styles.metaLabel, { color: colors.textTertiary, marginTop: 8 }]}>PLACE OF SUPPLY:</Text>
                            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>Kozhikode, Kerala (32)</Text>
                        </View>
                    </View>

                    {/* Billed To / Technician Info */}
                    <View style={[styles.partyBox, { backgroundColor: isDark ? '#27272A50' : '#F4F4F5' }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.partyLabel, { color: colors.textTertiary }]}>BILLED TO (CUSTOMER):</Text>
                            <Text style={[styles.partyName, { color: colors.textPrimary }]}>Rahul Menon</Text>
                            <Text style={[styles.partyAddr, { color: colors.textSecondary }]}>
                                Flat 4B, Emerald Residency, Civil Station, Kozhikode - 673020
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: isDark ? '#3F3F46' : '#E4E4E7', paddingLeft: 12 }}>
                            <Text style={[styles.partyLabel, { color: colors.textTertiary }]}>EXECUTING WIREMAN:</Text>
                            <Text style={[styles.partyName, { color: colors.textPrimary }]}>Sanoop K. (KSELB Class W)</Text>
                            <Text style={[styles.partyAddr, { color: colors.textSecondary }]}>
                                License: KL-EL-2021-9482 • e-Shram UAN Verified
                            </Text>
                        </View>
                    </View>

                    {/* Itemized Table */}
                    <Text style={[styles.tableHeaderTitle, { color: colors.textSecondary }]}>
                        ITEMIZED SERVICES & MATERIAL BREAKDOWN
                    </Text>

                    <View style={styles.table}>
                        {lineItems.map((item, idx) => (
                            <View key={idx} style={[styles.tableRow, { borderBottomColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.itemName, { color: colors.textPrimary }]}>
                                        {item.desc}
                                    </Text>
                                    <View style={styles.tagRow}>
                                        <Badge variant="neutral" size="sm">{item.sac || item.hsn}</Badge>
                                        {item.origin && (
                                            <Badge variant="success" size="sm">{item.origin}</Badge>
                                        )}
                                    </View>
                                </View>
                                <Text style={[styles.itemRate, { color: colors.textPrimary }]}>
                                    ₹{item.rate.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Tax & Total Summary */}
                    <View style={[styles.summaryBox, { backgroundColor: isDark ? '#18181B' : '#FAFAFA' }]}>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Taxable Subtotal:</Text>
                            <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>CGST @ 9% (Central Tax):</Text>
                            <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{cgstAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Kerala SGST @ 9% (State Tax):</Text>
                            <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{sgstAmount.toFixed(2)}</Text>
                        </View>

                        <View style={[styles.totalDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                        <View style={styles.totalRow}>
                            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>TOTAL AMOUNT (INR):</Text>
                            <Text style={[styles.totalVal, { color: colors.accent }]}>₹{totalAmount.toFixed(2)}</Text>
                        </View>
                        <Badge variant="success" size="sm" style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                            PAID VIA UPI (TRANSACTION ID: TXN-829148)
                        </Badge>
                    </View>

                    {/* Statutory Guarantee & Warranty Footer */}
                    <View style={[styles.warrantyStrip, { backgroundColor: isDark ? '#27272A50' : '#EFF6FF80' }]}>
                        <ShieldCheck size={18} color="#10B981" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.warrantyTitle, { color: colors.textPrimary }]}>
                                30-Day Free Rework Warranty & ₹5 Lakh Damage Cover
                            </Text>
                            <Text style={[styles.warrantyText, { color: colors.textSecondary }]}>
                                Valid till {new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}. Genuine manufacturer warranty applies to all ISI spares.
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
        gap: 14,
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
        fontSize: 12,
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
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        gap: 12,
    },
    partyLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    partyName: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 2,
    },
    partyAddr: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 1,
    },
    tableHeaderTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginTop: 6,
    },
    table: {
        gap: 8,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    itemName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 6,
    },
    itemRate: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 12,
    },
    summaryBox: {
        padding: 14,
        borderRadius: 12,
        gap: 6,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontSize: 12,
    },
    summaryVal: {
        fontSize: 12,
        fontWeight: '600',
    },
    totalDivider: {
        height: 1,
        marginVertical: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: '800',
    },
    totalVal: {
        fontSize: 16,
        fontWeight: '900',
    },
    warrantyStrip: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        gap: 10,
        alignItems: 'center',
    },
    warrantyTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    warrantyText: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 1,
    },
    actionButtons: {
        marginTop: 16,
    },
});
