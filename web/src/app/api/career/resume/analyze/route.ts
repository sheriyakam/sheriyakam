import { NextRequest, NextResponse } from 'next/server';
import { calculateAtsScore } from '@/lib/ats-scoring';
import { sanitizeText, checkRateLimit } from '@/lib/security';
import { consumeCredit } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const resumeText = sanitizeText(body.resumeText || '');
    const jobDescription = sanitizeText(body.jobDescription || '');
    const userId = body.userId || 'user_guest';

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text must be at least 50 characters.' }, { status: 400 });
    }

    // Optional credit consumption for check
    const credit = await consumeCredit(userId, 'ats_check');
    if (!credit.success) {
      return NextResponse.json(
        {
          error: credit.error || 'ATS check limit reached for this window.',
          quotaExceeded: true,
          nextRefillInMs: credit.nextRefillInMs,
          nextRefillFormatted: credit.nextRefillFormatted
        },
        { status: 402 }
      );
    }

    const atsResult = await calculateAtsScore(resumeText, jobDescription);

    return NextResponse.json({
      success: true,
      data: {
        score: atsResult.totalScore,
        breakdown: {
          keywordMatch: atsResult.keywordScore,
          structure: atsResult.structureScore,
          clarity: atsResult.clarityScore
        },
        matchedKeywords: atsResult.matchedKeywords || [],
        missingKeywords: atsResult.missingKeywords || [],
        formattingFlags: atsResult.formattingIssues || [],
        suggestions: atsResult.suggestions || []
      }
    });
  } catch (err: any) {
    console.error('[career/resume/analyze] Error:', err);
    return NextResponse.json({ error: err.message || 'ATS analysis error' }, { status: 500 });
  }
}
