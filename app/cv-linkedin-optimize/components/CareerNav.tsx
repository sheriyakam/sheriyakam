import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  FileText,
  Target,
  Linkedin,
  Mail,
  HelpCircle,
  LayoutDashboard,
  Zap,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Briefcase
} from 'lucide-react-native';
import { getCreditLedger } from '../../../services/careerService';

export function CareerNav() {
  const router = useRouter();
  const pathname = usePathname() || '/cv-linkedin-optimize';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ledger = getCreditLedger();

  const navLinks = [
    { label: 'Resume Analyzer', path: '/cv-linkedin-optimize/resume-analyzer', icon: FileText },
    { label: 'Job Tailor', path: '/cv-linkedin-optimize/resume-tailor', icon: Target },
    { label: 'Resume Builder', path: '/cv-linkedin-optimize/resume-builder', icon: Briefcase },
    { label: 'LinkedIn', path: '/cv-linkedin-optimize/linkedin', icon: Linkedin },
    { label: 'Cover Letter', path: '/cv-linkedin-optimize/cover-letter', icon: Mail },
    { label: 'Interview', path: '/cv-linkedin-optimize/interview', icon: HelpCircle },
  ];

  const navigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path as any);
  };

  const isCurrent = (p: string) => pathname === p || pathname.startsWith(p + '/');

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.container}>
        {/* Brand Logo */}
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => navigate('/cv-linkedin-optimize')}
          activeOpacity={0.8}
        >
          <View style={styles.logoIconWrap}>
            <Sparkles size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.logoTitle}>Sheriyakam <Text style={styles.logoSub}>Career</Text></Text>
            <Text style={styles.logoTagline}>AI Resume & ATS Optimizer</Text>
          </View>
        </TouchableOpacity>

        {/* Desktop Nav Links */}
        <View style={styles.desktopNav}>
          {navLinks.map((item) => {
            const active = isCurrent(item.path);
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => navigate(item.path)}
                style={[styles.navButton, active && styles.navButtonActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {/* Credit Pill */}
          <TouchableOpacity
            style={styles.creditPill}
            onPress={() => navigate('/cv-linkedin-optimize/dashboard/billing')}
            activeOpacity={0.7}
          >
            <Zap size={14} color="#059669" />
            <Text style={styles.creditPillText}>
              {ledger.freeCreditsRemaining}/3 Free
            </Text>
          </TouchableOpacity>

          {/* Dashboard Button */}
          <TouchableOpacity
            style={[styles.dashboardBtn, isCurrent('/cv-linkedin-optimize/dashboard') && styles.dashboardBtnActive]}
            onPress={() => navigate('/cv-linkedin-optimize/dashboard')}
            activeOpacity={0.8}
          >
            <LayoutDashboard size={15} color="#FFFFFF" />
            <Text style={styles.dashboardBtnText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Mobile Hamburger Toggle */}
          <TouchableOpacity
            style={styles.mobileMenuToggle}
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            activeOpacity={0.7}
          >
            {mobileMenuOpen ? <X size={22} color="#111111" /> : <Menu size={22} color="#111111" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <View style={styles.mobileDrawer}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <TouchableOpacity
                key={item.path}
                style={[styles.mobileNavItem, active && styles.mobileNavItemActive]}
                onPress={() => navigate(item.path)}
              >
                <Icon size={18} color={active ? '#059669' : '#555555'} />
                <Text style={[styles.mobileNavText, active && styles.mobileNavTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View style={styles.mobileDrawerDivider} />
          <TouchableOpacity
            style={styles.mobileDashboardRow}
            onPress={() => navigate('/cv-linkedin-optimize/dashboard')}
          >
            <LayoutDashboard size={18} color="#059669" />
            <Text style={styles.mobileDashboardText}>Open Career Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    position: 'relative',
    zIndex: 100,
  },
  container: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  logoSub: {
    color: '#059669',
    fontWeight: '600',
  },
  logoTagline: {
    fontSize: 10,
    color: '#777777',
    fontWeight: '500',
  },
  desktopNav: {
    display: Platform.OS === 'web' ? ('flex' as any) : 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#F4F4F5',
  },
  navButtonText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  navButtonTextActive: {
    color: '#111111',
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  creditPillText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dashboardBtnActive: {
    backgroundColor: '#059669',
  },
  dashboardBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mobileMenuToggle: {
    display: Platform.OS === 'web' ? ('none' as any) : 'flex',
    padding: 6,
  },
  mobileDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  mobileNavItemActive: {
    backgroundColor: '#F4F4F5',
  },
  mobileNavText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: '#111111',
    fontWeight: '600',
  },
  mobileDrawerDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 6,
  },
  mobileDashboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  mobileDashboardText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
});
