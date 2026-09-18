import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText, checkRateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const rawText = sanitizeText(body.text || '');

    if (!rawText || rawText.trim().length < 30) {
      return NextResponse.json({ error: 'Please provide at least 30 characters of resume text.' }, { status: 400 });
    }

    // Heuristic deterministic section parsing
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const fullName = lines[0] || 'Applicant';
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);

    const skillsKeywords = [
      'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'AWS', 'Docker', 'Kubernetes',
      'SQL', 'PostgreSQL', 'Git', 'Agile', 'Leadership', 'Communication', 'Operations',
      'Project Management', 'CI/CD', 'Product Management', 'Data Analysis', 'Problem Solving'
    ];

    const detectedSkills = skillsKeywords.filter(skill =>
      new RegExp(`\\b${skill}\\b`, 'i').test(rawText)
    );

    return NextResponse.json({
      success: true,
      data: {
        contact: {
          fullName,
          email: emailMatch ? emailMatch[0] : '',
          phone: phoneMatch ? phoneMatch[0] : ''
        },
        detectedSkills,
        rawLength: rawText.length,
        linesCount: lines.length
      }
    });
  } catch (err: any) {
    console.error('[career/resume/parse] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal parsing error' }, { status: 500 });
  }
}
