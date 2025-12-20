import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Dimensions, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, MapPin, Menu as MenuIcon, ChevronDown } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import MenuModal from '../components/MenuModal';
import LocationModal from '../components/LocationModal';

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Emergency Repair Specialist",
    rating: 4.8,
    specialty: "Emergency Repairs",
    distance: "1.2 km",
    time: "1 hr",
    price: 500,
    image: require('../assets/images/emergency.png')
  },
  {
    id: 2,
    name: "Professional Wiring Expert",
    rating: 4.5,
    specialty: "Wiring & Installation",
    distance: "3.0 km",
    time: "1 hr",
    price: 450,
    image: require('../assets/images/wiring.png')
  },
  {
    id: 3,
    name: "Inverter Technician",
    rating: 5.0,
    specialty: "Inverter & UPS",
    distance: "0.8 km",
    time: "1 hr",
    price: 500,
    image: require('../assets/images/inverter.png')
  },
  {
    id: 4,
    name: "AC Service Expert",
    rating: 4.2,
    specialty: "Air Conditioning",
    distance: "5.0 km",
    time: "1 hr",
    price: 550,
    image: require('../assets/images/ac.png')
  },
  {
    id: 5,
    name: "Switch / Fuse Replacement",
    rating: 4.7,
    specialty: "Electrical Maintenance",
    distance: "2.1 km",
    time: "1 hr",
    price: 350,
    image: require('../assets/images/switch.png')
  },
  {
    id: 6,
    name: "Light / Fan Installation",
    rating: 4.6,
    specialty: "Installation Services",
    distance: "4.2 km",
    time: "1 hr",
    price: 400,
    image: require('../assets/images/light_fan.png')
  },
  {
    id: 7,
    name: "CCTV Technician",
    rating: 4.9,
    specialty: "Security Systems",
    distance: "2.5 km",
    time: "1 hr",
    price: 550,
    image: require('../assets/images/cctv.png')
  },
  {
    id: 8,
    name: "Home Automation",
    rating: 4.8,
    specialty: "Smart Home Setup",
    distance: "1.5 km",
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
  const [locationName, setLocationName] = useState('Calicut, Kerala');
  const [locationCoords, setLocationCoords] = useState(null);

  const { theme, colors } = useTheme();

  // Handle service click with authentication check
  const handleServiceClick = (service) => {
    if (!user) {
      // User not logged in - show alert
      Alert.alert(
        'Login Required',
        'Please login or sign up to book a service.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Login / Sign Up',
            onPress: () => router.push('/auth/login')
          }
        ]
      );
      return;
    }

    // User is logged in - open booking modal
    setSelectedService(service);
  };

  // Animation Refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const emergencyService = MOCK_SERVICES.find(s => s.name.includes('Emergency'));
  const otherServices = MOCK_SERVICES.filter(s => !s.name.includes('Emergency'));

  // Inline styles that depend on theme
  const dynamicStyles = {
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
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colors.bgPrimary} />

      {/* Sticky Top Bar */}
      <Animated.View style={[
        {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.sm, // reduced bottom padding to keep it tight
          backgroundColor: colors.bgPrimary,
          zIndex: 100
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
          <TouchableOpacity
            style={[styles.headerLocationBtn, dynamicStyles.headerLocationBtn]}
            onPress={() => setLocationVisible(true)}
          >
            <MapPin size={20} color={colors.accent} />
            <Text style={[styles.headerLocationText, dynamicStyles.headerLocationText]} numberOfLines={1}>{locationName}</Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Page Title (Scrollable) */}
        <Animated.View style={[
          { marginBottom: SPACING.lg },
          { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
        ]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Find expert</Text>
            <Text style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
              <Text style={{ color: colors.accent }}>electricians</Text> in Kerala
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
            {otherServices.map(service => (
              <ServiceCard
                key={service.id}
                {...service}
                onPress={() => handleServiceClick(service)}
              />
            ))}
          </View>

        </Animated.View>

      </ScrollView>

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
    paddingBottom: SPACING.md,
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
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontWeight: 'bold',
    // color: dynamic
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: dynamic
  },
  headerLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: dynamic
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    // borderColor: dynamic
    maxWidth: '50%',
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
    alignItems: 'flex-start',
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
});
