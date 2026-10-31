/**
 * ifscService.ts
 * Electrician Bank Account & IFSC Verification
 * Validates bank IFSC via Razorpay IFSC public lookup to guarantee accurate technician payouts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTimeout } from './fetchWithTimeout';

export interface BankBranchDetails {
  ifsc: string;
  bank: string;
  branch: string;
  city: string;
  district: string;
  state?: string;
  upiEnabled: boolean;
  isManualOverride?: boolean;
}

export interface IfscLookupResponse {
  success: boolean;
  data?: BankBranchDetails;
  error?: string;
  canManualOverride: boolean;
}

const STORAGE_KEY_IFSC_PREFIX = '@sheriyakam_ifsc_';
const ifscMemoryCache = new Map<string, BankBranchDetails>();

/**
 * Validates 11-character Indian Financial System Code (IFSC) format.
 * Format: 4 letters representing bank code, 5th character is '0', followed by 6 alphanumeric characters.
 * Example: SBIN0000800, HDFC0000123, FDRL0001358
 */
export function isValidIfscFormat(ifsc: string): boolean {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

export const ifscService = {
  /**
   * Verifies an IFSC code via the free Razorpay public IFSC gateway.
   * Caches successful lookups to eliminate duplicate requests.
   * Times out strictly at 2500ms so technicians are never frozen on onboarding forms.
   */
  async verifyIfsc(ifscCode: string): Promise<IfscLookupResponse> {
    const cleanIfsc = (ifscCode || '').trim().toUpperCase();

    if (!isValidIfscFormat(cleanIfsc)) {
      return {
        success: false,
        error: 'Invalid IFSC format. Must be 11 characters (e.g. SBIN0000800 or FDRL0001358).',
        canManualOverride: true,
      };
    }

    // 1. Check in-memory session cache
    if (ifscMemoryCache.has(cleanIfsc)) {
      return {
        success: true,
        data: ifscMemoryCache.get(cleanIfsc)!,
        canManualOverride: false,
      };
    }

    // 2. Check AsyncStorage persistent cache
    try {
      const persisted = await AsyncStorage.getItem(`${STORAGE_KEY_IFSC_PREFIX}${cleanIfsc}`);
      if (persisted) {
        const parsed = JSON.parse(persisted) as BankBranchDetails;
        ifscMemoryCache.set(cleanIfsc, parsed);
        return {
          success: true,
          data: parsed,
          canManualOverride: false,
        };
      }
    } catch {
      // Proceed to network lookup
    }

    // 3. Query Razorpay Public IFSC Gateway with 2500ms timeout
    try {
      const res = await fetchWithTimeout(`https://ifsc.razorpay.com/${cleanIfsc}`, {
        timeoutMs: 2500,
        headers: { Accept: 'application/json' },
      });

      if (res.status === 404) {
        return {
          success: false,
          error: 'IFSC code not found. Please double-check the code printed on your passbook/cheque.',
          canManualOverride: true,
        };
      }

      if (!res.ok) {
        return {
          success: false,
          error: `Bank verification server returned status ${res.status}. You may enter bank details manually.`,
          canManualOverride: true,
        };
      }

      const json = await res.json();
      const details: BankBranchDetails = {
        ifsc: cleanIfsc,
        bank: json.BANK || '',
        branch: json.BRANCH || '',
        city: json.CITY || '',
        district: json.DISTRICT || '',
        state: json.STATE || '',
        upiEnabled: Boolean(json.UPI),
      };

      // Cache verified branch details
      ifscMemoryCache.set(cleanIfsc, details);
      AsyncStorage.setItem(`${STORAGE_KEY_IFSC_PREFIX}${cleanIfsc}`, JSON.stringify(details)).catch(() => {});

      return {
        success: true,
        data: details,
        canManualOverride: false,
      };
    } catch (err) {
      console.warn(`[IFSCService] Lookup failed for ${cleanIfsc}:`, (err as Error).message);
      return {
        success: false,
        error: 'Bank lookup service timed out or offline. Manual entry is enabled below.',
        canManualOverride: true,
      };
    }
  },
};
