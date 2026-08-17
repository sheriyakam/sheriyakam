import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Award, ShieldCheck, MapPin, Users, Heart } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

const TEAM = [
    {
        name: 'Zanjan A.',
        role: 'Founder & Head of Product',
        bio: 'Building domestic trade safety infrastructure for South India. Passionate about empowering local trade technicians with fair pricing.',
        location: 'Kozhikode, Kerala',
        badge: 'Leadership',
    },
    {
        name: 'Sanoop K.',
        role: 'Chief Trade Officer & Master Electrician',
        bio: 'Over 14 years of licensed high-voltage domestic and commercial electrical contracting experience across North Malabar.',
        location: 'Mavoor Road, Kozhikode',
        badge: 'Grade A Licensed',
    },
    {
        name: 'Kavya Menon',
        role: 'Head of Customer Experience & Safety',
        bio: 'Leading our 24/7 dispatch support desk and contractor quality assurance audits.',
        location: 'Kochi, Kerala',
        badge: 'Operations',
    },
    {
        name: 'Vinod M.',
        role: 'Senior Field Supervisor',
        bio: 'Supervises emergency blackout responses and technical apprentice onboarding in Vadakara and Koyilandy.',
        location: 'Vadakara, Kerala',
        badge: 'Technical Lead',
    },
];

export default function TeamScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Meet the Team</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="purple">Our Mission</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Crafted by Kerala Engineers & Master Electricians
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        We are a passionate team dedicated to raising the standard of living, electrical safety, and technical transparency for domestic homes.
                    </Text>
                </View>

                {/* Team List */}
                <View style={styles.teamList}>
                    {TEAM.map((member, idx) => (
                        <Card key={idx} variant="default" style={styles.memberCard}>
                            <View style={styles.memberTop}>
                                <Avatar name={member.name} size={50} />
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={[styles.memberName, { color: colors.textPrimary }]}>
                                            {member.name}
                                        </Text>
                                        <Badge variant="info" size="sm">{member.badge}</Badge>
                                    </View>
                                    <Text style={[styles.memberRole, { color: colors.accent }]}>
                                        {member.role}
                                    </Text>
                                    <Text style={[styles.memberLoc, { color: colors.textTertiary }]}>
                                        📍 {member.location}
                                    </Text>
                                </View>
                            </View>

                            <Text style={[styles.memberBio, { color: colors.textSecondary }]}>
                                {member.bio}
                            </Text>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    teamList: {
        gap: 12,
        marginVertical: 10,
    },
    memberCard: {
        padding: 16,
        gap: 12,
    },
    memberTop: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    memberName: {
        fontSize: 15,
        fontWeight: '700',
    },
    memberRole: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 1,
    },
    memberLoc: {
        fontSize: 11,
        marginTop: 2,
    },
    memberBio: {
        fontSize: 13,
        lineHeight: 18,
    },
});
