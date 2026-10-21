/**
 * Offline Mutation Queue
 * JavaScript / Node counterpart to Kotlin Multiplatform OfflineMutationQueue
 * Guarantees idempotency and safe offline storage for mobile web & native clients.
 */

const MutationStatus = {
    PENDING: 'PENDING',
    SYNCING: 'SYNCING',
    SYNCED: 'SYNCED',
    FAILED: 'FAILED'
};

class OfflineMutationQueue {
    constructor() {
        this.queue = [];
    }

    _generateId(prefix = 'mut') {
        const rand = Math.floor(100000 + Math.random() * 900000);
        return `${prefix}_${Date.now()}_${rand}`;
    }

    enqueue(endpoint, httpMethod, payload, idempotencyKey = null) {
        const key = idempotencyKey || this._generateId('idemp');
        const existing = this.queue.find(m => m.idempotencyKey === key);
        if (existing) {
            return existing;
        }

        const mutation = {
            id: this._generateId('mut'),
            endpoint,
            httpMethod,
            payload: typeof payload === 'string' ? JSON.parse(payload) : payload,
            idempotencyKey: key,
            createdAtTimestamp: Date.now(),
            retryCount: 0,
            status: MutationStatus.PENDING,
            lastError: null
        };

        this.queue.push(mutation);
        return mutation;
    }

    getPending() {
        return this.queue.filter(m => m.status === MutationStatus.PENDING || m.status === MutationStatus.FAILED);
    }

    getAll() {
        return [...this.queue];
    }

    getById(id) {
        return this.queue.find(m => m.id === id) || null;
    }

    markSyncing(id) {
        const item = this.getById(id);
        if (item) {
            item.status = MutationStatus.SYNCING;
        }
    }

    markSynced(id) {
        const item = this.getById(id);
        if (item) {
            item.status = MutationStatus.SYNCED;
        }
    }

    markFailed(id, errorMessage = null) {
        const item = this.getById(id);
        if (item) {
            item.status = MutationStatus.FAILED;
            item.retryCount += 1;
            item.lastError = errorMessage;
        }
    }

    serialize() {
        return JSON.stringify(this.queue);
    }

    deserialize(jsonString) {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            this.queue = parsed;
        }
    }

    clear() {
        this.queue = [];
    }
}

module.exports = {
    MutationStatus,
    OfflineMutationQueue
};
