import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Award, Calendar, Power, Shield, Star, TrendingUp, Clock } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, logoutPartner } from '../../constants/partnerStore';

export default function PartnerProfile() {
    const router = useRouter();
    const partner = getCurrentPartner();

    if (!partner) {
        router.replace('/partner/auth');
        return null;
    }

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => { logoutPartner(); router.replace('/partner/auth'); } }
        ]);
    };

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>{icon}</View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Not Set'}</Text>
            </View>
        </View>
    );

    const score = partner.performanceScore || 0;
    const scoreColor = score >= 80 ? COLORS.success : score >= 60 ? '#f59e0b' : COLORS.danger;
    const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Hero */}
                <View style={styles.profileHero}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {partner.name ? partner.name.charAt(0).toUpperCase() : 'P'}
                            </Text>
                        </View>
                        <View style={[styles.onlineDot, { backgroundColor: partner.isAvailable ? COLORS.success : COLORS.danger }]} />
                    </View>
                    <Text style={styles.name}>{partner.name}</Text>
                    <Text style={styles.roles}>{(partner.serviceTypes || []).join(' • ')}</Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.statusBadge, { backgroundColor: partner.status === 'approved' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)' }]}>
                            <Shield size={12} color={partner.status === 'approved' ? COLORS.success : '#f59e0b'} />
                            <Text style={[styles.statusText, { color: partner.status === 'approved' ? COLORS.success : '#f59e0b' }]}>
                                {partner.status === 'approved' ? 'Verified Partner' : 'Pending Verification'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Performance Card */}
                <View style={styles.perfCard}>
                    <View style={styles.perfHeader}>
                        <Text style={styles.sectionTitle}>Performance</Text>
                        <View style={[styles.scorePill, { backgroundColor: scoreColor + '18' }]}>
                            <Text style={[styles.scoreText, { color: scoreColor }]}>{scoreLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.perfBar}>
                        <View style={[styles.perfFill, { width: `${score}%`, backgroundColor: scoreColor }]} />
                    </View>
                    <View style={styles.perfStats}>
                        <View style={styles.perfStatItem}>
                            <Star size={16} color={COLORS.gold} />
                            <Text style={styles.perfStatValue}>{score}/100</Text>
                            <Text style={styles.perfStatLabel}>Score</Text>
                        </View>
                        <View style={styles.perfStatDivider} />
                        <View style={styles.perfStatItem}>
                            <Calendar size={16} color={COLORS.accent} />
                            <Text style={styles.perfStatValue}>{partner.joinDate || 'N/A'}</Text>
                            <Text style={styles.perfStatLabel}>Joined</Text>
                        </View>
                        <View style={styles.perfStatDivider} />
                        <View style={styles.perfStatItem}>
                            <TrendingUp size={16} color={COLORS.success} />
                            <Text style={styles.perfStatValue}>Active</Text>
                            <Text style={styles.perfStatLabel}>Status</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <InfoRow
                        icon={<Phone size={18} color={COLORS.accent} />}
                        label="Phone Number"
                        value={partner.phone}
                    />
                    <InfoRow
                        icon={<Mail size={18} color={COLORS.accent} />}
                        label="Email Address"
                        value={partner.email}
                    />
                    <InfoRow
                        icon={<MapPin size={18} color={COLORS.accent} />}
                        label="Service Area"
                        value={partner.taluk || partner.location?.address}
                    />
                </View>

                {/* Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Categories</Text>
                    <View style={styles.serviceChips}>
                        {(partner.serviceTypes || []).map((svc, i) => (
                            <View key={i} style={styles.serviceChip}>
                                <Briefcase size={14} color={COLORS.accent} />
                                <Text style={styles.serviceChipText}>{svc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Power size={18} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Sheriyakam Partner v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgPrimary },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
        borderBottomWidth: 1, borderColor: COLORS.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    scrollContent: { padding: SPACING.lg, paddingBottom: 40 },

    // Profile Hero
    profileHero: { alignItems: 'center', marginBottom: SPACING.xl },
    avatarRing: { position: 'relative', marginBottom: SPACING.md },
    avatar: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: COLORS.bgSecondary,
    },
    avatarText: { color: '#fff', fontSize: 36, fontWeight: '900' },
    onlineDot: {
        position: 'absolute', bottom: 4, right: 4,
        width: 18, height: 18, borderRadius: 9,
        borderWidth: 3, borderColor: COLORS.bgPrimary,
    },
    name: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
    roles: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
    badgeRow: { flexDirection: 'row' },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    // Performance
    perfCard: {
        backgroundColor: COLORS.bgSecondary, borderRadius: 16, padding: SPACING.lg,
        marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
    },
    perfHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md,
    },
    scorePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    scoreText: { fontSize: 12, fontWeight: 'bold' },
    perfBar: {
        height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: SPACING.lg, overflow: 'hidden',
    },
    perfFill: { height: 6, borderRadius: 3 },
    perfStats: { flexDirection: 'row', alignItems: 'center' },
    perfStatItem: { flex: 1, alignItems: 'center' },
    perfStatValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 4 },
    perfStatLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
    perfStatDivider: { width: 1, height: 32, backgroundColor: COLORS.border },

    // Sections
    section: {
        backgroundColor: COLORS.bgSecondary, borderRadius: 16, padding: SPACING.lg,
        marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.md },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    iconBox: {
        width: 38, height: 38, borderRadius: 10,
        backgroundColor: 'rgba(37, 99, 235, 0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    infoValue: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },

    // Service Chips
    serviceChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    serviceChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(37, 99, 235, 0.08)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    },
    serviceChipText: { color: COLORS.accent, fontWeight: '600', fontSize: 13 },

    // Logout
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 16, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: SPACING.sm,
    },
    logoutText: { color: COLORS.danger, fontSize: 15, fontWeight: 'bold' },
    versionText: {
        textAlign: 'center', color: COLORS.textTertiary, fontSize: 12, marginTop: SPACING.xl,
    },
});
