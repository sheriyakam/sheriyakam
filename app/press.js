import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, Newspaper, ExternalLink, Mail, Zap } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const PRESS_RELEASES = [
    {
        title: 'Sheriyakam Scales On-Demand Electrical Dispatch Across Kozhikode and Malabar Coast',
        outlet: 'The Hindu Tech & Business',
        date: 'July 2026',
        snippet: 'How a Kerala-born startup is eliminating domestic electrical hazards by certifying local licensed contractors with transparent digital rate cards.',
    },
    {
        title: 'Revolutionizing Home Maintenance Safety in South India',
        outlet: 'YourStory Kerala Edition',
        date: 'May 2026',
        snippet: 'Sheriyakam reaches 10,000+ completed household repairs with a 30-minute rapid emergency response guarantee.',
    },
];

export default function PressScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const handleDownloadKit = () => {
        success('Sheriyakam_Media_Kit_2026.zip downloaded!', 'Brand Assets');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Press & Media Kit</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info">Newsroom & Assets</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Press Releases & Brand Resources
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Download high-resolution logos, brand guidelines, and read recent news about Sheriyakam.
                    </Text>
                </View>

                {/* Brand Kit Card */}
                <Card variant="elevated" style={styles.kitCard}>
                    <View style={styles.kitRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.accent + '18' }]}>
                            <Zap size={24} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.kitTitle, { color: colors.textPrimary }]}>
                                Official Media Kit & Assets
                            </Text>
                            <Text style={[styles.kitDesc, { color: colors.textSecondary }]}>
                                Vector SVG logos, dark/light icons, founder headshots, and product screenshots.
                            </Text>
                        </View>
                    </View>

                    <Button
                        variant="primary"
                        size="md"
                        iconLeft={Download}
                        onPress={handleDownloadKit}
                        style={{ alignSelf: 'flex-start', marginTop: 10 }}
                    >
                        Download Media Kit (.ZIP)
                    </Button>
                </Card>

                {/* Press Articles */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    MEDIA COVERAGE & ARTICLES
                </Text>

                <View style={styles.articlesList}>
                    {PRESS_RELEASES.map((art, idx) => (
                        <Card key={idx} variant="default" style={styles.articleCard}>
                            <View style={styles.articleHeader}>
                                <Badge variant="neutral" size="sm">{art.outlet}</Badge>
                                <Text style={[styles.articleDate, { color: colors.textTertiary }]}>{art.date}</Text>
                            </View>

                            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
                                {art.title}
                            </Text>
                            <Text style={[styles.articleSnippet, { color: colors.textSecondary }]}>
                                "{art.snippet}"
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Media Inquiries Contact */}
                <Card variant="default" style={styles.contactCard}>
                    <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
                        Media Inquiries
                    </Text>
                    <Text style={[styles.contactDesc, { color: colors.textSecondary }]}>
                        For interviews, founder commentary, or feature requests, contact our media team:
                    </Text>
                    <Text style={[styles.emailText, { color: colors.accent }]}>
                        press@sheriyakam.com
                    </Text>
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
        maxWidth: 340,
    },
    kitCard: {
        padding: 18,
        marginVertical: 10,
        gap: 8,
    },
    kitRow: {
        flexDirection: 'row',
        gap: 14,
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kitTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    kitDesc: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    articlesList: {
        gap: 10,
    },
    articleCard: {
        padding: 16,
        gap: 8,
    },
    articleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    articleDate: {
        fontSize: 11,
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
    },
    articleSnippet: {
        fontSize: 12,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    contactCard: {
        padding: 16,
        marginTop: 16,
        gap: 6,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    contactDesc: {
        fontSize: 12,
    },
    emailText: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },
});
