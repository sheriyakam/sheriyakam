import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2, Lock, Sliders, Info } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function CookiePolicyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { showToast } = useToast() || { showToast: () => {} };
    const isDark = theme === 'dark';

    // Cookie Preferences State
    const [analyticsCookies, setAnalyticsCookies] = useState(true);
    const [functionalCookies, setFunctionalCookies] = useState(true);
    const [marketingCookies, setMarketingCookies] = useState(false);

    const handleSavePreferences = () => {
        showToast('Cookie preferences saved successfully!', 'success');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Cookie Policy & Preferences
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info" size="md">Transparency & Consent</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        How We Use Cookies & Local Storage
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Sheriyakam uses strictly necessary session tokens and minimal analytics to keep your account safe and dispatch technicians reliably across Kerala.
                    </Text>
                </View>

                {/* Preference Control Card */}
                <Card variant="elevated" style={styles.preferenceCard}>
                    <View style={styles.cardHeader}>
                        <Sliders size={20} color={colors.accent} />
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                            Manage Your Preferences
                        </Text>
                    </View>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                        Customize the data and cookies stored on your device. Strictly necessary cookies cannot be disabled as they are required for account security and service booking.
                    </Text>

                    {/* Strictly Necessary */}
                    <View style={[styles.toggleRow, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Strictly Necessary</Text>
                                <Badge variant="success" size="sm">Always Active</Badge>
                            </View>
                            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                                Session tokens, authentication state, cart persistence, and CSRF protection.
                            </Text>
                        </View>
                        <Switch value={true} disabled={true} trackColor={{ true: colors.accent, false: '#71717A' }} />
                    </View>

                    {/* Functional */}
                    <View style={[styles.toggleRow, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Functional & Location</Text>
                            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                                Remembers your selected Kerala taluk / district and theme preferences (Dark / Light mode).
                            </Text>
                        </View>
                        <Switch 
                            value={functionalCookies} 
                            onValueChange={setFunctionalCookies} 
                            trackColor={{ true: colors.accent, false: '#71717A' }} 
                        />
                    </View>

                    {/* Analytics */}
                    <View style={[styles.toggleRow, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Performance & Analytics</Text>
                            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                                Anonymized page load metrics and error telemetry to optimize booking speed.
                            </Text>
                        </View>
                        <Switch 
                            value={analyticsCookies} 
                            onValueChange={setAnalyticsCookies} 
                            trackColor={{ true: colors.accent, false: '#71717A' }} 
                        />
                    </View>

                    {/* Marketing */}
                    <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Personalized Offers</Text>
                            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                                Seasonal service discounts and monsoon electrical safety advisories.
                            </Text>
                        </View>
                        <Switch 
                            value={marketingCookies} 
                            onValueChange={setMarketingCookies} 
                            trackColor={{ true: colors.accent, false: '#71717A' }} 
                        />
                    </View>

                    <Button variant="primary" style={{ marginTop: 12 }} onPress={handleSavePreferences}>
                        Save Cookie Preferences
                    </Button>
                </Card>

                {/* What is a Cookie? */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. What are Cookies & Local Storage?</Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Cookies and browser storage mechanisms (AsyncStorage / LocalStorage) are small text files placed on your device. They allow Sheriyakam to recognize your device, maintain active user sessions, calculate distance to nearby electricians, and keep track of items in your repair cart without requiring you to re-authenticate on every page refresh.
                    </Text>
                </View>

                {/* Third Party Services */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. Third-Party Integrations</Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        Sheriyakam works with trusted infrastructure partners for secure operation:
                        {'\n'}• <Text style={{ fontWeight: '700' }}>Supabase / Firebase Auth:</Text> Used solely for JWT authentication tokens and secure login sessions.
                        {'\n'}• <Text style={{ fontWeight: '700' }}>Mappls / MapMyIndia / OSM:</Text> Cached map tiles and GPS coordinates for technician dispatch.
                        {'\n'}• We do <Text style={{ fontWeight: '700' }}>NOT</Text> sell, rent, or trade your cookie data to third-party ad networks.
                    </Text>
                </View>

                {/* Contact */}
                <Card variant="outline" style={styles.contactCard}>
                    <Info size={20} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
                            Questions Regarding Cookies?
                        </Text>
                        <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                            Contact our Privacy & Data Protection Officer at privacy@sheriyakam.com
                        </Text>
                    </View>
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
    preferenceCard: {
        padding: 20,
        marginVertical: 16,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    cardDesc: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    toggleTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    toggleDesc: {
        fontSize: 12,
        lineHeight: 16,
    },
    section: {
        marginBottom: 20,
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
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        marginTop: 10,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    contactText: {
        fontSize: 12,
        marginTop: 2,
    },
});
