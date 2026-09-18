import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and 6-digit OTP are required.' },
        { status: 400 }
      );
    }

    const result = verifyOtp(phone, otp);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      token: result.token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error verifying OTP.' },
      { status: 500 }
    );
  }
}
