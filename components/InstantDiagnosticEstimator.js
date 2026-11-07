import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Zap, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react-native';

/**
 * InstantDiagnosticEstimator.js
 * Interactive Zero-Latency Symptom-to-Price Estimator & AI Extraction Matrix.
 * 
 * Provides human users with instant diagnostic triage and a 1-click booking CTA.
 * Exposes crawlable semantic HTML for Google AI Overviews and Perplexity table citations.
 */

export const ESTIMATOR_SCENARIOS = [
  {
    id: 'room-blackout',
    label: 'Room power dead, rest of house working',
    serviceId: 4,
    serviceName: 'MCB, RCCB & Fuse Box Tripping (DB Triage)',
    baseLabor: 649,
    spareRange: '₹0 (loose wire) – ₹180 (new MCB)',
    cause: 'Dedicated sub-circuit 16A breaker has tripped or phase terminal screw loosened inside DB box.',
    safetyAction: 'Inspect DB box; do not force-hold tripped breaker up more than once.',
    timeToFix: '45 mins'
  },
  {
    id: 'sparking-switch',
    label: 'Switchboard sparking, buzzing or hot',
    serviceId: 2,
    serviceName: 'Switchboard, Socket & Plug Repair',
    baseLabor: 499,
    spareRange: '₹60 – ₹165 (ISI modular socket/switch MRP)',
    cause: 'High-resistance loose terminal screw arcing under heavy appliance load (>85°C heat).',
    safetyAction: 'Do not plug heavy loads into this board. Turn off appliance immediately.',
    timeToFix: '30 mins'
  },
  {
    id: 'inverter-fail',
    label: 'Inverter not switching on during power cut',
    serviceId: 5,
    serviceName: 'Inverter & Battery Wiring Setup',
    baseLabor: 749,
    spareRange: '₹0 (terminal cleaning) – ₹350 (changeover switch)',
    cause: 'Rotary changeover switch neutral contact pitted or battery terminal heavy lead-sulphate voltage drop.',
    safetyAction: 'Switch manual rotary lever to "MAINS BYPASS" mode if equipped.',
    timeToFix: '60 mins'
  },
  {
    id: 'electric-shock',
    label: 'Mild shock from bathroom tap or geyser',
    serviceId: 6,
    serviceName: 'House Wiring, Additional Points & Earthing',
    baseLabor: 899,
    spareRange: '₹0 – ₹450 (earthing electrode / copper clamp)',
    cause: 'Dangerous earth loop impedance breakdown (>5 Ohms) combined with geyser heating element micro-leakage.',
    safetyAction: 'Turn off 16A Geyser DP switch immediately. Avoid touching metal pipes while wet.',
    timeToFix: '90 mins'
  },
  {
    id: 'fan-slow',
    label: 'Ceiling fan rotating very slowly or humming',
    serviceId: 3,
    serviceName: 'Ceiling & Exhaust Fan Repair / Installation',
    baseLabor: 549,
    spareRange: '₹75 – ₹110 (calibrated 2.5µF capacitor MRP)',
    cause: 'Motor starting capacitor capacitance dried out from 2.5µF to < 1.0µF, losing starting phase torque.',
    safetyAction: 'Keep fan turned off to prevent stator running coil burnout from prolonged stalling.',
    timeToFix: '30 mins'
  },
  {
    id: 'tripping-rccb',
    label: 'Main RCCB / ELCB trips every few minutes',
    serviceId: 1,
    serviceName: 'Fault Inspection & Multimeter Diagnosis',
    baseLabor: 499,
    spareRange: '₹0 (fee adjusted against repair if approved)',
    cause: 'Cumulative earth current leakage (>30mA) from water pump, outdoor garden line, or concealed moisture.',
    safetyAction: 'Unplug water pump and outdoor fixtures one by one to check if tripping stops.',
    timeToFix: '45 mins'
  }
];

