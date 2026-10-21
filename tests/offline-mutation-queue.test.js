const test = require('node:test');
const assert = require('node:assert');
const { OfflineMutationQueue, MutationStatus } = require('../utils/offlineQueue');

test('Offline Mutation Queue — Contract and State Transition Verification', async (t) => {
    await t.test('Enqueues mutations with default PENDING status and idempotency key', () => {
        const queue = new OfflineMutationQueue();
        const mutation = queue.enqueue('/api/leads', 'POST', { name: 'Sujith Kumar', phone: '+919447012345' });

        assert.ok(mutation.id, 'Mutation must have a valid ID');
        assert.ok(mutation.idempotencyKey, 'Mutation must have an idempotency key');
        assert.strictEqual(mutation.status, MutationStatus.PENDING);
        assert.strictEqual(mutation.retryCount, 0);
        assert.strictEqual(queue.getPending().length, 1);
    });

    await t.test('Maintains FIFO ordering and deduplicates by idempotency key', () => {
        const queue = new OfflineMutationQueue();
        const m1 = queue.enqueue('/api/leads', 'POST', { item: 1 }, 'key-1');
        const m2 = queue.enqueue('/api/leads', 'POST', { item: 2 }, 'key-2');
        const m1Duplicate = queue.enqueue('/api/leads', 'POST', { item: 1 }, 'key-1');

        assert.strictEqual(m1.id, m1Duplicate.id, 'Duplicate idempotency key returns existing mutation');
        const pending = queue.getPending();
        assert.strictEqual(pending.length, 2);
        assert.strictEqual(pending[0].id, m1.id);
        assert.strictEqual(pending[1].id, m2.id);
    });

    await t.test('Supports status transitions: SYNCING, FAILED with retry, and SYNCED', () => {
        const queue = new OfflineMutationQueue();
        const mutation = queue.enqueue('/api/leads', 'POST', { test: true });

        queue.markSyncing(mutation.id);
        assert.strictEqual(queue.getById(mutation.id).status, MutationStatus.SYNCING);

        queue.markFailed(mutation.id, '503 Service Unavailable');
        const failed = queue.getById(mutation.id);
        assert.strictEqual(failed.status, MutationStatus.FAILED);
        assert.strictEqual(failed.retryCount, 1);
        assert.strictEqual(failed.lastError, '503 Service Unavailable');

        queue.markSynced(mutation.id);
        assert.strictEqual(queue.getById(mutation.id).status, MutationStatus.SYNCED);
        assert.strictEqual(queue.getPending().length, 0);
    });

    await t.test('Serializes to JSON and restores state with identical structure', () => {
        const queue = new OfflineMutationQueue();
        queue.enqueue('/api/leads', 'POST', { bookingId: 'b-99' }, 'idemp-custom-key');
        const serialized = queue.serialize();

        const restored = new OfflineMutationQueue();
        restored.deserialize(serialized);

        const pending = restored.getPending();
        assert.strictEqual(pending.length, 1);
        assert.strictEqual(pending[0].endpoint, '/api/leads');
        assert.strictEqual(pending[0].idempotencyKey, 'idemp-custom-key');
        assert.strictEqual(pending[0].status, MutationStatus.PENDING);
    });
});
