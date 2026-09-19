import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
    useWindowDimensions, Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, Star, Clock, ShieldCheck, Check, ShoppingCart,
    Zap, HelpCircle, ChevronDown, ChevronUp, AlertCircle, Phone, MessageCircle,
    CheckCircle2, XCircle, Shield
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getServiceBySlugOrId, getAllServices } from '../../constants/catalog';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Checkbox } from '../../components/ui/Checkbox';
import { openWhatsApp } from '../../utils/whatsapp';

export default function SingleServiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { addItem, itemCount } = useCart();
    const { success } = useToast();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    const catalogService = useMemo(() => {
        return getServiceBySlugOrId(id);
    }, [id]);

    const service = catalogService || {
        id: id || 'custom-service',
        title: typeof id === 'string' ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Electrical Service',
        categoryName: 'Electrical',
        subcategoryName: 'Diagnostics & Repair',
        startingPrice: 299,
        duration: '45–60 mins',
        rating: 4.8,
        reviewsCount: 180,
        completedJobs: '950+',
        warrantyDays: 30,
        description: 'Certified home electrical troubleshooting and repairs by KSELB licensed technicians.',
        problemsCovered: [
            'Inspection and symptom diagnosis',
            'Safe power isolation and connection test',
            'Replacement of damaged wiring/components'
        ],
        inclusions: [
            'Thorough diagnostic testing of lines',
            'Safe labor and connection rework',
            'Post-service safety & load verification'
        ],
        exclusions: [
            'Cost of new hardware / replacement parts',
            'Concealed civil slab breaking or masonry repairs'
        ],
        materialsPolicy: 'All replacement parts are provided at genuine MRP with manufacturer GST bill.',
        addons: [],
        faqs: []
    };

    const [selectedAddons, setSelectedAddons] = useState([]);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleAddon = (addon) => {
        setSelectedAddons((prev) => {
            const exists = prev.some((a) => a.id === addon.id);
            if (exists) return prev.filter((a) => a.id !== addon.id);
            return [...prev, addon];
        });
    };

    const addonsTotal = selectedAddons.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalPrice = (service.startingPrice || service.price || 299) + addonsTotal;

    const handleAddToCart = () => {
        addItem({
            id: service.id || service.slug,
            title: service.title,
            price: service.startingPrice || service.price || 299,
            duration: service.duration,
            category: service.categoryName || 'Electrical',
        }, 1, selectedAddons);
        success(`Added "${service.title}" to cart!`, 'Cart Updated');
    };

    const handleBookNow = () => {
        addItem({
            id: service.id || service.slug,
            title: service.title,
            price: service.startingPrice || service.price || 299,
            duration: service.duration,
            category: service.categoryName || 'Electrical',
        }, 1, selectedAddons);
        router.push('/cart');
    };

    const handleWhatsAppInquiry = () => {
        const text = `Hi Sheriyakam, I want to book: *${service.title}* (₹${totalPrice}). Please confirm availability.`;
        openWhatsApp(text);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>{`${service.title} in Kerala | ₹${service.startingPrice || 299} | Sheriyakam`}</title>
                <meta name="description" content={`Book professional ${service.title} across Kerala. KSELB licensed technicians, upfront pricing of ₹${service.startingPrice || 299}, 30-day warranty & 90-min dispatch.`} />
                <link rel="canonical" href={`https://sheriyakam.vercel.app/service/${id}`} />
            </Head>

            {/* Top Navigation */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    {service.title}
                </Text>
                <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartIconBtn}>
                    <ShoppingCart size={20} color={colors.textPrimary} />
                    {itemCount > 0 ? (
                        <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.cartBadgeText}>{itemCount}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageLayout, isDesktop && styles.desktopLayout]}>
                    {/* Left / Main Details Column */}
                    <View style={{ flex: 1 }}>
                        {/* Service Title & Primary Meta */}
                        <Card variant="default" style={styles.heroCard}>
                            <View style={styles.categoryBreadcrumb}>
                                <Text style={[styles.breadcrumbCategory, { color: colors.accent }]}>
                                    {service.categoryName || 'Home Services'}
                                </Text>
                                {service.subcategoryName && (
                                    <>
                                        <Text style={{ color: colors.textTertiary }}>›</Text>
                                        <Text style={[styles.breadcrumbSub, { color: colors.textSecondary }]}>
                                            {service.subcategoryName}
                                        </Text>
                                    </>
                                )}
                            </View>

                            <Text style={[styles.title, { color: colors.textPrimary }]}>
                                {service.title}
                            </Text>

                            <View style={styles.metaRow}>
                                <View style={styles.ratingBadge}>
                                    <Star size={15} color="#F59E0B" fill="#F59E0B" />
                                    <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                                        {service.rating || 4.8}
                                    </Text>
                                    <Text style={[styles.reviewsCount, { color: colors.textTertiary }]}>
                                        ({service.reviewsCount || 150}+ ratings)
                                    </Text>
                                </View>

                                <View style={styles.durationBadge}>
                                    <Clock size={15} color={colors.textTertiary} />
                                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                                        {service.duration || '45 mins'}
                                    </Text>
                                </View>

                                {service.completedJobs && (
                                    <Badge variant="success" size="sm">
                                        {service.completedJobs} Bookings Done
                                    </Badge>
                                )}
                            </View>

                            <View style={styles.priceContainer}>
                                <View style={styles.priceRow}>
                                    <Text style={[styles.currencySymbol, { color: colors.accent }]}>₹</Text>
                                    <Text style={[styles.priceVal, { color: colors.accent }]}>
                                        {service.startingPrice || service.price || 299}
                                    </Text>
                                    <Text style={[styles.startingAtText, { color: colors.textTertiary }]}>
                                        (Upfront Diagnostic & Service Labour)
                                    </Text>
                                </View>
                            </View>

                            {/* Trust Guarantee Highlights */}
                            <View style={[styles.guaranteeRow, { backgroundColor: isDark ? '#27272A55' : '#F4F4F5' }]}>
                                <View style={styles.guaranteeItem}>
                                    <ShieldCheck size={16} color="#10B981" />
                                    <Text style={[styles.guaranteeItemText, { color: colors.textPrimary }]}>
                                        {service.warrantyDays || 30}-Day Free Rework Warranty
                                    </Text>
                                </View>
                                <View style={styles.guaranteeItem}>
                                    <Zap size={16} color="#F59E0B" />
                                    <Text style={[styles.guaranteeItemText, { color: colors.textPrimary }]}>
                                        KSELB Licensed Partner
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Description */}
                        <Card variant="default" style={styles.sectionCard}>
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Service Overview</Text>
                            <Text style={[styles.descText, { color: colors.textSecondary }]}>
                                {service.description}
                            </Text>
                        </Card>

                        {/* Common Symptoms / Problems Covered */}
                        {service.problemsCovered && service.problemsCovered.length > 0 && (
                            <Card variant="default" style={styles.sectionCard}>
                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Common Issues Covered</Text>
                                <View style={styles.listWrap}>
                                    {service.problemsCovered.map((prob, i) => (
                                        <View key={i} style={styles.problemItem}>
                                            <AlertCircle size={16} color="#F59E0B" style={{ marginTop: 2 }} />
                                            <Text style={[styles.listText, { color: colors.textSecondary }]}>{prob}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        )}

                        {/* Inclusions & Exclusions */}
                        <View style={[styles.inclusionExclusionWrap, isDesktop && { flexDirection: 'row', gap: 12 }]}>
                            {/* Inclusions */}
                            <Card variant="default" style={[styles.sectionCard, { flex: 1 }]}>
                                <View style={styles.cardHeaderWithIcon}>
                                    <CheckCircle2 size={18} color="#10B981" />
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
                                        What's Included
                                    </Text>
                                </View>
                                <View style={[styles.listWrap, { marginTop: 12 }]}>
                                    {(service.inclusions || []).map((inc, i) => (
                                        <View key={i} style={styles.listItem}>
                                            <Check size={15} color="#10B981" style={{ marginTop: 2 }} />
                                            <Text style={[styles.listText, { color: colors.textSecondary }]}>{inc}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>

                            {/* Exclusions */}
                            <Card variant="default" style={[styles.sectionCard, { flex: 1 }]}>
                                <View style={styles.cardHeaderWithIcon}>
                                    <XCircle size={18} color="#EF4444" />
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
                                        What's Not Included
                                    </Text>
                                </View>
                                <View style={[styles.listWrap, { marginTop: 12 }]}>
                                    {(service.exclusions || []).map((exc, i) => (
                                        <View key={i} style={styles.listItem}>
                                            <Text style={{ color: '#EF4444', fontWeight: '800', marginRight: 4 }}>✕</Text>
                                            <Text style={[styles.listText, { color: colors.textSecondary }]}>{exc}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        </View>

                        {/* Transparent Materials & Spares Policy */}
                        {service.materialsPolicy && (
                            <Card variant="default" style={[styles.sectionCard, { borderColor: '#10B98133' }]}>
                                <View style={styles.cardHeaderWithIcon}>
                                    <Shield size={18} color="#10B981" />
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
                                        Spare Parts & Materials Policy
                                    </Text>
                                </View>
                                <Text style={[styles.descText, { color: colors.textSecondary, marginTop: 8 }]}>
                                    {service.materialsPolicy}
                                </Text>
                            </Card>
                        )}

                        {/* Optional Spare Parts Add-ons */}
                        {service.addons && service.addons.length > 0 && (
                            <Card variant="default" style={styles.sectionCard}>
                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                    Common Spares & Add-ons (Optional)
                                </Text>
                                <Text style={[styles.descSub, { color: colors.textTertiary, marginBottom: 12 }]}>
                                    Add genuine ISI certified parts to your booking or let the technician bring them.
                                </Text>
                                <View style={styles.addonsList}>
                                    {service.addons.map((addon) => {
                                        const isChecked = selectedAddons.some((a) => a.id === addon.id);
                                        return (
                                            <TouchableOpacity
                                                key={addon.id}
                                                onPress={() => toggleAddon(addon)}
                                                style={[
                                                    styles.addonItem,
                                                    {
                                                        backgroundColor: isChecked ? (isDark ? '#27272A' : '#EFF6FF') : 'transparent',
                                                        borderColor: isChecked ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                                    }
                                                ]}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={() => toggleAddon(addon)}
                                                    label={addon.title}
                                                />
                                                <Text style={[styles.addonPrice, { color: colors.accent }]}>
                                                    +₹{addon.price}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </Card>
                        )}

                        {/* Frequently Asked Questions */}
                        {service.faqs && service.faqs.length > 0 && (
                            <Card variant="default" style={styles.sectionCard}>
                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                    Frequently Asked Questions
                                </Text>
                                <View style={styles.faqList}>
                                    {service.faqs.map((faq, index) => {
                                        const isOpen = openFaqIndex === index;
                                        return (
                                            <View key={index} style={[styles.faqItem, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                                                <TouchableOpacity
                                                    onPress={() => setOpenFaqIndex(isOpen ? null : index)}
                                                    style={styles.faqHeader}
                                                >
                                                    <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                                                        {faq.q}
                                                    </Text>
                                                    {isOpen ? (
                                                        <ChevronUp size={18} color={colors.textSecondary} />
                                                    ) : (
                                                        <ChevronDown size={18} color={colors.textSecondary} />
                                                    )}
                                                </TouchableOpacity>
                                                {isOpen && (
                                                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                                                        {faq.a}
                                                    </Text>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            </Card>
                        )}
                    </View>

                    {/* Right Desktop Checkout Column */}
                    {isDesktop && (
                        <View style={{ width: 360 }}>
                            <Card variant="default" style={styles.desktopBookingCard}>
                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Booking Summary</Text>

                                <View style={styles.summaryItemRow}>
                                    <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>{service.title}</Text>
                                    <Text style={[styles.summaryItemVal, { color: colors.textPrimary }]}>₹{service.startingPrice || 299}</Text>
                                </View>

                                {selectedAddons.map(add => (
                                    <View key={add.id} style={styles.summaryItemRow}>
                                        <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>{add.title}</Text>
                                        <Text style={[styles.summaryItemVal, { color: colors.accent }]}>+₹{add.price}</Text>
                                    </View>
                                ))}

                                <View style={[styles.summaryDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                                <View style={styles.summaryTotalRow}>
                                    <Text style={[styles.summaryTotalLabel, { color: colors.textPrimary }]}>Total Payable</Text>
                                    <Text style={[styles.summaryTotalVal, { color: colors.accent }]}>₹{totalPrice}</Text>
                                </View>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    onPress={handleBookNow}
                                    style={{ marginTop: 16 }}
                                >
                                    Proceed to Schedule
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    onPress={handleAddToCart}
                                    iconLeft={ShoppingCart}
                                    style={{ marginTop: 10 }}
                                >
                                    Add to Cart
                                </Button>

                                <TouchableOpacity onPress={handleWhatsAppInquiry} style={styles.whatsAppInquiryBtn}>
                                    <MessageCircle size={16} color="#25D366" />
                                    <Text style={styles.whatsAppInquiryText}>Inquire via WhatsApp</Text>
                                </TouchableOpacity>

                                <View style={styles.desktopTrustFooter}>
                                    <ShieldCheck size={14} color="#10B981" />
                                    <Text style={[styles.desktopTrustText, { color: colors.textTertiary }]}>
                                        ₹5 Lakh domestic property damage cover included
                                    </Text>
                                </View>
                            </Card>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Mobile Bottom Floating Bar */}
            {!isDesktop && (
                <View style={[
                    styles.bottomBar,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    <Button
                        variant="outline"
                        size="lg"
                        onPress={handleAddToCart}
                        iconLeft={ShoppingCart}
                        style={{ flex: 1 }}
                    >
                        Add
                    </Button>

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleBookNow}
                        style={{ flex: 1.6 }}
                    >
                        Book • ₹{totalPrice}
                    </Button>
                </View>
            )}
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
        flex: 1,
        marginHorizontal: 10,
    },
    cartIconBtn: {
        position: 'relative',
        padding: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 110,
    },
    pageLayout: {
        gap: 16,
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    heroCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
    },
    categoryBreadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    breadcrumbCategory: {
        fontSize: 13,
        fontWeight: '700',
    },
    breadcrumbSub: {
        fontSize: 13,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 14,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '800',
    },
    reviewsCount: {
        fontSize: 12,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 13,
    },
    priceContainer: {
        paddingVertical: 8,
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '700',
    },
    priceVal: {
        fontSize: 28,
        fontWeight: '900',
    },
    startingAtText: {
        fontSize: 12,
        marginLeft: 4,
    },
    guaranteeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        borderRadius: 10,
        gap: 14,
    },
    guaranteeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    guaranteeItemText: {
        fontSize: 12,
        fontWeight: '700',
    },
    sectionCard: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 14,
    },
    cardHeaderWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 8,
    },
    descText: {
        fontSize: 13,
        lineHeight: 20,
    },
    descSub: {
        fontSize: 12,
    },
    listWrap: {
        gap: 8,
    },
    problemItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    listText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    inclusionExclusionWrap: {
        gap: 12,
        marginBottom: 12,
    },
    addonsList: {
        gap: 8,
    },
    addonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    addonPrice: {
        fontSize: 13,
        fontWeight: '700',
    },
    faqList: {
        gap: 10,
    },
    faqItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    faqQuestion: {
        fontSize: 13,
        fontWeight: '700',
        flex: 1,
        paddingRight: 10,
    },
    faqAnswer: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
    },
    desktopBookingCard: {
        padding: 20,
        borderRadius: 16,
        position: 'sticky',
        top: 20,
    },
    summaryItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    summaryItemLabel: {
        fontSize: 13,
        flex: 1,
    },
    summaryItemVal: {
        fontSize: 13,
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        marginVertical: 12,
    },
    summaryTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryTotalLabel: {
        fontSize: 15,
        fontWeight: '800',
    },
    summaryTotalVal: {
        fontSize: 22,
        fontWeight: '900',
    },
    whatsAppInquiryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        marginTop: 6,
    },
    whatsAppInquiryText: {
        color: '#25D366',
        fontSize: 13,
        fontWeight: '700',
    },
    desktopTrustFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
    },
    desktopTrustText: {
        fontSize: 11,
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
    },
});
