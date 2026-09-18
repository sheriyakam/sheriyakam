import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText, checkRateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const resumeText = sanitizeText(body.resumeText || '');
    const jobDescription = sanitizeText(body.jobDescription || '');

    if (!jobDescription || jobDescription.length < 30) {
      return NextResponse.json({ error: 'Job description must be at least 30 characters.' }, { status: 400 });
    }

    // Extract key tokens from job description
    const stopWords = new Set([
      'the', 'and', 'with', 'for', 'that', 'this', 'have', 'from', 'your', 'will',
      'work', 'team', 'role', 'must', 'should', 'able', 'years', 'experience'
    ]);

    const words = jobDescription
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    const freqMap = new Map<string, number>();
    for (const w of words) {
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    }

    const sortedJobKeywords = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);

    const lowerResume = resumeText.toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    for (const kw of sortedJobKeywords) {
      if (lowerResume.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const matchPercent = sortedJobKeywords.length > 0
      ? Math.round((matched.length / sortedJobKeywords.length) * 100)
      : 70;

    return NextResponse.json({
      success: true,
      data: {
        matchPercentage: matchPercent,
        matchedKeywords: matched,
        missingKeywords: missing,
        readinessRating: matchPercent >= 80 ? 'High' : matchPercent >= 60 ? 'Moderate' : 'Low Gap'
      }
    });
  } catch (err: any) {
    console.error('[career/match] Error:', err);
    return NextResponse.json({ error: err.message || 'Match error' }, { status: 500 });
  }
}
