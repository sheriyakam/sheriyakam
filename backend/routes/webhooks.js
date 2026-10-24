const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_prod_sheriyakam_kerala_2026';
const processedEvents = new Set();

function verifyRazorpaySignature(rawBody, signatureHeader, secret) {
  if (!rawBody || !signatureHeader) return false;
  const generated = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signatureHeader, 'utf8'), Buffer.from(generated, 'utf8'));
  } catch {
    return false;
  }
}

// POST /api/webhooks/razorpay
router.post('/razorpay', express.raw({ type: '*/*' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'] || '';
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);

  if (!verifyRazorpaySignature(rawBody, signature, WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'INVALID_SIGNATURE' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'MALFORMED_JSON_PAYLOAD' });
  }

  const eventId = event.id || event.payload?.payment?.entity?.id || `evt_${Date.now()}`;
  if (processedEvents.has(eventId)) {
    return res.status(200).json({ status: 'ok', action: 'IDEMPOTENT_SKIPPED', eventId });
  }
  processedEvents.add(eventId);

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
