import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getSavedResumes,
  saveResume,
  deleteResume,
  SavedResume
} from '../../../services/careerService';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Edit2
} from 'lucide-react-native';

export default function SavedResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    setResumes(getSavedResumes());
  }, []);

  const handleDuplicate = (resume: SavedResume) => {
    const copy: SavedResume = {
      ...resume,
      id: 'res_' + Date.now(),
      title: `${resume.title} (Tailored Version)`,
      isMaster: false,
      lastModified: new Date().toLocaleDateString()
    };
    saveResume(copy);
    setResumes(getSavedResumes());
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    setResumes(getSavedResumes());
  };

  const resumeA = resumes.find(r => r.id === compareA);
  const resumeB = resumes.find(r => r.id === compareB);

  return (
    <CareerLayout
      title="Saved Resumes & Version Management | Sheriyakam Career"
      description="Manage your master resume and job-specific tailored versions with side-by-side comparison."
    >
      <View style={styles.container}>
        {/* Navigation Breadcrumb */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.push('/cv-linkedin-optimize/dashboard' as any)}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Resume Versions ({resumes.length})</Text>
            <Text style={styles.subtitle}>
              Keep a clean Master Resume and duplicate job-tailored versions for specific company applications.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnNew}
            onPress={() => router.push('/cv-linkedin-optimize/resume-builder' as any)}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.btnNewText}>Create New Version</Text>
          </TouchableOpacity>
        </View>

        {/* Resumes Grid */}
        <View style={styles.grid}>
          {resumes.map((res) => (
            <View key={res.id} style={styles.resumeCard}>
              <View style={styles.cardTop}>
                <View style={styles.cardHeaderLeft}>
                  <FileText size={20} color="#111111" />
                  <View>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{res.title}</Text>
                      {res.isMaster && (
                        <View style={styles.masterPill}>
                          <Text style={styles.masterPillText}>Master</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardMeta}>
                      Target: {res.targetRole || 'General'} • Modified {res.lastModified}
                    </Text>
                  </View>
                </View>

                <View style={styles.atsScorePill}>
                  <Text style={styles.atsScoreVal}>{res.atsScore}</Text>
                  <Text style={styles.atsScoreLabel}>ATS</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Actions Row */}
              <View style={styles.cardActions}>
                <View style={styles.actionsLeft}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleDuplicate(res)}
                    title="Duplicate"
                  >
                    <Copy size={14} color="#4B5563" />
                    <Text style={styles.iconBtnText}>Duplicate</Text>
                  </TouchableOpacity>

                  {!res.isMaster && (
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={() => handleDelete(res.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} color="#DC2626" />
                      <Text style={[styles.iconBtnText, { color: '#DC2626' }]}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.btnOpen}
                  onPress={() => router.push('/cv-linkedin-optimize/resume-builder' as any)}
                >
                  <Text style={styles.btnOpenText}>Open & Edit</Text>
                  <ArrowRight size={13} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Version Compare Tool */}
        <View style={styles.compareSection}>
          <Text style={styles.compareTitle}>Compare Two Versions Side-by-Side</Text>
          <Text style={styles.compareSub}>Audit ATS differences between your general master and tailored versions.</Text>

          <View style={styles.compareSelectRow}>
            <View style={styles.compareSelectCol}>
              <Text style={styles.selectLabel}>Version A:</Text>
              <View style={styles.chipsWrap}>
                {resumes.map(r => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.compareChip, compareA === r.id && styles.compareChipActive]}
                    onPress={() => setCompareA(r.id)}
                  >
                    <Text style={[styles.compareChipText, compareA === r.id && styles.compareChipTextActive]}>
                      {r.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.compareSelectCol}>
              <Text style={styles.selectLabel}>Version B:</Text>
              <View style={styles.chipsWrap}>
                {resumes.map(r => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.compareChip, compareB === r.id && styles.compareChipActive]}
                    onPress={() => setCompareB(r.id)}
                  >
                    <Text style={[styles.compareChipText, compareB === r.id && styles.compareChipTextActive]}>
                      {r.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {resumeA && resumeB && (
            <View style={styles.comparisonResultsBox}>
              <View style={styles.compareColBox}>
                <Text style={styles.compareColTitle}>{resumeA.title}</Text>
                <Text style={styles.compareAtsScore}>ATS Score: {resumeA.atsScore}/100</Text>
                <Text style={styles.compareContentSnippet}>{resumeA.content?.summary || 'No summary'}</Text>
              </View>

              <View style={styles.compareColBox}>
                <Text style={styles.compareColTitle}>{resumeB.title}</Text>
                <Text style={styles.compareAtsScore}>ATS Score: {resumeB.atsScore}/100</Text>
                <Text style={styles.compareContentSnippet}>{resumeB.content?.summary || 'No summary'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1040,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 20,
  },
  backRow: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    maxWidth: 600,
  },
  btnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnNewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    gap: 14,
  },
  resumeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  masterPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  masterPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  cardMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  atsScorePill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  atsScoreVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#166534',
  },
  atsScoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  iconBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  btnOpen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnOpenText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  compareSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 22,
    marginTop: 10,
    gap: 12,
  },
  compareTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  compareSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  compareSelectRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginVertical: 8,
  },
  compareSelectCol: {
    flex: 1,
    gap: 6,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  compareChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compareChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  compareChipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  compareChipTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  comparisonResultsBox: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  compareColBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  compareColTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  compareAtsScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  compareContentSnippet: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
});
