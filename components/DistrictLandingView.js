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
    ChevronDown, ChevronUp, AlertTriangle, Award, Shield,
    Check, Plus, ShoppingBag, Info
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { COLORS, SPACING } from '../constants/theme';
import { DISTRICT_SEO_DATA, getDistrictSeoData } from '../constants/districtDetails';
import { KERALA_DISTRICTS } from '../constants/locations';
import { getAllServices, CATEGORIES } from '../constants/catalog';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import FloatingCartBar from './FloatingCartBar';
import StickyMobileCTA from './StickyMobileCTA';
import BookingModal from './BookingModal';
import { openWhatsApp } from '../utils/whatsapp';
import { formatINR } from '../utils/validation';

export default function DistrictLandingView({ districtKey = 'kozhikode' }) {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const isTablet = width >= 640 && width < 1024;

    const { addToCart, items: cartItems } = useCart();
    const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
    const [openFaqIndexes, setOpenFaqIndexes] = useState([0]);

    const data = useMemo(() => {
        return getDistrictSeoData(districtKey);
    }, [districtKey]);

    const [selectedLocality, setSelectedLocality] = useState(data.localities[0] || data.name);

    const allServices = useMemo(() => {
        return getAllServices();
    }, []);

    const toggleFaq = (idx) => {
        setOpenFaqIndexes(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleCallHelpline = () => {
        const phoneUrl = `tel:${data.phone || '+914952800000'}`;
        if (Platform.OS === 'web') window.location.href = phoneUrl;
        else Linking.openURL(phoneUrl);
    };

    const handleWhatsApp = () => {
        const text = `Hi Sheriyakam, I need an electrician in *${data.name}* (Locality: ${selectedLocality}). Please assign a licensed technician.`;
        openWhatsApp(text);
    };

    const isItemInCart = (serviceId) => {
        return cartItems?.some(item => item.id === serviceId);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F8FAFC' }]}>
            <Head>
                <title>{data.metaTitle}</title>
                <meta name="description" content={data.metaDescription} />
                <link rel="canonical" href={data.canonical} />
                <meta property="og:title" content={data.metaTitle} />
                <meta property="og:description" content={data.metaDescription} />
                <meta property="og:url" content={data.canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_IN" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={data.metaTitle} />
                <meta name="twitter:description" content={data.metaDescription} />

                {/* LocalBusiness & HomeAndConstructionBusiness Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HomeAndConstructionBusiness",
                        "@id": `${data.canonical}#localbusiness`,
                        "name": `Sheriyakam Electrician Services — ${data.name}`,
                        "url": data.canonical,
                        "telephone": data.phone || "+91 495 280 0000",
                        "email": "support@sheriyakam.in",
                        "priceRange": "₹49 - ₹1,499",
                        "image": "https://sheriyakam.vercel.app/og-image.png",
                        "provider": {
                            "@type": "Organization",
                            "name": "Sheriyakam",
                            "url": "https://sheriyakam.vercel.app"
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": data.hubAddress,
                            "addressLocality": data.name,
                            "addressRegion": "Kerala",
                            "postalCode": "670101",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "11.7480",
                            "longitude": "75.4894"
                        },
                        "areaServed": data.localities.map(loc => ({
                            "@type": "AdministrativeArea",
                            "name": `${loc}, ${data.name}, Kerala`
                        })),
                        "openingHoursSpecification": [
                            {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [
                                    "Monday", "Tuesday", "Wednesday", "Thursday",
                                    "Friday", "Saturday", "Sunday"
                                ],
                                "opens": "00:00",
                                "closes": "23:59"
                            }
                        ],
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "1480",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": `Electrical Services in ${data.name}`,
                            "itemListElement": allServices.slice(0, 8).map(s => ({
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": s.title,
                                    "description": s.description
                                },
                                "price": s.price || s.startingPrice,
                                "priceCurrency": "INR"
                            }))
                        }
                    })}
                </script>

                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://sheriyakam.vercel.app/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Kerala Locations",
                                "item": "https://sheriyakam.vercel.app/locations"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": data.name,
                                "item": data.canonical
                            }
                        ]
                    })}
                </script>

                {/* Localized FAQPage Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": data.faqs.map(faq => ({
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

            {/* Navigation Header */}
            <View style={[styles.header, {
                backgroundColor: isDark ? '#09090B' : '#FFFFFF',
                borderBottomColor: isDark ? '#27272A' : '#E2E8F0'
            }]}>
                <TouchableOpacity
                    onPress={() => router.push('/locations')}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Back to All Kerala Locations"
                >
                    <ArrowLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        {data.name} Electrical Hub
                    </Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
                        {data.malayalam} • {data.tagline}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/emergency-electrician')}
                    style={styles.emergencyBtn}
                    accessibilityRole="button"
                    accessibilityLabel="24/7 Emergency Electrician Dispatch"
                >
                    <Zap size={14} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.emergencyBtnText}>Emergency</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ═══════════════════════════════════════════════════════ */}
                {/* HERO BANNER                                             */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? '#18181B' : '#0F172A' }]}>
                    <View style={styles.heroTopBadges}>
                        <Badge variant="info" size="md">KSELB Certified Wiremen</Badge>
                        <Badge variant="success" size="md">{data.arrivalMins} Mins Doorstep</Badge>
                    </View>

                    <Text style={styles.heroH1}>{data.h1}</Text>

                    <Text style={styles.heroIntroText}>{data.intro}</Text>

                    {/* Quick Metrics Bar */}
                    <View style={styles.metricsBar}>
                        <View style={styles.metricCol}>
                            <View style={styles.metricRow}>
                                <Clock size={16} color="#F59E0B" />
                                <Text style={styles.metricValue}>{data.arrivalMins} Mins</Text>
                            </View>
                            <Text style={styles.metricLabel}>Average Arrival</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <View style={styles.metricRow}>
                                <Users size={16} color="#10B981" />
                                <Text style={styles.metricValue}>{data.activeTechs} Wiremen</Text>
                            </View>
                            <Text style={styles.metricLabel}>Active in {data.name}</Text>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricCol}>
                            <View style={styles.metricRow}>
                                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                <Text style={styles.metricValue}>4.9★</Text>
                            </View>
                            <Text style={styles.metricLabel}>Local Rating</Text>
                        </View>
                    </View>

                    {/* Primary Hero CTAs */}
                    <View style={styles.heroActionRow}>
                        <TouchableOpacity
                            onPress={() => setSelectedServiceForModal(allServices[0])}
                            style={styles.bookDiagnosticBtn}
                            accessibilityRole="button"
                        >
                            <Zap size={16} color="#FFFFFF" fill="#FFFFFF" />
                            <Text style={styles.bookDiagnosticBtnText}>Book Diagnostic Visit (₹49)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCallHelpline}
                            style={styles.callHelplineBtn}
                            accessibilityRole="button"
                        >
                            <Phone size={15} color="#FFFFFF" />
                            <Text style={styles.callHelplineBtnText}>Call Helpline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleWhatsApp}
                            style={styles.whatsappBtn}
                            accessibilityRole="button"
                        >
                            <MessageCircle size={15} color="#FFFFFF" />
                            <Text style={styles.whatsappBtnText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* LOCAL TALUKS & COVERAGE SELECTOR                        */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.sectionWrap}>
                    <View style={styles.sectionTitleRow}>
                        <MapPin size={18} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Coverage Areas & Taluks in {data.name}
                        </Text>
                    </View>
                    <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                        Select your neighborhood to confirm technician availability & fastest dispatch route.
                    </Text>

                    <View style={styles.localitiesGrid}>
                        {data.localities.map((loc) => {
                            const isSelected = selectedLocality === loc;
                            return (
                                <TouchableOpacity
                                    key={loc}
                                    onPress={() => setSelectedLocality(loc)}
                                    style={[
                                        styles.localityChip,
                                        {
                                            backgroundColor: isSelected ? (isDark ? '#2563EB33' : '#EFF6FF') : (isDark ? '#18181B' : '#FFFFFF'),
                                            borderColor: isSelected ? '#2563EB' : (isDark ? '#27272A' : '#E2E8F0')
                                        }
                                    ]}
                                >
                                    <CheckCircle2 size={14} color={isSelected ? '#2563EB' : (isDark ? '#52525B' : '#94A3B8')} />
                                    <Text style={[
                                        styles.localityChipText,
                                        { color: isSelected ? (isDark ? '#60A5FA' : '#1D4ED8') : colors.textPrimary, fontWeight: isSelected ? '700' : '500' }
                                    ]}>
                                        {loc}
                                    </Text>
                                    <Badge variant="success" size="sm">Active</Badge>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* REGIONAL ELECTRICAL PROBLEMS & SOLUTIONS               */}
                {/* ═══════════════════════════════════════════════════════ */}
                {data.regionalProblems && data.regionalProblems.length > 0 && (
                    <Card variant="default" style={[styles.regionalCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                        <View style={styles.regionalHeader}>
                            <AlertTriangle size={20} color="#F59E0B" />
                            <Text style={[styles.regionalTitle, { color: colors.textPrimary }]}>
                                Common Electrical Challenges in {data.name}
                            </Text>
                        </View>
                        <View style={styles.regionalList}>
                            {data.regionalProblems.map((prob, idx) => (
                                <View key={idx} style={styles.regionalItem}>
                                    <ShieldCheck size={16} color="#10B981" style={{ marginTop: 2 }} />
                                    <Text style={[styles.regionalText, { color: colors.textSecondary }]}>{prob}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                )}

                {/* ═══════════════════════════════════════════════════════ */}
                {/* POPULAR SERVICES CATALOG WITH ADD TO CART & BOOK       */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderBetween}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                                Fixed-Price Services in {data.name}
                            </Text>
                            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                                Upfront rates, genuine ISI spares, and 30-day rework warranty.
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/services')}>
                            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>All Services ›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.serviceCardsList}>
                        {allServices.slice(0, 6).map((service) => {
                            const inCart = isItemInCart(service.id);
                            return (
                                <Card
                                    key={service.id}
                                    variant="default"
                                    style={[styles.serviceCard, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}
                                >
                                    <View style={styles.serviceInfo}>
                                        <Text style={[styles.serviceCardTitle, { color: colors.textPrimary }]}>
                                            {service.title}
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.serviceCardDesc, { color: colors.textSecondary }]}
                                        >
                                            {service.description}
                                        </Text>
                                        <View style={styles.serviceCardMeta}>
                                            <Text style={[styles.serviceCardPrice, { color: colors.accent }]}>
                                                ₹{service.price || service.startingPrice}
                                            </Text>
                                            <Text style={[styles.serviceCardDuration, { color: colors.textTertiary }]}>
                                                • {service.duration || '45 mins'}
                                            </Text>
                                            <Text style={[styles.serviceCardWarranty, { color: '#10B981' }]}>
                                                • 30-Day Warranty
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.serviceCardActions}>
                                        <TouchableOpacity
                                            onPress={() => addToCart(service)}
                                            style={[
                                                styles.cartBtn,
                                                {
                                                    backgroundColor: inCart ? '#10B981' : (isDark ? '#27272A' : '#F1F5F9'),
                                                    borderColor: inCart ? '#10B981' : (isDark ? '#3F3F46' : '#CBD5E1')
                                                }
                                            ]}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Add ${service.title} to cart`}
                                        >
                                            {inCart ? (
                                                <>
                                                    <Check size={14} color="#FFFFFF" />
                                                    <Text style={[styles.cartBtnText, { color: '#FFFFFF' }]}>Added</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={14} color={colors.textPrimary} />
                                                    <Text style={[styles.cartBtnText, { color: colors.textPrimary }]}>Add</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onPress={() => setSelectedServiceForModal(service)}
                                        >
                                            Book
                                        </Button>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* TRUST & LICENSING COMPLIANCE BADGE                      */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={[styles.trustBox, { backgroundColor: isDark ? '#18181B' : '#EFF6FF', borderColor: isDark ? '#27272A' : '#BFDBFE' }]}>
                    <Award size={24} color="#2563EB" />
                    <View style={{ flex: 1, gap: 4 }}>
                        <Text style={[styles.trustBoxTitle, { color: colors.textPrimary }]}>
                            Certified & Verified Technicians
                        </Text>
                        <Text style={[styles.trustBoxSub, { color: colors.textSecondary }]}>
                            All dispatches in {data.name} are covered under ₹5 Lakh property protection insurance with zero hidden fees.
                        </Text>
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* LOCALIZED FREQUENTLY ASKED QUESTIONS                    */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.sectionWrap}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Frequently Asked Questions in {data.name}
                    </Text>

                    <View style={styles.faqList}>
                        {data.faqs.map((faq, idx) => {
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

                {/* ═══════════════════════════════════════════════════════ */}
                {/* ALL KERALA DISTRICTS INTERNAL LINKING MESH             */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={[styles.districtsMeshWrap, { borderTopColor: isDark ? '#27272A' : '#E2E8F0' }]}>
                    <Text style={[styles.districtsMeshTitle, { color: colors.textPrimary }]}>
                        Sheriyakam Electrician Services Across All 14 Kerala Districts
                    </Text>
                    <Text style={[styles.districtsMeshSub, { color: colors.textSecondary }]}>
                        Instant 45–90 min doorstep response across the state:
                    </Text>

                    <View style={styles.districtsMeshGrid}>
                        {KERALA_DISTRICTS.map((d) => {
                            const isCurrent = d.id === data.districtId || d.id === data.id;
                            return (
                                <TouchableOpacity
                                    key={d.id}
                                    onPress={() => router.push(d.id === 'kannur' ? '/kannur-electrician' : `/${d.id}-electrician`)}
                                    style={[
                                        styles.districtMeshChip,
                                        {
                                            backgroundColor: isCurrent ? (isDark ? '#2563EB33' : '#EFF6FF') : (isDark ? '#18181B' : '#F1F5F9'),
                                            borderColor: isCurrent ? '#2563EB' : (isDark ? '#27272A' : '#E2E8F0')
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.districtMeshChipText,
                                        { color: isCurrent ? '#2563EB' : colors.textPrimary, fontWeight: isCurrent ? '700' : '500' }
                                    ]}>
                                        {d.name} ({d.malayalam})
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            onPress={() => router.push('/thalassery-electrician')}
                            style={[
                                styles.districtMeshChip,
                                {
                                    backgroundColor: data.id === 'thalassery' ? (isDark ? '#2563EB33' : '#EFF6FF') : (isDark ? '#18181B' : '#F1F5F9'),
                                    borderColor: data.id === 'thalassery' ? '#2563EB' : (isDark ? '#27272A' : '#E2E8F0')
                                }
                            ]}
                        >
                            <Text style={[
                                styles.districtMeshChipText,
                                { color: data.id === 'thalassery' ? '#2563EB' : colors.textPrimary, fontWeight: '700' }
                            ]}>
                                Thalassery HQ (തലശ്ശേരി)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* LEGAL & COMPLIANCE FOOTER                               */}
                {/* ═══════════════════════════════════════════════════════ */}
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

            {/* Booking Modal */}
            <BookingModal
                service={selectedServiceForModal}
                visible={!!selectedServiceForModal}
                onClose={() => setSelectedServiceForModal(null)}
            />

            {/* Multi-Item Persistent Cart Bar */}
            <FloatingCartBar />

            {/* Sticky Mobile CTA */}
            <StickyMobileCTA onBookPress={() => setSelectedServiceForModal(allServices[0])} />
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
    heroTopBadges: {
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
    heroIntroText: {
        color: '#CBD5E1',
        fontSize: 13.5,
        lineHeight: 22,
    },
    metricsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 14,
    },
    metricCol: {
        alignItems: 'center',
        flex: 1,
    },
    metricRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    metricValue: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    metricLabel: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 2,
    },
    metricDivider: {
        width: 1,
        height: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    heroActionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 4,
    },
    bookDiagnosticBtn: {
        flex: 2,
        minWidth: 200,
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    bookDiagnosticBtnText: {
        color: '#FFFFFF',
        fontSize: 13.5,
        fontWeight: '800',
    },
    callHelplineBtn: {
        flex: 1,
        minWidth: 120,
        backgroundColor: '#334155',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    callHelplineBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    whatsappBtn: {
        flex: 1,
        minWidth: 110,
        backgroundColor: '#16A34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    whatsappBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    sectionWrap: {
        gap: 10,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    sectionSub: {
        fontSize: 13,
        lineHeight: 18,
    },
    localitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    localityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    localityChipText: {
        fontSize: 12.5,
    },
    regionalCard: {
        padding: 16,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#F59E0B44',
    },
    regionalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    regionalTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    regionalList: {
        gap: 8,
    },
    regionalItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    regionalText: {
        flex: 1,
        fontSize: 12.5,
        lineHeight: 18,
    },
    sectionHeaderBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    serviceCardsList: {
        gap: 10,
        marginTop: 4,
    },
    serviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        gap: 12,
    },
    serviceInfo: {
        flex: 1,
        gap: 3,
    },
    serviceCardTitle: {
        fontSize: 14.5,
        fontWeight: '800',
    },
    serviceCardDesc: {
        fontSize: 12,
        lineHeight: 17,
    },
    serviceCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    serviceCardPrice: {
        fontSize: 15,
        fontWeight: '900',
    },
    serviceCardDuration: {
        fontSize: 11.5,
    },
    serviceCardWarranty: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    serviceCardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
    },
    cartBtnText: {
        fontSize: 12,
        fontWeight: '700',
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
    districtsMeshWrap: {
        paddingTop: 18,
        borderTopWidth: 1,
        gap: 8,
    },
    districtsMeshTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    districtsMeshSub: {
        fontSize: 12,
    },
    districtsMeshGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    districtMeshChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    districtMeshChipText: {
        fontSize: 11.5,
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
