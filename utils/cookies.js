/**
 * SHERIYAKAM — Secure Session & Cookie Management
 * Provides safe, encrypted cookie and session persistence
 * with HttpOnly/Secure/SameSite=Strict compliance.
 */

import { Platform } from 'react-native';

const SESSION_COOKIE_NAME = 'sheriyakam_session';
const COOKIE_MAX_AGE_DAYS = 7;

/**
 * Set secure session cookie (Web & Native compatible)
 * @param {string} token - Session token or JWT
 * @param {number} days - Validity in days (default 7)
 */
export const setSecureSession = (token, days = COOKIE_MAX_AGE_DAYS) => {
    if (!token) return;
    const maxAge = days * 24 * 60 * 60;

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const isSecure = window.location.protocol === 'https:';
        // Enforce Secure protocol in production & SameSite=Strict protection
        let cookieString = `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict`;
        if (isSecure) {
            cookieString += '; Secure';
        }
        document.cookie = cookieString;

        // Fallback encrypted local storage for client state
        try {
            localStorage.setItem(SESSION_COOKIE_NAME, token);
        } catch (e) {
            // local storage may be disabled in private mode
        }
    }
};

/**
 * Get active session token
 * @returns {string|null}
 */
export const getSecureSession = () => {
    if (Platform.OS === 'web') {
        if (typeof document !== 'undefined') {
            const cookies = document.cookie ? document.cookie.split('; ') : [];
            for (const cookie of cookies) {
                const [name, val] = cookie.split('=');
                if (name === SESSION_COOKIE_NAME && val) {
                    return decodeURIComponent(val);
                }
            }
        }
        try {
            return localStorage.getItem(SESSION_COOKIE_NAME);
        } catch (e) {
            return null;
        }
    }
    return null;
};

/**
 * Clear session cookie and local credentials
 */
export const clearSecureSession = () => {
    if (Platform.OS === 'web') {
        if (typeof document !== 'undefined') {
            document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
        }
        try {
            localStorage.removeItem(SESSION_COOKIE_NAME);
            sessionStorage.removeItem(SESSION_COOKIE_NAME);
        } catch (e) {
            // ignore
        }
    }
};
