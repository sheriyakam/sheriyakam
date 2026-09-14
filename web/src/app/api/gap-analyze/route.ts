import { NextRequest, NextResponse } from 'next/server';
import { analyzeKeywordGap } from '../../../lib/atsEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const result = analyzeKeywordGap(resume || {}, jobDescription);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Gap analysis API error:', err);
    return NextResponse.json({ error: 'Failed to analyze gap' }, { status: 500 });
  }
}
