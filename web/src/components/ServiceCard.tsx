'use client';

import React from 'react';
import { Clock, Info, Check, ArrowRight, Zap } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export default function ServiceCard({ service, onBook, onViewDetails }: ServiceCardProps) {
  const formatPrice = () => {
    if (service.priceType === 'quote' || !service.price) {
      return 'Get a Quote';
    }
    if (service.priceType === 'starting') {
      return `₹${service.price}`;
    }
    return `₹${service.price}`;
  };

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between backdrop-blur-sm">
      {service.popular && (
        <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
          Most Booked
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
            {service.category}
          </span>
          {service.durationMinutes && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              ~{service.durationMinutes} mins
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
          {service.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
          {service.shortDescription}
        </p>

        {/* 2 Key Inclusions */}
        <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
          {service.included.slice(0, 2).map((inc, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{inc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
            {service.priceType === 'starting' ? 'Starting Rate' : 'Standard Rate'}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-amber-400">
            {formatPrice()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(service)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="View Details & Scope"
            aria-label={`View details for ${service.title}`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            type="button"
            onClick={() => onBook(service)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            aria-label={`Book ${service.title}`}
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
