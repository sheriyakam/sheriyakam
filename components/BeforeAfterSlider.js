import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, AlertTriangle, ArrowLeftRight } from 'lucide-react-native';
import { soundFx } from '../services/audioFx';

/**
 * BeforeAfterSlider
 * Interactive before-and-after comparison of electrical wiring hazards vs Sheriyakam KSELB standards.
 */
export default function BeforeAfterSlider() {
  const [activeSide, setActiveSide] = useState('after'); // 'before' | 'after'

  const handleSelect = (side) => {
    setActiveSide(side);
    soundFx.playClick();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <ArrowLeftRight size={15} color="#38BDF8" />
          <Text style={styles.badgeTitle}>ENGINEERING MAKEOVER</Text>
        </View>
        <Text style={styles.isoTag}>Kerala Residential Safety Audit</Text>
      </View>

      <Text style={styles.heading}>Old Hazard vs Sheriyakam KSELB Standard</Text>
      <Text style={styles.subheading}>
        Tap below to switch between typical uncertified local wiring hazards and Sheriyakam’s certified KSELB rewiring standard.
      </Text>

      {/* Switcher Tabs */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelect('before')}
          style={[styles.toggleBtn, activeSide === 'before' && styles.toggleBtnBefore]}
        >
          <AlertTriangle size={15} color={activeSide === 'before' ? '#EF4444' : '#64748B'} />
          <Text style={[styles.toggleText, activeSide === 'before' && styles.toggleTextBefore]}>
            Before (Hazardous)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelect('after')}
          style={[styles.toggleBtn, activeSide === 'after' && styles.toggleBtnAfter]}
        >
          <ShieldCheck size={15} color={activeSide === 'after' ? '#10B981' : '#64748B'} />
          <Text style={[styles.toggleText, activeSide === 'after' && styles.toggleTextAfter]}>
            After (Sheriyakam Certified)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Display Card */}
      {activeSide === 'before' ? (
        <View style={styles.contentBoxBefore}>
          <View style={styles.statusRow}>
            <View style={styles.dangerPill}>
              <Text style={styles.dangerPillText}>FIRE & SHOCK HAZARD</Text>
            </View>
            <Text style={styles.yearText}>Uncertified Local Wiring</Text>
          </View>

          <View style={styles.pointsList}>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotDanger}>✕</Text>
              <Text style={styles.pointText}>Rewireable ceramic porcelain fuses without magnetic short-circuit protection</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotDanger}>✕</Text>
              <Text style={styles.pointText}>Substandard counterfeit aluminum or mixed copper wiring prone to melting under AC load</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotDanger}>✕</Text>
              <Text style={styles.pointText}>Zero RCCB earth leakage protection — high risk of fatal shock during Kerala monsoons</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotDanger}>✕</Text>
              <Text style={styles.pointText}>Tangled rat’s nest wiring inside distribution boxes causing heat retention</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.contentBoxAfter}>
          <View style={styles.statusRow}>
            <View style={styles.successPill}>
              <Text style={styles.successPillText}>100% KSELB CLASS-A CERTIFIED</Text>
            </View>
            <Text style={styles.yearText}>30-Day Unconditional Warranty</Text>
          </View>

          <View style={styles.pointsList}>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotSuccess}>✓</Text>
              <Text style={styles.pointText}>DIN-Rail MCB + 30mA Human Life Safety RCCB with sub-30 millisecond trip speed</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotSuccess}>✓</Text>
              <Text style={styles.pointText}>100% Virgin Electrolytic Copper FRLS (Flame Retardant Low Smoke) wiring</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotSuccess}>✓</Text>
              <Text style={styles.pointText}>Solid chemical earthing electrode installed with verified earth pit resistance &lt; 2 Ohms</Text>
            </View>
            <View style={styles.pointRow}>
              <Text style={styles.pointDotSuccess}>✓</Text>
              <Text style={styles.pointText}>Circuit numbered, laser-labeled distribution box with neat fire-retardant trunking</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#080E1C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 24,
    marginVertical: 18,
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  isoTag: {
    fontSize: 11,
    color: '#64748B',
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  subheading: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    gap: 6,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnBefore: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  toggleBtnAfter: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleTextBefore: {
    color: '#F87171',
  },
  toggleTextAfter: {
    color: '#34D399',
  },
  contentBoxBefore: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    padding: 18,
  },
  contentBoxAfter: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 18,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dangerPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dangerPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  successPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  successPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  yearText: {
    fontSize: 12,
    color: '#64748B',
  },
  pointsList: {
    gap: 12,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pointDotDanger: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1,
  },
  pointDotSuccess: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1,
  },
  pointText: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
});
