'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { PincodeArea } from '@/types';

interface LocationValidatorProps {
  onLocationVerified?: (area: PincodeArea) => void;
  onValidated?: (pincode: string, areaName: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export default function LocationValidator({
  onLocationVerified,
  onValidated,
  className = '',
  autoFocus = false
}: LocationValidatorProps) {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'error' | 'unavailable';
    message: string;
    area?: PincodeArea;
  }>({ status: 'idle', message: '' });

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pincode.trim().replace(/\D/g, '');

    if (clean.length !== 6) {
      setResult({
        status: 'error',
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }

    setLoading(true);
    setResult({ status: 'idle', message: '' });
    trackEvent('location_checked', { pincode: clean });

    try {
      const res = await fetch(`/api/service-areas/check?pincode=${clean}`);
      const data = await res.json();

      if (data.serviceable && data.area) {
        setResult({
          status: 'success',
          message: data.message || `Service active in ${data.area.areaName}`,
          area: data.area
        });
        trackEvent('location_available', { pincode: clean, area: data.area.areaName });
        if (onLocationVerified) {
          onLocationVerified(data.area);
        }
        if (onValidated) {
          onValidated(clean, data.area.areaName);
        }
      } else {
        setResult({
          status: 'unavailable',
          message: data.message || 'Service not currently available in this area.'
        });
        trackEvent('location_unavailable', { pincode: clean });
      }
    } catch (err) {
      setResult({
        status: 'error',
        message: 'Network error checking pincode. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleCheck} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoFocus={autoFocus}
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setPincode(val);
              if (result.status !== 'idle') setResult({ status: 'idle', message: '' });
              if (val.length === 6) {
                setTimeout(() => handleCheck(), 100);
              }
            }}
            placeholder="Enter 6-digit PIN code (e.g. 673001)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-white border border-slate-700 rounded-xl text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            aria-label="Enter PIN code for serviceability verification"
          />
        </div>

        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Check Area</span>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {result.status === 'success' && (
        <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{result.message}</span>
            <span className="block text-emerald-300/80 text-[11px] mt-0.5">Wiremen active for scheduling in this zone.</span>
          </div>
        </div>
      )}

      {result.status === 'unavailable' && (
        <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span>{result.message}</span>
          </div>
        </div>
      )}

      {result.status === 'error' && (
        <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
