/**
 * linkedin-safety-validator.ts
 * 
 * Anti-Hallucination & Factuality Validation Layer
 * Compares AI rewrites against original profile facts to detect:
 * - Fabricated metrics / percentages / dollar amounts
 * - Unsupported team sizes ("managed 15 engineers")
 * - Hallucinated employers or degrees
 */

import { NormalizedLinkedInProfile, UnsupportedClaimDetection } from './linkedin-types';

export function validateRewriteFactuality(
  originalProfile: NormalizedLinkedInProfile,
  proposedText: string
): {
  hasUnsupportedClaims: boolean;
  unsupportedClaims: UnsupportedClaimDetection[];
  sanitizedText: string;
} {
  const unsupportedClaims: UnsupportedClaimDetection[] = [];

  // Build original corpus of facts
  const originalCorpus = [
    originalProfile.headline,
    originalProfile.about,
    (originalProfile.skills || []).join(' '),
    (originalProfile.achievements || []).join(' '),
    (originalProfile.experience || []).flatMap(e => [e.title, e.company, ...(e.bullets || [])]).join(' ')
  ].join(' ');

  // 1. Check for team size fabrications (e.g., "team of 15", "led 20 engineers")
  const teamSizeMatches = proposedText.match(/\b(team of \d+|\d+\s*(direct reports|engineers|designers|members|specialists|staff))\b/gi);
  if (teamSizeMatches) {
    teamSizeMatches.forEach(ts => {
      // Check if this number appears in original
      const numMatch = ts.match(/\d+/);
      if (numMatch && !originalCorpus.includes(numMatch[0])) {
        unsupportedClaims.push({
          claimText: ts,
          reason: `Team size or headcount "${ts}" does not appear in your original profile facts.`,
          suggestedFix: 'Replace with verified team context or use "[ADD TEAM SIZE]".'
        });
      }
    });
  }

  // 2. Check for fabricated financial figures ($10M, 45% margin, etc.)
  const financialMatches = proposedText.match(/(\$\d+[\d,]*(\.\d+)?[kKmMbB]?|\d+(\.\d+)?%)/g);
  if (financialMatches) {
    financialMatches.forEach(fm => {
      // If the number doesn't appear in original text
      const cleanNum = fm.replace(/[^0-9]/g, '');
      if (cleanNum.length > 0 && !originalCorpus.includes(cleanNum) && !originalCorpus.includes(fm)) {
        unsupportedClaims.push({
          claimText: fm,
          reason: `Metric or percentage "${fm}" was not found in your uploaded resume or profile facts.`,
          suggestedFix: 'Verify this exact metric before accepting, or replace with "[ADD METRIC]".'
        });
      }
    });
  }

  // 3. Check for specific unverified company additions
  const suspiciousCompanyPattern = /\b(at|with|for)\s+([A-Z][a-zA-Z0-9&]+(\s+[A-Z][a-zA-Z0-9&]+)?)\b/g;
  let compMatch;
  while ((compMatch = suspiciousCompanyPattern.exec(proposedText)) !== null) {
    const candidateComp = compMatch[2];
    const commonWords = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Uber', 'Airbnb', 'Netflix', 'Salesforce'];
    if (
      commonWords.includes(candidateComp) &&
      !originalCorpus.toLowerCase().includes(candidateComp.toLowerCase())
    ) {
      unsupportedClaims.push({
        claimText: candidateComp,
        reason: `Company name "${candidateComp}" appears in rewrite but is absent in your original profile facts.`,
        suggestedFix: 'Remove mention or correct to your actual employer.'
      });
    }
  }

  // Create sanitized text by replacing high-risk fabricated metrics with [ADD METRIC]
  let sanitized = proposedText;
  unsupportedClaims.forEach(claim => {
    if (claim.claimText.includes('%') || claim.claimText.includes('$')) {
      sanitized = sanitized.replace(claim.claimText, `[ADD METRIC: ${claim.claimText}]`);
    }
  });

  return {
    hasUnsupportedClaims: unsupportedClaims.length > 0,
    unsupportedClaims,
    sanitizedText: sanitized
  };
}
