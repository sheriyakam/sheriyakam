import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';

export interface FAQItem {
    q: string;
    a: string;
}

export const RUVALO_FAQS: FAQItem[] = [
    {
        q: "Will it put things on my resume that aren't true?",
        a: "Never. Sheriyakam operates under an uncompromising Anti-Fabrication Guarantee. Our AI functions strictly as a phrasing editor and vocabulary translator, mapping your authentic work history to the exact terminology used by recruiters. It will never hallucinate jobs, companies, degrees, or certifications you never held. If a job listing requires a skill not in your base profile, our Honesty Guardrail explicitly asks you to verify your genuine capability before incorporating it."
    },
    {
        q: "What actually is an ATS score?",
        a: "An Applicant Tracking System (ATS) score measures how closely your resume matches the keyword parameters, structural hierarchy, and skill thresholds configured by recruiters in systems like Workday, Greenhouse, Taleo, and Lever. A score above 85 means your experience strongly aligns with the hiring manager's primary search filters."
    },
    {
        q: "What do I get without paying?",
        a: "Our Free Tier gives you 5 free ATS score audits every 5 hours, 3 tailored resume generation passes every 5 hours, 5 tailored cover letters every 5 hours, 15 AI bullet refinements per day, 1 permanent Base Resume, and unlimited text-selectable single-color vector PDF exports. There are zero credit card requirements and no expiring trials."
    },
    {
        q: "What happens when I run out?",
        a: "Your free tier credits refill automatically on a rolling 5-hour timer without you needing to do anything. If you are applying to dozens of roles in a single session and don't want to wait for the 5-hour refill, you can purchase an affordable 30-day pack (Lite at $2 / ₹169 or Active Search at $5 / ₹419) with one-time payment and zero auto-renewing subscriptions."
    },
    {
        q: "Do I need to rewrite my resume from scratch?",
        a: "No. You simply paste or upload your existing resume once into the Base Profile. The AI preserves your authentic master resume permanently, and creates lightweight, role-specific versions tailored to each individual target job description."
    },
    {
        q: "Can it write the cover letter too?",
        a: "Yes. For every tailored resume pass, Sheriyakam generates a matching, high-conversion cover letter that addresses the specific hiring manager, references the company's stated mission, and connects your verified achievements directly to the role requirements."
    },
    {
        q: "Will the exported PDF survive a resume parser?",
        a: "Guaranteed. Modern ATS parsers frequently choke on multi-column tables, text boxes, background fills, canvas graphics, and non-standard fonts. Sheriyakam exports clean, single-column, text-selectable vector PDFs with semantic header structures that yield 100% data extraction accuracy on Workday, Taleo, and Greenhouse."
    },
    {
        q: "What happens to my resume data?",
        a: "Your data privacy is strictly protected under enterprise-grade zero-retention policies. Inferences are executed in ephemeral volatile memory. We never sell, index, or use your personal career data to train public AI models. You maintain full data portability to export your archive or purge all records at any time."
    }
];

export const FAQSection: React.FC = () => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <Text style={styles.eyebrow}>QUESTIONS</Text>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
                The things people ask before signing up
            </Text>

            <View style={styles.accordionList}>
                {RUVALO_FAQS.map((faq, idx) => {
                    const isOpen = expandedIndex === idx;
                    const contentId = 'faq-content-' + idx;
                    const headerId = 'faq-header-' + idx;

                    return (
                        <View
                            key={idx}
                            style={[
                                styles.itemContainer,
                                { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                            ]}
                        >
                            <TouchableOpacity
                                id={headerId}
                                style={styles.headerBtn}
                                onPress={() => toggleFaq(idx)}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                aria-expanded={isOpen}
                                aria-controls={contentId}
                            >
                                <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                                    {faq.q}
                                </Text>
                                {isOpen ? (
                                    <ChevronUp size={16} color="#10B981" />
                                ) : (
                                    <ChevronDown size={16} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>

                            {isOpen && (
                                <View
                                    id={contentId}
                                    style={[styles.answerBox, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                                    aria-labelledby={headerId}
                                >
                                    <Text style={[styles.answerText, { color: colors.textSecondary }]}>
                                        {faq.a}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })}
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
    accordionList: {
        gap: 8
    },
    itemContainer: {
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden'
    },
    headerBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },
    questionText: {
        fontSize: 12.5,
        fontWeight: '700',
        flex: 1,
        marginRight: 8
    },
    answerBox: {
        borderTopWidth: 1,
        padding: 12
    },
    answerText: {
        fontSize: 11.5,
        lineHeight: 18
    }
});
