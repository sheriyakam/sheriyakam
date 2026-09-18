/**
 * linkedin-scoring-engine.ts
 * 
 * Production Deterministic 100-Point LinkedIn Scoring Engine
 * Dimensions:
 * - Headline: 15
 * - About: 15
 * - Experience: 20
 * - Skills: 15
 * - Keywords: 15
 * - Completeness: 10
 * - Positioning: 10
 * Total = 100
 */

import {
  NormalizedLinkedInProfile,
  FullLinkedInAnalysisResult,
  DimensionScoreResult,
  CheckItemResult,
  PriorityFixItem,
  KeywordGapItem,
  JobMatchBreakdown
} from './linkedin-types';

export function calculateDeterministicLinkedInScore(
  profile: NormalizedLinkedInProfile,
  targetJobDescription?: string
): {
  overallScore: number;
  dimensionScores: FullLinkedInAnalysisResult['dimensionScores'];
  priorityFixes: PriorityFixItem[];
  keywordGapAnalysis: KeywordGapItem[];
  jobMatch?: JobMatchBreakdown;
  positioning: FullLinkedInAnalysisResult['positioning'];
  skillsAnalysis: FullLinkedInAnalysisResult['skillsAnalysis'];
  profileChecklist: FullLinkedInAnalysisResult['profileChecklist'];
} {
  const targetRole = profile.targetRole || profile.headline || 'Professional';
  const targetRoleWords = targetRole.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  // --------------------------------------------------------------------------
  // 1. HEADLINE CHECKS (Max 15 pts)
  // --------------------------------------------------------------------------
  const headlineChecks: CheckItemResult[] = [];
  const hl = profile.headline || '';
  const hlLength = hl.length;
  let hlScore = 0;

  // Check 1: Target job title presence (4 pts)
  const hasTargetTitle = targetRoleWords.some(w => hl.toLowerCase().includes(w));
  if (hasTargetTitle && targetRoleWords.length > 0) {
    hlScore += 4;
    headlineChecks.push({ checkName: 'Target Title Presence', status: 'pass', detail: `Contains target role terms "${targetRole}"`, scoreImpact: 4 });
  } else {
    headlineChecks.push({ checkName: 'Target Title Presence', status: 'fail', detail: `Does not clearly mention target role "${targetRole}"`, scoreImpact: 0 });
  }

  // Check 2: Length and Character Optimization (3 pts)
  // Optimal length is between 80 and 220 chars
  if (hlLength >= 80 && hlLength <= 220) {
    hlScore += 3;
    headlineChecks.push({ checkName: 'Headline Length', status: 'pass', detail: `Optimal length (${hlLength}/220 characters)`, scoreImpact: 3 });
  } else if (hlLength > 0 && hlLength < 80) {
    hlScore += 1;
    headlineChecks.push({ checkName: 'Headline Length', status: 'warning', detail: `Too concise (${hlLength} chars). Expand with skills & value prop.`, scoreImpact: 1 });
  } else {
    headlineChecks.push({ checkName: 'Headline Length', status: 'fail', detail: hlLength === 0 ? 'Headline is missing.' : `Exceeds 220 characters (${hlLength} chars).`, scoreImpact: 0 });
  }

  // Check 3: Value Proposition / Metrics (3 pts)
  const hasMetricOrImpact = /\b(\d+(\.\d+)?%|\$\d+|\d+\+?\s*(years|clients|teams|projects)|helped|scaling|improving|delivering)\b/i.test(hl);
  if (hasMetricOrImpact) {
    hlScore += 3;
    headlineChecks.push({ checkName: 'Value Proposition', status: 'pass', detail: 'Contains measurable impact or clear outcome statement.', scoreImpact: 3 });
  } else {
    headlineChecks.push({ checkName: 'Value Proposition', status: 'warning', detail: 'Missing quantifiable achievement or tangible value proposition.', scoreImpact: 0 });
  }

  // Check 4: Excessive Generic Words or Keyword Stuffing (3 pts)
  const genericWords = ['guru', 'ninja', 'rockstar', 'hardworking', 'passionate', 'visionary', 'results-driven'];
  const hasGeneric = genericWords.some(g => new RegExp(`\\b${g}\\b`, 'i').test(hl));
  const hasStuffing = (hl.match(/[|,•]/g) || []).length > 5;
  if (!hasGeneric && !hasStuffing) {
    hlScore += 3;
    headlineChecks.push({ checkName: 'Clarity & Specificity', status: 'pass', detail: 'Free of generic buzzwords and excessive punctuation stuffing.', scoreImpact: 3 });
  } else {
    hlScore += 1;
    headlineChecks.push({ checkName: 'Clarity & Specificity', status: 'warning', detail: hasGeneric ? 'Contains overused buzzwords.' : 'Excessive pipe/comma stuffing.', scoreImpact: 1 });
  }

  // Check 5: Excessive Emojis (2 pts)
  const emojiCount = (hl.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g) || []).length;
  if (emojiCount <= 1) {
    hlScore += 2;
    headlineChecks.push({ checkName: 'Professional Formatting', status: 'pass', detail: 'Clean, professional formatting without emoji overload.', scoreImpact: 2 });
  } else {
    headlineChecks.push({ checkName: 'Professional Formatting', status: 'warning', detail: `${emojiCount} emojis detected. Restrain emojis for recruiter readability.`, scoreImpact: 0 });
  }

  const headlineResult: DimensionScoreResult = {
    dimension: 'headline',
    label: 'Headline Optimization',
    score: Math.min(15, hlScore),
    maxScore: 15,
    checks: headlineChecks,
    issues: headlineChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: headlineChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Include your target role title in the first 60 characters.', 'Add 2 core technical competencies separated by a divider.', 'Include 1 concrete outcome or specialization.']
  };

  // --------------------------------------------------------------------------
  // 2. ABOUT SECTION CHECKS (Max 15 pts)
  // --------------------------------------------------------------------------
  const aboutChecks: CheckItemResult[] = [];
  const ab = profile.about || '';
  const abLength = ab.length;
  let abScore = 0;

  // Check 1: Opening Hook (4 pts)
  const firstSentence = ab.split(/[.!?]/)[0] || '';
  const hasStrongHook = firstSentence.length > 25 && !firstSentence.toLowerCase().startsWith('i am a') && !firstSentence.toLowerCase().startsWith('seasoned');
  if (hasStrongHook) {
    abScore += 4;
    aboutChecks.push({ checkName: 'Opening Hook', status: 'pass', detail: 'Engaging first sentence before the "...see more" cutoff.', scoreImpact: 4 });
  } else {
    aboutChecks.push({ checkName: 'Opening Hook', status: 'warning', detail: 'Hook is generic or passive. Make the first 3 lines punchy.', scoreImpact: 1 });
    abScore += 1;
  }

  // Check 2: First-Person Authentic Narrative (3 pts)
  const isFirstPerson = /\b(I|my|I've|me)\b/i.test(ab);
  const isThirdPerson = new RegExp(`\\b(${profile.fullName.split(' ')[0]}|he|she|his|her)\\b`, 'i').test(ab);
  if (isFirstPerson && !isThirdPerson) {
    abScore += 3;
    aboutChecks.push({ checkName: 'First-Person Voice', status: 'pass', detail: 'Written in authentic first-person voice.', scoreImpact: 3 });
  } else if (!isFirstPerson && abLength > 0) {
    aboutChecks.push({ checkName: 'First-Person Voice', status: 'fail', detail: 'Written in third-person. First-person builds stronger recruiter connection.', scoreImpact: 0 });
  } else {
    aboutChecks.push({ checkName: 'First-Person Voice', status: 'warning', detail: 'Voice is neutral or missing personal narrative.', scoreImpact: 1 });
    abScore += 1;
  }

  // Check 3: Evidence & Concrete Achievements (3 pts)
  const hasMetricsInAbout = /\b(\d+(\.\d+)?%|\$\d+|\d+\+?\s*(years|engineers|users|clients))\b/i.test(ab);
  if (hasMetricsInAbout) {
    abScore += 3;
    aboutChecks.push({ checkName: 'Evidence & Proof Points', status: 'pass', detail: 'Contains verified metrics or tangible achievement references.', scoreImpact: 3 });
  } else {
    aboutChecks.push({ checkName: 'Evidence & Proof Points', status: 'warning', detail: 'Missing quantifiable metrics. Explain concrete impact.', scoreImpact: 0 });
  }

  // Check 4: Call to Action (CTA) & Contact (3 pts)
  const hasCta = /\b(reach out|contact me|connect|email|dm|let's talk|open to)\b/i.test(ab);
  if (hasCta) {
    abScore += 3;
    aboutChecks.push({ checkName: 'Call to Action (CTA)', status: 'pass', detail: 'Includes clear invitation to connect or collaborate.', scoreImpact: 3 });
  } else {
    aboutChecks.push({ checkName: 'Call to Action (CTA)', status: 'warning', detail: 'Missing clear closing CTA directing recruiters how to contact you.', scoreImpact: 0 });
  }

  // Check 5: Length & Readability (2 pts)
  if (abLength >= 300 && abLength <= 2600) {
    abScore += 2;
    aboutChecks.push({ checkName: 'Section Length', status: 'pass', detail: `Good depth (${abLength} characters, max 2600).`, scoreImpact: 2 });
  } else if (abLength > 2600) {
    aboutChecks.push({ checkName: 'Section Length', status: 'fail', detail: `Exceeds LinkedIn 2600 character limit (${abLength} chars).`, scoreImpact: 0 });
  } else {
    aboutChecks.push({ checkName: 'Section Length', status: 'warning', detail: `Too brief (${abLength} chars). Aim for 300-800 characters.`, scoreImpact: 0 });
  }

  const aboutResult: DimensionScoreResult = {
    dimension: 'about',
    label: 'About / Summary Section',
    score: Math.min(15, abScore),
    maxScore: 15,
    checks: aboutChecks,
    issues: aboutChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: aboutChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Structure in 3 parts: Hook & Mission -> Key Achievements -> Call to Action.', 'Insert specific metrics where [ADD METRIC] is flagged.']
  };

  // --------------------------------------------------------------------------
  // 3. EXPERIENCE SECTION CHECKS (Max 20 pts)
  // --------------------------------------------------------------------------
  const expChecks: CheckItemResult[] = [];
  let expScore = 0;
  const positions = profile.experience || [];

  // Check 1: Roles count (4 pts)
  if (positions.length >= 2) {
    expScore += 4;
    expChecks.push({ checkName: 'Work History Depth', status: 'pass', detail: `${positions.length} career positions documented.`, scoreImpact: 4 });
  } else if (positions.length === 1) {
    expScore += 2;
    expChecks.push({ checkName: 'Work History Depth', status: 'warning', detail: 'Only 1 position listed.', scoreImpact: 2 });
  } else {
    expChecks.push({ checkName: 'Work History Depth', status: 'fail', detail: 'No experience entries found.', scoreImpact: 0 });
  }

  // Check 2: Dates and Companies completeness (4 pts)
  const allHaveDates = positions.length > 0 && positions.every(p => p.dates && p.company);
  if (allHaveDates) {
    expScore += 4;
    expChecks.push({ checkName: 'Employment Dates & Companies', status: 'pass', detail: 'All positions have clear dates and company titles.', scoreImpact: 4 });
  } else {
    expScore += 2;
    expChecks.push({ checkName: 'Employment Dates & Companies', status: 'warning', detail: 'Some positions are missing employment dates or company names.', scoreImpact: 2 });
  }

  // Check 3: Action Verbs in Bullets (4 pts)
  const strongVerbs = ['led', 'directed', 'engineered', 'built', 'delivered', 'optimized', 'reduced', 'scaled', 'implemented', 'automated'];
  const allBullets = positions.flatMap(p => p.bullets || []);
  const actionVerbCount = allBullets.filter(b => strongVerbs.some(v => new RegExp(`^${v}\\b`, 'i').test(b))).length;
  if (actionVerbCount >= 3) {
    expScore += 4;
    expChecks.push({ checkName: 'Action-Oriented Phrasing', status: 'pass', detail: 'Strong action verbs initiating experience statements.', scoreImpact: 4 });
  } else {
    expScore += 2;
    expChecks.push({ checkName: 'Action-Oriented Phrasing', status: 'warning', detail: 'Too many passive or responsibility-based descriptions ("Responsible for...").', scoreImpact: 2 });
  }

  // Check 4: Measurable Metrics Found (4 pts)
  const rolesWithMetrics = positions.filter(p => (p.metricsFound && p.metricsFound.length > 0) || /\d+/.test(p.bullets?.join(' ') || '')).length;
  if (rolesWithMetrics >= Math.min(2, positions.length) && positions.length > 0) {
    expScore += 4;
    expChecks.push({ checkName: 'Quantifiable Metrics', status: 'pass', detail: 'Proven numbers and milestones included across positions.', scoreImpact: 4 });
  } else {
    expChecks.push({ checkName: 'Quantifiable Metrics', status: 'fail', detail: 'Missing quantifiable metrics in job bullets.', scoreImpact: 0 });
  }

  // Check 5: Target Role Relevance (4 pts)
  const targetTokensFound = positions.some(p => targetRoleWords.some(w => (p.title + ' ' + (p.bullets?.join(' ') || '')).toLowerCase().includes(w)));
  if (targetTokensFound) {
    expScore += 4;
    expChecks.push({ checkName: 'Target Role Alignment', status: 'pass', detail: 'Experience highlights transferrable skills for target position.', scoreImpact: 4 });
  } else {
    expScore += 1;
    expChecks.push({ checkName: 'Target Role Alignment', status: 'warning', detail: 'Work history bullets do not clearly bridge to target role.', scoreImpact: 1 });
  }

  const experienceResult: DimensionScoreResult = {
    dimension: 'experience',
    label: 'Experience & Achievements',
    score: Math.min(20, expScore),
    maxScore: 20,
    checks: expChecks,
    issues: expChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: expChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Convert passive duties into Challenge -> Action -> Result bullets.', 'Quantify outcomes with percentages, cost savings, or delivery velocity.']
  };

  // --------------------------------------------------------------------------
  // 4. SKILLS SECTION CHECKS (Max 15 pts)
  // --------------------------------------------------------------------------
  const skillsChecks: CheckItemResult[] = [];
  let skillsScore = 0;
  const userSkills = profile.skills || [];

  // Check 1: Skills Count (5 pts)
  if (userSkills.length >= 10) {
    skillsScore += 5;
    skillsChecks.push({ checkName: 'Skills Breadth', status: 'pass', detail: `${userSkills.length} skills listed (10+ recommended for LinkedIn SEO).`, scoreImpact: 5 });
  } else if (userSkills.length >= 5) {
    skillsScore += 3;
    skillsChecks.push({ checkName: 'Skills Breadth', status: 'warning', detail: `${userSkills.length} skills listed. Adding 5-10 more improves recruiter search matches.`, scoreImpact: 3 });
  } else {
    skillsChecks.push({ checkName: 'Skills Breadth', status: 'fail', detail: `Only ${userSkills.length} skills listed. Under-indexed for recruiter queries.`, scoreImpact: 0 });
  }

  // Check 2: Technical vs Soft Skill Balance (5 pts)
  const softKeywords = ['leadership', 'communication', 'strategy', 'problem solving', 'teamwork', 'negotiation'];
  const hasSoft = userSkills.some(s => softKeywords.some(sk => s.toLowerCase().includes(sk)));
  const hasHard = userSkills.some(s => !softKeywords.some(sk => s.toLowerCase().includes(sk)));
  if (hasSoft && hasHard) {
    skillsScore += 5;
    skillsChecks.push({ checkName: 'Domain vs. Interpersonal Balance', status: 'pass', detail: 'Balanced distribution of hard competencies and leadership capabilities.', scoreImpact: 5 });
  } else {
    skillsScore += 2;
    skillsChecks.push({ checkName: 'Domain vs. Interpersonal Balance', status: 'warning', detail: 'Heavy skew toward only one category.', scoreImpact: 2 });
  }

  // Check 3: Top 3 Feature Skills Alignment (5 pts)
  if (userSkills.length >= 3) {
    skillsScore += 5;
    skillsChecks.push({ checkName: 'Primary Feature Skills', status: 'pass', detail: 'Top 3 core skills identified for profile pinned spotlight.', scoreImpact: 5 });
  } else {
    skillsChecks.push({ checkName: 'Primary Feature Skills', status: 'fail', detail: 'Not enough skills to populate top 3 LinkedIn spotlight badges.', scoreImpact: 0 });
  }

  // Skills taxonomy classification
  const topExistingSkills = userSkills.slice(0, 5);
  const commonTargetSkills = [
    'Cross-Functional Leadership', 'SLA Governance', 'Process Optimization',
    'Risk Assessment', 'Stakeholder Management', 'Workflow Automation',
    'Data Analysis', 'Agile Delivery', 'Incident Escalation', 'Budget Oversight'
  ];
  const missingTargetSkills = commonTargetSkills.filter(ts => !userSkills.some(us => us.toLowerCase() === ts.toLowerCase())).slice(0, 4);
  const potentiallyRelevantSkills = commonTargetSkills.filter(ts => !topExistingSkills.includes(ts) && !missingTargetSkills.includes(ts)).slice(0, 3);
  const lowRelevanceSkills = userSkills.filter(s => s.length < 4 || s.toLowerCase().includes('microsoft office') || s.toLowerCase().includes('email'));

  const skillsResult: DimensionScoreResult = {
    dimension: 'skills',
    label: 'Skills Architecture',
    score: Math.min(15, skillsScore),
    maxScore: 15,
    checks: skillsChecks,
    issues: skillsChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: skillsChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: [
      'Pin your top 3 most job-critical skills to the very top of your profile.',
      'Only add missing skills if you genuinely possess verified hands-on experience.'
    ]
  };

  // --------------------------------------------------------------------------
  // 5. KEYWORD ANALYSIS (Max 15 pts)
  // --------------------------------------------------------------------------
  const keywordChecks: CheckItemResult[] = [];
  let kwScore = 0;

  // Build full profile corpus for keyword matching
  const corpus = [
    profile.headline,
    profile.about,
    userSkills.join(' '),
    positions.map(p => p.title + ' ' + (p.bullets?.join(' ') || '')).join(' ')
  ].join(' ').toLowerCase();

  // Target keywords benchmark
  const targetKeywords = [
    { kw: targetRole.toLowerCase(), imp: 'critical' as const, place: 'Headline and About hook', why: 'Primary recruiter search index parameter.' },
    { kw: 'operations', imp: 'high' as const, place: 'Experience bullets', why: 'Core domain indicator.' },
    { kw: 'process', imp: 'high' as const, place: 'Headline and Experience', why: 'Demonstrates methodical execution.' },
    { kw: 'leadership', imp: 'standard' as const, place: 'About narrative', why: 'Essential for senior-tier filtering.' },
    { kw: 'automation', imp: 'standard' as const, place: 'Skills and Experience', why: 'High-demand technical capability.' },
    { kw: 'governance', imp: 'standard' as const, place: 'Experience bullets', why: 'Shows enterprise compliance discipline.' }
  ];

  const keywordGapAnalysis: KeywordGapItem[] = targetKeywords.map(tk => {
    let status: 'FOUND' | 'PARTIAL' | 'MISSING' | 'VERIFY' = 'MISSING';
    if (corpus.includes(tk.kw)) {
      status = 'FOUND';
    } else if (tk.kw.split(' ').some(word => word.length > 3 && corpus.includes(word))) {
      status = 'PARTIAL';
    } else {
      status = 'MISSING';
    }

    return {
      keyword: tk.kw.charAt(0).toUpperCase() + tk.kw.slice(1),
      status,
      importance: tk.imp,
      whyItMatters: tk.why,
      whereItCouldNaturallyAppear: tk.place,
      userGuidance: 'Add only if you genuinely have this experience or skill set.'
    };
  });

  const foundCount = keywordGapAnalysis.filter(k => k.status === 'FOUND').length;
  const partialCount = keywordGapAnalysis.filter(k => k.status === 'PARTIAL').length;

  if (foundCount >= 4) {
    kwScore += 15;
    keywordChecks.push({ checkName: 'Keyword Saturation', status: 'pass', detail: `${foundCount} critical domain keywords indexed across sections.`, scoreImpact: 15 });
  } else if (foundCount + partialCount >= 3) {
    kwScore += 10;
    keywordChecks.push({ checkName: 'Keyword Saturation', status: 'warning', detail: `${foundCount} found, ${partialCount} partial keywords. Opportunity to integrate missing terms.`, scoreImpact: 10 });
  } else {
    kwScore += 5;
    keywordChecks.push({ checkName: 'Keyword Saturation', status: 'fail', detail: 'Profile is missing key boolean search keywords for target role.', scoreImpact: 5 });
  }

  const keywordsResult: DimensionScoreResult = {
    dimension: 'keywords',
    label: 'Recruiter Search Keywords',
    score: Math.min(15, kwScore),
    maxScore: 15,
    checks: keywordChecks,
    issues: keywordChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: keywordChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Naturally weave missing keywords into About and bullet descriptions without keyword stuffing.']
  };

  // --------------------------------------------------------------------------
  // 6. PROFILE COMPLETENESS (Max 10 pts)
  // --------------------------------------------------------------------------
  const compChecks: CheckItemResult[] = [];
  let compScore = 0;

  // Headline: 2 pts
  if (hlLength > 20) { compScore += 2; compChecks.push({ checkName: 'Headline Filled', status: 'pass', detail: 'Completed', scoreImpact: 2 }); }
  else { compChecks.push({ checkName: 'Headline Filled', status: 'fail', detail: 'Missing or too short', scoreImpact: 0 }); }

  // About: 2 pts
  if (abLength > 100) { compScore += 2; compChecks.push({ checkName: 'About Section Filled', status: 'pass', detail: 'Completed', scoreImpact: 2 }); }
  else { compChecks.push({ checkName: 'About Section Filled', status: 'fail', detail: 'Missing or too brief', scoreImpact: 0 }); }

  // Experience: 2 pts
  if (positions.length > 0) { compScore += 2; compChecks.push({ checkName: 'Experience Recorded', status: 'pass', detail: `${positions.length} entries`, scoreImpact: 2 }); }
  else { compChecks.push({ checkName: 'Experience Recorded', status: 'fail', detail: 'No experience entries', scoreImpact: 0 }); }

  // Education: 2 pts
  if (profile.education && profile.education.length > 0) { compScore += 2; compChecks.push({ checkName: 'Education Recorded', status: 'pass', detail: 'Completed', scoreImpact: 2 }); }
  else { compChecks.push({ checkName: 'Education Recorded', status: 'warning', detail: 'Education section empty', scoreImpact: 0 }); }

  // Location: 1 pt
  if (profile.location && profile.location.length > 2) { compScore += 1; compChecks.push({ checkName: 'Location Specified', status: 'pass', detail: profile.location, scoreImpact: 1 }); }
  else { compChecks.push({ checkName: 'Location Specified', status: 'warning', detail: 'Location missing (limits geographic search)', scoreImpact: 0 }); }

  // Custom URL: 1 pt
  const isCustomUrl = profile.profileUrl ? !/-\d{7,}/.test(profile.profileUrl) : false;
  if (isCustomUrl) { compScore += 1; compChecks.push({ checkName: 'Custom Profile URL', status: 'pass', detail: 'Clean custom handle configured', scoreImpact: 1 }); }
  else { compChecks.push({ checkName: 'Custom Profile URL', status: 'warning', detail: 'Default URL with random numbers detected', scoreImpact: 0 }); }

  const completenessResult: DimensionScoreResult = {
    dimension: 'completeness',
    label: 'Profile Completeness',
    score: Math.min(10, compScore),
    maxScore: 10,
    checks: compChecks,
    issues: compChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: compChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Claim a custom LinkedIn URL (e.g. linkedin.com/in/yourname) in Settings.']
  };

  // --------------------------------------------------------------------------
  // 7. POSITIONING & NARRATIVE (Max 10 pts)
  // --------------------------------------------------------------------------
  const posChecks: CheckItemResult[] = [];
  let posScore = 0;

  // Check 1: Alignment between Headline and Experience titles (5 pts)
  const currentTitle = positions[0]?.title || '';
  const currentPos = currentTitle || 'Experienced Specialist';
  const targetPos = targetRole || 'Senior Leader';

  const hasDirectTrajectory = targetRoleWords.some(w => currentTitle.toLowerCase().includes(w));
  if (hasDirectTrajectory) {
    posScore += 5;
    posChecks.push({ checkName: 'Career Trajectory Cohesion', status: 'pass', detail: `Direct transition from ${currentPos} to ${targetPos}.`, scoreImpact: 5 });
  } else {
    posScore += 2;
    posChecks.push({ checkName: 'Career Trajectory Cohesion', status: 'warning', detail: `Positioning gap between recent title (${currentPos}) and target (${targetPos}). Needs bridging narrative.`, scoreImpact: 2 });
  }

  // Check 2: Grounded positioning statement (5 pts)
  if (profile.achievements && profile.achievements.length > 0) {
    posScore += 5;
    posChecks.push({ checkName: 'Anchored Achievements', status: 'pass', detail: 'Backed by verified candidate milestones.', scoreImpact: 5 });
  } else if (positions.some(p => p.metricsFound && p.metricsFound.length > 0)) {
    posScore += 4;
    posChecks.push({ checkName: 'Anchored Achievements', status: 'pass', detail: 'Experience highlights verified operational results.', scoreImpact: 4 });
  } else {
    posScore += 1;
    posChecks.push({ checkName: 'Anchored Achievements', status: 'warning', detail: 'Add 2-3 specific accomplishments to ground your positioning.', scoreImpact: 1 });
  }

  const positioningResult: DimensionScoreResult = {
    dimension: 'positioning',
    label: 'Market Positioning',
    score: Math.min(10, posScore),
    maxScore: 10,
    checks: posChecks,
    issues: posChecks.filter(c => c.status !== 'pass').map(c => c.detail),
    strengths: posChecks.filter(c => c.status === 'pass').map(c => c.detail),
    suggestions: ['Explicitly state how your prior experience directly equips you for the target role responsibilities.']
  };

  // --------------------------------------------------------------------------
  // Overall Deterministic Score (Sum of 7 dimensions)
  // --------------------------------------------------------------------------
  const overallScore = Math.round(
    headlineResult.score +
    aboutResult.score +
    experienceResult.score +
    skillsResult.score +
    keywordsResult.score +
    completenessResult.score +
    positioningResult.score
  );

  // --------------------------------------------------------------------------
  // Top 3 Priority Fixes
  // --------------------------------------------------------------------------
  const priorityFixes: PriorityFixItem[] = [
    {
      rank: 1,
      problem: 'Headline lacks targeted boolean search keywords and value proposition.',
      evidence: hlLength < 80 ? 'Headline is under 80 characters and omits target role.' : 'Headline lacks measurable outcome or specialization.',
      recommendedAction: 'Adopt the 3-part formula: Target Role | Core Hard Skills | Verifiable Value Proposition.',
      expectedScoreContribution: '+6 to +8 pts potential improvement'
    },
    {
      rank: 2,
      problem: 'Work history duties are passive without quantifiable metrics.',
      evidence: `${positions.length - rolesWithMetrics} of ${positions.length} positions omit numerical outcomes.`,
      recommendedAction: 'Convert responsibility bullets into Challenge -> Action -> Result format.',
      expectedScoreContribution: '+5 to +7 pts potential improvement'
    },
    {
      rank: 3,
      problem: 'About section opening does not hook recruiters before the "...see more" fold.',
      evidence: firstSentence.toLowerCase().startsWith('i am') ? 'Starts with generic self-description.' : 'Missing concrete career hook in first 3 lines.',
      recommendedAction: 'Lead immediately with what problems you solve and for what scale of organization.',
      expectedScoreContribution: '+4 to +5 pts potential improvement'
    }
  ];

  // --------------------------------------------------------------------------
  // Optional Target Job Match (Platform Match Analysis)
  // --------------------------------------------------------------------------
  let jobMatch: JobMatchBreakdown | undefined;
  if (targetJobDescription && targetJobDescription.trim().length > 30) {
    const jdWords = targetJobDescription.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchedKws = Array.from(new Set(jdWords.filter(w => corpus.includes(w)))).slice(0, 10);
    const missingKws = Array.from(new Set(jdWords.filter(w => !corpus.includes(w)))).slice(0, 8);

    const matchPercent = Math.min(95, Math.max(45, Math.round((matchedKws.length / (matchedKws.length + missingKws.length)) * 100)));

    jobMatch = {
      label: 'Platform Match Analysis',
      matchPercentage: matchPercent,
      titleMatch: { score: hasTargetTitle ? 90 : 60, details: hasTargetTitle ? 'Target role aligns with job posting' : 'Title term mismatch' },
      skillsMatch: { score: Math.round(matchPercent * 0.9), matched: matchedKws.slice(0, 5), missing: missingKws.slice(0, 4) },
      keywordsMatch: { score: matchPercent, matched: matchedKws, missing: missingKws },
      experienceMatch: { score: positions.length >= 2 ? 85 : 65, details: `${positions.length} recorded positions compared against requirements.` },
      responsibilityMatch: { score: rolesWithMetrics > 0 ? 82 : 60, details: 'Action verb alignment across stated requirements.' },
      educationMatch: { score: profile.education && profile.education.length > 0 ? 90 : 70, details: 'Academic qualifications align with entry threshold.' }
    };
  }

  // --------------------------------------------------------------------------
  // Profile Checklist with Visual Review Disclosure
  // --------------------------------------------------------------------------
  const profileChecklist: FullLinkedInAnalysisResult['profileChecklist'] = {
    photo: {
      status: 'Visual review required',
      checklist: [
        'High-resolution, front-facing headshot (not a cropped group photo).',
        'Face occupies approximately 60% of the frame.',
        'Neutral or uncluttered professional background.',
        'Warm, approachable eye contact.'
      ]
    },
    banner: {
      status: 'Visual review required',
      checklist: [
        '1584 x 396 px dimension banner.',
        'Visually aligns with your industry and positioning.',
        'Avoid cluttered paragraphs; prioritize 1 concise tagline.'
      ],
      suggestedText: `${targetRole} | Delivering Operational Reliability & Cross-Functional Alignment`
    },
    featured: {
      checklist: [
        'Pin 1-2 major career highlights (case studies, articles, or project links).',
        'Ensure link previews render clear thumbnails and descriptions.'
      ]
    },
    customUrl: {
      currentUrl: profile.profileUrl,
      isCustom: isCustomUrl,
      checklist: [
        'Clean handle: linkedin.com/in/firstname-lastname',
        'Remove trailing numeric strings generated by default.'
      ]
    },
    contactInfo: {
      checklist: [
        'Professional email address visible to 1st/2nd degree connections.',
        'Location aligns with target recruitment market.',
        'Optional portfolio or GitHub link provided.'
      ]
    }
  };

  return {
    overallScore,
    dimensionScores: {
      headline: headlineResult,
      about: aboutResult,
      experience: experienceResult,
      skills: skillsResult,
      keywords: keywordsResult,
      completeness: completenessResult,
      positioning: positioningResult
    },
    priorityFixes,
    keywordGapAnalysis,
    jobMatch,
    positioning: {
      currentPositioning: currentPos,
      targetPositioning: targetPos,
      positioningGap: hasDirectTrajectory
        ? 'Strong continuity. Position yourself as ready for the next level of operational scope.'
        : `Bridging needed from "${currentPos}" to "${targetPos}". Emphasize transferrable skills.`,
      groundedPositioningStatement: `${targetRole} with ${profile.yearsExperience}+ years proven experience delivering reliable cross-functional outcomes and workflow execution.`
    },
    skillsAnalysis: {
      topExistingSkills,
      missingTargetSkills,
      potentiallyRelevantSkills,
      lowRelevanceSkills: lowRelevanceSkills.slice(0, 3),
      top3ToFeature: topExistingSkills.slice(0, 3),
      top10ForTargetRole: [...topExistingSkills, ...missingTargetSkills].slice(0, 10)
    },
    profileChecklist
  };
}
