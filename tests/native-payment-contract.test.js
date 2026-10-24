/**
 * Native Razorpay Payment Processor Contract Test Suite
 * Verifies payload construction, parameter validation, and payment state transitions.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

class NativePaymentContract {
  static buildCheckoutOptions(order, keyId) {
    if (!order.orderId || !order.orderId.startsWith('order_')) {
      throw new Error('Invalid Razorpay Order ID format');
    }
    if (!order.amountPaise || order.amountPaise <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    return {
      key: keyId,
      amount: order.amountPaise,
      currency: order.currency || 'INR',
      name: 'Sheriyakam Services',
      description: order.description || 'Electrical Emergency Service Booking',
      order_id: order.orderId,
      prefill: {
        contact: order.customerPhone || '',
        email: order.customerEmail || '',
      },
      theme: {
        color: '#0F172A',
      },
      retry: {
        enabled: true,
        max_count: 3,
      },
      notes: order.notes || {},
    };
  }

  static verifyPaymentSignature(orderId, paymentId, signature, secret) {
    const text = `${orderId}|${paymentId}`;
    const generated = crypto.createHmac('sha256', secret).update(text).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(generated, 'utf8'));
  }
}

describe('Native Razorpay Checkout Contract & Signature Verification', () => {
  const MOCK_KEY = 'rzp_test_1234567890';
  const MOCK_SECRET = 'mock_secret_key_sheriyakam_9988';

  it('builds standard native Razorpay checkout options successfully', () => {
    const order = {
      orderId: 'order_test_99881122',
      amountPaise: 49000,
      currency: 'INR',
      customerPhone: '+919876543210',
      customerEmail: 'kerala.customer@sheriyakam.com',
      description: 'Ceiling Fan Rewinding Service',
      notes: { district: 'Ernakulam', taluk: 'Kanayannur' },
    };

    const options = NativePaymentContract.buildCheckoutOptions(order, MOCK_KEY);
    assert.strictEqual(options.key, MOCK_KEY);
    assert.strictEqual(options.amount, 49000);
    assert.strictEqual(options.order_id, 'order_test_99881122');
    assert.strictEqual(options.prefill.contact, '+919876543210');
    assert.strictEqual(options.theme.color, '#0F172A');
    assert.strictEqual(options.notes.district, 'Ernakulam');
  });

  it('throws validation error if order_id is missing or invalid', () => {
    const invalidOrder = {
      orderId: 'invalid_id',
      amountPaise: 25000,
    };
    assert.throws(
      () => NativePaymentContract.buildCheckoutOptions(invalidOrder, MOCK_KEY),
      /Invalid Razorpay Order ID format/
    );
  });

  it('throws validation error if amountPaise is zero or negative', () => {
    const zeroAmountOrder = {
      orderId: 'order_valid_12345',
      amountPaise: 0,
    };
    assert.throws(
      () => NativePaymentContract.buildCheckoutOptions(zeroAmountOrder, MOCK_KEY),
      /Payment amount must be greater than zero/
    );
  });

  it('verifies genuine Razorpay HMAC-SHA256 signature with timing-safe comparison', () => {
    const orderId = 'order_test_99881122';
    const paymentId = 'pay_succ_11223344';
    const validSignature = crypto
      .createHmac('sha256', MOCK_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = NativePaymentContract.verifyPaymentSignature(
      orderId,
      paymentId,
      validSignature,
      MOCK_SECRET
    );
    assert.strictEqual(isValid, true);
  });

  it('rejects forged payment signature', () => {
    const orderId = 'order_test_99881122';
    const paymentId = 'pay_succ_11223344';
    const forgedSignature = '0000000000000000000000000000000000000000000000000000000000000000';

    const isValid = NativePaymentContract.verifyPaymentSignature(
      orderId,
      paymentId,
      forgedSignature,
      MOCK_SECRET
    );
    assert.strictEqual(isValid, false);
  });
});
