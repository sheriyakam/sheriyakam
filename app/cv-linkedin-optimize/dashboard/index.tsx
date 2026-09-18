import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getSavedResumes,
  getCreditLedger,
  SavedResume,
  CreditLedgerStatus
} from '../../../services/careerService';
import {
  LayoutDashboard,
  FileText,
  Target,
  Linkedin,
  Mail,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  FolderOpen,
  Plus,
  Sliders,
  CreditCard,
  Settings
} from 'lucide-react-native';

export default function CareerDashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [ledger, setLedger] = useState<CreditLedgerStatus>(getCreditLedger());

  useEffect(() => {
    setResumes(getSavedResumes());
    setLedger(getCreditLedger());
  }, []);

  const latestResume = resumes[0];

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard', active: true },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs' },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin' },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters' },
    { label: 'Billing & Credits', path: '/cv-linkedin-optimize/dashboard/billing' },
    { label: 'Settings', path: '/cv-linkedin-optimize/dashboard/settings' },
  ];

  return (
    <CareerLayout
      title="Career Workspace Dashboard | Sheriyakam Career"
      description="Manage your tailored resumes, past ATS reports, saved job descriptions, and credit balance."
    >
      <View style={styles.container}>
        {/* Subroute Tabs */}
        <View style={styles.subtabsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subtabsRow}>
            {subroutes.map(r => (
              <TouchableOpacity
                key={r.path}
                style={[styles.subtabBtn, r.active && styles.subtabBtnActive]}
                onPress={() => router.push(r.path as any)}
              >
                <Text style={[styles.subtabText, r.active && styles.subtabTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View>
            <Text style={styles.welcomeGreeting}>Welcome to your Career Workspace</Text>
            <Text style={styles.welcomeSub}>
              All your tailored resumes, ATS scores, and target applications in one place.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnNewResume}
            onPress={() => router.push('/cv-linkedin-optimize/resume-analyzer' as any)}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.btnNewResumeText}>New ATS Analysis</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Metric Cards Grid */}
        <View style={styles.metricsGrid}>
          {/* ATS Score */}
          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Latest ATS Score</Text>
              <CheckCircle2 size={16} color="#059669" />
            </View>
            <Text style={styles.metricVal}>{latestResume ? `${latestResume.atsScore}/100` : '88/100'}</Text>
            <Text style={styles.metricSub}>+18 pts improvement</Text>
          </View>

          {/* Job Match */}
          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Latest Job Match</Text>
              <Target size={16} color="#2563EB" />
            </View>
            <Text style={styles.metricVal}>84%</Text>
            <Text style={styles.metricSub}>12 matched • 3 gaps</Text>
          </View>

          {/* LinkedIn Score */}
          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>LinkedIn Optimization</Text>
              <Linkedin size={16} color="#0A66C2" />
            </View>
            <Text style={styles.metricVal}>92%</Text>
            <Text style={styles.metricSub}>Ready for search queries</Text>
          </View>

          {/* Credits Remaining */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/cv-linkedin-optimize/dashboard/billing' as any)}
          >
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Free Credits Remaining</Text>
              <Zap size={16} color="#D97706" />
            </View>
            <Text style={styles.metricVal}>{ledger.freeCreditsRemaining}/3</Text>
            <Text style={styles.metricSub}>5h rolling unlock window</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Launch Action Shortcuts */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Quick Career Actions</Text>
          <View style={styles.shortcutsGrid}>
            {[
              {
                title: 'Audit ATS Compatibility',
                desc: 'Upload resume and get deterministic scoring.',
                icon: FileText,
                path: '/cv-linkedin-optimize/resume-analyzer',
                color: '#059669'
              },
              {
                title: 'Tailor Resume for Job',
                desc: 'Factual bullet rewriting with anti-fabrication.',
                icon: Target,
                path: '/cv-linkedin-optimize/resume-tailor',
                color: '#2563EB'
              },
              {
                title: 'Optimize LinkedIn Profile',
                desc: 'Headline under 220 chars & 3-sentence About hook.',
                icon: Linkedin,
                path: '/cv-linkedin-optimize/linkedin',
                color: '#0A66C2'
              },
              {
                title: 'Create Cover Letter',
                desc: 'Company-specific targeted narrative.',
                icon: Mail,
                path: '/cv-linkedin-optimize/cover-letter',
                color: '#7C3AED'
              },
              {
                title: 'Practice Interview Questions',
                desc: 'STAR behavioral & technical questions.',
                icon: HelpCircle,
                path: '/cv-linkedin-optimize/interview',
                color: '#EA580C'
              },
              {
                title: 'Open Resume Builder',
                desc: 'Edit sections and export vector PDF/DOCX.',
                icon: Sparkles,
                path: '/cv-linkedin-optimize/resume-builder',
                color: '#111111'
              },
            ].map(act => {
              const Icon = act.icon;
              return (
                <TouchableOpacity
                  key={act.title}
                  style={styles.shortcutCard}
                  onPress={() => router.push(act.path as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.shortcutIconWrap, { backgroundColor: act.color + '15' }]}>
                    <Icon size={18} color={act.color} />
                  </View>
                  <Text style={styles.shortcutTitle}>{act.title}</Text>
                  <Text style={styles.shortcutDesc}>{act.desc}</Text>
                  <View style={styles.shortcutLinkRow}>
                    <Text style={[styles.shortcutLinkText, { color: act.color }]}>Launch</Text>
                    <ArrowRight size={13} color={act.color} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Workspace Resumes */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderBetween}>
            <Text style={styles.sectionTitle}>Saved Resumes ({resumes.length})</Text>
            <TouchableOpacity onPress={() => router.push('/cv-linkedin-optimize/dashboard/resumes' as any)}>
              <Text style={styles.seeAllText}>View All Resumes →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resumesList}>
            {resumes.map(res => (
              <View key={res.id} style={styles.resumeRow}>
                <View style={styles.resumeInfoLeft}>
                  <FileText size={20} color="#111111" />
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.resumeRowTitle}>{res.title}</Text>
                      {res.isMaster && (
                        <View style={styles.masterBadge}>
                          <Text style={styles.masterBadgeText}>Master</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.resumeRowMeta}>
                      Modified {res.lastModified} • Target: {res.targetRole || 'General'}
                    </Text>
                  </View>
                </View>

                <View style={styles.resumeActionsRight}>
                  <View style={styles.atsPill}>
                    <Text style={styles.atsPillText}>{res.atsScore} ATS</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnOpenResume}
                    onPress={() => router.push('/cv-linkedin-optimize/resume-builder' as any)}
                  >
                    <Text style={styles.btnOpenResumeText}>Open</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  subtabsWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  subtabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  subtabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subtabBtnActive: {
    backgroundColor: '#111111',
  },
  subtabText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  subtabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  welcomeBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 16,
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#6B7280',
  },
  btnNewResume: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnNewResumeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metricCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 220 : '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  metricVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
  sectionWrap: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  shortcutCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 300 : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    gap: 6,
  },
  shortcutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  shortcutDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 8,
  },
  shortcutLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shortcutLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resumesList: {
    gap: 10,
  },
  resumeRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
  },
  resumeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resumeRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  masterBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  masterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  resumeRowMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  resumeActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  atsPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  atsPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  btnOpenResume: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  btnOpenResumeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
