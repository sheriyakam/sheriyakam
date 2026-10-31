/**
 * phoneValidator.ts
 * Two-Stage Pre-OTP Phone Validation Pipeline
 * Prevents fraudulent bookings and eliminates wasted SMS gateway fees.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTimeout, TimeoutError } from './fetchWithTimeout';

export interface LocalPhoneValidationResult {
  isValid: boolean;
  normalizedNumber: string;
  error?: string;
}

export interface ActiveMobileVerificationResult {
  allowOtp: boolean;
  normalizedNumber: string;
  carrier?: string;
  lineType?: 'mobile' | 'landline' | 'voip' | 'unknown';
  isFallback?: boolean;
  error?: string;
}

const STORAGE_KEY_CARRIER_PREFIX = '@sheriyakam_carrier_';
const carrierMemoryCache = new Map<string, ActiveMobileVerificationResult>();

// Known dummy / sequence patterns that spammers use
const DUMMY_PHONE_PATTERNS = [
  '9876543210',
  '9123456789',
  '9012345678',
  '9898989898',
  '9090909090',
  '8989898989',
  '7878787878',
  '6767676767',
  '9988776655',
  '1234567890',
  '0123456789',
];

/**
 * Normalizes input by stripping country codes (+91, 0091), spaces, dashes, and parens.
 */
export function normalizeIndianPhoneNumber(input: string): string {
  if (!input) return '';
  let cleaned = input.replace(/[\s\-\(\)\.]/g, '');

  // Strip leading international country code for India
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0091')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    // Strip leading trunk prefix 0
    cleaned = cleaned.substring(1);
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
}

/**
 * STAGE 1 (Zero-Cost Local Gatekeeper):
 * Validates syntax, country rules, and rejects dummy/repetitive numbers without network calls.
 */
export function validateIndianMobileLocally(rawNumber: string): LocalPhoneValidationResult {
  const normalized = normalizeIndianPhoneNumber(rawNumber);

  if (!normalized) {
    return {
      isValid: false,
      normalizedNumber: '',
      error: 'Phone number is required.',
    };
  }

  // Must be exactly 10 digits
  if (normalized.length !== 10) {
    return {
      isValid: false,
      normalizedNumber: normalized,
      error: 'Indian mobile number must be exactly 10 digits.',
    };
  }

  // Must start with 6, 7, 8, or 9 per DoT (Department of Telecommunications) guidelines
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return {
      isValid: false,
      normalizedNumber: normalized,
      error: 'Invalid mobile number. Valid Indian mobiles start with 6, 7, 8, or 9.',
    };
  }

  // Reject all identical digits (e.g. 9999999999, 8888888888, 7777777777)
  if (/^(\d)\1{9}$/.test(normalized)) {
    return {
      isValid: false,
      normalizedNumber: normalized,
      error: 'Fake or repetitive test number detected.',
    };
  }

  // Reject known dummy sequences
  if (DUMMY_PHONE_PATTERNS.includes(normalized)) {
    return {
      isValid: false,
      normalizedNumber: normalized,
      error: 'Invalid phone number sequence.',
    };
  }

  return {
    isValid: true,
    normalizedNumber: normalized,
  };
}

/**
 * STAGE 2 (Carrier/Line Check before SMS OTP):
 * Queries backend proxy or carrier API with a strict 2500ms timeout.
 * Rejects landlines and VoIP.
 * Fails open (allowOtp: true) if third-party provider is down or rate-limited.
 */
export async function verifyActiveMobile(rawNumber: string): Promise<ActiveMobileVerificationResult> {
  // First evaluate Stage 1 local gatekeeper
  const localCheck = validateIndianMobileLocally(rawNumber);
  if (!localCheck.isValid) {
    return {
      allowOtp: false,
      normalizedNumber: localCheck.normalizedNumber,
      error: localCheck.error,
    };
  }

  const phone = localCheck.normalizedNumber;

  // 1. Check in-memory cache
  if (carrierMemoryCache.has(phone)) {
    return carrierMemoryCache.get(phone)!;
  }

  // 2. Check disk cache
  try {
    const cached = await AsyncStorage.getItem(`${STORAGE_KEY_CARRIER_PREFIX}${phone}`);
    if (cached) {
      const parsed = JSON.parse(cached) as ActiveMobileVerificationResult;
      carrierMemoryCache.set(phone, parsed);
      return parsed;
    }
  } catch {
    // Proceed to network check
  }

  // 3. Query backend proxy endpoint with 2500ms timeout
  const backendBase = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8081';
  const proxyUrl = `${backendBase}/api/auth/verify-phone-carrier?phone=${encodeURIComponent(phone)}`;

  try {
    const res = await fetchWithTimeout(proxyUrl, {
      method: 'GET',
      timeoutMs: 2500,
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const lineType = (data.line_type || data.lineType || 'mobile').toLowerCase();
      const isValidCarrier = data.valid !== false;

      // Reject Landlines and VoIP
      if (!isValidCarrier || lineType === 'landline' || lineType === 'voip') {
        const result: ActiveMobileVerificationResult = {
          allowOtp: false,
          normalizedNumber: phone,
          carrier: data.carrier || 'Unknown',
          lineType: lineType as any,
          error: `Landline or VoIP numbers (${lineType.toUpperCase()}) cannot receive Sheriyakam SMS verification.`,
        };
        carrierMemoryCache.set(phone, result);
        return result;
      }

      const result: ActiveMobileVerificationResult = {
        allowOtp: true,
        normalizedNumber: phone,
        carrier: data.carrier,
        lineType: 'mobile',
      };

      carrierMemoryCache.set(phone, result);
      AsyncStorage.setItem(`${STORAGE_KEY_CARRIER_PREFIX}${phone}`, JSON.stringify(result)).catch(() => {});
      return result;
    }

    // Server returned 429, 500, etc. Fail open so real users aren't locked out
    console.warn(`[PhoneValidator] Carrier proxy returned status ${res.status}. Failing open to allow OTP.`);
    return {
      allowOtp: true,
      normalizedNumber: phone,
      isFallback: true,
    };
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.warn(`[PhoneValidator] Carrier lookup timed out (2500ms) for ${phone}. Failing open to allow OTP.`);
    } else {
      console.warn(`[PhoneValidator] Carrier lookup network error for ${phone}:`, (err as Error).message);
    }

    // Fail-open guarantee: Real customers are NEVER blocked by 3rd party carrier API downtime
    return {
      allowOtp: true,
      normalizedNumber: phone,
      isFallback: true,
    };
  }
}
