import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from './components/CareerLayout';
import {
  FileText,
  Target,
  Sparkles,
  Linkedin,
  Mail,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  Lock,
  Download
} from 'lucide-react-native';

export default function CareerLandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [humanizeAccepted, setHumanizeAccepted] = useState(true);

  const features = [
    {
      icon: FileText,
      title: 'ATS Resume Analysis',
      desc: 'Scan formatting, header hierarchy, and parsing vulnerabilities against modern enterprise applicant tracking systems.',
      cta: 'Analyze Resume',
      path: '/cv-linkedin-optimize/resume-analyzer',
      badge: 'Deterministic'
    },
    {
      icon: Target,
      title: 'Job Match & Keywords',
      desc: 'Compare your resume against any job description. Identify matched, partial, and missing keywords with exact section locations.',
      cta: 'Match Job Description',
      path: '/cv-linkedin-optimize/resume-analyzer',
      badge: 'Keyword Gap Report'
    },
    {
      icon: Sparkles,
      title: 'AI Resume Optimization',
      desc: 'Rewrite existing bullet points to strengthen action verbs and highlight quantifiable achievements while strictly preserving facts.',
      cta: 'Tailor Resume',
      path: '/cv-linkedin-optimize/resume-tailor',
      badge: 'Anti-Fabrication'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Optimizer',
      desc: 'Craft a punchy first-person headline under 220 characters and a 3-sentence About hook designed for recruiter search algorithms.',
      cta: 'Optimize Profile',
      path: '/cv-linkedin-optimize/linkedin',
      badge: 'Recruiter Search'
    },
    {
      icon: Cpu,
      title: 'Humanize Your Resume',
      desc: 'Detect robotic AI buzzwords ("spearheaded", "orchestrated", "synergy") and replace them with authentic, impactful professional language.',
      cta: 'Humanize Bullets',
      path: '/cv-linkedin-optimize/resume-tailor',
      badge: 'Zero Buzzwords'
    },
    {
      icon: Mail,
      title: 'Cover Letter & Interview Prep',
      desc: 'Generate targeted company-specific cover letters and practice tailored behavioral and technical questions with STAR frameworks.',
      cta: 'Prepare Applications',
      path: '/cv-linkedin-optimize/cover-letter',
      badge: 'STAR Framework'
    },
  ];

  const faqs = [
    {
      q: 'What is an ATS and why does it matter?',
      a: 'An Applicant Tracking System (ATS) is recruitment software used by over 95% of Fortune 500 companies to parse, filter, and rank candidate resumes before a human recruiter reads them. Complex multi-column layouts, graphics, tables, or missing target keywords can prevent an ATS from properly indexing your experience.'
    },
    {
      q: 'How does the Platform Analysis Score work?',
      a: 'Our Platform Analysis Score (0–100) is a transparent, deterministic composite calculated across 6 specific categories: Formatting (20%), Keyword Match (25%), Skills Match (15%), Experience Relevance (15%), Content Quality (15%), and Readability (10%). We do not randomly generate scores or claim to represent any single proprietary ATS algorithm.'
    },
    {
      q: 'Does the AI ever invent or fabricate experience?',
      a: 'Never. Our fundamental design principle is "Optimize facts. Never invent them." The AI only ever restructures, sharpens, and aligns the experience, employers, and achievements you already have. If an accomplishment lacks metrics, we prompt you to add one rather than inventing fictional numbers.'
    },
    {
      q: 'Can I export in ATS-compliant vector formats?',
      a: 'Yes. You can export clean, single-color #000000 text-selectable PDF and DOCX files. Every document passes our pre-flight ATS validation check before download to ensure no unparseable floating elements are included.'
    },
    {
      q: 'Is my resume data private and secure?',
      a: 'Yes. Your resume and application documents are private to your authenticated workspace. We do not sell your personal data or use your private career history to train public AI models.'
    },
    {
      q: 'How does the free tier work?',
      a: 'Every user receives 3 free full resume tailors and 5 free ATS analyses every 5 hours. The quota operates on a sliding window, meaning credits unlock 5 hours after use without requiring a credit card.'
    }
  ];

  return (
    <CareerLayout
      title="Optimize Your Resume. Match More Jobs. Get Interview-Ready | Sheriyakam Career"
      description="Upload your resume, paste a job description, and receive an explainable ATS analysis, keyword gap audit, and anti-fabrication tailoring in minutes."
    >
      {/* 1. Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroInner}>
          <View style={styles.eyebrowBadge}>
            <Sparkles size={14} color="#059669" />
            <Text style={styles.eyebrowText}>Professional Career Infrastructure</Text>
          </View>

          <Text style={styles.heroHeadline}>
            Optimize Your Resume.{'\n'}
            Match More Jobs.{'\n'}
            <Text style={styles.heroHeadlineAccent}>Get Interview-Ready.</Text>
          </Text>

          <Text style={styles.heroSubheadline}>
            Upload your resume, paste a target job description, and get an AI-powered ATS analysis, keyword gap report, and actionable improvements in minutes.
          </Text>

          {/* Dual Action CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => router.push('/cv-linkedin-optimize/resume-analyzer' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryCtaText}>Analyze My Resume</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCtaBtn}
              onPress={() => router.push('/cv-linkedin-optimize/resume-builder' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryCtaText}>Build from Scratch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trustMicrocopyRow}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.trustMicrocopyText}>
              Zero fabricated claims • 3 free checks every 5 hours • No credit card required
            </Text>
          </View>

          {/* 2. Interactive Product Preview: ATS Dashboard Card */}
          <View style={styles.previewCardWrap}>
            <View style={styles.previewCardHeader}>
              <View style={styles.previewHeaderLeft}>
                <View style={styles.windowDotRed} />
                <View style={styles.windowDotYellow} />
                <View style={styles.windowDotGreen} />
                <Text style={styles.previewCardTitle}>Live ATS Analysis Report — Director of Operations</Text>
              </View>
              <View style={styles.previewScorePill}>
                <Text style={styles.previewScoreLabel}>Platform Analysis Score</Text>
                <Text style={styles.previewScoreNum}>84/100</Text>
              </View>
            </View>

            <View style={styles.previewCardBody}>
              {/* Score Breakdown Bars */}
              <View style={styles.scoreBarsGrid}>
                {[
                  { label: 'Formatting', score: 92, color: '#059669' },
                  { label: 'Keyword Match', score: 78, color: '#D97706' },
                  { label: 'Skills Match', score: 85, color: '#059669' },
                  { label: 'Experience Relevance', score: 80, color: '#059669' },
                  { label: 'Content Quality', score: 84, color: '#059669' },
                  { label: 'Readability', score: 90, color: '#059669' },
                ].map((cat) => (
                  <View key={cat.label} style={styles.scoreBarCol}>
                    <View style={styles.scoreBarHeader}>
                      <Text style={styles.scoreBarLabel}>{cat.label}</Text>
                      <Text style={styles.scoreBarVal}>{cat.score}%</Text>
                    </View>
                    <View style={styles.scoreBarTrack}>
                      <View style={[styles.scoreBarFill, { width: `${cat.score}%`, backgroundColor: cat.color }]} />
                    </View>
                  </View>
                ))}
              </View>

              {/* Keyword Audit Mini View */}
              <View style={styles.keywordAuditRow}>
                <View style={styles.keywordCol}>
                  <View style={styles.keywordColHeader}>
                    <CheckCircle2 size={14} color="#059669" />
                    <Text style={styles.keywordColTitle}>Matched Keywords (12)</Text>
                  </View>
                  <View style={styles.tagsWrap}>
                    {['SLA Optimization', 'Cross-Functional Leadership', 'Operations Management', 'Process Automation'].map(tag => (
                      <View key={tag} style={styles.matchedTag}>
                        <Text style={styles.matchedTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.keywordCol}>
                  <View style={styles.keywordColHeader}>
                    <AlertCircle size={14} color="#DC2626" />
                    <Text style={styles.keywordColTitle}>Missing Target Keywords (3)</Text>
                  </View>
                  <View style={styles.tagsWrap}>
                    {['Enterprise Budgeting', 'Vendor Governance', 'Root Cause Analysis'].map(tag => (
                      <View key={tag} style={styles.missingTag}>
                        <Text style={styles.missingTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Core Features Grid */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Comprehensive Suite</Text>
            <Text style={styles.sectionTitle}>Built for Serious Job Applications</Text>
            <Text style={styles.sectionSubtitle}>
              Every module is designed to eliminate recruiter friction, elevate verifiable achievements, and ensure your credentials are represented accurately.
            </Text>
          </View>

          <View style={styles.featuresGrid}>
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.title} style={styles.featureCard}>
                  <View style={styles.featureTopRow}>
                    <View style={styles.featureIconWrap}>
                      <Icon size={20} color="#111111" />
                    </View>
                    <View style={styles.featureBadge}>
                      <Text style={styles.featureBadgeText}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                  <TouchableOpacity
                    style={styles.featureLinkRow}
                    onPress={() => router.push(item.path as any)}
                  >
                    <Text style={styles.featureLinkText}>{item.cta}</Text>
                    <ArrowRight size={14} color="#059669" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 4. "How It Works" 3-Step Section */}
      <View style={[styles.sectionWrap, styles.sectionLight]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Simple 3-Step Process</Text>
            <Text style={styles.sectionTitle}>From Raw Draft to Interview-Ready</Text>
          </View>

          <View style={styles.stepsGrid}>
            {[
              {
                step: '01',
                title: 'Upload Your Resume',
                desc: 'Upload your PDF, DOCX, or paste plain text. Our parser extracts experience, education, and skills hierarchy safely without formatting distortion.'
              },
              {
                step: '02',
                title: 'Add Target Job Description',
                desc: 'Paste the posting for your desired position. The engine audits keyword density, seniority requirements, and domain competencies.'
              },
              {
                step: '03',
                title: 'Analyze, Humanize & Export',
                desc: 'Review your score breakdown, accept tailored bullet enhancements, remove robotic AI clichés, and download ATS-ready vector documents.'
              }
            ].map((st) => (
              <View key={st.step} style={styles.stepCard}>
                <Text style={styles.stepNum}>{st.step}</Text>
                <Text style={styles.stepTitle}>{st.title}</Text>
                <Text style={styles.stepDesc}>{st.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 5. Differentiator: Humanize Showcase */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionInner}>
          <View style={styles.humanizeBox}>
            <View style={styles.humanizeHeader}>
              <View>
                <View style={styles.humanizeEyebrow}>
                  <Cpu size={14} color="#059669" />
                  <Text style={styles.humanizeEyebrowText}>Built-in AI Humanizer</Text>
                </View>
                <Text style={styles.humanizeTitle}>Eliminate Robotic Clichés Before Recruiters Spot Them</Text>
                <Text style={styles.humanizeSub}>
                  Recruiters discard resumes filled with robotic buzzwords. Our humanizer highlights generic phrasing and restores authentic professional language.
                </Text>
              </View>
            </View>

            <View style={styles.humanizeComparisonRow}>
              {/* Original */}
              <View style={styles.comparisonCol}>
                <View style={styles.comparisonColHead}>
                  <Text style={styles.comparisonLabelRed}>Original (AI Cliché Detected)</Text>
                </View>
                <View style={styles.comparisonTextBox}>
                  <Text style={styles.comparisonOriginalText}>
                    "Spearheaded and orchestrated dynamic cross-functional synergies to synergistically leverage operational paradigms."
                  </Text>
                  <View style={styles.buzzwordBadgeList}>
                    <Text style={styles.buzzwordFlag}>Found: "spearheaded", "orchestrated", "synergies", "leverage"</Text>
                  </View>
                </View>
              </View>

              {/* Improved */}
              <View style={styles.comparisonCol}>
                <View style={styles.comparisonColHead}>
                  <Text style={styles.comparisonLabelGreen}>Humanized (Authentic & Direct)</Text>
                  <TouchableOpacity
                    style={[styles.acceptToggleBtn, humanizeAccepted && styles.acceptToggleBtnActive]}
                    onPress={() => setHumanizeAccepted(!humanizeAccepted)}
                  >
                    <Check size={12} color={humanizeAccepted ? '#FFFFFF' : '#059669'} />
                    <Text style={[styles.acceptToggleText, humanizeAccepted && styles.acceptToggleTextActive]}>
                      {humanizeAccepted ? 'Accepted' : 'Accept Improvement'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.comparisonTextBox}>
                  <Text style={styles.comparisonImprovedText}>
                    "Led cross-departmental operations to standardize delivery workflows, reducing turnaround bottlenecks by 32%."
                  </Text>
                  <View style={styles.benefitNote}>
                    <ShieldCheck size={14} color="#059669" />
                    <Text style={styles.benefitNoteText}>Retains verified truth while communicating clear active ownership.</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 6. Core Ethical Principle Callout */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionInner}>
          <View style={styles.principleCard}>
            <View style={styles.principleIconWrap}>
              <ShieldCheck size={28} color="#059669" />
            </View>
            <Text style={styles.principleTitle}>Our Commitment: Optimize Facts. Never Invent Them.</Text>
            <Text style={styles.principleBody}>
              Many AI resume tools generate hallucinated titles, fabricated metrics, or degrees you never earned. Sheriyakam Career strictly adheres to anti-fabrication standards. If an accomplishment lacks a measurable metric, we prompt you to add your own data—we never invent it for you.
            </Text>
          </View>
        </View>
      </View>

      {/* 7. Genuine FAQ Section */}
      <View style={[styles.sectionWrap, styles.sectionLight]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Common Questions</Text>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <TouchableOpacity
                  key={faq.q}
                  style={styles.faqItem}
                  onPress={() => setActiveFaq(isOpen ? null : idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    {isOpen ? <ChevronUp size={18} color="#111111" /> : <ChevronDown size={18} color="#888888" />}
                  </View>
                  {isOpen && (
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 8. Final CTA Section */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionInner}>
          <View style={styles.finalCtaBox}>
            <Text style={styles.finalCtaTitle}>Ready to Land More Interviews?</Text>
            <Text style={styles.finalCtaSubtitle}>
              Test your resume against target job requirements in under 60 seconds. Get actionable suggestions without inventing false experience.
            </Text>
            <TouchableOpacity
              style={styles.finalCtaBtn}
              onPress={() => router.push('/cv-linkedin-optimize/resume-analyzer' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.finalCtaBtnText}>Start Free ATS Analysis</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.finalCtaMicro}>5 free checks every 5 hours • No credit card required</Text>
          </View>
        </View>
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  heroInner: {
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  eyebrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  eyebrowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  heroHeadline: {
    fontSize: Platform.OS === 'web' ? 48 : 32,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1,
    lineHeight: Platform.OS === 'web' ? 56 : 38,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroHeadlineAccent: {
    color: '#059669',
  },
  heroSubheadline: {
    fontSize: 16,
    color: '#555555',
    maxWidth: 680,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
  },
  ctaRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    width: Platform.OS === 'web' ? 'auto' : '100%',
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    width: Platform.OS === 'web' ? 'auto' : '100%',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryCtaBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4D4D8',
    backgroundColor: '#FFFFFF',
    width: Platform.OS === 'web' ? 'auto' : '100%',
    alignItems: 'center',
  },
  secondaryCtaText: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '600',
  },
  trustMicrocopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 40,
  },
  trustMicrocopyText: {
    fontSize: 12,
    color: '#666666',
  },
  previewCardWrap: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  previewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  windowDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' },
  windowDotYellow: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F59E0B' },
  windowDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  previewCardTitle: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  previewScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  previewScoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  previewScoreNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  previewCardBody: {
    padding: 24,
    gap: 20,
  },
  scoreBarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  scoreBarCol: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    minWidth: Platform.OS === 'web' ? 150 : '47%',
  },
  scoreBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scoreBarLabel: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '500',
  },
  scoreBarVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
  },
  scoreBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: 6,
    borderRadius: 3,
  },
  keywordAuditRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  keywordCol: {
    flex: 1,
    gap: 10,
  },
  keywordColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  keywordColTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchedTag: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchedTagText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  missingTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  missingTagText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },
  sectionWrap: {
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  sectionLight: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionInner: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 44,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#555555',
    maxWidth: 600,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  featureCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#52525B',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  stepsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepNum: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  humanizeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 28,
  },
  humanizeHeader: {
    marginBottom: 24,
  },
  humanizeEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  humanizeEyebrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  humanizeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  humanizeSub: {
    fontSize: 14,
    color: '#64748B',
    maxWidth: 700,
    lineHeight: 20,
  },
  humanizeComparisonRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
  },
  comparisonCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  comparisonColHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonLabelRed: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  comparisonLabelGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  comparisonTextBox: {
    gap: 10,
  },
  comparisonOriginalText: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  comparisonImprovedText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    lineHeight: 19,
  },
  buzzwordBadgeList: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  buzzwordFlag: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '500',
  },
  benefitNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  benefitNoteText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  acceptToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  acceptToggleBtnActive: {
    backgroundColor: '#059669',
  },
  acceptToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  acceptToggleTextActive: {
    color: '#FFFFFF',
  },
  principleCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    textAlign: 'center',
  },
  principleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  principleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  principleBody: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    maxWidth: 720,
    textAlign: 'center',
  },
  faqList: {
    gap: 12,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  finalCtaBox: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    textAlign: 'center',
  },
  finalCtaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  finalCtaSubtitle: {
    fontSize: 15,
    color: '#D1FAE5',
    maxWidth: 600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  finalCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  finalCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  finalCtaMicro: {
    fontSize: 12,
    color: '#A7F3D0',
  },
});
