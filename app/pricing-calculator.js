import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import {
  ArrowLeft, Check, ShieldCheck, Zap, Plus, Minus, MessageCircle,
  Phone, ArrowRight, HelpCircle
} from 'lucide-react-native';
import BookingModal from '../components/BookingModal';
import { soundFx } from '../services/audioFx';
import { openWhatsApp } from '../utils/whatsapp';

const SERVICES_CATALOG = [
  { id: 'diag', name: 'Diagnostic & Fault Inspection Visit', basePrice: 49, time: '45 min', desc: 'On-site multimeter fault triage & upfront quote. 100% adjustable against repair.' },
  { id: 'switch', name: 'Switch & Socket Replacement', basePrice: 149, time: '30 min', desc: 'Sparking switch, burnt plug socket, 6A/16A power points replacement.' },
  { id: 'fan', name: 'Fan Repair & Installation', basePrice: 249, time: '30 min', desc: 'Ceiling, exhaust, or wall fan installation, capacitor replacement, wobble alignment.' },
  { id: 'mcb', name: 'MCB & Distribution Box Tripping Fix', basePrice: 349, time: '45 min', desc: 'Breaker replacement, RCCB nuisance tripping diagnosis, phase balancing.' },
  { id: 'inverter', name: 'Inverter & Battery Wiring', basePrice: 500, time: '60 min', desc: 'Dual-battery cabling, changeover switch installation, bypass testing.' },
  { id: 'rewiring', name: 'Complete Home Rewiring Assessment', basePrice: 550, time: '90 min', desc: 'Full-house insulation resistance testing, load calculation, line tracer mapping.' },
];

export default function PricingCalculatorScreen() {
  const router = useRouter();
  const [quantities, setQuantities] = useState({ diag: 1 });
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleQuantity = (id, delta) => {
    soundFx.playClick();
    setQuantities(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, Math.min(10, cur + delta));
      return { ...prev, [id]: next };
    });
  };

  const totals = Object.keys(quantities).reduce((acc, id) => {
    const qty = quantities[id] || 0;
    const s = SERVICES_CATALOG.find(x => x.id === id);
    if (s && qty > 0) {
      acc.total += s.basePrice * qty;
      acc.count += qty;
    }
    return acc;
  }, { total: 0, count: 0 });

  const finalTotal = Math.max(49, totals.total);

  const handleBookNow = () => {
    soundFx.playClick();
    setShowBookingModal(true);
  };

  const handleShareWhatsAppQuote = () => {
    soundFx.playClick();
    let text = `*Sheriyakam Kerala Electrical Estimate*\n\n`;
    SERVICES_CATALOG.forEach(s => {
      const q = quantities[s.id] || 0;
      if (q > 0) {
        text += `• ${s.name} x${q}: ₹${s.basePrice * q}\n`;
      }
    });
    text += `\n*Total Estimated:* ₹${finalTotal}\n*Guarantee:* 30-Day Workmanship Warranty + ₹10,000 Safety Shield\n\nPlease confirm technician arrival time.`;
    openWhatsApp(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Head>
        <title>Transparent Electrical Pricing & Instant Calculator | Sheriyakam</title>
        <meta
          name="description"
          content="Kerala's 100% transparent electrical service rate card. Starting at ₹49 diagnostic visit. No surge pricing, zero material markup, 30-day warranty."
        />
      </Head>
      <StatusBar barStyle="light-content" backgroundColor="#050814" />

      {/* Top Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#F8FAFC" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.guaranteeTag}>
          <ShieldCheck size={14} color="#10B981" />
          <Text style={styles.guaranteeText}>No Hidden Surge Fees</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroPre}>KERALA’S TRANSPARENT RATE CARD</Text>
          <Text style={styles.heroTitle}>Electrical Service Pricing & Estimate Builder</Text>
          <Text style={styles.heroDesc}>
            Select services below to build an instant transparent estimate. Every job includes an official digital invoice, UPI payment after full inspection, and our 30-day unconditional rework warranty.
          </Text>
        </View>

        {/* Services Catalog */}
        <View style={styles.catalogList}>
          {SERVICES_CATALOG.map((item) => {
            const count = quantities[item.id] || 0;
            return (
              <View key={item.id} style={[styles.catalogItem, count > 0 && styles.catalogItemActive]}>
                <View style={styles.catalogItemInfo}>
                  <View style={styles.namePriceRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.basePrice}</Text>
                  </View>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                  <Text style={styles.itemDuration}>Typical SLA: {item.time}</Text>
                </View>

                <View style={styles.counterWrap}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleQuantity(item.id, -1)}
                    style={[styles.countBtn, count === 0 && styles.countBtnDisabled]}
                  >
                    <Minus size={14} color="#F8FAFC" />
                  </TouchableOpacity>

                  <Text style={styles.countText}>{count}</Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleQuantity(item.id, 1)}
                    style={styles.countBtn}
                  >
                    <Plus size={14} color="#F8FAFC" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quotation Sticky Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Live Estimate Breakdown</Text>
            <Text style={styles.summaryTotal}>₹{finalTotal}</Text>
          </View>
          <Text style={styles.summarySub}>
            Includes KSELB certified wireman visit, insulation testing, and 30-day warranty. Materials charged at exact store MRP if required.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleBookNow}
              style={styles.bookBtn}
            >
              <Zap size={16} color="#000000" />
              <Text style={styles.bookBtnText}>Book Technician at ₹{finalTotal}</Text>
              <ArrowRight size={16} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleShareWhatsAppQuote}
              style={styles.shareBtn}
            >
              <MessageCircle size={16} color="#25D366" />
              <Text style={styles.shareBtnText}>WhatsApp Quotation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3 Promises */}
        <View style={styles.promiseGrid}>
          <View style={styles.promiseCard}>
            <ShieldCheck size={20} color="#38BDF8" />
            <Text style={styles.promiseTitle}>Zero Material Markup</Text>
            <Text style={styles.promiseText}>
              You pay exact store receipt price for wires, switches, or breakers. You can also provide your own hardware.
            </Text>
          </View>

          <View style={styles.promiseCard}>
            <Zap size={20} color="#F59E0B" />
            <Text style={styles.promiseTitle}>Pay After Testing</Text>
            <Text style={styles.promiseText}>
              Never pay upfront. You inspect the completed fix, test with our technician, and pay via UPI QR code or cash.
            </Text>
          </View>
        </View>
      </ScrollView>

      {showBookingModal && (
        <BookingModal
          visible={showBookingModal}
          service={{
            id: 'custom-estimate-booking',
            name: `Custom Service Package (${totals.count || 1} Services)`,
            price: finalTotal,
            specialty: 'Calculated via Transparent Estimate Builder'
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
  guaranteeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  guaranteeText: {
    color: '#10B981',
    fontSize: 11,
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
  heroPre: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
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
  heroDesc: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginTop: 10,
  },
  catalogList: {
    gap: 12,
    marginBottom: 28,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0F1D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.18)',
    padding: 18,
  },
  catalogItemActive: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    backgroundColor: '#0D1527',
  },
  catalogItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F59E0B',
    marginLeft: 12,
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 4,
  },
  itemDuration: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 6,
    fontWeight: '600',
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  countBtnDisabled: {
    opacity: 0.3,
  },
  countText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    minWidth: 18,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#070C18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 22,
    boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.8)',
    marginBottom: 28,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryTotal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F59E0B',
  },
  summarySub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookBtn: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  promiseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  promiseCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#0A0F1D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    padding: 18,
  },
  promiseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 10,
    marginBottom: 4,
  },
  promiseText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
});
