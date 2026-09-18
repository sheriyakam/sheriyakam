import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from 'expo-router/head';
import { useRouter, usePathname } from 'expo-router';
import { CareerNav } from './CareerNav';
import { ShieldCheck, Lock, CheckCircle2, Home, FileText, Target, Linkedin, LayoutDashboard } from 'lucide-react-native';

interface CareerLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  activeSection?: string;
}

export function CareerLayout({
  children,
  title = 'AI Resume + ATS + LinkedIn Optimizer | Sheriyakam Career',
  description = 'Analyze your resume for ATS compatibility, calculate job-match scores, optimize LinkedIn profiles, and humanize resume bullets without inventing experience.',
  activeSection
}: CareerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname() || '/cv-linkedin-optimize';

  const bottomTabs = [
    { label: 'Home', path: '/cv-linkedin-optimize', icon: Home },
    { label: 'Analyzer', path: '/cv-linkedin-optimize/resume-analyzer', icon: FileText },
    { label: 'Tailor', path: '/cv-linkedin-optimize/resume-tailor', icon: Target },
    { label: 'LinkedIn', path: '/cv-linkedin-optimize/linkedin', icon: Linkedin },
    { label: 'Dashboard', path: '/cv-linkedin-optimize/dashboard', icon: LayoutDashboard },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="AI resume builder, ATS resume checker, ATS score optimizer, resume analyzer, job match, resume tailoring, LinkedIn optimizer, AI cover letter generator, resume humanizer" />
        <link rel="canonical" href="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#111111" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      {/* Top Isolated Navigation */}
      <CareerNav />

      {/* Main Content Area */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}

        {/* Global Privacy & Trust Footer */}
        <View style={styles.footerWrap}>
          <View style={styles.footerInner}>
            <View style={styles.footerTopRow}>
              <View style={styles.trustBadgeRow}>
                <ShieldCheck size={18} color="#059669" />
                <Text style={styles.trustPrincipleText}>
                  Principle: <Text style={styles.trustPrincipleHighlight}>Optimize facts. Never invent them.</Text>
                </Text>
              </View>
              <View style={styles.privacyNoteRow}>
                <Lock size={15} color="#666666" />
                <Text style={styles.privacyNoteText}>
                  Your resume and career data are private to your account.
                </Text>
              </View>
            </View>

            <View style={styles.footerDivider} />

            <View style={styles.footerBottomRow}>
              <Text style={styles.copyrightText}>
                © {new Date().getFullYear()} Sheriyakam Career Copilot. Professional AI Career Infrastructure.
              </Text>
              <View style={styles.footerLinksRow}>
                <TouchableOpacity onPress={() => router.push('/privacy' as any)}>
                  <Text style={styles.footerLinkText}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkSep}>•</Text>
                <TouchableOpacity onPress={() => router.push('/terms' as any)}>
                  <Text style={styles.footerLinkText}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkSep}>•</Text>
                <TouchableOpacity onPress={() => router.push('/cv-linkedin-optimize/dashboard/settings' as any)}>
                  <Text style={styles.footerLinkText}>Data Controls</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkSep}>•</Text>
                <TouchableOpacity onPress={() => router.push('/contact' as any)}>
                  <Text style={styles.footerLinkText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Mobile-Only Bottom Compact Navigation Bar */}
      <View style={styles.mobileBottomNav}>
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          return (
            <TouchableOpacity
              key={tab.path}
              style={styles.mobileTabItem}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.7}
            >
              <Icon size={18} color={isActive ? '#059669' : '#71717A'} />
              <Text style={[styles.mobileTabLabel, isActive && styles.mobileTabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 40 : 80,
  },
  footerWrap: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    marginTop: 60,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  footerTopRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 20,
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustPrincipleText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  trustPrincipleHighlight: {
    color: '#111111',
    fontWeight: '700',
  },
  privacyNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyNoteText: {
    fontSize: 12,
    color: '#666666',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  footerBottomRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  copyrightText: {
    fontSize: 12,
    color: '#888888',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerLinkText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  footerLinkSep: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  mobileBottomNav: {
    display: Platform.OS === 'web' ? ('none' as any) : 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mobileTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mobileTabLabel: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '500',
    marginTop: 2,
  },
  mobileTabLabelActive: {
    color: '#059669',
    fontWeight: '700',
  },
});
