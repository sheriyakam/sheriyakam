import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Copy, Check, FileText, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function AutoApplyDraftModal({ colors, isDark, userToast }) {
    const [copiedField, setCopiedField] = useState(null);
    const [selectedPortal, setSelectedPortal] = useState('linkedin'); // 'linkedin' | 'indeed' | 'naukri' | 'workday'

    const fields = [
        { label: 'Full Name', value: 'Alex Vance' },
        { label: 'Email Address', value: 'alex.vance@example.com' },
        { label: 'Phone Number', value: '+1 (555) 234-5678' },
        { label: 'Current Location', value: 'San Francisco, CA' },
        { label: 'LinkedIn Profile URL', value: 'https://linkedin.com/in/alexvance-ops' },
        { label: '1-Line Elevator Headline', value: 'Director of Operations | Scaling SLA Delivery, Process Automation & Governance' },
        { label: 'Years of Experience in Operations Lead', value: '6+ Years' },
        { label: 'Authorized to work without sponsorship?', value: 'Yes' },
        { label: 'Notice Period', value: 'Immediate / 2 Weeks' }
    ];

    const shortAnswers = [
        {
            q: 'Why are you interested in this role?',
            a: 'I have tracked Northwind Global\'s operational scaling. With 6+ years leading SLA governance, vendor intake protocols, and cross-functional teams delivering 99.4% SLA adherence, I am equipped to deliver immediate turnaround acceleration without onboarding friction.'
        },
        {
            q: 'Describe a complex challenge you overcame and the measurable result.',
            a: 'At Apex Logistics Global, cross-departmental vendor handoffs delayed client deliverables. I engineered a standardized 4-tier intake governance matrix with automated escalation alerts, reducing turnaround delays by 32% across 45+ enterprise accounts.'
        }
    ];

    const coverSnippet = `Dear Hiring Team at Northwind Global Corp,\n\nI am writing to express my enthusiasm for the Director of Operations position. Throughout my 6+ years in operations management, I have specialized in building robust workflow governance, coaching high-performing teams, and optimizing vendor delivery standards. Given your current trajectory, I am confident my hands-on background will immediately accelerate your operational velocity.\n\nSincerely,\nAlex Vance`;

    const handleCopy = (text, key) => {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            navigator.clipboard?.writeText(text);
        }
        setCopiedField(key);
        userToast?.success?.('Copied to clipboard!');
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                    <Copy size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            5. Auto-Apply Draft (Clipboard-Ready Form Fields)
                        </Text>
                        <Badge variant="success" size="sm">MANUAL-SUBMIT GUARANTEE</Badge>
                        <Badge variant="info" size="sm">FREE (3 DRAFTS) · ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Pre-fills screening questions, short-answer responses, and cover letter snippets into 1-click clipboard buttons for LinkedIn Easy Apply, Indeed, Naukri, and Workday.
                    </Text>
                </View>
            </View>

            {/* Anti-Bot Trust Guarantee Notice */}
            <View style={[styles.guaranteeNotice, { backgroundColor: isDark ? '#141E2E' : '#ECFDF5', borderColor: '#10B98140' }]}>
                <ShieldCheck size={16} color="#10B981" />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.textPrimary }}>
                        100% Ethical & Account-Safe (Never Auto-Submits Behind Your Back)
                    </Text>
                    <Text style={{ fontSize: 10.5, color: colors.textSecondary, marginTop: 1 }}>
                        Unlike shady auto-apply bots that risk your LinkedIn account being banned, our tool prepares formatted answers for you to review and click submit yourself.
                    </Text>
                </View>
            </View>

            {/* Portal Filter Tabs */}
            <View style={styles.portalTabs}>
                {[
                    { id: 'linkedin', label: 'LinkedIn Easy Apply' },
                    { id: 'indeed', label: 'Indeed Quick Apply' },
                    { id: 'naukri', label: 'Naukri 1-Click' },
                    { id: 'workday', label: 'Workday / Greenhouse' }
                ].map((p) => (
                    <TouchableOpacity
                        key={p.id}
                        style={[
                            styles.portalTabBtn,
                            selectedPortal === p.id && styles.portalTabBtnActive,
                            { borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                        ]}
                        onPress={() => setSelectedPortal(p.id)}
                    >
                        <Text style={[
                            styles.portalTabText,
                            selectedPortal === p.id ? { color: '#FFFFFF' } : { color: colors.textPrimary }
                        ]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Form Fields Grid */}
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 }}>
                Common Form Fields (Click to Copy):
            </Text>
            <View style={styles.fieldsGrid}>
                {fields.map((f, idx) => {
                    const isCopied = copiedField === `field-${idx}`;
                    return (
                        <View
                            key={idx}
                            style={[styles.fieldRow, { backgroundColor: isDark ? '#0B1120' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>{f.label}</Text>
                                <Text numberOfLines={1} style={[styles.fieldVal, { color: colors.textPrimary }]}>{f.value}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.copyBtn, isCopied && styles.copyBtnCopied]}
                                onPress={() => handleCopy(f.value, `field-${idx}`)}
                            >
                                {isCopied ? <Check size={13} color="#FFFFFF" /> : <Copy size={13} color="#64748B" />}
                                <Text style={[styles.copyBtnText, isCopied && { color: '#FFFFFF' }]}>
                                    {isCopied ? 'Copied' : 'Copy'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            {/* Short Answer Questions */}
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, marginTop: 12, marginBottom: 6 }}>
                Tailored Behavioral Short-Answer Prompts:
            </Text>
            <View style={{ gap: 8 }}>
                {shortAnswers.map((sa, sIdx) => {
                    const isCopied = copiedField === `sa-${sIdx}`;
                    return (
                        <View
                            key={sIdx}
                            style={[styles.saBox, { backgroundColor: isDark ? '#0B1120' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary, flex: 1 }}>{sa.q}</Text>
                                <TouchableOpacity
                                    style={[styles.copyBtn, isCopied && styles.copyBtnCopied]}
                                    onPress={() => handleCopy(sa.a, `sa-${sIdx}`)}
                                >
                                    {isCopied ? <Check size={13} color="#FFFFFF" /> : <Copy size={13} color="#64748B" />}
                                    <Text style={[styles.copyBtnText, isCopied && { color: '#FFFFFF' }]}>
                                        {isCopied ? 'Copied' : 'Copy Answer'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>{sa.a}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Quick Cover Snippet */}
            <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary }}>150-Word Targeted Cover Snippet:</Text>
                    <TouchableOpacity
                        style={[styles.copyBtn, copiedField === 'cover' && styles.copyBtnCopied]}
                        onPress={() => handleCopy(coverSnippet, 'cover')}
                    >
                        {copiedField === 'cover' ? <Check size={13} color="#FFFFFF" /> : <Copy size={13} color="#64748B" />}
                        <Text style={[styles.copyBtnText, copiedField === 'cover' && { color: '#FFFFFF' }]}>
                            {copiedField === 'cover' ? 'Copied' : 'Copy Cover Letter'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.saBox, { backgroundColor: isDark ? '#0B1120' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>{coverSnippet}</Text>
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
        marginBottom: 12
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
    guaranteeNotice: {
        flexDirection: 'row',
        gap: 8,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        alignItems: 'center'
    },
    portalTabs: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
        flexWrap: 'wrap'
    },
    portalTabBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1
    },
    portalTabBtnActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981'
    },
    portalTabText: {
        fontSize: 10.5,
        fontWeight: '700'
    },
    fieldsGrid: {
        gap: 6
    },
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1
    },
    fieldLabel: {
        fontSize: 9.5,
        color: '#64748B',
        fontWeight: '700'
    },
    fieldVal: {
        fontSize: 11.5,
        fontWeight: '600'
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
    },
    copyBtnCopied: {
        backgroundColor: '#10B981'
    },
    copyBtnText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#64748B'
    },
    saBox: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1
    }
});
