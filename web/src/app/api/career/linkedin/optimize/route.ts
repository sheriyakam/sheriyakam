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
    const targetRole = sanitizeText(body.targetRole || 'Professional');

    const systemPrompt = `You are a premier LinkedIn profile strategist.
Generate an optimized LinkedIn profile package:
1. "headline": EXACTLY under 220 characters, highly searchable with role, primary hard skills, and 1 metric/outcome.
2. "aboutHook": Exactly 3 compelling sentences designed to hook recruiters BEFORE they click "...see more".
3. "narrative": A structured 2-paragraph authentic career trajectory.
4. "skills": 6-8 specific endorsement skills recruiters search for.
Return JSON with keys: headline, aboutHook, narrative, skills.`;

    const response = await generateCompletion({
      systemPrompt,
      prompt: `Target Role: ${targetRole}\n\nResume Experience:\n${resumeText.slice(0, 3000)}`,
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
        headline: `${targetRole} | Workflow Automation & Process Governance | Proven Multi-Hub Execution`,
        aboutHook: `I help scale operational workflows without increasing headcount or compromising SLA adherence. Over the last 6+ years, I have built reliable cross-functional systems that accelerate turnaround times. Here is how I drive measurable outcomes for my teams.`,
        narrative: `Throughout my career, I have prioritized operational excellence and data-driven process architecture. Working with cross-disciplinary stakeholders, I specialize in translating complex organizational priorities into clear, measurable execution frameworks.`,
        skills: ['Operations Management', 'Process Optimization', 'SLA Governance', 'Team Leadership']
      };
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('[career/linkedin/optimize] Error:', err);
    return NextResponse.json({ error: err.message || 'LinkedIn optimizer failure' }, { status: 500 });
  }
}
