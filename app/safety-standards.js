import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import {
  ArrowLeft, ShieldCheck, AlertTriangle, Zap, CloudLightning,
  Droplets, Award, CheckCircle2, ChevronRight, Phone, MessageCircle
} from 'lucide-react-native';
import BookingModal from '../components/BookingModal';
import { soundFx } from '../services/audioFx';
import { openWhatsApp } from '../utils/whatsapp';

const STANDARDS_CHAPTERS = [
  {
    id: 'rccb',
    title: '1. The 30mA Life-Saving RCCB Mandate',
    icon: Zap,
    color: '#10B981',
    summary: 'Why ordinary MCBs do not protect human life from electrocution.',
    details: 'An MCB (Miniature Circuit Breaker) only trips when current exceeds 16A or 32A to protect wires from catching fire. But just 0.03 Amperes (30mA) through a human heart can cause fatal ventricular fibrillation. In tropical Kerala with humid weather, wet tiled floors, and frequent barefoot movement, a 30mA RCCB (Residual Current Circuit Breaker) cuts power in under 30 milliseconds before shock becomes fatal.'
  },
  {
    id: 'earthing',
    title: '2. Chemical Earthing in Kerala Laterite Soil',
    icon: Droplets,
    color: '#38BDF8',
    summary: 'Overcoming high soil electrical resistivity in Kerala hills and coastlines.',
    details: 'Traditional salt-and-charcoal GI pipe earthing degrades within 2-3 years due to heavy monsoon washouts and dry summers. Sheriyakam installs copper-bonded chemical earthing electrodes encased in conductive bentonite compound. This guarantees verified earth resistance below 2.0 Ohms across all 14 districts, ensuring fault currents safely disperse into the ground instead of leaking onto appliance chassis.'
  },
  {
    id: 'lightning',
    title: '3. Tropical Monsoon Lightning & Surge Protection (SPD)',
    icon: CloudLightning,
    color: '#F59E0B',
    summary: 'Protecting expensive smart TVs, inverter boards, and solar arrays from 40kV surges.',
    details: 'Kerala experiences severe pre-monsoon and post-monsoon thunderstorms. A nearby lightning strike can inject a 40,000 Volt transient spike into overhead KSEB distribution lines. We install DIN-rail Type-2 Surge Protective Devices (SPDs) with replaceable varistor cartridges that clamp dangerous overvoltages to safe levels in nanoseconds.'
  },
  {
    id: 'copper',
    title: '4. Pure Electrolytic Copper vs Dangerous Counterfeit Wire',
    icon: ShieldCheck,
    color: '#EC4899',
    summary: 'Eliminating high-resistance aluminum alloy wiring that sparks inside conduits.',
    details: 'Cheap counterfeit cables use copper-clad aluminum (CCA), which has 60% higher electrical resistance. When loaded with modern air conditioners, water heaters, and induction stoves, CCA cables overheat inside wall PVC conduits, melting insulation and igniting concealed fires. Sheriyakam strictly uses 99.97% pure electrolytic grade FRLS copper conforming to IS 694 standards.'
  }
];

const VETTING_STEPS = [
  'KSELB Wireman / Supervisor Class-A or Class-B Government License Verification',
  'State Police Clearance & National ID KYC Validation',
  'Field Evaluation on Insulation Resistance (Megger Test) & Fault Isolation',
  'Mandatory 1000V VDE Insulated Tooling & True-RMS Digital Multimeter Kit',
  'Customer Communication & Clean-Up Etiquette Training in Malayalam and English',
  'Continuous Rating Threshold: Technicians below 4.7/5 stars receive mandatory retraining'
];

