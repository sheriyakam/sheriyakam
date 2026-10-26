const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { cacheGet, cacheSet } = require('../utils/security');

// Fail-closed webhook secret guard: require explicit secret in production
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || (process.env.NODE_ENV === 'test' ? 'whsec_prod_sheriyakam_kerala_2026' : null);

function verifyRazorpaySignature(rawBody, signatureHeader, secret) {
  if (!rawBody || !signatureHeader || !secret) return false;
  const generated = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const sigBuf = Buffer.from(signatureHeader, 'utf8');
    const genBuf = Buffer.from(generated, 'utf8');
    if (sigBuf.length !== genBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, genBuf);
  } catch {
    return false;
  }
}

// POST /api/webhooks/razorpay
router.post('/razorpay', express.raw({ type: '*/*' }), async (req, res) => {
  // Fail-closed guard: reject immediately if webhook secret is not configured
  if (!WEBHOOK_SECRET) {
    console.error('[Security] CRITICAL: RAZORPAY_WEBHOOK_SECRET is not configured. Webhook processing disabled.');
    return res.status(500).json({ error: 'Webhook processing disabled: secret not configured' });
  }

  const signature = req.headers['x-razorpay-signature'] || '';
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

  if (!verifyRazorpaySignature(rawBody, signature, WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'INVALID_SIGNATURE' });
  }

  let event;
  try {
    event = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'MALFORMED_JSON_PAYLOAD' });
  }

  const eventId = event.id || event.payload?.payment?.entity?.id || `evt_${Date.now()}`;
  const cacheKey = `webhook:razorpay:${eventId}`;

  // Distributed cache / Redis idempotency check (24 hour TTL)
  const isProcessed = await cacheGet(cacheKey);
  if (isProcessed) {
    return res.status(200).json({ status: 'ok', action: 'IDEMPOTENT_SKIPPED', eventId });
  }
  await cacheSet(cacheKey, { processedAt: Date.now(), event: event.event }, 86400);

  console.log(`[Webhook] Processing Razorpay Event: ${event.event} (${eventId})`);

  switch (event.event) {
    case 'payment.captured': {
      const payment = event.payload?.payment?.entity;
      return res.status(200).json({
        status: 'ok',
        action: 'ESCROW_FUNDED',
        paymentId: payment?.id,
        amount: payment?.amount
      });
    }
    case 'transfer.processed': {
      const transfer = event.payload?.transfer?.entity;
      return res.status(200).json({
        status: 'ok',
        action: 'PAYOUT_DISBURSED',
        transferId: transfer?.id,
        recipient: transfer?.recipient
      });
    }
    case 'dispute.created': {
      const dispute = event.payload?.dispute?.entity;
      return res.status(200).json({
        status: 'ok',
        action: 'ESCROW_LOCKED_FOR_DISPUTE',
        disputeId: dispute?.id
      });
    }
    default:
      return res.status(200).json({ status: 'ok', action: 'IGNORED', event: event.event });
  }
});

module.exports = router;
