import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';

export const WhyItWorksSection: React.FC = () => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            {/* Eyebrow & Headline */}
            <Text style={styles.eyebrow}>WHY IT WORKS</Text>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                A strong resume still loses to a better-matched one
            </Text>

            {/* 3 Explainer Blocks */}
            <View style={styles.blocksGrid}>
                {/* Block 1 */}
                <View style={[styles.blockCard, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                        1. Right experience, wrong words
                    </Text>
                    <Text style={[styles.blockBody, { color: colors.textSecondary }]}>
                        Most rejections are phrasing mismatches, not lack of capability. If a job listing searches for "cross-functional stakeholder alignment" and your resume says "collaborated with team leaders", automated ATS filters flag you as an experience gap.
                    </Text>
                </View>

                {/* Block 2 */}
                <View style={[styles.blockCard, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                        2. The listing is the answer key
                    </Text>
                    <Text style={[styles.blockBody, { color: colors.textSecondary }]}>
                        Job descriptions literally contain the exact vocabulary screeners search for. Every requirement, acronym, and responsibility in the job posting is a primary query parameter inside Taleo, Greenhouse, or Workday.
                    </Text>
                </View>

                {/* Block 3 */}
                <View style={[styles.blockCard, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                        3. Doing it by hand doesn't scale
                    </Text>
                    <Text style={[styles.blockBody, { color: colors.textSecondary }]}>
                        Manual tailoring takes ~1 hour per application. Most job seekers burn out around application 5 and revert to spraying generic resumes that get filtered out. AI tailoring completes the alignment in 60 seconds.
                    </Text>
                </View>
            </View>

            {/* 3 Proof-Point Callouts */}
            <View style={styles.proofRow}>
                <View style={[styles.proofCard, { backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderColor: '#10B981' }]}>
                    <Text style={styles.proofTitle}>No card</Text>
                    <Text style={[styles.proofDesc, { color: colors.textSecondary }]}>
                        Start with 5 free ATS checks every 5 hours
                    </Text>
                </View>

                <View style={[styles.proofCard, { backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderColor: '#10B981' }]}>
                    <Text style={styles.proofTitle}>Every version</Text>
                    <Text style={[styles.proofDesc, { color: colors.textSecondary }]}>
                        Saved against the job description that produced it
                    </Text>
                </View>

                <View style={[styles.proofCard, { backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderColor: '#10B981' }]}>
                    <Text style={styles.proofTitle}>One click</Text>
                    <Text style={[styles.proofDesc, { color: colors.textSecondary }]}>
                        To a clean, parseable PDF, text never an image
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 12
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 0.5
    },
    headline: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3
    },
    blocksGrid: {
        gap: 10
    },
    blockCard: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4
    },
    blockTitle: {
        fontSize: 13,
        fontWeight: '800'
    },
    blockBody: {
        fontSize: 11.5,
        lineHeight: 17
    },
    proofRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 4
    },
    proofCard: {
        flex: 1,
        minWidth: 190,
        padding: 10,
        borderRadius: 6,
        borderWidth: 1
    },
    proofTitle: {
        fontSize: 11.5,
        fontWeight: '800',
        color: '#10B981'
    },
    proofDesc: {
        fontSize: 10.5,
        marginTop: 2
    }
});
