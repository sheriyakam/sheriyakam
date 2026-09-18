import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { validateRewriteFactuality } from '@/lib/linkedin-safety-validator';
import { checkRateLimit, sanitizeText } from '@/lib/security';
import { NormalizedLinkedInProfile, RewriteItem } from '@/lib/linkedin-types';

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
    const section: 'headline' | 'about' | 'experience' = body.section || 'headline';
    const currentText = sanitizeText(body.currentText || '');
    const instruction = sanitizeText(body.instruction || '');

    if (!profile) {
      return NextResponse.json({ error: 'Candidate profile context is required.' }, { status: 400 });
    }

    const systemPrompt = `You are an elite LinkedIn profile editor.
Rewrite the specified section with STRICT factuality:
1. Preserve all real employers, degrees, dates, and skills.
2. DO NOT invent metrics, revenue figures, or team sizes. Use [ADD METRIC] if a quantifiable outcome is missing.
3. Keep headline under 220 characters. Keep About section under 2600 characters.
4. Return JSON:
{
  "proposedText": "string",
  "whyExplanation": "string"
}`;

    const prompt = `Section to Rewrite: ${section.toUpperCase()}
Current Text: ${currentText}
Target Role: ${profile.targetRole || 'Specialist'}
Target Market: ${profile.targetMarket || 'USA'}
Candidate Background Facts:
- Experience: ${JSON.stringify(profile.experience?.slice(0, 2))}
- Skills: ${profile.skills?.slice(0, 8).join(', ')}
${instruction ? `User Specific Instruction: ${instruction}` : ''}`;

    const response = await generateCompletion({
      systemPrompt,
      prompt,
      temperature: 0.2
    });

    let proposedText = '';
    let whyExplanation = '';

    if (response.data && typeof response.data === 'object') {
      proposedText = response.data.proposedText || '';
      whyExplanation = response.data.whyExplanation || '';
    } else {
      try {
        const parsed = JSON.parse(response.rawText || '{}');
        proposedText = parsed.proposedText || '';
        whyExplanation = parsed.whyExplanation || '';
      } catch (e) {
        proposedText = currentText;
        whyExplanation = 'Refined phrasing based on target role keywords.';
      }
    }

    // Run Safety & Anti-Hallucination Validation Layer
    const safetyCheck = validateRewriteFactuality(profile, proposedText);

    const rewriteResult: RewriteItem = {
      id: `rewrite_${Date.now()}`,
      section,
      currentText,
      proposedText: safetyCheck.hasUnsupportedClaims ? safetyCheck.sanitizedText : proposedText,
      whyExplanation: whyExplanation || `Aligned terminology with recruiter search expectations for ${profile.targetRole || 'target position'}.`,
      status: 'pending',
      hasUnsupportedClaims: safetyCheck.hasUnsupportedClaims,
      unsupportedClaims: safetyCheck.unsupportedClaims
    };

    return NextResponse.json({
      success: true,
      data: rewriteResult
    });
  } catch (err: any) {
    console.error('[linkedin/rewrite] Error:', err);
    return NextResponse.json({ error: err.message || 'Rewrite failed' }, { status: 500 });
  }
}
