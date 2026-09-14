import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sparkles, LogIn } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';
import { useRouter } from 'expo-router';

interface FinalCTASectionProps {
    onTailorResume: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onTailorResume }) => {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1B17' : '#ECFDF5', borderColor: '#10B981' }]}>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                Find out what one job posting thinks of your resume
            </Text>
            <Text style={[styles.subtext, { color: colors.textSecondary }]}>
                Upload your existing resume, paste a target role, and see your honest keyword gap in under 60 seconds.
            </Text>

            <View style={styles.ctaRow}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={onTailorResume}
                    accessibilityRole="button"
                    accessibilityLabel="Tailor my resume"
                >
                    <Sparkles size={14} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Tailor my resume</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
                    onPress={() => router.push('/auth/login')}
                    accessibilityRole="button"
                    accessibilityLabel="Log in"
                >
                    <LogIn size={14} color={colors.textPrimary} />
                    <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>Log in</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.microcopy}>
                No credit card · 5 free ATS checks every 5 hours · Refills automatically
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1.5,
        padding: 24,
        alignItems: 'center',
        textAlign: 'center',
        gap: 8
    },
    headline: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: -0.3
    },
    subtext: {
        fontSize: 12.5,
        textAlign: 'center',
        maxWidth: 480,
        lineHeight: 18
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
        fontSize: 11,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center'
    }
});
