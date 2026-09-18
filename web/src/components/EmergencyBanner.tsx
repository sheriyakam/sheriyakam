'use client';

import React from 'react';
import { AlertTriangle, Phone, Zap } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenBooking: (serviceId?: string) => void;
}

export default function EmergencyBanner({ onOpenBooking }: EmergencyBannerProps) {
  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border-y border-rose-500/20 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>Electrical Emergency in Kozhikode?</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Continuous Tripping · Sparking · Burning Odor
              </span>
            </p>
            <p className="text-[11px] text-slate-300">
              Turn off your main isolator switch immediately. Our emergency response wiremen are on priority standby.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+914952800000"
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Line: 0495 280 0000</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenBooking('diag-short-circuit')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Book Fault Check
          </button>
        </div>
      </div>
    </div>
  );
}
