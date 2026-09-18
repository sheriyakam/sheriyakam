import { NextRequest, NextResponse } from 'next/server';
import { requestOtp } from '@/lib/otp-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const result = await requestOtp(phone);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, cooldownSeconds: result.cooldownSeconds },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds,
      devOtpHint: result.devOtpHint
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
