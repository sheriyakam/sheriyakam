'use client';

import React from 'react';
import { 
  ClipboardList, CalendarClock, Wrench, 
  CheckCircle2, ArrowRight, Zap 
} from 'lucide-react';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export default function HowItWorks({ onOpenBooking }: HowItWorksProps) {
  const steps = [
    {
      step: '01',
      icon: ClipboardList,
      title: 'Select Service & Check Pincode',
      description: 'Choose from fan repair, switchboard installation, lighting, or diagnostics and verify your Kozhikode pincode.',
    },
    {
      step: '02',
      icon: CalendarClock,
      title: 'Choose Slot & Verify via OTP',
      description: 'Pick a 2-hour time window (same-day or future date) and verify your phone number with instant SMS OTP.',
    },
    {
      step: '03',
      icon: Wrench,
      title: 'Licensed Wireman Arrives & Fixes',
      description: 'Our certified electrician arrives with 1000V insulated tools, conducts load diagnostics, and performs clean repair.',
    },
    {
      step: '04',
      icon: CheckCircle2,
      title: 'Pay After Service & 30-Day Warranty',
      description: 'Inspect the completed work, pay seamlessly via UPI or Cash, and get a digital invoice backed by 30-day warranty.',
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Sheriyakam Works
          </h2>
          <p className="text-sm text-slate-400">
            Booking a professional electrician in Kozhikode takes less than 2 minutes. Transparent, verified, and hassle-free.
          </p>
        </div>

        {/* Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-amber-400/90 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      Step {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/15 transition-all hover:scale-105"
          >
            <span>Book an Electrician in Kozhikode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
