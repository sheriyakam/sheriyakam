import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    credits: {
      checksRemaining: 5,
      tailorsRemaining: 3,
      coverLettersRemaining: 5,
      resetsIn: '3h 12m',
      paidCredits: 0,
      activePack: 'free'
    }
  });
}
