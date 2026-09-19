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
        const url = 'tel:+914952800000';
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
                <title>About Sheriyakam & Empire Electricals (Est. 1998) | Kerala</title>
                <meta name="description" content="Discover the 28-year heritage of Empire Electricals (Est. 1998, Thalassery, KSELB Licence #KSELB/CA-7821/KL) and how Sheriyakam brings trusted, transparent electrical repairs to all 14 Kerala districts." />
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
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Empire Electricals • 28+ Years of Service • Est. 1998</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/locations')} style={styles.hubBtn}>
                    <Badge variant="info" size="sm">14 Districts</Badge>
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
                        <Badge variant="gold" size="md">Empire Electricals Est. 1998</Badge>
                        <Badge variant="success" size="md">KSELB Class-A #KSELB/CA-7821/KL</Badge>
                    </View>
                </View>

                {/* Heritage Story: Empire Electricals (Est. 1998) */}
                <Card variant="elevated" style={[styles.storyCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <View style={styles.storyHeader}>
                        <Award size={28} color="#F59E0B" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.storyPretitle}>OUR 28-YEAR HERITAGE</Text>
                            <Text style={styles.storyTitle}>From Thalassery Workshop to Statewide On-Demand Platform</Text>
                        </View>
                    </View>
                    <Text style={styles.storyText}>
                        In 1998, master electrical contractors founded <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Empire Electricals</Text> on Main Road in Thalassery, North Malabar. Starting with heavy commercial distribution wiring, industrial control panels, and coastal home rewiring, our team built a reputation for honest diagnostics, zero cut corners, and strict code compliance under the Kerala State Electricity Licensing Board (KSELB).
                    </Text>
                    <Text style={styles.storyText}>
                        Over 28+ years, Empire Electricals completed more than <Text style={{ fontWeight: '800', color: '#60A5FA' }}>18,000+ physical installations and repairs</Text>. In 2024, we launched <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Sheriyakam</Text> ("ശരിയാക്കാം" — "We will fix it") to bring that same generational craftsmanship directly to your smartphone with transparent fixed rates and 45–90 minute doorstep dispatch.
                    </Text>
                </Card>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { value: '28+ Yrs', label: 'Kerala Heritage', icon: Award, color: '#F59E0B' },
                        { value: '18,000+', label: 'Lifetime Fixes', icon: CheckCircle, color: '#10B981' },
                        { value: '250+', label: 'Licensed Wiremen', icon: Users, color: '#2563EB' },
                        { value: '14/14', label: 'Districts Active', icon: MapPin, color: '#8B5CF6' },
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
                            <ShieldCheck size={20} color="#10B981" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>100% KSELB Certified Technicians</Text>
                                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                    Every technician dispatched to your home holds an active wireman or supervisor permit certified by the Kerala Electrical Inspectorate.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pillarItem}>
                            <CheckCircle size={20} color="#2563EB" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>Transparent "Pay After Work" Rates</Text>
                                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                    No inflated doorstep bargaining. You see fixed rate cards before booking and pay only after you test the completed repair.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pillarItem}>
                            <Zap size={20} color="#F59E0B" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>30-Day Free Rework Guarantee</Text>
                                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                    If the same issue reoccurs within 30 days, an Empire Electricals supervisor revisits and fixes it at ₹0 visit fee.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pillarItem}>
                            <Shield size={20} color="#8B5CF6" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1, gap: 2 }}>
                                <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>₹5,00,000 Safety Protection Cover</Text>
                                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                    Every home visit is backed by ₹5 Lakh third-party property damage coverage against accidental electrical hazards.
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
                                <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Central Helpline (All 14 Districts)</Text>
                                <Text style={[styles.contactValue, { color: colors.textPrimary }]}>+91 495 280 0000</Text>
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
                                    Empire Electricals, Main Road, Near Old Bus Stand, Thalassery, Kannur, Kerala - 670101
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Footer */}
                <View style={styles.aboutFooter}>
                    <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                        © 2026 Sheriyakam • Empire Electricals (Est. 1998)
                    </Text>
                    <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
                        Crafted with pride in Thalassery for all 14 Kerala Districts
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
