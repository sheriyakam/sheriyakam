import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Users, Share2, MessageSquare, CheckCircle, ShieldCheck, Copy } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function CounselorReviewDrawer({ colors, isDark, userToast }) {
    const [reviewMode, setReviewMode] = useState('counselor'); // 'candidate' | 'counselor'
    const [comments, setComments] = useState([
        {
            id: 'c1',
            author: 'Dr. Radhika Menon (Career Mentor)',
            section: 'Executive Summary',
            text: 'Opening sentence is clear. Suggest emphasizing the 14-person team scale upfront to cement senior director authority.',
            time: '2 hours ago',
            status: 'actionable'
        },
        {
            id: 'c2',
            author: 'Dr. Radhika Menon (Career Mentor)',
            section: 'Apex Logistics - Bullet #2',
            text: 'The 32% turnaround bottleneck reduction is your strongest proof point. Keep this positioned as bullet #1.',
            time: '2 hours ago',
            status: 'approved'
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const [isApproved, setIsApproved] = useState(true);

    const shareUrl = 'https://sheriyakam.vercel.app/cv-linkedin-optimize?review=coach_alex_2026';

    const handleCopyShareUrl = () => {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            navigator.clipboard?.writeText(shareUrl);
        }
        userToast?.success?.('Mentor review link copied to clipboard!');
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments(prev => [
            ...prev,
            {
                id: `c${Date.now()}`,
                author: 'Career Counselor',
                section: 'General Feedback',
                text: newComment.trim(),
                time: 'Just now',
                status: 'actionable'
            }
        ]);
        setNewComment('');
        userToast?.success?.('Counselor feedback added to workspace!');
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                    <Users size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            8. Team & Career-Counselor Review Mode
                        </Text>
                        <Badge variant="success" size="sm">COACH COLLABORATION</Badge>
                        <Badge variant="warning" size="sm">ACTIVE SEARCH & B2B TIER</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Share a read-only or comment-enabled workspace with your career counselor, mentor, or placement cell for section-by-section audit and verified approval.
                    </Text>
                </View>
            </View>

            {/* Share Link Banner */}
            <View style={[styles.shareBar, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.textSecondary }}>Secure Mentor Review Link:</Text>
                    <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: '600', color: '#10B981', marginTop: 2 }}>
                        {shareUrl}
                    </Text>
                </View>
                <Button
                    variant="secondary"
                    size="sm"
                    iconLeft={Copy}
                    onPress={handleCopyShareUrl}
                >
                    Copy Link
                </Button>
            </View>

            {/* Counselor Approval Status Banner */}
            <View style={[styles.approvalBox, { backgroundColor: isDark ? '#0B1120' : '#ECFDF5', borderColor: '#10B98150' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <ShieldCheck size={18} color="#10B981" />
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textPrimary }}>
                                Counselor Rubric Status: 4.9 / 5.0
                            </Text>
                            <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>
                                Verified by Dr. Radhika Menon · Placement Cell Certified
                            </Text>
                        </View>
                    </View>
                    <Badge variant="success" size="sm">✓ COUNSELOR APPROVED</Badge>
                </View>
            </View>

            {/* Counselor Comment Thread */}
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, marginTop: 12, marginBottom: 6 }}>
                Mentor Feedback & Line Annotations:
            </Text>
            <View style={{ gap: 8 }}>
                {comments.map((c) => (
                    <View
                        key={c.id}
                        style={[styles.commentCard, { backgroundColor: isDark ? '#0B1120' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary }}>{c.author}</Text>
                            <Text style={{ fontSize: 10, color: colors.textSecondary }}>{c.time}</Text>
                        </View>
                        <Badge variant="info" size="sm" style={{ alignSelf: 'flex-start', marginVertical: 3 }}>
                            {c.section}
                        </Badge>
                        <Text style={{ fontSize: 11, color: colors.textPrimary, lineHeight: 16 }}>{c.text}</Text>
                    </View>
                ))}
            </View>

            {/* Leave a Comment Box */}
            <View style={{ marginTop: 10, flexDirection: 'row', gap: 8 }}>
                <TextInput
                    placeholder="Leave a mentor comment or revision note..."
                    placeholderTextColor={colors.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    style={[styles.commentInput, { color: colors.textPrimary, borderColor: isDark ? '#1E293B' : '#CBD5E1', backgroundColor: isDark ? '#0B1120' : '#FFFFFF' }]}
                />
                <Button
                    variant="primary"
                    size="sm"
                    iconLeft={MessageSquare}
                    onPress={handleAddComment}
                    style={{ backgroundColor: '#10B981' }}
                >
                    Add Note
                </Button>
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
    shareBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        gap: 8
    },
    approvalBox: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1
    },
    commentCard: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1
    },
    commentInput: {
        flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 11.5
    }
});
