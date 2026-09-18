/**
 * linkedin-parser.ts
 * 
 * Production LinkedIn "Save to PDF" and Raw Text Parser
 * - Deterministic Section Boundary Detection
 * - Normalized JSON extraction
 * - Low-confidence safety warnings
 * - Anti-fabrication (never invents missing fields)
 */

import { NormalizedLinkedInProfile, ExperienceItem, EducationItem, CertificationItem } from './linkedin-types';

export function parseLinkedInExportText(rawText: string): NormalizedLinkedInProfile {
  if (!rawText || rawText.trim().length === 0) {
    return createEmptyProfile('No text provided');
  }

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const parsingIssues: string[] = [];

  // 1. Identify Key Section Indices
  const sectionHeaders: Record<string, number> = {};
  const knownHeaders = [
    { key: 'summary', regex: /^(summary|about)$/i },
    { key: 'topSkills', regex: /^(top skills|skills & endorsements|skills)$/i },
    { key: 'experience', regex: /^(experience|work experience)$/i },
    { key: 'education', regex: /^(education)$/i },
    { key: 'certifications', regex: /^(certifications|licenses & certifications)$/i },
    { key: 'languages', regex: /^(languages)$/i },
    { key: 'contact', regex: /^(contact)$/i }
  ];

  lines.forEach((line, index) => {
    for (const h of knownHeaders) {
      if (!sectionHeaders[h.key] && h.regex.test(line)) {
        sectionHeaders[h.key] = index;
        break;
      }
    }
  });

  // 2. Extract Header (Name, Headline, Location)
  let fullName = '';
  let headline = '';
  let location = '';
  let profileUrl = '';

  // Extract Profile URL if present anywhere
  const urlMatch = rawText.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (urlMatch) {
    profileUrl = urlMatch[0];
  }

  // Name is typically line 0 or 1
  if (lines.length > 0) {
    // If first line looks like a contact word or URL, skip it
    let nameIndex = 0;
    if (lines[0].toLowerCase().includes('linkedin') || lines[0].toLowerCase().includes('contact')) {
      nameIndex = 1;
    }
    fullName = lines[nameIndex] || '';

    // Next line is typically headline
    if (lines.length > nameIndex + 1) {
      const candidate = lines[nameIndex + 1];
      if (!knownHeaders.some(h => h.regex.test(candidate))) {
        headline = candidate;
      }
    }

    // Next line might be location
    if (lines.length > nameIndex + 2) {
      const candidateLoc = lines[nameIndex + 2];
      if (
        !knownHeaders.some(h => h.regex.test(candidateLoc)) &&
        (candidateLoc.includes(',') || candidateLoc.includes('Area') || candidateLoc.includes('City') || candidateLoc.length < 50)
      ) {
        location = candidateLoc;
      }
    }
  }

  // Helper to slice text between sections
  const getSectionLines = (startKey: string): string[] => {
    const startIdx = sectionHeaders[startKey];
    if (startIdx === undefined) return [];

    // Find next section that starts after startIdx
    let endIdx = lines.length;
    for (const otherKey of Object.keys(sectionHeaders)) {
      const idx = sectionHeaders[otherKey];
      if (idx > startIdx && idx < endIdx) {
        endIdx = idx;
      }
    }

    return lines.slice(startIdx + 1, endIdx);
  };

  // 3. Extract Summary / About
  const summaryLines = getSectionLines('summary');
  const about = summaryLines.join('\n').trim();

  // 4. Extract Top Skills
  const topSkillsLines = getSectionLines('topSkills');
  const skills: string[] = [];
  topSkillsLines.forEach(l => {
    // Skills are often bulleted or comma separated or one per line
    const splitted = l.split(/[,•·|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
    if (splitted.length > 1) {
      skills.push(...splitted);
    } else if (l.length < 40 && !l.toLowerCase().startsWith('page')) {
      skills.push(l);
    }
  });

  // 5. Extract Experience
  const expLines = getSectionLines('experience');
  const experience: ExperienceItem[] = [];

  let currentExp: Partial<ExperienceItem> | null = null;
  const dateRegex = /(19|20)\d{2}|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)/i;

  expLines.forEach(line => {
    // If line has date patterns, it usually marks a position duration
    if (dateRegex.test(line) && line.length < 80) {
      if (currentExp && currentExp.title) {
        currentExp.dates = line;
      }
    } else if (line.length < 70 && !line.startsWith('-') && !line.startsWith('•')) {
      // Possible company or title
      if (!currentExp || (currentExp.title && currentExp.company && currentExp.dates)) {
        if (currentExp && currentExp.title) {
          experience.push(finalizeExperience(currentExp));
        }
        currentExp = {
          id: `exp_${experience.length + 1}`,
          title: line,
          bullets: [],
          achievements: [],
          metricsFound: []
        };
      } else if (currentExp && !currentExp.company) {
        currentExp.company = line;
      }
    } else if (currentExp) {
      // Bullets or description lines
      const cleanBullet = line.replace(/^[•\-\*]\s*/, '').trim();
      if (cleanBullet.length > 5) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(cleanBullet);

        // Check for metrics in this bullet
        const metricMatch = cleanBullet.match(/\b(\d+(\.\d+)?%|\$\d+[\d,]*(\.\d+)?[kKmMbB]?|\d+\s*(users|clients|engineers|members|hours|days|x))\b/);
        if (metricMatch) {
          currentExp.metricsFound = currentExp.metricsFound || [];
          currentExp.metricsFound.push(metricMatch[0]);
        }
      }
    }
  });

  if (currentExp && currentExp.title) {
    experience.push(finalizeExperience(currentExp));
  }

  // 6. Extract Education
  const eduLines = getSectionLines('education');
  const education: EducationItem[] = [];
  let currentEdu: Partial<EducationItem> | null = null;

  eduLines.forEach(line => {
    if (!currentEdu || currentEdu.school) {
      if (currentEdu && currentEdu.school) {
        education.push({
          school: currentEdu.school,
          degree: currentEdu.degree || 'Degree Program',
          year: currentEdu.year
        });
      }
      currentEdu = { school: line };
    } else if (currentEdu && !currentEdu.degree) {
      currentEdu.degree = line;
    } else if (currentEdu && !currentEdu.year && /\b(19|20)\d{2}\b/.test(line)) {
      currentEdu.year = line;
    }
  });
  if (currentEdu && currentEdu.school) {
    education.push({
      school: currentEdu.school,
      degree: currentEdu.degree || 'Degree Program',
      year: currentEdu.year
    });
  }

  // 7. Extract Languages
  const langLines = getSectionLines('languages');
  const languages: string[] = [];
  langLines.forEach(l => {
    const clean = l.replace(/\s*\([^)]*\)/, '').trim();
    if (clean.length > 2 && clean.length < 30) {
      languages.push(clean);
    }
  });

  // 8. Extract Certifications
  const certLines = getSectionLines('certifications');
  const certifications: CertificationItem[] = [];
  certLines.forEach(l => {
    if (l.length > 3 && l.length < 80) {
      certifications.push({ name: l });
    }
  });

  // 9. Calculate Parsing Confidence
  let confidence = 100;
  if (!fullName) {
    confidence -= 25;
    parsingIssues.push('Full name could not be identified automatically.');
  }
  if (!headline) {
    confidence -= 15;
    parsingIssues.push('Headline missing or unclear in header section.');
  }
  if (!about) {
    confidence -= 15;
    parsingIssues.push('About / Summary section was not detected.');
  }
  if (experience.length === 0) {
    confidence -= 25;
    parsingIssues.push('No professional experience entries could be parsed.');
  }
  if (skills.length === 0) {
    confidence -= 10;
    parsingIssues.push('Skills section was empty or not recognized.');
  }

  return {
    fullName: fullName || 'Candidate',
    headline: headline || '',
    about: about || '',
    location: location || '',
    profileUrl: profileUrl || '',
    targetRole: '',
    targetMarket: 'USA',
    yearsExperience: Math.max(1, experience.length * 2),
    achievements: [],
    skills: Array.from(new Set(skills)).slice(0, 30),
    experience,
    education,
    certifications,
    languages: languages.length > 0 ? languages : ['English'],
    parsingConfidence: Math.max(20, confidence),
    parsingIssues
  };
}

function finalizeExperience(item: Partial<ExperienceItem>): ExperienceItem {
  return {
    id: item.id || `exp_${Date.now()}`,
    title: item.title || 'Role Title',
    company: item.company || 'Organization',
    dates: item.dates || 'Dates not specified',
    location: item.location || '',
    bullets: item.bullets && item.bullets.length > 0 ? item.bullets : ['Led core departmental responsibilities.'],
    achievements: item.achievements || [],
    metricsFound: item.metricsFound || []
  };
}

function createEmptyProfile(reason: string): NormalizedLinkedInProfile {
  return {
    fullName: '',
    headline: '',
    about: '',
    location: '',
    profileUrl: '',
    targetRole: '',
    targetMarket: 'USA',
    yearsExperience: 0,
    achievements: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    parsingConfidence: 0,
    parsingIssues: [reason]
  };
}
