/**
 * Offline Sync Coordinator Test Suite
 * Verifies background queue reconciliation, exponential backoff, and idempotent completion.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

class OfflineSyncCoordinator {
  static MAX_RETRIES = 5;

  static calculateBackoffMs(retryCount) {
    const baseMs = 1000;
    const exponent = Math.min(retryCount, 6);
    return Math.pow(2, exponent) * baseMs;
  }

  static async reconcileBatch(queue, mockApiSender) {
    const pendingItems = queue.filter(
      (m) => m.status === 'PENDING' || (m.status === 'FAILED' && m.retryCount < this.MAX_RETRIES)
    );

    let syncedCount = 0;
    let failedCount = 0;

    for (const mutation of pendingItems) {
      mutation.status = 'SYNCING';
      try {
        const success = await mockApiSender(mutation);
        if (success) {
          mutation.status = 'SYNCED';
          mutation.syncedAtTimestamp = Date.now();
          syncedCount++;
        } else {
          mutation.status = 'FAILED';
          mutation.retryCount++;
          failedCount++;
        }
      } catch (err) {
        mutation.status = 'FAILED';
        mutation.retryCount++;
        failedCount++;
      }
    }

    return { syncedCount, failedCount, remainingPending: queue.filter((m) => m.status !== 'SYNCED').length };
  }
}

describe('Offline Sync Coordinator & Background Reconciliation Engine', () => {
  it('calculates exponential backoff progression accurately', () => {
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(0), 1000);
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(1), 2000);
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(2), 4000);
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(3), 8000);
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(4), 16000);
    assert.strictEqual(OfflineSyncCoordinator.calculateBackoffMs(5), 32000);
  });

  it('reconciles pending mutations and transitions status to SYNCED', async () => {
    const queue = [
      { id: '1', endpoint: '/api/v1/bookings', status: 'PENDING', retryCount: 0 },
      { id: '2', endpoint: '/api/v1/otp/verify', status: 'PENDING', retryCount: 0 },
    ];

    const result = await OfflineSyncCoordinator.reconcileBatch(queue, async () => true);

    assert.strictEqual(result.syncedCount, 2);
    assert.strictEqual(result.failedCount, 0);
    assert.strictEqual(result.remainingPending, 0);
    assert.strictEqual(queue[0].status, 'SYNCED');
    assert.strictEqual(queue[1].status, 'SYNCED');
    assert.ok(queue[0].syncedAtTimestamp > 0);
  });

  it('increments retryCount on API failure and marks status FAILED', async () => {
    const queue = [
      { id: '1', endpoint: '/api/v1/disputes', status: 'PENDING', retryCount: 0 },
    ];

    const result = await OfflineSyncCoordinator.reconcileBatch(queue, async () => false);

    assert.strictEqual(result.syncedCount, 0);
    assert.strictEqual(result.failedCount, 1);
    assert.strictEqual(result.remainingPending, 1);
    assert.strictEqual(queue[0].status, 'FAILED');
    assert.strictEqual(queue[0].retryCount, 1);
  });

  it('quarantines mutation after reaching MAX_RETRIES (5 retries)', async () => {
    const queue = [
      { id: 'exhausted', endpoint: '/api/v1/bad-request', status: 'FAILED', retryCount: 5 },
      { id: 'fresh', endpoint: '/api/v1/bookings', status: 'PENDING', retryCount: 0 },
    ];

    const result = await OfflineSyncCoordinator.reconcileBatch(queue, async () => true);

    // exhausted item is skipped because retryCount >= MAX_RETRIES
    assert.strictEqual(result.syncedCount, 1);
    assert.strictEqual(queue[0].status, 'FAILED');
    assert.strictEqual(queue[0].retryCount, 5);
    assert.strictEqual(queue[1].status, 'SYNCED');
  });

  it('handles partial batch network failures gracefully', async () => {
    const queue = [
      { id: 'item1', endpoint: '/api/v1/bookings', status: 'PENDING', retryCount: 0 },
      { id: 'item2', endpoint: '/api/v1/bookings', status: 'PENDING', retryCount: 0 },
      { id: 'item3', endpoint: '/api/v1/bookings', status: 'PENDING', retryCount: 0 },
    ];

    let callCount = 0;
    const result = await OfflineSyncCoordinator.reconcileBatch(queue, async () => {
      callCount++;
      return callCount !== 2; // item2 fails
    });

    assert.strictEqual(result.syncedCount, 2);
    assert.strictEqual(result.failedCount, 1);
    assert.strictEqual(queue[0].status, 'SYNCED');
    assert.strictEqual(queue[1].status, 'FAILED');
    assert.strictEqual(queue[2].status, 'SYNCED');
  });
});
