import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole, skills, email } = body;

    const topSkills = Array.isArray(skills) ? skills.slice(0, 3).join(' • ') : 'Core Competencies';
    const headline = `${targetRole || 'Professional'} | ${topSkills} | Scalable Delivery & High Impact`;
    const about = `Accomplished ${targetRole || 'Professional'} committed to technical excellence, verified execution, and cross-functional leadership.`;

    return NextResponse.json({
      headline,
      about,
      characterCount: headline.length,
      underLimit: headline.length <= 220
    });
  } catch (err: any) {
    console.error('LinkedIn API error:', err);
    return NextResponse.json({ error: 'Failed to optimize LinkedIn profile' }, { status: 500 });
  }
}
