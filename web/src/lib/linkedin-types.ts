/**
 * linkedin-types.ts
 * 
 * Production Types for Recruiter-Style LinkedIn Analysis Engine
 */

export interface ExperienceItem {
  id?: string;
  company: string;
  title: string;
  dates: string;
  location?: string;
  description?: string;
  bullets?: string[];
  achievements?: string[];
  metricsFound?: string[];
}

export interface EducationItem {
  school: string;
  degree?: string;
  field?: string;
  year?: string;
}

export interface CertificationItem {
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
}

export interface NormalizedLinkedInProfile {
  fullName: string;
  headline: string;
  about: string;
  location: string;
  profileUrl?: string;
  targetRole: string;
  targetMarket: string;
  yearsExperience: number;
  achievements: string[];
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: string[];
  jobDescription?: string;
  parsingConfidence: number; // 0 to 100
  parsingIssues: string[];
}

export interface CheckItemResult {
  checkName: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  scoreImpact: number;
}

export interface DimensionScoreResult {
  dimension: 'headline' | 'about' | 'experience' | 'skills' | 'keywords' | 'completeness' | 'positioning';
  label: string;
  score: number;
  maxScore: number;
  checks: CheckItemResult[];
  issues: string[];
  strengths: string[];
  suggestions: string[];
}

export interface PriorityFixItem {
  rank: number; // 1, 2, 3
  problem: string;
  evidence: string;
  recommendedAction: string;
  expectedScoreContribution: string; // e.g. "+6 to +8 pts potential improvement"
}

export interface KeywordGapItem {
  keyword: string;
  status: 'FOUND' | 'PARTIAL' | 'MISSING' | 'VERIFY';
  importance: 'critical' | 'high' | 'standard';
  whyItMatters: string;
  whereItCouldNaturallyAppear: string;
  userGuidance: string; // e.g. "Add only if you genuinely have this skill/experience"
}

export interface JobMatchBreakdown {
  matchPercentage: number;
  titleMatch: { score: number; details: string };
  skillsMatch: { score: number; matched: string[]; missing: string[] };
  keywordsMatch: { score: number; matched: string[]; missing: string[] };
  experienceMatch: { score: number; details: string };
  responsibilityMatch: { score: number; details: string };
  educationMatch: { score: number; details: string };
  label: string; // "Platform Match Analysis"
}

export interface UnsupportedClaimDetection {
  claimText: string;
  reason: string;
  suggestedFix: string;
}

export interface RewriteItem {
  id: string;
  section: 'headline' | 'about' | 'experience';
  currentText: string;
  proposedText: string;
  whyExplanation: string;
  status: 'pending' | 'accepted' | 'edited' | 'rejected';
  hasUnsupportedClaims: boolean;
  unsupportedClaims: UnsupportedClaimDetection[];
}

export interface ContentIdeaItem {
  topic: string;
  hook: string;
  whyItSupportsPositioning: string;
  suggestedStructure: string[];
}

export interface RecommendationTemplateItem {
  audience: 'manager' | 'colleague' | 'client' | 'mentor';
  audienceLabel: string;
  templateMessage: string;
  contextGuidance: string;
}

export interface FullLinkedInAnalysisResult {
  overallScore: number; // Deterministic 0-100
  dimensionScores: {
    headline: DimensionScoreResult;
    about: DimensionScoreResult;
    experience: DimensionScoreResult;
    skills: DimensionScoreResult;
    keywords: DimensionScoreResult;
    completeness: DimensionScoreResult;
    positioning: DimensionScoreResult;
  };
  firstImpression: string;
  strengths: string[];
  criticalIssues: string[];
  priorityFixes: PriorityFixItem[];
  headlineReplacements: Array<{
    headline: string;
    charCount: number;
    valueProposition: string;
    styleTag: string;
  }>;
  aboutRewrite: {
    current: string;
    problemsDetected: string[];
    improvedVersion: string;
    metricsToProvide: string[];
  };
  experienceRewrites: Array<{
    roleId?: string;
    company: string;
    title: string;
    originalBullets: string[];
    improvedCarBullets: Array<{
      challengeAction: string;
      resultMetric: string;
      fullBullet: string;
      needsMetric: boolean;
    }>;
  }>;
  skillsAnalysis: {
    topExistingSkills: string[];
    missingTargetSkills: string[];
    potentiallyRelevantSkills: string[];
    lowRelevanceSkills: string[];
    top3ToFeature: string[];
    top10ForTargetRole: string[];
  };
  keywordGapAnalysis: KeywordGapItem[];
  jobMatch?: JobMatchBreakdown;
  positioning: {
    currentPositioning: string;
    targetPositioning: string;
    positioningGap: string;
    groundedPositioningStatement: string;
  };
  profileChecklist: {
    photo: { status: 'Visual review required'; checklist: string[] };
    banner: { status: 'Visual review required'; checklist: string[]; suggestedText: string };
    featured: { checklist: string[] };
    customUrl: { currentUrl?: string; isCustom: boolean; checklist: string[] };
    contactInfo: { checklist: string[] };
  };
  contentIdeas: ContentIdeaItem[];
  recommendationTemplates: RecommendationTemplateItem[];
}
