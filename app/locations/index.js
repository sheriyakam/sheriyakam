import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
    useWindowDimensions, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, MapPin, Search, ShieldCheck, Clock, Users,
    Zap, ChevronRight, Phone, MessageCircle, AlertTriangle
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { KERALA_DISTRICTS } from '../../constants/locations';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function LocationsDirectoryScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const isTablet = width >= 640 && width < 1024;

    const [searchQuery, setSearchQuery] = useState('');

    const filteredDistricts = KERALA_DISTRICTS.filter(d => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return d.name.toLowerCase().includes(q) ||
            d.malayalam.includes(q) ||
            d.municipalities.some(m => m.name.toLowerCase().includes(q) || m.pincode.includes(q));
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>All 14 Kerala Districts Service Coverage | Sheriyakam</title>
                <meta name="description" content="Certified electricians & home service technicians across all 14 districts of Kerala: Kozhikode, Kannur, Kochi, Malappuram, Thrissur, Trivandrum & more. 45–90 min arrival guarantee." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/locations" />
            </Head>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Service Coverage</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>All 14 Districts of Kerala</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/emergency-electrician')} style={styles.emergencyBtn}>
                    <Zap size={14} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.emergencyBtnText}>Emergency</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <View style={[styles.heroBanner, { backgroundColor: isDark ? '#18181B' : '#1E293B' }]}>
                    <Badge variant="info" size="md">Statewide Electrical Network</Badge>
                    <Text style={styles.heroTitle}>
                        Find Certified Electricians in Your Kerala District
                    </Text>
                    <Text style={styles.heroSub}>
                        Doorstep arrival in 45–90 minutes with KSELB licensed wiremen, upfront pricing, and ₹5 Lakh property damage insurance.
                    </Text>

                    {/* Search Bar */}
                    <View style={styles.searchBar}>
                        <Search size={18} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search district, municipality, or PIN (e.g. Kozhikode, Thalassery, 682001)..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={{ color: '#94A3B8', fontSize: 16 }}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Thalassery HQ Banner */}
                {!searchQuery && (
                    <Card variant="default" style={[styles.districtCard, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: '#2563EB66', borderWidth: 1.5, marginBottom: 14 }]}>
                        <View style={styles.districtCardTop}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.nameRow}>
                                    <Text style={[styles.districtName, { color: colors.textPrimary }]}>
                                        Thalassery (Empire Electricals HQ)
                                    </Text>
                                    <Badge variant="info" size="sm">Main Hub • Est. 1998</Badge>
                                </View>
                                <Text style={[styles.districtMalayalam, { color: colors.accent }]}>
                                    തലശ്ശേരി • Class-A Licence #KSELB/CA-7821/KL
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statPill}>
                                <Clock size={13} color="#F59E0B" />
                                <Text style={[styles.statText, { color: colors.textSecondary }]}>30–45 min arrival</Text>
                            </View>
                            <View style={styles.statPill}>
                                <Users size={13} color="#10B981" />
                                <Text style={[styles.statText, { color: colors.textSecondary }]}>16 Master Wiremen</Text>
                            </View>
                        </View>
                        <View style={styles.cardActions}>
                            <Button
                                variant="primary"
                                size="sm"
                                onPress={() => router.push('/thalassery-electrician')}
                                iconRight={ChevronRight}
                                style={{ flex: 1 }}
                            >
                                Visit Thalassery HQ Hub
                            </Button>
                        </View>
                    </Card>
                )}

                {/* Districts Grid */}
                <View style={[styles.districtsGrid, isDesktop && styles.desktopGrid]}>
                    {filteredDistricts.map((district) => (
                        <Card key={district.id} variant="default" style={styles.districtCard}>
                            <View style={styles.districtCardTop}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.nameRow}>
                                        <Text style={[styles.districtName, { color: colors.textPrimary }]}>
                                            {district.name}
                                        </Text>
                                        <Badge variant="success" size="sm">{district.coverageBadge}</Badge>
                                    </View>
                                    <Text style={[styles.districtMalayalam, { color: colors.accent }]}>
                                        {district.malayalam}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statPill}>
                                    <Clock size={13} color="#F59E0B" />
                                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                        {district.averageArrivalMins} min avg arrival
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Users size={13} color="#10B981" />
                                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                        {district.availableTechnicians} active tech
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.municipalitiesSection}>
                                <Text style={[styles.muniHeader, { color: colors.textTertiary }]}>COVERAGE HUBS & MUNICIPALITIES:</Text>
                                <View style={styles.muniChips}>
                                    {district.municipalities.slice(0, 5).map((muni) => (
                                        <View key={muni.id} style={[styles.muniChip, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                            <Text style={[styles.muniChipText, { color: colors.textPrimary }]}>{muni.name.split(' ')[0]}</Text>
                                        </View>
                                    ))}
                                    {district.municipalities.length > 5 && (
                                        <View style={[styles.muniChip, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                            <Text style={[styles.muniChipText, { color: colors.accent }]}>+{district.municipalities.length - 5} more</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.cardActions}>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onPress={() => router.push(`/${district.id}-electrician`)}
                                    iconRight={ChevronRight}
                                    style={{ flex: 1 }}
                                >
                                    View {district.name} Hub
                                </Button>
                            </View>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    headerSub: {
        fontSize: 12,
    },
    emergencyBtn: {
        backgroundColor: '#7F1D1D22',
        borderColor: '#EF4444',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    emergencyBtnText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '800',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroBanner: {
        padding: 22,
        borderRadius: 18,
        marginBottom: 20,
        gap: 10,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 30,
    },
    heroSub: {
        color: '#CBD5E1',
        fontSize: 13,
        lineHeight: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 6,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 13,
    },
    districtsGrid: {
        gap: 14,
    },
    desktopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    districtCard: {
        flex: 1,
        minWidth: 320,
        padding: 18,
        borderRadius: 16,
        gap: 12,
    },
    districtCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    districtName: {
        fontSize: 17,
        fontWeight: '800',
    },
    districtMalayalam: {
        fontSize: 13,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    statPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statText: {
        fontSize: 12,
        fontWeight: '600',
    },
    municipalitiesSection: {
        gap: 6,
    },
    muniHeader: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    muniChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    muniChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    muniChipText: {
        fontSize: 11,
        fontWeight: '600',
    },
    cardActions: {
        marginTop: 4,
    },
});
