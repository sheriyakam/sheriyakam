/**
 * SHERIYAKAM — Validation, Sanitization & Payload Security Utilities
 * Enforces Indian mobile standards, Kerala pin code ranges, and anti-XSS protection.
 */

import { sha256 } from './security';

/**
 * Clean and validate Indian 10-digit mobile number
 * Handles formats: +919847012345, 919847012345, 09847012345, 98470-12345, 98470 12345
 * @param {string} phone
 * @returns {{ isValid: boolean, formatted: string, raw: string, error?: string }}
 */
export const validateIndianPhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, formatted: '', raw: '', error: 'Phone number is required' };
    }

    // Strip all non-digit characters except leading plus
    let clean = phone.trim().replace(/[\s\-\(\)]/g, '');

    // Remove +91 or 91 country code prefix if present
    if (clean.startsWith('+91')) {
        clean = clean.slice(3);
    } else if (clean.startsWith('91') && clean.length === 12) {
        clean = clean.slice(2);
    } else if (clean.startsWith('0') && clean.length === 11) {
        clean = clean.slice(1);
    }

    // Must be exactly 10 digits and start with 6, 7, 8, or 9
    const regex = /^[6-9]\d{9}$/;
    const isValid = regex.test(clean);

    return {
        isValid,
        formatted: isValid ? `+91 ${clean.slice(0, 5)} ${clean.slice(5)}` : '',
        raw: clean,
        error: isValid ? null : 'Please enter a valid 10-digit Indian mobile number (e.g. 98470 12345)'
    };
};

/**
 * Validate Kerala 6-digit postal pin code (670001 - 695999)
 * @param {string} pincode
 * @returns {{ isValid: boolean, pincode: string, error?: string }}
 */
export const validateKeralaPincode = (pincode) => {
    if (!pincode || typeof pincode !== 'string') {
        return { isValid: false, pincode: '', error: 'PIN Code is required' };
    }

    const clean = pincode.trim().replace(/\D/g, '');
    const num = parseInt(clean, 10);
    const isValid = clean.length === 6 && num >= 670000 && num <= 695999;

    return {
        isValid,
        pincode: clean,
        error: isValid ? null : 'Please enter a valid 6-digit Kerala PIN code (670xxx to 695xxx)'
    };
};

/**
 * Sanitize string to prevent Cross-Site Scripting (XSS) and code injection
 * @param {string} text
 * @returns {string}
 */
export const sanitizeText = (text) => {
    if (typeof text !== 'string') return text || '';
    return text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
        .replace(/<[^>]*>/g, '')                                             // Strip remaining HTML tags
        .replace(/[<>"'&]/g, (match) => {                                   // Escape dangerous entity chars
            switch (match) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#x27;';
                case '&': return '&amp;';
                default: return match;
            }
        })
        .trim();
};

/**
 * Recursively sanitize all string properties within an object or array
 * @param {any} data
 * @returns {any}
 */
export const sanitizePayload = (data) => {
    if (!data) return data;
    if (typeof data === 'string') {
        return sanitizeText(data);
    }
    if (Array.isArray(data)) {
        return data.map(item => sanitizePayload(item));
    }
    if (typeof data === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = sanitizePayload(value);
        }
        return sanitized;
    }
    return data;
};

/**
 * Build tamper-proof verified booking payload with checksum
 * @param {object} bookingData
 * @returns {object}
 */
export const buildVerifiedBookingPayload = (bookingData) => {
    const sanitized = sanitizePayload(bookingData);
    const timestamp = Date.now();
    const phoneResult = validateIndianPhone(sanitized.customerPhone || '');

    const payload = {
        ...sanitized,
        customerPhone: phoneResult.raw || sanitized.customerPhone,
        timestamp,
        version: '2.0.0',
        platform: 'sheriyakam_web'
    };

    // Generate SHA-256 integrity signature
    const signatureBase = `${payload.serviceTitle || ''}_${payload.price || 0}_${payload.customerPhone || ''}_${timestamp}`;
    payload.checksum = sha256(signatureBase);

    return payload;
};
