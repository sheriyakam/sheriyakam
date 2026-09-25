import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    useWindowDimensions, Platform, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, MapPin, Clock, Users, ShieldCheck, Zap,
    Phone, MessageCircle, Star, CheckCircle2, ChevronRight,
    ChevronDown, ChevronUp, AlertTriangle, Award, Check,
    Plus, ShoppingBag, Info, Wrench, Shield
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, SPACING } from '../constants/theme';
import { KERALA_DISTRICTS } from '../constants/locations';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import FloatingCartBar from './FloatingCartBar';
import StickyMobileCTA from './StickyMobileCTA';
import BookingModal from './BookingModal';
import { openWhatsApp } from '../utils/whatsapp';
import { formatINR } from '../utils/validation';

export default function ServiceLandingView({
    serviceSlug,
    title,
    metaTitle,
    metaDescription,
    h1,
    tagline,
    startingPrice,
    duration,
    rating = '4.9★',
    reviewsCount = '620+',
    canonical,
    intro,
    problems = [],
    processSteps = [],
    faqs = []
}) {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    const { addToCart, items: cartItems } = useCart();
    const [selectedDistrict, setSelectedDistrict] = useState('Kozhikode');
    const [openFaqIndexes, setOpenFaqIndexes] = useState([0]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const toggleFaq = (idx) => {
        setOpenFaqIndexes(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const serviceObj = useMemo(() => ({
        id: serviceSlug,
        slug: serviceSlug,
        title: title,
        name: title,
        price: startingPrice,
        startingPrice: startingPrice,
        duration: duration,
        rating: 4.9,
        description: intro,
        warrantyDays: 30
    }), [serviceSlug, title, startingPrice, duration, intro]);

    const inCart = cartItems?.some(item => item.id === serviceSlug || item.slug === serviceSlug);

    const handleCallHelpline = () => {
        const phoneUrl = `tel:+914952800000`;
        if (Platform.OS === 'web') window.location.href = phoneUrl;
        else Linking.openURL(phoneUrl);
    };

    const handleWhatsApp = () => {
        const text = `Hi Sheriyakam, I need *${title}* in *${selectedDistrict}*, Kerala. Please confirm technician availability.`;
        openWhatsApp(text);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_IN" />

                {/* Service Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": title,
                        "description": metaDescription,
                        "provider": {
                            "@type": "HomeAndConstructionBusiness",
                            "name": "Sheriyakam",
                            "telephone": "+91 495 280 0000",
                            "url": "https://sheriyakam.vercel.app",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Thalassery Main Road",
                                "addressLocality": "Kannur",
                                "addressRegion": "Kerala",
                                "postalCode": "670101",
                                "addressCountry": "IN"
                            }
                        },
                        "areaServed": KERALA_DISTRICTS.map(d => ({
                            "@type": "AdministrativeArea",
                            "name": `${d.name}, Kerala`
                        })),
                        "offers": {
                            "@type": "Offer",
                            "price": startingPrice,
                            "priceCurrency": "INR",
                            "availability": "https://schema.org/InStock",
                            "url": canonical
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "840",
                            "bestRating": "5",
                            "worstRating": "1"
                        }
                    })}
                </script>

                {/* FAQPage Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(faq => ({
                            "@type": "Question",
                            "name": faq.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.a
                            }
                        }))
                    })}
                </script>
            </Head>

            {/* Header */}
            <View style={[styles.header, {
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0'
            }]}>
                <TouchableOpacity
                    onPress={() => router.push('/services')}
                    style={styles.backBtn}
                    accessibilityRole="button"
                >
                    <ArrowLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Statewide Kerala Coverage • {tagline}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/emergency-electrician')}
                    style={styles.emergencyBtn}
                >
                    <Zap size={14} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.emergencyBtnText}>Emergency</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <View style={styles.heroBadgeRow}>
                        <Badge variant="info" size="md">90-Min Kerala Doorstep</Badge>
                        <Badge variant="success" size="md">30-Day Warranty</Badge>
                        <Badge variant="warning" size="md">Starts ₹{startingPrice}</Badge>
                    </View>

                    <Text style={styles.heroH1}>{h1}</Text>
                    <Text style={styles.heroIntro}>{intro}</Text>

                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.priceLabel}>Fixed Price Rate</Text>
                            <Text style={styles.priceValue}>₹{startingPrice}</Text>
                        </View>
                        <View style={styles.priceMeta}>
                            <Text style={styles.priceMetaText}>• Avg Duration: {duration}</Text>
                            <Text style={styles.priceMetaText}>• {rating} ({reviewsCount} reviews)</Text>
                            <Text style={styles.priceMetaText}>• Genuine ISI Spares</Text>
                        </View>
                    </View>

                    <View style={styles.heroBtnGroup}>
                        <TouchableOpacity
                            onPress={() => addToCart(serviceObj)}
                            style={[
                                styles.addCartBtn,
                                { backgroundColor: inCart ? '#10B981' : '#2563EB' }
                            ]}
                        >
                            {inCart ? (
                                <>
                                    <Check size={16} color="#FFFFFF" />
                                    <Text style={styles.btnText}>Added to Cart</Text>
                                </>
                            ) : (
                                <>
                                    <Plus size={16} color="#FFFFFF" />
                                    <Text style={styles.btnText}>Add to Cart (₹{startingPrice})</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setIsBookingModalOpen(true)}
                            style={styles.bookNowBtn}
                        >
                            <Zap size={15} color="#FFFFFF" fill="#FFFFFF" />
                            <Text style={styles.btnText}>Book Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleWhatsApp}
                            style={styles.whatsappBtn}
                        >
                            <MessageCircle size={15} color="#FFFFFF" />
                            <Text style={styles.btnText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* District Coverage Selector */}
                <View style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderRow}>
                        <MapPin size={18} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Available Across All 14 Kerala Districts
                        </Text>
                    </View>
                    <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                        Select your district for priority local dispatch within 45–90 mins:
                    </Text>

                    <View style={styles.districtsPills}>
                        {KERALA_DISTRICTS.map((d) => {
                            const isSelected = selectedDistrict === d.name;
                            return (
                                <TouchableOpacity
                                    key={d.id}
                                    onPress={() => setSelectedDistrict(d.name)}
                                    style={[
                                        styles.districtPill,
                                        {
                                            backgroundColor: isSelected ? '#2563EB' : (isDark ? '#18181B' : '#FFFFFF'),
                                            borderColor: isSelected ? '#2563EB' : (isDark ? '#27272A' : '#E2E8F0')
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.districtPillText,
                                        { color: isSelected ? '#FFFFFF' : colors.textPrimary, fontWeight: isSelected ? '700' : '500' }
                                    ]}>
                                        {d.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Common Problems Solved */}
                {problems.length > 0 && (
                    <Card variant="default" style={[styles.problemsCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                        <View style={styles.problemsHeader}>
                            <Wrench size={20} color={colors.accent} />
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                                Faults Diagnosed & Repaired
                            </Text>
                        </View>
                        <View style={styles.problemsList}>
                            {problems.map((prob, idx) => (
                                <View key={idx} style={styles.probItem}>
                                    <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                                    <Text style={[styles.probText, { color: colors.textSecondary }]}>{prob}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                )}

                {/* 3-Step Workmanship Process */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        How Sheriyakam Delivers Quality
                    </Text>
                    <View style={styles.stepsGrid}>
                        <Card variant="default" style={[styles.stepCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                            <Text style={styles.stepNum}>01</Text>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Multimeter Diagnosis</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Certified wireman tests phase voltage, neutral continuity, and earth resistance before opening any components.
                            </Text>
                        </Card>
                        <Card variant="default" style={[styles.stepCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                            <Text style={styles.stepNum}>02</Text>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>ISI Genuine Spares</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Replacement capacitors, wiring conduits, and breakers from trusted brands (Legrand, Havells, Anchor) at MRP.
                            </Text>
                        </Card>
                        <Card variant="default" style={[styles.stepCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                            <Text style={styles.stepNum}>03</Text>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>30-Day Guarantee</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Digital warranty certificate with free rework if the same issue reoccurs within 30 days.
                            </Text>
                        </Card>
                    </View>
                </View>

                {/* Licensing & Trust Box */}
                <View style={[styles.trustBox, { backgroundColor: isDark ? '#18181B' : '#EFF6FF', borderColor: isDark ? '#27272A' : '#BFDBFE' }]}>
                    <Award size={24} color="#2563EB" />
                    <View style={{ flex: 1, gap: 4 }}>
                        <Text style={[styles.trustBoxTitle, { color: colors.textPrimary }]}>
                            Licensed KSELB Wiremen & ₹5 Lakh Insurance Cover
                        </Text>
                        <Text style={[styles.trustBoxSub, { color: colors.textSecondary }]}>
                            Every visit is executed by verified wiremen and backed by comprehensive safety protocols.
                        </Text>
                    </View>
                </View>

                {/* FAQs */}
                {faqs.length > 0 && (
                    <View style={styles.sectionWrap}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Frequently Asked Questions
                        </Text>
                        <View style={styles.faqList}>
                            {faqs.map((faq, idx) => {
                                const isExpanded = openFaqIndexes.includes(idx);
                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        activeOpacity={0.7}
                                        onPress={() => toggleFaq(idx)}
                                        style={[
                                            styles.faqCard,
                                            {
                                                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                                borderColor: isExpanded ? colors.accent : (isDark ? '#27272A' : '#E2E8F0')
                                            }
                                        ]}
                                    >
                                        <View style={styles.faqHeader}>
                                            <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{faq.q}</Text>
                                            {isExpanded ? (
                                                <ChevronUp size={18} color={colors.accent} />
                                            ) : (
                                                <ChevronDown size={18} color={colors.textSecondary} />
                                            )}
                                        </View>
                                        {isExpanded && (
                                            <View style={[styles.faqBody, { borderTopColor: isDark ? '#27272A' : '#E2E8F0' }]}>
                                                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.a}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Legal & Compliance Footer */}
                <View style={[styles.legalFooter, { borderTopColor: isDark ? '#27272A' : '#E2E8F0' }]}>
                    <View style={styles.footerLinksRow}>
                        <TouchableOpacity onPress={() => router.push('/about')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>About Us</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/terms')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/privacy')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/refund-policy')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Refund & Warranty</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/cancellation-policy')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Cancellation</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/grievance')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Grievance Officer</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/cookie-policy')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Cookie Policy</Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
                        <TouchableOpacity onPress={() => router.push('/help')}>
                            <Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Support & FAQs</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.legalCopyText, { color: colors.textTertiary }]}>
                        © 2026 Sheriyakam. All rights reserved. • Kerala, India
                    </Text>
                </View>
            </ScrollView>

            <BookingModal
                service={serviceObj}
                visible={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />

            <FloatingCartBar />
            <StickyMobileCTA onBookPress={() => setIsBookingModalOpen(true)} />
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
        padding: 6,
        marginRight: 4,
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
        paddingBottom: 70,
        gap: 20,
        maxWidth: 1024,
        width: '100%',
        alignSelf: 'center',
    },
    heroCard: {
        padding: 22,
        borderRadius: 20,
        gap: 14,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    heroH1: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 30,
        letterSpacing: -0.3,
    },
    heroIntro: {
        color: '#CBD5E1',
        fontSize: 13.5,
        lineHeight: 22,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 14,
    },
    priceLabel: {
        color: '#94A3B8',
        fontSize: 11,
        fontWeight: '600',
    },
    priceValue: {
        color: '#60A5FA',
        fontSize: 24,
        fontWeight: '900',
    },
    priceMeta: {
        alignItems: 'flex-end',
        gap: 2,
    },
    priceMetaText: {
        color: '#E2E8F0',
        fontSize: 12,
        fontWeight: '600',
    },
    heroBtnGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 4,
    },
    addCartBtn: {
        flex: 2,
        minWidth: 170,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    bookNowBtn: {
        flex: 1,
        minWidth: 110,
        backgroundColor: '#334155',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    whatsappBtn: {
        backgroundColor: '#16A34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    sectionWrap: {
        gap: 10,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16.5,
        fontWeight: '800',
    },
    sectionSub: {
        fontSize: 13,
    },
    districtsPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    districtPill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    districtPillText: {
        fontSize: 12,
    },
    problemsCard: {
        padding: 18,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
    },
    problemsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    problemsList: {
        gap: 8,
    },
    probItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    probText: {
        flex: 1,
        fontSize: 12.5,
        lineHeight: 18,
    },
    stepsGrid: {
        gap: 10,
    },
    stepCard: {
        padding: 16,
        borderRadius: 14,
        gap: 4,
        borderWidth: 1,
    },
    stepNum: {
        color: '#2563EB',
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 2,
    },
    stepTitle: {
        fontSize: 14.5,
        fontWeight: '800',
    },
    stepDesc: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    trustBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
    },
    trustBoxTitle: {
        fontSize: 14,
        fontWeight: '800',
    },
    trustBoxSub: {
        fontSize: 12,
        lineHeight: 17,
    },
    faqList: {
        gap: 8,
        marginTop: 4,
    },
    faqCard: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQ: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    faqBody: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    faqA: {
        fontSize: 13,
        lineHeight: 20,
    },
    legalFooter: {
        paddingTop: 20,
        paddingBottom: 24,
        borderTopWidth: 1,
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    footerLinksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    footerLinkText: {
        fontSize: 12.5,
        fontWeight: '600',
        paddingVertical: 4,
    },
    footerDot: {
        fontSize: 10,
    },
    legalCopyText: {
        fontSize: 11,
        textAlign: 'center',
    },
});
