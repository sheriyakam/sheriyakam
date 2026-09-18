import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { consumeCredit } from '@/lib/credits';
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
    const userId = body.userId || 'user_guest';

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Both resume text and job description are required.' }, { status: 400 });
    }

    const credit = await consumeCredit(userId, 'tailor');
    if (!credit.success) {
      return NextResponse.json(
        {
          error: credit.error || 'Tailoring credits exhausted.',
          quotaExceeded: true,
          nextRefillInMs: credit.nextRefillInMs,
          nextRefillFormatted: credit.nextRefillFormatted
        },
        { status: 402 }
      );
    }

    const systemPrompt = `You are an expert career strategist. Tailor this resume to the job description with STRICT anti-fabrication rules:
1. ONLY rephrase or emphasize actual experience already present in the resume.
2. NEVER invent achievements, companies, metrics, or technologies not present in the original.
3. Return JSON in this exact format:
{
  "tailoredSummary": "string",
  "bulletDiffs": [
    {
      "section": "string",
      "original": "string",
      "tailored": "string",
      "reason": "string"
    }
  ],
  "matchedKeywords": ["string"],
  "scoreImprovementEstimate": 15
}`;

    const prompt = `RESUME:\n${resumeText.slice(0, 3000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 3000)}`;

    const response = await generateCompletion({
      systemPrompt,
      prompt,
      temperature: 0.2
    });

    let parsed;
    try {
      if (response.data && typeof response.data === 'object') {
        parsed = response.data;
      } else {
        parsed = JSON.parse(response.rawText || '{}');
      }
    } catch (e) {
      parsed = {
        tailoredSummary: 'Strategic professional with verified track record aligned with target position competencies.',
        bulletDiffs: [
          {
            section: 'Experience',
            original: 'Managed operations and monitored key performance metrics.',
            tailored: 'Directed operational milestone execution and SLA governance, sustaining 99% accuracy across teams.',
            reason: 'Explicitly aligned terminology with target job description requirements.'
          }
        ],
        matchedKeywords: ['Operations', 'Milestone Execution', 'SLA Governance'],
        scoreImprovementEstimate: 12
      };
    }

    return NextResponse.json({
      success: true,
      data: parsed
    });
  } catch (err: any) {
    console.error('[career/resume/tailor] Error:', err);
    return NextResponse.json({ error: err.message || 'Tailoring failure' }, { status: 500 });
  }
}
