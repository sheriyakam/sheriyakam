import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sparkles, SlidersHorizontal, ArrowRight, User } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';
import { useRouter } from 'expo-router';

interface NavBarProps {
    onOpenBuilder?: () => void;
    onOpenLinkedIn?: () => void;
    onOpenTemplates?: () => void;
    activeTab?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
    onOpenBuilder,
    onOpenLinkedIn,
    onOpenTemplates,
    activeTab = 'home'
}) => {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            {/* Logo */}
            <TouchableOpacity
                onPress={() => router.push('/')}
                style={styles.logoRow}
                accessibilityRole="button"
                accessibilityLabel="Sheriyakam Home"
            >
                <View style={styles.logoBadge}>
                    <Sparkles size={15} color="#FFFFFF" />
                </View>
                <View>
                    <Text style={[styles.logoText, { color: colors.textPrimary }]}>
                        Sheriyakam<Text style={{ color: '#10B981' }}>.ai</Text>
                    </Text>
                    <Text style={styles.logoTagline}>Ruvalo-Grade Career Engine</Text>
                </View>
            </TouchableOpacity>

            {/* Desktop Navigation Links */}
            <View style={styles.navLinksRow}>
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={styles.navLinkBtn}
                    accessibilityRole="link"
                >
                    <Text style={[styles.navLinkText, { color: colors.textSecondary }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onOpenTemplates}
                    style={styles.navLinkBtn}
                    accessibilityRole="button"
                >
                    <Text style={[styles.navLinkText, { color: colors.textSecondary }]}>Templates</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onOpenBuilder}
                    style={styles.navLinkBtn}
                    accessibilityRole="button"
                >
                    <Text style={[styles.navLinkText, activeTab === 'builder' ? { color: '#10B981', fontWeight: '800' } : { color: colors.textSecondary }]}>
                        My Resumes
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onOpenLinkedIn}
                    style={styles.navLinkBtn}
                    accessibilityRole="button"
                >
                    <Text style={[styles.navLinkText, activeTab === 'linkedin' ? { color: '#0284C7', fontWeight: '800' } : { color: colors.textSecondary }]}>
                        LinkedIn Optimizer
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/auth/login')}
                    style={styles.navLinkBtn}
                    accessibilityRole="link"
                >
                    <Text style={[styles.navLinkText, { color: colors.textSecondary }]}>Login</Text>
                </TouchableOpacity>

                {/* Primary CTA button: "Tailor my resume" */}
                <TouchableOpacity
                    onPress={onOpenBuilder}
                    style={styles.primaryCtaBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Tailor my resume"
                >
                    <Sparkles size={13} color="#FFFFFF" />
                    <Text style={styles.primaryCtaText}>Tailor my resume</Text>
                </TouchableOpacity>

                {/* Mobile Menu Toggle Button */}
                <TouchableOpacity
                    onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={[styles.hamburgerBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                    accessibilityRole="button"
                    accessibilityLabel="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <SlidersHorizontal size={16} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <View style={[styles.mobileMenuDropdown, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <TouchableOpacity onPress={() => { setMobileMenuOpen(false); router.push('/'); }} style={styles.mobileMenuItem}>
                        <Text style={[styles.mobileMenuText, { color: colors.textPrimary }]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMobileMenuOpen(false); onOpenTemplates && onOpenTemplates(); }} style={styles.mobileMenuItem}>
                        <Text style={[styles.mobileMenuText, { color: colors.textPrimary }]}>Templates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMobileMenuOpen(false); onOpenBuilder && onOpenBuilder(); }} style={styles.mobileMenuItem}>
                        <Text style={[styles.mobileMenuText, { color: '#10B981', fontWeight: '700' }]}>My Resumes (Builder)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMobileMenuOpen(false); onOpenLinkedIn && onOpenLinkedIn(); }} style={styles.mobileMenuItem}>
                        <Text style={[styles.mobileMenuText, { color: '#0284C7', fontWeight: '700' }]}>LinkedIn Optimizer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMobileMenuOpen(false); router.push('/auth/login'); }} style={styles.mobileMenuItem}>
                        <Text style={[styles.mobileMenuText, { color: colors.textPrimary }]}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        zIndex: 50,
        position: 'relative'
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    logoBadge: {
        width: 28,
        height: 28,
        borderRadius: 7,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoText: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: -0.3
    },
    logoTagline: {
        fontSize: 10,
        color: '#64748B'
    },
    navLinksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    navLinkBtn: {
        paddingHorizontal: 8,
        paddingVertical: 6
    },
    navLinkText: {
        fontSize: 12.5,
        fontWeight: '600'
    },
    primaryCtaBtn: {
        backgroundColor: '#10B981',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    primaryCtaText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800'
    },
    hamburgerBtn: {
        padding: 7,
        borderRadius: 6,
        marginLeft: 4
    },
    mobileMenuDropdown: {
        position: 'absolute',
        top: 54,
        left: 16,
        right: 16,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 100
    },
    mobileMenuItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(150,150,150,0.1)'
    },
    mobileMenuText: {
        fontSize: 13,
        fontWeight: '600'
    }
});
