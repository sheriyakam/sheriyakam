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
    const roleTitle = sanitizeText(body.roleTitle || 'Professional Role');
    const jobDescription = sanitizeText(body.jobDescription || '');

    const systemPrompt = `You are an executive interviewer.
Generate 5 targeted interview questions with STAR answers and recruiter evaluation criteria based on this job description:
Return JSON:
{
  "questions": [
    {
      "id": "q1",
      "category": "Behavioral" | "Technical" | "Situational" | "Leadership",
      "question": "string",
      "interviewerIntent": "string",
      "starFramework": {
        "situation": "string",
        "task": "string",
        "action": "string",
        "result": "string"
      },
      "redFlagsToAvoid": "string"
    }
  ]
}`;

    const response = await generateCompletion({
      systemPrompt,
      prompt: `Role: ${roleTitle}\n\nJob Description:\n${jobDescription.slice(0, 3000)}`,
      temperature: 0.3
    });

    let result;
    try {
      if (response.data && typeof response.data === 'object') {
        result = response.data;
      } else {
        result = JSON.parse(response.rawText || '{}');
      }
    } catch (e) {
      result = {
        questions: [
          {
            id: 'q1',
            category: 'Behavioral',
            question: 'Can you describe an operational project where SLA milestones were at critical risk?',
            interviewerIntent: 'Evaluating prioritization, risk escalation rigor, and composure under delivery deadlines.',
            starFramework: {
              situation: 'Two major logistics distribution nodes faced severe 48-hour backlog.',
              task: 'Maintain delivery guarantees without exceeding overtime budgets.',
              action: 'Re-routed low-priority fulfillment streams and instituted real-time bottleneck dashboards.',
              result: 'Recovered full throughput within 24 hours and sustained 99.4% SLA integrity.'
            },
            redFlagsToAvoid: 'Blaming downstream suppliers or presenting yourself as an isolated hero without team buy-in.'
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('[career/interview/generate] Error:', err);
    return NextResponse.json({ error: err.message || 'Interview generator error' }, { status: 500 });
  }
}
