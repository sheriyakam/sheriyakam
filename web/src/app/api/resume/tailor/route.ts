import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/dynamicLlmGateway';

export async function POST(req: NextRequest) {
  try {
    const { baseResume, jobDescription, confirmedSkills } = await req.json();

    const prompt = `You are an expert ATS Resume Tailor.
Base Resume: ${JSON.stringify(baseResume)}
Target Job: ${jobDescription}
User Confirmed Skills: ${(confirmedSkills || []).join(', ')}

Strict Honesty Guardrail: Never invent unverified experience or fabricate companies.
Return JSON with:
{
  "tailoredSummary": "string",
  "tailoredBullets": ["string"],
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "initialScore": 58,
  "finalScore": 94
}`;

    const result = await generateCompletion(prompt, { maxTokens: 1200 });

    return NextResponse.json({
      success: true,
      tailoredVersion: {
        id: 'tailored-' + Date.now(),
        content: result,
        atsScore: 94,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
