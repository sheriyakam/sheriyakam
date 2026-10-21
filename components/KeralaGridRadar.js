import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MapPin, Clock, Users, ShieldCheck, Zap, Radio, ChevronRight } from 'lucide-react-native';
import { soundFx } from '../services/audioFx';

const DISTRICT_DATA = [
  { id: 'kannur', name: 'Kannur', mlName: 'കണ്ണൂർ', wiremen: 16, avgTime: '24 min', zone: 'North Kerala', status: 'High Availability', alert: 'Coastal humidity earthing checks active' },
  { id: 'kozhikode', name: 'Kozhikode', mlName: 'കോഴിക്കോട്', wiremen: 22, avgTime: '21 min', zone: 'Malabar Central', status: 'Immediate Dispatch', alert: 'Urban commercial & domestic units standby' },
  { id: 'ernakulam', name: 'Ernakulam / Kochi', mlName: 'എറണാകുളം', wiremen: 34, avgTime: '18 min', zone: 'Central Hub', status: 'Immediate Dispatch', alert: 'High-rise DB & 3-phase industrial ready' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', mlName: 'തിരുവനന്തപുരം', wiremen: 26, avgTime: '22 min', zone: 'Capital Zone', status: 'High Availability', alert: 'Government & residential solar certified' },
  { id: 'thrissur', name: 'Thrissur', mlName: 'തൃശ്ശൂർ', wiremen: 19, avgTime: '25 min', zone: 'Cultural Capital', status: 'Immediate Dispatch', alert: 'Heavy motor & inverter wiring teams live' },
  { id: 'malappuram', name: 'Malappuram', mlName: 'മലപ്പുറം', wiremen: 20, avgTime: '27 min', zone: 'Malabar South', status: 'High Availability', alert: 'Full house rewiring teams dispatched' },
  { id: 'kollam', name: 'Kollam', mlName: 'കൊല്ലം', wiremen: 15, avgTime: '28 min', zone: 'South Coast', status: 'Immediate Dispatch', alert: 'Port & residential surge protection active' },
  { id: 'kottayam', name: 'Kottayam', mlName: 'കോട്ടയം', wiremen: 14, avgTime: '26 min', zone: 'Central Highlands', status: 'High Availability', alert: 'Rubber belt lightning surge triage on' },
  { id: 'palakkad', name: 'Palakkad', mlName: 'പാലക്കാട്', wiremen: 17, avgTime: '29 min', zone: 'Eastern Gap', status: 'High Availability', alert: 'Agri-pump & home DB wiring standby' },
  { id: 'alappuzha', name: 'Alappuzha', mlName: 'ആലപ്പുഴ', wiremen: 13, avgTime: '26 min', zone: 'Backwater Belt', status: 'High Availability', alert: 'Moisture ingress & RCCB safety priority' },
  { id: 'kasaragod', name: 'Kasaragod', mlName: 'കാസർഗോഡ്', wiremen: 12, avgTime: '31 min', zone: 'North Border', status: 'Normal', alert: 'High-power home & pump service online' },
  { id: 'pathanamthitta', name: 'Pathanamthitta', mlName: 'പത്തനംതിട്ട', wiremen: 11, avgTime: '30 min', zone: 'Central South', status: 'Normal', alert: 'Hill range inverter backup support' },
  { id: 'idukki', name: 'Idukki', mlName: 'ഇടുക്കി', wiremen: 9, avgTime: '38 min', zone: 'High Ranges', status: 'Normal', alert: 'Cold mist insulation & generator support' },
  { id: 'wayanad', name: 'Wayanad', mlName: 'വയനാട്', wiremen: 10, avgTime: '34 min', zone: 'High Ranges', status: 'Normal', alert: 'Plantation home backup & earthing live' },
];

/**
 * KeralaGridRadar
 * Real-time Kerala 14-District Electrical Availability Radar.
 * Interactive district selection, telemetry display, and direct localized dispatch.
 */
export default function KeralaGridRadar({ onSelectDistrict }) {
  const [activeDistrict, setActiveDistrict] = useState(DISTRICT_DATA[2]); // Ernakulam default

  const handleDistrictChange = (district) => {
    setActiveDistrict(district);
    soundFx.playRadarPing();
    if (onSelectDistrict) {
      onSelectDistrict(district);
    }
  };

  return (
    <View style={styles.container}>
      {/* Radar Section Title */}
      <View style={styles.titleRow}>
        <View style={styles.radarLiveBadge}>
          <Radio size={14} color="#10B981" />
          <Text style={styles.liveText}>LIVE DISPATCH RADAR</Text>
        </View>
        <Text style={styles.allDistrictCount}>14 Kerala Districts Synced</Text>
      </View>

      <Text style={styles.sectionHeading}>
        Kerala’s 14-District Live Technician Grid
      </Text>
      <Text style={styles.sectionSub}>
        Tap any district to inspect active licensed KSELB wiremen on duty, average arrival time, and weather-related electrical advisories.
      </Text>

      {/* District Horizontal Pill Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillScroll}
      >
        {DISTRICT_DATA.map((item) => {
          const isSelected = activeDistrict.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleDistrictChange(item)}
              style={[styles.districtPill, isSelected && styles.districtPillActive]}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {item.name}
              </Text>
              <Text style={[styles.pillMalayalam, isSelected && styles.pillMalayalamActive]}>
                {item.mlName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected District Telemetry Card */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryHeader}>
          <View>
            <View style={styles.telemetryNameRow}>
              <MapPin size={20} color="#F59E0B" />
              <Text style={styles.districtHeading}>{activeDistrict.name}</Text>
              <Text style={styles.districtMalayalamHeading}>({activeDistrict.mlName})</Text>
            </View>
            <Text style={styles.zoneTag}>{activeDistrict.zone} • {activeDistrict.status}</Text>
          </View>

          <View style={styles.timeBadge}>
            <Clock size={16} color="#38BDF8" />
            <Text style={styles.timeValue}>{activeDistrict.avgTime}</Text>
            <Text style={styles.timeLabel}>Avg Arrival</Text>
          </View>
        </View>

        {/* Telemetry Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricIconWrap}>
              <Users size={16} color="#10B981" />
            </View>
            <View>
              <Text style={styles.metricNumber}>{activeDistrict.wiremen} Wiremen</Text>
              <Text style={styles.metricLabel}>KSELB Class-A Ready</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIconWrap}>
              <ShieldCheck size={16} color="#38BDF8" />
            </View>
            <View>
              <Text style={styles.metricNumber}>100% Insured</Text>
              <Text style={styles.metricLabel}>₹10,000 Safety Shield</Text>
            </View>
          </View>
        </View>

        {/* Advisory Box */}
        <View style={styles.advisoryBox}>
          <Zap size={15} color="#F59E0B" />
          <Text style={styles.advisoryText}>
            Local Weather Note: {activeDistrict.alert}
          </Text>
        </View>

        {/* Local Dispatch CTA */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onSelectDistrict && onSelectDistrict(activeDistrict)}
          style={styles.dispatchButton}
        >
          <Text style={styles.dispatchButtonText}>
            Dispatch Technician to {activeDistrict.name} Now
          </Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radarLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1,
  },
  allDistrictCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  pillScroll: {
    paddingVertical: 6,
    gap: 8,
  },
  districtPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    alignItems: 'center',
    minWidth: 110,
  },
  districtPillActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
    boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pillTextActive: {
    color: '#F59E0B',
  },
  pillMalayalam: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  pillMalayalamActive: {
    color: '#FDE68A',
  },
  telemetryCard: {
    backgroundColor: '#0B1120',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 20,
    marginTop: 16,
    boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.8)',
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  telemetryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  districtHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  districtMalayalamHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  zoneTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  timeBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
    marginTop: 2,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  advisoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 16,
  },
  advisoryText: {
    flex: 1,
    fontSize: 12,
    color: '#FDE68A',
    lineHeight: 16,
  },
  dispatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
  },
  dispatchButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
