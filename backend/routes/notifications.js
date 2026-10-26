const express = require('express');
const router = express.Router();
const pushDispatcher = require('../services/pushNotificationDispatcher');

const ALLOWED_PLATFORMS = new Set(['android', 'ios']);
const ALLOWED_CATEGORIES = new Set([
  'DISPATCH_ASSIGNED',
  'SLA_WARNING',
  'TECH_ARRIVED',
  'PAYMENT_CONFIRMED',
  'DISPUTE_ALERT',
  'EMERGENCY_BROADCAST'
]);

// POST /api/notifications/register-token
router.post('/register-token', (req, res) => {
  const { userId, token, platform } = req.body || {};
  if (!userId || !token || !platform) {
    return res.status(400).json({ error: 'userId, token, and platform are required' });
  }

  const normalizedPlatform = String(platform).toLowerCase();
  if (!ALLOWED_PLATFORMS.has(normalizedPlatform)) {
    return res.status(400).json({ error: 'INVALID_PLATFORM', allowed: ['android', 'ios'] });
  }

  if (typeof token !== 'string' || token.length < 10 || token.length > 4096) {
    return res.status(400).json({ error: 'INVALID_TOKEN_FORMAT' });
  }

  try {
    const result = pushDispatcher.registerDeviceToken(userId, token, normalizedPlatform);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications/dispatch-alert
router.post('/dispatch-alert', (req, res) => {
  const { userId, title, body, category, bookingId, data } = req.body || {};
  if (!userId || !title || !body) {
    return res.status(400).json({ error: 'userId, title, and body are required' });
  }

  // Length guards
  if (title.length > 150 || body.length > 1000) {
    return res.status(400).json({ error: 'PAYLOAD_LENGTH_EXCEEDED', maxTitle: 150, maxBody: 1000 });
  }

  const normalizedCategory = category && ALLOWED_CATEGORIES.has(category) ? category : 'DISPATCH_ASSIGNED';

  const result = pushDispatcher.dispatchNotification(userId, {
    title: String(title).trim(),
    body: String(body).trim(),
    category: normalizedCategory,
    bookingId: bookingId ? String(bookingId).trim() : undefined,
    data: data && typeof data === 'object' ? data : {}
  });

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.json(result);
});

module.exports = router;
