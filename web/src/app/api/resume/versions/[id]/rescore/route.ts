import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({
    success: true,
    id: params.id,
    newScore: 96,
    scoreBreakdown: {
      keywordMatch: 95,
      actionVerbDensity: 98,
      formattingScore: 100,
      readabilityScore: 92
    }
  });
}
