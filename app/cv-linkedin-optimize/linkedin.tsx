import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { CareerLayout } from './components/CareerLayout';
import {
  optimizeLinkedInProfile,
  recordCreditUsage
} from '../../services/careerService';
import {
  Linkedin,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react-native';

export default function LinkedInOptimizerPage() {
  const [targetRole, setTargetRole] = useState('Director of Operations');
  const [currentHeadline, setCurrentHeadline] = useState('Senior Operations Lead at Apex Logistics Global | Process Improvement & SLA Delivery');
  const [currentAbout, setCurrentAbout] = useState('Experienced operations specialist leading cross-functional teams and managing business workflows.');
  const [skills, setSkills] = useState('Operations Management, SLA Optimization, Cross-Functional Leadership, Budgeting');

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const opt = await optimizeLinkedInProfile({
        targetRole,
        currentHeadline,
        currentAbout,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setResult(opt);
      recordCreditUsage('linkedin_optimized');
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string, type: 'headline' | 'about') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    }
  };

  return (
    <CareerLayout
      title="LinkedIn Profile & Recruiter Search Optimizer | Sheriyakam Career"
      description="Optimize your LinkedIn headline under 220 characters and create a compelling 3-sentence About hook designed for recruiter candidate searches."
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.pillRow}>
            <View style={styles.pillLinkedin}>
              <Linkedin size={13} color="#0A66C2" />
              <Text style={styles.pillLinkedinText}>Recruiter Search Optimization</Text>
            </View>
            <View style={styles.pillNeutral}>
              <Text style={styles.pillNeutralText}>First-Person Voice</Text>
            </View>
          </View>
          <Text style={styles.title}>LinkedIn Profile Optimizer</Text>
          <Text style={styles.subtitle}>
            Transform your profile headline, About section, and skill keywords to rank higher in recruiter Boolean queries.
          </Text>
        </View>

        {/* Form Inputs Card */}
        <View style={styles.card}>
          <View style={styles.grid2}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Target Role / Position</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Director of Operations, Senior Product Manager"
                value={targetRole}
                onChangeText={setTargetRole}
              />
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Core Skills (Comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Operations, SLA, Lean Six Sigma"
                value={skills}
                onChangeText={setSkills}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Current LinkedIn Headline</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste your current profile headline..."
                value={currentHeadline}
                onChangeText={setCurrentHeadline}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Current About Section Excerpt</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Paste your current About text..."
                value={currentAbout}
                onChangeText={setCurrentAbout}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnOptimize}
              onPress={handleRunOptimization}
              disabled={isOptimizing}
              activeOpacity={0.8}
            >
              {isOptimizing ? <RefreshCw size={16} color="#FFFFFF" /> : <Sparkles size={16} color="#FFFFFF" />}
              <Text style={styles.btnOptimizeText}>
                {isOptimizing ? 'Generating Optimized Profile...' : 'Optimize Profile for Recruiters'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Area */}
        {result && (
          <View style={styles.resultsArea}>
            {/* Optimized Headline Card */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultTitle}>Optimized Headline</Text>
                  <Text style={styles.charCount}>
                    {result.optimizedHeadline.length}/220 characters (Optimal for mobile & search truncation)
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnCopy}
                  onPress={() => copyToClipboard(result.optimizedHeadline, 'headline')}
                >
                  {copiedHeadline ? <Check size={14} color="#059669" /> : <Copy size={14} color="#111111" />}
                  <Text style={styles.btnCopyText}>{copiedHeadline ? 'Copied!' : 'Copy to LinkedIn'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.headlineBox}>
                <Text style={styles.headlineText}>{result.optimizedHeadline}</Text>
              </View>
            </View>

            {/* 3-Sentence About Hook Card */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultTitle}>3-Sentence About Hook (Before "See More")</Text>
                  <Text style={styles.charCount}>
                    First-person conversational narrative that hooks executive recruiters
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnCopy}
                  onPress={() => copyToClipboard(result.aboutHook, 'about')}
                >
                  {copiedAbout ? <Check size={14} color="#059669" /> : <Copy size={14} color="#111111" />}
                  <Text style={styles.btnCopyText}>{copiedAbout ? 'Copied!' : 'Copy to LinkedIn'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.aboutBox}>
                <Text style={styles.aboutText}>{result.aboutHook}</Text>
              </View>

              {result.aboutStory ? (
                <View style={styles.storyWrap}>
                  <Text style={styles.storyLabel}>Extended Profile Narrative (Body)</Text>
                  <Text style={styles.storyText}>{result.aboutStory}</Text>
                </View>
              ) : null}
            </View>

            {/* Skills Gap Audit */}
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Skills Gap Analysis for {targetRole}</Text>
              <Text style={styles.charCount}>
                High-volume recruiter search tags commonly associated with this position:
              </Text>

              <View style={styles.gapTagsRow}>
                {result.skillsGap.map((gap: string) => (
                  <View key={gap} style={styles.gapTag}>
                    <Text style={styles.gapTagText}>+ {gap}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Profile Checklist */}
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Recruiter Search Readiness Checklist</Text>
              <View style={styles.checklist}>
                {result.checklist.map((item: any, i: number) => (
                  <View key={i} style={styles.checkItem}>
                    <CheckCircle2 size={16} color={item.completed ? '#059669' : '#D1D5DB'} />
                    <Text style={styles.checkText}>{item.task}</Text>
                    <View style={styles.impactBadge}>
                      <Text style={styles.impactText}>{item.impact} Impact</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerBox}>
              <Info size={14} color="#6B7280" />
              <Text style={styles.disclaimerText}>
                Disclaimer: Sheriyakam Career is an independent career intelligence tool. This analysis is not endorsed or certified by LinkedIn Corporation.
              </Text>
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
  pillLinkedin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pillLinkedinText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
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
  textArea: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#111111',
    minHeight: 80,
    lineHeight: 18,
  },
  actionRow: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  btnOptimize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnOptimizeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  resultsArea: {
    gap: 20,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 22,
    gap: 12,
  },
  resultHeader: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 10,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  charCount: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
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
  headlineBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#0A66C2',
  },
  headlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 20,
  },
  aboutBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  aboutText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 20,
  },
  storyWrap: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  storyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  storyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  gapTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  gapTag: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  gapTagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  checklist: {
    gap: 8,
    marginTop: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  impactBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    flex: 1,
  },
});
