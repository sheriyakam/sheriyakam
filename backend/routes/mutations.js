const express = require('express');
const router = express.Router();

const processedIdempotencyKeys = new Set();

// POST /api/v1/mutations/batch
router.post('/batch', (req, res) => {
  const { mutations } = req.body;
  if (!Array.isArray(mutations)) {
    return res.status(400).json({ error: 'mutations array is required' });
  }

  const results = [];
  for (const item of mutations) {
    if (!item.idempotencyKey) {
      results.push({ id: item.id, status: 'REJECTED', reason: 'MISSING_IDEMPOTENCY_KEY' });
      continue;
    }

    if (processedIdempotencyKeys.has(item.idempotencyKey)) {
      results.push({ id: item.id, status: 'ALREADY_SYNCED', idempotencyKey: item.idempotencyKey });
      continue;
    }

    processedIdempotencyKeys.add(item.idempotencyKey);
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
