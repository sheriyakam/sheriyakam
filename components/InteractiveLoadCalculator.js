import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Calculator, Check, Zap, Gauge, AlertCircle, ArrowRight } from 'lucide-react-native';
import { soundFx } from '../services/audioFx';

const APPLIANCES = [
  { id: 'ac', name: '1.5-Ton Inverter AC', watts: 1600, defaultCount: 1, max: 4, icon: '❄️' },
  { id: 'induction', name: 'Induction Cooktop', watts: 2000, defaultCount: 0, max: 2, icon: '🍳' },
  { id: 'geyser', name: 'Instant Geyser / Water Heater', watts: 2000, defaultCount: 1, max: 3, icon: '🚿' },
  { id: 'fridge', name: 'Refrigerator & Kitchen Mixers', watts: 600, defaultCount: 1, max: 2, icon: '🧊' },
  { id: 'fans', name: 'Ceiling Fans & LED Lighting', watts: 400, defaultCount: 1, max: 3, icon: '🌀' },
  { id: 'ev', name: 'EV Car / Bike Charger (Level 2)', watts: 3300, defaultCount: 0, max: 1, icon: '⚡' },
];

/**
 * InteractiveLoadCalculator
 * Interactive Kerala home electrical power load, breaker size & wire gauge calculator.
 */
export default function InteractiveLoadCalculator({ onBookWithSetup }) {
  const [counts, setCounts] = useState({
    ac: 1,
    induction: 0,
    geyser: 1,
    fridge: 1,
    fans: 1,
    ev: 0,
  });

  const toggleCount = (id, delta) => {
    soundFx.playClick();
    setCounts((prev) => {
      const current = prev[id] || 0;
      const app = APPLIANCES.find((a) => a.id === id);
      const next = Math.max(0, Math.min(app ? app.max : 5, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const calculation = useMemo(() => {
    let totalWatts = 0;
    APPLIANCES.forEach((app) => {
      totalWatts += (counts[app.id] || 0) * app.watts;
    });

    const voltage = 230;
    const amperes = totalWatts > 0 ? (totalWatts / voltage).toFixed(1) : '0';
    const ampVal = parseFloat(amperes);

    let wireGauge = '2.5 sq.mm FRLS Copper';
    let breaker = '16A C-Curve MCB';
    let phase = 'Single Phase (230V)';
    let rccb = '25A 30mA 2-Pole RCCB';

    if (ampVal > 32) {
      wireGauge = '6.0 sq.mm Fire-Retardant Copper';
      breaker = '40A - 63A MCB';
      phase = '3-Phase (415V KSEB Recommended)';
      rccb = '63A 30mA 4-Pole RCCB';
    } else if (ampVal > 20) {
      wireGauge = '4.0 sq.mm Fire-Retardant Copper';
      breaker = '32A C-Curve MCB';
      phase = 'Single Phase (Heavy Feeder)';
      rccb = '40A 30mA 2-Pole RCCB';
    } else if (ampVal > 10) {
      wireGauge = '2.5 sq.mm Fire-Retardant Copper';
      breaker = '20A C-Curve MCB';
      phase = 'Single Phase (230V)';
      rccb = '25A 30mA 2-Pole RCCB';
    }

    return {
      totalWatts,
      kiloWatts: (totalWatts / 1000).toFixed(2),
      amperes,
      wireGauge,
      breaker,
      phase,
      rccb,
    };
  }, [counts]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeWrap}>
          <Calculator size={15} color="#F59E0B" />
          <Text style={styles.badgeText}>SMART LOAD CALCULATOR</Text>
        </View>
        <Text style={styles.specStandard}>IS 732:2019 Wiring Standard</Text>
      </View>

      <Text style={styles.title}>Home Electrical Load & Wire Gauge Estimator</Text>
      <Text style={styles.subtitle}>
        Select appliances running in your Kerala home. We calculate continuous amperage, required KSEB breaker rating, and copper wire gauge to prevent switchboard burnouts.
      </Text>

      {/* Appliance Grid */}
      <View style={styles.applianceGrid}>
        {APPLIANCES.map((app) => {
          const count = counts[app.id] || 0;
          return (
            <View key={app.id} style={[styles.applianceTile, count > 0 && styles.applianceTileActive]}>
              <View style={styles.tileInfo}>
                <Text style={styles.tileIcon}>{app.icon}</Text>
                <View>
                  <Text style={styles.tileName}>{app.name}</Text>
                  <Text style={styles.tileWatts}>{app.watts} Watts each</Text>
                </View>
              </View>

              <View style={styles.counterRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleCount(app.id, -1)}
                  style={[styles.counterBtn, count === 0 && styles.counterBtnDisabled]}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.countText}>{count}</Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleCount(app.id, 1)}
                  style={[styles.counterBtn, count >= app.max && styles.counterBtnDisabled]}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Real-time Engineering Readout */}
      <View style={styles.resultsBox}>
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.totalWattsText}>{calculation.kiloWatts} kW Total Peak Load</Text>
            <Text style={styles.ampsText}>{calculation.amperes} Amperes continuous at 230V</Text>
          </View>
          <View style={styles.phasePill}>
            <Gauge size={14} color="#38BDF8" />
            <Text style={styles.phaseText}>{calculation.phase}</Text>
          </View>
        </View>

        <View style={styles.specsDivider} />

        <View style={styles.specsGrid}>
          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Recommended Main Breaker</Text>
            <Text style={styles.specValue}>{calculation.breaker}</Text>
          </View>
          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Recommended Wire Conductor</Text>
            <Text style={styles.specValue}>{calculation.wireGauge}</Text>
          </View>
          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Mandatory Shock Guard</Text>
            <Text style={styles.specValue}>{calculation.rccb}</Text>
          </View>
          <View style={styles.specCell}>
            <Text style={styles.specLabel}>Inspection Cost</Text>
            <Text style={[styles.specValue, { color: '#10B981' }]}>₹49 on-site diagnostic</Text>
          </View>
        </View>

        {onBookWithSetup && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onBookWithSetup(calculation)}
            style={styles.bookLoadBtn}
          >
            <Zap size={16} color="#FFFFFF" />
            <Text style={styles.bookLoadBtnText}>Book Certified KSELB Inspection for this Setup</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#070C18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 24,
    marginVertical: 20,
    boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.8)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  specStandard: {
    fontSize: 11,
    color: '#64748B',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 18,
  },
  applianceGrid: {
    gap: 10,
    marginBottom: 18,
  },
  applianceTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  applianceTileActive: {
    borderColor: 'rgba(56, 189, 248, 0.5)',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  tileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tileIcon: {
    fontSize: 22,
  },
  tileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  tileWatts: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  counterBtnDisabled: {
    opacity: 0.3,
  },
  counterBtnText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  countText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38BDF8',
    minWidth: 20,
    textAlign: 'center',
  },
  resultsBox: {
    backgroundColor: '#0D1527',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 18,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  totalWattsText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  ampsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 3,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  phaseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  specsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  specsGrid: {
    gap: 10,
    marginBottom: 18,
  },
  specCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  bookLoadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
  },
  bookLoadBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
});
