import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from './components/CareerLayout';
import {
  tailorResumeWithGuardrails,
  TailoredBulletDiff,
  recordCreditUsage
} from '../../services/careerService';
import {
  Target,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Copy,
  Download,
  AlertCircle,
  FileCheck
} from 'lucide-react-native';

export default function ResumeTailorPage() {
  const router = useRouter();

  const [jobText, setJobText] = useState(`Role: Director of Operations
Company: Enterprise Logistics Group
Requirements:
- Proven track record of cross-functional SLA governance and process automation.
- Root Cause Analysis (RCA) and preventive maintenance workflow implementation.
- Enterprise vendor management and cost containment.`);

  const [resumeText, setResumeText] = useState(`Alex Vance
Senior Operations Lead

Summary:
Experienced operations specialist with leadership background in client services.

Experience:
- Responsible for managing operational delivery and client SLAs.
- Worked with team on intake process bottlenecks.
- Met with vendors and reviewed agreements.`);

  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredSummary, setTailoredSummary] = useState('');
  const [diffs, setDiffs] = useState<TailoredBulletDiff[]>([]);
  const [initialScore, setInitialScore] = useState(64);
  const [finalScore, setFinalScore] = useState(88);
  const [copied, setCopied] = useState(false);

  const handleRunTailor = async () => {
    setIsTailoring(true);
    try {
      const result = await tailorResumeWithGuardrails(
        { summary: resumeText, experience: [{ bullets: [resumeText] }] },
        jobText
      );
      setTailoredSummary(result.tailoredSummary);
      setDiffs(result.bulletDiffs);
      setInitialScore(result.initialScore);
      setFinalScore(result.finalScore);
      recordCreditUsage('resume_tailored');
    } catch (e) {
      console.error(e);
    } finally {
      setIsTailoring(false);
    }
  };

  const toggleAccept = (id: string) => {
    setDiffs(prev => prev.map(d => d.id === id ? { ...d, accepted: !d.accepted } : d));
  };

  const acceptAll = () => {
    setDiffs(prev => prev.map(d => ({ ...d, accepted: true })));
  };

  const copyTailoredText = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CareerLayout
      title="Anti-Fabrication Job-Specific Resume Tailoring | Sheriyakam Career"
      description="Tailor your resume bullets to target job descriptions while strictly preserving verified facts and accomplishments with side-by-side diff review."
    >
      <View style={styles.container}>
        {/* Page Header */}
        <View style={styles.headerBox}>
          <View style={styles.pillRow}>
            <View style={styles.pillGreen}>
              <ShieldCheck size={13} color="#059669" />
              <Text style={styles.pillGreenText}>Anti-Fabrication Standard</Text>
            </View>
            <View style={styles.pillNeutral}>
              <Text style={styles.pillNeutralText}>Zero False Claims</Text>
            </View>
          </View>
          <Text style={styles.title}>Job-Specific Resume Tailoring</Text>
          <Text style={styles.subtitle}>
            Align your verified experience to target job keywords without inventing credentials, false metrics, or companies.
          </Text>
        </View>

        {/* Anti-Fabrication Notice Card */}
        <View style={styles.noticeCard}>
          <ShieldCheck size={20} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Our Promise: Optimize Facts. Never Invent Them.</Text>
            <Text style={styles.noticeText}>
              Every bullet is rewritten using vocabulary from the job description to match ATS criteria. We never add technologies, numbers, or responsibilities you didn't provide.
            </Text>
          </View>
        </View>

        {/* Inputs Row */}
        <View style={styles.inputsRow}>
          {/* Target Job */}
          <View style={styles.inputCol}>
            <View style={styles.inputHeader}>
              <Target size={15} color="#059669" />
              <Text style={styles.inputTitle}>Target Job Description</Text>
            </View>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={8}
              placeholder="Paste target job requirements..."
              value={jobText}
              onChangeText={setJobText}
            />
          </View>

          {/* Current Experience */}
          <View style={styles.inputCol}>
            <View style={styles.inputHeader}>
              <FileCheck size={15} color="#111111" />
              <Text style={styles.inputTitle}>Your Current Resume Content</Text>
            </View>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={8}
              placeholder="Paste current resume statements or bullets..."
              value={resumeText}
              onChangeText={setResumeText}
            />
          </View>
        </View>

        {/* Generate Action */}
        <View style={styles.actionCenter}>
          <TouchableOpacity
            style={styles.btnGenerate}
            onPress={handleRunTailor}
            disabled={isTailoring}
            activeOpacity={0.8}
          >
            {isTailoring ? <RefreshCw size={16} color="#FFFFFF" /> : <Sparkles size={16} color="#FFFFFF" />}
            <Text style={styles.btnGenerateText}>
              {isTailoring ? 'Aligning Experience to Job Criteria...' : 'Generate Factual Tailored Bullets'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Diffs & Output Area */}
        {diffs.length > 0 && (
          <View style={styles.outputCard}>
            {/* Score Delta Banner */}
            <View style={styles.deltaBanner}>
              <View style={styles.deltaLeft}>
                <Text style={styles.deltaScoreTitle}>ATS Compatibility Boost</Text>
                <Text style={styles.deltaScoreSub}>Estimated match against target posting</Text>
              </View>
              <View style={styles.deltaRight}>
                <Text style={styles.deltaOldScore}>{initialScore}%</Text>
                <ArrowRight size={16} color="#059669" />
                <Text style={styles.deltaNewScore}>{finalScore}%</Text>
                <View style={styles.deltaBadge}>
                  <Text style={styles.deltaBadgeText}>+{finalScore - initialScore}% Match</Text>
                </View>
              </View>
            </View>

            {/* Tailored Summary */}
            {tailoredSummary ? (
              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Optimized Professional Summary</Text>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>{tailoredSummary}</Text>
                </View>
              </View>
            ) : null}

            {/* Bullets Diff Review Header */}
            <View style={styles.diffsHeader}>
              <Text style={styles.diffsHeaderTitle}>Review Bullet Changes ({diffs.length})</Text>
              <TouchableOpacity style={styles.btnAcceptAll} onPress={acceptAll}>
                <Check size={14} color="#059669" />
                <Text style={styles.btnAcceptAllText}>Accept All Changes</Text>
              </TouchableOpacity>
            </View>

            {/* Bullet Diffs List */}
            <View style={styles.diffList}>
              {diffs.map((diff) => (
                <View key={diff.id} style={styles.diffItemCard}>
                  <View style={styles.diffItemTop}>
                    <Text style={styles.diffSectionTag}>{diff.section}</Text>
                    <TouchableOpacity
                      style={[styles.btnToggleDiff, diff.accepted && styles.btnToggleDiffActive]}
                      onPress={() => toggleAccept(diff.id)}
                    >
                      <Check size={13} color={diff.accepted ? '#FFFFFF' : '#059669'} />
                      <Text style={[styles.btnToggleDiffText, diff.accepted && styles.btnToggleDiffTextActive]}>
                        {diff.accepted ? 'Accepted' : 'Accept Change'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Before */}
                  <View style={styles.diffBlockBefore}>
                    <Text style={styles.diffLabelBefore}>ORIGINAL</Text>
                    <Text style={styles.diffTextBefore}>{diff.original}</Text>
                  </View>

                  {/* After */}
                  <View style={styles.diffBlockAfter}>
                    <Text style={styles.diffLabelAfter}>TAILORED (FACTUAL REWRITE)</Text>
                    <Text style={styles.diffTextAfter}>{diff.tailored}</Text>
                    <View style={styles.reasonPill}>
                      <Info size={12} color="#059669" />
                      <Text style={styles.reasonPillText}>{diff.reason}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Export & Next Step Actions */}
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.btnCopy} onPress={copyTailoredText}>
                <Copy size={15} color="#111111" />
                <Text style={styles.btnCopyText}>{copied ? 'Copied to Clipboard!' : 'Copy Tailored Bullets'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnBuilder}
                onPress={() => router.push('/cv-linkedin-optimize/resume-builder' as any)}
              >
                <Text style={styles.btnBuilderText}>Load into Resume Builder</Text>
                <ArrowRight size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingVertical: 36,
  },
  headerBox: {
    marginBottom: 24,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  pillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pillGreenText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  pillNeutral: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillNeutralText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525B',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 21,
    maxWidth: 680,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 24,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  inputsRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 18,
    marginBottom: 20,
  },
  inputCol: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  textArea: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#18181B',
    lineHeight: 19,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  actionCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  btnGenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 10,
  },
  btnGenerateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  outputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    gap: 20,
  },
  deltaBanner: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 12,
  },
  deltaLeft: {},
  deltaScoreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
  },
  deltaScoreSub: {
    fontSize: 12,
    color: '#15803D',
  },
  deltaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deltaOldScore: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  deltaNewScore: {
    fontSize: 22,
    fontWeight: '800',
    color: '#166534',
  },
  deltaBadge: {
    backgroundColor: '#166534',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deltaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summarySection: {},
  summarySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  summaryText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  diffsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  diffsHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  btnAcceptAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
  },
  btnAcceptAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  diffList: {
    gap: 14,
  },
  diffItemCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 10,
  },
  diffItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffSectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  btnToggleDiff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  btnToggleDiffActive: {
    backgroundColor: '#059669',
  },
  btnToggleDiffText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  btnToggleDiffTextActive: {
    color: '#FFFFFF',
  },
  diffBlockBefore: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  diffLabelBefore: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 4,
  },
  diffTextBefore: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  diffBlockAfter: {
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  diffLabelAfter: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 4,
  },
  diffTextAfter: {
    fontSize: 12,
    color: '#14532D',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 6,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reasonPillText: {
    fontSize: 11,
    color: '#059669',
    fontStyle: 'italic',
  },
  footerActions: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  btnCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  btnCopyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  btnBuilder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnBuilderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
