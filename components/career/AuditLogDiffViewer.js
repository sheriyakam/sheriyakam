import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { History, Undo2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function AuditLogDiffViewer({ colors, isDark, userToast }) {
    const [auditItems, setAuditItems] = useState([
        {
            id: 'diff-1',
            section: 'Executive Summary',
            original: 'Experienced operations manager skilled in handling vendors and improving team delivery.',
            rewritten: 'Disciplined Operations Lead with 6+ years driving cross-functional efficiency, vendor delivery, and structured SLA governance.',
            reason: 'Injected high-weight target keywords (SLA governance, cross-functional) and replaced passive phrasing with authoritative title.',
            reverted: false
        },
        {
            id: 'diff-2',
            section: 'Apex Logistics — Bullet #2',
            original: 'Helped rework vendor intake system so that things got done faster for our clients.',
            rewritten: 'Engineered revised vendor intake protocol, reducing processing turnaround bottlenecks by 32%.',
            reason: 'Replaced weak verb "Helped rework" with strong action verb "Engineered" and quantified the outcome with the exact 32% metric.',
            reverted: false
        },
        {
            id: 'diff-3',
            section: 'Core Competency Index',
            original: 'Operations, Vendor Management, Team Work, Process Automation',
            rewritten: 'Operations Management, SLA Optimization, Vendor Negotiation, Operational Risk Management, Budget Controls',
            reason: 'Normalized generic phrases into standardized ATS keyword tokens matched against Northwind Global\'s screening rules.',
            reverted: false
        }
    ]);

    const handleRevertLine = (id) => {
        setAuditItems(prev => prev.map(item => {
            if (item.id === id) {
                const nextState = !item.reverted;
                userToast?.success?.(nextState ? 'Line reverted to original wording.' : 'Line restored to AI optimized version.');
                return { ...item, reverted: nextState };
            }
            return item;
        }));
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                    <History size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            10. Granular Audit Log & Per-Line Revert
                        </Text>
                        <Badge variant="success" size="sm">LINE-BY-LINE TRUST</Badge>
                        <Badge variant="info" size="sm">FREE (RECENT 5) · ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Every AI transformation is recorded line-for-line. If you disagree with a single word or sentence, revert that individual line with 1 click without losing the rest of your AI improvements.
                    </Text>
                </View>
            </View>

            {/* Audit Items List */}
            <View style={{ gap: 12 }}>
                {auditItems.map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.diffItem,
                            { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                        ]}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Badge variant="info" size="sm">{item.section}</Badge>
                                <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>
                                    Status: <Text style={{ fontWeight: '700', color: item.reverted ? '#F59E0B' : '#10B981' }}>{item.reverted ? 'Reverted to Original' : 'Active (Optimized)'}</Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.revertBtn,
                                    item.reverted ? { backgroundColor: '#10B981' } : { backgroundColor: '#E2E8F0' }
                                ]}
                                onPress={() => handleRevertLine(item.id)}
                            >
                                <Undo2 size={12} color={item.reverted ? '#FFFFFF' : '#0F172A'} />
                                <Text style={[styles.revertBtnText, item.reverted && { color: '#FFFFFF' }]}>
                                    {item.reverted ? 'Restore AI Line' : 'Revert This Line'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Red Original Box */}
                        <View style={styles.diffBoxRed}>
                            <Text style={styles.diffLabelRed}>ORIGINAL LINE (BEFORE):</Text>
                            <Text style={[styles.diffTextRed, item.reverted && { textDecorationLine: 'none', fontWeight: '700' }]}>
                                {item.original}
                            </Text>
                        </View>

                        {/* Green AI Rewritten Box */}
                        <View style={[styles.diffBoxGreen, item.reverted && { opacity: 0.5 }]}>
                            <Text style={styles.diffLabelGreen}>AI OPTIMIZED LINE (AFTER):</Text>
                            <Text style={[styles.diffTextGreen, item.reverted && { textDecorationLine: 'line-through' }]}>
                                {item.rewritten}
                            </Text>
                        </View>

                        {/* Rationale */}
                        <View style={{ marginTop: 6 }}>
                            <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>
                                💡 <Text style={{ fontWeight: '700' }}>AI Rationale:</Text> {item.reason}
                            </Text>
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
    diffItem: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    revertBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    },
    revertBtnText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#0F172A'
    },
    diffBoxRed: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
        marginBottom: 6
    },
    diffLabelRed: {
        fontSize: 9,
        fontWeight: '800',
        color: '#991B1B',
        marginBottom: 2
    },
    diffTextRed: {
        fontSize: 11,
        color: '#7F1D1D',
        lineHeight: 15,
        textDecorationLine: 'line-through'
    },
    diffBoxGreen: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#ECFDF5',
        borderLeftWidth: 3,
        borderLeftColor: '#10B981'
    },
    diffLabelGreen: {
        fontSize: 9,
        fontWeight: '800',
        color: '#065F46',
        marginBottom: 2
    },
    diffTextGreen: {
        fontSize: 11,
        color: '#047857',
        lineHeight: 15,
        fontWeight: '600'
    }
});
