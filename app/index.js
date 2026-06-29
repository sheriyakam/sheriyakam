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
  Mail, Globe, ArrowRight, MessageCircle, ChevronUp
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
import { ServicesAPI } from '../services/supabaseAPI';
import { mapplsService } from '../services/mapplsService';

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
    name: "Emergency Repair Specialist",
    rating: 4.8,
    specialty: "Emergency Repairs",
    time: "1 hr",
    price: 550,
    category: "Electrical",
    image: require('../assets/images/emergency.png')
  },
  {
    id: 2,
    name: "Fan Repair",
    rating: 4.6,
    specialty: "Ceiling & Exhaust Fans",
    time: "1 hr",
    price: 350,
    category: "Electrical",
    image: require('../assets/images/light_fan.png')
  },
  {
    id: 3,
    name: "Wiring",
    rating: 4.5,
    specialty: "Wiring & Installation",
    time: "1 hr",
    price: 550,
    category: "Electrical",
    image: require('../assets/images/wiring.png')
  },
  {
    id: 4,
    name: "DB Maintenance",
    rating: 4.7,
    specialty: "Distribution Boards",
    time: "1 hr",
    price: 450,
    category: "DB & Switchgear",
    image: require('../assets/images/switch.png')
  },
  {
    id: 5,
    name: "Inverter Service",
    rating: 5.0,
    specialty: "Inverter & UPS",
    time: "1 hr",
    price: 500,
    category: "Electrical",
    image: require('../assets/images/inverter.png')
  },
  {
    id: 6,
    name: "AC Service",
    rating: 4.2,
    specialty: "Air Conditioning",
    time: "1 hr",
    price: 650,
    category: "Air Conditioning",
    image: require('../assets/images/ac.png')
  },
  {
    id: 7,
    name: "CCTV Setup",
    rating: 4.9,
    specialty: "Security Systems",
    time: "1 hr",
    price: 700,
    category: "CCTV & Security",
    image: require('../assets/images/cctv.png')
  },
  {
    id: 8,
    name: "Home Automation",
    rating: 4.8,
    specialty: "Smart Home Setup",
    time: "1 hr",
    price: 1500,
    category: "Home Automation",
    image: require('../assets/images/automation.png')
  },
];

const CATEGORIES = ['All', 'Electrical', 'Air Conditioning', 'Home Automation', 'CCTV & Security', 'DB & Switchgear'];

const KERALA_DISTRICTS = [
  'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram',
  'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam',
  'Alappuzha', 'Pathanamthitta', 'Kollam', 'Thiruvananthapuram'
];



