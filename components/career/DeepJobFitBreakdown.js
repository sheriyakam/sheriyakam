import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Target, CheckCircle2, ChevronRight, ShieldCheck, MapPin, Building, Award, Wrench } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export default function DeepJobFitBreakdown({ colors, isDark, userToast }) {
    const [expandedDim, setExpandedDim] = useState(null);

    const fitData = {
        overallScore: 91,
        dimensions: [
            {
                id: 'seniority',
                name: 'Seniority & Leadership Scope',
                score: 94,
                icon: Award,
                status: 'Excellent Match',
                color: '#10B981',
                analysis: '6+ years leading cross-functional teams of 14 specialists cleanly matches the Senior / Director requirement without under-qualification.',
                recommendation: 'Highlight team budget approvals and executive steering committee presentations.'
            },
            {
                id: 'industry',
                name: 'Industry & Domain Nuances',
                score: 86,
                icon: Building,
                status: 'Strong Match',
                color: '#3B82F6',
                analysis: 'Enterprise logistics, SLA governance, and vendor contracting verified; minor gap in domain-specific healthcare/fintech terminology.',
                recommendation: 'Add standard enterprise compliance terms (e.g. ISO/SOC2 or vendor audit governance) to the summary.'
            },
            {
                id: 'location',
                name: 'Location & Work-Mode Fit',
                score: 100,
                icon: MapPin,
                status: 'Perfect Alignment',
                color: '#10B981',
                analysis: 'Candidate profile indicates Hybrid / Remote availability in compatible time zones with no relocation delays.',
                recommendation: 'Specify "Available for immediate hybrid schedule" in the contact sub-header.'
            },
            {
                id: 'technical',
                name: 'Technical Stack & Hard Skills',
                score: 90,
                icon: Wrench,
                status: 'Passes Screener',
                color: '#10B981',
                analysis: 'PMP methodologies, Six Sigma Lean, and SLA matrix engineering matched. 9 of 10 core JD hard competencies verified.',
                recommendation: 'Confirm Process Automation tools (e.g. Zapier, Jira Automation, Python scripts) in the technical matrix.'
            }
        ]
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#8B5CF620' }]}>
                    <Target size={18} color="#8B5CF6" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            4. Multi-Dimensional Job Fit (Beyond Keywords)
                        </Text>
                        <Badge variant="success" size="sm">4-D FIT</Badge>
                        <Badge variant="warning" size="sm">FREE PREVIEW · ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Recruiters reject resumes that match keywords but fail on seniority, industry nuance, or location. Score all 4 independent dimensions before applying.
                    </Text>
                </View>
            </View>

            {/* Overall Weighted Fit Card */}
            <View style={[styles.overallBox, { backgroundColor: isDark ? '#141E2E' : '#F5F3FF', borderColor: '#8B5CF640' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#8B5CF6' }}>COMPREHENSIVE FIT INDEX</Text>
                        <Text style={[styles.overallScoreText, { color: colors.textPrimary }]}>
                            {fitData.overallScore}% Qualified Match
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                            Passing threshold for recruiter outreach: 80%+
                        </Text>
                    </View>
                    <View style={[styles.scoreBadge, { backgroundColor: '#8B5CF6' }]}>
                        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900' }}>{fitData.overallScore}</Text>
                    </View>
                </View>
            </View>

            {/* 4 Dimension Progress Bars */}
            <View style={{ marginTop: 12, gap: 10 }}>
                {fitData.dimensions.map((dim) => {
                    const Icon = dim.icon;
                    const isOpen = expandedDim === dim.id;
                    return (
                        <TouchableOpacity
                            key={dim.id}
                            style={[
                                styles.dimCard,
                                { backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                            ]}
                            onPress={() => setExpandedDim(isOpen ? null : dim.id)}
                            activeOpacity={0.8}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Icon size={14} color={dim.color} />
                                    <Text style={[styles.dimName, { color: colors.textPrimary }]}>{dim.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={[styles.dimScore, { color: dim.color }]}>{dim.score}%</Text>
                                    <Badge variant={dim.score >= 90 ? 'success' : 'info'} size="sm">{dim.status}</Badge>
                                </View>
                            </View>

                            {/* Progress bar line */}
                            <View style={styles.progTrack}>
                                <View style={[styles.progFill, { width: `${dim.score}%`, backgroundColor: dim.color }]} />
                            </View>

                            {/* Expanded Explanation */}
                            {isOpen && (
                                <View style={[styles.dimDetails, { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                                    <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                                        {dim.analysis}
                                    </Text>
                                    <View style={{ marginTop: 6, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#10B981' }}>💡 Recommended Fix:</Text>
                                        <Text style={{ fontSize: 10.5, color: colors.textPrimary, flex: 1 }}>{dim.recommendation}</Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
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
    overallBox: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    overallScoreText: {
        fontSize: 18,
        fontWeight: '900',
        marginVertical: 2
    },
    scoreBadge: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dimCard: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1
    },
    dimName: {
        fontSize: 12,
        fontWeight: '700'
    },
    dimScore: {
        fontSize: 12,
        fontWeight: '800'
    },
    progTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
        overflow: 'hidden'
    },
    progFill: {
        height: '100%',
        borderRadius: 3
    },
    dimDetails: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1
    }
});
