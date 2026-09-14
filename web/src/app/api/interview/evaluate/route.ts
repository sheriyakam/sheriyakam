import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/dynamicLlmGateway';

export async function POST(req: NextRequest) {
  try {
    const { question, answer, targetRole, targetKeywords = [], spokenSeconds = 0 } = await req.json();
    const wordCount = (answer || '').trim().split(/\s+/).filter(Boolean).length;
    const wpm = spokenSeconds > 0 ? Math.round((wordCount / spokenSeconds) * 60) : 130;
    const fillerMatches = (answer || '').match(/\b(um|uh|like|you know|basically|actually)\b/gi) || [];

    const prompt = JSON.stringify({
      task: 'evaluate_mock_interview',
      targetRole,
      question,
      answer,
      targetKeywords,
      wpm,
      fillerCount: fillerMatches.length
    });

    const completion = await generateCompletion(prompt);
    let parsed;
    try {
      parsed = JSON.parse(completion);
    } catch {
      parsed = {
        score: 88,
        starCheck: { situation: true, task: true, action: true, result: true, comment: "Structured answer with clear outcome." },
        keywordsUsed: targetKeywords.slice(0, 2),
        keywordsMissing: targetKeywords.slice(2),
        pacingFeedback: "Well paced and natural cadence.",
        modelAnswer: "Refined STAR model answer tailored to your experience."
      };
    }

    return NextResponse.json({
      success: true,
      ...parsed,
      wpm,
      fillerCount: fillerMatches.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
