/**
 * useIfscLookup.ts
 * React Native Hook for Electrician IFSC validation and auto-locking bank details.
 */

import { useState, useEffect, useRef } from 'react';
import { ifscService, BankBranchDetails, isValidIfscFormat } from '../services/ifscService';

export interface UseIfscLookupReturn {
  ifsc: string;
  setIfsc: (code: string) => void;
  bankDetails: BankBranchDetails | null;
  isLoading: boolean;
  error: string | null;
  isLocked: boolean;
  isManualOverride: boolean;
  manualBankName: string;
  setManualBankName: (name: string) => void;
  manualBranchName: string;
  setManualBranchName: (branch: string) => void;
  toggleManualOverride: () => void;
  reset: () => void;
}

export function useIfscLookup(
  initialIfsc: string = '',
  debounceMs: number = 600
): UseIfscLookupReturn {
  const [ifsc, setIfsc] = useState<string>(initialIfsc);
  const [bankDetails, setBankDetails] = useState<BankBranchDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  // Manual fallback inputs if API fails or electrician has specialized cooperative bank
  const [manualBankName, setManualBankName] = useState<string>('');
  const [manualBranchName, setManualBranchName] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const clean = ifsc.trim().toUpperCase();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (clean.length === 0) {
      setBankDetails(null);
      setError(null);
      setIsLocked(false);
      setIsLoading(false);
      return;
    }

    // Only fire when all 11 characters have been typed
    if (clean.length < 11) {
      setBankDetails(null);
      setError(null);
      setIsLocked(false);
      setIsLoading(false);
      return;
    }

    if (!isValidIfscFormat(clean)) {
      setError('Invalid IFSC format. Must be 11 characters (e.g. SBIN0000800).');
      setBankDetails(null);
      setIsLocked(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    timerRef.current = setTimeout(async () => {
      try {
        const response = await ifscService.verifyIfsc(clean);
        if (response.success && response.data) {
          setBankDetails(response.data);
          setManualBankName(response.data.bank);
          setManualBranchName(response.data.branch);
          setError(null);
          setIsLocked(true); // Lock inputs to prevent payout account typos
          setIsManualOverride(false);
        } else {
          setBankDetails(null);
          setError(response.error || 'IFSC verification failed. Please enter details manually.');
          setIsLocked(false);
          setIsManualOverride(true);
        }
      } catch (err) {
        setBankDetails(null);
        setError('Network timeout verifying IFSC. Manual entry unlocked.');
        setIsLocked(false);
        setIsManualOverride(true);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ifsc, debounceMs]);

  const toggleManualOverride = () => {
    setIsManualOverride((prev) => !prev);
    setIsLocked(false);
  };

  const reset = () => {
    setIfsc('');
    setBankDetails(null);
    setError(null);
    setIsLocked(false);
    setIsManualOverride(false);
    setManualBankName('');
    setManualBranchName('');
  };

  return {
    ifsc,
    setIfsc,
    bankDetails,
    isLoading,
    error,
    isLocked,
    isManualOverride,
    manualBankName,
    setManualBankName,
    manualBranchName,
    setManualBranchName,
    toggleManualOverride,
    reset,
  };
}
