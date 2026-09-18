import { NextRequest, NextResponse } from 'next/server';
import { processCreateBooking } from '@/lib/booking-service';
import { BookingRequest } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body: BookingRequest = await req.json();

    if (!body.serviceId || !body.customerName || !body.phone || !body.pincode || !body.scheduledDate || !body.scheduledSlotId) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking fields.' },
        { status: 400 }
      );
    }

    const result = await processCreateBooking(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      booking: result.booking
    });
  } catch (error) {
    console.error('Booking create API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error confirming booking.' },
      { status: 500 }
    );
  }
}
