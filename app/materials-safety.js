import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Flame, Zap, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const BIS_MATERIALS = [
    {
        category: 'Miniature Circuit Breakers (MCB) & Isolators',
        standard: 'IS/IEC 60898-1:2015',
        origin: 'Made in India',
        brands: 'Havells, Schneider Electric, L&T, Legrand',
        specs: '10kA breaking capacity, Type C tripping curve, thermal-magnetic overcurrent protection.',
        icon: Zap,
        color: '#3B82F6',
    },
    {
        category: 'Flame Retardant (FR / FRLS) Copper Wires',
        standard: 'IS 694:2010 (99.97% Electrolytic Copper)',
        origin: 'Made in India',
        brands: 'Finolex, Polycab, RR Kabel, V-Guard',
        specs: 'Class 5 flexible copper conductor, 85°C heat resistance, zero toxic halogen emissions.',
        icon: Flame,
        color: '#EF4444',
    },
    {
        category: 'Modular Switches, Sockets & Regulators',
        standard: 'IS 3854:1997 & IS 1293:2019',
        origin: 'Made in India',
        brands: 'Anchor by Panasonic, Crabtree, GM Modular',
        specs: 'Silver cadmium oxide contacts, fire-retardant polycarbonate housing, child safety shutters.',
        icon: Layers,
        color: '#10B981',
    },
    {
        category: 'Motor Running Fan Capacitors',
        standard: 'IS 1709 / IS 2993',
        origin: 'Made in India',
        brands: 'Epcos, Tibcon, Keltron',
        specs: 'Self-healing metallized polypropylene film, burst-proof safety pressure disconnector.',
        icon: Award,
        color: '#F59E0B',
    },
];

export default function MaterialsSafetyScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    BIS & Material Safety Standards
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold" size="md">National Electrical Code (India) 2023</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        100% Certified Genuine ISI Mark Materials
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Under the Bureau of Indian Standards Act 2016 and Electrical Equipment Quality Control Orders, all spare parts procured via Sheriyakam strictly carry authentic ISI certifications and Country of Origin declarations.
                    </Text>
                </View>

                {/* Material Standards List */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    BUREAU OF INDIAN STANDARDS (BIS) COMPLIANCE SPECIFICATIONS
                </Text>

                <View style={styles.materialsList}>
                    {BIS_MATERIALS.map((mat, idx) => {
                        const Icon = mat.icon;
                        return (
                            <Card key={idx} variant="default" style={styles.materialCard}>
                                <View style={styles.cardTop}>
                                    <View style={[styles.iconWrap, { backgroundColor: mat.color + '18' }]}>
                                        <Icon size={22} color={mat.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.matCategory, { color: colors.textPrimary }]}>
                                            {mat.category}
                                        </Text>
                                        <Badge variant="neutral" size="sm">ISI: {mat.standard}</Badge>
                                    </View>
                                </View>

                                <View style={[styles.infoRow, { marginTop: 6 }]}>
                                    <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Authorized Brands:</Text>
                                    <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{mat.brands}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Country of Origin:</Text>
                                    <Text style={[styles.infoVal, { color: '#10B981', fontWeight: '700' }]}>{mat.origin}</Text>
                                </View>

                                <Text style={[styles.matSpecs, { color: colors.textSecondary }]}>
                                    {mat.specs}
                                </Text>
                            </Card>
                        );
                    })}
                </View>

                {/* Zero Counterfeit Guarantee */}
                <Card variant="elevated" style={styles.guaranteeCard}>
                    <View style={styles.guaranteeHeader}>
                        <ShieldCheck size={24} color="#10B981" />
                        <Text style={[styles.guaranteeTitle, { color: colors.textPrimary }]}>
                            Zero Counterfeit Guarantee & Manufacturer Warranty
                        </Text>
                    </View>
                    <Text style={[styles.guaranteeDesc, { color: colors.textSecondary }]}>
                        Every switch, wire roll, and MCB installed in your home is sourced directly from authorized Tier-1 distributors in Kozhikode. All manufacturer warranty cards are handed over to the homeowner upon job sign-off.
                    </Text>
                </Card>
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
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 12,
        gap: 6,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.4,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    materialsList: {
        gap: 12,
    },
    materialCard: {
        padding: 16,
        gap: 8,
    },
    cardTop: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    matCategory: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
    },
    infoVal: {
        fontSize: 12,
        fontWeight: '600',
    },
    matSpecs: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 4,
    },
    guaranteeCard: {
        padding: 18,
        marginTop: 18,
        gap: 8,
    },
    guaranteeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    guaranteeTitle: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    guaranteeDesc: {
        fontSize: 13,
        lineHeight: 19,
    },
});
