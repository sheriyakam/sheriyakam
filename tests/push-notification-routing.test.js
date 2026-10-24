/**
 * Push Notification Routing & Deep Link Engine Test Suite
 * Verifies parsing of incoming FCM/APNs remote payloads, categorization,
 * and deep link URI generation.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const NotificationCategory = {
  DISPATCH_ASSIGNED: 'DISPATCH_ASSIGNED',
  SLA_WARNING: 'SLA_WARNING',
  TECHNICIAN_ARRIVED: 'TECHNICIAN_ARRIVED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  DISPUTE_ALERT: 'DISPUTE_ALERT',
};

class PushNotificationRouter {
  static parsePayload(rawMap) {
    if (!rawMap || !rawMap.title || !rawMap.body) {
      return null;
    }

    const categoryStr = rawMap.category || 'DISPATCH_ASSIGNED';
    const category = NotificationCategory[categoryStr] || NotificationCategory.DISPATCH_ASSIGNED;

    return {
      id: rawMap.id || `notif_${Date.now()}`,
      title: rawMap.title,
      body: rawMap.body,
      category,
      bookingId: rawMap.bookingId || null,
      data: { ...rawMap },
      timestampMs: rawMap.timestampMs ? parseInt(rawMap.timestampMs, 10) : Date.now(),
    };
  }

  static generateDeepLinkUri(notification) {
    if (!notification) return 'sheriyakam://';

    switch (notification.category) {
      case NotificationCategory.DISPATCH_ASSIGNED:
      case NotificationCategory.SLA_WARNING:
      case NotificationCategory.TECHNICIAN_ARRIVED:
        return notification.bookingId
          ? `sheriyakam://tracking/${notification.bookingId}`
          : 'sheriyakam://tracking';

      case NotificationCategory.PAYMENT_CONFIRMED:
        return notification.bookingId
          ? `sheriyakam://receipt/${notification.bookingId}`
          : 'sheriyakam://';

      case NotificationCategory.DISPUTE_ALERT:
        return notification.bookingId
          ? `sheriyakam://dispute/${notification.bookingId}`
          : 'sheriyakam://support';

      default:
        return 'sheriyakam://';
    }
  }
}

describe('Push Notification Routing & Deep Link Engine', () => {
  it('parses valid remote notification payload correctly', () => {
    const raw = {
      id: 'msg_88192',
      title: 'Wireman Dispatched',
      body: 'Rajesh K (KSELB A-Grade) is en route to Kaloor, Ernakulam.',
      category: 'DISPATCH_ASSIGNED',
      bookingId: 'KL-EKM-4091',
      timestampMs: '1729810000000',
    };

    const parsed = PushNotificationRouter.parsePayload(raw);
    assert.ok(parsed !== null);
    assert.strictEqual(parsed.id, 'msg_88192');
    assert.strictEqual(parsed.title, 'Wireman Dispatched');
    assert.strictEqual(parsed.category, 'DISPATCH_ASSIGNED');
    assert.strictEqual(parsed.bookingId, 'KL-EKM-4091');
    assert.strictEqual(parsed.timestampMs, 1729810000000);
  });

  it('generates accurate tracking deep-link for dispatch and SLA alerts', () => {
    const dispatchNotif = {
      category: NotificationCategory.DISPATCH_ASSIGNED,
      bookingId: 'KL-EKM-4091',
    };
    assert.strictEqual(
      PushNotificationRouter.generateDeepLinkUri(dispatchNotif),
      'sheriyakam://tracking/KL-EKM-4091'
    );

    const slaNotif = {
      category: NotificationCategory.SLA_WARNING,
      bookingId: 'KL-TVM-8821',
    };
    assert.strictEqual(
      PushNotificationRouter.generateDeepLinkUri(slaNotif),
      'sheriyakam://tracking/KL-TVM-8821'
    );
  });

  it('generates receipt deep-link for payment confirmed notification', () => {
    const paymentNotif = {
      category: NotificationCategory.PAYMENT_CONFIRMED,
      bookingId: 'KL-KKD-1190',
    };
    assert.strictEqual(
      PushNotificationRouter.generateDeepLinkUri(paymentNotif),
      'sheriyakam://receipt/KL-KKD-1190'
    );
  });

  it('generates dispute resolution deep-link for dispute alert notification', () => {
    const disputeNotif = {
      category: NotificationCategory.DISPUTE_ALERT,
      bookingId: 'KL-TCR-3342',
    };
    assert.strictEqual(
      PushNotificationRouter.generateDeepLinkUri(disputeNotif),
      'sheriyakam://dispute/KL-TCR-3342'
    );
  });

  it('rejects malformed payload missing mandatory title or body', () => {
    const malformed = { category: 'DISPATCH_ASSIGNED', bookingId: '123' };
    const result = PushNotificationRouter.parsePayload(malformed);
    assert.strictEqual(result, null);
  });
});
