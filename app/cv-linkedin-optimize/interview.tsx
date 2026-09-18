import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { CareerLayout } from './components/CareerLayout';
import { generateInterviewPrep, InterviewQuestionItem, recordCreditUsage } from '../../services/careerService';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Target,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Layers
} from 'lucide-react-native';

export default function InterviewPrepPage() {
  const [roleTitle, setRoleTitle] = useState('Director of Operations');
  const [jobDescription, setJobDescription] = useState('Requires experience leading enterprise operations, cross-departmental SLA compliance, root cause failure analysis, and managing vendor escalation paths.');
  const [resumeSnippet, setResumeSnippet] = useState('6+ years leading SLA governance, automating intake protocols, resolving turnaround bottlenecks by 32%, and conducting vendor audits.');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInterviewPrep({
        roleTitle,
        jobDescription,
        resumeSnippet
      });
      setQuestions(result);
      recordCreditUsage('interview_prepared');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQuestions = activeCategory === 'All'
    ? questions
    : questions.filter(q => q.category.includes(activeCategory));

  return (
    <CareerLayout
      title="Role-Specific Interview Preparation & STAR Questions | Sheriyakam Career"
      description="Practice behavioral, technical, and role-specific interview questions generated directly from your resume and target job requirements."
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.pillRow}>
            <View style={styles.pillGreen}>
              <HelpCircle size={13} color="#059669" />
              <Text style={styles.pillGreenText}>STAR Answer Framework</Text>
            </View>
            <View style={styles.pillNeutral}>
              <Text style={styles.pillNeutralText}>Zero Generic Fluff</Text>
            </View>
          </View>
          <Text style={styles.title}>Role-Specific Interview Preparation</Text>
          <Text style={styles.subtitle}>
            Practice behavioral, technical, and scenario questions generated from your target job, with structured answer breakdowns and personalization tips.
          </Text>
        </View>

        {/* Inputs Card */}
        <View style={styles.card}>
          <View style={styles.grid2}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Target Role Title</Text>
              <TextInput
                style={styles.input}
                value={roleTitle}
                onChangeText={setRoleTitle}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Key Job Description Requirements</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                value={jobDescription}
                onChangeText={setJobDescription}
              />
            </View>

            <View style={styles.fieldColFull}>
              <Text style={styles.fieldLabel}>Your Background Experience Excerpt</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
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
                {isGenerating ? 'Generating Role Scenarios...' : 'Generate Interview Questions'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Chips */}
        {questions.length > 0 && (
          <View style={styles.filterRow}>
            {['All', 'Behavioral', 'Role-Specific', 'Technical', 'HR'].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.filterChipText, activeCategory === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Questions List */}
        {filteredQuestions.length > 0 && (
          <View style={styles.questionsList}>
            {filteredQuestions.map((q, idx) => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{q.category}</Text>
                  </View>
                  <Text style={styles.questionNum}>Question #{idx + 1}</Text>
                </View>

                <Text style={styles.questionText}>"{q.question}"</Text>

                {/* Why they ask */}
                <View style={styles.whyBox}>
                  <Text style={styles.whyLabel}>Why hiring managers ask this:</Text>
                  <Text style={styles.whyText}>{q.whyTheyAsk}</Text>
                </View>

                {/* Suggested Answer Structure */}
                <View style={styles.structureBox}>
                  <Text style={styles.structureTitle}>Suggested Answer Structure (STAR):</Text>
                  <View style={styles.starRow}>
                    <Text style={styles.starLabel}>Situation / Task:</Text>
                    <Text style={styles.starText}>{q.suggestedAnswerStructure.situationTask}</Text>
                  </View>
                  <View style={styles.starRow}>
                    <Text style={styles.starLabel}>Action:</Text>
                    <Text style={styles.starText}>{q.suggestedAnswerStructure.action}</Text>
                  </View>
                  <View style={styles.starRow}>
                    <Text style={styles.starLabel}>Result:</Text>
                    <Text style={styles.starText}>{q.suggestedAnswerStructure.result}</Text>
                  </View>
                </View>

                {/* Personalization Tips */}
                <View style={styles.tipsRow}>
                  <Sparkles size={14} color="#059669" />
                  <Text style={styles.tipsText}>
                    <Text style={{ fontWeight: '700' }}>Personalization tip: </Text>
                    {q.personalizationTips}
                  </Text>
                </View>
              </View>
            ))}
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
    marginBottom: 24,
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
    minHeight: 65,
    lineHeight: 18,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 22,
    gap: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  questionNum: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 23,
  },
  whyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  whyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  whyText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  structureBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  structureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  starRow: {
    gap: 2,
  },
  starLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  starText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 17,
  },
  tipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  tipsText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    flex: 1,
  },
});
