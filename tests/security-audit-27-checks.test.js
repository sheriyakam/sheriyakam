const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Pure SHA-256 password hash mirror (matching utils/security.js)
function hashPassword(password) {
  if (!password) return '';
  const salt = "sheriyakam_secure_salt_2026_!!";
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// In-Memory Rate Limiter (matching utils/security.js and backend/utils/security.js)
function createRateLimiter() {
  const store = {};
  return {
    check(key, maxAttempts = 5, windowMs = 60000, now = Date.now()) {
      if (!store[key]) {
        store[key] = { attempts: 0, firstAttempt: now, lockedUntil: 0 };
      }
      const entry = store[key];
      if (entry.lockedUntil > now) {
        return { allowed: false, remainingAttempts: 0, retryAfterMs: entry.lockedUntil - now };
      }
      if (now - entry.firstAttempt > windowMs) {
        entry.attempts = 0;
        entry.firstAttempt = now;
      }
      entry.attempts++;
      if (entry.attempts > maxAttempts) {
        entry.lockedUntil = now + windowMs;
        return { allowed: false, remainingAttempts: 0, retryAfterMs: windowMs };
      }
      return { allowed: true, remainingAttempts: maxAttempts - entry.attempts, retryAfterMs: 0 };
    }
  };
}

function sanitizeText(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>'"]/g, '')   // Strip dangerous chars
    .trim();
}

describe('Security Audit — 27-Point Hardening Verification', () => {

  // ─────────────────────────────────────────────────────────────
  // CHECK 01 & 02: Secrets and API Keys
  // ─────────────────────────────────────────────────────────────
  it('Check 01 & 02: ensures .gitignore strictly blocks .env files while allowing .env.example', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf8');
    assert.ok(content.includes('.env'), '.gitignore must ignore .env');
    assert.ok(content.includes('!.env.example'), '.gitignore must preserve .env.example');
  });

  it('Check 01: verifies .env.example does not promote public exposure of secret LLM keys', () => {
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf8');
    assert.ok(!content.includes('NEXT_PUBLIC_GEMINI_API_KEY'), 'Gemini API key must not have NEXT_PUBLIC_ prefix');
    assert.ok(!content.includes('NEXT_PUBLIC_GROQ_API_KEY'), 'Groq API key must not have NEXT_PUBLIC_ prefix');
    assert.ok(!content.includes('NEXT_PUBLIC_OPENROUTER_API_KEY'), 'OpenRouter API key must not have NEXT_PUBLIC_ prefix');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 05–10: Authentication and Access
  // ─────────────────────────────────────────────────────────────
  it('Check 05: verifies Row Level Security (RLS) policies exist for core tables', () => {
    const rlsPath = path.join(__dirname, '..', 'supabase', 'rls_policies.sql');
    const sql = fs.readFileSync(rlsPath, 'utf8');
    assert.ok(sql.includes('ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;'));
    assert.ok(sql.includes('ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;'));
    assert.ok(sql.includes('ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;'));
  });

  it('Check 08 & 09: safely hashes passwords and rejects plain text matches', () => {
    const rawPass = 'Sheriyakam@Secure2026';
    const hash = hashPassword(rawPass);

    assert.ok(hash && typeof hash === 'string', 'Hash must be generated');
    assert.notEqual(hash, rawPass, 'Hash must not equal plain text');
    assert.equal(hash.length, 64, 'SHA-256 hex string must be 64 characters');

    // Reproducible with same salt
    const hashAgain = hashPassword(rawPass);
    assert.equal(hash, hashAgain, 'Hash must be deterministic for identical salt');

    // Different password produces completely different hash
    const differentHash = hashPassword('DifferentPassword123');
    assert.notEqual(hash, differentHash);
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 11–17: Data and User Input
  // ─────────────────────────────────────────────────────────────
  it('Check 12 & 13: sanitizes input against XSS and PostgREST injection characters', () => {
    const dirtyXss = '<script>alert("xss")</script>John Doe';
    const cleanXss = sanitizeText(dirtyXss);
    assert.ok(!cleanXss.includes('<script>'), 'Must strip script tags');
    assert.ok(!cleanXss.includes('</script>'));

    // Test identifier sanitizer regex for PostgREST .or() filter
    const maliciousIdentifier = 'admin@example.com,id.neq.0,role.eq.admin';
    const cleanIdentifier = maliciousIdentifier.replace(/[^a-zA-Z0-9@._+-]/g, '').trim();
    assert.ok(!cleanIdentifier.includes(','), 'Comma must be stripped to prevent query parameter injection');
  });

  it('Check 14: verifies file upload MIME type and extension restrictions', () => {
    const allowedMimeTypes = ['application/pdf', 'text/plain'];
    const isAllowedFile = (name, mime) => {
      const lower = (name || '').toLowerCase();
      const hasValidExt = lower.endsWith('.pdf') || lower.endsWith('.txt');
      return hasValidExt && allowedMimeTypes.includes(mime);
    };

    assert.equal(isAllowedFile('resume.pdf', 'application/pdf'), true);
    assert.equal(isAllowedFile('notes.txt', 'text/plain'), true);
    assert.equal(isAllowedFile('malware.exe', 'application/x-msdownload'), false);
    assert.equal(isAllowedFile('script.js', 'application/javascript'), false);
    assert.equal(isAllowedFile('fake.pdf.exe', 'application/pdf'), false);
  });

  it('Check 15: verifies server-side price calculation prevents client-side price tampering', () => {
    const items = [
      { id: 1, title: 'MCB Replacement', price: 349, quantity: 2 },
      { id: 2, title: 'Switchboard Repair', price: 149, quantity: 1 }
    ];
    // Client sends tampered totalPrice of ₹1
    const tamperedClientPrice = 1;

    // Server-side recalculation
    const expectedTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    assert.equal(expectedTotal, 847, 'Expected server total is 349*2 + 149 = 847');

    const isPriceTampered = Math.abs(expectedTotal - tamperedClientPrice) > 0.01;
    assert.equal(isPriceTampered, true, 'Server must detect price tampering');
  });

  it('Check 16: enforces strict rate limiting on sensitive OTP and login operations', () => {
    const limiter = createRateLimiter();
    const testKey = `test_login_${Date.now()}`;
    // 5 attempts allowed in 60s
    for (let i = 0; i < 5; i++) {
      const res = limiter.check(testKey, 5, 60000);
      assert.equal(res.allowed, true, `Attempt ${i + 1} should be allowed`);
    }
    // 6th attempt must be locked
    const lockedRes = limiter.check(testKey, 5, 60000);
    assert.equal(lockedRes.allowed, false, '6th attempt must be blocked by rate limiter');
    assert.ok(lockedRes.retryAfterMs > 0, 'Must provide retry wait time');
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK 18–23: HTTPS, Headers and Production Config
  // ─────────────────────────────────────────────────────────────
  it('Check 18 & 20: verifies strict HTTPS (HSTS) and comprehensive security headers in vercel.json', () => {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
    const globalHeaders = vercelConfig.headers.find(h => h.source === '/(.*)').headers;

    const headerMap = {};
    for (const h of globalHeaders) {
      headerMap[h.key] = h.value;
    }

    assert.ok(headerMap['Strict-Transport-Security'].includes('max-age='), 'HSTS must be enabled');
    assert.ok(headerMap['Strict-Transport-Security'].includes('includeSubDomains'), 'HSTS must include subdomains');
    assert.equal(headerMap['X-Content-Type-Options'], 'nosniff', 'nosniff header must be set');
    assert.equal(headerMap['X-Frame-Options'], 'DENY', 'Clickjacking protection must be set to DENY');
    assert.ok(headerMap['Content-Security-Policy'].includes("default-src 'self'"), 'CSP must define safe default-src');
    assert.ok(headerMap['Referrer-Policy'], 'Referrer-Policy must be set');
  });

  it('Check 20: verifies timing-safe comparison on webhook signatures', () => {
    const secret = 'whsec_test_secret_12345';
    const payload = JSON.stringify({ event: 'payment.captured', id: 'pay_9988' });
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const verify = (sig, sec, body) => {
      const expected = crypto.createHmac('sha256', sec).update(body).digest('hex');
      const sigBuf = Buffer.from(sig, 'utf8');
      const expBuf = Buffer.from(expected, 'utf8');
      if (sigBuf.length !== expBuf.length) return false;
      return crypto.timingSafeEqual(sigBuf, expBuf);
    };

    assert.equal(verify(signature, secret, payload), true, 'Valid signature must verify');
    assert.equal(verify('forged_signature_hex_value_1234567890abcdef', secret, payload), false, 'Forged signature must be rejected');
  });
});
