import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/dynamicLlmGateway';

export async function POST(req: NextRequest) {
  try {
    const { baseResume, jobDescription } = await req.json();
    const prompt = `Generate an executive, high-impact cover letter.
Candidate: ${JSON.stringify(baseResume?.fullName || 'Candidate')}
Target Role: ${jobDescription || 'Senior Operations Specialist'}
Highlight genuine experience with concise, metric-backed paragraphs.`;

    const letter = await generateCompletion(prompt, { maxTokens: 600 });
    return NextResponse.json({ success: true, coverLetter: letter });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
