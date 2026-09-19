import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { CheckCircle2, AlertTriangle, ArrowRight, Shield, Award, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { Badge } from './ui/Badge';

const WORK_PROJECTS = [
    {
        id: 'db-overhaul',
        title: '3-Phase Main Distribution Board Overhaul',
        location: 'Thalassery, Kannur',
        clientType: 'Residential Villa (3,200 sq ft)',
        beforeImage: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=600&auto=format&fit=crop&q=80',
        afterImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        beforeDesc: 'Dangerous tangled wiring with unrated fuses, burning smell, and persistent neutral overheating.',
        afterDesc: 'IP65 distribution box with Schneider C-curve MCBs, Type-A 30mA RCCB, and color-coded copper busbars.',
        slaTime: '2 hrs 15 mins',
        warranty: '90-Day Guarantee'
    },
    {
        id: 'ac-jet-clean',
        title: 'Inverter Split AC Foam Jet Deep Wash',
        location: 'Kakkanad (InfoPark Zone), Kochi',
        clientType: 'IT Professional Residence',
        beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        afterImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
        beforeDesc: 'Cooling coils choked with black fungal mold, causing water dripping and foul damp airflow.',
        afterDesc: 'High-pressure chemical foam rinse with antibacterial spray, restoring rapid 16°C airflow and zero odors.',
        slaTime: '45 mins',
        warranty: '30-Day Warranty'
    },
    {
        id: 'switchboard-modular',
        title: 'Burned 16A Geyser Socket & Plate Restoration',
        location: 'Mavoor Road, Kozhikode',
        clientType: 'Apartment Flat',
        beforeImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        afterImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=600&auto=format&fit=crop&q=80',
        beforeDesc: 'Melted plastic socket from loose terminal resistance, creating imminent electrical fire risk.',
        afterDesc: 'Flame-retardant polycarbonate Roma modular grid with 25A ceramic terminal contacts and tight earthing.',
        slaTime: '30 mins',
        warranty: '30-Day Warranty'
    }
];

export default function WorkGallery() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const [activeProject, setActiveProject] = useState(WORK_PROJECTS[0].id);

    const current = WORK_PROJECTS.find(p => p.id === activeProject) || WORK_PROJECTS[0];

    return (
        <View style={[styles.section, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.headerWrap}>
                <View style={styles.badgeWrap}>
                    <Sparkles size={14} color="#3B82F6" />
                    <Text style={styles.badgeText}>REAL RESTORATIONS ACROSS KERALA</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Verified Work Gallery & Before/After
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    See how our licensed KSELB technicians transform hazard-prone electrical setups into safe, certified systems.
                </Text>
            </View>

            {/* Project Selector Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                {WORK_PROJECTS.map((proj) => {
                    const isSelected = activeProject === proj.id;
                    return (
                        <TouchableOpacity
                            key={proj.id}
                            onPress={() => setActiveProject(proj.id)}
                            style={[
                                styles.pill,
                                isSelected ? {
                                    backgroundColor: colors.accent,
                                    borderColor: colors.accent,
                                } : {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                                }
                            ]}
                        >
                            <Text style={[
                                styles.pillText,
                                { color: isSelected ? '#FFFFFF' : (isDark ? '#D4D4D8' : '#475569') }
                            ]}>
                                {proj.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Active Case Study Card */}
            <View style={[
                styles.caseCard,
                {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                }
            ]}>
                {/* Meta details bar */}
                <View style={styles.metaRow}>
                    <View>
                        <Text style={[styles.projectTitle, { color: colors.textPrimary }]}>{current.title}</Text>
                        <Text style={[styles.projectLocation, { color: colors.textSecondary }]}>
                            📍 {current.location} • {current.clientType}
                        </Text>
                    </View>
                    <View style={styles.slaBadge}>
                        <Award size={13} color="#10B981" />
                        <Text style={styles.slaText}>{current.warranty}</Text>
                    </View>
                </View>

                {/* Before vs After Grid */}
                <View style={[styles.comparisonGrid, isDesktop && styles.comparisonGridDesktop]}>
                    {/* BEFORE */}
                    <View style={[styles.photoCard, { borderColor: '#EF4444' }]}>
                        <View style={styles.photoBannerBefore}>
                            <AlertTriangle size={13} color="#FFFFFF" />
                            <Text style={styles.photoBannerText}>BEFORE REPAIR (HAZARD)</Text>
                        </View>
                        <Image source={{ uri: current.beforeImage }} style={styles.photo} resizeMode="cover" />
                        <View style={styles.photoCaptionWrap}>
                            <Text style={[styles.photoCaption, { color: colors.textSecondary }]}>
                                {current.beforeDesc}
                            </Text>
                        </View>
                    </View>

                    {/* AFTER */}
                    <View style={[styles.photoCard, { borderColor: '#10B981' }]}>
                        <View style={styles.photoBannerAfter}>
                            <CheckCircle2 size={13} color="#FFFFFF" />
                            <Text style={styles.photoBannerText}>AFTER SHERIYAKAM FIX (CERTIFIED)</Text>
                        </View>
                        <Image source={{ uri: current.afterImage }} style={styles.photo} resizeMode="cover" />
                        <View style={styles.photoCaptionWrap}>
                            <Text style={[styles.photoCaption, { color: colors.textSecondary }]}>
                                {current.afterDesc}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: SPACING.xl + 8,
        paddingHorizontal: SPACING.md,
        borderTopWidth: 1,
    },
    headerWrap: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
        gap: 6,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        color: '#3B82F6',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 560,
        lineHeight: 20,
    },
    pillRow: {
        gap: 8,
        paddingBottom: SPACING.md,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '700',
    },
    caseCard: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
        gap: 16,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 8,
    },
    projectTitle: {
        fontSize: 17,
        fontWeight: '800',
    },
    projectLocation: {
        fontSize: 12,
        marginTop: 2,
    },
    slaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    slaText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '700',
    },
    comparisonGrid: {
        gap: 16,
    },
    comparisonGridDesktop: {
        flexDirection: 'row',
        gap: 20,
    },
    photoCard: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 2,
        overflow: 'hidden',
    },
    photoBannerBefore: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    photoBannerAfter: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    photoBannerText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    photo: {
        width: '100%',
        height: 200,
    },
    photoCaptionWrap: {
        padding: 12,
    },
    photoCaption: {
        fontSize: 12,
        lineHeight: 18,
    }
});
