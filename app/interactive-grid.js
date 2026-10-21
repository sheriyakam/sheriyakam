import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity,
  Platform, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import {
  Zap, ArrowLeft, ShieldCheck, Phone, MessageCircle, Volume2,
  VolumeX, Sparkles, Radio, Activity, Compass, ChevronRight
} from 'lucide-react-native';
import ThreeCircuitCanvas from '../components/ThreeCircuitCanvas';
import InteractiveBreaker from '../components/InteractiveBreaker';
import KeralaGridRadar from '../components/KeralaGridRadar';
import InteractiveLoadCalculator from '../components/InteractiveLoadCalculator';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import BookingModal from '../components/BookingModal';
import { soundFx } from '../services/audioFx';
import { openWhatsApp } from '../utils/whatsapp';

export default function InteractiveGridScreen() {
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingService, setBookingService] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleEmergencyDispatch = () => {
    soundFx.playClick();
    setBookingService({
      id: 'emergency-dispatch',
      name: '24/7 Rapid Emergency Breakdown Dispatch',
      price: 49,
      specialty: '90-Min Immediate On-Site Triage & Fault Isolation'
    });
    setShowBookingModal(true);
  };

  const handleDistrictDispatch = (district) => {
    soundFx.playClick();
    setBookingService({
      id: `district-${district.id}`,
      name: `${district.name} On-Site Diagnostic Inspection`,
      price: 49,
      specialty: `Assigned to ${district.name} KSELB Wiremen (${district.avgTime} SLA)`
    });
    setShowBookingModal(true);
  };

  const handleBookWithSetup = (setup) => {
    soundFx.playClick();
    setBookingService({
      id: 'custom-load-inspection',
      name: `Full Load & Safety Inspection (${setup.kiloWatts} kW Setup)`,
      price: 49,
      specialty: `${setup.breaker} • ${setup.wireGauge} Verification`
    });
    setShowBookingModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Head>
        <title>Interactive Power Grid & Engineering Lab | Sheriyakam Kerala</title>
        <meta
          name="description"
          content="Experience Kerala's live electrical grid telemetry, interactive DIN-rail breaker simulation, 14-district technician radar, and appliance load calculator."
        />
      </Head>
      <StatusBar barStyle="light-content" backgroundColor="#050814" />

      {/* Background 3D Three.js WebGL Canvas */}
      <ThreeCircuitCanvas style={StyleSheet.absoluteFillObject} />

      {/* Top Floating App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#F8FAFC" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.appBarRight}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleMute}
            style={styles.audioPill}
          >
            {isMuted ? <VolumeX size={15} color="#94A3B8" /> : <Volume2 size={15} color="#38BDF8" />}
            <Text style={[styles.audioPillText, !isMuted && styles.audioPillTextActive]}>
              {isMuted ? 'Muted' : 'Spatial FX'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Linking.openURL('tel:+919876543210')}
            style={styles.phonePill}
          >
            <Phone size={14} color="#FFFFFF" />
            <Text style={styles.phonePillText}>24/7 Hotline</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroHeader}>
          <View style={styles.gridTelemetryPill}>
            <Activity size={14} color="#10B981" />
            <Text style={styles.gridTelemetryText}>
              230.4 V • 50.02 HZ • 14 DISTRICTS SYNCHRONIZED
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Interactive Electrical Engineering Lab
          </Text>

          <Text style={styles.heroMalayalam}>
            "കേരളത്തിലെ ഏറ്റവും വലിയ ഇന്ററാക്ടീവ് ഇലക്ട്രിക്കൽ പവർ ഗ്രിഡ്"
          </Text>

          <Text style={styles.heroDescription}>
            Explore our live 3D electrical network, test DIN-rail circuit breakers in real time, inspect technician radar across all 14 Kerala districts, and calculate your home’s exact wire gauge & load requirements.
          </Text>

          <View style={styles.heroCtaRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleEmergencyDispatch}
              style={styles.emergencyHeroBtn}
            >
              <Zap size={18} color="#FFFFFF" />
              <Text style={styles.emergencyHeroBtnText}>
                Instant Emergency Dispatch (90 Mins)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => openWhatsApp('Need technical inspection assistance in Kerala')}
              style={styles.whatsappHeroBtn}
            >
              <MessageCircle size={18} color="#25D366" />
              <Text style={styles.whatsappHeroBtnText}>WhatsApp Engineer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature 1: Interactive Breaker Simulator */}
        <InteractiveBreaker onEmergencyClick={handleEmergencyDispatch} />

        {/* Feature 2: 14-District Live Dispatch Radar */}
        <KeralaGridRadar onSelectDistrict={handleDistrictDispatch} />

        {/* Feature 3: Smart Load & Wire Gauge Calculator */}
        <InteractiveLoadCalculator onBookWithSetup={handleBookWithSetup} />

        {/* Feature 4: Before & After Engineering Standard Comparison */}
        <BeforeAfterSlider />

        {/* Bottom Assurance Banner */}
        <View style={styles.footerBanner}>
          <ShieldCheck size={28} color="#F59E0B" />
          <View style={styles.footerBannerTextWrap}>
            <Text style={styles.footerBannerTitle}>
              KSELB Class-A Certified & 30-Day Unconditional Warranty
            </Text>
            <Text style={styles.footerBannerSub}>
              Every Sheriyakam wireman is licensed by the Kerala State Electricity Licensing Board. ₹10,000 property damage protection included with every booking.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleEmergencyDispatch}
            style={styles.footerBookBtn}
          >
            <Text style={styles.footerBookBtnText}>Book Visit (₹49)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Booking Intake Modal */}
      {showBookingModal && (
        <BookingModal
          visible={showBookingModal}
          service={bookingService}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050814',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
    zIndex: 10,
    backdropFilter: 'blur(12px)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  audioPillText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  audioPillTextActive: {
    color: '#38BDF8',
  },
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  phonePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  heroHeader: {
    paddingVertical: 32,
    alignItems: 'flex-start',
  },
  gridTelemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  gridTelemetryText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  heroMalayalam: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  heroDescription: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 24,
    maxWidth: 720,
  },
  heroCtaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  emergencyHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.45)',
  },
  emergencyHeroBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  whatsappHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.4)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  whatsappHeroBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#0A0F1D',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 22,
    marginTop: 32,
    boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
    flexWrap: 'wrap',
  },
  footerBannerTextWrap: {
    flex: 1,
    minWidth: 260,
  },
  footerBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  footerBannerSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  footerBookBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  footerBookBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
});
