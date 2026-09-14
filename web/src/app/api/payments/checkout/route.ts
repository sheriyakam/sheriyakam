import { NextRequest, NextResponse } from 'next/server';
import { PACK_CREDITS } from '@/lib/credits';
import { CheckoutSchema, checkRateLimit } from '@/lib/security';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = CheckoutSchema.safeParse(rawBody);
    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || validation.error.message || 'Invalid checkout request';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { packType, userId = 'user_guest' } = validation.data;
    const packConfig = PACK_CREDITS[packType];

    const amountInPaise = packConfig.priceInr * 100; // Razorpay expects amount in subunits (paise)
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = 'order_mock_' + Date.now();

    // If Razorpay credentials configured, create genuine Razorpay Order via API
    if (razorpayKeyId && razorpayKeySecret) {
      try {
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${packType}_${Date.now().toString().slice(-6)}`,
            notes: {
              userId,
              packType,
              creditsGranted: packConfig.credits
            }
          })
        });

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          razorpayOrderId = rzpData.id;
        } else {
          console.warn('[payments/checkout] Razorpay API order creation failed, fallback to mock order ID');
        }
      } catch (err: any) {
        console.warn('[payments/checkout] Razorpay network call error:', err.message);
      }
    }

    // Record pending payment in database if available
    try {
      if (prisma && prisma.payment) {
        await prisma.payment.create({
          data: {
            userId,
            amount: packConfig.priceInr,
            currency: 'INR',
            provider: 'razorpay',
            status: 'pending',
            razorpayOrderId,
            idempotencyKey: `checkout_${razorpayOrderId}`
          }
        });
      }
    } catch (e: any) {
      console.warn('[payments/checkout] Prisma payment record creation skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: packConfig.priceInr,
      amountSubunits: amountInPaise,
      currency: 'INR',
      keyId: razorpayKeyId || 'rzp_test_mock_key',
      packType,
      creditsGranted: packConfig.credits,
      validityDays: packConfig.daysValid,
      notes: {
        description: `Sheriyakam AI Optimizer - ${packType === 'lite' ? 'Lite Pack ($2)' : 'Active Search Pack ($5)'}`
      }
    });

  } catch (err: any) {
    console.error('[payments/checkout] Error:', err);
    return NextResponse.json({ error: err.message || 'Checkout creation failed' }, { status: 500 });
  }
}
