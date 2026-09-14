import { generateCompletion } from './llm-agent';

export interface AtsScoreResult {
  totalScore: number;
  keywordScore: number;
  structureScore: number;
  clarityScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  suggestions: string[];
}

/**
 * Standardize text tokens for keyword matching
 */
function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Extract text from arbitrary resume object
 */
function extractResumeText(resume: any): string {
  if (typeof resume === 'string') return resume;
  if (!resume || typeof resume !== 'object') return '';

  const chunks: string[] = [];
  if (resume.summary) chunks.push(resume.summary);
  if (Array.isArray(resume.skills)) chunks.push(resume.skills.join(' '));

  if (Array.isArray(resume.experience)) {
    resume.experience.forEach((exp: any) => {
      if (exp.role) chunks.push(exp.role);
      if (exp.company) chunks.push(exp.company);
      if (Array.isArray(exp.bullets)) chunks.push(exp.bullets.join(' '));
      if (typeof exp.description === 'string') chunks.push(exp.description);
    });
  }

  if (Array.isArray(resume.education)) {
    resume.education.forEach((edu: any) => {
      if (edu.degree) chunks.push(edu.degree);
      if (edu.school) chunks.push(edu.school);
    });
  }

  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((proj: any) => {
      if (proj.title) chunks.push(proj.title);
      if (Array.isArray(proj.bullets)) chunks.push(proj.bullets.join(' '));
    });
  }

  return chunks.join('\n');
}

/**
 * Extract target keywords from job description
 */
function extractJobKeywords(jobDescription: any): string[] {
  if (Array.isArray(jobDescription?.extractedKeywords) && jobDescription.extractedKeywords.length > 0) {
    return jobDescription.extractedKeywords;
  }

  const raw = typeof jobDescription === 'string' ? jobDescription : jobDescription?.rawText || '';
  if (!raw) return ['Communication', 'Leadership', 'Problem Solving', 'Project Management'];

  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'you', 'will', 'are', 'this', 'that', 'have',
    'from', 'our', 'all', 'your', 'about', 'must', 'should', 'work', 'team'
  ]);

  const words = raw
    .split(/[\s,.;:()/\-]+/)
    .map(normalizeWord)
    .filter((w: string) => w.length > 3 && !stopWords.has(w));

  const counts = new Map<string, number>();
  words.forEach((w: string) => counts.set(w, (counts.get(w) || 0) + 1));

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  return sorted.length > 0 ? sorted : ['Operations', 'Management', 'Strategy', 'Execution'];
}

/**
 * Deterministic + Qualitative ATS Scoring Engine
 */
export async function calculateAtsScore(
  baseResume: any,
  jobDescription: any,
  useQualitativeLlm = false
): Promise<AtsScoreResult> {
  const resumeText = extractResumeText(baseResume);
  const normalizedResume = resumeText.toLowerCase();
  const targetKeywords = extractJobKeywords(jobDescription);

  // 1. Keyword Matching (40% Weight)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach((kw) => {
    const norm = kw.toLowerCase().trim();
    if (normalizedResume.includes(norm)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordScore = targetKeywords.length > 0
    ? Math.round((matchedKeywords.length / targetKeywords.length) * 100)
    : 75;

  // 2. Section Structure Audit (30% Weight)
  const formattingIssues: string[] = [];
  let structurePoints = 100;

  const hasSummary = !!(baseResume?.summary || normalizedResume.includes('summary') || normalizedResume.includes('profile'));
  const hasExperience = Array.isArray(baseResume?.experience) && baseResume.experience.length > 0;
  const hasSkills = Array.isArray(baseResume?.skills) && baseResume.skills.length > 0;
  const hasEducation = Array.isArray(baseResume?.education) && baseResume.education.length > 0;

  if (!hasSummary) {
    structurePoints -= 15;
    formattingIssues.push('Missing professional summary or executive hook.');
  }
  if (!hasExperience) {
    structurePoints -= 35;
    formattingIssues.push('No parsed experience blocks found.');
  }
  if (!hasSkills) {
    structurePoints -= 25;
    formattingIssues.push('Skills section is missing or unformatted.');
  }
  if (!hasEducation) {
    structurePoints -= 15;
    formattingIssues.push('Education background not detected.');
  }

  const structureScore = Math.max(20, structurePoints);

  // 3. Impact & Clarity (30% Weight)
  let clarityScore = 70;
  const metricMatches = (resumeText.match(/\b\d+([.,]\d+)?(%|\$|x|k|m)?\b/gi) || []).length;
  if (metricMatches >= 5) clarityScore += 20;
  else if (metricMatches >= 2) clarityScore += 10;
  else {
    formattingIssues.push('Low density of quantifiable metrics (e.g. %, $ saved, KPI improvement).');
  }

  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Naturally incorporate verified experience touching: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }
  if (metricMatches < 4) {
    suggestions.push('Add specific figures or percentages to highlight measurable outcomes.');
  }
  suggestions.push('Ensure section headers use standardized terms (Experience, Skills, Education) for legacy ATS parsers.');

  if (useQualitativeLlm) {
    try {
      const fastResult = await generateCompletion({
        providerPreference: 'fast',
        maxTokens: 300,
        prompt: `Evaluate this resume against target job for ATS suitability.
Resume Snippet: ${resumeText.slice(0, 1000)}
Keywords: ${targetKeywords.join(', ')}
Return strictly JSON: { "clarityScore": 85, "additionalSuggestion": "..." }`,
        schema: { type: 'object' }
      });
      if (fastResult.data?.clarityScore) {
        clarityScore = Math.min(100, Math.max(30, Number(fastResult.data.clarityScore)));
      }
      if (fastResult.data?.additionalSuggestion) {
        suggestions.unshift(fastResult.data.additionalSuggestion);
      }
    } catch (e) {
      // Fallback silently to deterministic clarity score
    }
  }

  const totalScore = Math.min(99, Math.round(
    keywordScore * 0.40 +
    structureScore * 0.30 +
    clarityScore * 0.30
  ));

  return {
    totalScore,
    keywordScore,
    structureScore,
    clarityScore,
    matchedKeywords,
    missingKeywords,
    formattingIssues,
    suggestions
  };
}
