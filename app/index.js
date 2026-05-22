import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Dimensions, Image, TouchableOpacity, Alert, Animated, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, MapPin, Menu as MenuIcon, ChevronDown, CheckCircle, Shield, Briefcase, Search, Star, Clock, Users, Award, ChevronRight, Phone, Mail, Globe, ArrowRight } from 'lucide-react-native';
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

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Select Service',
    description: 'Browse our verified electricians and pick the service you need.',
    color: '#2563EB',
  },
  {
    step: '02',
    title: 'Book & Verify',
    description: 'Choose your slot, confirm address, and receive a secure OTP.',
    color: '#10B981',
  },
  {
    step: '03',
    title: 'Relax',
    description: 'Our certified expert arrives on time. Transparent pricing, zero surprises.',
    color: '#F59E0B',
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Menon',
    location: 'Calicut, Kerala',
    rating: 5,
    text: 'Unbelievably fast service. The electrician arrived within 30 minutes and fixed our entire DB panel. Highly recommended!',
    initials: 'AM',
    color: '#2563EB',
  },
  {
    name: 'Priya Nair',
    location: 'Thalassery, Kerala',
    rating: 5,
    text: 'The OTP safety feature gave me so much confidence. Professional, punctual, and very affordable. Five stars!',
    initials: 'PN',
    color: '#10B981',
  },
  {
    name: 'Rahul K.',
    location: 'Kannur, Kerala',
    rating: 4,
    text: 'Great experience with the AC service. The technician was knowledgeable and explained everything clearly.',
    initials: 'RK',
    color: '#F59E0B',
  },
  {
    name: 'Fathima S.',
    location: 'Kasaragod, Kerala',
    rating: 5,
    text: 'Emergency repair at 10 PM — they actually came! Fixed a short circuit that could have been dangerous. Lifesavers.',
    initials: 'FS',
    color: '#EF4444',
  },
];

const STATS = [
  { value: '15K+', label: 'Bookings', icon: CheckCircle },
  { value: '4.8★', label: 'Avg Rating', icon: Star },
  { value: '250+', label: 'Experts', icon: Users },
  { value: '25+', label: 'Years Exp', icon: Award },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationName, setLocationName] = useState('Thalassery, Kerala');
  const [locationCoords, setLocationCoords] = useState(null);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        // Web: use browser native geolocation (HTTPS required — works on Vercel)
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
        // Native: expo-location
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
      // User not logged in — use web-compatible prompt
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

    // User is logged in - open booking modal
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
    // Start Header and Content Animations
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

    // Loop Pulse Animation for Emergency
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
        <title>Sheriyakam | Expert Electrician & Plumbing Repairs</title>
        <meta name="description" content="Book affordable, emergency home repair services in Kerala. We fix faulty wiring, broken water motors, AC leaks, and ceiling fans quickly." />
        <meta name="keywords" content="emergency electrician near me, motor repair, fan installation, affordable home repair, sheriyakam, AC repair, local electrician" />
        <meta property="og:title" content="Sheriyakam | Home Repair Experts" />
      </Head>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.bgPrimary} />

      {/* Sticky Top Bar with Scroll Dynamics */}
      <Animated.View style={[
        {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.sm,
          backgroundColor: colors.bgPrimary,
          zIndex: 100,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 4,
        },
        { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
      ]}>
        <View style={styles.topBar}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} onPress={() => setMenuVisible(true)}>
              <MenuIcon size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={[
              styles.nameWrapper,
              isDark && styles.nameWrapperDark
            ]}>
              <Text style={[styles.appName, dynamicStyles.appName]}>
                <Text style={{ color: '#001F3F', fontSize: 20, fontWeight: '800' }}>Sheri</Text>
                <Text style={{ color: '#2563EB', fontSize: 20, fontWeight: '800' }}>yakam</Text>
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
        {/* HERO SECTION — Gradient Banner + Search                */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Animated.View style={[
          styles.heroBanner,
          { 
            opacity: headerOpacity, 
            transform: [
              { translateY: headerTranslateY },
            ] 
          }
        ]}>
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTag}>⚡ TRUSTED ELECTRICIANS IN KERALA</Text>
              <Text style={styles.heroTitle}>
                Book an Expert{'\n'}in <Text style={styles.heroHighlight}>60 Seconds</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                Licensed professionals. Transparent pricing.{'\n'}Emergency response in under 30 minutes.
              </Text>

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
        </Animated.View>

        {/* Animated Content Wrapper */}
        <Animated.View style={{
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }]
        }}>

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
          {/* HOW IT WORKS                                           */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.howItWorksSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitleCenter, { color: colors.textPrimary }]}>
              How It Works
            </Text>
            <Text style={[styles.sectionSubtitleCenter, { color: colors.textSecondary }]}>
              Three simple steps to get expert help at your doorstep
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
          {/* TRUST & STATISTICS BANNER                              */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={styles.statsBanner}>
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
          {/* TESTIMONIALS CAROUSEL                                   */}
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
              ].map((faq, i) => (
                <View key={i} style={[styles.faqCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                  <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>{faq.q}</Text>
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* PROFESSIONAL FOOTER                                     */}
          {/* ═══════════════════════════════════════════════════════ */}
          <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandName}>
                <Text style={{ color: '#001F3F', fontWeight: '800' }}>Sheri</Text>
                <Text style={{ color: '#2563EB', fontWeight: '800' }}>yakam</Text>
              </Text>
              <Text style={[styles.footerTagline, { color: colors.textTertiary }]}>
                by Empire Electricals • Est. 1998
              </Text>
            </View>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/about')}>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>About</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: colors.textSecondary }]}>Terms</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: colors.textTertiary }]}>•</Text>
              <TouchableOpacity>
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
              © 2026 Sheriyakam. All rights reserved.
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
  heroTag: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
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
    marginBottom: 20,
  },
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
    marginVertical: SPACING.lg,
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
  },
});
