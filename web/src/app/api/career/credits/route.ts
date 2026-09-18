import { NextRequest, NextResponse } from 'next/server';
import { getCreditStatus, consumeCredit } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_guest';

    const status = await getCreditStatus(userId);

    return NextResponse.json({
      success: true,
      data: {
        freeCreditsRemaining: status.free.ats_check.remaining,
        maxFreeCredits: 3,
        refillInFormatted: status.free.ats_check.nextUnlockFormatted,
        refillInMs: status.free.ats_check.nextUnlockMs,
        paidCredits: status.paid.totalCredits,
        activePack: status.activePack
      }
    });
  } catch (err: any) {
    console.error('[career/credits] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch credits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_guest';
    const action = body.action || 'ats_check';

    const result = await consumeCredit(userId, action as any);

    return NextResponse.json({
      success: result.success,
      error: result.error,
      remaining: result.remaining
    });
  } catch (err: any) {
    console.error('[career/credits POST] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to consume credit' }, { status: 500 });
  }
}
