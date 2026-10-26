import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';
import { useRouter } from 'expo-router';

export const Footer: React.FC = () => {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    // Swapped district grid for job-category grid
    const JOB_CATEGORIES = [
        'Software Engineering & DevOps',
        'Data Science & Generative AI',
        'Product Management & UI/UX',
        'Healthcare, Nursing & Medical',
        'Finance, Banking & Accounting',
        'Supply Chain & Operations',
        'Kerala PSC & Govt Technical Exams',
        'Sales, Growth & Business Development'
    ];

    return (
        <View style={[styles.container, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            {/* Job-Category Grid (Replacing electrician districts) */}
            <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>SUPPORTED CAREER & ATS DOMAINS</Text>
                <View style={styles.categoryGrid}>
                    {JOB_CATEGORIES.map((cat, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.catPill,
                                { backgroundColor: isDark ? '#141E2E' : '#F1F5F9', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                            ]}
                        >
                            <Text style={[styles.catText, { color: colors.textPrimary }]}>
                                ✓ {cat}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Main Footer Links Row */}
            <View style={styles.linksRow}>
                {/* Logo + Name */}
                <View style={styles.logoRow}>
                    <View style={styles.logoBadge}>
                        <Sparkles size={12} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.logoText, { color: colors.textPrimary }]}>
                        Sheriyakam<Text style={{ color: '#10B981' }}>.ai</Text>
                    </Text>
                </View>

                {/* Policy Links */}
                <View style={styles.navLinks}>
                    <TouchableOpacity onPress={() => router.push('/privacy')} accessibilityRole="link">
                        <Text style={[styles.navText, { color: colors.textSecondary }]}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/terms')} accessibilityRole="link">
                        <Text style={[styles.navText, { color: colors.textSecondary }]}>Terms of Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/refund-policy')} accessibilityRole="link">
                        <Text style={[styles.navText, { color: colors.textSecondary }]}>Refund Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/auth/login')} accessibilityRole="link">
                        <Text style={[styles.navText, { color: colors.textSecondary }]}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/auth/login')} accessibilityRole="link">
                        <Text style={[styles.navText, { color: colors.textSecondary }]}>Create account</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Email */}
                <TouchableOpacity
                    onPress={() => {
                        if (Platform.OS === 'web' && typeof window !== 'undefined') {
                            window.location.href = 'mailto:support@sheriyakam.com';
                        }
                    }}
                    accessibilityRole="link"
                >
                    <Text style={styles.emailText}>support@sheriyakam.com</Text>
                </TouchableOpacity>
            </View>

            {/* Copyright Line */}
            <Text style={styles.copyright}>
                © 2026 Sheriyakam. All rights reserved. Built with strict Anti-Fabrication AI.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 10,
        gap: 16
    },
    categorySection: {
        gap: 8
    },
    categoryTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 0.5
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    catPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1
    },
    catText: {
        fontSize: 10.5,
        fontWeight: '600'
    },
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    logoBadge: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoText: {
        fontSize: 13,
        fontWeight: '800'
    },
    navLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    navText: {
        fontSize: 11
    },
    emailText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '700'
    },
    copyright: {
        fontSize: 10.5,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 4
    }
});
