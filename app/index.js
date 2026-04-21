import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Dimensions, Image, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, MapPin, Menu as MenuIcon, ChevronDown, CheckCircle, Shield, Briefcase } from 'lucide-react-native';
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
    image: require('../assets/images/emergency.png')
  },
  {
    id: 2,
    name: "Fan Repair",
    rating: 4.6,
    specialty: "Ceiling & Exhaust Fans",
    time: "1 hr",
    price: 350,
    image: require('../assets/images/light_fan.png')
  },
  {
    id: 3,
    name: "Wiring",
    rating: 4.5,
    specialty: "Wiring & Installation",
    time: "1 hr",
    price: 550,
    image: require('../assets/images/wiring.png')
  },
  {
    id: 4,
    name: "DB Maintenance",
    rating: 4.7,
    specialty: "Distribution Boards",
    time: "1 hr",
    price: 450,
    image: require('../assets/images/switch.png')
  },
  {
    id: 5,
    name: "Inverter Service",
    rating: 5.0,
    specialty: "Inverter & UPS",
    time: "1 hr",
    price: 500,
    image: require('../assets/images/inverter.png')
  },
  {
    id: 6,
    name: "AC Service",
    rating: 4.2,
    specialty: "Air Conditioning",
    time: "1 hr",
    price: 650,
    image: require('../assets/images/ac.png')
  },
  {
    id: 7,
    name: "CCTV Setup",
    rating: 4.9,
    specialty: "Security Systems",
    time: "1 hr",
    price: 700,
    image: require('../assets/images/cctv.png')
  },
  {
    id: 8,
    name: "Home Automation",
    rating: 4.8,
    specialty: "Smart Home Setup",
    time: "1 hr",
    price: 1500,
    image: require('../assets/images/automation.png')
  },
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

  const { theme, colors } = useTheme();

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
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'User-Agent': 'Sheriyakam/1.0', 'Accept-Language': 'en' } }
              );
              const data = await res.json();
              const parts = data.address;
              const name = parts?.town || parts?.city || parts?.county || parts?.state_district || 'Your Location';
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
          const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
          const place = geocoded[0];
          const name = place?.city || place?.district || place?.subregion || place?.region || 'Your Location';
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Permission denied, stick to default
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocationCoords(location.coords); // Store coordinates
        let address = await Location.reverseGeocodeAsync(location.coords);

        if (address && address.length > 0) {
          const { city, district, region, name, street } = address[0];
          // Construct a readable string: e.g., "Calicut, Kerala" or "Street, City"
          // city is often null on Android, district or region might be better
          const mainLoc = city || district || name;
          const subLoc = region || '';

          if (mainLoc) {
            setLocationName(subLoc ? `${mainLoc}, ${subLoc}` : mainLoc);
          }
        }
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    })();
  }, []);

  const emergencyService = useMemo(() => services.find(s => s.name.includes('Emergency') || s.is_emergency), [services]);
  const otherServices = useMemo(() => services.filter(s => !s.name.includes('Emergency') && !s.is_emergency), [services]);

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
  }, [services]);

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
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colors.bgPrimary} />

      {/* Sticky Top Bar with Scroll Dynamics */}
      <Animated.View style={[
        {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.sm,
          backgroundColor: colors.bgPrimary,
          zIndex: 100,
          borderBottomWidth: 1,
          borderBottomColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: scrollY.interpolate({ inputRange: [0, 20], outputRange: [0, 0.1], extrapolate: 'clamp' }),
          shadowRadius: 6,
          elevation: scrollY.interpolate({ inputRange: [0, 20], outputRange: [0, 6], extrapolate: 'clamp' }),
        },
        { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
      ]}>
        <View style={styles.topBar}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
              <MenuIcon size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={[
              styles.nameWrapper,
              theme === 'dark' && styles.nameWrapperDark
            ]}>
              <Text style={[styles.appName, dynamicStyles.appName]}>
                <Text style={{ color: '#001F3F', fontSize: 20, fontWeight: 'bold' }}>Sheri</Text>
                <Text style={{ color: '#2563EB', fontSize: 20, fontWeight: 'bold' }}>yakam</Text>
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={[styles.headerLocationBtn, dynamicStyles.headerLocationBtn]}
              onPress={() => setLocationVisible(true)}
            >
              <MapPin size={16} color={colors.accent} />
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
      >

        {/* Hero Section (Parallax) */}
        <Animated.View style={[
          styles.heroSection,
          { 
            opacity: headerOpacity, 
            transform: [
              { translateY: headerTranslateY },
              { translateY: scrollY.interpolate({ inputRange: [-100, 0, 100], outputRange: [-20, 0, 30] }) },
              { scale: scrollY.interpolate({ inputRange: [-100, 0, 100], outputRange: [1.1, 1, 0.95], extrapolate: 'clamp' }) }
            ] 
          }
        ]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, dynamicStyles.headerTitle, { fontSize: 34, letterSpacing: -0.5 }]}>
              Expert <Text style={{ color: colors.accent }}>Electricians</Text>
            </Text>
            <Text style={[styles.headerSubtitle, dynamicStyles.headerSubtitle, { opacity: 0.7, fontSize: 18, marginTop: 4, fontWeight: '500' }]}>
              Professional repairs & fast resolution
            </Text>
          </View>
        </Animated.View>

        {/* Animated Content Wrapper */}
        <Animated.View style={{
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }]
        }}>

          {/* Emergency Section */}
          {emergencyService && (
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

          {/* Services Heading */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: SPACING.lg, marginBottom: SPACING.md }]}>Services</Text>

          {/* Service Grid */}
          <View style={styles.grid}>
            {otherServices.map((service, index) => {
              const cardOpacity = cardsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });
              const cardTranslateY = cardsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 + index * 10, 0],
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

          {/* Why Sheriyakam Section */}
          <View style={styles.whySection}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginBottom: SPACING.lg, textAlign: 'center' }]}>
              Why Sheriyakam?
            </Text>
            <View style={styles.whyGrid}>
              <View style={[styles.whyCard, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff' }]}>
                <Shield size={32} color={colors.accent} />
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Verified Partners</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>All electricians are licensed</Text>
              </View>
              <View style={[styles.whyCard, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff' }]}>
                <CheckCircle size={32} color={COLORS.success} />
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>OTP-Locked Safety</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>Secure job start/end</Text>
              </View>
              <View style={[styles.whyCard, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff' }]}>
                <Zap size={32} color={COLORS.gold} />
                <Text style={[styles.whyCardTitle, { color: colors.textPrimary }]}>Upfront Pricing</Text>
                <Text style={[styles.whyCardText, { color: colors.textSecondary }]}>No hidden charges</Text>
              </View>
            </View>
          </View>

          {/* FAQ Section for SEO & Customer Trust */}
          <View style={[styles.whySection, { paddingBottom: 60, borderTopWidth: 0 }]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginBottom: SPACING.lg, textAlign: 'center' }]}>
              Frequently Asked Questions
            </Text>
            <View style={{ gap: SPACING.lg, paddingHorizontal: SPACING.sm }}>
              {[
                  { q: "How much does an electrician cost near me?", a: "Our base inspection charge is highly affordable. However, the total cost depends on the specific repair—pricing is always clear and upfront before work begins." },
                  { q: "What is the best way to request emergency home repair?", a: "Simply tap the 'Emergency Repair Specialist' button at the top of the app. We prioritize complete power failures, short circuits, and massive leaks." },
                  { q: "How fast will my water motor or AC be fixed?", a: "We focus on quick, professional resolution. Depending on availability in Kerala, our verified partners aim for same-day or next-day service." }
              ].map((faq, i) => (
                <View key={i} style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#f9fafb', padding: SPACING.md, borderRadius: 12 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>{faq.q}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 22 }}>{faq.a}</Text>
                </View>
              ))}
            </View>
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
    // backgroundColor: REMOVED dynamic
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 80, // Space for BottomNav
    // paddingTop is handled by content spacing now
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
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
    padding: 8,
    borderRadius: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: dynamic
  },
  titleContainer: {
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800', // Made bolder
    // color: dynamic
  },
  headerSubtitle: {
    fontSize: 28, // This is overridden by inline style above anyway
    fontWeight: 'bold',
    // color: dynamic
  },
  heroSection: {
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: 16,
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
    // color: dynamic
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  section: {
    marginBottom: SPACING.lg,
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
    fontWeight: 'bold',
    // color: dynamic
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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

  whySection: {
    paddingVertical: SPACING.xl,
    marginTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
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
    borderColor: 'rgba(255,255,255,0.05)',
    textAlign: 'center',
  },
  whyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  whyCardText: {
    fontSize: 14,
  },
});
