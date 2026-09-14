import { NextRequest, NextResponse } from 'next/server';
import { calculateAtsScore } from '@/lib/ats-scoring';
import { RescoreSchema, checkRateLimit } from '@/lib/security';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const versionId = params.id;
    const body = await req.json().catch(() => ({}));

    let baseResume = body.baseResume;
    let jobDescription = body.jobDescription;

    // If baseResume or jobDescription not supplied, look up version in Prisma
    if ((!baseResume || !jobDescription) && prisma && prisma.tailoredVersion) {
      try {
        const version = await prisma.tailoredVersion.findUnique({
          where: { id: versionId },
          include: { baseResume: true, jobDescription: true }
        });
        if (version) {
          baseResume = baseResume || version.baseResume;
          jobDescription = jobDescription || version.jobDescription;
        }
      } catch (e) {
        // Fall back to body params
      }
    }

    if (!baseResume || !jobDescription) {
      return NextResponse.json(
        { error: 'baseResume and jobDescription are required for re-scoring.' },
        { status: 400 }
      );
    }

    // Fast deterministic + qualitative pass via Groq (free, 0 credits deducted)
    const scoreResult = await calculateAtsScore(baseResume, jobDescription, true);

    // Optionally update atsScore in DB
    try {
      if (prisma && prisma.tailoredVersion) {
        await prisma.tailoredVersion.update({
          where: { id: versionId },
          data: { atsScore: scoreResult.totalScore }
        });
      }
    } catch (e) {
      // Ignore DB write error
    }

    return NextResponse.json({
      success: true,
      versionId,
      atsScore: scoreResult.totalScore,
      scoreBreakdown: {
        keywordScore: scoreResult.keywordScore,
        structureScore: scoreResult.structureScore,
        clarityScore: scoreResult.clarityScore,
        matchedKeywords: scoreResult.matchedKeywords,
        missingKeywords: scoreResult.missingKeywords,
        formattingIssues: scoreResult.formattingIssues,
        suggestions: scoreResult.suggestions
      },
      creditsDeducted: 0,
      isFree: true
    });

  } catch (err: any) {
    console.error('[resume/rescore] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to rescore resume' }, { status: 500 });
  }
}
