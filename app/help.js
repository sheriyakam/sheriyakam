import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Calendar, CreditCard, ShieldCheck, Zap, User, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Searchbar } from '../components/ui/Searchbar';
import { Button } from '../components/ui/Button';

const HELP_CATEGORIES = [
    {
        title: 'Booking & Scheduling',
        desc: 'How to reschedule, choose time slots, or book recurring visits',
        icon: Calendar,
        color: '#3B82F6',
    },
    {
        title: 'Payments & GST Invoices',
        desc: 'UPI, credit cards, downloading tax receipts, and refunds',
        icon: CreditCard,
        color: '#10B981',
    },
    {
        title: '30-Day Warranty & Rework',
        desc: 'How to request a free technician rework if a problem recurs',
        icon: ShieldCheck,
        color: '#F59E0B',
    },
    {
        title: 'Emergency 30-Min Dispatch',
        desc: 'How standby technicians are assigned during power blackouts',
        icon: Zap,
        color: '#EF4444',
    },
    {
        title: 'Account, 2FA & Privacy',
        desc: 'Managing passwords, active sessions, and data deletion',
        icon: User,
        color: '#8B5CF6',
    },
];

export default function HelpCenterScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Knowledge Base</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Search Header */}
                <View style={styles.searchSection}>
                    <Text style={[styles.searchTitle, { color: colors.textPrimary }]}>
                        How can we help you today?
                    </Text>
                    <Searchbar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search answers (e.g. warranty, invoice, refund)..."
                    />
                </View>

                {/* Categories */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    BROWSE HELP TOPICS
                </Text>

                <View style={styles.categoriesList}>
                    {HELP_CATEGORIES.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => router.push('/faq')}
                                activeOpacity={0.75}
                            >
                                <Card variant="default" style={styles.catCard}>
                                    <View style={[styles.iconWrap, { backgroundColor: cat.color + '18' }]}>
                                        <Icon size={20} color={cat.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.catTitle, { color: colors.textPrimary }]}>
                                            {cat.title}
                                        </Text>
                                        <Text style={[styles.catDesc, { color: colors.textSecondary }]}>
                                            {cat.desc}
                                        </Text>
                                    </View>
                                    <ChevronRight size={18} color={colors.textTertiary} />
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Direct Support Contact */}
                <Card variant="elevated" style={styles.supportCard}>
                    <HelpCircle size={28} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>
                            Still have questions?
                        </Text>
                        <Text style={[styles.supportSub, { color: colors.textSecondary }]}>
                            Our Kozhikode dispatch desk is available 24/7.
                        </Text>
                    </View>
                    <Button
                        variant="primary"
                        size="sm"
                        onPress={() => router.push('/contact')}
                    >
                        Contact Us
                    </Button>
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
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    searchSection: {
        marginVertical: 12,
        gap: 12,
    },
    searchTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 8,
        paddingLeft: 2,
    },
    categoriesList: {
        gap: 10,
    },
    catCard: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    catDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
    supportCard: {
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    supportTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    supportSub: {
        fontSize: 12,
        marginTop: 1,
    },
});
