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

/**
 * Pure JavaScript SHA-256 hash function (no external dependencies)
 * Suitable for secure hashing on Web and React Native.
 */
export const sha256 = (ascii) => {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j;

    let result = '';

    const words = [];
    const asciiLength = ascii[lengthProperty];
    let hash = [];
    const k = [];
    let primeCounter = 0;

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = 1;
            }
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            primeCounter++;
        }
    }
    
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return ''; // check if any character is non-ASCII
        words[i >> 2] |= j << (24 - (i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
    words[words[lengthProperty]] = (asciiLength * 8);
    
    for (i = 0; i < words[lengthProperty]; i += 16) {
        const w = words.slice(i, i + 16);
        const oldHash = hash.slice(0);
        hash = hash.slice(0);
        for (j = 0; j < 64; j++) {
            let wj = w[j];
            if (j >= 16) {
                const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                wj = w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
            }
            const s1_maj = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
            const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            const temp1 = (hash[7] + s1_maj + ch + k[j] + wj) | 0;
            const s0_maj = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
            const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            const temp2 = (s0_maj + maj) | 0;
            
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
            hash.pop();
        }
        
        for (j = 0; j < 8; j++) {
            hash[j] = (hash[j] + oldHash[j]) | 0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        const val = hash[i] >>> 0;
        result += val.toString(16).padStart(8, '0');
    }
    return result;
};

/** Securely hash password using SHA-256 and a standard static salt */
export const hashPassword = (password) => {
    if (!password) return '';
    const salt = "sheriyakam_secure_salt_2026_!!";
    return sha256(password + salt);
};

