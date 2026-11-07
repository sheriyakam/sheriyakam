import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Award, Wrench, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * PractitionerVerificationBadge.js
 * E-E-A-T Practitioner Verification & Credential Trust Anchor.
 * Displays verifiable trade credentials, licensing authority (KSELB),
 * testing standards (CEA 2023), and workmanship warranty.
 */
export default function PractitionerVerificationBadge({ style = {} }) {
  const { theme, colors } = useTheme() || { theme: 'dark', colors: {} };
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, style]}>
      {/* Header Badge */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <ShieldCheck size={20} color="#10B981" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.title, { color: colors.textPrimary || '#FFFFFF' }]}>
              KSELB Practitioner Verified Protocol
            </Text>
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedPillText}>Govt Certified</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary || '#94A3B8' }]}>
            Kerala State Electricity Licensing Board • Department of Electrical Inspectorate
          </Text>
        </View>
      </View>

      {/* 4 Concrete Technical Pillars */}
      <View style={styles.pillarsGrid}>
        <View style={styles.pillarItem}>
          <Award size={14} color="#F59E0B" />
          <Text style={[styles.pillarLabel, { color: colors.textPrimary || '#FFFFFF' }]}>
            Class-B Wiremen
          </Text>
          <Text style={[styles.pillarDesc, { color: colors.textSecondary || '#94A3B8' }]}>
            100% trade-tested licensed technicians
          </Text>
        </View>

        <View style={styles.pillarItem}>
          <Wrench size={14} color="#3B82F6" />
          <Text style={[styles.pillarLabel, { color: colors.textPrimary || '#FFFFFF' }]}>
            True-RMS Diagnostic
          </Text>
          <Text style={[styles.pillarDesc, { color: colors.textSecondary || '#94A3B8' }]}>
            Digital multimeter & megger earth loop test
          </Text>
        </View>

        <View style={styles.pillarItem}>
          <CheckCircle size={14} color="#10B981" />
          <Text style={[styles.pillarLabel, { color: colors.textPrimary || '#FFFFFF' }]}>
            CEA 2023 Safety
          </Text>
          <Text style={[styles.pillarDesc, { color: colors.textSecondary || '#94A3B8' }]}>
            Central Electricity Authority compliant
          </Text>
        </View>

        <View style={styles.pillarItem}>
          <CheckCircle size={14} color="#8B5CF6" />
          <Text style={[styles.pillarLabel, { color: colors.textPrimary || '#FFFFFF' }]}>
            30-Day Workmanship
          </Text>
          <Text style={[styles.pillarDesc, { color: colors.textSecondary || '#94A3B8' }]}>
            ₹0 revisit warranty on exact point repaired
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
  },
  containerDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: 'rgba(30, 41, 59, 0.9)',
  },
  containerLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  verifiedPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedPillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 12,
  },
  pillarItem: {
    flex: 1,
    minWidth: 140,
    gap: 2,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  pillarDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
