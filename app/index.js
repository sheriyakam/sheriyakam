import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, StatusBar, Dimensions, Image,
  TouchableOpacity, Alert, Animated, Platform, TextInput, Linking,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Zap, MapPin, Menu as MenuIcon, ChevronDown, CheckCircle, Shield,
  Briefcase, Search, Star, Clock, Users, Award, ChevronRight, Phone,
  Mail, Globe, ArrowRight, MessageCircle, ChevronUp, HelpCircle, Sparkles,
  Snowflake, Droplets, Camera, Building2, ShieldCheck, AlertTriangle, BatteryCharging, Fan
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import MenuModal from '../components/MenuModal';
import LocationModal from '../components/LocationModal';
import FloatingCartBar from '../components/FloatingCartBar';
import StickyMobileCTA from '../components/StickyMobileCTA';
import ReviewsSection from '../components/ReviewsSection';
import WorkGallery from '../components/WorkGallery';
import { ServicesAPI } from '../services/supabaseAPI';
import { mapplsService } from '../services/mapplsService';
import { Badge } from '../components/ui/Badge';
import { KERALA_DISTRICTS } from '../constants/locations';
import { openWhatsApp } from '../utils/whatsapp';
import { getFaqs } from '../constants/cmsStore';
import QuickLeadModal from '../components/QuickLeadModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import SectionErrorBoundary from '../components/SectionErrorBoundary';

export { ErrorBoundary };

const IMAGE_MAP = {
  'emergency.png': require('../assets/images/emergency.png'),
  'light_fan.png': require('../assets/images/light_fan.png'),
  'wiring.png': require('../assets/images/wiring.png'),
  'switch.png': require('../assets/images/switch.png'),
  'inverter.png': require('../assets/images/inverter.png'),
  'ac.png': require('../assets/images/ac.png'),
  'cctv.png': require('../assets/images/cctv.png'),
  'automation.png': require('../assets/images/automation.png'),
};

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Diagnostic & Fault Inspection Visit",
    rating: 4.9,
    specialty: "Multimeter Fault Finding & Upfront Quote (Adjustable)",
    time: "45 min",
    price: 49,
    category: "Electrical",
    image: require('../assets/images/emergency.png')
  },
  {
    id: 2,
    name: "Fan Repair & Installation",
    rating: 4.8,
    specialty: "Ceiling & Exhaust Fans, Capacitor & Bearing Fix",
    time: "30 min",
    price: 249,
    category: "Electrical",
    image: require('../assets/images/light_fan.png')
  },
  {
    id: 3,
    name: "Switch & Socket Replacement",
    rating: 4.9,
    specialty: "Sparking Switches, Burnt Plugs & 6A/16A Points",
    time: "30 min",
    price: 149,
    category: "Electrical",
    image: require('../assets/images/switch.png')
  },
  {
    id: 4,
    name: "MCB & Fuse Box Tripping (DB Repair)",
    rating: 4.9,
    specialty: "Blackout Triage, Tripping Breakers & Safety Switch",
    time: "45 min",
    price: 349,
    category: "Electrical",
    image: require('../assets/images/emergency.png')
  },
  {
    id: 5,
    name: "Complete Home Wiring & Safety Earthing",
    rating: 4.9,
    specialty: "Full House Rewiring, Shock Check & Ground Rod",
    time: "1-2 hrs",
    price: 550,
    category: "Electrical",
    image: require('../assets/images/wiring.png')
  },
  {
    id: 6,
    name: "Inverter & Battery Wiring",
    rating: 5.0,
    specialty: "Battery Wiring, Changeover Switch & Backup Test",
    time: "1 hr",
    price: 500,
    category: "Electrical",
    image: require('../assets/images/inverter.png')
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Select Problem / Service',
    description: 'Choose from 6 clear services or select ₹49 on-site diagnostic inspection.',
    color: '#2563EB',
  },
  {
    step: '02',
    title: 'Confirmation Call',
    description: 'You will get a direct confirmation call from our master electrician before arrival.',
    color: '#10B981',
  },
  {
    step: '03',
    title: 'Master Wireman Arrives',
    description: 'Licensed KSELB wireman arrives on time with professional tools and ISI spares.',
    color: '#F59E0B',
  },
  {
    step: '04',
    title: 'Pay Safely After Testing',
    description: 'Test the completed fix and pay safely via UPI QR or cash. 30-day warranty included.',
    color: '#8B5CF6',
  },
];


