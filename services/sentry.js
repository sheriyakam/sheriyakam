/**
 * Lightweight Sentry Error Monitoring Client for Expo Router / React Native Web
 * Captures unhandled exceptions, promise rejections, and ErrorBoundary events.
 */

import { Platform } from 'react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

let isInitialized = false;
let dsnConfig = null;

function parseDSN(dsn) {
    if (!dsn || typeof dsn !== 'string') return null;
    try {
        const url = new URL(dsn);
        const publicKey = url.username;
        const host = url.host;
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const projectId = pathSegments[pathSegments.length - 1];
        if (!publicKey || !projectId) return null;
        return {
            publicKey,
            host,
            projectId,
            endpoint: `https://${host}/api/${projectId}/store/?sentry_version=7&sentry_client=sheriyakam-web%2F1.0.0&sentry_key=${publicKey}`,
        };
    } catch (e) {
        console.warn('[Sentry] Invalid DSN format:', dsn);
        return null;
    }
}

export function initSentry() {
    if (isInitialized) return;

    if (!SENTRY_DSN) {
        if (__DEV__) {
            console.log('[Sentry] No EXPO_PUBLIC_SENTRY_DSN configured. Running in local development mode.');
        }
        isInitialized = true;
        return;
    }

    dsnConfig = parseDSN(SENTRY_DSN);
    if (!dsnConfig) {
        console.warn('[Sentry] Failed to parse SENTRY_DSN');
        return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.addEventListener('error', (event) => {
            captureException(event.error || event.message, { mechanism: 'window.onerror' });
        });

        window.addEventListener('unhandledrejection', (event) => {
            captureException(event.reason || 'Unhandled Promise Rejection', { mechanism: 'unhandledrejection' });
        });
    }

    isInitialized = true;
    console.log('[Sentry] Error monitoring initialized successfully.');
}

export async function captureException(error, extraContext = {}) {
    try {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : '';
        const errorName = error instanceof Error ? error.name : 'Error';

        console.error('[Sentry Error Captured]:', errorMessage, extraContext);

        if (!dsnConfig) return;

        const payload = {
            event_id: Math.random().toString(36).substring(2) + Date.now().toString(36),
            timestamp: new Date().toISOString().slice(0, 19),
            platform: Platform.OS === 'web' ? 'javascript' : 'native',
            level: 'error',
            logger: 'sheriyakam.app',
            environment: process.env.NODE_ENV || 'production',
            release: 'sheriyakam@1.0.0',
            exception: {
                values: [
                    {
                        type: errorName,
                        value: errorMessage,
                        stacktrace: errorStack ? {
                            frames: errorStack.split('\n').map(line => ({
                                filename: line.trim(),
                                function: line.trim(),
                            }))
                        } : undefined,
                    }
                ]
            },
            extra: {
                ...extraContext,
                platform: Platform.OS,
                url: typeof window !== 'undefined' ? window.location?.href : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            },
            tags: {
                platform: Platform.OS,
                environment: process.env.NODE_ENV || 'production',
            }
        };

        if (typeof fetch !== 'undefined') {
            await fetch(dsnConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=sheriyakam/1.0.0, sentry_key=${dsnConfig.publicKey}`,
                },
                body: JSON.stringify(payload),
            }).catch(err => {
                console.warn('[Sentry] Failed to transmit exception event:', err);
            });
        }
    } catch (sendErr) {
        console.warn('[Sentry] Error inside captureException:', sendErr);
    }
}

export function captureMessage(message, level = 'info', extraContext = {}) {
    if (!dsnConfig) {
        console.log(`[Sentry Message - ${level}]:`, message, extraContext);
        return;
    }
    // Forward message to Sentry
    captureException(new Error(message), { ...extraContext, level, isMessage: true });
}
