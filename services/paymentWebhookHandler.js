import crypto from 'crypto';

/**
 * Payment Gateway Webhook Verification & Processing Service
 * Compatible with Razorpay Route, Cashfree Easy Split, and Stripe Connect
 */

/**
 * Verifies Razorpay Webhook Signature using HMAC-SHA256
 * @param {string} rawBody - Raw request body payload string
 * @param {string} signature - Header 'X-Razorpay-Signature'
 * @param {string} webhookSecret - Secret configured in Razorpay dashboard
 * @returns {boolean}
 */
export function verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret) {
    if (!rawBody || !signature || !webhookSecret) return false;
    try {
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');
        return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
    } catch (e) {
        console.error('Webhook signature verification error:', e);
        return false;
    }
}

/**
 * Processes standard incoming webhook events
 * @param {Object} event - Decoded Webhook JSON payload
 */
export function handleWebhookEvent(event) {
    const { event: eventType, payload } = event;

    switch (eventType) {
        case 'payment.captured': {
            const payment = payload.payment.entity;
            console.log(`[Webhook] Payment Captured: ${payment.id} for ₹${payment.amount / 100}`);
            return {
                status: 'SUCCESS',
                action: 'UPDATE_BOOKING_STATUS',
                bookingId: payment.notes?.booking_id,
                amountRupees: payment.amount / 100,
                paymentId: payment.id,
            };
        }

        case 'transfer.processed': {
            const transfer = payload.transfer.entity;
            console.log(`[Webhook] Split Transfer Settled: ${transfer.id} to ${transfer.account} (₹${transfer.amount / 100})`);
            return {
                status: 'SUCCESS',
                action: 'CREDIT_TECHNICIAN_WALLET',
                technicianAccount: transfer.account,
                amountRupees: transfer.amount / 100,
                transferId: transfer.id,
            };
        }

        case 'transfer.failed': {
            const transfer = payload.transfer.entity;
            console.error(`[Webhook] Transfer Failed: ${transfer.id} - ${transfer.error_description}`);
            return {
                status: 'FAILED',
                action: 'NOTIFY_FINANCE_TEAM',
                error: transfer.error_description,
                technicianAccount: transfer.account,
            };
        }

        case 'dispute.created': {
            const dispute = payload.dispute.entity;
            console.warn(`[Webhook] Customer Dispute Created: ${dispute.id} - Locking Escrow`);
            return {
                status: 'DISPUTE_LOCKED',
                action: 'FREEZE_ESCROW_AND_TECH_STATUS',
                paymentId: dispute.payment_id,
                disputeId: dispute.id,
            };
        }

        case 'refund.processed': {
            const refund = payload.refund.entity;
            console.log(`[Webhook] Refund Processed: ${refund.id} for ₹${refund.amount / 100}`);
            return {
                status: 'REFUNDED',
                action: 'UPDATE_CUSTOMER_REFUND_STATUS',
                refundId: refund.id,
                amountRupees: refund.amount / 100,
            };
        }

        default:
            return { status: 'IGNORED', action: 'NO_OP', eventType };
    }
}
