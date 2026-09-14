import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Eye, Clock, AlertTriangle, CheckCircle, Flame, Layers } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function RecruiterViewSimulator({ colors, isDark, userToast }) {
    const [isSimulating, setIsSimulating] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(6);
    const [showHeatmap, setShowHeatmap] = useState(true);

    const heatmapZones = [
        { zone: '1. Candidate Name & Target Title', gazePct: '38%', duration: '2.3s', intensity: '#EF4444', note: 'First eye-fixation point in F-pattern scan' },
        { zone: '2. Lead Bullet (32% Bottleneck Metric)', gazePct: '42%', duration: '2.5s', intensity: '#F59E0B', note: 'Immediate numerical anchor confirms high competency' },
        { zone: '3. Core Skills Keyword Index', gazePct: '12%', duration: '0.7s', intensity: '#3B82F6', note: 'Fast horizontal glance across bolded tokens' },
        { zone: '4. Education & Earlier Experience', gazePct: '8%', duration: '0.5s', intensity: '#64748B', note: 'Secondary peripheral check before decision' }
    ];

    const warnings = [
        {
            type: 'warning',
            title: 'Credential Placement Notice',
            text: 'Your PMP & Six Sigma certifications are positioned 520px below top fold. Moving them to the header badge ensures they are seen in the first 2 seconds.'
        },
        {
            type: 'success',
            title: 'High Numerical Density Pass',
            text: 'Your lead bullet features 3 verified numerical anchors ("14 specialists", "4 continents", "32% reduction"), preventing eye drop-off.'
        },
        {
            type: 'tip',
            title: 'Bullet Length Safe Zone',
            text: 'All top-fold bullets are under 2.5 lines, avoiding the recruiter skim fatigue penalty.'
        }
    ];

    const runSimulation = () => {
        setIsSimulating(true);
        setSecondsLeft(6);
        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsSimulating(false);
                    userToast?.success?.('6-Second Skim Simulation Complete! Recruiter engagement score: 94/100');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
                    <Eye size={18} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            3. Recruiter-View Simulator (6-Second Skim Heatmap)
                        </Text>
                        <Badge variant="warning" size="sm">FREE SCAN · ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Human recruiters spend an average of 6 seconds scanning a resume. See the exact F-pattern eye-tracking heatmap and uncover information buried below the fold.
                    </Text>
                </View>
            </View>

            {/* Simulation Trigger Bar */}
            <View style={[styles.simBar, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Flame size={16} color="#EF4444" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>
                        {isSimulating ? `Simulating Recruiter Eye Scan... ${secondsLeft}s remaining` : 'Recruiter Eye-Tracking Calibration'}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, showHeatmap && styles.toggleBtnActive]}
                        onPress={() => setShowHeatmap(!showHeatmap)}
                    >
                        <Text style={[styles.toggleBtnText, showHeatmap && { color: '#FFFFFF' }]}>
                            {showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}
                        </Text>
                    </TouchableOpacity>
                    <Button
                        variant="primary"
                        size="sm"
                        iconLeft={Clock}
                        onPress={runSimulation}
                        disabled={isSimulating}
                        style={{ backgroundColor: '#F59E0B' }}
                    >
                        {isSimulating ? `Scanning (${secondsLeft}s)` : 'Run 6-Second Skim'}
                    </Button>
                </View>
            </View>

            {/* Heatmap Attention Breakdown */}
            <View style={styles.zoneGrid}>
                {heatmapZones.map((zone, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.zoneCard,
                            { backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                        ]}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={[styles.zoneName, { color: colors.textPrimary }]}>{zone.zone}</Text>
                            <View style={[styles.intensityPill, { backgroundColor: zone.intensity }]}>
                                <Text style={styles.intensityText}>{zone.gazePct} ({zone.duration})</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 15 }}>{zone.note}</Text>
                    </View>
                ))}
            </View>

            {/* Actionable Placement Warnings */}
            <View style={{ marginTop: 12, gap: 8 }}>
                {warnings.map((w, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.warnRow,
                            w.type === 'warning' ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } :
                            w.type === 'success' ? { backgroundColor: '#ECFDF5', borderColor: '#10B981' } :
                            { backgroundColor: isDark ? '#141E2E' : '#F1F5F9', borderColor: isDark ? '#1E293B' : '#CBD5E1' }
                        ]}
                    >
                        {w.type === 'warning' ? <AlertTriangle size={15} color="#D97706" /> :
                         w.type === 'success' ? <CheckCircle size={15} color="#10B981" /> :
                         <Layers size={15} color="#3B82F6" />}
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#0F172A' }}>{w.title}</Text>
                            <Text style={{ fontSize: 11, color: '#334155', marginTop: 2, lineHeight: 15 }}>{w.text}</Text>
                        </View>
                    </View>
                ))}
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
    simBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8
    },
    toggleBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: '#E2E8F0'
    },
    toggleBtnActive: {
        backgroundColor: '#EF4444'
    },
    toggleBtnText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#0F172A'
    },
    zoneGrid: {
        gap: 8
    },
    zoneCard: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1
    },
    zoneName: {
        fontSize: 12,
        fontWeight: '700'
    },
    intensityPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    intensityText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800'
    },
    warnRow: {
        flexDirection: 'row',
        gap: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'flex-start'
    }
});
