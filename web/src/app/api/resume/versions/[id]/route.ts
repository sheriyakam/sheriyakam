import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    version: {
      id: params.id,
      targetJobTitle: 'Director of Operations',
      company: 'Northwind Global Corp',
      initialScore: 58,
      finalScore: 96,
      scoreBreakdown: {
        keywordMatch: 95,
        actionVerbDensity: 98,
        formattingScore: 100,
        readabilityScore: 92
      },
      createdAt: new Date().toISOString()
    }
  });
}
