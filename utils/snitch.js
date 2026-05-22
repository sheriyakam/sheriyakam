/**
 * snitch.js
 * Error Logging, Crash Reporting, and Event Telemetry ("Snitch")
 * Captures JavaScript errors and custom user interaction events for diagnostics.
 */
import { analytics } from '../config/firebaseConfig';

// In-memory log database for demo console inspection
const telemetryLogs = [];

export const snitch = {
    /**
     * Log a caught application error or crash
     * @param {Error|Object} error The error object
     * @param {string} context Context description of where the error occurred
     */
    logError: (error, context = 'General') => {
        const timestamp = new Date().toISOString();
        const errorLog = {
            id: Math.random().toString(36).substring(2, 11).toUpperCase(),
            timestamp,
            type: 'CRASH',
            message: error?.message || String(error),
            stack: error?.stack || 'No stack trace provided',
            context,
        };

        telemetryLogs.unshift(errorLog);
        console.error(`[Snitch 🚨] Capture in Context [${context}]:`, errorLog.message);

        // Firebase Analytics integration (only if supported and initialized)
        if (analytics) {
            try {
                // If using firebase/analytics web SDK, log an exception event
                // logEvent(analytics, 'exception', { description: `${context}: ${errorLog.message}`, fatal: true });
            } catch (fbErr) {
                console.warn('[Snitch] Failed sending event to Firebase:', fbErr);
            }
        }

        return errorLog;
    },

    /**
     * Log a custom application telemetry event (e.g. Booking Created, Payment Started)
     * @param {string} eventName Name of the event
     * @param {Object} params Key-value event attributes
     */
    logEvent: (eventName, params = {}) => {
        const timestamp = new Date().toISOString();
        const eventLog = {
            id: Math.random().toString(36).substring(2, 11).toUpperCase(),
            timestamp,
            type: 'EVENT',
            message: `Event: ${eventName}`,
            params,
            context: 'Telemetry'
        };

        telemetryLogs.unshift(eventLog);
        console.log(`[Snitch 📊] Telemetry [${eventName}]:`, params);

        if (analytics) {
            try {
                // logEvent(analytics, eventName, params);
            } catch (fbErr) {
                console.warn('[Snitch] Failed logging event to Firebase:', fbErr);
            }
        }

        return eventLog;
    },

    /**
     * Fetch all captured logs
     * @returns {Array} List of logs (newest first)
     */
    getLogs: () => {
        return telemetryLogs;
    },

    /**
     * Clear all local logs
     */
    clearLogs: () => {
        telemetryLogs.length = 0;
    }
};
