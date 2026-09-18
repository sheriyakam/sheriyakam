import { NextRequest, NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/data/service-areas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pincode } = body;

    if (!pincode || typeof pincode !== 'string') {
      return NextResponse.json(
        { available: false, message: 'Please provide a valid PIN code.' },
        { status: 400 }
      );
    }

    const result = checkPincodeServiceability(pincode);

    return NextResponse.json({
      available: result.available,
      areaName: result.area ? result.area.areaName : undefined,
      district: result.area ? result.area.district : undefined,
      message: result.message
    });
  } catch (error) {
    console.error('Pincode check error:', error);
    return NextResponse.json(
      { available: false, message: 'Internal validation error. Please try again.' },
      { status: 500 }
    );
  }
}
