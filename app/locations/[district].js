import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    useWindowDimensions, Platform, Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, MapPin, Clock, Users, ShieldCheck, Zap,
    Phone, MessageCircle, Star, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { getDistrictByIdOrName, KERALA_DISTRICTS } from '../../constants/locations';
import { getAllServices } from '../../constants/catalog';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function DistrictDetailScreen() {
    const { district: districtParam } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    const districtData = useMemo(() => {
        return getDistrictByIdOrName(districtParam) || KERALA_DISTRICTS[0];
    }, [districtParam]);

    const featuredServices = useMemo(() => {
        const all = getAllServices();
        return all.slice(0, 6);
    }, []);

    const [selectedMuni, setSelectedMuni] = useState(districtData.municipalities[0]?.name || '');

    const handleCallHelpline = () => {
        const phoneUrl = `tel:${districtData.phone || '+914952800000'}`;
        if (Platform.OS === 'web') window.location.href = phoneUrl;
        else Linking.openURL(phoneUrl);
    };

    const handleWhatsAppDispatch = () => {
        const text = `Hi Sheriyakam, I need an electrician in *${districtData.name}* (Locality: ${selectedMuni || districtData.name}). Please confirm available technician.`;
        const url = `https://wa.me/914952800000?text=${encodeURIComponent(text)}`;
        if (Platform.OS === 'web') window.open(url, '_blank');
        else Linking.openURL(url);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>{`Electrician Services in ${districtData.name} (${districtData.malayalam}) | Sheriyakam`}</title>
                <meta name="description" content={`Book KSELB certified electricians in ${districtData.name}, Kerala. Average arrival time: ${districtData.averageArrivalMins} mins. Upfront pricing, 30-day warranty, and 24/7 emergency support.`} />
                <link rel="canonical" href={`https://sheriyakam.vercel.app/locations/${districtData.id}`} />
            </Head>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{districtData.name} Hub</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{districtData.malayalam} • {districtData.coverageBadge}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/emergency-electrician')} style={styles.emergencyBtn}>
                    <Zap size={14} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.emergencyBtnText}>Emergency</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero District Card */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#1E293B' }]}>
                    <Badge variant="info" size="md">{districtData.coverageBadge}</Badge>
                    <Text style={styles.heroTitle}>
                        Electrician & Home Services in {districtData.name}
                    </Text>
                    <Text style={styles.heroSub}>
                        Operating across {districtData.municipalities.length} major municipalities & taluks with {districtData.availableTechnicians} active KSELB certified wiremen.
                    </Text>

                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>{districtData.averageArrivalMins} Mins</Text>
                            <Text style={styles.metricLabel}>Average Arrival</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>{districtData.availableTechnicians}</Text>
                            <Text style={styles.metricLabel}>Active Technicians</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricVal}>4.9★</Text>
                            <Text style={styles.metricLabel}>Local Rating</Text>
                        </View>
                    </View>

                    <View style={styles.actionBtnRow}>
                        <TouchableOpacity onPress={handleCallHelpline} style={styles.callBtn}>
                            <Phone size={16} color="#FFFFFF" />
                            <Text style={styles.callBtnText}>Call Hub: {districtData.phone}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleWhatsAppDispatch} style={styles.waBtn}>
                            <MessageCircle size={16} color="#FFFFFF" />
                            <Text style={styles.waBtnText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Local Municipalities & Pincode Coverage Grid */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Municipalities & Pincode Coverage in {districtData.name}
                    </Text>

                    <View style={styles.muniGrid}>
                        {districtData.municipalities.map((muni) => {
                            const isSelected = selectedMuni === muni.name;
                            return (
                                <TouchableOpacity
                                    key={muni.id}
                                    onPress={() => setSelectedMuni(muni.name)}
                                    style={[
                                        styles.muniCard,
                                        {
                                            backgroundColor: isSelected ? (isDark ? '#27272A' : '#EFF6FF') : (isDark ? '#18181B' : '#FFFFFF'),
                                            borderColor: isSelected ? colors.accent : (isDark ? '#27272A' : '#E4E4E7')
                                        }
                                    ]}
                                >
                                    <View style={styles.muniTop}>
                                        <MapPin size={15} color={colors.accent} />
                                        <Text style={[styles.muniName, { color: colors.textPrimary }]}>{muni.name}</Text>
                                    </View>
                                    <View style={styles.muniBottom}>
                                        <Text style={[styles.pincodeText, { color: colors.textTertiary }]}>PIN: {muni.pincode}</Text>
                                        <Badge variant="success" size="sm">Active</Badge>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Popular Services Rate Card */}
                <View style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Standard Rate Card in {districtData.name}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/services')}>
                            <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '700' }}>All Services ›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.servicesList}>
                        {featuredServices.map((service) => (
                            <Card key={service.id} variant="default" style={styles.serviceItemCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>{service.title}</Text>
                                    <Text style={[styles.serviceCategory, { color: colors.textTertiary }]}>{service.categoryName || 'Electrical'}</Text>
                                    <View style={styles.serviceMeta}>
                                        <Text style={[styles.servicePrice, { color: colors.accent }]}>₹{service.startingPrice || 299}</Text>
                                        <Text style={[styles.serviceDuration, { color: colors.textSecondary }]}>• {service.duration || '45 mins'}</Text>
                                        <Text style={[styles.serviceWarranty, { color: '#10B981' }]}>• 30-Day Warranty</Text>
                                    </View>
                                </View>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onPress={() => router.push(`/service/${service.slug || service.id}`)}
                                >
                                    Book
                                </Button>
                            </Card>
                        ))}
                    </View>
                </View>

                {/* Regional Safety & Compliance Guarantee */}
                <Card variant="default" style={[styles.safetyCard, { borderColor: '#10B98144' }]}>
                    <View style={styles.safetyHeader}>
                        <ShieldCheck size={22} color="#10B981" />
                        <Text style={[styles.safetyTitle, { color: colors.textPrimary }]}>
                            {districtData.name} Safety & Licensing Standards
                        </Text>
                    </View>
                    <View style={styles.safetyList}>
                        <View style={styles.safetyItem}>
                            <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                                All assigned wiremen hold active licenses certified by the Kerala Electrical Inspectorate.
                            </Text>
                        </View>
                        <View style={styles.safetyItem}>
                            <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                                Every booking includes ₹5,00,000 domestic property damage insurance protection.
                            </Text>
                        </View>
                        <View style={styles.safetyItem}>
                            <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                                Transparent upfront pricing before any job starts with zero hidden charges.
                            </Text>
                        </View>
                    </View>
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
        gap: 18,
    },
    heroCard: {
        padding: 22,
        borderRadius: 18,
        gap: 12,
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
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    metricItem: {
        alignItems: 'center',
    },
    metricVal: {
        color: '#F59E0B',
        fontSize: 18,
        fontWeight: '900',
    },
    metricLabel: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 2,
    },
    actionBtnRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    callBtn: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    callBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    waBtn: {
        backgroundColor: '#25D366',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    waBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    sectionWrap: {
        gap: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    muniGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    muniCard: {
        width: '48%',
        flexGrow: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
    },
    muniTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    muniName: {
        fontSize: 13,
        fontWeight: '700',
        flex: 1,
    },
    muniBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pincodeText: {
        fontSize: 11,
    },
    servicesList: {
        gap: 10,
    },
    serviceItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    serviceCategory: {
        fontSize: 11,
        marginBottom: 4,
    },
    serviceMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: '800',
    },
    serviceDuration: {
        fontSize: 12,
    },
    serviceWarranty: {
        fontSize: 12,
        fontWeight: '600',
    },
    safetyCard: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    safetyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    safetyTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    safetyList: {
        gap: 10,
    },
    safetyItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    safetyText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
    },
});
