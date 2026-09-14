import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/dynamicLlmGateway';

export async function POST(req: NextRequest) {
  try {
    const { targetRole, currentHeadline, skills } = await req.json();
    const prompt = `Optimize LinkedIn headline and about section for recruiter candidate search algorithms.
Target Role: ${targetRole}
Current: ${currentHeadline}
Skills: ${(skills || []).join(', ')}

Return JSON with:
{
  "optimizedHeadline": "string (under 220 chars)",
  "aboutStory": "string (first-person narrative)",
  "missingEndorsements": ["string"]
}`;

    const res = await generateCompletion(prompt, { maxTokens: 800 });
    return NextResponse.json({ success: true, optimization: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
