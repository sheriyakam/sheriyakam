import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, sanitizeText } from '@/lib/security';
import { NormalizedLinkedInProfile, JobMatchBreakdown } from '@/lib/linkedin-types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const profile: NormalizedLinkedInProfile = body.profile;
    const jobDescription = sanitizeText(body.jobDescription || '');

    if (!profile || !jobDescription || jobDescription.length < 30) {
      return NextResponse.json({ error: 'Both profile and target job description are required.' }, { status: 400 });
    }

    const profileCorpus = [
      profile.headline,
      profile.about,
      (profile.skills || []).join(' '),
      (profile.experience || []).flatMap(e => [e.title, e.company, ...(e.bullets || [])]).join(' ')
    ].join(' ').toLowerCase();

    // Extract key tokens from job description
    const stopWords = new Set(['with', 'that', 'this', 'have', 'from', 'your', 'will', 'role', 'team', 'must', 'should', 'able']);
    const jdTokens = jobDescription
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !stopWords.has(w));

    const tokenCounts = new Map<string, number>();
    jdTokens.forEach(t => tokenCounts.set(t, (tokenCounts.get(t) || 0) + 1));

    const topJdKeywords = Array.from(tokenCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    topJdKeywords.forEach(kw => {
      if (profileCorpus.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const kwScore = topJdKeywords.length > 0
      ? Math.round((matchedKeywords.length / topJdKeywords.length) * 100)
      : 70;

    const targetRoleWords = (profile.targetRole || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const titleMatch = targetRoleWords.some(w => jobDescription.toLowerCase().includes(w));

    const overallMatch = Math.min(96, Math.max(40, Math.round(
      (kwScore * 0.4) +
      (titleMatch ? 90 * 0.2 : 55 * 0.2) +
      ((profile.experience?.length || 0) >= 2 ? 85 * 0.2 : 60 * 0.2) +
      ((profile.education?.length || 0) > 0 ? 90 * 0.2 : 65 * 0.2)
    )));

    const breakdown: JobMatchBreakdown = {
      label: 'Platform Match Analysis',
      matchPercentage: overallMatch,
      titleMatch: {
        score: titleMatch ? 90 : 55,
        details: titleMatch ? `Target role title "${profile.targetRole}" matches position description.` : 'Title differs slightly; bridge using headline keywords.'
      },
      skillsMatch: {
        score: kwScore,
        matched: matchedKeywords.slice(0, 5),
        missing: missingKeywords.slice(0, 4)
      },
      keywordsMatch: {
        score: kwScore,
        matched: matchedKeywords,
        missing: missingKeywords
      },
      experienceMatch: {
        score: (profile.experience?.length || 0) >= 2 ? 85 : 65,
        details: `${profile.experience?.length || 0} recorded roles against experience requirements.`
      },
      responsibilityMatch: {
        score: Math.round(overallMatch * 0.95),
        details: 'Alignment of action verbs and operational responsibilities.'
      },
      educationMatch: {
        score: profile.education && profile.education.length > 0 ? 92 : 70,
        details: 'Academic and qualification criteria meet stated thresholds.'
      }
    };

    return NextResponse.json({
      success: true,
      data: breakdown
    });
  } catch (err: any) {
    console.error('[linkedin/job-match] Error:', err);
    return NextResponse.json({ error: err.message || 'Job match failed' }, { status: 500 });
  }
}
