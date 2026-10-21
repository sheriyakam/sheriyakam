import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ShieldAlert, Zap, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react-native';
import { soundFx } from '../services/audioFx';

/**
 * InteractiveBreaker
 * Awwwards-grade interactive 3D DIN-rail MCB / RCCB simulator.
 * Allows users to toggle, test tripping mechanics, hear micro-sound effects, and trigger 90-min emergency dispatch.
 */
export default function InteractiveBreaker({ onEmergencyClick }) {
  const [isTripped, setIsTripped] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    const nextState = !isTripped;
    setIsTripped(nextState);

    if (nextState) {
      soundFx.playSpark();
    } else {
      soundFx.playSwitch();
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={[styles.statusDot, isTripped ? styles.dotRed : styles.dotGreen]} />
          <Text style={styles.headerTitle}>
            {isTripped ? 'CIRCUIT FAULT SIMULATOR' : 'KSELB 30mA SAFETY BREAKER'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleMuteToggle}
          style={styles.soundButton}
          accessibilityLabel="Toggle Sound Effects"
        >
          {isMuted ? (
            <VolumeX size={16} color="#94A3B8" />
          ) : (
            <Volume2 size={16} color="#38BDF8" />
          )}
          <Text style={[styles.soundText, !isMuted && styles.soundTextActive]}>
            {isMuted ? 'Muted' : 'Sound FX'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtext}>
        Interactive DIN-Rail Module: Test how Kerala's humidity & lightning trips MCBs, and see how our 90-min dispatch team rescues your home.
      </Text>

      {/* 3D Breaker Body */}
      <View style={styles.breakerShell}>
        <View style={styles.dinRailNotchTop} />

        <View style={styles.breakerFace}>
          {/* Technical Specs Branding */}
          <View style={styles.specsColumn}>
            <Text style={styles.brandName}>SHERIYAKAM</Text>
            <Text style={styles.modelCode}>RCBO-32A / 30mA</Text>
            <Text style={styles.standardText}>IS/IEC 61009-1 • 240V ~</Text>
            <View style={styles.specsRow}>
              <Text style={styles.specPill}>10kA Icn</Text>
              <Text style={styles.specPill}>C-Curve</Text>
              <Text style={styles.specPill}>30ms Trip</Text>
            </View>
          </View>

          {/* Physical Toggle Lever */}
          <View style={styles.leverContainer}>
            <Text style={[styles.leverLabel, !isTripped && styles.leverLabelActive]}>I • ON</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleToggle}
              style={[
                styles.leverTrack,
                isTripped ? styles.leverTrackTripped : styles.leverTrackOn
              ]}
            >
              <View
                style={[
                  styles.leverKnob,
                  isTripped ? styles.knobTripped : styles.knobOn
                ]}
              >
                <View style={styles.knobGripLine} />
                <View style={styles.knobGripLine} />
                <View style={styles.knobGripLine} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.leverLabel, isTripped && styles.leverLabelTripped]}>O • OFF</Text>
          </View>
        </View>

        <View style={styles.dinRailNotchBottom} />
      </View>

      {/* Dynamic Status Readout */}
      {isTripped ? (
        <View style={styles.trippedAlertBox}>
          <View style={styles.alertHeaderRow}>
            <ShieldAlert size={20} color="#EF4444" />
            <Text style={styles.alertTitle}>TRIP TRIGGERED: Earth Leakage or Short Circuit</Text>
          </View>
          <Text style={styles.alertDesc}>
            In real life, never repeatedly force a tripped breaker ON. It indicates loose terminals, burnt insulation, or moisture ingress. Our certified KSELB wireman diagnoses faults with megger insulation testing.
          </Text>

          {onEmergencyClick && (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onEmergencyClick}
              style={styles.emergencyCta}
            >
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.emergencyCtaText}>Dispatch Emergency Technician (90 Mins)</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.normalStatusBox}>
          <View style={styles.normalHeaderRow}>
            <Sparkles size={18} color="#10B981" />
            <Text style={styles.normalTitle}>230.4 V • 50.0 Hz • Grid Stable</Text>
          </View>
          <Text style={styles.normalDesc}>
            Kerala monsoon lightning protection active. Click the toggle lever above to test fault triage simulation.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A0F1D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    padding: 24,
    marginVertical: 18,
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
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
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotGreen: {
    backgroundColor: '#10B981',
    boxShadow: '0 0 10px #10B981',
  },
  dotRed: {
    backgroundColor: '#EF4444',
    boxShadow: '0 0 10px #EF4444',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  soundText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  soundTextActive: {
    color: '#38BDF8',
  },
  subtext: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 20,
  },
  breakerShell: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 16,
    alignItems: 'center',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
  },
  dinRailNotchTop: {
    width: 60,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginBottom: 12,
  },
  dinRailNotchBottom: {
    width: 60,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginTop: 12,
  },
  breakerFace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
  },
  specsColumn: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1.5,
  },
  modelCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 2,
  },
  standardText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  specPill: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  leverContainer: {
    alignItems: 'center',
    marginLeft: 20,
  },
  leverLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginVertical: 4,
  },
  leverLabelActive: {
    color: '#10B981',
  },
  leverLabelTripped: {
    color: '#EF4444',
  },
  leverTrack: {
    width: 44,
    height: 84,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#334155',
    padding: 3,
    justifyContent: 'space-between',
  },
  leverTrackOn: {
    borderColor: '#10B981',
  },
  leverTrackTripped: {
    borderColor: '#EF4444',
  },
  leverKnob: {
    width: 34,
    height: 36,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
  },
  knobOn: {
    backgroundColor: '#10B981',
    marginTop: 0,
  },
  knobTripped: {
    backgroundColor: '#EF4444',
    marginTop: 38,
  },
  knobGripLine: {
    width: 18,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 1,
  },
  trippedAlertBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 16,
    marginTop: 18,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FCA5A5',
  },
  alertDesc: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: 12,
  },
  emergencyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
  },
  emergencyCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  normalStatusBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 14,
    marginTop: 18,
  },
  normalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  normalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6EE7B7',
  },
  normalDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
});
