import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/theme';

interface DemoWidgetProps {
    onOpenBuilder?: () => void;
}

export const DemoWidget: React.FC<DemoWidgetProps> = ({ onOpenBuilder }) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    // State machine: 4 steps: 'paste' (1) -> 'gap' (2) -> 'tailor' (3) -> 'score' (4)
    const [currentStep, setCurrentStep] = useState<number>(4);
    const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

    // Auto-advance timer: 3.5s per step
    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrentStep(prev => (prev >= 4 ? 1 : prev + 1));
        }, 3500);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const handleStepClick = (step: number) => {
        setCurrentStep(step);
        setIsAutoPlaying(false); // Pause auto-advance on user interaction
    };

    return (
        <View style={[styles.card, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: '#10B981' }]}>
            {/* Header Status Row */}
            <View style={styles.headerRow}>
                <View style={styles.badgeRow}>
                    <View style={styles.conversionBadge}>
                        <Text style={styles.conversionBadgeText}>LIVE CONVERSION DEMO</Text>
                    </View>
                    <Text style={styles.stateLabel}>
                        {currentStep === 1 && 'Step 1: Raw Job Description Input'}
                        {currentStep === 2 && 'Step 2: ATS Keyword Gap Audit'}
                        {currentStep === 3 && 'Step 3: Anti-Fabrication Rewriting'}
                        {currentStep === 4 && 'Tailored resume ready'}
                    </Text>
                </View>

                {/* Score BEFORE -> AFTER */}
                <View style={[styles.scorePill, { backgroundColor: isDark ? '#101F1B' : '#ECFDF5' }]}>
                    <Text style={styles.scoreLabel}>ATS Match Score:</Text>
                    <Text style={[styles.scoreOld, currentStep === 4 && styles.scoreStrikethrough]}>
                        54
                    </Text>
                    <Text style={styles.scoreNew}>
                        → {currentStep === 4 ? '98' : currentStep === 3 ? '82' : currentStep === 2 ? '54' : '54'}/100
                    </Text>
                    {currentStep === 4 && (
                        <View style={styles.climbBadge}>
                            <Text style={styles.climbText}>+44 pts</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* STEP 1: Paste the job */}
            <View style={[styles.jobBox, { backgroundColor: isDark ? '#141E2E' : '#F1F5F9' }]}>
                <View style={styles.jobBoxHeader}>
                    <Text style={styles.jobBoxLabel}>Target role — pasted from careers page</Text>
                    <Text style={[styles.jobBoxBadge, { color: colors.textPrimary }]}>
                        Senior Frontend Engineer · Northwind Labs
                    </Text>
                </View>
                <Text style={[styles.jobDescText, { color: colors.textSecondary }]}>
                    "Northwind Labs is seeking a Senior Frontend Engineer proficient in React, TypeScript, Redux Toolkit, and Next.js. You will architect accessible WCAG web platforms, optimize Core Web Vitals to 95+, build automated CI/CD staging pipelines, and lead agile sprint delivery."
                </Text>
            </View>

            {/* STEP 2: See the gap (Matched vs Missing Keywords) */}
            <View style={styles.keywordSection}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Keyword Gap Analysis (Recruiter Search Filters):
                </Text>

                <View style={styles.keywordColumns}>
                    {/* Matched Column */}
                    <View style={styles.keywordCol}>
                        <Text style={styles.colHeaderSuccess}>✓ Already Matched (Green):</Text>
                        <View style={styles.pillWrap}>
                            {['React 19', 'TypeScript', 'Git', 'Agile / Scrum', 'REST APIs'].map((kw, i) => (
                                <View key={i} style={[styles.pill, styles.pillSuccess, { backgroundColor: isDark ? '#064E3B' : '#D1FAE5' }]}>
                                    <Check size={10} color="#10B981" />
                                    <Text style={[styles.pillText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>{kw}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Missing Column */}
                    <View style={styles.keywordCol}>
                        <Text style={styles.colHeaderWarning}>
                            {currentStep >= 3 ? '✓ Now Incorporated (Refined):' : '⚠ Missing from Untailored CV:'}
                        </Text>
                        <View style={styles.pillWrap}>
                            {['Next.js SSR', 'Redux Toolkit', 'CI/CD Pipelines', 'Core Web Vitals', 'WCAG 2.1 AA'].map((kw, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.pill,
                                        currentStep >= 3 ? styles.pillSuccess : styles.pillMissing,
                                        { backgroundColor: currentStep >= 3 ? (isDark ? '#064E3B' : '#D1FAE5') : (isDark ? '#27272A' : '#F4F4F5') }
                                    ]}
                                >
                                    {currentStep >= 3 ? <Check size={10} color="#10B981" /> : <AlertCircle size={10} color="#EF4444" />}
                                    <Text
                                        style={[
                                            styles.pillText,
                                            { color: currentStep >= 3 ? (isDark ? '#A7F3D0' : '#065F46') : (isDark ? '#D4D4D8' : '#52525B') }
                                        ]}
                                    >
                                        {kw}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            {/* STEP 3 & 4: Tailored Resume Preview */}
            <View style={[styles.resumePreview, { backgroundColor: isDark ? '#0A0F1D' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                {/* Header */}
                <View style={styles.resumeHeader}>
                    <Text style={[styles.candidateName, { color: colors.textPrimary }]}>Arjun Menon</Text>
                    <Text style={styles.candidateTitle}>Senior Frontend Engineer</Text>
                    <Text style={styles.candidateContact}>
                        arjun.menon@example.com · +91 98470 12345 · Kozhikode, Kerala / Remote · linkedin.com/in/arjun-menon
                    </Text>
                </View>

                {/* Experience Bullets Transforming */}
                <View style={styles.bulletsBox}>
                    <Text style={[styles.expHeader, { color: colors.textPrimary }]}>
                        Professional Experience (Apex Logistics Global, 2022 – Present)
                    </Text>

                    {/* Bullet 1 */}
                    <View style={styles.bulletItem}>
                        {currentStep < 3 ? (
                            <Text style={styles.oldBulletText}>
                                • Worked on company web pages using React and helped with staging builds.
                            </Text>
                        ) : (
                            <Text style={[styles.newBulletText, { color: colors.textSecondary }]}>
                                • Architected high-concurrency <Text style={styles.boldKw}>React & Next.js</Text> frontend architectures, cutting bundle size by 38% and driving <Text style={styles.boldKw}>Core Web Vitals</Text> to 98+ for 2.4M monthly users.
                            </Text>
                        )}
                    </View>

                    {/* Bullet 2 */}
                    <View style={styles.bulletItem}>
                        {currentStep < 3 ? (
                            <Text style={styles.oldBulletText}>
                                • Fixed frontend state bugs across various components in our app.
                            </Text>
                        ) : (
                            <Text style={[styles.newBulletText, { color: colors.textSecondary }]}>
                                • Engineered strict <Text style={styles.boldKw}>TypeScript</Text> design system components with <Text style={styles.boldKw}>Redux Toolkit</Text>, compliant with <Text style={styles.boldKw}>WCAG 2.1 AA</Text> accessibility standards.
                            </Text>
                        )}
                    </View>

                    {/* Bullet 3 */}
                    <View style={styles.bulletItem}>
                        {currentStep < 3 ? (
                            <Text style={styles.oldBulletText}>
                                • Assisted with deployment releases using scripts.
                            </Text>
                        ) : (
                            <Text style={[styles.newBulletText, { color: colors.textSecondary }]}>
                                • Implemented GitHub Actions <Text style={styles.boldKw}>CI/CD automated pipelines</Text>, accelerating release cadence by 4.2x with zero deployment regressions.
                            </Text>
                        )}
                    </View>
                </View>

                {/* Skills Line */}
                <View style={[styles.skillsLine, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <Text style={[styles.skillsText, { color: colors.textPrimary }]}>
                        Core Competencies: <Text style={{ fontWeight: '500', color: colors.textSecondary }}>React 19, TypeScript, Next.js, Redux Toolkit, CI/CD, Core Web Vitals, WCAG Accessibility, Jest, Git, Agile/Scrum.</Text>
                    </Text>
                </View>
            </View>

            {/* Persistent 4-Step Indicator Footer */}
            <View style={[styles.footerControls, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={styles.stepButtonsRow}>
                    {[
                        { step: 1, label: '1 Paste the job' },
                        { step: 2, label: '2 See the gap' },
                        { step: 3, label: '3 Tailor it' },
                        { step: 4, label: '4 Score climbs' }
                    ].map((s) => (
                        <TouchableOpacity
                            key={s.step}
                            style={[
                                styles.stepBtn,
                                currentStep === s.step ? styles.stepBtnActive : styles.stepBtnInactive,
                                { backgroundColor: currentStep === s.step ? '#10B981' : (isDark ? '#141E2E' : '#F1F5F9') }
                            ]}
                            onPress={() => handleStepClick(s.step)}
                            accessibilityRole="button"
                            accessibilityLabel={s.label}
                        >
                            <Text style={[styles.stepBtnText, { color: currentStep === s.step ? '#FFFFFF' : colors.textPrimary }]}>
                                {s.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Status and Disclaimer */}
                <View style={styles.footerSubRow}>
                    <Text style={styles.stepStatusText}>
                        Currently showing step {currentStep} of 4 · {isAutoPlaying ? 'Auto-playing' : 'Interactive mode'}
                    </Text>
                    <Text style={styles.disclaimerText}>
                        Sample data · your results depend on your experience
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1.5,
        padding: 16,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    conversionBadge: {
        backgroundColor: 'rgba(16,185,129,0.18)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4
    },
    conversionBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#10B981'
    },
    stateLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#10B981'
    },
    scorePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#10B981'
    },
    scoreLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B'
    },
    scoreOld: {
        fontSize: 13,
        fontWeight: '900',
        color: '#EF4444'
    },
    scoreStrikethrough: {
        textDecorationLine: 'line-through'
    },
    scoreNew: {
        fontSize: 13,
        fontWeight: '900',
        color: '#10B981'
    },
    climbBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10
    },
    climbText: {
        fontSize: 9.5,
        fontWeight: '800',
        color: '#FFFFFF'
    },
    jobBox: {
        padding: 12,
        borderRadius: 8,
        gap: 4
    },
    jobBoxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4
    },
    jobBoxLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#10B981',
        textTransform: 'uppercase'
    },
    jobBoxBadge: {
        fontSize: 11,
        fontWeight: '700'
    },
    jobDescText: {
        fontSize: 11.5,
        lineHeight: 17
    },
    keywordSection: {
        gap: 8
    },
    sectionTitle: {
        fontSize: 11.5,
        fontWeight: '800'
    },
    keywordColumns: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap'
    },
    keywordCol: {
        flex: 1,
        minWidth: 160,
        gap: 6
    },
    colHeaderSuccess: {
        fontSize: 10.5,
        fontWeight: '800',
        color: '#10B981'
    },
    colHeaderWarning: {
        fontSize: 10.5,
        fontWeight: '800',
        color: '#F59E0B'
    },
    pillWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1
    },
    pillSuccess: {
        borderColor: '#10B981'
    },
    pillMissing: {
        borderColor: '#CBD5E1'
    },
    pillText: {
        fontSize: 10,
        fontWeight: '700'
    },
    resumePreview: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10
    },
    resumeHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.15)',
        paddingBottom: 6
    },
    candidateName: {
        fontSize: 15,
        fontWeight: '900'
    },
    candidateTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#10B981'
    },
    candidateContact: {
        fontSize: 10.5,
        color: '#64748B',
        marginTop: 2
    },
    bulletsBox: {
        gap: 6
    },
    expHeader: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase'
    },
    bulletItem: {
        marginTop: 2
    },
    oldBulletText: {
        fontSize: 11,
        color: '#94A3B8',
        lineHeight: 16,
        fontStyle: 'italic'
    },
    newBulletText: {
        fontSize: 11,
        lineHeight: 16
    },
    boldKw: {
        fontWeight: '800',
        color: '#10B981'
    },
    skillsLine: {
        borderTopWidth: 1,
        paddingTop: 6
    },
    skillsText: {
        fontSize: 10.5,
        fontWeight: '800'
    },
    footerControls: {
        borderTopWidth: 1,
        paddingTop: 12,
        gap: 8
    },
    stepButtonsRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap'
    },
    stepBtn: {
        flex: 1,
        minWidth: 105,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 1
    },
    stepBtnActive: {
        borderColor: '#10B981'
    },
    stepBtnInactive: {
        borderColor: 'rgba(150,150,150,0.2)'
    },
    stepBtnText: {
        fontSize: 10.5,
        fontWeight: '800'
    },
    footerSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4
    },
    stepStatusText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#10B981'
    },
    disclaimerText: {
        fontSize: 10,
        color: '#94A3B8',
        fontStyle: 'italic'
    }
});
