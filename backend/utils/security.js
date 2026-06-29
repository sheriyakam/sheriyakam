/**
 * security.js
 * Rate limiting, Progressive delay, and Account lockout utilities for Sheriyakam Auth.
 * Stores attempt states in memory (default) or Upstash Redis (if credentials are set).
 */

const crypto = require('crypto');

// ==========================================
// REDIS / UPSTASH / IN-MEMORY ADAPTER
// ==========================================
const useUpstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Local In-Memory Cache fallback
const localCache = new Map();

// Helper to write to cache
async function cacheSet(key, value, expireInSeconds) {
    if (useUpstash) {
        try {
            const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${encodeURIComponent(JSON.stringify(value))}/EX/${expireInSeconds}`;
            await fetch(url, {
                headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
            });
            return;
        } catch (e) {
            console.error('[Security] Upstash write error, falling back to memory:', e.message);
        }
    }
    
    const expiry = Date.now() + (expireInSeconds * 1000);
    localCache.set(key, { data: value, expiry });
}

// Helper to read from cache
async function cacheGet(key) {
    if (useUpstash) {
        try {
            const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
            });
            const payload = await res.json();
            if (payload && payload.result) {
                return JSON.parse(payload.result);
            }
            return null;
        } catch (e) {
            console.error('[Security] Upstash read error, falling back to memory:', e.message);
        }
    }

    const item = localCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
        localCache.delete(key);
        return null;
    }
    return item.data;
}

// Helper to delete key
async function cacheDel(key) {
    if (useUpstash) {
        try {
            const url = `${process.env.UPSTASH_REDIS_REST_URL}/del/${key}`;
            await fetch(url, {
                headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
            });
            return;
        } catch (e) {
            console.error('[Security] Upstash delete error:', e.message);
        }
    }
    localCache.delete(key);
}

// ==========================================
// IP RATE LIMITER MIDDLEWARE (Max 10 reqs/min)
// ==========================================
const ipRateLimiter = async (req, res, next) => {
    // Get client IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `ratelimit:${ip}`;
    
    let requestTimestamps = await cacheGet(key) || [];
    const now = Date.now();
    
    // Filter timestamps to only keep requests within the last 60 seconds
    requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < 60000);
    
    if (requestTimestamps.length >= 10) {
        console.warn(`[Security alert] Rate limit exceeded for IP: ${ip} at ${new Date().toISOString()}`);
        return res.status(429).json({
            error: "Too many login attempts. Please try again after one minute."
        });
    }
    
    // Add current request timestamp
    requestTimestamps.push(now);
    await cacheSet(key, requestTimestamps, 60); // Expire rate limit array key in 60s
    
    next();
};

// ==========================================
// EMAIL SENDING UTILITY
// ==========================================
async function sendLockoutEmail(email, resetToken) {
    const resetLink = `http://localhost:5000/api/auth/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;
    
    console.log(`
┌────────────────────────────────────────────────────────┐
│ 📧 EMAIL NOTIFICATION: ACCOUNT SECURITY LOCKOUT        │
├────────────────────────────────────────────────────────┤
│ To: ${email}
│ Subject: Security Lockout Warning & Password Reset Link
│
│ Your account has been temporarily locked out due to
│ 5 consecutive failed login attempts.
│
│ Click the link below to verify your identity and unlock:
│ ${resetLink}
│
│ (Link will expire in 1 hour)
└────────────────────────────────────────────────────────┘
    `);
    
    // Node-mailer configuration template (can be un-commented if user installs nodemailer)
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: '"Sheriyakam Security" <security@sheriyakam.com>',
        to: email,
        subject: "Security Alert: Account Lockout Reset Link",
        text: `Your account has been locked out. Click here to reset: ${resetLink}`
    });
    */
}

// ==========================================
// PROGRESSIVE DELAY & LOCKOUT LOGIC
// ==========================================

/**
 * Checks if user is currently locked out
 * Returns { locked: boolean, remainingMs: number }
 */
async function checkLockout(identifier) {
    const key = `lockout:${identifier}`;
    const state = await cacheGet(key);
    
    if (!state) return { locked: false, remainingMs: 0 };
    
    const now = Date.now();
    if (state.lockoutUntil && now < state.lockoutUntil) {
        return { locked: true, remainingMs: state.lockoutUntil - now };
    }
    
    return { locked: false, remainingMs: 0 };
}

/**
 * Handles a failed login attempt.
 * Increments failed attempts count, calculates progressive delay, and locks account if count >= 5.
 * Returns the artificial progressive delay to apply (in ms).
 */
async function handleFailedAttempt(identifier, email) {
    const key = `lockout:${identifier}`;
    const state = await cacheGet(key) || { failedCount: 0, lockoutUntil: null };
    
    state.failedCount += 1;
    
    // Calculate progressive delay: each failed attempt increases wait time
    // Attempt 1: 500ms
    // Attempt 2: 1000ms
    // Attempt 3: 2000ms
    // Attempt 4: 4000ms
    // Attempt 5: Lockout 15 minutes
    let delayMs = 500 * Math.pow(2, state.failedCount - 1);
    
    if (state.failedCount >= 5) {
        const lockoutDuration = 15 * 60 * 1000; // 15 minutes lockout
        state.lockoutUntil = Date.now() + lockoutDuration;
        
        console.warn(`[Security Alert] Account ${identifier} locked out for 15 minutes at ${new Date().toISOString()}`);
        
        // Generate security reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        state.resetToken = resetToken;
        state.resetTokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour token expiry
        
        // Send email notification to user (if email is known)
        if (email) {
            await sendLockoutEmail(email, resetToken);
        }
    }
    
    // Save attempts count for 30 minutes unless locked out (locked out keys live 15 mins)
    const expireTime = state.failedCount >= 5 ? 15 * 60 : 30 * 60;
    await cacheSet(key, state, expireTime);
    
    return delayMs;
}

/**
 * Clears consecutive failed attempts upon successful login
 */
async function handleSuccessfulLogin(identifier) {
    const key = `lockout:${identifier}`;
    await cacheDel(key);
}

/**
 * Verifies the token and unlocks the account if valid.
 */
async function unlockAccount(identifier, token) {
    const key = `lockout:${identifier}`;
    const state = await cacheGet(key);
    
    if (!state) return false;
    if (state.resetToken === token && Date.now() < state.resetTokenExpiry) {
        await cacheDel(key);
        return true;
    }
    return false;
}

/**
 * Helper function to introduce artificial response latency
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns raw lockout state for testing verification
 */
async function getLockoutStateForTest(identifier) {
    const key = `lockout:${identifier}`;
    return await cacheGet(key);
}

module.exports = {
    ipRateLimiter,
    checkLockout,
    handleFailedAttempt,
    handleSuccessfulLogin,
    unlockAccount,
    getLockoutStateForTest,
    sleep
};
