import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      overallFit: 91,
      subScores: {
        seniorityFit: 94,
        industryFit: 86,
        locationFit: 100,
        technicalFit: 90
      },
      gapRemediations: [
        { dimension: 'Industry Fit', advice: 'Highlight enterprise governance and vendor compliance in summary.' },
        { dimension: 'Technical Fit', advice: 'Specify automated workflow tooling in technical matrix.' }
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
