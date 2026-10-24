import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  Zap, MapPin, ChevronDown, Sparkles, AlertTriangle, ShieldCheck,
  Building2, Volume2, VolumeX, Phone, User
} from 'lucide-react-native';
import { soundFx } from '../services/audioFx';
import { useAuth } from '../context/AuthContext';

/**
 * DesktopNavbar
 * Luxury floating glass navigation bar for desktop and tablet screens (>= 768px).
 * Transforms the platform into an Awwwards-caliber interactive engineering hub.
 */
export default function DesktopNavbar({ locationName, onLocationPress, onEmergencyPress, onCatalogScroll }) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(soundFx.isMuted);

  useEffect(() => {
    const unsub = soundFx.subscribe((muted) => setIsMuted(muted));
    return unsub;
  }, []);

  if (width < 768) return null;

  const toggleSound = () => {
    soundFx.toggleMute();
  };

  const navItems = [
    { label: 'Services', action: () => (onCatalogScroll ? onCatalogScroll() : router.push('/services')) },
    { label: 'AI Fault Triage', path: '/smart-triage', badge: 'AI', badgeColor: '#EF4444' },
    { label: 'Pricing Estimator', path: '/pricing-calculator' },
    { label: 'Commercial B2B', path: '/commercial-audit' },
  ];

  const handleNav = (item) => {
    soundFx.playClick();
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.glassContainer}>
        {/* Brand & Live Voltage Telemetry */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => { soundFx.playClick(); router.push('/'); }}
          style={styles.brandRow}
        >
          <View style={styles.brandLogoWrap}>
            <Zap size={20} color="#38BDF8" fill="#38BDF8" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.brandNameWhite}>Sheri</Text>
              <Text style={styles.brandNameCyan}>yakam</Text>
            </View>
            <Text style={styles.brandSubtitle}>ശരിയാക്കാം • Kerala</Text>
          </View>
          <View style={styles.voltagePill}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.voltageText}>230V • 50Hz</Text>
          </View>
        </TouchableOpacity>

        {/* Center Desktop Navigation Links */}
        <View style={styles.navLinksRow}>
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => handleNav(item)}
                style={[styles.navItem, isActive && styles.navItemActive]}
              >
                <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                  {item.label}
                </Text>
                {item.badge && (
                  <View style={[styles.badgeWrap, { backgroundColor: item.badgeColor + '22', borderColor: item.badgeColor + '66' }]}>
                    <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Action Controls */}
        <View style={styles.rightActionsRow}>
          {/* Sound FX Toggle */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleSound}
            style={styles.soundBtn}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? (
              <VolumeX size={16} color="#94A3B8" />
            ) : (
              <Volume2 size={16} color="#38BDF8" />
            )}
          </TouchableOpacity>

          {/* Location Dropdown */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => { soundFx.playClick(); onLocationPress && onLocationPress(); }}
            style={styles.locationPill}
          >
            <MapPin size={13} color="#38BDF8" />
            <Text style={styles.locationText} numberOfLines={1}>{locationName || 'Kerala'}</Text>
            <ChevronDown size={13} color="#94A3B8" />
          </TouchableOpacity>

          {/* Emergency Dispatch Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => { soundFx.playSpark(); onEmergencyPress && onEmergencyPress(); }}
            style={styles.emergencyBtn}
          >
            <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.emergencyBtnText}>90-Min Dispatch</Text>
          </TouchableOpacity>

          {/* User Account / Login */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => { soundFx.playClick(); router.push(user ? '/dashboard' : '/auth/login'); }}
            style={styles.accountBtn}
          >
            <User size={15} color="#E2E8F0" />
            <Text style={styles.accountText}>{user ? 'Account' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: 'rgba(5, 8, 17, 0.82)',
    backdropFilter: 'blur(20px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.12)',
  },
  glassContainer: {
    maxWidth: 1320,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandNameWhite: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandNameCyan: {
    fontSize: 20,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  voltagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 6,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  voltageText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6EE7B7',
    letterSpacing: 0.4,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  navItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    letterSpacing: -0.2,
  },
  navItemTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  badgeWrap: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  soundBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E2E8F0',
    maxWidth: 120,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  accountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  accountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F1F5F9',
  },
});
