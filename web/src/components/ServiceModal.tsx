'use client';

import React from 'react';
import { X, CheckCircle2, AlertOctagon, Clock, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Service } from '@/types';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (service: Service) => void;
}

export default function ServiceModal({ service, isOpen, onClose, onBookNow }: ServiceModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-slate-900/90 border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
              {service.category}
            </span>
            {service.durationMinutes && (
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Est. {service.durationMinutes} mins
              </span>
            )}
          </div>

          <h2 id="service-modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {service.title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          {/* What's Included */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              What is Included
            </h3>
            <ul className="space-y-2">
              {service.included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              Exclusions & Spare Parts Notice
            </h3>
            <ul className="space-y-1.5">
              {service.exclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-300/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-amber-500/20">
              * Note: If replacement materials, MCBs, or wires are required, they can be customer-supplied or provided by the wireman at verified retail MRP with bill.
            </p>
          </div>

          {/* Safety Standards */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400">
              <span className="font-bold text-white block mb-0.5">Kerala Licensed Wireman Standard</span>
              Services adhere to IS:732 electrical safety practices using VDE-insulated 1000V tools and earth load testing before completion.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Estimated Rate
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
              {service.price ? (service.priceType === 'starting' ? `Starts at ₹${service.price}` : `₹${service.price}`) : 'Custom Quote'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onBookNow(service);
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Book</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
