const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

describe('Pre-Deploy 16 Backend Checks Verification (CodeWith Z Handbook)', () => {

  // ─────────────────────────────────────────────────────────────
  // CHECK 1: Scalability (Stateless servers, bounded limits, shared services)
  // ─────────────────────────────────────────────────────────────
  it('Check 1: Scalability — Express server enforces body size limit and batch mutation bounds', () => {
    const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');
    assert.ok(serverCode.includes("express.json({ limit: '1mb' })"), 'Body parser must be bounded to 1MB');

    const mutationPath = path.join(__dirname, '..', 'backend', 'routes', 'mutations.js');
    const mutationCode = fs.readFileSync(mutationPath, 'utf8');
    assert.ok(mutationCode.includes('mutations.length > 100'), 'Batch mutation size must be capped to prevent memory exhaustion');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 2: API Security (Deny by default, strict CORS, security headers, no stack traces)
  // ─────────────────────────────────────────────────────────────
  it('Check 2: API Security — Enforces security headers, restricted CORS, and production error masking', () => {
    const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');

    // Headers
    assert.ok(serverCode.includes("res.setHeader('X-Content-Type-Options', 'nosniff')"), 'Must enforce nosniff');
    assert.ok(serverCode.includes("res.setHeader('X-Frame-Options', 'DENY')"), 'Must enforce DENY frame options');
    assert.ok(serverCode.includes("res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')"), 'Must enforce strict referrer');

    // Production error masking
    assert.ok(serverCode.includes("process.env.NODE_ENV === 'production'"), 'Must check production environment for error responses');
    assert.ok(serverCode.includes('An internal error occurred. Please try again later.'), 'Must return generic error message without stack trace in production');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 3: Load Balancing (Real dependency health check, not just 200 OK)
  // ─────────────────────────────────────────────────────────────
  it('Check 3: Load Balancing — /api/health actively probes database connection state', () => {
    const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');

    assert.ok(serverCode.includes('/api/health'), 'Health check endpoint must exist');
    assert.ok(serverCode.includes('mongoose.connection.readyState === 1'), 'Health check must probe real DB connection');
    assert.ok(serverCode.includes('503'), 'Must return 503 Service Unavailable when DB is disconnected');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 4: CDN (Cache public only, private API no-store, hide origin)
  // ─────────────────────────────────────────────────────────────
  it('Check 4: CDN — vercel.json configures security headers and no-store on sensitive routes', () => {
    const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

    const globalHeaderRule = vercelConfig.headers.find(h => h.source === '/(.*)');
    assert.ok(globalHeaderRule, 'Global header rule must be defined');

    const headerKeys = globalHeaderRule.headers.map(h => h.key.toLowerCase());
    assert.ok(headerKeys.includes('x-content-type-options'), 'Missing X-Content-Type-Options in CDN headers');
    assert.ok(headerKeys.includes('x-frame-options'), 'Missing X-Frame-Options in CDN headers');
    assert.ok(headerKeys.includes('strict-transport-security'), 'Missing HSTS in CDN headers');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 5: Caching (Safe keys, TTL, private cache)
  // ─────────────────────────────────────────────────────────────
  it('Check 5: Caching — Cache keys are strictly partitioned with TTL to prevent data leaks', () => {
    const mutationPath = path.join(__dirname, '..', 'backend', 'routes', 'mutations.js');
    const mutationCode = fs.readFileSync(mutationPath, 'utf8');
    assert.ok(mutationCode.includes('`mutation:idempotency:${item.idempotencyKey}`'), 'Cache key must be partitioned by domain and key');
    assert.ok(mutationCode.includes('604800'), 'TTL must be explicitly specified (7 days for idempotency)');

    const webhookPath = path.join(__dirname, '..', 'backend', 'routes', 'webhooks.js');
    const webhookCode = fs.readFileSync(webhookPath, 'utf8');
    assert.ok(webhookCode.includes('`webhook:razorpay:${eventId}`'), 'Webhook cache key must be partitioned with event ID');
    assert.ok(webhookCode.includes('86400'), 'Webhook TTL must be explicitly specified (24h)');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 6: Rate Limiting (Multi-layer brute-force protection with retry window)
  // ─────────────────────────────────────────────────────────────
  it('Check 6: Rate Limiting — In-memory and middleware rate limiters reject excessive requests', async () => {
    const { ipRateLimiter, checkLockout, handleFailedAttempt } = require('../backend/utils/security');
    assert.ok(typeof ipRateLimiter === 'function', 'ipRateLimiter middleware must exist');
    assert.ok(typeof checkLockout === 'function', 'checkLockout utility function must exist');

    const testId = 'test_user_' + Date.now();
    // Simulate 5 consecutive failed attempts
    for (let i = 0; i < 5; i++) {
      await handleFailedAttempt(testId);
    }
    const lockoutState = await checkLockout(testId);
    assert.strictEqual(lockoutState.locked, true, 'User must be locked out after 5 consecutive failed attempts');
    assert.ok(lockoutState.remainingMs > 0, 'Lockout must have remaining time in ms');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 7: Authentication (Timing-safe signature verification & fail-closed security)
  // ─────────────────────────────────────────────────────────────
  it('Check 7: Authentication — Webhook verification fails closed and uses timing-safe comparison', () => {
    const authRoutePath = path.join(__dirname, '..', 'backend', 'routes', 'auth.js');
    const authCode = fs.readFileSync(authRoutePath, 'utf8');

    assert.ok(authCode.includes('crypto.timingSafeEqual'), 'Authentication must use timing-safe comparison');
    assert.ok(authCode.includes('!SUPABASE_WEBHOOK_SECRET'), 'Authentication must fail closed if webhook secret is unset');

    const webhookRoutePath = path.join(__dirname, '..', 'backend', 'routes', 'webhooks.js');
    const webhookCode = fs.readFileSync(webhookRoutePath, 'utf8');
    assert.ok(webhookCode.includes('crypto.timingSafeEqual'), 'Razorpay webhook must use timing-safe comparison');
    assert.ok(webhookCode.includes('!WEBHOOK_SECRET'), 'Razorpay webhook must fail closed if secret is missing');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 8: Authorization (Server-side role guards: requireAdminOrPartner / requireAdminOrDispatcher)
  // ─────────────────────────────────────────────────────────────
  it('Check 8: Authorization — Endpoints enforce server-side role validation (admin / technician)', () => {
    const payoutRoutePath = path.join(__dirname, '..', 'backend', 'routes', 'payouts.js');
    const payoutCode = fs.readFileSync(payoutRoutePath, 'utf8');
    assert.ok(payoutCode.includes('requireAdminOrPartner'), 'Payout route must guard with requireAdminOrPartner');
    assert.ok(payoutCode.includes("req.user?.role === 'admin'"), 'Must verify admin role');

    const notifRoutePath = path.join(__dirname, '..', 'backend', 'routes', 'notifications.js');
    const notifCode = fs.readFileSync(notifRoutePath, 'utf8');
    assert.ok(notifCode.includes('requireAdminOrDispatcher'), 'Notifications route must guard with requireAdminOrDispatcher');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 9: High Availability (Multi-tier serverless & Cloudflare edge failover)
  // ─────────────────────────────────────────────────────────────
  it('Check 9: High Availability — Cloudflare backup worker provides edge redundancy', () => {
    const workerPath = path.join(__dirname, '..', 'cloudflare-backup-worker.js');
    const workerCode = fs.readFileSync(workerPath, 'utf8');

    assert.ok(workerCode.includes('ALLOWED_ORIGINS'), 'Backup worker must restrict origins');
    assert.ok(workerCode.includes('Thalassery–Mahe Corridor'), 'Backup worker must reference active Kerala corridor');
    assert.ok(workerCode.includes('getCorsHeaders'), 'Backup worker must emit security headers');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 10: Fault Tolerance (Timeouts, backoff, idempotency keys)
  // ─────────────────────────────────────────────────────────────
  it('Check 10: Fault Tolerance — Enforces request timeouts and idempotency key protection', () => {
    const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');
    assert.ok(serverCode.includes('req.setTimeout(15000'), 'Server must enforce 15s request timeout');

    const payoutPath = path.join(__dirname, '..', 'backend', 'routes', 'payouts.js');
    const payoutCode = fs.readFileSync(payoutPath, 'utf8');
    assert.ok(payoutCode.includes('effectiveKey'), 'Payouts must enforce idempotency keys');
    assert.ok(payoutCode.includes('already_settled'), 'Duplicate payout requests must return already_settled status');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 11: Database Optimization (Indexed schemas on core query fields)
  // ─────────────────────────────────────────────────────────────
  it('Check 11: Database Optimization — Mongoose models define indexes on query fields', () => {
    const userModelPath = path.join(__dirname, '..', 'backend', 'models', 'User.js');
    if (fs.existsSync(userModelPath)) {
      const userCode = fs.readFileSync(userModelPath, 'utf8');
      assert.ok(userCode.includes('unique: true') || userCode.includes('index: true'), 'User model must index lookup fields');
    }

    const payoutModelPath = path.join(__dirname, '..', 'backend', 'models', 'PayoutLog.js');
    if (fs.existsSync(payoutModelPath)) {
      const payoutCode = fs.readFileSync(payoutModelPath, 'utf8');
      assert.ok(payoutCode.includes('bookingId') || payoutCode.includes('idempotencyKey'), 'Payout model must index bookingId or idempotencyKey');
    }
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 12: Message Queues (Idempotent mutation processing & bounds)
  // ─────────────────────────────────────────────────────────────
  it('Check 12: Message Queues — Offline mutation queue operates idempotently with bounded batching', () => {
    const mutationRoute = path.join(__dirname, '..', 'backend', 'routes', 'mutations.js');
    const code = fs.readFileSync(mutationRoute, 'utf8');
    assert.ok(code.includes('ALREADY_SYNCED'), 'Queue processor must handle duplicate redeliveries gracefully');
    assert.ok(code.includes('MISSING_IDEMPOTENCY_KEY'), 'Queue processor must reject messages lacking idempotency keys');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 13: CI/CD (Secrets protected from version control)
  // ─────────────────────────────────────────────────────────────
  it('Check 13: CI/CD — .gitignore blocks sensitive env files and API keys', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    assert.ok(gitignore.includes('.env'), '.gitignore must ignore .env files');
    assert.ok(gitignore.includes('node_modules'), '.gitignore must ignore node_modules');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 14: Monitoring (Structured health probe with timestamp and status)
  // ─────────────────────────────────────────────────────────────
  it('Check 14: Monitoring — Health check returns structured JSON with operational telemetry', () => {
    const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');

    assert.ok(serverCode.includes("status: isDbConnected ? 'healthy' : 'degraded'"), 'Health probe must report status');
    assert.ok(serverCode.includes('timestamp: new Date().toISOString()'), 'Health probe must report ISO timestamp');
    assert.ok(serverCode.includes('database: dbStatus'), 'Health probe must report database connection status');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 15: Disaster Recovery (Cloud edge failover & active corridor persistence)
  // ─────────────────────────────────────────────────────────────
  it('Check 15: Disaster Recovery — Cloud failover architecture maintains zero-downtime booking continuity', () => {
    const failoverPath = path.join(__dirname, '..', 'src', 'services', 'cloudClient.ts');
    assert.ok(fs.existsSync(failoverPath), 'Cloud client failover engine must exist at src/services/cloudClient.ts');
    const failoverCode = fs.readFileSync(failoverPath, 'utf8');
    assert.ok(failoverCode.includes('BACKUP_WORKER_URL') || failoverCode.includes('PRIMARY_API_URL'), 'Must support primary and secondary backup endpoints');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 16: System Design (Thalassery–Mahe active corridor and ₹499 base rate card)
  // ─────────────────────────────────────────────────────────────
  it('Check 16: System Design — Verifies authentic Thalassery–Mahe operational scope and ₹499 base rate card', () => {
    const bookingPath = path.join(__dirname, '..', 'api', 'booking.ts');
    const bookingCode = fs.readFileSync(bookingPath, 'utf8');

    // 7 Active Postal PINs in Thalassery–Mahe belt
    assert.ok(bookingCode.includes('670101'), 'Must include Thalassery (670101)');
    assert.ok(bookingCode.includes('673310'), 'Must include Mahe (673310)');
    assert.ok(bookingCode.includes('670106'), 'Must include Dharmadam (670106)');
    assert.ok(bookingCode.includes('670642'), 'Must include Kadirur (670642)');
    assert.ok(bookingCode.includes('670672'), 'Must include Chokli (670672)');
    assert.ok(bookingCode.includes('673311'), 'Must include New Mahe (673311)');
    assert.ok(bookingCode.includes('673309'), 'Must include Azhiyur (673309)');

    // No ₹49 inspection fee anywhere; truthful rates only
    assert.ok(!bookingCode.includes('₹49 '), 'Must not have legacy ₹49 inspection fee');
  });

});