const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Select Service',
    description: 'Browse services with transparent pricing. No hidden costs, no surprises.',
    color: '#2563EB',
  },
  {
    step: '02',
    title: 'Book Your Slot',
    description: 'Pick a time, confirm your address, and receive a secure OTP for verification.',
    color: '#10B981',
  },
  {
    step: '03',
    title: 'Partner Arrives',
    description: 'A licensed, verified electrician arrives on time. Share OTP to start the job.',
    color: '#F59E0B',
  },
  {
    step: '04',
    title: 'Pay Safely',
    description: 'Pay only after work is done. Cash or online — transparent final billing.',
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
    name: 'Sreelakshmi R.',
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
  { value: '2400+', label: 'Jobs Done', icon: CheckCircle },
  { value: '4.9★', label: 'Avg Rating', icon: Star },
  { value: '14', label: 'Districts', icon: MapPin },
  { value: '90min', label: 'Response', icon: Clock },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= 768;

  const [selectedService, setSelectedService] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationName, setLocationName] = useState('Thalassery, Kerala');
  const [locationCoords, setLocationCoords] = useState(null);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

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

  // Handle service click with authentication check
  const handleServiceClick = useCallback((service) => {
    if (!user) {
      if (Platform.OS === 'web') {
        const shouldLogin = window.confirm('Login Required\n\nPlease login or sign up to book a service.');
        if (shouldLogin) {
          router.push('/auth/login');
        }
      } else {
        Alert.alert(
          'Login Required',
          'Please login or sign up to book a service.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login / Sign Up', onPress: () => router.push('/auth/login') }
          ]
        );
      }
      return;
    }
    setSelectedService(service);
  }, [user, router]);


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

  // Filtered services based on search & category
  const emergencyService = useMemo(() => services.find(s => s.name.includes('Emergency') || s.is_emergency), [services]);

  const filteredServices = useMemo(() => {
    let result = services.filter(s => !s.name.includes('Emergency') && !s.is_emergency);
    if (selectedCategory !== 'All') {
      result = result.filter(s => (s.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.specialty || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, selectedCategory, searchQuery]);

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
  }, [services, selectedCategory, searchQuery]);

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

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sheriyakam — Book Expert Electricians in 60 Seconds" />
        <meta name="twitter:description" content="Licensed electricians across Kerala. 2400+ jobs completed. 4.9★ rating. Emergency dispatch in 90 minutes." />
        <meta name="twitter:image" content="https://sheriyakam.vercel.app/assets/images/emergency.png" />

        {/* AEO LocalBusiness Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Sheriyakam",
            "image": "https://sheriyakam.vercel.app/assets/images/emergency.png",
            "@id": "https://sheriyakam.vercel.app/#organization",
            "url": "https://sheriyakam.vercel.app",
            "telephone": "+919876543210",
            "priceRange": "INR",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Thalassery",
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
              "Kasaragod", "Kannur", "Wayanad", "Kozhikode", "Malappuram",
              "Palakkad", "Thrissur", "Ernakulam", "Idukki", "Kottayam",
              "Alappuzha", "Pathanamthitta", "Kollam", "Thiruvananthapuram"
            ],
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2400"
            }
          })}
        </script>

        {/* AEO FAQPage Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much does an electrician cost near me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our base inspection charge is highly affordable. However, the total cost depends on the specific repair—pricing is always clear and upfront before work begins."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best way to request emergency home repair?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply tap the 'Emergency Repair Specialist' button at the top of the app. We prioritize complete power failures, short circuits, and massive leaks."
                }
              },
              {
                "@type": "Question",
                "name": "How fast will my water motor or AC be fixed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We focus on quick, professional resolution. Depending on availability in Kerala, our verified partners aim for same-day or next-day service."
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
          24/7 Emergency Dispatch — 90 Min Response
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

          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >

        {/* ═══════════════════════════════════════════════════════ */}
        {/* HERO SECTION — Two-Column + Inline Booking Card        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Animated.View style={[
          styles.heroBanner,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}>
          <View style={[styles.heroGradient, { backgroundColor: colors.primary }]}>
            <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
              {/* LEFT: Headline + Trust + Search */}
              <View style={[styles.heroLeft, isDesktop && { flex: 1, marginRight: 24 }]}>
                <Text style={styles.heroTag}>⚡ TRUSTED ELECTRICIANS IN KERALA</Text>
                <Text style={styles.heroTitle}>
                  Book Expert{'\n'}Electrical Service{'\n'}in <Text style={styles.heroHighlight}>60 Seconds</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  Licensed professionals across 14 districts.{'\n'}Transparent pricing. Emergency response in 90 min.
                </Text>

                {/* Trust Row */}
                <View style={styles.trustRow}>
                  <View style={styles.trustItem}>
                    <Shield size={13} color="#10B981" />
                    <Text style={styles.trustText}>Govt. Licensed</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.trustText}>4.9/5 Rating</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <Clock size={13} color="#60A5FA" />
                    <Text style={styles.trustText}>90-Min Response</Text>
                  </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Search size={18} color="#94a3b8" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search services — AC, Wiring, CCTV..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Text style={{ color: '#94a3b8', fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>


            </View>
          </View>
        </Animated.View>

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
          {/* CATEGORY FILTER BADGES                                 */}
          {/* ═══════════════════════════════════════════════════════ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
            style={{ marginBottom: SPACING.lg }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: isActive
                        ? colors.accent
                        : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                      borderColor: isActive ? colors.accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                    }
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.categoryText,
                    { color: isActive ? '#fff' : colors.textSecondary }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* EMERGENCY SECTION                                      */}
          {/* ═══════════════════════════════════════════════════════ */}
          {emergencyService && (selectedCategory === 'All' || selectedCategory === 'Electrical') && !searchQuery && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Animated.View style={[
                  styles.iconBox,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Zap size={16} color={colors.danger} fill={colors.danger} />
                </Animated.View>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Emergency Booking</Text>
              </View>
              <ServiceCard
                {...emergencyService}
                fullWidth
                isEmergency
                onPress={() => handleServiceClick(emergencyService)}
              />
            </View>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SERVICES GRID                                          */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={styles.servicesHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              {selectedCategory === 'All' ? 'All Services' : selectedCategory}
            </Text>
            <Text style={[styles.serviceCount, { color: colors.textTertiary }]}>
              {filteredServices.length} available
            </Text>
          </View>

          {filteredServices.length === 0 ? (
            <View style={styles.emptyServices}>
              <Search size={40} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                No services found for "{searchQuery || selectedCategory}"
              </Text>
              <TouchableOpacity
                style={[styles.resetBtn, { borderColor: colors.accent }]}
                onPress={() => { setSearchQuery(''); setSelectedCategory('All'); }}
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
                    style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslateY }], width: '48%', marginBottom: SPACING.md }}
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
            <View style={styles.stepsContainer}>
              {HOW_IT_WORKS.map((step, index) => (
                <View key={index} style={[styles.stepCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                  <View style={[styles.stepNumber, { backgroundColor: step.color + '20' }]}>
                    <Text style={[styles.stepNumberText, { color: step.color }]}>{step.step}</Text>
                  </View>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{step.title}</Text>
                  <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>{step.description}</Text>
                  {index < HOW_IT_WORKS.length - 1 && (
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
            <View style={styles.whyGrid}>
              <View style={[styles.whyCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#2563EB18' }]}>
                  <Shield size={28} color={colors.accent} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Verified Partners</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>All electricians are licensed & background-verified for your safety</Text>
              </View>
              <View style={[styles.whyCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#10B98118' }]}>
                  <CheckCircle size={28} color={COLORS.success} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>OTP-Locked Safety</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>Secure job start & end with verification codes only you control</Text>
              </View>
              <View style={[styles.whyCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={[styles.whyIconWrap, { backgroundColor: '#F59E0B18' }]}>
                  <Zap size={28} color={COLORS.gold} />
                </View>
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Upfront Pricing</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>No hidden charges. Know exactly what you'll pay before work begins</Text>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TESTIMONIALS — 3 Real Kerala Reviews                   */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.testimonialsSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary }]}>
              What Our Customers Say
            </Text>
            <Text style={[styles.sectionSubtitleCenter, { color: colors.textSecondary }]}>
              Real reviews from real people across Kerala
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.testimonialScroll}
              snapToInterval={300}
              decelerationRate="fast"
            >
              {TESTIMONIALS.map((t, index) => (
                <View key={index} style={[styles.testimonialCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                  <View style={styles.testimonialHeader}>
                    <View style={[styles.testimonialAvatar, { backgroundColor: t.color }]}>
                      <Text style={styles.testimonialInitials}>{t.initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.testimonialName, { color: colors.textPrimary }]}>{t.name}</Text>
                      <Text style={[styles.testimonialLocation, { color: colors.textTertiary }]}>{t.location}</Text>
                    </View>
                  </View>
                  <View style={styles.testimonialStars}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <Star key={`e-${i}`} size={14} color={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} />
                    ))}
                  </View>
                  <Text style={[styles.testimonialText, { color: colors.textSecondary }]}>"{t.text}"</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* FAQ SECTION                                             */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.faqSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary }]}>
              Frequently Asked Questions
            </Text>
            <View style={{ gap: SPACING.md }}>
              {[
                  { q: "How much does an electrician cost near me?", a: "Our base inspection charge is highly affordable. However, the total cost depends on the specific repair—pricing is always clear and upfront before work begins." },
                  { q: "What is the best way to request emergency home repair?", a: "Simply tap the 'Emergency Repair Specialist' button at the top of the app. We prioritize complete power failures, short circuits, and massive leaks." },
                  { q: "How fast will my water motor or AC be fixed?", a: "We focus on quick, professional resolution. Depending on availability in Kerala, our verified partners aim for same-day or next-day service." }
              ].map((faq, i) => {
                const isExpanded = expandedFaqIndex === i;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => setExpandedFaqIndex(isExpanded ? null : i)}
                    style={[
                      styles.faqCard,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                        borderColor: isExpanded ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                      }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Text style={[styles.faqQuestion, { color: colors.textPrimary, flex: 1, marginRight: 16 }]}>{faq.q}</Text>
                      {isExpanded ? (
                        <ChevronUp size={16} color={colors.accent} />
                      ) : (
                        <ChevronDown size={16} color={colors.textSecondary} />
                      )}
                    </View>
                    {isExpanded && (
                      <Text style={[styles.faqAnswer, { color: colors.textSecondary, marginTop: 12, lineHeight: 20 }]}>
                        {faq.a}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

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
                by Empire Electricals • Est. 1998
              </Text>
              <Text style={[styles.footerLicense, { color: colors.textTertiary }]}>
                Registered Electrical Contractors | Licence #KL/EC/2024
              </Text>
            </View>

            {/* District Coverage */}
            <View style={styles.footerDistrictsWrap}>
              {KERALA_DISTRICTS.map((d) => (
                <Text key={d} style={[
                  styles.footerDistrictTag,
                  {
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  }
                ]}>{d}</Text>
              ))}
            </View>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/about')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>About</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/terms')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Terms</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity onPress={() => router.push('/privacy')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Privacy</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Support</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerContact}>
              <View style={styles.footerContactItem}>
                <Phone size={14} color={colors.textTertiary} />
                <Text style={[styles.footerContactText, { color: colors.textTertiary }]}>+91 98765 43210</Text>
              </View>
              <View style={styles.footerContactItem}>
                <Mail size={14} color={colors.textTertiary} />
                <Text style={[styles.footerContactText, { color: colors.textTertiary }]}>support@sheriyakam.com</Text>
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
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
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  menuButton: {
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
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
    fontWeight: '500',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
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
