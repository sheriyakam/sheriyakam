import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Mail, Phone, ExternalLink, Shield, Award, Users, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const handleLink = (url) => {
        if (url.startsWith('tel:') || url.startsWith('mailto:')) {
            Linking.openURL(url).catch(err => {
                console.error("Failed to trigger communication link:", err);
                if (Platform.OS === 'web') {
                    window.location.href = url;
                }
            });
            return;
        }

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                if (Platform.OS === 'web') {
                    window.open(url, '_blank');
                } else {
                    Alert.alert("Link Not Supported", `Cannot open link: ${url}`);
                }
            }
        }).catch(err => {
            console.error("Couldn't open URL:", err);
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Brand Hero */}
                <View style={styles.heroSection}>
                    <View style={[styles.logoContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                        <Image source={require('../assets/icon.png')} style={styles.logo} />
                    </View>
                    <View style={styles.nameWrapper}>
                        <Text style={styles.appName}>
                            <Text style={{ color: colors.textPrimary, fontWeight: '800' }}>Sheri</Text>
                            <Text style={{ color: colors.accent, fontWeight: '800' }}>yakam</Text>
                        </Text>
                    </View>
                    <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0 (Build 124)</Text>

                    <View style={[styles.badgeContainer, { 
                        backgroundColor: colors.accent + '15',
                        borderColor: colors.accent + '30',
                    }]}>
                        <CheckCircle size={12} color={colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.accent }]}>Verified Service</Text>
                    </View>
                </View>

                {/* Mission */}
                <View style={[styles.card, { 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Our Mission</Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        Sheriyakam is dedicated to providing the fastest and most reliable diverse electrical services in Kerala. From emergency repairs to complex wiring, we connect you with certified professionals instantly.
                    </Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { value: '15K+', label: 'Bookings', icon: CheckCircle, color: '#10B981' },
                        { value: '250+', label: 'Experts', icon: Users, color: '#2563EB' },
                        { value: '25+', label: 'Years', icon: Award, color: '#F59E0B' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <View key={i} style={[styles.statCard, { 
                                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                            }]}>
                                <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                                    <Icon size={18} color={stat.color} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
                                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Operated By */}
                <View style={[styles.card, styles.highlightCard, {
                    borderColor: colors.accent + '40',
                    backgroundColor: isDark ? 'rgba(37, 99, 235, 0.06)' : 'rgba(37, 99, 235, 0.04)',
                }]}>
                    <Text style={[styles.highlightTitle, { color: colors.textTertiary }]}>POWERED BY</Text>
                    <Text style={[styles.empireText, { color: colors.accent }]}>Empire Electricals</Text>
                    <Text style={[styles.highlightSubText, { color: colors.textSecondary }]}>Trusted Since 1998 • Malabar, Kerala</Text>
                </View>

                {/* Contact */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Us</Text>

                    <TouchableOpacity style={[styles.contactRow, { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
                        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    }]} onPress={() => handleLink('tel:+919876543210')}>
                        <View style={[styles.iconBox, { backgroundColor: colors.accent + '18' }]}>
                            <Phone size={18} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Customer Support</Text>
                            <Text style={[styles.contactValue, { color: colors.textPrimary }]}>+91 98765 43210</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactRow, { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
                        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    }]} onPress={() => handleLink('mailto:support@sheriyakam.com')}>
                        <View style={[styles.iconBox, { backgroundColor: '#10B98118' }]}>
                            <Mail size={18} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Email Us</Text>
                            <Text style={[styles.contactValue, { color: colors.textPrimary }]}>support@sheriyakam.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactRow, { 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
                        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    }]} onPress={() => handleLink('https://sheriyakam.com')}>
                        <View style={[styles.iconBox, { backgroundColor: '#F59E0B18' }]}>
                            <Globe size={18} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.contactLabel, { color: colors.textTertiary }]}>Website</Text>
                            <Text style={[styles.contactValue, { color: colors.textPrimary }]}>www.sheriyakam.com</Text>
                        </View>
                        <ExternalLink size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.aboutFooter}>
                    <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                        © 2026 Sheriyakam. All rights reserved.
                    </Text>
                    <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
                        Made with ❤️ in Kerala
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: SPACING.sm,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    logoContainer: {
        width: 88,
        height: 88,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    logo: {
        width: 72,
        height: 72,
        borderRadius: 18,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    version: {
        fontSize: 13,
        marginBottom: 14,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: SPACING.lg,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 22,
    },

    /* Stats Row */
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 6,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '500',
    },

    highlightCard: {
        alignItems: 'center',
    },
    highlightTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2.5,
        marginBottom: 8,
    },
    empireText: {
        fontSize: 22,
        fontWeight: '900',
        textTransform: 'uppercase',
        marginBottom: 6,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    highlightSubText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    section: {
        marginTop: SPACING.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: SPACING.md,
        letterSpacing: -0.2,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        gap: 14,
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    nameWrapper: {
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 4,
    },

    aboutFooter: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: 4,
    },
    footerText: {
        fontSize: 12,
    },
    footerSubtext: {
        fontSize: 11,
    },
});
