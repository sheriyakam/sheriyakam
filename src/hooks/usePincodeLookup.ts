/**
 * usePincodeLookup.ts
 * React Native Hook for debounced PIN code lookup with auto-fill & graceful manual fallback.
 */

import { useState, useEffect, useRef } from 'react';
import { locationService, PinLocalityResult, isValidPincodeFormat } from '../services/locationService';

export interface UsePincodeLookupReturn {
  pincode: string;
  setPincode: (pin: string) => void;
  localityData: PinLocalityResult | null;
  selectedPostOffice: string;
  setSelectedPostOffice: (po: string) => void;
  isLoading: boolean;
  error: string | null;
  isManualMode: boolean;
  toggleManualMode: () => void;
  reset: () => void;
}

export function usePincodeLookup(
  initialPincode: string = '',
  debounceMs: number = 700
): UsePincodeLookupReturn {
  const [pincode, setPincode] = useState<string>(initialPincode);
  const [localityData, setLocalityData] = useState<PinLocalityResult | null>(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const trimmed = pincode.trim();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset if user cleared the input
    if (trimmed.length === 0) {
      setLocalityData(null);
      setSelectedPostOffice('');
      setError(null);
      setIsLoading(false);
      return;
    }

    // Only fire network lookup once exactly 6 digits are typed
    if (trimmed.length < 6) {
      setLocalityData(null);
      setSelectedPostOffice('');
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!isValidPincodeFormat(trimmed)) {
      setError('Please enter a valid 6-digit postal code.');
      setLocalityData(null);
      return;
    }

    setError(null);
    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await locationService.fetchLocalityByPin(trimmed);
        if (result) {
          setLocalityData(result);
          setSelectedPostOffice(result.postOffices[0] || '');
          setError(null);
          setIsManualMode(false);
        } else {
          setLocalityData(null);
          setError('Could not verify PIN code. Manual entry enabled.');
          setIsManualMode(true); // Automatically unlock manual fields so customer is never stuck
        }
      } catch (err) {
        setLocalityData(null);
        setError('Location lookup failed. Manual entry enabled.');
        setIsManualMode(true);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [pincode, debounceMs]);

  const toggleManualMode = () => {
    setIsManualMode((prev) => !prev);
  };

  const reset = () => {
    setPincode('');
    setLocalityData(null);
    setSelectedPostOffice('');
    setError(null);
    setIsLoading(false);
    setIsManualMode(false);
  };

  return {
    pincode,
    setPincode,
    localityData,
    selectedPostOffice,
    setSelectedPostOffice,
    isLoading,
    error,
    isManualMode,
    toggleManualMode,
    reset,
  };
}
