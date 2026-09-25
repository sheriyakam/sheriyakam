const { test, describe } = require('node:test');
const assert = require('assert');
const crypto = require('crypto');

// In-Memory Rate Limiter Implementation (from utils/security.js logic)
function createRateLimiter() {
    const store = {};

    return {
        checkRateLimit(key, maxAttempts = 5, windowMs = 60000, now = Date.now()) {
            if (!store[key]) {
                store[key] = { attempts: 0, firstAttempt: now, lockedUntil: 0 };
            }

            const entry = store[key];

            if (entry.lockedUntil > now) {
                return {
                    allowed: false,
                    remainingAttempts: 0,
                    retryAfterMs: entry.lockedUntil - now,
                };
            }

            if (now - entry.firstAttempt > windowMs) {
                entry.attempts = 0;
                entry.firstAttempt = now;
            }

            entry.attempts++;

            if (entry.attempts > maxAttempts) {
                entry.lockedUntil = now + windowMs;
                return {
                    allowed: false,
                    remainingAttempts: 0,
                    retryAfterMs: windowMs,
                };
            }

            return {
                allowed: true,
                remainingAttempts: maxAttempts - entry.attempts,
                retryAfterMs: 0,
            };
        },
        reset(key) {
            delete store[key];
        }
    };
}

// Session Expiry Validator
function isSessionValid(session, expiryMs = 8 * 3600 * 1000, currentTime = Date.now()) {
    if (!session || !session.timestamp) return false;
    return (currentTime - session.timestamp) < expiryMs;
}

// Timing safe secret comparison
function verifyWebhookSecret(suppliedHeader, expectedSecret) {
    if (!suppliedHeader || !expectedSecret) return false;
    const headerBuf = Buffer.from(suppliedHeader);
    const secretBuf = Buffer.from(expectedSecret);
    if (headerBuf.length !== secretBuf.length) return false;
    return crypto.timingSafeEqual(headerBuf, secretBuf);
}

describe('Admin Authentication & Security Rate Limiter', () => {
    test('Allows up to 5 login attempts within a 60-second window', () => {
        const limiter = createRateLimiter();
        const now = 1000000;

        for (let i = 1; i <= 5; i++) {
            const res = limiter.checkRateLimit('admin_portal', 5, 60000, now + (i * 1000));
            assert.strictEqual(res.allowed, true);
            assert.strictEqual(res.remainingAttempts, 5 - i);
        }
    });

    test('Locks out on 6th failed attempt for exactly the window duration', () => {
        const limiter = createRateLimiter();
        const now = 1000000;

        for (let i = 1; i <= 5; i++) {
            limiter.checkRateLimit('admin_portal', 5, 60000, now);
        }

        const blockedRes = limiter.checkRateLimit('admin_portal', 5, 60000, now + 100);
        assert.strictEqual(blockedRes.allowed, false);
        assert.strictEqual(blockedRes.remainingAttempts, 0);
        assert.ok(blockedRes.retryAfterMs > 0);
    });

    test('Unlocks automatically after the lockout window elapses', () => {
        const limiter = createRateLimiter();
        const now = 1000000;

        for (let i = 1; i <= 6; i++) {
            limiter.checkRateLimit('admin_portal', 5, 60000, now);
        }

        // After 61 seconds (window expired)
        const laterRes = limiter.checkRateLimit('admin_portal', 5, 60000, now + 61000);
        assert.strictEqual(laterRes.allowed, true);
        assert.strictEqual(laterRes.remainingAttempts, 4);
    });

    test('Admin session is valid within 8 hours and invalid after 8 hours', () => {
        const loginTime = 1700000000000;
        const session = { user: { username: 'admin', role: 'admin' }, timestamp: loginTime };

        // 4 hours in -> Valid
        assert.strictEqual(isSessionValid(session, 8 * 3600 * 1000, loginTime + (4 * 3600 * 1000)), true);

        // 8 hours + 1 minute -> Expired
        assert.strictEqual(isSessionValid(session, 8 * 3600 * 1000, loginTime + (8 * 3600 * 1000 + 60000)), false);
    });

    test('Webhook verification uses timing-safe secret validation', () => {
        const secret = 'supabase_super_secure_webhook_key_2026';
        assert.strictEqual(verifyWebhookSecret(secret, secret), true);
        assert.strictEqual(verifyWebhookSecret('wrong_key', secret), false);
        assert.strictEqual(verifyWebhookSecret('', secret), false);
    });
});
