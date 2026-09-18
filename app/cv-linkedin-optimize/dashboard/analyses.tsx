import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  FileText,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  ExternalLink
} from 'lucide-react-native';

export default function PastAnalysesPage() {
  const router = useRouter();

  const mockAnalyses = [
    {
      id: 'an_1',
      date: 'Today, 2:15 PM',
      jobTitle: 'Director of Operations',
      company: 'Enterprise Horizon',
      overallScore: 84,
      matchPercentage: 84,
      matchedCount: 12,
      missingCount: 3,
      topGap: 'Root Cause Analysis (RCA)'
    },
    {
      id: 'an_2',
      date: 'Sep 12, 2026',
      jobTitle: 'Senior Operations Lead',
      company: 'Apex Logistics',
      overallScore: 88,
      matchPercentage: 91,
      matchedCount: 14,
      missingCount: 1,
      topGap: 'Six Sigma Green Belt'
    },
    {
      id: 'an_3',
      date: 'Aug 28, 2026',
      jobTitle: 'Supply Chain Operations Manager',
      company: 'Northwind Global',
      overallScore: 76,
      matchPercentage: 72,
      matchedCount: 9,
      missingCount: 5,
      topGap: 'ERP System Migration'
    }
  ];

  return (
    <CareerLayout
      title="Past ATS Analyses & Keyword Reports | Sheriyakam Career"
      description="Review your past resume parsing audits, ATS scores, and target company keyword gap histories."
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.push('/cv-linkedin-optimize/dashboard' as any)}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Past ATS Analyses ({mockAnalyses.length})</Text>
            <Text style={styles.subtitle}>
              Audit histories showing how your resume scored against specific target job descriptions over time.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnNew}
            onPress={() => router.push('/cv-linkedin-optimize/resume-analyzer' as any)}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.btnNewText}>Run New Audit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {mockAnalyses.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                  <Text style={styles.companyLine}>{item.company} • {item.date}</Text>
                </View>

                <View style={styles.scoresRight}>
                  <View style={styles.scorePillGreen}>
                    <Text style={styles.scorePillVal}>{item.overallScore}</Text>
                    <Text style={styles.scorePillLabel}>ATS Score</Text>
                  </View>

                  <View style={styles.scorePillBlue}>
                    <Text style={styles.scorePillValBlue}>{item.matchPercentage}%</Text>
                    <Text style={styles.scorePillLabelBlue}>Job Match</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBottom}>
                <View style={styles.gapSummary}>
                  <AlertCircle size={14} color="#DC2626" />
                  <Text style={styles.gapText}>
                    Top keyword gap flagged: <Text style={{ fontWeight: '700' }}>{item.topGap}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnReview}
                  onPress={() => router.push('/cv-linkedin-optimize/resume-analyzer' as any)}
                >
                  <Text style={styles.btnReviewText}>Re-audit Resume</Text>
                  <ArrowRight size={13} color="#111111" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  cardTop: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
  },
  cardLeft: {},
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  companyLine: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  scoresRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scorePillGreen: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  scorePillVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
  },
  scorePillLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  scorePillBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  scorePillValBlue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  scorePillLabelBlue: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E40AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardBottom: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 10,
  },
  gapSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gapText: {
    fontSize: 12,
    color: '#4B5563',
  },
  btnReview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  btnReviewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
});
