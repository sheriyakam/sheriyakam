import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Activity, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react-native';

/**
 * DiagnosticRateMatrix.js
 * High-Information-Gain Semantic HTML Data Table Component.
 * 
 * Renders real <table>, <thead>, <tbody>, <tr>, <th>, <td> tags on web
 * for direct extraction by Google AI Overviews, Perplexity, and ChatGPT Search.
 */

const DIAGNOSTIC_ROWS = [
  {
    symptom: 'MCB / RCCB trips instantly when Geyser, AC, or Motor is turned on',
    rootCause: '16A appliance heating element breakdown or neutral-to-earth leakage (>30mA). Tested via True-RMS leakage clamp and 500V DC megger test.',
    industryTrap: 'Unlicensed handymen bypass the 16A breaker with a 32A fuse or wire jumper, causing extreme cable melting and house fire hazard.',
    protocolAndCost: 'DB Triage & Circuit Isolation at ₹649 base labor. Faulty breaker replaced with ISI-standard breaker at store MRP with store bill. 30-day warranty.'
  },
  {
    symptom: 'Switchboard makes buzzing/sparking noise, smells like burning plastic, or socket turns yellow',
    rootCause: 'High-resistance terminal screw causing arc heating (>85°C). Tested via infrared thermal scan and terminal torque resistance check.',
    industryTrap: 'Shaving frayed wire strands and jamming them into the burnt socket without cutting back oxidized copper, reigniting arcs within days.',
    protocolAndCost: 'Switch & 16A Socket Repair at ₹499 base labor. Oxidized wire cut back to clean copper, fitted with genuine modular switch at retail MRP. 30-day warranty.'
  },
  {
    symptom: 'Ceiling fan runs very slow at speed 5, hums loudly, or needs a manual push with a stick to rotate',
    rootCause: 'Motor starting capacitor electrolyte dried out (capacitance degraded from 2.5µF to < 1.0µF). Tested with digital LCR capacitance meter.',
    industryTrap: 'Installing oversized 4.0µF capacitors to temporarily boost speed, which overheats and permanently burns out stator coils within 3 months.',
    protocolAndCost: 'Fan Repair & Capacitor Replacement at ₹549 base labor. Calibrated 2.5µF / 3.15µF heavy-duty capacitor installed with rotor balancing. 30-day warranty.'
  },
  {
    symptom: 'Power cut occurs but inverter does not supply power, or lights flicker violently during transition',
    rootCause: 'Rotary changeover switch contact pitting, loose battery DC terminal lugs, or sub-circuit neutral backfeed. Tested with DC voltage drop & phase isolation.',
    industryTrap: 'Falsely claiming the customer\'s tubular battery is dead and pushing an unnecessary ₹14,000 replacement battery sale.',
    protocolAndCost: 'Inverter Wiring & Changeover Setup at ₹749 base labor. Hydraulic terminal lug crimping, petroleum jelly anti-corrosion coating. 30-day warranty.'
  },
  {
    symptom: 'Tingling or mild electric shock felt when touching bathroom water tap, metal pipe, or washing machine',
    rootCause: 'Earth loop impedance failure (earth resistance > 5 Ohms) combined with appliance phase leakage. Tested with four-terminal earth tester.',
    industryTrap: 'Tying a loose ground wire to plumbing pipes instead of testing the earth electrode, electrifying the entire home plumbing network.',
    protocolAndCost: 'Earthing Triage & Safety Assessment at ₹899 base labor. Dedicated copper earth electrode inspection, CEA compliance check (< 5 Ohms). 30-day warranty.'
  },
  {
    symptom: 'Electricity bill suddenly doubled without adding new appliances, or KSEB meter blinks rapidly with load off',
    rootCause: 'Concealed conduit wire insulation degradation causing continuous micro-arcing to moist concrete. Tested via phase-to-ground megger test.',
    industryTrap: 'Randomly breaking open plaster across multiple rooms guessing where the short is, costing thousands in unnecessary masonry repairs.',
    protocolAndCost: 'Multimeter Fault Inspection at ₹499 base labor. Pinpoint isolation of faulty conduit branch before any wall is opened. Fee waived if repair approved.'
  }
];

