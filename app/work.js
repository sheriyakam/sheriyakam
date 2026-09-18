import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    useWindowDimensions, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, MapPin, CheckCircle2, ShieldCheck, Zap,
    Calendar, ArrowRight, Star
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const WORK_PROJECTS = [
    {
        id: 'db-upgrade-kochi',
        title: 'Complete DB Panel Modernization & RCCB Retrofit',
        category: 'DB & Switchgear',
        location: 'Edappally, Kochi',
        district: 'Ernakulam',
        duration: '4 Hours',
        completedDate: 'Recent Job',
        rating: 5.0,
        problem: 'Old porcelain fuse box with severe sparking, neutral burning, and no earth-leakage shock protection.',
        solution: 'Replaced with 12-way Schneider Acti9 Metal Enclosure DB, 40A 30mA high-sensitivity RCCB, and individual C-Curve MCBs.',
        materials: ['Schneider Acti9 12-Way DB', '40A 30mA RCCB', 'Finolex 6 sq.mm Copper Main Wire'],
        warranty: '3-Year Workmanship Warranty',
        serviceId: 'db-repair'
    },
    {
        id: 'wiring-kannur',
        title: '3-BHK Concealed Rewiring & Modular Switchboard Upgrade',
        category: 'Wiring & Switches',
        location: 'Thalassery, Kannur',
        district: 'Kannur',
        duration: '2 Days',
        completedDate: 'Recent Job',
        rating: 5.0,
        problem: 'Brittle 20-year-old PVC insulated wires causing frequent breaker trips during monsoon dampness.',
        solution: 'Pulled new FRLS fire-retardant copper lines through existing conduit and installed 8 modular Legrand switchboards.',
        materials: ['Polycab FRLS 1.5/2.5/4 sq.mm Cables', 'Legrand Arteor Modular Plates', 'Anchor Roma Switches'],
        warranty: '5-Year Rewiring Warranty',
        serviceId: 'complete-rewiring'
    },
    {
        id: 'inverter-kozhikode',
        title: '5kVA Solar Hybrid Inverter & Tubular Battery Bank Setup',
        category: 'Solar & Inverter',
        location: 'Mavoor Road, Kozhikode',
        district: 'Kozhikode',
        duration: '5 Hours',
        completedDate: 'Recent Job',
        rating: 4.9,
        problem: 'Frequent coastal power grid fluctuations causing sudden desktop and router shutdowns.',
        solution: 'Installed 5kVA pure sine wave inverter, dual 220Ah tall tubular batteries, and a 63A manual rotary bypass switch.',
        materials: ['5kVA Pure Sine Wave Inverter', '220Ah Tall Tubular Batteries', '63A Havells Bypass Switch'],
        warranty: '3-Year System Warranty',
        serviceId: 'inverter-install'
    },
    {
        id: 'cctv-ernakulam',
        title: 'Multi-Zone 4K IP CCTV & ColorVu Surveillance Network',
        category: 'CCTV & Security',
        location: 'Palarivattom, Ernakulam',
        district: 'Ernakulam',
        duration: '1 Day',
        completedDate: 'Recent Job',
        rating: 5.0,
        problem: 'Blind spots in villa perimeter and unmonitored rear garden during night hours.',
        solution: 'Installed 6x 4MP IP ColorVu full-night-color cameras with POE switch, 2TB surveillance hard drive, and mobile remote streaming.',
        materials: ['Hikvision 4MP ColorVu Cameras', '8-Port POE Switch', 'Cat6 Outdoor Shielded Cables'],
        warranty: '2-Year On-Site AMC',
        serviceId: 'cctv-setup'
    },
    {
        id: 'commercial-malappuram',
        title: 'Commercial Restaurant Kitchen Switchgear & Exhaust Interlock',
        category: 'Commercial',
        location: 'Manjeri, Malappuram',
        district: 'Malappuram',
        duration: '6 Hours',
        completedDate: 'Recent Job',
        rating: 5.0,
        problem: 'Kitchen induction cookers tripping main power whenever large exhaust blowers were engaged.',
        solution: 'Isolated commercial kitchen on a separate 3-phase sub-DB with motor protection circuit breakers (MPCB) and thermal overload relays.',
        materials: ['L&T 3-Phase Industrial DB', 'MPCB Overload Relays', 'IP65 Waterproof Sockets'],
        warranty: 'KSELB Inspectorate Sign-off',
        serviceId: 'commercial-electrical'
    },
    {
        id: 'earth-pit-kottayam',
        title: 'Chemical Earth Pit & Low Resistance Ground Rod Installation',
        category: 'Earthing & Safety',
        location: 'Kottayam Town',
        district: 'Kottayam',
        duration: '3 Hours',
        completedDate: 'Recent Job',
        rating: 5.0,
        problem: 'Tingling shock sensation felt on washing machine and geyser metal bodies due to dry soil earthing failure.',
        solution: 'Drilled 10-ft earth bore, installed copper-bonded chemical ground electrode with Marconite compound, bringing earth resistance down to 0.65 Ω.',
        materials: ['10-ft Copper Bonded Electrode', 'Eco Earth Chemical Compound', 'Heavy Gauge Copper Earth Strip'],
        warranty: 'KSEB Safety Compliance Passed',
        serviceId: 'earthing-spike'
    }
];

const CATEGORIES = ['All', 'DB & Switchgear', 'Wiring & Switches', 'Solar & Inverter', 'CCTV & Security', 'Commercial', 'Earthing & Safety'];