export default function SafetyStandardsScreen() {
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedId, setExpandedId] = useState('rccb');

  const handleBookAudit = () => {
    soundFx.playClick();
    setShowBookingModal(true);
  };

  const handleToggleChapter = (id) => {
    soundFx.playClick();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Head>
        <title>KSELB Kerala Electrical Safety Standard | Sheriyakam</title>
        <meta
          name="description"
          content="Kerala's official electrical engineering safety benchmark: 30mA RCCB mandates, chemical earthing soil resistivity, lightning surge protection, and KSELB technician verification."
        />
      </Head>
      <StatusBar barStyle="light-content" backgroundColor="#050814" />

      {/* Top Header */}
      <View style={styles.appBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#F8FAFC" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.certBadge}>
          <Award size={15} color="#F59E0B" />
          <Text style={styles.certBadgeText}>KSELB Standardized</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTag}>THE SHERIYAKAM ENGINEERING CHARTER</Text>
          <Text style={styles.heroTitle}>
            Kerala Electrical Safety Standards & KSELB Protocol
          </Text>
          <Text style={styles.heroSubtitle}>
            How we protect Kerala homes from electrical fires, monsoon moisture leakage, lightning strikes, and fatal shocks.
          </Text>
        </View>

        {/* 4 Core Safety Pillars */}
        <Text style={styles.sectionHeading}>4 Critical Tropical Engineering Pillars</Text>

        <View style={styles.chaptersContainer}>
          {STANDARDS_CHAPTERS.map((chap) => {
            const Icon = chap.icon;
            const isExpanded = expandedId === chap.id;
            return (
              <TouchableOpacity
                key={chap.id}
                activeOpacity={0.88}
                onPress={() => handleToggleChapter(chap.id)}
                style={[styles.chapterCard, isExpanded && styles.chapterCardActive]}
              >
                <View style={styles.chapterHeader}>
                  <View style={[styles.chapterIconWrap, { backgroundColor: `${chap.color}15` }]}>
                    <Icon size={20} color={chap.color} />
                  </View>
                  <View style={styles.chapterHeaderTexts}>
                    <Text style={styles.chapterTitle}>{chap.title}</Text>
                    <Text style={styles.chapterSummary}>{chap.summary}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.chapterBody}>
                    <View style={styles.bodyDivider} />
                    <Text style={styles.chapterDetails}>{chap.details}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 10-Point Technician Verification Protocol */}
        <View style={styles.vettingSection}>
          <View style={styles.vettingHeader}>
            <ShieldCheck size={24} color="#38BDF8" />
            <View>
              <Text style={styles.vettingTitle}>The 6-Step Wireman Vetting Protocol</Text>
              <Text style={styles.vettingSub}>
                Only top 12% of applicants pass our technical benchmark before entering your home.
              </Text>
            </View>
          </View>

          <View style={styles.vettingList}>
            {VETTING_STEPS.map((step, index) => (
              <View key={index} style={styles.vettingItem}>
                <CheckCircle2 size={18} color="#10B981" style={{ marginTop: 2 }} />
                <Text style={styles.vettingItemText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Audit CTA Box */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Book a Complete 45-Point Home Safety Audit</Text>
          <Text style={styles.ctaDesc}>
            Our licensed master electrician arrives at your home anywhere in Kerala with a digital megger tester, earth resistance meter, and infrared thermography check. Upfront ₹49 diagnostic visit fee.
          </Text>

          <View style={styles.ctaButtonRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleBookAudit}
              style={styles.primaryCtaBtn}
            >
              <Zap size={18} color="#000000" />
              <Text style={styles.primaryCtaText}>Book Safety Audit (₹49)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => Linking.openURL('tel:+919876543210')}
              style={styles.phoneCtaBtn}
            >
              <Phone size={16} color="#FFFFFF" />
              <Text style={styles.phoneCtaText}>Speak to Master Electrician</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showBookingModal && (
        <BookingModal
          visible={showBookingModal}
          service={{
            id: '45-point-audit',
            name: '45-Point Electrical Health & Shock Safety Audit',
            price: 49,
            specialty: 'Megger Earth Testing, RCCB Trip Speed & Wire Gauge Inspection'
          }}
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(5, 8, 20, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
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
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  certBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    paddingVertical: 28,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  chaptersContainer: {
    gap: 12,
    marginBottom: 32,
  },
  chapterCard: {
    backgroundColor: '#0A0F1D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 18,
  },
  chapterCardActive: {
    borderColor: 'rgba(56, 189, 248, 0.5)',
    backgroundColor: '#0D1527',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  chapterIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterHeaderTexts: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  chapterSummary: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chapterBody: {
    marginTop: 14,
  },
  bodyDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  chapterDetails: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  vettingSection: {
    backgroundColor: '#0B1120',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 22,
    marginBottom: 32,
  },
  vettingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  vettingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vettingSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  vettingList: {
    gap: 12,
  },
  vettingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  vettingItemText: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  ctaBox: {
    backgroundColor: '#0A0F1D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 24,
    boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.8)',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ctaDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  ctaButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  phoneCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  phoneCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
});