const COMPARISON_ROWS = [
  { feature: 'Dispatched Wireman Licensing', sheriyakam: '100% KSELB Class-B or Supervisor Licensed', industry: 'Unverified local handymen / uncertified helpers' },
  { feature: 'Arrival SLA Window', sheriyakam: '45–90 Minutes across Thalassery–Mahe Corridor', industry: 'Unpredictable "varam" promises (often 4–24 hrs late)' },
  { feature: 'Diagnostic Equipment', sheriyakam: 'True-RMS Digital Multimeters, Meggers & RCCB Testers', industry: 'Basic neon test-pen only (fails to detect micro-leaks)' },
  { feature: 'Spare Parts Billing', sheriyakam: 'Actual Hardware Store Bill Photo at Retail MRP (₹0 Markup)', industry: 'Arbitrary 50%–100% hidden markup on spares' },
  { feature: 'Workmanship Warranty', sheriyakam: '30-Day Direct Warranty — ₹0 Revisit Fee on Repaired Point', industry: 'Zero warranty; charges full visit fee again next day' },
  { feature: 'Payment Timing', sheriyakam: 'Pay ONLY after work is tested & demonstrated (UPI / Cash)', industry: 'Demand advance cash before starting inspection' }
];

export default function DiagnosticRateMatrix() {
  const { theme, colors } = useTheme() || { theme: 'dark', colors: {} };
  const isDark = theme === 'dark';

  const tableBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const headerBg = isDark ? '#1E293B' : '#F1F5F9';
  const textColor = colors.textPrimary || (isDark ? '#F8FAFC' : '#0F172A');
  const secondaryColor = colors.textSecondary || (isDark ? '#94A3B8' : '#475569');

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.headerBlock}>
        <View style={styles.badgeRow}>
          <Activity size={14} color="#3B82F6" />
          <Text style={styles.badgeText}>Verified E-E-A-T Trade Matrix</Text>
        </View>
        <Text accessibilityRole="header" aria-level={2} style={[styles.mainHeading, { color: textColor }]}>
          Electrical Diagnostic & Transparent Rate Matrix
        </Text>
        <Text style={[styles.subHeading, { color: secondaryColor }]}>
          Direct practitioner diagnostics, root causes, competitor traps to avoid, and exact upfront fixed pricing across the Thalassery–Mahe corridor.
        </Text>
      </View>

      {/* Semantic HTML Table 1: Diagnostic & Rate Matrix */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollWrapper}>
        <View style={{ minWidth: 920 }}>
          {Platform.OS === 'web' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: tableBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${borderColor}`, fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: headerBg }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: textColor, fontWeight: '700', width: '22%', borderBottom: `2px solid ${borderColor}` }}>Common Problem / Symptom</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: textColor, fontWeight: '700', width: '28%', borderBottom: `2px solid ${borderColor}` }}>Technical Root Cause & Diagnostic Check</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#EF4444', fontWeight: '700', width: '25%', borderBottom: `2px solid ${borderColor}` }}>⚠️ Standard Industry Trap</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#10B981', fontWeight: '700', width: '25%', borderBottom: `2px solid ${borderColor}` }}>Verified Protocol & Exact Upfront Cost</th>
                </tr>
              </thead>
              <tbody>
                {DIAGNOSTIC_ROWS.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)') }}>
                    <td style={{ padding: '14px 16px', verticalAlign: 'top', color: textColor, fontWeight: '600', lineHeight: '20px' }}>{row.symptom}</td>
                    <td style={{ padding: '14px 16px', verticalAlign: 'top', color: secondaryColor, lineHeight: '19px' }}>{row.rootCause}</td>
                    <td style={{ padding: '14px 16px', verticalAlign: 'top', color: isDark ? '#FCA5A5' : '#B91C1C', lineHeight: '19px', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.04)' : 'rgba(239, 68, 68, 0.03)' }}>{row.industryTrap}</td>
                    <td style={{ padding: '14px 16px', verticalAlign: 'top', color: textColor, lineHeight: '19px', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.04)' }}>
                      <strong style={{ color: '#10B981', display: 'block', marginBottom: 4 }}>{row.protocolAndCost.split(' at ')[0]}</strong>
                      {row.protocolAndCost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <View style={[styles.nativeTableWrap, { backgroundColor: tableBg, borderColor }]}>
              {DIAGNOSTIC_ROWS.map((row, idx) => (
                <View key={idx} style={[styles.nativeRow, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.nativeSymptom, { color: textColor }]}>⚡ {row.symptom}</Text>
                  <Text style={[styles.nativeDetail, { color: secondaryColor }]}>🔬 <Text style={{ fontWeight: '700' }}>Root Cause:</Text> {row.rootCause}</Text>
                  <Text style={[styles.nativeTrap]}>⚠️ <Text style={{ fontWeight: '700' }}>Avoid Trap:</Text> {row.industryTrap}</Text>
                  <Text style={[styles.nativeCost, { color: '#10B981' }]}>✅ <Text style={{ fontWeight: '700' }}>Sheriyakam Fix:</Text> {row.protocolAndCost}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Semantic HTML Table 2: What You Get vs. Industry Standard */}
      <View style={{ marginTop: 28 }}>
        <View style={{ marginBottom: 12 }}>
          <Text accessibilityRole="header" aria-level={3} style={[styles.subTableTitle, { color: textColor }]}>
            Sheriyakam Verified Standards vs. Uncertified Industry Benchmark
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollWrapper}>
          <View style={{ minWidth: 780 }}>
            {Platform.OS === 'web' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: tableBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${borderColor}`, fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: headerBg }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: textColor, fontWeight: '700', width: '30%', borderBottom: `2px solid ${borderColor}` }}>Operational Benchmark</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#10B981', fontWeight: '700', width: '35%', borderBottom: `2px solid ${borderColor}` }}>⚡ Sheriyakam Verified Protocol</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94A3B8', fontWeight: '700', width: '35%', borderBottom: `2px solid ${borderColor}` }}>Typical Unorganized Marketplace</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '12px 16px', color: textColor, fontWeight: '600' }}>{row.feature}</td>
                      <td style={{ padding: '12px 16px', color: '#10B981', fontWeight: '600', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.04)' }}>{row.sheriyakam}</td>
                      <td style={{ padding: '12px 16px', color: secondaryColor }}>{row.industry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <View style={[styles.nativeTableWrap, { backgroundColor: tableBg, borderColor }]}>
                {COMPARISON_ROWS.map((row, idx) => (
                  <View key={idx} style={[styles.nativeRow, { borderBottomColor: borderColor }]}>
                    <Text style={[styles.nativeSymptom, { color: textColor }]}>{row.feature}</Text>
                    <Text style={{ color: '#10B981', fontWeight: '700', marginVertical: 2 }}>Sheriyakam: {row.sheriyakam}</Text>
                    <Text style={{ color: secondaryColor }}>Standard: {row.industry}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  headerBlock: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  badgeText: {
    color: '#60A5FA',
    fontSize: 11.5,
    fontWeight: '700',
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 13.5,
    lineHeight: 20,
    maxWidth: 820,
  },
  subTableTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollWrapper: {
    borderRadius: 12,
  },
  nativeTableWrap: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nativeRow: {
    padding: 14,
    borderBottomWidth: 1,
    gap: 6,
  },
  nativeSymptom: {
    fontSize: 14,
    fontWeight: '700',
  },
  nativeDetail: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  nativeTrap: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#EF4444',
  },
  nativeCost: {
    fontSize: 12.5,
    lineHeight: 18,
  },
});