const TESTIMONIALS = [
  {
    name: 'Anoop Krishnan',
    location: 'Kozhikode District',
    rating: 5,
    text: 'Called at 9 PM for a short circuit. Electrician arrived in 25 minutes. Transparent pricing, no surprises. Best service in Kerala!',
    initials: 'AK',
    color: '#2563EB',
  },
  {
    name: 'Sreelakshmi Ramesh',
    location: 'Ernakulam District',
    rating: 5,
    text: 'Booked AC service through the app. OTP verification gave me confidence. Technician was professional and charged exactly what was quoted.',
    initials: 'SR',
    color: '#10B981',
  },
  {
    name: 'Mohammed Faisal',
    location: 'Kannur District',
    rating: 5,
    text: 'Complete house rewiring in 2 days. Punctual, clean, quality materials. Upfront pricing saved me from overcharging. Highly recommended!',
    initials: 'MF',
    color: '#F59E0B',
  },
];

const STATS = [
  { value: '2,400+', label: 'App Bookings', icon: CheckCircle },
  { value: '4.9★', label: '1,480+ Reviews', icon: Star },
  { value: '14', label: 'Kerala Districts', icon: MapPin },
  { value: '90min', label: 'Doorstep Arrival', icon: Clock },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 640 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;
  const isWide = screenWidth >= 768;
  const cardWidth = isDesktop ? '23.8%' : isTablet ? '31.6%' : '48.5%';

  const [selectedService, setSelectedService] = useState(null);
  const [quickLeadModalVisible, setQuickLeadModalVisible] = useState(false);
  const [quickLeadInitialService, setQuickLeadInitialService] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationName, setLocationName] = useState('Thalassery, Kerala');
  const [locationCoords, setLocationCoords] = useState(null);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndexes, setOpenFaqIndexes] = useState([0, 1, 2]);
  const mainScrollRef = useRef(null);

  const openQuickLead = useCallback((serviceObj = null) => {
    setQuickLeadInitialService(serviceObj);
    setQuickLeadModalVisible(true);
  }, []);

  const scrollToCatalog = (query = '') => {
    setSearchQuery(query);
    if (mainScrollRef.current) {
      if (typeof mainScrollRef.current.scrollTo === 'function') {
        mainScrollRef.current.scrollTo({ y: isDesktop ? 500 : 580, animated: true });
      } else if (mainScrollRef.current.getNode && typeof mainScrollRef.current.getNode().scrollTo === 'function') {
        mainScrollRef.current.getNode().scrollTo({ y: isDesktop ? 500 : 580, animated: true });
      }
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndexes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await ServicesAPI.getAll();
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          ...item,
          image: IMAGE_MAP[item.image_key] || MOCK_SERVICES[0].image
        }));
        setServices(mapped);
      }
    }
    fetchServices();
  }, []);

  // ── Ask for location permission on startup & auto-detect ────────────────
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'web') {
        if (!navigator?.geolocation) return;
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              let name = '';
              if (mapplsService.isConfigured()) {
                const addr = await mapplsService.reverseGeocode(latitude, longitude);
                if (addr) {
                  const parts = addr.split(',');
                  name = parts[1]?.trim() || parts[0]?.trim() || 'Your Location';
                }
              }
              if (!name) {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                  { headers: { 'User-Agent': 'Sheriyakam/1.0', 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                const parts = data.address;
                name = parts?.town || parts?.city || parts?.county || parts?.state_district || 'Your Location';
              }
              setLocationName(name);
              setLocationCoords({ latitude, longitude });
            } catch {
              // silently fail — keep default
            }
          },
          () => { /* user denied — keep default */ },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        try {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude } = pos.coords;
          setLocationCoords({ latitude, longitude });

          let name = '';
          if (mapplsService.isConfigured()) {
            const addr = await mapplsService.reverseGeocode(latitude, longitude);
            if (addr) {
              const parts = addr.split(',');
              name = parts[1]?.trim() || parts[0]?.trim() || 'Your Location';
            }
          }

          if (!name) {
            const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
            const place = geocoded[0];
            name = place?.city || place?.district || place?.subregion || place?.region || 'Your Location';
          }
          setLocationName(name);
        } catch {
          // silently fail — keep default
        }
      }
    };
    requestLocationPermission();
  }, []);

  // Handle service click -> opens zero-friction 3-step quick lead booking modal
  const handleServiceClick = useCallback((service) => {
    openQuickLead({
      id: service.id || (service.name || '').toLowerCase().replace(/\s+/g, '-'),
      label: service.name,
      price: typeof service.price === 'number' ? `From ₹${service.price}` : (service.price || 'From ₹249'),
      desc: service.specialty || service.description || 'Verified master electrician service'
    });
  }, [openQuickLead]);


  // Animation Refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(headerTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Filtered services based on search
  const filteredServices = useMemo(() => {
    let result = services;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.specialty || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, searchQuery]);

  // Stagger Animations for Cards
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (services.length > 0) {
      cardsAnim.setValue(0);
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [services, searchQuery]);

  // Memoized dynamic styles (only recompute on theme change)
  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: colors.bgPrimary,
    },
    appName: {
      color: colors.textPrimary,
    },
    headerTitle: {
      color: colors.textPrimary,
    },
    headerSubtitle: {
      color: colors.textPrimary,
    },
    headerLocationBtn: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.border,
    },
    headerLocationText: {
      color: colors.textPrimary,
    },
    sectionTitle: {
      color: colors.textPrimary,
    },
  }), [colors]);

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <Head>
        <title>Sheriyakam — Professional Electrician Services in Kerala | 24/7 Emergency</title>
        <meta name="description" content="Book trusted, licensed electricians across 14 districts of Kerala. Emergency response in 90 minutes. Fan repair, wiring, AC service, CCTV — transparent pricing from ₹350." />
        <meta name="keywords" content="electrician Kerala, emergency electrician near me, fan repair Kerala, AC repair, wiring, CCTV setup, sheriyakam, home repair Kerala, electrical service" />
        <link rel="canonical" href="https://sheriyakam.vercel.app/" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sheriyakam — Book Expert Electricians in 60 Seconds" />
        <meta property="og:description" content="Licensed electricians across Kerala. 2400+ jobs completed. 4.9★ rating. Emergency dispatch in 90 minutes." />
        <meta property="og:url" content="https://sheriyakam.vercel.app/" />
        <meta property="og:image" content="https://sheriyakam.vercel.app/assets/images/emergency.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Sheriyakam Home and Electrical Services in Kerala" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sheriyakam — Book Expert Electricians in 60 Seconds" />
        <meta name="twitter:description" content="Licensed electricians across Kerala. 2400+ jobs completed. 4.9★ rating. Emergency dispatch in 90 minutes." />
        <meta name="twitter:image" content="https://sheriyakam.vercel.app/assets/images/emergency.png" />
        <meta name="twitter:image:alt" content="Sheriyakam Home and Electrical Services in Kerala" />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 1. SCHEMA.ORG & GOOGLE RICH RESULTS DUAL-VALIDATED JSON-LD */}
        {/* ═══════════════════════════════════════════════════════ */}

        {/* LocalBusiness & HomeAndConstructionBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "Sheriyakam",
            "alternateName": "Sheriyakam Home & Electrical Services Kerala",
            "image": "https://sheriyakam.vercel.app/assets/images/emergency.png",
            "@id": "https://sheriyakam.vercel.app/#organization",
            "url": "https://sheriyakam.vercel.app",
            "telephone": "+919876543210",
            "priceRange": "₹₹",
            "currenciesAccepted": "INR",
            "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Thalassery Main Road",
              "addressLocality": "Kannur",
              "addressRegion": "Kerala",
              "postalCode": "670101",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 11.7495,
              "longitude": 75.4891
            },
            "areaServed": [
              { "@type": "AdministrativeArea", "name": "Kasaragod" },
              { "@type": "AdministrativeArea", "name": "Kannur" },
              { "@type": "AdministrativeArea", "name": "Wayanad" },
              { "@type": "AdministrativeArea", "name": "Kozhikode" },
              { "@type": "AdministrativeArea", "name": "Malappuram" },
              { "@type": "AdministrativeArea", "name": "Palakkad" },
              { "@type": "AdministrativeArea", "name": "Thrissur" },
              { "@type": "AdministrativeArea", "name": "Ernakulam" },
              { "@type": "AdministrativeArea", "name": "Idukki" },
              { "@type": "AdministrativeArea", "name": "Kottayam" },
              { "@type": "AdministrativeArea", "name": "Alappuzha" },
              { "@type": "AdministrativeArea", "name": "Pathanamthitta" },
              { "@type": "AdministrativeArea", "name": "Kollam" },
              { "@type": "AdministrativeArea", "name": "Thiruvananthapuram" }
            ],
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Electrical & Home Services Kerala",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Diagnostic & Fault Inspection Visit",
                    "description": "Multimeter fault finding & upfront quote, adjustable against final bill."
                  },
                  "price": "49",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Ceiling & Exhaust Fan Repair",
                    "description": "Capacitor fix, bearing noise troubleshooting, and regulator replacement."
                  },
                  "price": "249",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Switch & Socket Replacement",
                    "description": "Replace sparking switches, loose plug sockets, and burned 6A/16A points."
                  },
                  "price": "149",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "MCB & Fuse Box Tripping (DB Repair)",
                    "description": "Distribution board short circuit isolation and tripping MCB troubleshooting."
                  },
                  "price": "349",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Complete Home Wiring & Safety Earthing",
                    "description": "Full house rewiring, electric shock prevention, and earth pit installation."
                  },
                  "price": "550",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Inverter & Battery Wiring",
                    "description": "Battery wiring, changeover switch connection, and power backup testing."
                  },
                  "price": "500",
                  "priceCurrency": "INR"
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2400",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>

        {/* WebSite Schema with Google Sitelinks SearchBox EntryPoint */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Sheriyakam",
            "url": "https://sheriyakam.vercel.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://sheriyakam.vercel.app/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* BreadcrumbList Schema for Google Rich Results */}
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
                "name": "Services",
                "item": "https://sheriyakam.vercel.app/#services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Pricing",
                "item": "https://sheriyakam.vercel.app/pricing"
              }
            ]
          })}
        </script>

        {/* 40-60 Word Quotable FAQPage Schema (Google Rich Results & AEO Validated) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much does an electrician cost in Kerala?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Standard electrical repairs start at ₹149 for switch replacements and ₹249 for fan repairs through Sheriyakam. All bookings include upfront transparent pricing, verified wireman licensing, and a 30-day rework warranty."
                }
              },
              {
                "@type": "Question",
                "name": "How fast does an emergency electrician arrive in Kerala?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sheriyakam electricians arrive on-site within 45 to 90 minutes across Thalassery, Kannur, Kozhikode, and Wayanad for urgent power outages, short circuits, and sparking hazards. Customers receive a direct confirmation call prior to technician arrival."
                }
              },
              {
                "@type": "Question",
                "name": "Are Sheriyakam electricians certified and insured?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, 100% of Sheriyakam electricians hold government wireman or supervisor licenses certified by the Kerala Electrical Inspectorate. Every visit is backed by a ₹5,00,000 domestic safety protection cover against accidental equipment damage."
                }
              }
            ]
          })}
        </script>
      </Head>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.bgPrimary} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 24/7 EMERGENCY STRIP                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <View style={styles.emergencyStrip}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Zap size={14} color="#FCA5A5" fill="#FCA5A5" />
        </Animated.View>
        <Text style={styles.emergencyStripText}>
          24/7 Emergency Dispatch — 90 Min Response Across Kerala
        </Text>
      </View>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STICKY HEADER WITH BOOK NOW CTA                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Animated.View style={[
        styles.stickyHeader,
        {
          backgroundColor: colors.bgPrimary,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        },
        { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
      ]}>
        <View style={styles.topBar}>
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
              onPress={() => setMenuVisible(true)}
            >
              <MenuIcon size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.nameWrapper}>
              <Text style={[styles.appName, dynamicStyles.appName]}>
                <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800' }}>Sheri</Text>
                <Text style={{ color: colors.accent, fontSize: 20, fontWeight: '800' }}>yakam</Text>
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={[styles.headerLocationBtn, dynamicStyles.headerLocationBtn]}
              onPress={() => setLocationVisible(true)}
            >
              <MapPin size={14} color={colors.accent} />
              <Text style={[styles.headerLocationText, dynamicStyles.headerLocationText]} numberOfLines={1}>{locationName}</Text>
              <ChevronDown size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.headerAuthBtn,
                { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', borderColor: colors.accent }
              ]}
              onPress={() => router.push(user ? '/bookings' : '/auth/login')}
            >
              <Text style={[styles.headerAuthBtnText, { color: colors.accent }]}>
                {user ? 'My Bookings' : 'Login / Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        ref={mainScrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >

        {/* ═══════════════════════════════════════════════════════ */}
        {/* HERO SECTION — Streamlined, Zero-Scroll Mobile Ready   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <SectionErrorBoundary name="Hero Section">
        <Animated.View style={[
          styles.heroBanner,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}>
          <View style={[styles.heroGradient, { backgroundColor: colors.primary }]}>
            <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
              <View style={[styles.heroLeft, isDesktop && { flex: 1 }]}>
                
                {/* Heritage & Tag */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Zap size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={[styles.heroTag, { marginBottom: 0 }]}>
                    24/7 DOORSTEP ELECTRICAL SERVICES ACROSS KERALA
                  </Text>
                </View>

                {/* Hero Title */}
                <Text style={styles.heroTitle}>
                  Book an Electrician in <Text style={styles.heroHighlight}>60 Seconds</Text>{'\n'}
                  At Your Door in 90 Min
                </Text>

                {/* Hero Subtitle */}
                <Text style={styles.heroSubtitle}>
                  Master wiremen across Thalassery, Kannur, Kozhikode & Wayanad.{'\n'}
                  Clear transparent rates • 30-day warranty • Direct confirmation call before arrival.
                </Text>

                {/* Trust Badges */}
                <View style={styles.trustRow}>
                  <View style={styles.trustItem}>
                    <Shield size={13} color="#10B981" />
                    <Text style={styles.trustText}>KSELB Certified</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <Clock size={13} color="#F59E0B" />
                    <Text style={styles.trustText}>90-Min Arrival</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <Shield size={13} color="#60A5FA" />
                    <Text style={styles.trustText}>₹5 Lakh Cover</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <CheckCircle size={13} color="#10B981" />
                    <Text style={styles.trustText}>Pay After Testing</Text>
                  </View>
                </View>

                {/* PRIMARY ACTION: What's the problem? */}
                <View style={{ marginTop: 4, marginBottom: 14 }}>
                  <TouchableOpacity
                    onPress={() => openQuickLead()}
                    activeOpacity={0.88}
                    style={{
                      minHeight: 52,
                      backgroundColor: '#2563EB',
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderRadius: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      shadowColor: '#2563EB',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.35,
                      shadowRadius: 10,
                      elevation: 6,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="What's the problem? Book an Electrician"
                  >
                    <Zap size={20} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 }}>
                      What's the problem? — Book Now
                    </Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Search size={18} color="#94a3b8" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search services — Fan, Switch, MCB, Inverter, Wiring..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchQuery('')}
                      style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
                      accessibilityRole="button"
                      accessibilityLabel="Clear Search"
                    >
                      <Text style={{ color: '#94a3b8', fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            </View>
          </View>
        </Animated.View>
        </SectionErrorBoundary>

        {/* Animated Content Wrapper */}
        <Animated.View style={{
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }]
        }}>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TRUST & STATISTICS BANNER                              */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.statsBanner, { backgroundColor: colors.primary }]}>
            <View style={styles.statsInner}>
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <View key={index} style={styles.statItem}>
                    <View style={styles.statIconWrap}>
                      <Icon size={18} color="#fff" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SERVICES SECTION — 6 Core Streamlined Options           */}
          {/* ═══════════════════════════════════════════════════════ */}
          <SectionErrorBoundary name="Services Catalog">
          <View style={{ marginHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginBottom: 0 }]}>
                Core Electrical Services
              </Text>
              <TouchableOpacity onPress={() => router.push('/services')}>
                <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '700' }}>Full Catalogue ›</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 14 }}>
              All Services — {filteredServices.length} Core Options Available. Upfront pricing & 30-day warranty:
            </Text>
          </View>

          {filteredServices.length === 0 ? (
            <View style={styles.emptyServices}>
              <Search size={40} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                No services found for "{searchQuery}"
              </Text>
              <TouchableOpacity
                style={[styles.resetBtn, { borderColor: colors.accent }]}
                onPress={() => setSearchQuery('')}
              >
                <Text style={{ color: colors.accent, fontWeight: '600' }}>Show All Services</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredServices.map((service, index) => {
                const cardOpacity = cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                });
                const cardTranslateY = cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40 + index * 8, 0],
                });

                return (
                  <Animated.View
                    key={service.id}
                    style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslateY }], width: cardWidth, marginBottom: SPACING.md }}
                  >
                    <ServiceCard
                      {...service}
                      fullWidth
                      onPress={() => handleServiceClick(service)}
                    />
                  </Animated.View>
                );
              })}
            </View>
          )}
          </SectionErrorBoundary>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* HOW IT WORKS — 4 Steps                                 */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.howItWorksSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary }]}>
              How It Works
            </Text>
            <Text style={[styles.sectionSubtitleCenter, { color: colors.textSecondary }]}>
              Four simple steps to get expert help at your doorstep
            </Text>
            <View style={[
              styles.stepsContainer,
              isWide && { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
            ]}>
              {HOW_IT_WORKS.map((step, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.stepCard, 
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    isDesktop ? { width: '23.5%' } : isTablet ? { width: '48.5%', marginBottom: 12 } : { width: '100%' }
                  ]}
                >
                  <View style={[styles.stepNumber, { backgroundColor: step.color + '20' }]}>
                    <Text style={[styles.stepNumberText, { color: step.color }]}>{step.step}</Text>
                  </View>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{step.title}</Text>
                  <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>{step.description}</Text>
                  {!isWide && index < HOW_IT_WORKS.length - 1 && (
                    <View style={[styles.stepConnector, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* WHY SHERIYAKAM                                          */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.whySection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary }]}>
              Why Sheriyakam?
            </Text>
            <View style={[
              styles.whyGrid,
              isWide && { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
            ]}>
              <View style={[
                styles.whyCard, 
                { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                isDesktop ? { width: '31.5%' } : isTablet ? { width: '48.5%', marginBottom: 12 } : { width: '100%' }
              ]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#2563EB18' }]}>
                  <Shield size={28} color={colors.accent} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Verified Partners</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>All electricians are licensed & background-verified for your safety</Text>
              </View>
              <View style={[
                styles.whyCard, 
                { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                isDesktop ? { width: '31.5%' } : isTablet ? { width: '48.5%', marginBottom: 12 } : { width: '100%' }
              ]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#10B98118' }]}>
                  <CheckCircle size={28} color={COLORS.success} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>OTP-Locked Safety</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>Secure job start & end with verification codes only you control</Text>
              </View>
              <View style={[
                styles.whyCard, 
                { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                isDesktop ? { width: '31.5%' } : isTablet ? { width: '100%', marginBottom: 12 } : { width: '100%' }
              ]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#F59E0B18' }]}>
                  <Zap size={28} color={COLORS.gold} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Upfront Pricing</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>No hidden charges. Know exactly what you'll pay before work begins</Text>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* VERIFIED WORK GALLERY (BEFORE & AFTER)                  */}
          {/* ═══════════════════════════════════════════════════════ */}
          <SectionErrorBoundary name="Work Gallery">
            <WorkGallery />
          </SectionErrorBoundary>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* REVIEWS & AGGREGATE BREAKDOWN MODULE                    */}
          {/* ═══════════════════════════════════════════════════════ */}
          <SectionErrorBoundary name="Customer Reviews">
            <ReviewsSection />
          </SectionErrorBoundary>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* FAQ SECTION (ALL QUESTIONS & COMPLETE ANSWERS)          */}
          {/* ═══════════════════════════════════════════════════════ */}
          <SectionErrorBoundary name="FAQ Section">
          <View style={[styles.faqSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Badge variant="info">Clear & Transparent</Badge>
              <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary, marginTop: 8 }]}>
                Frequently Asked Questions
              </Text>
              <Text style={[styles.sectionSubtitleCenter, { color: colors.textSecondary }]}>
                Everything you need to know about pricing, 90-minute arrival, KSELB licensing, and our 30-day warranty.
              </Text>
            </View>

            <View style={{ gap: SPACING.md }}>
              {(getFaqs ? getFaqs() : []).map((faq, i) => {
                const isExpanded = openFaqIndexes.includes(i);
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                    accessibilityLabel={faq.q}
                    onPress={() => toggleFaq(i)}
                    style={[
                      styles.faqCard,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                        borderColor: isExpanded ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                      }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Text style={[styles.faqQuestion, { color: colors.textPrimary, flex: 1, marginRight: 16, marginBottom: 0 }]}>{faq.q}</Text>
                      {isExpanded ? (
                        <ChevronUp size={18} color={colors.accent} />
                      ) : (
                        <ChevronDown size={18} color={colors.textSecondary} />
                      )}
                    </View>
                    {isExpanded && (
                      <View style={{ marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary, lineHeight: 22 }]}>
                          {faq.a}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          </SectionErrorBoundary>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* PROFESSIONAL FOOTER — Districts + Licensing            */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandName}>
                <Text style={{ color: colors.textPrimary, fontWeight: '800' }}>Sheri</Text>
                <Text style={{ color: colors.accent, fontWeight: '800' }}>yakam</Text>
              </Text>
              <Text style={[styles.footerTagline, { color: colors.textTertiary }]}>
                Kerala's Certified On-Demand Electrical Services • Upfront Pricing • 30-Day Warranty • 2,400+ App Dispatches
              </Text>
              <Text style={[styles.footerLicense, { color: colors.textTertiary }]}>
                Verified & Background-Checked Electrical Technicians Across 14 Districts
              </Text>
            </View>

            {/* High-Intent Specialized Services Links */}
            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 4, width: '100%' }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>
                Popular Electrical Specializations in Kerala
              </Text>
              <View style={styles.footerDistrictsWrap}>
                <TouchableOpacity onPress={() => router.push('/emergency-electrician-kerala')} style={[styles.footerDistrictTag, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', borderColor: '#EF444433', borderWidth: 1 }]}>
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>⚡ 24/7 Emergency Electrician</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/fan-repair-kerala')} style={[styles.footerDistrictTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                  <Text style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)', fontSize: 12, fontWeight: '600' }}>Ceiling Fan & BLDC Repair</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cctv-installation-kerala')} style={[styles.footerDistrictTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                  <Text style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)', fontSize: 12, fontWeight: '600' }}>CCTV Camera Setup</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/ac-repair-kerala')} style={[styles.footerDistrictTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                  <Text style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)', fontSize: 12, fontWeight: '600' }}>AC Foam Jet Wash</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/house-rewiring-kerala')} style={[styles.footerDistrictTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                  <Text style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)', fontSize: 12, fontWeight: '600' }}>House Rewiring & DB Repair</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* District Coverage */}
            <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 4, width: '100%' }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>
                Electricians Across All 14 Kerala Districts
              </Text>
              <View style={styles.footerDistrictsWrap}>
                <TouchableOpacity
                  onPress={() => router.push('/thalassery-electrician')}
                  style={[
                    styles.footerDistrictTag,
                    {
                      backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF',
                      borderColor: '#2563EB44',
                      borderWidth: 1,
                    }
                  ]}
                >
                  <Text style={{
                    color: colors.accent,
                    fontSize: 12,
                    fontWeight: '700'
                  }}>
                    Thalassery HQ (തലശ്ശേരി)
                  </Text>
                </TouchableOpacity>
                {KERALA_DISTRICTS.map((d) => (
                  <TouchableOpacity
                    key={d.id || d}
                    onPress={() => router.push(d.id === 'kannur' ? '/kannur-electrician' : `/${d.id}-electrician`)}
                    style={[
                      styles.footerDistrictTag,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      }
                    ]}
                  >
                    <Text style={{
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)',
                      fontSize: 12,
                      fontWeight: '600'
                    }}>
                      {d.name || d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/about')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>About</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/terms')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/privacy')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/refund-policy')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Refund & Warranty</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/cancellation-policy')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Cancellation</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/grievance')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Grievance Officer</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/cookie-policy')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Cookie Policy</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/help')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Support & FAQs</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerContact}>
              <View style={styles.footerContactItem}>
                <Phone size={14} color={colors.textTertiary} />
                <Text style={[styles.footerContactText, { color: colors.textTertiary }]}>+91 495 280 0000</Text>
              </View>
              <View style={styles.footerContactItem}>
                <Mail size={14} color={colors.textTertiary} />
                <Text style={[styles.footerContactText, { color: colors.textTertiary }]}>support@sheriyakam.in</Text>
              </View>
            </View>
            <Text style={[styles.footerCopy, { color: colors.textTertiary }]}>
              © 2026 Sheriyakam. All rights reserved. Serving all 14 districts of Kerala.
            </Text>
          </View>

        </Animated.View>

      </Animated.ScrollView>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        visible={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Location Selection Modal */}
      <LocationModal
        visible={locationVisible}
        onClose={() => setLocationVisible(false)}
        onLocationSelect={(loc) => setLocationName(loc)}
        currentLocation={locationCoords}
      />

      {/* Side Menu */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      {/* Quick Lead Modal (3-Step Fast Booking -> WhatsApp Direct) */}
      <QuickLeadModal
        visible={quickLeadModalVisible}
        onClose={() => setQuickLeadModalVisible(false)}
        initialService={quickLeadInitialService}
      />

      {/* Persistent Multi-Item Floating Cart Bar */}
      <FloatingCartBar />

      {/* Sticky Mobile Quick Conversion & Helpline Bar */}
      <StickyMobileCTA onBookPress={() => openQuickLead()} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    maxWidth: 1280,
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },

  /* ─── EMERGENCY STRIP ─── */
  emergencyStrip: {
    backgroundColor: '#7F1D1D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  emergencyStripText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* ─── STICKY HEADER ─── */
  stickyHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    zIndex: 100,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    maxWidth: 1280,
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  menuButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 8,
  },
  nameWrapperDark: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 8,
  },
  headerLocationBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    flexShrink: 1,
  },
  headerLocationText: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  headerAuthBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerAuthBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  headerBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  headerBookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ─── HERO BANNER ─── */
  heroBanner: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    backgroundColor: '#001F3F',
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroContent: {
    padding: SPACING.lg,
    paddingVertical: 32,
  },
  heroContentDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    marginTop: 24,
  },
  heroTag: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroHighlight: {
    color: '#60A5FA',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },

  /* ─── TRUST ROW ─── */
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  trustText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },

  /* ─── SEARCH ─── */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '400',
  },



  /* ─── CATEGORIES ─── */
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  categoryBadge: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* ─── SECTIONS ─── */
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionTitleCenter: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitleCenter: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },

  /* ─── SERVICES ─── */
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  serviceCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: SPACING.md,
  },
  emptyServices: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 4,
  },

  /* ─── HOW IT WORKS ─── */
  howItWorksSection: {
    paddingVertical: SPACING.xl + 8,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    marginTop: SPACING.lg,
  },
  stepsContainer: {
    gap: SPACING.md,
  },
  stepCard: {
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  stepConnector: {
    position: 'absolute',
    bottom: -SPACING.md / 2 - 1,
    left: '50%',
    width: 1,
    height: SPACING.md,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
  },

  /* ─── STATS BANNER ─── */
  statsBanner: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#001F3F',
  },
  statsInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  /* ─── WHY SECTION ─── */
  whySection: {
    paddingVertical: SPACING.xl + 8,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
  },
  whyGrid: {
    gap: SPACING.md,
  },
  whyCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    textAlign: 'center',
  },
  whyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  whyCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  whyCardText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  /* ─── TESTIMONIALS ─── */
  testimonialsSection: {
    paddingVertical: SPACING.xl + 8,
    borderTopWidth: 1,
  },
  testimonialScroll: {
    paddingHorizontal: SPACING.md,
    gap: 14,
  },
  testimonialCard: {
    width: 280,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: '700',
  },
  testimonialLocation: {
    fontSize: 12,
    marginTop: 1,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 10,
  },
  testimonialText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  /* ─── FAQ ─── */
  faqSection: {
    paddingVertical: SPACING.xl + 8,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
  },
  faqCard: {
    padding: SPACING.md,
    borderRadius: 14,
    borderWidth: 1,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
  },

  /* ─── FOOTER ─── */
  footer: {
    paddingVertical: 32,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 14,
    marginBottom: 20,
  },
  footerBrand: {
    alignItems: 'center',
    gap: 4,
  },
  footerBrandName: {
    fontSize: 22,
  },
  footerTagline: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  footerLicense: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  footerDistrictsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  footerDistrictTag: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 6,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  footerDot: {
    fontSize: 8,
  },
  footerContact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  footerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerContactText: {
    fontSize: 12,
  },
  footerCopy: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
