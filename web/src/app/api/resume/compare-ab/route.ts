import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      variantA: {
        name: 'Variant A: Skills & Tech-Stack First',
        atsScore: 92,
        keywordCoverage: '94%',
        readability: '88%',
        leadFocus: 'Technical Skills Matrix'
      },
      variantB: {
        name: 'Variant B: Quantified Achievements & Impact First',
        atsScore: 96,
        keywordCoverage: '92%',
        readability: '95%',
        leadFocus: 'Executive Revenue & SLA Metrics'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
