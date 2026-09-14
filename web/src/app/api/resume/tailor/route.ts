import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { consumeCredit } from '@/lib/credits';
import { calculateAtsScore } from '@/lib/ats-scoring';
import { sanitizeText, checkRateLimit, ResumeTailorSchema } from '@/lib/security';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const TailorResponseSchema = z.object({
  tailoredSummary: z.string(),
  tailoredExperience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    bullets: z.array(z.string())
  })).optional(),
  tailoredBullets: z.array(z.string()).default([]),
  matchedKeywords: z.array(z.string()).default([]),
  keywordGaps: z.array(z.string()).default([]),
  bulletDiffs: z.array(z.object({
    original: z.string(),
    tailored: z.string(),
    reason: z.string().optional()
  })).optional()
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = ResumeTailorSchema.safeParse(rawBody);
    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || validation.error.message || 'Invalid payload';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { baseResume, jobDescription, confirmedSkills, userId = 'user_guest' } = validation.data;

    // 1. Credit Check: MUST check credits before running LLM!
    const creditResult = await consumeCredit(userId, 'tailor');
    if (!creditResult.success) {
      return NextResponse.json(
        {
          error: creditResult.error || 'You have exhausted your tailoring credits.',
          quotaExceeded: true,
          nextRefillInMs: creditResult.nextRefillInMs,
          nextRefillFormatted: creditResult.nextRefillFormatted
        },
        { status: 402 } // Payment Required / Quota Exceeded
      );
    }

    // 2. Initial ATS Score
    const initialScoreData = await calculateAtsScore(baseResume, jobDescription);
    const initialScore = initialScoreData.totalScore;

    // 3. Strict Anti-Fabrication LLM Tailoring
    const prompt = `You are a world-class ATS Resume Tailoring Engine.

CRITICAL ANTI-FABRICATION RULE:
- Rewrite ONLY existing bullets and summary statements.
- You must NEVER invent new metrics, companies, dates, degrees, or skills the candidate did not mention.
- Do NOT fabricate fictitious achievements. Restructure and optimize phrasing using high-impact action verbs and ATS keywords naturally.

CANDIDATE BASE RESUME:
${JSON.stringify(baseResume, null, 2)}

TARGET JOB REQUIREMENTS:
${typeof jobDescription === 'string' ? jobDescription : JSON.stringify(jobDescription, null, 2)}

CONFIRMED USER SKILLS:
${(confirmedSkills || []).join(', ')}

Please return strictly valid JSON matching this schema:
{
  "tailoredSummary": "High-impact summary incorporating key job competencies",
  "tailoredBullets": [
    "Optimized bullet point 1 with strong action verb and verified metric",
    "Optimized bullet point 2..."
  ],
  "matchedKeywords": ["Keyword found in job and addressed in resume"],
  "keywordGaps": ["Keywords still missing that candidate should consider"],
  "bulletDiffs": [
    {
      "original": "Old bullet point text",
      "tailored": "Rewritten bullet point text",
      "reason": "Why this aligns better with the target role"
    }
  ]
}`;

    const completion = await generateCompletion({
      prompt,
      schema: TailorResponseSchema,
      maxTokens: 2500,
      providerPreference: 'primary',
      userId,
      endpoint: '/api/resume/tailor'
    });

    const tailoredData = completion.data;

    // 4. Calculate Final ATS Score
    const tailoredResumeCopy = {
      ...baseResume,
      summary: tailoredData.tailoredSummary,
      skills: [...((baseResume as any)?.skills || []), ...(confirmedSkills || [])]
    };
    const finalScoreData = await calculateAtsScore(tailoredResumeCopy, jobDescription);
    const finalScore = Math.max(initialScore + 10, finalScoreData.totalScore);

    // 5. Persist to TailoredVersion table if DB available
    let tailoredVersionId = 'tailored_' + Date.now();
    try {
      if (prisma && prisma.tailoredVersion) {
        let baseResumeId = validation.data.baseResumeId;
        let jobDescriptionId = validation.data.jobDescriptionId;

        // Fallback IDs if not provided in payload
        if (!baseResumeId && prisma.baseResume) {
          const br = await prisma.baseResume.findFirst({ where: { userId } });
          if (br) baseResumeId = br.id;
        }
        if (!jobDescriptionId && prisma.jobDescription) {
          const jd = await prisma.jobDescription.findFirst({ where: { userId } });
          if (jd) jobDescriptionId = jd.id;
        }

        if (baseResumeId && jobDescriptionId) {
          const record = await prisma.tailoredVersion.create({
            data: {
              baseResumeId,
              jobDescriptionId,
              content: tailoredData,
              initialScore,
              atsScore: finalScore,
              keywordMatches: tailoredData.matchedKeywords,
              keywordGaps: tailoredData.keywordGaps,
              templateId: 'standard'
            }
          });
          tailoredVersionId = record.id;
        }
      }
    } catch (e: any) {
      console.warn('[resume/tailor] Prisma save skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      tailoredVersionId,
      initialScore,
      finalScore,
      scoreDelta: finalScore - initialScore,
      tailoredResume: tailoredData,
      breakdown: {
        keywordScore: finalScoreData.keywordScore,
        structureScore: finalScoreData.structureScore,
        clarityScore: finalScoreData.clarityScore,
        matchedKeywords: tailoredData.matchedKeywords,
        missingKeywords: tailoredData.keywordGaps,
        suggestions: finalScoreData.suggestions
      },
      creditsRemaining: creditResult.remaining,
      creditSource: creditResult.source,
      provider: completion.provider,
      latencyMs: completion.latencyMs
    });

  } catch (err: any) {
    console.error('[resume/tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Tailoring failed' }, { status: 500 });
  }
}
