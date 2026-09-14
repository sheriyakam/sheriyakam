import { ResumeData, TailoredVersion } from './types';

const BASE_RESUME_KEY = 'sheriyakam_base_resume';
const TAILORED_VERSIONS_KEY = 'sheriyakam_tailored_versions';
const QUOTA_KEY = 'sheriyakam_quota_info';

export interface QuotaInfo {
  freeChecksRemaining: number;
  freeTailorsRemaining: number;
  lastRefillTimestamp: number;
  paidCredits: number;
  activePlan: 'free' | 'lite' | 'active_search';
  planExpiresAt?: number;
}

const DEFAULT_BASE_RESUME: ResumeData = {
  fullName: 'Alex Mercado',
  jobTitle: 'Senior Frontend Engineer',
  email: 'alex.mercado@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA • Remote',
  summary: 'Senior Frontend Engineer with 6+ years of experience engineering scalable web applications in React and TypeScript. Proven track record leading design system architectures and optimizing client-side performance.',
  skills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'Tailwind CSS', 'GraphQL', 'REST APIs', 'Git', 'CI/CD', 'Jest', 'Playwright'],
  experiences: [
    {
      id: 'exp-1',
      company: 'Meridian Cloud Systems',
      role: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      period: '2021 — Present',
      bullets: [
        'Engineered 40+ features into a shared React and TypeScript component system used by 6 product squads.',
        'Led Next.js migration across customer portal, cutting Largest Contentful Paint (LCP) from 4.1s to 1.3s.',
        'Architected frontend CI/CD test automation in Playwright, expanding automated branch coverage to 88%.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Northwind Software',
      role: 'Frontend Software Engineer',
      location: 'Austin, TX',
      period: '2018 — 2021',
      bullets: [
        'Built responsive client dashboard interfaces in React and Redux processing 15,000+ daily active user sessions.',
        'Refactored legacy REST endpoints into typed client integrations, reducing client crash rate by 34%.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2018'
    }
  ],
  certifications: [
    'AWS Certified Cloud Practitioner',
    'Meta Certified Front-End Developer'
  ]
};

export function getBaseResume(): ResumeData {
  if (typeof window === 'undefined') return DEFAULT_BASE_RESUME;
  try {
    const raw = localStorage.getItem(BASE_RESUME_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load base resume:', e);
  }
  return DEFAULT_BASE_RESUME;
}

export function saveBaseResume(resume: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BASE_RESUME_KEY, JSON.stringify(resume));
  } catch (e) {
    console.error('Failed to save base resume:', e);
  }
}

export function getTailoredVersions(): TailoredVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TAILORED_VERSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tailored versions:', e);
  }
  return [];
}

export function saveTailoredVersion(version: TailoredVersion): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getTailoredVersions();
    const filtered = current.filter(v => v.id !== version.id);
    localStorage.setItem(TAILORED_VERSIONS_KEY, JSON.stringify([version, ...filtered]));
  } catch (e) {
    console.error('Failed to save tailored version:', e);
  }
}

export function getQuotaInfo(): QuotaInfo {
  const defaultQuota: QuotaInfo = {
    freeChecksRemaining: 5,
    freeTailorsRemaining: 3,
    lastRefillTimestamp: Date.now(),
    paidCredits: 0,
    activePlan: 'free'
  };

  if (typeof window === 'undefined') return defaultQuota;
  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    if (raw) {
      const parsed: QuotaInfo = JSON.parse(raw);
      // Check 5-hour refill cycle (5 hours = 5 * 3600 * 1000 = 18,000,000 ms)
      const now = Date.now();
      const diff = now - (parsed.lastRefillTimestamp || 0);
      if (diff >= 18000000) {
        parsed.freeChecksRemaining = 5;
        parsed.freeTailorsRemaining = 3;
        parsed.lastRefillTimestamp = now;
        localStorage.setItem(QUOTA_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read quota info:', e);
  }
  return defaultQuota;
}

export function deductQuota(type: 'check' | 'tailor'): boolean {
  if (typeof window === 'undefined') return true;
  const quota = getQuotaInfo();
  if (type === 'check') {
    if (quota.freeChecksRemaining > 0) {
      quota.freeChecksRemaining -= 1;
    } else if (quota.paidCredits > 0) {
      quota.paidCredits -= 1;
    } else {
      return false;
    }
  } else if (type === 'tailor') {
    if (quota.freeTailorsRemaining > 0) {
      quota.freeTailorsRemaining -= 1;
    } else if (quota.paidCredits > 0) {
      quota.paidCredits -= 1;
    } else {
      return false;
    }
  }
  localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
  return true;
}
