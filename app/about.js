import { SUPPORT_PHONE, SUPPORT_PHONE_DISPLAY, PILOT_ZONE } from '../constants/contact';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { ArrowLeft, Globe, Mail, Phone, ExternalLink, Shield, Award, Users, CheckCircle, UserCheck, Wrench, Heart, Zap, MapPin, Clock, ShieldCheck } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function AboutScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme() || { theme: 'dark', colors: COLORS };
    const isDark = theme === 'dark';

    const handleCall = () => {
        const url = `tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`;
        if (Platform.OS === 'web') window.location.href = url;
        else Linking.openURL(url);
    };

    const handleEmail = () => {
        const url = 'mailto:support@sheriyakam.in';
        if (Platform.OS === 'web') window.location.href = url;
        else Linking.openURL(url);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>About Sheriyakam | Thalassery & Mahe Electrical Pilot</title>
                <meta name="description" content="Discover Sheriyakam local electrical pilot serving the Thalassery–Mahe corridor. Trade-tested electricians, transparent rates, and a 30-day workmanship warranty." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/about" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { 
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0' 
            }]}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About Sheriyakam</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Verified Technicians • Upfront Pricing • Thalassery & Mahe</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/locations')} style={styles.hubBtn}>
                    <Badge variant="info" size="sm">Thalassery–Mahe</Badge>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Brand Hero */}
                <View style={styles.heroSection}>
                    <View style={[styles.logoContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                        <Image source={require('../assets/icon.png')} style={styles.logo} />
                    </View>
                    <Text style={styles.appName}>
                        <Text style={{ color: colors.textPrimary, fontWeight: '900' }}>Sheri</Text>
                        <Text style={{ color: colors.accent, fontWeight: '900' }}>yakam</Text>
                    </Text>
                    <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                        Kerala’s Most Trusted Doorstep Electrical Service Platform
                    </Text>
                    <View style={styles.badgeRow}>
                        <Badge variant="gold" size="md">Verified Electrical Service</Badge>
                        <Badge variant="success" size="md">Licensed & Insured</Badge>
                    </View>
                </View>

                {/* Heritage Story: Mission */}
                <Card variant="elevated" style={[styles.storyCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <View style={styles.storyHeader}>
                        <Award size={28} color="#F59E0B" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.storyPretitle}>OUR MISSION</Text>
                            <Text style={styles.storyTitle}>Quality Doorstep Electrical Care in Thalassery & Mahe</Text>
                        </View>
                    </View>
                    <Text style={styles.storyText}>
                        <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Sheriyakam</Text> ("ശരിയാക്കാം" — "We will fix it") was created to solve everyday domestic and commercial electrical emergencies with honest diagnostics, zero cut corners, and strict safety compliance under the Kerala State Electricity Licensing Board (KSELB).
                    </Text>
                    <Text style={styles.storyText}>
                        Operating directly from our local workshop in Thalassery, Sheriyakam connects homeowners and local businesses across the Thalassery–Mahe corridor with skilled, trade-tested wiremen. Every repair is pre-confirmed by phone, priced by published rate card, and protected by our 30-day workmanship warranty.
                    </Text>
                </Card>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { value: 'Local Hub', label: 'Thalassery & Mahe', icon: MapPin, color: '#2563EB' },
                        { value: 'Fixed Rates', label: 'Upfront Rate Card', icon: Award, color: '#F59E0B' },
                        { value: 'Trade-Tested', label: 'Certified Wiremen', icon: UserCheck, color: '#10B981' },
                        { value: '30-Day', label: 'Rework Warranty', icon: ShieldCheck, color: '#8B5CF6' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <View key={i} style={[styles.statCard, { 
                                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                borderColor: isDark ? '#27272A' : '#E2E8F0',
                            }]}>
                                <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                                    <Icon size={18} color={stat.color} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Why Sheriyakam is Different (Our 4 Core Pillars) */}
                <Card variant="default" style={[styles.card, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                        Why Kerala Trusts Sheriyakam
                    </Text>

                    <View style={{ gap: 14, marginTop: 10 }}>
                        <View style={styles.pillarItem}>
                            <Shield size={20} color="#8B5CF6" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>Strict KSELB Safety & Isolation Standards</Text>
                                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                    Every job strictly complies with Central Electricity Authority (CEA) protocols, physical neutral isolation, and calibrated multimeter load testing before handover.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Head Office & Contact */}
                <Card variant="default" style={[styles.card, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                        Headquarters & Direct Contact
                    </Text>

                    <View style={{ gap: 10, marginTop: 6 }}>
                        <TouchableOpacity 
                            style={[styles.contactRow, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}
                            onPress={handleCall}
                        >
                            <Phone size={18} color={colors.accent} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Local Dispatch Desk (Thalassery–Mahe)</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>{SUPPORT_PHONE_DISPLAY}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.contactRow, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}
                            onPress={handleEmail}
                        >
                            <Mail size={18} color="#10B981" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Official Support Email</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>support@sheriyakam.in</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.contactRow, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                            <MapPin size={18} color="#F59E0B" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Headquarters & Main Workshop</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>
                                    Sheriyakam Technologies, Main Road, Near Old Bus Stand, Thalassery, Kannur, Kerala - 670101
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Footer */}
                <View style={styles.aboutFooter}>
                    <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                        © 2026 Sheriyakam. All rights reserved.
                    </Text>
                    <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
                        Crafted with pride in Thalassery for the Thalassery–Mahe Corridor
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
        fontSize: 11,
    },
    hubBtn: {
        padding: 2,
    },
    content: {
        padding: 16,
        paddingBottom: 60,
        maxWidth: 960,
        width: '100%',
        alignSelf: 'center',
        gap: 16,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: 10,
        gap: 6,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    logo: {
        width: 68,
        height: 68,
        borderRadius: 16,
    },
    appName: {
        fontSize: 26,
    },
    tagline: {
        fontSize: 13,
        textAlign: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4,
    },
    storyCard: {
        padding: 22,
        borderRadius: 20,
        gap: 12,
    },
    storyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    storyPretitle: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    storyTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 24,
    },
    storyText: {
        color: '#CBD5E1',
        fontSize: 13.5,
        lineHeight: 22,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statCard: {
        flex: 1,
        minWidth: 140,
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 4,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 11,
    },
    card: {
        padding: 18,
        borderRadius: 16,
        gap: 10,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    pillarItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    pillarTitle: {
        fontSize: 14,
        fontWeight: '800',
    },
    pillarDesc: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    contactLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    contactValue: {
        fontSize: 13.5,
        fontWeight: '700',
    },
    aboutFooter: {
        alignItems: 'center',
        marginTop: 10,
        gap: 2,
    },
    footerText: {
        fontSize: 12,
    },
    footerSubtext: {
        fontSize: 11,
    },
});
