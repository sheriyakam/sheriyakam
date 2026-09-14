import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Layers, Check, Plus, Sparkles, Building, Stethoscope, Briefcase, Landmark } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function IndustryTemplatePacks({ colors, isDark, userToast, onAddKeyword }) {
    const [selectedPack, setSelectedPack] = useState('tech'); // 'tech' | 'healthcare' | 'sales' | 'govt_kerala'

    const packs = [
        {
            id: 'tech',
            name: 'Tech & Software Engineering',
            icon: Sparkles,
            color: '#3B82F6',
            tier: 'FREE PREVIEW · ACTIVE SEARCH',
            layoutStyle: 'Technical Stack Grid + GitHub/LeetCode Header + Architecture Bullets',
            description: 'Optimized for engineering managers and technical recruiters. Highlights system design, cloud scalability, CI/CD, and clean code metrics.',
            keywords: [
                'Microservices Architecture', 'Kubernetes & Docker', 'CI/CD Pipelines', 'Distributed Systems',
                'REST & GraphQL APIs', 'AWS / Cloud Infrastructure', 'Unit & Integration Testing', 'Agile / Scrum'
            ]
        },
        {
            id: 'healthcare',
            name: 'Healthcare & Nursing',
            icon: Stethoscope,
            color: '#EF4444',
            tier: 'LITE & ACTIVE SEARCH',
            layoutStyle: 'Clinical Rotations + Patient-to-Staff Ratio + NABH/JCI Accreditation',
            description: 'Calibrated for hospital clinical directors. Displays verified patient acuity management, emergency response certifications, and NABH compliance.',
            keywords: [
                'BLS / ACLS Certified', 'NABH / JCI Accreditation', 'ICU & Critical Care', 'Patient Acuity Triage',
                'EHR / Meditech Software', 'Infection Control Protocols', 'Clinical Care Governance', 'Medication Administration'
            ]
        },
        {
            id: 'sales',
            name: 'Sales & B2B Business Development',
            icon: Briefcase,
            color: '#10B981',
            tier: 'LITE & ACTIVE SEARCH',
            layoutStyle: 'Quota Attainment Badges + ARR Expansion Pipeline + CAC Reduction Metrics',
            description: 'Built for enterprise sales VP scan. Leads with quota over-performance % (e.g. 138% of quota), outbound deal sizes, and CRM pipeline growth.',
            keywords: [
                'Quota Attainment (120%+)', 'Enterprise Outbound B2B', 'ARR & Pipeline Expansion', 'Salesforce / HubSpot CRM',
                'Contract Negotiation', 'Customer Acquisition Cost (CAC)', 'C-Suite Stakeholder Pitching', 'Account Retention'
            ]
        },
        {
            id: 'govt_kerala',
            name: 'Kerala Govt & PSU (PSC/UPSC Format)',
            icon: Landmark,
            color: '#D97706',
            tier: 'LITE & ACTIVE SEARCH (KERALA EXCLUSIVE)',
            layoutStyle: 'Gazette Qualification Codes + Registered Reservation Details + Service Record Register',
            description: 'Custom tailored for Kerala PSC, SSC, UPSC, and Indian Public Sector Undertakings. Complies with official gazette format rules, category declarations, and academic mark conversions.',
            keywords: [
                'Kerala PSC Thulasi ID Verified', 'Gazette Notification Compliance', 'Degree / SSLC Verification', 'Community / Reservation Category',
                'Public Sector Service Record', 'Official Malayalam / English Gazette', 'Vigilance Clearance Certificate', 'Administrative Procedures'
            ]
        }
    ];

    const currentPack = packs.find(p => p.id === selectedPack) || packs[0];

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#3B82F620' }]}>
                    <Layers size={18} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            7. Industry-Specific Template Packs & Keyword Banks
                        </Text>
                        <Badge variant="info" size="sm">CURATED PACKS</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Different industries evaluate candidates through drastically different lenses. Switch between specialized template layouts and pre-populated industry keyword banks.
                    </Text>
                </View>
            </View>

            {/* Pack Selector Tabs */}
            <View style={styles.packTabsRow}>
                {packs.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedPack === p.id;
                    return (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.packTabBtn,
                                isSelected && { backgroundColor: p.color, borderColor: p.color },
                                { borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                            ]}
                            onPress={() => setSelectedPack(p.id)}
                        >
                            <Icon size={14} color={isSelected ? '#FFFFFF' : p.color} />
                            <Text style={[
                                styles.packTabLabel,
                                isSelected ? { color: '#FFFFFF' } : { color: colors.textPrimary }
                            ]}>
                                {p.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Active Pack Details Card */}
            <View style={[
                styles.packDetailsCard,
                { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
            ]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                    <View>
                        <Text style={[styles.packDetailTitle, { color: colors.textPrimary }]}>{currentPack.name}</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: currentPack.color, marginTop: 2 }}>{currentPack.layoutStyle}</Text>
                    </View>
                    <Badge variant="warning" size="sm">{currentPack.tier}</Badge>
                </View>

                <Text style={[styles.packDetailDesc, { color: colors.textSecondary }]}>
                    {currentPack.description}
                </Text>

                {/* Pre-Populated Keyword Bank */}
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, marginTop: 8, marginBottom: 6 }}>
                    Industry Keyword Bank (Click '+' to add to your resume):
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {currentPack.keywords.map((kw, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.kwChip,
                                { backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#CBD5E1' }
                            ]}
                            onPress={() => {
                                userToast?.success?.(`Added "${kw}" to your target skills bank!`);
                                if (onAddKeyword) onAddKeyword(kw);
                            }}
                        >
                            <Plus size={11} color={currentPack.color} />
                            <Text style={[styles.kwChipText, { color: colors.textPrimary }]}>{kw}</Text>
                        </TouchableOpacity>
                    ))}
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
    packTabsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap'
    },
    packTabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1
    },
    packTabLabel: {
        fontSize: 11,
        fontWeight: '700'
    },
    packDetailsCard: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    packDetailTitle: {
        fontSize: 13,
        fontWeight: '800'
    },
    packDetailDesc: {
        fontSize: 11,
        lineHeight: 16
    },
    kwChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1
    },
    kwChipText: {
        fontSize: 11,
        fontWeight: '600'
    }
});
