import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Zap, ShieldCheck, Clock, CheckCircle2, Award, Wrench, Smartphone, Star, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const FEATURES = [
    {
        icon: Zap,
        title: '30-Minute Emergency Callout',
        desc: 'Dedicated rapid-dispatch standby electricians ready to respond to sparking, power outages, and breaker trips across Kozhikode.',
        badge: 'Priority Response',
        color: '#EF4444',
    },
    {
        icon: ShieldCheck,
        title: '100% Kerala Licensed Electricians',
        desc: 'Every contractor on Sheriyakam holds a verified government electrical wireman / supervisor license and passes police background verification.',
        badge: 'Government Verified',
        color: '#10B981',
    },
    {
        icon: Award,
        title: '30-Day Free Rework Warranty',
        desc: 'If an issue recurs within 30 days of service completion, a senior master electrician will fix it completely free of charge.',
        badge: 'Zero Risk Guarantee',
        color: '#F59E0B',
    },
    {
        icon: Wrench,
        title: 'Transparent Fixed Rate Cards',
        desc: 'Say goodbye to arbitrary bargaining. Know exact labor charges and spare part prices upfront before the work begins.',
        badge: 'No Hidden Costs',
        color: '#6366F1',
    },
    {
        icon: Smartphone,
        title: 'Live GPS Contractor Tracking',
        desc: 'Watch your assigned technician arrive in real-time with live ETA and in-app chat direct to your doorstep.',
        badge: 'Real-Time Telemetry',
        color: '#3B82F6',
    },
    {
        icon: Star,
        title: 'Digital Tax Invoices & Reports',
        desc: 'Instant GST-compliant digital invoices and safety certificates sent directly to your email and WhatsApp for warranty records.',
        badge: 'Digital Compliance',
        color: '#EC4899',
    },
];

export default function FeaturesScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Features & Standards</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Badge variant="gold" size="md">Why Choose Sheriyakam</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Setting the Benchmark for Electrical Services in Kerala
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Combining verified trade excellence with modern instant dispatch technology for absolute domestic safety.
                    </Text>
                </View>

                {/* Features Grid */}
                <View style={styles.featuresGrid}>
                    {FEATURES.map((feat, index) => {
                        const Icon = feat.icon;
                        return (
                            <Card key={index} variant="default" style={styles.featureCard}>
                                <View style={styles.cardTop}>
                                    <View style={[styles.iconWrap, { backgroundColor: feat.color + '18' }]}>
                                        <Icon size={24} color={feat.color} />
                                    </View>
                                    <Badge variant="neutral" size="sm">{feat.badge}</Badge>
                                </View>

                                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                                    {feat.title}
                                </Text>
                                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                                    {feat.desc}
                                </Text>
                            </Card>
                        );
                    })}
                </View>

                {/* CTA Box */}
                <Card variant="elevated" style={styles.ctaCard}>
                    <Text style={[styles.ctaTitle, { color: colors.textPrimary }]}>
                        Need an Electrician Right Now?
                    </Text>
                    <Text style={[styles.ctaSubtitle, { color: colors.textSecondary }]}>
                        Book in under 60 seconds or speak with our 24/7 Kozhikode dispatch desk.
                    </Text>

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={() => router.push('/search')}
                        iconRight={ChevronRight}
                        style={{ marginTop: 14 }}
                    >
                        Book a Certified Fix
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
    heroSection: {
        alignItems: 'center',
        marginVertical: 16,
        gap: 8,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    heroSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 340,
    },
    featuresGrid: {
        gap: 12,
        marginVertical: 12,
    },
    featureCard: {
        padding: 18,
        gap: 10,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    featureDesc: {
        fontSize: 13,
        lineHeight: 19,
    },
    ctaCard: {
        padding: 22,
        alignItems: 'center',
        marginVertical: 16,
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    ctaSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 4,
    },
});
