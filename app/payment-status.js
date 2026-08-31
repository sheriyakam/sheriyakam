import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ShieldCheck, FileText, ArrowRight, RefreshCw, Home } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function PaymentStatusScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    // State can be 'success' | 'failed' | 'pending'
    const [status, setStatus] = useState(params.status || 'success');
    const bookingId = params.bookingId || `SK-${Math.floor(100000 + Math.random() * 900000)}`;
    const amount = params.amount || '₹499';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go Home">
                    <Home size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Payment Status
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* State Tabs for Testing/Demo */}
                <View style={styles.tabRow}>
                    <TouchableOpacity 
                        style={[styles.tabBtn, status === 'success' && { backgroundColor: '#10B98120', borderColor: '#10B981' }]} 
                        onPress={() => setStatus('success')}
                    >
                        <Text style={{ color: status === 'success' ? '#10B981' : colors.textSecondary, fontWeight: '700', fontSize: 12 }}>Success</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabBtn, status === 'pending' && { backgroundColor: '#F59E0B20', borderColor: '#F59E0B' }]} 
                        onPress={() => setStatus('pending')}
                    >
                        <Text style={{ color: status === 'pending' ? '#F59E0B' : colors.textSecondary, fontWeight: '700', fontSize: 12 }}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabBtn, status === 'failed' && { backgroundColor: '#EF444420', borderColor: '#EF4444' }]} 
                        onPress={() => setStatus('failed')}
                    >
                        <Text style={{ color: status === 'failed' ? '#EF4444' : colors.textSecondary, fontWeight: '700', fontSize: 12 }}>Failed</Text>
                    </TouchableOpacity>
                </View>

                {/* Status Card */}
                {status === 'success' && (
                    <Card variant="elevated" style={styles.statusCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#10B98115', borderColor: '#10B98130' }]}>
                            <CheckCircle2 size={48} color="#10B981" />
                        </View>
                        <Badge variant="success" size="md">Payment Completed</Badge>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                            Booking Confirmed!
                        </Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                            Your transaction of <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{amount}</Text> was successful. An electrician has been dispatched.
                        </Text>

                        <View style={[styles.receiptBox, { backgroundColor: isDark ? '#18181B' : '#F4F4F5' }]}>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Booking Reference</Text>
                                <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{bookingId}</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Payment Method</Text>
                                <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>UPI / Instant NetBanking</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Estimated Arrival</Text>
                                <Text style={[styles.receiptVal, { color: '#10B981' }]}>Under 90 Minutes</Text>
                            </View>
                        </View>

                        <Button variant="primary" onPress={() => router.push('/bookings')}>
                            Track Technician Live
                        </Button>
                        <Button variant="outline" onPress={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </Card>
                )}

                {status === 'pending' && (
                    <Card variant="elevated" style={styles.statusCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B30' }]}>
                            <Clock size={48} color="#F59E0B" />
                        </View>
                        <Badge variant="gold" size="md">Awaiting Bank Confirmation</Badge>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                            Payment Processing
                        </Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                            We're confirming your transaction with your bank. This usually takes under 60 seconds.
                        </Text>

                        <Button variant="primary" onPress={() => setStatus('success')}>
                            Check Status Again
                        </Button>
                        <Button variant="outline" onPress={() => router.push('/bookings')}>
                            View Pending Bookings
                        </Button>
                    </Card>
                )}

                {status === 'failed' && (
                    <Card variant="elevated" style={styles.statusCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}>
                            <XCircle size={48} color="#EF4444" />
                        </View>
                        <Badge variant="danger" size="md">Payment Unsuccessful</Badge>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                            Transaction Failed
                        </Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                            Your bank declined the transaction or the session timed out. If money was debited, it will be reversed within 24 hours.
                        </Text>

                        <Button variant="primary" onPress={() => router.push('/checkout')}>
                            Retry Payment
                        </Button>
                        <Button variant="outline" onPress={() => router.push('/help')}>
                            Contact Support
                        </Button>
                    </Card>
                )}
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
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        maxWidth: 600,
        width: '100%',
        marginHorizontal: 'auto',
        alignSelf: 'center',
    },
    tabRow: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 16,
    },
    tabBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    statusCard: {
        padding: 24,
        alignItems: 'center',
        gap: 14,
        textAlign: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    cardSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
    },
    receiptBox: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        gap: 8,
        marginVertical: 6,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    receiptLabel: {
        fontSize: 12,
    },
    receiptVal: {
        fontSize: 12.5,
        fontWeight: '700',
    },
});
