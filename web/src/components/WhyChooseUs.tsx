'use client';

import React from 'react';
import { 
  Award, ShieldCheck, FileSpreadsheet, Clock, 
  Sparkles, Wrench, CheckCircle2, ShieldAlert 
} from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Award,
      title: 'Kerala Licensed Wiremen',
      description: 'Every electrician holds a valid Kerala Electrical Inspectorate wireman certification and undergoes police ID verification.',
      badge: 'Certified Pros'
    },
    {
      icon: FileSpreadsheet,
      title: 'Fixed & Transparent Rate Card',
      description: 'Standard base rates starting at ₹149. You approve the full cost before work begins. No hidden travel or surge fees.',
      badge: 'Zero Hidden Costs'
    },
    {
      icon: ShieldCheck,
      title: '30-Day Service Warranty',
      description: 'Complete peace of mind. If any repaired electrical fixture or wiring fails within 30 days, we revisit and fix it free of charge.',
      badge: 'Guaranteed'
    },
    {
      icon: Clock,
      title: 'Punctual 2-Hour Arrival Slots',
      description: 'Select a convenient time slot. Our electrician calls 30 minutes before arrival so you never waste time waiting.',
      badge: 'On-Time'
    },
    {
      icon: Wrench,
      title: '1000V Insulated VDE Tools',
      description: 'Technicians carry industrial-grade VDE-insulated pliers, digital multimeters, earth resistance testers, and ISI-certified consumables.',
      badge: 'Safety First'
    },
    {
      icon: Sparkles,
      title: 'Post-Work Cleanup & Testing',
      description: 'We test load distribution, check earth continuity, clean up stripped wire insulation, and leave your switchboards spotless.',
      badge: 'Clean Finish'
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-slate-950/60 border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Kozhikode Trusts Sheriyakam</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Professional Electrical Service Without the Guesswork
          </h2>
          <p className="text-sm text-slate-400">
            No bargaining with unverified technicians. Standard rates, licensed wiremen, and guaranteed safety compliance for your home & office.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/30 transition-all hover:bg-slate-900 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* IS:732 Regulatory Compliance Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>IS:732 Indian Electrical Wiring Standards Compliant</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              All domestic wiring, MCB switchgear upgrades, and earth testing conducted by Sheriyakam strictly follow Bureau of Indian Standards (BIS) and Kerala State Electricity Board (KSEB) safety guidelines.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              KSEB/BIS Code
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
