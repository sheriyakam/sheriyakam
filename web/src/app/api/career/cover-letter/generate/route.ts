import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
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
    const companyName = sanitizeText(body.companyName || 'Hiring Team');
    const roleTitle = sanitizeText(body.roleTitle || 'Target Role');
    const tone = sanitizeText(body.tone || 'Professional');

    const systemPrompt = `You are an elite career advisor. Write a tailored, impactful cover letter for ${companyName} (${roleTitle}).
Tone requested: ${tone}
Strict rules:
1. Ground every claim directly in the user's provided resume facts.
2. Never invent experience, metrics, or company relationships.
3. Keep it to 3 focused paragraphs (Hook, Evidence & Value, Call to Action).
4. Do not use generic AI buzzwords ("spearheaded", "tapestry", "passionate").`;

    const prompt = `Resume:\n${resumeText.slice(0, 2500)}\n\nJob Description:\n${jobDescription.slice(0, 2500)}`;

    const response = await generateCompletion({
      systemPrompt,
      prompt,
      temperature: 0.3
    });

    return NextResponse.json({
      success: true,
      data: {
        coverLetter: response.rawText || (typeof response.data === 'string' ? response.data : JSON.stringify(response.data)),
        tone,
        companyName,
        roleTitle
      }
    });
  } catch (err: any) {
    console.error('[career/cover-letter/generate] Error:', err);
    return NextResponse.json({ error: err.message || 'Cover letter generation failure' }, { status: 500 });
  }
}
