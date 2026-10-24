/**
 * Backend Services, Webhooks & Offline Batch Sync Test Suite
 * Tests server-side push token registration, notification dispatching,
 * Razorpay webhook idempotency/signature verification, and offline mutation batch synchronization.
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

// Server-side Push Notification Dispatcher Mirror
class PushNotificationDispatcher {
  constructor() {
    this.deviceTokens = new Map(); // userId -> { token, platform, updatedAt }
    this.dispatchedLogs = [];
  }

  registerDeviceToken(userId, token, platform) {
    if (!userId || !token || !platform) {
      throw new Error('userId, token, and platform are required');
    }
    const record = { token, platform: platform.toLowerCase(), updatedAt: Date.now() };
    this.deviceTokens.set(userId, record);
    return { success: true, registeredUserId: userId, platform: record.platform };
  }

  getDeviceToken(userId) {
    return this.deviceTokens.get(userId) || null;
  }

  dispatchNotification(userId, { title, body, category, bookingId, data = {} }) {
    const device = this.deviceTokens.get(userId);
    if (!device) {
      return { success: false, reason: 'DEVICE_NOT_REGISTERED' };
    }

    const payload = {
      to: device.token,
      platform: device.platform,
      notification: { title, body },
      data: {
        category,
        bookingId: bookingId || '',
        ...data,
      },
      timestampMs: Date.now(),
    };

    this.dispatchedLogs.push(payload);
    return { success: true, messageId: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}` };
  }
}

// Server-side Razorpay Webhook Processor Mirror
class RazorpayWebhookProcessor {
  constructor(secret) {
    this.secret = secret;
    this.processedEvents = new Set();
  }

  verifySignature(rawBody, signatureHeader) {
    if (!rawBody || !signatureHeader) return false;
    const generated = crypto.createHmac('sha256', this.secret).update(rawBody).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signatureHeader, 'utf8'), Buffer.from(generated, 'utf8'));
    } catch {
      return false;
    }
  }

  processEvent(rawBody, signatureHeader) {
    if (!this.verifySignature(rawBody, signatureHeader)) {
      return { status: 400, error: 'INVALID_SIGNATURE' };
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id || (event.payload?.payment?.entity?.id);

    if (this.processedEvents.has(eventId)) {
      return { status: 200, action: 'IDEMPOTENT_SKIPPED', eventId };
    }

    this.processedEvents.add(eventId);

    switch (event.event) {
      case 'payment.captured':
        return {
          status: 200,
          action: 'ESCROW_FUNDED',
          paymentId: event.payload.payment.entity.id,
          amount: event.payload.payment.entity.amount,
        };
      case 'transfer.processed':
        return {
          status: 200,
          action: 'PAYOUT_DISBURSED',
          transferId: event.payload.transfer.entity.id,
          recipient: event.payload.transfer.entity.recipient,
        };
      case 'dispute.created':
        return {
          status: 200,
          action: 'ESCROW_LOCKED_FOR_DISPUTE',
          disputeId: event.payload.dispute.entity.id,
        };
      default:
        return { status: 200, action: 'IGNORED', eventType: event.event };
    }
  }
}

// Server-side Offline Mutation Batch Handler Mirror
class OfflineBatchReconciler {
  constructor() {
    this.processedIdempotencyKeys = new Set();
    this.reconciledCount = 0;
  }

  processBatch(mutations) {
    if (!Array.isArray(mutations)) {
      throw new Error('mutations must be an array');
    }

    const results = [];

    for (const item of mutations) {
      if (!item.idempotencyKey) {
        results.push({ id: item.id, status: 'REJECTED', reason: 'MISSING_IDEMPOTENCY_KEY' });
        continue;
      }

      if (this.processedIdempotencyKeys.has(item.idempotencyKey)) {
        results.push({ id: item.id, status: 'ALREADY_SYNCED', idempotencyKey: item.idempotencyKey });
        continue;
      }

      this.processedIdempotencyKeys.add(item.idempotencyKey);
      this.reconciledCount++;
      results.push({ id: item.id, status: 'SYNCED', idempotencyKey: item.idempotencyKey });
    }

    return {
      total: mutations.length,
      synced: results.filter((r) => r.status === 'SYNCED' || r.status === 'ALREADY_SYNCED').length,
      results,
    };
  }
}

describe('Backend Services, Webhooks & Offline Batch Sync', () => {
  let pushDispatcher;
  let webhookProcessor;
  let batchReconciler;
  const SECRET = 'whsec_prod_sheriyakam_kerala_2026';

  beforeEach(() => {
    pushDispatcher = new PushNotificationDispatcher();
    webhookProcessor = new RazorpayWebhookProcessor(SECRET);
    batchReconciler = new OfflineBatchReconciler();
  });

  it('registers device token and successfully delivers push notification', () => {
    const reg = pushDispatcher.registerDeviceToken('user_tech_rajesh', 'fcm_token_device_abc123', 'Android');
    assert.strictEqual(reg.success, true);
    assert.strictEqual(reg.platform, 'android');

    const result = pushDispatcher.dispatchNotification('user_tech_rajesh', {
      title: 'Emergency Wireman Dispatch',
      body: 'New booking in Aluva, Ernakulam. 90-min SLA timer started.',
      category: 'DISPATCH_ASSIGNED',
      bookingId: 'BK-EKM-9901',
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(pushDispatcher.dispatchedLogs.length, 1);
    assert.strictEqual(pushDispatcher.dispatchedLogs[0].to, 'fcm_token_device_abc123');
    assert.strictEqual(pushDispatcher.dispatchedLogs[0].data.category, 'DISPATCH_ASSIGNED');
  });

  it('returns failure when attempting to notify an unregistered device', () => {
    const result = pushDispatcher.dispatchNotification('unregistered_user', {
      title: 'Alert',
      body: 'Message',
      category: 'SLA_WARNING',
    });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.reason, 'DEVICE_NOT_REGISTERED');
  });

  it('processes genuine Razorpay payment.captured webhook and funds escrow', () => {
    const body = JSON.stringify({
      id: 'evt_pay_cap_123',
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_kl_49000',
            amount: 49000,
          },
        },
      },
    });

    const sig = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
    const outcome = webhookProcessor.processEvent(body, sig);

    assert.strictEqual(outcome.status, 200);
    assert.strictEqual(outcome.action, 'ESCROW_FUNDED');
    assert.strictEqual(outcome.paymentId, 'pay_kl_49000');
    assert.strictEqual(outcome.amount, 49000);
  });

  it('locks escrow when customer dispute webhook is received and rejects duplicate replay', () => {
    const body = JSON.stringify({
      id: 'evt_disp_created_7788',
      event: 'dispute.created',
      payload: {
        dispute: {
          entity: {
            id: 'disp_kl_998811',
          },
        },
      },
    });

    const sig = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
    const outcome1 = webhookProcessor.processEvent(body, sig);
    assert.strictEqual(outcome1.status, 200);
    assert.strictEqual(outcome1.action, 'ESCROW_LOCKED_FOR_DISPUTE');

    // Duplicate event delivery should be skipped idempotently
    const outcome2 = webhookProcessor.processEvent(body, sig);
    assert.strictEqual(outcome2.status, 200);
    assert.strictEqual(outcome2.action, 'IDEMPOTENT_SKIPPED');
  });

  it('reconciles offline mutation batch and handles idempotent re-submissions', () => {
    const batch = [
      { id: '1', idempotencyKey: 'idemp_bkg_100', endpoint: '/api/v1/bookings' },
      { id: '2', idempotencyKey: 'idemp_otp_200', endpoint: '/api/v1/otp/check-in' },
      { id: '3', idempotencyKey: 'idemp_bkg_100', endpoint: '/api/v1/bookings' }, // duplicate in same or later batch
    ];

    const res = batchReconciler.processBatch(batch);
    assert.strictEqual(res.total, 3);
    assert.strictEqual(res.synced, 3);
    assert.strictEqual(res.results[0].status, 'SYNCED');
    assert.strictEqual(res.results[1].status, 'SYNCED');
    assert.strictEqual(res.results[2].status, 'ALREADY_SYNCED');
  });
});
