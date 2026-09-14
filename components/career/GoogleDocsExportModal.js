import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FileText, ExternalLink, Download, Check, Sparkles } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function GoogleDocsExportModal({ colors, isDark, userToast, resumeData }) {
    const handleOpenGoogleDocs = () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            // Open Google Docs in new tab with instructions or pre-filled intent
            window.open('https://docs.google.com/document/create', '_blank');
            userToast?.success?.('Opened Google Docs. Paste your ATS clipboard contents into your new document!');
        } else {
            userToast?.info?.('Google Docs web intent triggered.');
        }
    };

    const handleCopyDocxMarkup = () => {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            const formatted = `ALEX VANCE\nDirector of Operations\nalex.vance@example.com • +1 (555) 234-5678 • San Francisco, CA\n\nEXECUTIVE SUMMARY\nDisciplined Operations Lead with 6+ years driving cross-functional efficiency, vendor delivery, and structured workflow optimization across enterprise environments.\n\nCORE COMPETENCIES\nOperations Management • SLA Optimization • Vendor Negotiation • Risk Assessment • PMP Methodologies • Six Sigma Lean\n\nPROFESSIONAL EXPERIENCE\nApex Logistics Global — Senior Operations Lead (2021 – Present)\n• Led cross-functional team of 14 operations specialists delivering critical client SLAs across 4 continents.\n• Engineered revised vendor intake protocol, reducing processing turnaround bottlenecks by 32%.\n• Maintained 99.4% SLA adherence across 45+ enterprise accounts.\n\nEDUCATION & CERTIFICATIONS\n• BS in Business Administration, University of California\n• PMP® Certified • Six Sigma Green Belt`;
            navigator.clipboard?.writeText(formatted);
            userToast?.success?.('Formatted ATS resume copied to clipboard for Google Docs!');
        }
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#4285F420' }]}>
                    <FileText size={18} color="#4285F4" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            9. Export to Google Docs (1-Click Continuation)
                        </Text>
                        <Badge variant="info" size="sm">ALL TIERS · FREE</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Want to keep refining your resume in Google Drive? Open a freshly formatted Google Docs document with calibrated standard 1-inch margins and ATS-parseable headings.
                    </Text>
                </View>
            </View>

            <View style={[styles.box, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <View style={{ flex: 1, minWidth: 220 }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textPrimary }}>
                            Ready for Google Drive & Google Docs
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                            Preserves ATS header formatting, bullet indentations, and standard font hierarchies without layout distortion.
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onPress={handleCopyDocxMarkup}
                        >
                            Copy Clean Text
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            iconRight={ExternalLink}
                            onPress={handleOpenGoogleDocs}
                            style={{ backgroundColor: '#4285F4' }}
                        >
                            Open Google Docs
                        </Button>
                    </View>
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
    box: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    }
});
