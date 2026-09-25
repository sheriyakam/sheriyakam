const { test, describe } = require('node:test');
const assert = require('assert');
const crypto = require('crypto');

const {
    rupeesToPaise,
    calculateSplitBreakdown,
    buildSplitOrderPayload,
    COMMISSION_RATE,
    GST_RATE
} = require('../utils/paymentSplit');

const {
    verifyRazorpayWebhookSignature,
    handleWebhookEvent
} = require('../services/paymentWebhookHandler');

describe('Payment Split, Tax Accounting & Razorpay Route Engine', () => {
    test('rupeesToPaise converts INR amounts to paise without floating-point inaccuracies', () => {
        assert.strictEqual(rupeesToPaise(100), 10000);
        assert.strictEqual(rupeesToPaise(49.50), 4950);
        assert.strictEqual(rupeesToPaise(730.25), 73025);
        assert.strictEqual(rupeesToPaise('299.00'), 29900);
    });

    test('calculateSplitBreakdown calculates exact GST, labor splits, and technician payouts', () => {
        const breakdown = calculateSplitBreakdown({
            laborCharge: 400.00,
            platformFee: 29.00,
            materialsCharge: 300.00,
            travelAllowance: 50.00
        });

        // 1. Service subtotal = 400 + 29 = 429
        assert.strictEqual(breakdown.subtotalService, 429.00);

        // 2. Tax calculations (9% CGST + 9% SGST)
        const expectedServiceTax = 38.61 + 38.61; // 77.22
        assert.strictEqual(breakdown.cgstService, 38.61);
        assert.strictEqual(breakdown.sgstService, 38.61);

        // 3. Materials Tax (18% on 300 = 54)
        assert.strictEqual(breakdown.cgstMaterials, 27.00);
        assert.strictEqual(breakdown.sgstMaterials, 27.00);
        assert.strictEqual(breakdown.totalTax, 77.22 + 54.00);

        // 4. Technician share: 85% of labor (340) + 100% materials (300) + 100% travel (50) = 690.00
        assert.strictEqual(breakdown.technicianShareRupees, 690.00);

        // 5. Grand total = subtotal (429) + materials (300) + tax (131.22) + travel (50) = 910.22 -> rounded to 910
        assert.strictEqual(breakdown.grandTotal, 910);

        // 6. Platform share = grand total (910) - technician share (690) = 220.00
        assert.strictEqual(breakdown.platformShareRupees, 220.00);

        // 7. Paise conversion consistency
        assert.strictEqual(breakdown.grandTotalPaise, 91000);
        assert.strictEqual(breakdown.technicianSharePaise, 69000);
        assert.strictEqual(breakdown.platformSharePaise, 22000);
    });

    test('buildSplitOrderPayload generates structured Razorpay Route escrow payload', () => {
        const breakdown = calculateSplitBreakdown({
            laborCharge: 500,
            platformFee: 29,
            materialsCharge: 150,
            travelAllowance: 0
        });

        const payload = buildSplitOrderPayload({
            orderId: 'order_sk_test_123',
            technicianAccountId: 'acc_tech_amal_8819',
            corporateAccountId: 'acc_sheriyakam_corp',
            isHighRiskJob: true,
            breakdown
        });

        assert.strictEqual(payload.order_id, 'order_sk_test_123');
        assert.strictEqual(payload.currency, 'INR');
        assert.strictEqual(payload.transfers.length, 2);

        const techTransfer = payload.transfers[0];
        assert.strictEqual(techTransfer.account, 'acc_tech_amal_8819');
        assert.strictEqual(techTransfer.on_hold, true, 'High-risk job must hold technician payout in escrow');

        const platformTransfer = payload.transfers[1];
        assert.strictEqual(platformTransfer.account, 'acc_sheriyakam_corp');
        assert.strictEqual(platformTransfer.on_hold, false);
    });
});

describe('Payment Webhook Handler & Security Verification', () => {
    const SECRET = 'whsec_prod_sheriyakam_secure_key_9921';

    test('verifyRazorpayWebhookSignature validates genuine HMAC-SHA256 signatures and rejects forged ones', () => {
        const body = JSON.stringify({ event: 'payment.captured', id: 'pay_998811' });
        const validSig = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
        const forgedSig = crypto.createHmac('sha256', 'wrong_secret').update(body).digest('hex');

        assert.strictEqual(verifyRazorpayWebhookSignature(body, validSig, SECRET), true);
        assert.strictEqual(verifyRazorpayWebhookSignature(body, forgedSig, SECRET), false);
        assert.strictEqual(verifyRazorpayWebhookSignature('', validSig, SECRET), false);
        assert.strictEqual(verifyRazorpayWebhookSignature(body, '', SECRET), false);
    });

    test('handleWebhookEvent processes payment.captured, transfer.processed, and dispute.created events', () => {
        // 1. Payment Captured
        const captureEvent = {
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        id: 'pay_123456',
                        amount: 49000,
                        notes: { booking_id: 'BK-KL-8921' }
                    }
                }
            }
        };
        const captureRes = handleWebhookEvent(captureEvent);
        assert.strictEqual(captureRes.status, 'SUCCESS');
        assert.strictEqual(captureRes.action, 'UPDATE_BOOKING_STATUS');
        assert.strictEqual(captureRes.bookingId, 'BK-KL-8921');
        assert.strictEqual(captureRes.amountRupees, 490);

        // 2. Transfer Settled
        const transferEvent = {
            event: 'transfer.processed',
            payload: {
                transfer: {
                    entity: {
                        id: 'trf_998811',
                        account: 'acc_tech_rajesh_55',
                        amount: 38000
                    }
                }
            }
        };
        const transferRes = handleWebhookEvent(transferEvent);
        assert.strictEqual(transferRes.status, 'SUCCESS');
        assert.strictEqual(transferRes.action, 'CREDIT_TECHNICIAN_WALLET');
        assert.strictEqual(transferRes.amountRupees, 380);

        // 3. Customer Dispute
        const disputeEvent = {
            event: 'dispute.created',
            payload: {
                dispute: {
                    id: 'disp_773322',
                    payment_id: 'pay_123456'
                }
            }
        };
        const disputeRes = handleWebhookEvent(disputeEvent);
        assert.strictEqual(disputeRes.status, 'DISPUTE_LOCKED');
        assert.strictEqual(disputeRes.action, 'FREEZE_ESCROW_AND_TECH_STATUS');
        assert.strictEqual(disputeRes.disputeId, 'disp_773322');

        // 4. Refund Processed
        const refundEvent = {
            event: 'refund.processed',
            payload: {
                refund: {
                    id: 'rfnd_554433',
                    amount: 49000
                }
            }
        };
        const refundRes = handleWebhookEvent(refundEvent);
        assert.strictEqual(refundRes.status, 'REFUNDED');
        assert.strictEqual(refundRes.amountRupees, 490);
    });
});
