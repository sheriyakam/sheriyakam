import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, CheckCircle2, ShieldCheck, HelpCircle, HeartHandshake, Phone } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const ACCESSIBILITY_FEATURES = [
    {
        title: 'Screen Reader Optimization',
        desc: 'All interactive buttons, icons, modals, and input fields include explicit accessibilityLabel, accessibilityRole, and ARIA attributes for VoiceOver and TalkBack.',
        badge: 'VoiceOver / TalkBack',
    },
    {
        title: 'High Contrast Dark & Light Themes',
        desc: 'Color contrast ratios across all text and UI elements strictly exceed WCAG 2.1 AA requirements (minimum 4.5:1 for normal text and 3:1 for large typography).',
        badge: 'WCAG 2.1 AA',
    },
    {
        title: 'Full Keyboard & Switch Navigation',
        desc: 'The entire web app is navigable via Tab and Enter keys, with clear focus indicators on all links, inputs, and interactive widgets.',
        badge: 'Keyboard Friendly',
    },
    {
        title: 'Scalable Dynamic Typography',
        desc: 'Supports OS-level large text scaling (Dynamic Type) without clipping, horizontal scroll breaking, or overlapping layouts.',
        badge: 'Dynamic Type',
    },
];

export default function AccessibilityStatementScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Accessibility Statement
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info" size="md">Digital Inclusion</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Committed to Accessible Service for Everyone
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Sheriyakam is designed to ensure that elderly citizens, individuals with visual impairments, and assistive technology users across Kerala can easily book emergency electrical services.
                    </Text>
                </View>

                {/* Features Grid */}
                <View style={styles.featuresList}>
                    {ACCESSIBILITY_FEATURES.map((feat, idx) => (
                        <Card key={idx} variant="elevated" style={styles.featCard}>
                            <View style={styles.featHeader}>
                                <Text style={[styles.featTitle, { color: colors.textPrimary }]}>
                                    {feat.title}
                                </Text>
                                <Badge variant="success">{feat.badge}</Badge>
                            </View>
                            <Text style={[styles.featDesc, { color: colors.textSecondary }]}>
                                {feat.desc}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Priority Phone Dispatch for Assisted Bookings */}
                <Card variant="outline" style={styles.assistedCard}>
                    <Phone size={22} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.assistedTitle, { color: colors.textPrimary }]}>
                            Need Phone-Assisted Booking?
                        </Text>
                        <Text style={[styles.assistedDesc, { color: colors.textSecondary }]}>
                            If you encounter any difficulty navigating the digital interface, our 24/7 Kerala hotline can complete your booking and technician dispatch over the phone.
                        </Text>
                    </View>
                </Card>

                {/* Feedback */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Accessibility Feedback & Support</Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        We continuously test our web and mobile applications against assistive technology tools. If you encounter any barrier, please email us at accessibility@sheriyakam.com. We respond within 24 business hours.
                    </Text>
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
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
        maxWidth: 880,
        width: '100%',
        marginHorizontal: 'auto',
        alignSelf: 'center',
    },
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 520,
    },
    featuresList: {
        gap: 12,
        marginVertical: 16,
    },
    featCard: {
        padding: 18,
        gap: 8,
    },
    featHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    featTitle: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    featDesc: {
        fontSize: 13,
        lineHeight: 19,
    },
    assistedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        marginVertical: 12,
    },
    assistedTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    assistedDesc: {
        fontSize: 12.5,
        lineHeight: 18,
        marginTop: 2,
    },
    section: {
        marginVertical: 14,
        gap: 6,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    sectionText: {
        fontSize: 13,
        lineHeight: 20,
    },
});
