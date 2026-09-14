import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Sparkles, Flame, ArrowRight, User } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';
import { useRouter } from 'expo-router';

interface HeroSectionProps {
    onTailorResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTailorResume }) => {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={styles.container}>
            {/* Eyebrow and Product Hunt Badge */}
            <View style={styles.eyebrowRow}>
                <View style={[styles.eyebrowPill, { backgroundColor: '#10B98115', borderColor: '#10B98130' }]}>
                    <Sparkles size={12} color="#10B981" />
                    <Text style={styles.eyebrowText}>RESUME SCORING & TAILORING</Text>
                </View>

                <TouchableOpacity
                    style={styles.phBadge}
                    onPress={() => {
                        if (Platform.OS === 'web' && typeof window !== 'undefined') {
                            window.open('https://www.producthunt.com', '_blank');
                        }
                    }}
                    accessibilityRole="link"
                    accessibilityLabel="Featured on Product Hunt"
                >
                    <Flame size={12} color="#FF6154" />
                    <Text style={styles.phBadgeText}>Featured on Product Hunt ↗</Text>
                </TouchableOpacity>
            </View>

            {/* Headline */}
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                Tailor your best resume for every single job.
            </Text>

            {/* Subheadline */}
            <Text style={[styles.subheadline, { color: colors.textSecondary }]}>
                More interview calls through honest AI scoring & tailoring per job description. Beat the ATS filter without lying or manual hours.
            </Text>

            {/* Trust Line */}
            <View style={[styles.trustBox, { backgroundColor: isDark ? '#101B2B' : '#ECFDF5', borderColor: '#10B98140' }]}>
                <Text style={styles.trustText}>
                    ✓ It only ever rewrites experience you already have. It never invents any.
                </Text>
            </View>

            {/* Dual CTAs */}
            <View style={styles.ctaRow}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={onTailorResume}
                    accessibilityRole="button"
                    accessibilityLabel="Tailor my resume"
                >
                    <Text style={styles.primaryBtnText}>Tailor my resume</Text>
                    <ArrowRight size={14} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
                    onPress={() => router.push('/auth/login')}
                    accessibilityRole="button"
                    accessibilityLabel="I have an account, sign in"
                >
                    <User size={14} color={colors.textPrimary} />
                    <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>I have an account</Text>
                </TouchableOpacity>
            </View>

            {/* Microcopy */}
            <Text style={styles.microcopy}>
                No credit card · 5 free ATS checks every 5 hours · Refills automatically
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 8,
        paddingHorizontal: 4,
        gap: 10
    },
    eyebrowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    eyebrowPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1
    },
    eyebrowText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 0.5
    },
    phBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#FF615415',
        borderWidth: 1,
        borderColor: '#FF615440'
    },
    phBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FF6154'
    },
    headline: {
        fontSize: 26,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: -0.5,
        maxWidth: 580,
        lineHeight: 32
    },
    subheadline: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 520,
        lineHeight: 20
    },
    trustBox: {
        marginTop: 4,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1
    },
    trustText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#10B981',
        textAlign: 'center'
    },
    ctaRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    primaryBtn: {
        backgroundColor: '#10B981',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800'
    },
    secondaryBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    secondaryBtnText: {
        fontSize: 13,
        fontWeight: '700'
    },
    microcopy: {
        fontSize: 11.5,
        color: '#64748B',
        marginTop: 2,
        textAlign: 'center'
    }
});
