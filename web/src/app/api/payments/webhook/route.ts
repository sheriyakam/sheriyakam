import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { grantPaidCredits } from '@/lib/credits';
import prisma from '@/lib/prisma';

// Memory set for idempotency in dev/test without DB
const processedPaymentIds = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // 1. Signature Verification
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[payments/webhook] Invalid Razorpay webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const event = payload.event;
    // Process captured payments
    if (event === 'payment.captured' || event === 'order.paid' || payload.status === 'captured') {
      const paymentEntity = payload.payload?.payment?.entity || payload;
      const paymentId = paymentEntity.id || 'pay_' + Date.now();
      const orderId = paymentEntity.order_id || payload.order_id;
      const notes = paymentEntity.notes || payload.notes || {};
      const userId = notes.userId || 'user_guest';
      const packType = (notes.packType === 'active_search' ? 'active_search' : 'lite') as 'lite' | 'active_search';
      const amount = paymentEntity.amount ? Math.round(paymentEntity.amount / 100) : (packType === 'active_search' ? 415 : 165);

      // 2. Idempotency Check (Prevent duplicate credit delivery)
      if (processedPaymentIds.has(paymentId)) {
        console.log(`[payments/webhook] Payment ${paymentId} already processed (idempotent duplicate skipped).`);
        return NextResponse.json({ received: true, status: 'already_processed', paymentId });
      }

      if (prisma && prisma.payment) {
        try {
          const existing = await prisma.payment.findFirst({
            where: {
              OR: [
                { razorpayPaymentId: paymentId },
                { idempotencyKey: `webhook_${paymentId}` }
              ]
            }
          });

          if (existing && existing.status === 'success') {
            console.log(`[payments/webhook] DB: Payment ${paymentId} already settled.`);
            processedPaymentIds.add(paymentId);
            return NextResponse.json({ received: true, status: 'already_processed', paymentId });
          }

          // 3. Grant credits
          await grantPaidCredits(userId, packType);

          // 4. Record/update payment record
          await prisma.payment.upsert({
            where: { razorpayPaymentId: paymentId },
            update: {
              status: 'success',
              razorpaySignature: signature || 'verified'
            },
            create: {
              userId,
              amount,
              currency: 'INR',
              provider: 'razorpay',
              status: 'success',
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              razorpaySignature: signature || 'verified',
              idempotencyKey: `webhook_${paymentId}`
            }
          });

          processedPaymentIds.add(paymentId);

          return NextResponse.json({
            received: true,
            status: 'credited',
            paymentId,
            packType,
            userId
          });
        } catch (dbErr: any) {
          console.warn('[payments/webhook] DB write warning:', dbErr.message);
        }
      }

      // Memory-based grant for offline/dev
      await grantPaidCredits(userId, packType);
      processedPaymentIds.add(paymentId);

      return NextResponse.json({
        received: true,
        status: 'credited',
        paymentId,
        packType,
        userId
      });
    }

    return NextResponse.json({ received: true, status: 'ignored_event', event });

  } catch (err: any) {
    console.error('[payments/webhook] Error:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
