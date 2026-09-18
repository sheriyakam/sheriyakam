'use client';

import React from 'react';
import { Phone, Zap } from 'lucide-react';

interface MobileStickyCTAProps {
  onOpenBooking: () => void;
}

export default function MobileStickyCTA({ onOpenBooking }: MobileStickyCTAProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Direct Call Button */}
        <a
          href="tel:+914952800000"
          className="flex-1 py-3 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:bg-slate-800 transition-colors"
          aria-label="Call Calicut Electrician Helpline"
        >
          <Phone className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Call Helpline</span>
        </a>

        {/* Primary Booking CTA */}
        <button
          type="button"
          onClick={onOpenBooking}
          className="flex-[1.5] py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
        >
          <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
          <span>Book Electrician</span>
        </button>
      </div>
    </div>
  );
}
