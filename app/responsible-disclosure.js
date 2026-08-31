import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Lock, CheckCircle2, AlertTriangle, Bug, Award, Mail } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const SAFE_HARBOR_RULES = [
    { title: 'In-Scope Domains', desc: 'sheriyakam.vercel.app, API routes (/api/*), Supabase/Firebase webhook sync handlers.' },
    { title: 'Safe Harbor Protection', desc: 'We pledge not to pursue legal action against researchers acting in good faith without data destruction or extortion.' },
    { title: 'Response SLA', desc: 'Initial acknowledgment within 24 hours. Triage status within 72 hours. Regular status updates until resolved.' },
    { title: 'Out of Scope', desc: 'DDoS/DoS attacks, physical security of premises, social engineering/phishing of technicians, third-party map APIs.' },
];

export default function ResponsibleDisclosureScreen() {
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
                    Responsible Disclosure
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">Security & Trust</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Vulnerability Disclosure Policy & Safe Harbor
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        We value the security research community. If you discover a security vulnerability in our systems, we encourage you to report it to us immediately.
                    </Text>
                </View>

                {/* Safe Harbor Cards */}
                <View style={styles.ruleList}>
                    {SAFE_HARBOR_RULES.map((rule, idx) => (
                        <Card key={idx} variant="elevated" style={styles.ruleCard}>
                            <Text style={[styles.ruleTitle, { color: colors.textPrimary }]}>
                                {rule.title}
                            </Text>
                            <Text style={[styles.ruleDesc, { color: colors.textSecondary }]}>
                                {rule.desc}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Guidelines */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Research Guidelines</Text>
                    <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                        • Make a good faith effort to avoid privacy violations, destruction of customer data, and interruption of live booking dispatches.
                        {'\n'}• Do not modify or access data that does not belong to you (use your own test accounts).
                        {'\n'}• Give us a reasonable time window to remediate the vulnerability before any public disclosure.
                    </Text>
                </View>

                {/* Reporting Card */}
                <Card variant="outline" style={styles.reportCard}>
                    <Mail size={22} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.reportTitle, { color: colors.textPrimary }]}>
                            How to Report a Security Finding
                        </Text>
                        <Text style={[styles.reportText, { color: colors.textSecondary }]}>
                            Email your technical findings, reproduction steps, and proof of concept (PoC) to security@sheriyakam.com. PGP key available upon request.
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
    ruleList: {
        gap: 12,
        marginVertical: 16,
    },
    ruleCard: {
        padding: 18,
        gap: 6,
    },
    ruleTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    ruleDesc: {
        fontSize: 13,
        lineHeight: 19,
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
    reportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        marginTop: 10,
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    reportText: {
        fontSize: 12.5,
        lineHeight: 18,
        marginTop: 2,
    },
});
