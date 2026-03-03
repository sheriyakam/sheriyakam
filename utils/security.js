/**
 * Security Utilities
 * Input sanitization, validation, and security helpers
 */

// ============================================================
//  INPUT SANITIZATION
// ============================================================

/** Strip HTML tags and dangerous characters */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/<[^>]*>/g, '')          // Remove HTML tags
        .replace(/[<>"'&]/g, '')          // Remove dangerous chars
        .trim();
};

/** Sanitize email — lowercase, trim, validate */
export const sanitizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');
};

/** Sanitize phone — digits only */
export const sanitizePhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/[^0-9+]/g, '');
};

// ============================================================
//  VALIDATION
// ============================================================

/** Validate email format */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/** Validate 10-digit Indian mobile number */
export const isValidPhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
};

/** Validate password strength */
export const validatePassword = (password) => {
    const issues = [];
    if (password.length < 6) issues.push('At least 6 characters');
    if (!/[A-Za-z]/.test(password)) issues.push('At least one letter');
    if (!/[0-9]/.test(password)) issues.push('At least one number');
    return {
        isValid: issues.length === 0,
        issues,
        strength: password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
            ? 'strong'
            : password.length >= 6 ? 'medium' : 'weak',
    };
};

/** Validate OTP format */
export const isValidOTP = (otp) => {
    return /^\d{4}$/.test(otp);
};

// ============================================================
//  RATE LIMITING
// ============================================================

const rateLimitStore = {};

/**
 * Check rate limit for an action
 * @param {string} key - Identifier (e.g., 'login_user@email.com')
 * @param {number} maxAttempts - Max allowed attempts
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remainingAttempts: number, retryAfterMs: number }}
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 30000) => {
    const now = Date.now();

    if (!rateLimitStore[key]) {
        rateLimitStore[key] = { attempts: 0, firstAttempt: now, lockedUntil: 0 };
    }

    const entry = rateLimitStore[key];

    // Check if locked out
    if (entry.lockedUntil > now) {
        return {
            allowed: false,
            remainingAttempts: 0,
            retryAfterMs: entry.lockedUntil - now,
        };
    }

    // Reset if window expired
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
};

/** Reset rate limit for a key */
export const resetRateLimit = (key) => {
    delete rateLimitStore[key];
};

// ============================================================
//  SECURITY HELPERS
// ============================================================

/** Generate a random 4-digit OTP */
export const generateOTP = () => {
    return String(Math.floor(1000 + Math.random() * 9000));
};

/** Mask email for display (u***@gmail.com) */
export const maskEmail = (email) => {
    if (!email || !email.includes('@')) return '***';
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
};

/** Mask phone for display (****543210) */
export const maskPhone = (phone) => {
    if (!phone || phone.length < 4) return '***';
    return '****' + phone.slice(-6);
};
