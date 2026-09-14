import { NextRequest, NextResponse } from 'next/server';
import { getCreditStatus } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_guest';

    const status = await getCreditStatus(userId);

    return NextResponse.json({
      success: true,
      credits: {
        tailorsRemaining: status.free.tailor.remaining,
        checksRemaining: status.free.ats_check.remaining,
        coverLettersRemaining: status.free.cover_letter.remaining,
        refinementsRemaining: status.free.refinement.remaining,
        resetsIn: status.free.tailor.nextUnlockFormatted,
        nextRefillMs: status.free.tailor.nextUnlockMs,
        paidCredits: status.paid.totalCredits,
        activePack: status.activePack,
        details: status
      }
    });
  } catch (err: any) {
    console.error('[credits] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch credits' }, { status: 500 });
  }
}
