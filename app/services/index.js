import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
    useWindowDimensions, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, Search, Star, Clock, ShieldCheck, Zap,
    ChevronRight, CheckCircle2, Phone, MessageCircle, AlertTriangle, Plus, Check
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, SPACING } from '../../constants/theme';
import { CATEGORIES, getAllServices } from '../../constants/catalog';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import FloatingCartBar from '../../components/FloatingCartBar';
import { openWhatsApp } from '../../utils/whatsapp';

export default function ServicesMarketplaceScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const isTablet = width >= 640 && width < 1024;
    const { addItem, items } = useCart();
    const { success } = useToast();

    const [selectedCategory, setSelectedCategory] = useState('electrical');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddToCart = (e, service) => {
        e?.stopPropagation?.();
        addItem({
            id: service.id || service.slug,
            title: service.title,
            price: service.startingPrice || service.price || 299,
            duration: service.duration,
            category: service.categoryName || 'Home Service',
        }, 1);
        success(`Added "${service.title}" to cart!`, 'Cart Updated');
    };

    const currentCategory = useMemo(() => {
        return CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
    }, [selectedCategory]);

    const filteredServices = useMemo(() => {
        const all = getAllServices();
        let result = all;

        if (selectedCategory) {
            result = result.filter(s => s.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                (s.problemsCovered || []).some(p => p.toLowerCase().includes(q))
            );
        }
        return result;
    }, [selectedCategory, searchQuery]);

    const handleWhatsAppHelp = () => {
        openWhatsApp("Hi Sheriyakam, I would like to inquire about home service booking in Kerala.");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>All Home Services & Upfront Rate Card | Sheriyakam Kerala</title>
                <meta name="description" content="Browse Kerala's certified service directory: Fan repair, DB tripping, house rewiring, AC foam jet service, CCTV & Smart Home automation. Transparent upfront rates with 30-day warranty." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/services" />
            </Head>

            {/* Top Navigation Bar */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Service Catalogue</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Kerala's Certified Home-Services Directory</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/emergency-electrician')} style={styles.emergencyBtn}>
                    <Zap size={14} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.emergencyBtnText}>Emergency</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <Search size={18} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Search services — fan, switch, MCB tripping, AC..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={{ color: colors.textTertiary, paddingHorizontal: 6 }}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Category Selector Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryTabsWrap}
                >
                    {CATEGORIES.map(cat => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                                style={[
                                    styles.categoryTab,
                                    {
                                        backgroundColor: isActive ? colors.accent : (isDark ? '#18181B' : '#FFFFFF'),
                                        borderColor: isActive ? colors.accent : (isDark ? '#27272A' : '#E4E4E7'),
                                    }
                                ]}
                            >
                                <Text style={[styles.categoryTabText, { color: isActive ? '#FFFFFF' : colors.textPrimary }]}>
                                    {cat.shortName}
                                </Text>
                                {cat.comingSoon && (
                                    <View style={styles.comingSoonPill}>
                                        <Text style={styles.comingSoonText}>Soon</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Active Category Banner */}
                <View style={[styles.categoryBanner, { backgroundColor: isDark ? '#131B2E' : '#EFF6FF', borderColor: isDark ? '#1E293B' : '#DBEAFE' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>{currentCategory.name}</Text>
                        <Text style={[styles.bannerTagline, { color: colors.accent }]}>✓ {currentCategory.tagline}</Text>
                        <Text style={[styles.bannerDesc, { color: colors.textSecondary }]}>{currentCategory.description}</Text>
                    </View>
                </View>

                {/* Services List Grid */}
                <View style={styles.sectionHeadingRow}>
                    <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                        Available Services ({filteredServices.length})
                    </Text>
                    <Text style={[styles.warrantyPill, { color: colors.textTertiary }]}>
                        🛡️ 30-Day Rework Warranty
                    </Text>
                </View>

                {filteredServices.length === 0 ? (
                    <View style={[styles.emptyBox, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <AlertTriangle size={36} color={colors.accent} />
                        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Services Found</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            Try searching for something else or browse all electrical services.
                        </Text>
                        <Button
                            variant="primary"
                            size="md"
                            onPress={() => { setSelectedCategory('electrical'); setSearchQuery(''); }}
                            style={{ marginTop: 12 }}
                        >
                            View All Electrical Services
                        </Button>
                    </View>
                ) : (
                    <View style={[styles.servicesGrid, isDesktop && styles.servicesGridDesktop]}>
                        {filteredServices.map(service => (
                            <Card
                                key={service.id}
                                variant="elevated"
                                style={[
                                    styles.serviceCard,
                                    isDesktop ? { width: '48.8%' } : { width: '100%' }
                                ]}
                                onPress={() => router.push(`/service/${service.id}`)}
                            >
                                <View style={styles.cardTopRow}>
                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                        <Badge variant="primary" size="sm">{service.subcategoryName || 'Certified Service'}</Badge>
                                        <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                                            {service.title}
                                        </Text>
                                    </View>
                                    <View style={styles.priceCol}>
                                        <Text style={[styles.priceTag, { color: colors.accent }]}>
                                            ₹{service.startingPrice}
                                        </Text>
                                        <Text style={[styles.priceSub, { color: colors.textTertiary }]}>Starting rate</Text>
                                    </View>
                                </View>

                                <Text style={[styles.serviceCardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                                    {service.description}
                                </Text>

                                <View style={styles.symptomsList}>
                                    {(service.problemsCovered || []).slice(0, 2).map((prob, idx) => (
                                        <View key={idx} style={styles.symptomItem}>
                                            <CheckCircle2 size={13} color="#10B981" />
                                            <Text style={[styles.symptomText, { color: colors.textSecondary }]} numberOfLines={1}>
                                                {prob}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={[styles.cardFooter, { borderTopColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Star size={13} color="#F59E0B" fill="#F59E0B" />
                                            <Text style={[styles.metaText, { color: colors.textPrimary }]}>{service.rating}</Text>
                                            <Text style={[styles.metaCount, { color: colors.textTertiary }]}>({service.reviewsCount})</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Clock size={13} color={colors.textTertiary} />
                                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{service.duration}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <TouchableOpacity
                                            onPress={(e) => handleAddToCart(e, service)}
                                            style={{
                                                backgroundColor: (items || []).some(i => i.id === (service.id || service.slug)) ? '#10B981' : colors.accent,
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 8,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 4
                                            }}
                                        >
                                            {(items || []).some(i => i.id === (service.id || service.slug)) ? (
                                                <>
                                                    <Check size={12} color="#FFFFFF" />
                                                    <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Added</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={12} color="#FFFFFF" />
                                                    <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Add</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                        <ChevronRight size={14} color={colors.textTertiary} />
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </View>
                )}

                {/* Support & Commercial Footer Banner */}
                <View style={[styles.helpBanner, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>Need a custom quote or commercial service?</Text>
                        <Text style={[styles.helpSub, { color: colors.textSecondary }]}>
                            Speak directly with our senior electrical supervisors for site inspection and project estimates.
                        </Text>
                    </View>
                    <View style={styles.helpActions}>
                        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppHelp}>
                            <MessageCircle size={14} color="#FFFFFF" />
                            <Text style={styles.whatsappBtnText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callBtn} onPress={() => router.push('/commercial')}>
                            <Text style={styles.callBtnText}>Commercial B2B</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <FloatingCartBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 6 },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    headerSub: { fontSize: 12, marginTop: 1 },
    emergencyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#EF444415',
        borderColor: '#EF444440',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    emergencyBtnText: { fontSize: 12, fontWeight: '800', color: '#EF4444' },
    scrollContent: {
        padding: SPACING.md,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        paddingBottom: 90,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
        marginBottom: 14,
    },
    searchInput: { flex: 1, fontSize: 14 },
    categoryTabsWrap: {
        gap: 8,
        paddingBottom: 14,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryTabText: { fontSize: 13, fontWeight: '700' },
    comingSoonPill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    comingSoonText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
    categoryBanner: {
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 18,
    },
    bannerTitle: { fontSize: 18, fontWeight: '800' },
    bannerTagline: { fontSize: 13, fontWeight: '700', marginTop: 3 },
    bannerDesc: { fontSize: 12, lineHeight: 18, marginTop: 4 },
    sectionHeadingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionHeading: { fontSize: 16, fontWeight: '800' },
    warrantyPill: { fontSize: 12, fontWeight: '600' },
    servicesGrid: {
        gap: 12,
    },
    servicesGridDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceCard: {
        padding: 16,
        borderRadius: 14,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceCardTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginTop: 6,
        lineHeight: 20,
    },
    priceCol: { alignItems: 'flex-end' },
    priceTag: { fontSize: 18, fontWeight: '800' },
    priceSub: { fontSize: 10 },
    serviceCardDesc: {
        fontSize: 12,
        lineHeight: 18,
        marginVertical: 10,
    },
    symptomsList: {
        gap: 4,
        marginBottom: 12,
    },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    symptomText: { fontSize: 12 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: { fontSize: 12, fontWeight: '700' },
    metaCount: { fontSize: 11 },
    emptyBox: {
        padding: 24,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        marginVertical: 20,
        gap: 8,
    },
    emptyTitle: { fontSize: 16, fontWeight: '800' },
    emptyDesc: { fontSize: 13, textAlign: 'center', maxWidth: 360 },
    helpBanner: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 24,
        gap: 12,
    },
    helpTitle: { fontSize: 14, fontWeight: '800' },
    helpSub: { fontSize: 12, lineHeight: 18, marginTop: 2 },
    helpActions: { flexDirection: 'row', gap: 8 },
    whatsappBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#25D366',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    whatsappBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
    callBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    callBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }
});
