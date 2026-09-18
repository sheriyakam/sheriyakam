import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { CareerLayout } from './components/CareerLayout';
import { generateCoverLetter, recordCreditUsage } from '../../services/careerService';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Download,
  ShieldCheck,
  Building,
  Briefcase
} from 'lucide-react-native';

export default function CoverLetterPage() {
  const [companyName, setCompanyName] = useState('Enterprise Horizon Global');
  const [roleTitle, setRoleTitle] = useState('Director of Operations');
  const [jobDescription, setJobDescription] = useState('Seeking an operational director to lead multi-account SLA performance, drive process automation, and coordinate vendor governance matrices.');
  const [resumeSnippet, setResumeSnippet] = useState('Senior Operations Lead with 6+ years managing client account SLAs, reducing intake bottlenecks by 32%, and conducting vendor performance audits.');
  const [tone, setTone] = useState<'Professional' | 'Confident' | 'Concise' | 'Traditional'>('Professional');

  const [isGenerating, setIsGenerating] = useState(false);
  const [letterResult, setLetterResult] = useState<{ letter: string; wordCount: number; highlightedStrengths: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCoverLetter({
        companyName,
        roleTitle,
        jobDescription,
        resumeSnippet,
        tone
      });
      setLetterResult(result);
      recordCreditUsage('cover_letter_generated');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (letterResult?.letter && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(letterResult.letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <CareerLayout
      title="Targeted AI Cover Letter Generator | Sheriyakam Career"
      description="Generate targeted, company-aligned cover letters matching job requirements while strictly preserving your authentic accomplishments."
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.pillRow}>
            <View style={styles.pillGreen}>
              <ShieldCheck size={13} color="#059669" />
              <Text style={styles.pillGreenText}>Anti-Fabrication</Text>
            </View>
            <View style={styles.pillNeutral}>
              <Text style={styles.pillNeutralText}>Tone Calibrated</Text>
            </View>
          </View>
          <Text style={styles.title}>Professional Cover Letter Generator</Text>
          <Text style={styles.subtitle}>
            Create an authentic, company-specific application letter that bridges your verified background directly to target deliverables.
          </Text>
        </View>

        {/* Inputs Card */}
        <View style={styles.card}>
          <View style={styles.grid2}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={roleTitle}
                onChangeText={setRoleTitle}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Tone of Voice</Text>
              <View style={styles.toneRow}>
                {(['Professional', 'Confident', 'Concise', 'Traditional'] as const).map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.toneChip, tone === t && styles.toneChipActive]}
                    onPress={() => setTone(t)}
                  >
                    <Text style={[styles.toneChipText, tone === t && styles.toneChipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Job Posting Overview</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                value={jobDescription}
                onChangeText={setJobDescription}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Your Background Highlights</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                value={resumeSnippet}
                onChangeText={setResumeSnippet}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnGenerate}
              onPress={handleGenerate}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating ? <RefreshCw size={16} color="#FFFFFF" /> : <Sparkles size={16} color="#FFFFFF" />}
              <Text style={styles.btnGenerateText}>
                {isGenerating ? 'Writing Tailored Letter...' : 'Generate Targeted Cover Letter'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Output Card */}
        {letterResult && (
          <View style={styles.outputCard}>
            <View style={styles.outputHeader}>
              <View>
                <Text style={styles.outputTitle}>Targeted Cover Letter ({companyName})</Text>
                <Text style={styles.outputSub}>
                  {letterResult.wordCount} words • Calibrated to {tone} tone
                </Text>
              </View>

              <View style={styles.outputActions}>
                <TouchableOpacity style={styles.btnCopy} onPress={copyToClipboard}>
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} color="#111111" />}
                  <Text style={styles.btnCopyText}>{copied ? 'Copied!' : 'Copy to Clipboard'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnRegenerate} onPress={handleGenerate}>
                  <RefreshCw size={13} color="#4B5563" />
                  <Text style={styles.btnRegenerateText}>Regenerate</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Letter Paper Body */}
            <View style={styles.letterSheet}>
              <Text style={styles.letterContent}>{letterResult.letter}</Text>
            </View>

            {/* Highlights */}
            <View style={styles.strengthsRow}>
              <Text style={styles.strengthsLabel}>Targeted Strengths Highlighted:</Text>
              <View style={styles.strengthsTags}>
                {letterResult.highlightedStrengths.map(s => (
                  <View key={s} style={styles.strengthPill}>
                    <Text style={styles.strengthText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 960,
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
    maxWidth: 640,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginBottom: 28,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  fieldCol: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 240 : '100%',
  },
  fieldColFull: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111111',
  },
  toneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toneChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  toneChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  toneChipTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#111111',
    lineHeight: 19,
    minHeight: 80,
  },
  actionRow: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  btnGenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnGenerateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  outputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    gap: 16,
  },
  outputHeader: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 14,
  },
  outputTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  outputSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  outputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnCopyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  btnRegenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnRegenerateText: {
    fontSize: 12,
    color: '#4B5563',
  },
  letterSheet: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  letterContent: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#1F2937',
  },
  strengthsRow: {
    gap: 6,
  },
  strengthsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  strengthsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  strengthPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
});