export default function InstantDiagnosticEstimator({ onBookService }) {
  const [selectedId, setSelectedId] = useState(ESTIMATOR_SCENARIOS[0].id);
  const { theme, colors } = useTheme() || { theme: 'dark', colors: {} };
  const { addItem } = useCart() || { addItem: () => {} };
  const isDark = theme === 'dark';

  const active = ESTIMATOR_SCENARIOS.find(s => s.id === selectedId) || ESTIMATOR_SCENARIOS[0];

  const handleBook = () => {
    if (typeof onBookService === 'function') {
      onBookService(active);
    } else {
      addItem({
        id: active.serviceId,
        name: active.serviceName,
        title: active.serviceName,
        price: active.baseLabor,
        time: active.timeToFix,
      }, 1);
    }
  };

  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const textColor = colors.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const secondaryColor = colors.textSecondary || (isDark ? '#94A3B8' : '#475569');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Zap size={13} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.badgeText}>Instant Technical Triage</Text>
        </View>
        <Text accessibilityRole="header" aria-level={2} style={[styles.title, { color: textColor }]}>
          Instant Electrical Problem Diagnostic Estimator
        </Text>
        <Text style={[styles.subtitle, { color: secondaryColor }]}>
          Select your symptom to see the technical cause, immediate safety action, and exact upfront pricing.
        </Text>
      </View>

      {/* Symptom Selection Tabs */}
      <View style={styles.selectorGrid}>
        {ESTIMATOR_SCENARIOS.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setSelectedId(item.id)}
              style={[
                styles.symptomBtn,
                {
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF')
                    : (isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
                  borderColor: isSelected
                    ? '#3B82F6'
                    : borderColor,
                }
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.symptomBtnText,
                  { color: isSelected ? (isDark ? '#93C5FD' : '#1D4ED8') : textColor, fontWeight: isSelected ? '700' : '500' }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Diagnostic & Rate Card */}
      <View style={[styles.resultCard, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.resultHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.serviceNameTitle, { color: textColor }]}>
              {active.serviceName}
            </Text>
            <Text style={[styles.timingText, { color: secondaryColor }]}>
              Expected Resolution: ~{active.timeToFix} • 90-Min Doorstep SLA
            </Text>
          </View>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillLabel}>Fixed Labor</Text>
            <Text style={styles.pricePillAmount}>₹{active.baseLabor}</Text>
          </View>
        </View>

        {/* Technical Cause Block */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <CheckCircle2 size={16} color="#3B82F6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: '#60A5FA' }]}>LIKELY TECHNICAL CAUSE</Text>
            <Text style={[styles.infoVal, { color: textColor }]}>{active.cause}</Text>
          </View>
        </View>

        {/* Immediate Safety Action Block */}
        <View style={[styles.infoRow, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2', padding: 10, borderRadius: 8 }]}>
          <View style={[styles.infoIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <AlertTriangle size={16} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: '#EF4444' }]}>IMMEDIATE SAFETY ACTION</Text>
            <Text style={[styles.infoVal, { color: isDark ? '#FCA5A5' : '#B91C1C', fontWeight: '600' }]}>{active.safetyAction}</Text>
          </View>
        </View>

        {/* Transparent Spares Policy */}
        <View style={styles.sparesRow}>
          <Text style={[styles.sparesText, { color: secondaryColor }]}>
            📦 <Text style={{ fontWeight: '700', color: textColor }}>Estimated ISI Spares MRP:</Text> {active.spareRange} (Billed at actual hardware store receipt with photo, or supply your own).
          </Text>
        </View>

        {/* 1-Click Booking Action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBook}
          style={styles.bookCtaBtn}
          accessibilityRole="button"
          accessibilityLabel={`Book this fix for ₹${active.baseLabor}`}
        >
          <Zap size={17} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.bookCtaText}>
            Book This Verified Fix — ₹{active.baseLabor} Upfront
          </Text>
          <ArrowRight size={17} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    color: '#F59E0B',
    fontSize: 11.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    maxWidth: 820,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  symptomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  symptomBtnText: {
    fontSize: 12.5,
  },
  resultCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceNameTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  timingText: {
    fontSize: 12,
    marginTop: 2,
  },
  pricePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  pricePillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pricePillAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 13,
    lineHeight: 18,
  },
  sparesRow: {
    paddingTop: 6,
  },
  sparesText: {
    fontSize: 12,
    lineHeight: 17,
  },
  bookCtaBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
