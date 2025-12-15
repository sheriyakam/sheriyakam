import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Award, Calendar, ExternalLink, Power } from 'lucide-react-native';
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
        logoutPartner();
        router.replace('/partner/auth');
    };

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                {icon}
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <User size={48} color="#fff" />
                    </View>
                    <Text style={styles.name}>{partner.name}</Text>
                    <Text style={styles.roles}>{(partner.serviceTypes || []).join(' • ')}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: partner.isAvailable ? COLORS.success : COLORS.danger }]}>
                        <Text style={styles.statusText}>{partner.isAvailable ? 'Available' : 'Unavailable'}</Text>
                    </View>
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Info</Text>
                    <InfoRow
                        icon={<Phone size={20} color={COLORS.primary} />}
                        label="Phone Number"
                        value={partner.phone}
                    />
                    <InfoRow
                        icon={<Mail size={20} color={COLORS.primary} />}
                        label="Email Address"
                        value={partner.email}
                    />
                    <InfoRow
                        icon={<MapPin size={20} color={COLORS.primary} />}
                        label="Location"
                        value={partner.taluk || 'Not Set'}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance</Text>
                    <InfoRow
                        icon={<Award size={20} color={COLORS.gold} />}
                        label="Performance Score"
                        value={`${partner.performanceScore || 0}/100`}
                    />
                    <InfoRow
                        icon={<Calendar size={20} color={COLORS.primary} />}
                        label="Joined On"
                        value={partner.joinDate || 'N/A'}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Power size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 4,
        borderColor: COLORS.bgSecondary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    roles: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textTertiary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginTop: SPACING.sm,
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textTertiary,
        fontSize: 12,
        marginTop: SPACING.xl,
    }
});
