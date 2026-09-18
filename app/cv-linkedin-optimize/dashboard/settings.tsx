import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  clearAllCareerData,
  getSavedResumes,
  getSavedJobs,
  getSavedCoverLetters,
  getSavedLinkedInDrafts
} from '../../../services/careerService';
import {
  Settings,
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  User,
  Briefcase,
  MapPin,
  Lock,
  FileCheck
} from 'lucide-react-native';

export default function CareerDashboardSettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Alex Vance');
  const [targetTitle, setTargetTitle] = useState('Senior Operations Lead');
  const [primaryIndustry, setPrimaryIndustry] = useState('Logistics & Technology');
  const [targetLocation, setTargetLocation] = useState('San Francisco, CA (Hybrid / Remote)');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sheriyakam_career_user_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.userName) setUserName(parsed.userName);
          if (parsed.targetTitle) setTargetTitle(parsed.targetTitle);
          if (parsed.primaryIndustry) setPrimaryIndustry(parsed.primaryIndustry);
          if (parsed.targetLocation) setTargetLocation(parsed.targetLocation);
        } catch (e) {}
      }
    }
  }, []);

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard' },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs' },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin' },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters' },
    { label: 'Billing & Credits', path: '/cv-linkedin-optimize/dashboard/billing' },
    { label: 'Settings', path: '/cv-linkedin-optimize/dashboard/settings', active: true },
  ];

  const handleSaveProfile = () => {
    if (typeof window !== 'undefined') {
      const data = { userName, targetTitle, primaryIndustry, targetLocation };
      localStorage.setItem('sheriyakam_career_user_profile', JSON.stringify(data));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const payload = {
      profile: { userName, targetTitle, primaryIndustry, targetLocation },
      resumes: getSavedResumes(),
      jobs: getSavedJobs(),
      coverLetters: getSavedCoverLetters(),
      linkedInDrafts: getSavedLinkedInDrafts(),
      exportDate: new Date().toISOString()
    };

    if (Platform.OS === 'web') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `career-workspace-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert('Export', 'Workspace data ready for export.');
    }
  };

  const handleClearData = () => {
    const proceed = Platform.OS === 'web'
      ? window.confirm('Are you absolutely sure? This will delete all saved resumes, job postings, cover letters, and history from your browser.')
      : true;

    if (proceed) {
      clearAllCareerData();
      setClearedSuccess(true);
      setTimeout(() => {
        setClearedSuccess(false);
        router.push('/cv-linkedin-optimize/dashboard' as any);
      }, 1500);
    }
  };

  return (
    <CareerLayout
      title="Workspace Settings & Privacy | Sheriyakam Career"
      description="Manage profile defaults, review strict privacy guarantees, and control your stored data."
    >
      <View style={styles.container}>
        {/* Subtabs Navigation */}
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

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Workspace Settings & Privacy</Text>
            <Text style={styles.pageSub}>
              Manage your default career profile, data storage preferences, and zero-training commitments.
            </Text>
          </View>
        </View>

        {/* Profile Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Career Profile Defaults</Text>
          <Text style={styles.cardSub}>
            These preferences pre-populate tailoring models and cover letter drafts.
          </Text>

          <View style={styles.formGrid}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="e.g. Alex Vance"
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.label}>Target Job Title</Text>
              <TextInput
                style={styles.input}
                value={targetTitle}
                onChangeText={setTargetTitle}
                placeholder="e.g. Senior Operations Lead"
              />
            </View>
          </View>

          <View style={styles.formGrid}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Primary Industry</Text>
              <TextInput
                style={styles.input}
                value={primaryIndustry}
                onChangeText={setPrimaryIndustry}
                placeholder="e.g. Logistics & Technology"
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.label}>Target Location & Work Mode</Text>
              <TextInput
                style={styles.input}
                value={targetLocation}
                onChangeText={setTargetLocation}
                placeholder="e.g. San Francisco, CA (Hybrid)"
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnSave}
              onPress={handleSaveProfile}
            >
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text style={styles.btnSaveText}>
                {savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Anti-Fabrication Guarantees */}
        <View style={styles.card}>
          <View style={styles.privacyHeader}>
            <ShieldCheck size={20} color="#059669" />
            <Text style={styles.cardTitle}>Data Privacy & Anti-Fabrication Principles</Text>
          </View>

          <View style={styles.guaranteeList}>
            <View style={styles.guaranteeItem}>
              <Lock size={16} color="#111111" />
              <View style={styles.guaranteeTextWrap}>
                <Text style={styles.guaranteeHead}>Zero Model Training</Text>
                <Text style={styles.guaranteeDesc}>
                  Your uploaded resumes, target job descriptions, and profile data are never used to train public LLM models or shared with third parties.
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeItem}>
              <FileCheck size={16} color="#111111" />
              <View style={styles.guaranteeTextWrap}>
                <Text style={styles.guaranteeHead}>Factual Accuracy Guardrail</Text>
                <Text style={styles.guaranteeDesc}>
                  Our tailoring engine rewrites and aligns experiences you actually hold. It will never invent companies, fabricated metrics, or unearned degrees.
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeItem}>
              <User size={16} color="#111111" />
              <View style={styles.guaranteeTextWrap}>
                <Text style={styles.guaranteeHead}>Local-First Architecture</Text>
                <Text style={styles.guaranteeDesc}>
                  All drafts and history are stored within your browser's private storage sandbox. You have complete autonomy to export or erase it at any time.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Ownership & Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Ownership & Controls</Text>
          <Text style={styles.cardSub}>
            Take your data with you or perform an irreversible clean sweep of your workspace.
          </Text>

          <View style={styles.dangerZoneRow}>
            <TouchableOpacity
              style={styles.btnExport}
              onPress={handleExportData}
            >
              <Download size={15} color="#111111" />
              <Text style={styles.btnExportText}>Export Workspace Data (JSON)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnClear}
              onPress={handleClearData}
            >
              <Trash2 size={15} color="#DC2626" />
              <Text style={styles.btnClearText}>
                {clearedSuccess ? 'Cleared All Data' : 'Clear All Career Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  subtabsWrap: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subtabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  subtabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  subtabBtnActive: {
    backgroundColor: '#111111',
  },
  subtabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  subtabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerRow: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  cardSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 18,
  },
  formGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  inputCol: {
    flex: 1,
    minWidth: 260,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#111111',
    backgroundColor: '#FAFAFA',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  btnSave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  guaranteeList: {
    gap: 16,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  guaranteeTextWrap: {
    flex: 1,
  },
  guaranteeHead: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  guaranteeDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  dangerZoneRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  btnExport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnExportText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  btnClear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnClearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
});
