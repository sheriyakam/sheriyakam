import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function ResumeFreshnessAlert({ colors, isDark, userToast, onRefreshBase }) {
    const baseResumeDaysOld = 94; // Stale threshold: 90 days
    const isBaseStale = baseResumeDaysOld >= 90;

    const targetJobDaysOld = 42; // Expiry warning threshold: 30 days
    const isPostingOld = targetJobDaysOld >= 30;

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#EF444420' }]}>
                    <Clock size={18} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            6. Resume Staleness & Job Expiry Alerts
                        </Text>
                        <Badge variant={isBaseStale ? 'error' : 'success'} size="sm">
                            {isBaseStale ? 'STALE ALERT (94 DAYS)' : 'UP TO DATE'}
                        </Badge>
                        <Badge variant="info" size="sm">ALL TIERS · FREE</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        ATS indexing algorithms decay resumes that haven't been updated in 90+ days. Stay informed on posting expiration risks before you spend time tailoring.
                    </Text>
                </View>
            </View>

            <View style={{ gap: 10 }}>
                {/* 1. Base Resume Staleness Nudge */}
                <View style={[
                    styles.alertBox,
                    isBaseStale ? { backgroundColor: '#FEF2F2', borderColor: '#EF4444' } : { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
                ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {isBaseStale ? <AlertCircle size={15} color="#EF4444" /> : <CheckCircle2 size={15} color="#10B981" />}
                            <Text style={{ fontSize: 12, fontWeight: '800', color: isBaseStale ? '#991B1B' : '#065F46' }}>
                                {isBaseStale ? 'Base Resume Needs Refresh (94 Days Since Last Update)' : 'Base Resume Fresh (Updated Recently)'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.refreshBtn, { backgroundColor: isBaseStale ? '#EF4444' : '#10B981' }]}
                            onPress={() => {
                                userToast?.success?.('Base resume timestamp refreshed!');
                                if (onRefreshBase) onRefreshBase();
                            }}
                        >
                            <RefreshCw size={12} color="#FFFFFF" />
                            <Text style={styles.refreshBtnText}>Refresh Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 11, color: isBaseStale ? '#7F1D1D' : '#047857', lineHeight: 15 }}>
                        {isBaseStale
                            ? 'Your base resume was last verified on June 12, 2026. Adding your latest project achievement, certification, or promotion boosts ATS recency weight by +12%.'
                            : 'Your base resume is within the 90-day active window. Recruiter search algorithms rank your profile in the top tier.'}
                    </Text>
                </View>

                {/* 2. Job Posting Staleness Warning */}
                <View style={[
                    styles.alertBox,
                    isPostingOld ? { backgroundColor: '#FFFBEB', borderColor: '#F59E0B' } : { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }
                ]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Clock size={15} color={isPostingOld ? '#D97706' : '#64748B'} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: isPostingOld ? '#92400E' : colors.textPrimary }}>
                            Target Job Posting Age: 42 Days Old (Likely in Final Round)
                        </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: isPostingOld ? '#78350F' : colors.textSecondary, lineHeight: 15 }}>
                        Corporate recruiters typically freeze screening on job postings after 30 days. There is a 74% probability Northwind Global is already conducting final interviews. Verify the vacancy is still open or prioritize postings under 14 days old for maximum callback rates.
                    </Text>
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
    alertBox: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1
    },
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    refreshBtnText: {
        color: '#FFFFFF',
        fontSize: 10.5,
        fontWeight: '700'
    }
});
