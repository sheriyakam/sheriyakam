const express = require('express');
const router = express.Router();
const { cacheGet, cacheSet } = require('../utils/security');

// POST /api/v1/mutations/batch
router.post('/batch', async (req, res) => {
  const { mutations } = req.body || {};
  if (!Array.isArray(mutations)) {
    return res.status(400).json({ error: 'mutations array is required' });
  }

  // Rate/resource exhaustion guard: limit batch size to 100
  if (mutations.length > 100) {
    return res.status(413).json({ error: 'BATCH_SIZE_EXCEEDED', maxAllowed: 100 });
  }

  const results = [];
  for (const item of mutations) {
    if (!item.idempotencyKey) {
      results.push({ id: item.id, status: 'REJECTED', reason: 'MISSING_IDEMPOTENCY_KEY' });
      continue;
    }

    const cacheKey = `mutation:idempotency:${item.idempotencyKey}`;
    const alreadyProcessed = await cacheGet(cacheKey);

    if (alreadyProcessed) {
      results.push({ id: item.id, status: 'ALREADY_SYNCED', idempotencyKey: item.idempotencyKey });
      continue;
    }

    // Cache with 7-day TTL (604800s) to prevent replay
    await cacheSet(cacheKey, { syncedAt: Date.now(), id: item.id }, 604800);
    results.push({ id: item.id, status: 'SYNCED', idempotencyKey: item.idempotencyKey });
  }

  const syncedCount = results.filter((r) => r.status === 'SYNCED' || r.status === 'ALREADY_SYNCED').length;

  return res.json({
    total: mutations.length,
    synced: syncedCount,
    results
  });
});

module.exports = router;
