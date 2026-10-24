const express = require('express');
const router = express.Router();
const pushDispatcher = require('../services/pushNotificationDispatcher');

// POST /api/notifications/register-token
router.post('/register-token', (req, res) => {
  const { userId, token, platform } = req.body;
  if (!userId || !token || !platform) {
    return res.status(400).json({ error: 'userId, token, and platform are required' });
  }

  try {
    const result = pushDispatcher.registerDeviceToken(userId, token, platform);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications/dispatch-alert
router.post('/dispatch-alert', (req, res) => {
  const { userId, title, body, category, bookingId, data } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ error: 'userId, title, and body are required' });
  }

  const result = pushDispatcher.dispatchNotification(userId, {
    title,
    body,
    category: category || 'DISPATCH_ASSIGNED',
    bookingId,
    data: data || {}
  });

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.json(result);
});

module.exports = router;
