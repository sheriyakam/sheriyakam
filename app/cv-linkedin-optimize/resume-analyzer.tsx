import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from './components/CareerLayout';
import {
  calculateDeterministicAtsScore,
  analyzeJobMatch,
  AtsScoreResult,
  JobMatchResult,
  recordCreditUsage
} from '../../services/careerService';
import {
  Upload,
  FileText,
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  FileCheck
} from 'lucide-react-native';

export default function ResumeAnalyzerPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<any>(null);

  // Analysis state
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

  // Pre-load realistic sample
  const loadSampleData = () => {
    setFileName('Alex_Vance_Operations_Lead.txt');
    setResumeText(`Alex Vance
Senior Operations Lead | San Francisco, CA | alex.vance@example.com | (555) 234-5678

Professional Summary:
Impact-driven operations leader with 6+ years driving cross-functional SLA governance, process automation, and verified team execution across enterprise accounts.

Core Skills:
Operations Management • SLA Optimization • Process Automation • Cross-Functional Leadership • Risk Assessment • Budget Controls • Vendor Governance

Professional Experience:
Senior Operations Lead | Apex Logistics Global (2021 – Present)
• Directed cross-functional SLA governance maintaining 99.4% on-time milestone delivery across 45+ enterprise accounts.
• Engineered automated intake protocols, decreasing end-to-end turnaround latency by 32%.
• Managed vendor performance metrics, conducting quarterly audit evaluations and reducing non-compliance fees by $45,000 annually.

Operations Specialist | Northwind Courier Corp (2018 – 2021)
• Supervised dispatch logistics for a 28-member operations team, increasing route yield efficiency by 18%.
• Standardized dispatch SOPs and resolved operational escalations within guaranteed 2-hour windows.

Education:
B.S. in Business Administration | University of California, Berkeley (2018)`);

    setJobText(`Role: Director of Operations
Company: Enterprise Horizon
Requirements:
- 5+ years of operations management experience in high-volume enterprise environments.
- Proven track record of SLA optimization and cross-functional team leadership.
- Experience with Process Automation, Vendor Governance, and Root Cause Analysis (RCA).
- Ability to manage department budget controls and ensure regulatory safety standards.
- Strong analytical skills, written communication, and KPI metrics monitoring.`);
  };

  const handleRunAnalysis = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const ats = calculateDeterministicAtsScore(resumeText, jobText);
      const match = jobText.trim() ? analyzeJobMatch(resumeText, jobText) : null;

      setAtsResult(ats);
      setJobMatchResult(match);
      recordCreditUsage('resume_analyzed');
      setIsAnalyzing(false);
      setStep(3);
    }, 600);
  };

  return (
    <CareerLayout
      title="ATS Resume Analyzer & Keyword Gap Report | Sheriyakam Career"
      description="Upload your resume and audit ATS compatibility across formatting, keywords, skills match, and quantifiable metrics with deterministic explainable scoring."
    >
      <View style={styles.container}>
        {/* Header Title */}
        <View style={styles.pageHeader}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Deterministic Engine</Text>
            </View>
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>Transparent Scoring</Text>
            </View>
          </View>
          <Text style={styles.pageTitle}>ATS Resume Analyzer</Text>
          <Text style={styles.pageSubtitle}>
            Scan parsing vulnerabilities, verify section structure, and identify keyword gaps before you submit applications.
          </Text>
        </View>

        {/* Step Progress Pills */}
        <View style={styles.stepIndicatorRow}>
          <TouchableOpacity
            style={[styles.stepPill, step === 1 && styles.stepPillActive]}
            onPress={() => setStep(1)}
          >
            <Text style={[styles.stepPillNum, step === 1 && styles.stepPillNumActive]}>1</Text>
            <Text style={[styles.stepPillLabel, step === 1 && styles.stepPillLabelActive]}>Upload Resume</Text>
          </TouchableOpacity>

          <View style={styles.stepLine} />

          <TouchableOpacity
            style={[styles.stepPill, step === 2 && styles.stepPillActive]}
            onPress={() => setStep(2)}
          >
            <Text style={[styles.stepPillNum, step === 2 && styles.stepPillNumActive]}>2</Text>
            <Text style={[styles.stepPillLabel, step === 2 && styles.stepPillLabelActive]}>Target Job (Optional)</Text>
          </TouchableOpacity>

          <View style={styles.stepLine} />

          <TouchableOpacity
            style={[styles.stepPill, step === 3 && styles.stepPillActive]}
            onPress={() => atsResult && setStep(3)}
          >
            <Text style={[styles.stepPillNum, step === 3 && styles.stepPillNumActive]}>3</Text>
            <Text style={[styles.stepPillLabel, step === 3 && styles.stepPillLabelActive]}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* STEP 1: Upload or Paste Resume */}
        {step === 1 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Step 1: Provide Your Resume</Text>
                <Text style={styles.cardDesc}>Upload a PDF, DOCX, or paste the text content directly below.</Text>
              </View>
              <TouchableOpacity style={styles.sampleDataBtn} onPress={loadSampleData}>
                <Sparkles size={14} color="#059669" />
                <Text style={styles.sampleDataText}>Load Sample Resume</Text>
              </TouchableOpacity>
            </View>

            {/* Drag and Drop Box */}
            <View style={styles.uploadDropzone}>
              <Upload size={32} color="#059669" />
              <Text style={styles.dropzoneTitle}>
                {fileName ? `Loaded: ${fileName}` : 'Drag & Drop your Resume or click to browse'}
              </Text>
              <Text style={styles.dropzoneSub}>Supported: PDF, DOCX, TXT • Max size: 5MB</Text>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR PASTE TEXT DIRECTLY</Text>
                <View style={styles.orLine} />
              </View>
            </View>

            {/* Resume Text Input */}
            <TextInput
              style={styles.textInputArea}
              multiline
              numberOfLines={10}
              placeholder="Paste your complete resume text here (Summary, Skills, Experience, Education)..."
              placeholderTextColor="#9CA3AF"
              value={resumeText}
              onChangeText={setResumeText}
            />

            <View style={styles.cardActionsRow}>
              <Text style={styles.charCountText}>{resumeText.length} characters</Text>
              <TouchableOpacity
                style={[styles.btnNext, !resumeText.trim() && styles.btnDisabled]}
                disabled={!resumeText.trim()}
                onPress={() => setStep(2)}
              >
                <Text style={styles.btnNextText}>Next: Target Job</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2: Paste Job Description */}
        {step === 2 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Step 2: Add Target Job Description</Text>
                <Text style={styles.cardDesc}>
                  Pasting the target job allows our engine to audit keyword overlap and score job-fit accuracy.
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.textInputArea}
              multiline
              numberOfLines={12}
              placeholder="Paste the target job description text here (Responsibilities, Requirements, Skills)..."
              placeholderTextColor="#9CA3AF"
              value={jobText}
              onChangeText={setJobText}
            />

            <View style={styles.cardActionsRow}>
              <TouchableOpacity style={styles.btnBack} onPress={() => setStep(1)}>
                <Text style={styles.btnBackText}>Back to Resume</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnNext}
                onPress={handleRunAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <RefreshCw size={16} color="#FFFFFF" />
                ) : (
                  <Sparkles size={16} color="#FFFFFF" />
                )}
                <Text style={styles.btnNextText}>
                  {isAnalyzing ? 'Analyzing Parsing Signals...' : 'Run Platform Analysis'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: Comprehensive ATS & Keyword Report */}
        {step === 3 && atsResult && (
          <View style={styles.reportContainer}>
            {/* Top Score Banner */}
            <View style={styles.scoreBannerCard}>
              <View style={styles.scoreBannerLeft}>
                <View style={styles.overallScoreCircle}>
                  <Text style={styles.overallScoreNum}>{atsResult.overallScore}</Text>
                  <Text style={styles.overallScoreDenominator}>/100</Text>
                </View>
                <View style={styles.scoreBannerTextCol}>
                  <Text style={styles.scoreBannerTitle}>Platform Analysis Score</Text>
                  <Text style={styles.scoreBannerSub}>{atsResult.summary}</Text>
                  <Text style={styles.scoreFormulaNote}>
                    Calculated deterministically from 6 ATS factors. Free of random score drift.
                  </Text>
                </View>
              </View>

              {jobMatchResult && (
                <View style={styles.jobMatchPill}>
                  <Target size={18} color="#059669" />
                  <View>
                    <Text style={styles.jobMatchPillVal}>{jobMatchResult.matchPercentage}%</Text>
                    <Text style={styles.jobMatchPillLabel}>Job Match Rate</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Transparent 6-Factor Breakdown Grid */}
            <View style={styles.factorsGrid}>
              {[
                { label: 'Formatting Hierarchy', val: atsResult.breakdown.formatting, desc: 'Header syntax and parser safety' },
                { label: 'Keyword Match', val: atsResult.breakdown.keywordMatch, desc: 'Coverage of target posting vocabulary' },
                { label: 'Skills Match', val: atsResult.breakdown.skillsMatch, desc: 'Core hard and technical competencies' },
                { label: 'Experience Relevance', val: atsResult.breakdown.experienceRelevance, desc: 'Action verbs and career chronology' },
                { label: 'Content Quality', val: atsResult.breakdown.contentQuality, desc: 'Metric density and verifiable outcomes' },
                { label: 'Readability', val: atsResult.breakdown.readability, desc: 'Bullet length and layout scannability' },
              ].map((item) => (
                <View key={item.label} style={styles.factorCard}>
                  <View style={styles.factorHeader}>
                    <Text style={styles.factorLabel}>{item.label}</Text>
                    <Text style={[styles.factorScore, { color: item.val >= 80 ? '#059669' : (item.val >= 65 ? '#D97706' : '#DC2626') }]}>
                      {item.val}/100
                    </Text>
                  </View>
                  <View style={styles.factorTrack}>
                    <View style={[styles.factorFill, { width: `${item.val}%`, backgroundColor: item.val >= 80 ? '#059669' : (item.val >= 65 ? '#D97706' : '#DC2626') }]} />
                  </View>
                  <Text style={styles.factorDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>

            {/* Keyword Match & Gap Audit Engine */}
            {jobMatchResult && (
              <View style={styles.keywordSection}>
                <View style={styles.sectionHeadingRow}>
                  <Target size={20} color="#059669" />
                  <Text style={styles.sectionHeadingTitle}>Target Job Keyword Audit</Text>
                </View>
                <Text style={styles.sectionHeadingSub}>
                  Click on any keyword below to inspect its detection state and recommended placement in your resume.
                </Text>

                <View style={styles.keywordColumnsRow}>
                  {/* Matched */}
                  <View style={styles.keywordListCard}>
                    <View style={styles.keywordListHead}>
                      <CheckCircle2 size={16} color="#059669" />
                      <Text style={styles.keywordListTitle}>Matched Keywords ({jobMatchResult.matchedKeywords.length})</Text>
                    </View>
                    <View style={styles.keywordTagsWrap}>
                      {jobMatchResult.matchedKeywords.map((kw) => (
                        <TouchableOpacity
                          key={kw.keyword}
                          style={styles.keywordTagMatched}
                          onPress={() => setSelectedKeyword(kw)}
                        >
                          <Text style={styles.keywordTextMatched}>{kw.keyword}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Missing */}
                  <View style={styles.keywordListCard}>
                    <View style={styles.keywordListHead}>
                      <AlertCircle size={16} color="#DC2626" />
                      <Text style={styles.keywordListTitle}>Missing Keywords ({jobMatchResult.missingKeywords.length})</Text>
                    </View>
                    <View style={styles.keywordTagsWrap}>
                      {jobMatchResult.missingKeywords.map((kw) => (
                        <TouchableOpacity
                          key={kw.keyword}
                          style={styles.keywordTagMissing}
                          onPress={() => setSelectedKeyword(kw)}
                        >
                          <Text style={styles.keywordTextMissing}>{kw.keyword}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Keyword Inspector Drawer */}
                {selectedKeyword && (
                  <View style={styles.keywordInspectorBox}>
                    <View style={styles.inspectorHeader}>
                      <Text style={styles.inspectorTitle}>Keyword Insight: "{selectedKeyword.keyword}"</Text>
                      <TouchableOpacity onPress={() => setSelectedKeyword(null)}>
                        <Text style={styles.inspectorClose}>Close</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.inspectorStatus}>
                      Status: <Text style={{ fontWeight: '700' }}>{selectedKeyword.category.toUpperCase()}</Text> • Importance: {selectedKeyword.importance}
                    </Text>
                    <Text style={styles.inspectorAdvice}>{selectedKeyword.contextSnippet}</Text>
                    {selectedKeyword.foundLocation && (
                      <Text style={styles.inspectorLocation}>Detected in: {selectedKeyword.foundLocation}</Text>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Action Items List */}
            <View style={styles.actionItemsSection}>
              <Text style={styles.actionItemsTitle}>Prioritized Recommendations</Text>
              <View style={styles.actionItemsList}>
                {atsResult.actionItems.map((item, idx) => (
                  <View key={idx} style={styles.actionItemRow}>
                    <View style={[styles.priorityBadge, item.priority === 'high' ? styles.priorityHigh : styles.priorityMed]}>
                      <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.actionItemText}>{item.recommendation}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Quick Action Navigation Buttons */}
            <View style={styles.reportNavActions}>
              <TouchableOpacity
                style={styles.btnTailorCta}
                onPress={() => router.push('/cv-linkedin-optimize/resume-tailor' as any)}
              >
                <Sparkles size={16} color="#FFFFFF" />
                <Text style={styles.btnTailorCtaText}>Tailor Resume to Job</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnReanalyze}
                onPress={() => setStep(1)}
              >
                <RefreshCw size={14} color="#555555" />
                <Text style={styles.btnReanalyzeText}>Analyze Another Resume</Text>
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
  pageHeader: {
    marginBottom: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3F3F46',
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeGreenText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    maxWidth: 700,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  stepPillActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  stepPillNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E4E4E7',
    color: '#52525B',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepPillNumActive: {
    backgroundColor: '#059669',
    color: '#FFFFFF',
  },
  stepPillLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#52525B',
  },
  stepPillLabelActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  cardHeader: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666666',
  },
  sampleDataBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sampleDataText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  uploadDropzone: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
    marginTop: 10,
    marginBottom: 4,
  },
  dropzoneSub: {
    fontSize: 12,
    color: '#71717A',
    marginBottom: 16,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginVertical: 4,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E4E7',
  },
  orText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    paddingHorizontal: 10,
  },
  textInputArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 10,
    padding: 14,
    fontSize: 13,
    color: '#18181B',
    lineHeight: 20,
    minHeight: 180,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCountText: {
    fontSize: 12,
    color: '#71717A',
  },
  btnNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnNextText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  btnBack: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnBackText: {
    color: '#52525B',
    fontSize: 14,
    fontWeight: '500',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  reportContainer: {
    gap: 24,
  },
  scoreBannerCard: {
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
  scoreBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flex: 1,
  },
  overallScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    borderWidth: 3,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallScoreNum: {
    fontSize: 26,
    fontWeight: '800',
    color: '#065F46',
  },
  overallScoreDenominator: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  scoreBannerTextCol: {
    flex: 1,
  },
  scoreBannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  scoreBannerSub: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 6,
  },
  scoreFormulaNote: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  jobMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  jobMatchPillVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#166534',
  },
  jobMatchPillLabel: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  factorCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 300 : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  factorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181B',
  },
  factorScore: {
    fontSize: 13,
    fontWeight: '800',
  },
  factorTrack: {
    height: 6,
    backgroundColor: '#F4F4F5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  factorFill: {
    height: 6,
    borderRadius: 3,
  },
  factorDesc: {
    fontSize: 11,
    color: '#71717A',
  },
  keywordSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionHeadingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  sectionHeadingSub: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  keywordColumnsRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
  },
  keywordListCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  keywordListHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  keywordListTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  keywordTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordTagMatched: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  keywordTextMatched: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  keywordTagMissing: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  keywordTextMissing: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },
  keywordInspectorBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inspectorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  inspectorClose: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  inspectorStatus: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 6,
  },
  inspectorAdvice: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 6,
  },
  inspectorLocation: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  actionItemsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  actionItemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 14,
  },
  actionItemsList: {
    gap: 10,
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
  },
  priorityMed: {
    backgroundColor: '#FEF3C7',
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
  },
  actionItemText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  reportNavActions: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnTailorCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 'auto' : '100%',
  },
  btnTailorCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnReanalyze: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnReanalyzeText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
});
