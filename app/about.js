import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Mail, Phone, ExternalLink } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const handleLink = (url) => {
        // Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        alert(`Opening ${url}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About App</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Brand Hero */}
                <View style={styles.heroSection}>
                    <Image source={require('../assets/icon.png')} style={styles.logo} />
                    <View style={[
                        styles.nameWrapper,
                        theme === 'dark' && styles.nameWrapperDark
                    ]}>
                        <Text style={styles.appName}>
                            <Text style={{ color: '#001F3F' }}>Sheri</Text>
                            <Text style={{ color: '#2563EB' }}>yakam</Text>
                        </Text>
                    </View>
                    <Text style={styles.version}>Version 1.0.0 (Build 124)</Text>

                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>Verified Service</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Our Mission</Text>
                    <Text style={styles.cardText}>
                        Sheriyakam is dedicated to providing the fastest and most reliable diverse electrical services in Kerala. From emergency repairs to complex wiring, we connect you with certified professionals instantly.
                    </Text>
                </View>

                {/* Operated By */}
                <View style={[styles.card, styles.highlightCard]}>
                    <Text style={styles.highlightTitle}>POWERED BY</Text>
                    <Text style={styles.empireText}>Empire Electricals</Text>
                    <Text style={styles.highlightSubText}>Since 1998</Text>
                </View>

                {/* Contact */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('tel:+919876543210')}>
                        <View style={styles.iconBox}>
                            <Phone size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Customer Support</Text>
                            <Text style={styles.contactValue}>+91 98765 43210</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('mailto:support@sheriyakam.com')}>
                        <View style={styles.iconBox}>
                            <Mail size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Email Us</Text>
                            <Text style={styles.contactValue}>support@sheriyakam.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('https://sheriyakam.com')}>
                        <View style={styles.iconBox}>
                            <Globe size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Website</Text>
                            <Text style={styles.contactValue}>www.sheriyakam.com</Text>
                        </View>
                        <ExternalLink size={16} color={COLORS.textTertiary} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: SPACING.md,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    version: {
        color: COLORS.textTertiary,
        fontSize: 14,
        marginBottom: 16,
    },
    badgeContainer: {
        backgroundColor: 'rgba(41, 182, 246, 0.1)', // blue tint
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(41, 182, 246, 0.3)',
    },
    badgeText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    highlightCard: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(255, 215, 0, 0.05)', // Gold tint
    },
    highlightTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    empireText: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.accent,
        textTransform: 'uppercase',
        marginBottom: 4,
        textAlign: 'center',
    },
    highlightSubText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    section: {
        marginTop: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    contactLabel: {
        fontSize: 12,
        color: COLORS.textTertiary,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    nameWrapper: {
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 4,
    },
    nameWrapperDark: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
});
