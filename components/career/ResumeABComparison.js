import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Columns, Check, Sparkles, ArrowRight, Download, Award } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ResumeABComparison({ colors, isDark, userToast, onSelectVariant }) {
    const [activeVariant, setActiveVariant] = useState('B'); // 'A' | 'B'

    const variantA = {
        name: 'Variant A: Skills & Tech-Stack First',
        badge: 'TECHNICAL SPECIALIST',
        atsScore: 92,
        keywordCoverage: '94%',
        readability: '88%',
        leadSection: 'Core Competency & Technical Matrix',
        leadSummary: 'Direct technical index of 14 verified competencies placed immediately below contact header. Optimizes for high-frequency keyword scraping algorithms.',
        sampleTopBullet: '• Architected enterprise vendor SLA matrix utilizing Python/SQL analytics to eliminate 32% turnaround delay.',
        pros: ['Highest keyword density', 'Excellent for automated keyword screeners']
    };

    const variantB = {
        name: 'Variant B: Quantified Achievements & Impact First',
        badge: 'EXECUTIVE WINNER · RECOMMENDED',
        atsScore: 96,
        keywordCoverage: '92%',
        readability: '95%',
        leadSection: 'Executive Highlights & Revenue Impact',
        leadSummary: 'Metric-led achievement bullets placed upfront. Optimizes for both automated ATS score and human 6-second executive scan.',
        sampleTopBullet: '• Led cross-functional operations team across 4 continents, engineering revised vendor governance that cut turnaround delays by 32% and preserved $1.4M ARR.',
        pros: ['Proven human recruiter readability', 'Quantified financial & SLA metrics upfront']
    };

    const handleSelect = (variantKey) => {
        setActiveVariant(variantKey);
        const chosen = variantKey === 'A' ? variantA : variantB;
        userToast?.success?.(`Selected ${chosen.name} as primary export version.`);
        if (onSelectVariant) onSelectVariant(variantKey);
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#3B82F620' }]}>
                    <Columns size={18} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            2. Resume A/B Strategy Comparison
                        </Text>
                        <Badge variant="warning" size="sm">LITE & ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Tailor the same target job description using two distinct strategic angles. Compare ATS keyword coverage and recruiter readability side-by-side before exporting.
                    </Text>
                </View>
            </View>

            {/* Side-by-Side Cards Grid */}
            <View style={styles.abGrid}>
                {/* VARIANT A */}
                <View style={[
                    styles.variantCard,
                    activeVariant === 'A' && styles.variantCardActive,
                    { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: activeVariant === 'A' ? '#3B82F6' : (isDark ? '#1E293B' : '#E2E8F0') }
                ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.variantTitle, { color: colors.textPrimary }]}>
                                {variantA.name}
                            </Text>
                            <Badge variant="info" size="sm" style={{ marginTop: 4 }}>{variantA.badge}</Badge>
                        </View>
                        <View style={[styles.scoreBadge, { backgroundColor: '#3B82F6' }]}>
                            <Text style={styles.scoreNumber}>{variantA.atsScore}</Text>
                            <Text style={styles.scoreLabel}>ATS</Text>
                        </View>
                    </View>

                    <Text style={[styles.variantDesc, { color: colors.textSecondary }]}>
                        {variantA.leadSummary}
                    </Text>

                    {/* Metrics row */}
                    <View style={[styles.metricsBox, { backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: colors.textPrimary }]}>{variantA.keywordCoverage}</Text>
                            <Text style={styles.metricLbl}>Keyword Match</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: colors.textPrimary }]}>{variantA.readability}</Text>
                            <Text style={styles.metricLbl}>Readability</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: '#10B981' }]}>Top fold</Text>
                            <Text style={styles.metricLbl}>Skills Matrix</Text>
                        </View>
                    </View>

                    {/* Sample bullet preview */}
                    <View style={[styles.sampleBox, { backgroundColor: isDark ? '#0B1120' : '#F1F5F9' }]}>
                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.textSecondary, marginBottom: 2 }}>Lead Bullet Style:</Text>
                        <Text style={{ fontSize: 11, fontStyle: 'italic', color: colors.textPrimary, lineHeight: 16 }}>{variantA.sampleTopBullet}</Text>
                    </View>

                    <Button
                        variant={activeVariant === 'A' ? 'primary' : 'secondary'}
                        size="sm"
                        iconLeft={activeVariant === 'A' ? Check : undefined}
                        onPress={() => handleSelect('A')}
                        style={activeVariant === 'A' ? { backgroundColor: '#3B82F6', marginTop: 12 } : { marginTop: 12 }}
                    >
                        {activeVariant === 'A' ? 'Active Export Version' : 'Switch to Variant A'}
                    </Button>
                </View>

                {/* VARIANT B */}
                <View style={[
                    styles.variantCard,
                    activeVariant === 'B' && styles.variantCardActive,
                    { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: activeVariant === 'B' ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0') }
                ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.variantTitle, { color: colors.textPrimary }]}>
                                {variantB.name}
                            </Text>
                            <Badge variant="success" size="sm" style={{ marginTop: 4 }}>{variantB.badge}</Badge>
                        </View>
                        <View style={[styles.scoreBadge, { backgroundColor: '#10B981' }]}>
                            <Text style={styles.scoreNumber}>{variantB.atsScore}</Text>
                            <Text style={styles.scoreLabel}>ATS</Text>
                        </View>
                    </View>

                    <Text style={[styles.variantDesc, { color: colors.textSecondary }]}>
                        {variantB.leadSummary}
                    </Text>

                    {/* Metrics row */}
                    <View style={[styles.metricsBox, { backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: colors.textPrimary }]}>{variantB.keywordCoverage}</Text>
                            <Text style={styles.metricLbl}>Keyword Match</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: colors.textPrimary }]}>{variantB.readability}</Text>
                            <Text style={styles.metricLbl}>Readability</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <Text style={[styles.metricVal, { color: '#10B981' }]}>Top fold</Text>
                            <Text style={styles.metricLbl}>Impact Bullets</Text>
                        </View>
                    </View>

                    {/* Sample bullet preview */}
                    <View style={[styles.sampleBox, { backgroundColor: isDark ? '#0B1120' : '#F1F5F9' }]}>
                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.textSecondary, marginBottom: 2 }}>Lead Bullet Style:</Text>
                        <Text style={{ fontSize: 11, fontStyle: 'italic', color: colors.textPrimary, lineHeight: 16 }}>{variantB.sampleTopBullet}</Text>
                    </View>

                    <Button
                        variant={activeVariant === 'B' ? 'primary' : 'secondary'}
                        size="sm"
                        iconLeft={activeVariant === 'B' ? Check : undefined}
                        onPress={() => handleSelect('B')}
                        style={activeVariant === 'B' ? { backgroundColor: '#10B981', marginTop: 12 } : { marginTop: 12 }}
                    >
                        {activeVariant === 'B' ? 'Active Export Version' : 'Switch to Variant B'}
                    </Button>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12
    },
    headerRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 14
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: '800'
    },
    sub: {
        fontSize: 11.5,
        lineHeight: 16,
        marginTop: 3
    },
    abGrid: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 14
    },
    variantCard: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        borderWidth: 1.5
    },
    variantCardActive: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    variantTitle: {
        fontSize: 13,
        fontWeight: '800'
    },
    variantDesc: {
        fontSize: 11,
        lineHeight: 16,
        marginBottom: 10
    },
    scoreBadge: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scoreNumber: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900'
    },
    scoreLabel: {
        color: '#FFFFFF',
        fontSize: 8.5,
        fontWeight: '700'
    },
    metricsBox: {
        flexDirection: 'row',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        justifyContent: 'space-around'
    },
    metricCol: {
        alignItems: 'center'
    },
    metricVal: {
        fontSize: 12,
        fontWeight: '800'
    },
    metricLbl: {
        fontSize: 9.5,
        color: '#64748B'
    },
    metricDivider: {
        width: 1,
        backgroundColor: '#E2E8F0'
    },
    sampleBox: {
        padding: 8,
        borderRadius: 6
    }
});
