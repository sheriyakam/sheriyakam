/**
 * Push Notification Dispatcher Service
 * Maintains device token registry and coordinates remote notification dispatches to Android (FCM) & iOS (APNs).
 */

class PushNotificationDispatcher {
  constructor() {
    this.deviceTokens = new Map();
    this.dispatchedLogs = [];
  }

  registerDeviceToken(userId, token, platform) {
    if (!userId || !token || !platform) {
      throw new Error('userId, token, and platform are required');
    }
    const record = {
      token,
      platform: platform.toLowerCase(),
      updatedAt: Date.now()
    };
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
        ...data
      },
      timestampMs: Date.now()
    };

    this.dispatchedLogs.push(payload);
    console.log(`[PushDispatcher] Dispatched ${category} to ${userId} (${device.platform}): "${title}"`);

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
  }
}

module.exports = new PushNotificationDispatcher();
