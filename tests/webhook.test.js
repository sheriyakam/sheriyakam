const assert = require('assert');
const crypto = require('crypto');

console.log('--- Running Webhook Unit Tests ---');

const WEBHOOK_SECRET = 'whsec_test_secret_key_12345';

function verifySignature(payload, signature, secret) {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return expected === signature;
}

function createWebhookHandler() {
  const processedIds = new Set();
  const grantedCredits = [];

  function handleWebhook(rawBody, signature) {
    if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
      return { status: 400, error: 'Invalid signature' };
    }

    const payload = JSON.parse(rawBody);
    if (payload.event === 'payment.captured') {
      const paymentId = payload.payload.payment.entity.id;
      const userId = payload.payload.payment.entity.notes.userId;
      const packType = payload.payload.payment.entity.notes.packType;

      // Idempotency check
      if (processedIds.has(paymentId)) {
        return { status: 200, statusText: 'already_processed', paymentId };
      }

      processedIds.add(paymentId);
      const credits = packType === 'active_search' ? 75 : 25;
      grantedCredits.push({ userId, packType, credits, paymentId });

      return { status: 200, statusText: 'credited', paymentId, credits };
    }

    return { status: 200, statusText: 'ignored' };
  }

  return { handleWebhook, processedIds, grantedCredits };
}

// Test 1: Signature verification
{
  const payload = JSON.stringify({ event: 'payment.captured', id: 'evt_1' });
  const validSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  const invalidSig = 'invalid_signature_hex';

  assert.strictEqual(verifySignature(payload, validSig, WEBHOOK_SECRET), true);
  assert.strictEqual(verifySignature(payload, invalidSig, WEBHOOK_SECRET), false);
  console.log('✓ Test 1 Passed: Valid HMAC-SHA256 signature accepted, invalid rejected');
}

// Test 2: Idempotent credit delivery
{
  const handler = createWebhookHandler();
  const paymentEvent = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test_998877',
          amount: 16500,
          notes: { userId: 'user_456', packType: 'lite' }
        }
      }
    }
  };

  const rawBody = JSON.stringify(paymentEvent);
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');

  // First delivery
  const res1 = handler.handleWebhook(rawBody, signature);
  assert.strictEqual(res1.status, 200);
  assert.strictEqual(res1.statusText, 'credited');
  assert.strictEqual(handler.grantedCredits.length, 1);
  assert.strictEqual(handler.grantedCredits[0].credits, 25);

  // Duplicate replay delivery
  const res2 = handler.handleWebhook(rawBody, signature);
  assert.strictEqual(res2.status, 200);
  assert.strictEqual(res2.statusText, 'already_processed');
  // MUST NOT double grant credits!
  assert.strictEqual(handler.grantedCredits.length, 1, 'Duplicate webhook must not double-credit');

  console.log('✓ Test 2 Passed: Webhook idempotency protects against duplicate delivery replay');
}

console.log('All Webhook Unit Tests PASSED Successfully!');
