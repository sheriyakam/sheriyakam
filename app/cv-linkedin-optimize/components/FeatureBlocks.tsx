import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';

export const FeatureBlocks: React.FC = () => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const features = [
        {
            num: '01',
            title: 'Know the gap before you apply',
            body: 'Paste any target job description and get an instant ATS match score in seconds. See exactly which keywords you have already documented versus what is missing before you hit submit.',
            tag: '5 ATS checks free, refilling every 5 hours',
            tagVariant: 'success'
        },
        {
            num: '02',
            title: "It rewrites. It doesn't invent.",
            body: "Rewords your authentic achievements into the vocabulary of the target role. Ticked skills get woven in with measurable action verbs; unticked skills never appear. Zero hallucination guarantee.",
            tag: 'You confirm every claim',
            tagVariant: 'neutral'
        },
        {
            num: '03',
            title: 'One base resume, a version per role',
            body: 'Every tailored version is saved directly against the job description that produced it. When an employer calls 3 weeks later, reopen that exact version to see what they saw and refine for interviews.',
            tag: 'Versions, not copies',
            tagVariant: 'info'
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <Text style={styles.eyebrow}>WHAT YOU GET</Text>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                Built for the part of the job hunt nobody enjoys
            </Text>

            <View style={styles.cardsGrid}>
                {features.map((f) => (
                    <View
                        key={f.num}
                        style={[
                            styles.featureCard,
                            { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={[styles.featureNum, { color: colors.textPrimary }]}>
                                {f.num}. {f.title}
                            </Text>
                            <View style={[styles.tagBadge, { backgroundColor: f.tagVariant === 'success' ? '#10B98120' : (isDark ? '#1E293B' : '#E2E8F0') }]}>
                                <Text style={[styles.tagText, { color: f.tagVariant === 'success' ? '#10B981' : colors.textPrimary }]}>
                                    {f.tag}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.featureBody, { color: colors.textSecondary }]}>
                            {f.body}
                        </Text>
                    </View>
                ))}
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
    cardsGrid: {
        gap: 10
    },
    featureCard: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6
    },
    featureNum: {
        fontSize: 13.5,
        fontWeight: '800'
    },
    tagBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700'
    },
    featureBody: {
        fontSize: 11.5,
        lineHeight: 17
    }
});