export default function WorkShowcaseScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'All') return WORK_PROJECTS;
        return WORK_PROJECTS.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>Recent Projects & Before/After Work Portfolio | Sheriyakam Kerala</title>
                <meta name="description" content="View completed electrical installations, DB replacements, 3-phase wiring, CCTV setups, and solar inverter projects executed by licensed KSELB electricians across Kerala." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/work" />
            </Head>

            {/* Top Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Project Portfolio</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Verified Installations Across Kerala</Text>
                </View>
                <Button variant="primary" size="sm" onPress={() => router.push('/services')}>
                    Book Service
                </Button>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Introduction */}
                <View style={[styles.heroIntro, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <Badge variant="info" size="md">Real Kerala Electrical Workmanship</Badge>
                    <Text style={[styles.heroHeading, { color: colors.textPrimary }]}>
                        Verified Before & After Electrical Solutions
                    </Text>
                    <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                        Every project adheres strictly to BIS/IS 732 safety codes, uses genuine certified materials, and is signed off by KSELB licensed wiremen & supervisors.
                    </Text>
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: activeCategory === cat ? colors.accent : (isDark ? '#18181B' : '#FFFFFF'),
                                    borderColor: activeCategory === cat ? colors.accent : (isDark ? '#27272A' : '#E4E4E7')
                                }
                            ]}
                        >
                            <Text style={[
                                styles.filterChipText,
                                { color: activeCategory === cat ? '#000000' : colors.textSecondary }
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Projects Grid */}
                <View style={[styles.projectsGrid, isDesktop && styles.desktopGrid]}>
                    {filteredProjects.map((proj) => (
                        <Card key={proj.id} variant="default" style={styles.projectCard}>
                            <View style={styles.cardTopRow}>
                                <Badge variant="info" size="sm">{proj.category}</Badge>
                                <View style={styles.locationBadge}>
                                    <MapPin size={13} color={colors.accent} />
                                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>{proj.location}</Text>
                                </View>
                            </View>

                            <Text style={[styles.projectTitle, { color: colors.textPrimary }]}>
                                {proj.title}
                            </Text>

                            <View style={styles.metaRow}>
                                <View style={styles.starRow}>
                                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                    <Text style={[styles.starText, { color: colors.textPrimary }]}>{proj.rating}</Text>
                                </View>
                                <Text style={[styles.metaDuration, { color: colors.textTertiary }]}>Completed in {proj.duration}</Text>
                            </View>

                            {/* Problem vs Solution Comparison Box */}
                            <View style={[styles.comparisonBox, { backgroundColor: isDark ? '#27272A44' : '#F4F4F5' }]}>
                                <View style={styles.problemRow}>
                                    <Text style={styles.problemLabel}>Issue Found:</Text>
                                    <Text style={[styles.problemDesc, { color: colors.textSecondary }]}>{proj.problem}</Text>
                                </View>
                                <View style={styles.solutionRow}>
                                    <Text style={styles.solutionLabel}>Engineered Fix:</Text>
                                    <Text style={[styles.solutionDesc, { color: colors.textPrimary }]}>{proj.solution}</Text>
                                </View>
                            </View>

                            {/* Materials Used */}
                            <View style={styles.materialsSection}>
                                <Text style={[styles.materialsTitle, { color: colors.textTertiary }]}>MATERIALS & SPECIFICATIONS:</Text>
                                <View style={styles.materialChips}>
                                    {proj.materials.map((mat, idx) => (
                                        <View key={idx} style={[styles.matChip, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                            <CheckCircle2 size={12} color="#10B981" />
                                            <Text style={[styles.matChipText, { color: colors.textPrimary }]}>{mat}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Card Footer */}
                            <View style={[styles.cardFooter, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                <View style={styles.warrantyBox}>
                                    <ShieldCheck size={14} color="#10B981" />
                                    <Text style={[styles.warrantyText, { color: '#10B981' }]}>{proj.warranty}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => router.push(`/service/${proj.serviceId}`)}
                                    style={styles.bookSimilarBtn}
                                >
                                    <Text style={[styles.bookSimilarText, { color: colors.accent }]}>Book Similar Fix</Text>
                                    <ArrowRight size={14} color={colors.accent} />
                                </TouchableOpacity>
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
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroIntro: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        gap: 8,
    },
    heroHeading: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.3,
    },
    heroSubText: {
        fontSize: 13,
        lineHeight: 20,
    },
    filterScroll: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '700',
    },
    projectsGrid: {
        gap: 16,
    },
    desktopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    projectCard: {
        flex: 1,
        minWidth: 320,
        padding: 18,
        borderRadius: 16,
        justifyContent: 'space-between',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '600',
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starText: {
        fontSize: 13,
        fontWeight: '700',
    },
    metaDuration: {
        fontSize: 12,
    },
    comparisonBox: {
        padding: 12,
        borderRadius: 10,
        gap: 8,
        marginBottom: 12,
    },
    problemRow: {
        gap: 2,
    },
    problemLabel: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    problemDesc: {
        fontSize: 12,
        lineHeight: 18,
    },
    solutionRow: {
        gap: 2,
    },
    solutionLabel: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    solutionDesc: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
    },
    materialsSection: {
        gap: 6,
        marginBottom: 14,
    },
    materialsTitle: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.6,
    },
    materialChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    matChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    matChipText: {
        fontSize: 11,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    warrantyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    warrantyText: {
        fontSize: 12,
        fontWeight: '700',
    },
    bookSimilarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    bookSimilarText: {
        fontSize: 12,
        fontWeight: '800',
    },
});
