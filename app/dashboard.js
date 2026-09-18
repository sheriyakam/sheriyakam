import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    useWindowDimensions, Platform, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, User, Phone, MapPin, Calendar, Clock,
    FileText, ShieldCheck, Zap, AlertTriangle, ArrowRight,
    CheckCircle2, Plus, LogOut, ChevronRight
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getBookings, bookingEvents } from '../constants/bookingStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function CustomerDashboardScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { user, logout } = useAuth();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    const [allBookings, setAllBookings] = useState(getBookings());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const updateBookings = () => setAllBookings([...getBookings()]);
        bookingEvents.on('change', updateBookings);
        return () => bookingEvents.off('change', updateBookings);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setAllBookings([...getBookings()]);
            setRefreshing(false);
        }, 600);
    };

    const activeBookings = allBookings.filter(b => ['scheduled', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status));
    const completedBookings = allBookings.filter(b => ['completed', 'paid'].includes(b.status));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return <Badge variant="warning">Scheduled</Badge>;
            case 'assigned':
                return <Badge variant="info">Partner Assigned</Badge>;
            case 'on_the_way':
                return <Badge variant="info">On The Way (GPS Live)</Badge>;
            case 'arrived':
                return <Badge variant="warning">Technician Arrived</Badge>;
            case 'in_progress':
                return <Badge variant="warning">Job In Progress</Badge>;
            case 'completed':
                return <Badge variant="success">Completed</Badge>;
            case 'paid':
                return <Badge variant="success">Paid & Closed</Badge>;
            default:
                return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>Customer Dashboard & Live Service Tracking | Sheriyakam</title>
                <meta name="description" content="Manage your active electrical service bookings, track technician GPS arrival in real-time, view past job history, and download GST invoices." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/dashboard" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Account & Tracking</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Customer Service Hub</Text>
                </View>
                <Button variant="primary" size="sm" onPress={() => router.push('/services')}>
                    + Book New
                </Button>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
            >
                {/* User Profile Card */}
                <Card variant="default" style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={[styles.avatarWrap, { backgroundColor: colors.accent + '22' }]}>
                            <User size={26} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.userName, { color: colors.textPrimary }]}>
                                {user?.name || user?.email?.split('@')[0] || 'Kerala Home Owner'}
                            </Text>
                            <Text style={[styles.userContact, { color: colors.textSecondary }]}>
                                {user?.mobile || user?.email || '+91 98470 XXXXX (Active Customer)'}
                            </Text>
                        </View>
                        <Badge variant="success" size="sm">Verified Account</Badge>
                    </View>

                    <View style={[styles.profilePerks, { backgroundColor: isDark ? '#27272A55' : '#F4F4F5' }]}>
                        <View style={styles.perkItem}>
                            <ShieldCheck size={16} color="#10B981" />
                            <Text style={[styles.perkText, { color: colors.textPrimary }]}>₹5 Lakh Damage Insurance Active</Text>
                        </View>
                        <View style={styles.perkItem}>
                            <Zap size={16} color="#F59E0B" />
                            <Text style={[styles.perkText, { color: colors.textPrimary }]}>30-Day Free Rework Protection</Text>
                        </View>
                    </View>
                </Card>

                {/* Active Bookings Section */}
                <View style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Active Bookings ({activeBookings.length})
                        </Text>
                        <TouchableOpacity onPress={onRefresh}>
                            <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '700' }}>Refresh</Text>
                        </TouchableOpacity>
                    </View>

                    {activeBookings.length === 0 ? (
                        <Card variant="default" style={styles.emptyCard}>
                            <CheckCircle2 size={32} color="#10B981" />
                            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Pending Service Bookings</Text>
                            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                                Need an electrician or AC service? Book in 60 seconds with 90-minute arrival across Kerala.
                            </Text>
                            <Button variant="primary" size="md" onPress={() => router.push('/services')} style={{ marginTop: 12 }}>
                                Browse Services Rate Card
                            </Button>
                        </Card>
                    ) : (
                        <View style={styles.bookingsList}>
                            {activeBookings.map((b) => (
                                <Card key={b.id} variant="default" style={styles.activeBookingCard}>
                                    <View style={styles.bookingTopRow}>
                                        <Text style={[styles.bookingServiceTitle, { color: colors.textPrimary }]}>
                                            {b.serviceTitle}
                                        </Text>
                                        {getStatusBadge(b.status)}
                                    </View>

                                    <View style={styles.bookingMetaRow}>
                                        <View style={styles.metaItem}>
                                            <Calendar size={13} color={colors.textTertiary} />
                                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{b.timeSlot || 'Scheduled Slot'}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <MapPin size={13} color={colors.textTertiary} />
                                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{b.address || b.district || 'Kerala'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.partnerSnippet}>
                                        <Text style={[styles.partnerLabel, { color: colors.textTertiary }]}>Assigned Partner:</Text>
                                        <Text style={[styles.partnerName, { color: colors.textPrimary }]}>
                                            {b.partnerName || 'KSELB Certified Wireman #28'}
                                        </Text>
                                    </View>

                                    <View style={styles.cardActionsRow}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onPress={() => router.push(`/booking/${b.id}`)}
                                            iconRight={ArrowRight}
                                            style={{ flex: 1 }}
                                        >
                                            Live GPS Tracking & OTP
                                        </Button>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}
                </View>

                {/* Quick Shortcuts */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Access Hub</Text>
                    <View style={styles.shortcutGrid}>
                        <TouchableOpacity onPress={() => router.push('/emergency-electrician')} style={[styles.shortcutCard, { backgroundColor: '#7F1D1D22', borderColor: '#EF4444' }]}>
                            <AlertTriangle size={22} color="#EF4444" />
                            <Text style={[styles.shortcutTitle, { color: '#EF4444' }]}>24/7 Emergency Triage</Text>
                            <Text style={styles.shortcutDesc}>90-Min Spark & Tripping Response</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/amc')} style={[styles.shortcutCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <ShieldCheck size={22} color="#10B981" />
                            <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Sheriyakam Care AMC</Text>
                            <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Preventive Electrical Care Plans</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/commercial')} style={[styles.shortcutCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <Zap size={22} color={colors.accent} />
                            <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Commercial Contracting</Text>
                            <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Offices, Clinics & Apartments</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/work')} style={[styles.shortcutCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                            <FileText size={22} color="#3B82F6" />
                            <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Work Portfolio</Text>
                            <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Verified Installations in Kerala</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Past Bookings & Invoices */}
                {completedBookings.length > 0 && (
                    <View style={styles.sectionWrap}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Past Bookings & Tax Invoices</Text>
                        <View style={styles.bookingsList}>
                            {completedBookings.map((b) => (
                                <Card key={b.id} variant="default" style={styles.pastBookingCard}>
                                    <View style={styles.bookingTopRow}>
                                        <Text style={[styles.bookingServiceTitle, { color: colors.textPrimary }]}>{b.serviceTitle}</Text>
                                        <Badge variant="success">Completed</Badge>
                                    </View>
                                    <View style={styles.pastBookingFooter}>
                                        <Text style={[styles.pastBookingPrice, { color: colors.accent }]}>₹{b.price || 350}</Text>
                                        <TouchableOpacity
                                            onPress={() => router.push(`/invoice/${b.id}`)}
                                            style={styles.invoiceBtn}
                                        >
                                            <FileText size={14} color={colors.accent} />
                                            <Text style={[styles.invoiceBtnText, { color: colors.accent }]}>GST Invoice</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    </View>
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
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        gap: 16,
    },
    profileCard: {
        padding: 18,
        borderRadius: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    avatarWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '800',
    },
    userContact: {
        fontSize: 13,
        marginTop: 2,
    },
    profilePerks: {
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    perkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    perkText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionWrap: {
        gap: 10,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 16,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginTop: 4,
    },
    emptySub: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    bookingsList: {
        gap: 12,
    },
    activeBookingCard: {
        padding: 16,
        borderRadius: 14,
        gap: 10,
    },
    bookingTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingServiceTitle: {
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
        marginRight: 8,
    },
    bookingMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
    },
    partnerSnippet: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    partnerLabel: {
        fontSize: 12,
    },
    partnerName: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardActionsRow: {
        marginTop: 4,
    },
    shortcutGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    shortcutCard: {
        width: '48%',
        flexGrow: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    shortcutTitle: {
        fontSize: 13,
        fontWeight: '800',
        marginTop: 6,
    },
    shortcutDesc: {
        fontSize: 11,
    },
    pastBookingCard: {
        padding: 14,
        borderRadius: 12,
    },
    pastBookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    pastBookingPrice: {
        fontSize: 15,
        fontWeight: '800',
    },
    invoiceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    invoiceBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
});
