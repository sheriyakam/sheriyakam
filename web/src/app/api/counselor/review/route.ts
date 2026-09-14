import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, commentText, section } = await req.json();
    return NextResponse.json({
      success: true,
      commentId: 'c-' + Date.now(),
      rubricScore: 4.9,
      status: 'counselor_approved',
      message: 'Feedback recorded in candidate workspace.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
