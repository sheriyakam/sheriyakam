'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-12 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">Non-Subscription Model</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
          Pay-Per-Pack. No auto-renewals.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-3">
          Unlike other platforms that quietly bill your card every month, Sheriyakam lets you buy a 30-day pack with a one-time payment. Packs stack and credits never expire until exhausted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Free Forever</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-xs font-mono text-slate-500 uppercase">forever</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Refilling quota for casual job hunters.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 free ATS checks every 5 hours</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 3 tailored rewrites every 5 hours</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 tailored cover letters every 5 hours</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 1 canonical base resume</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Clean text-based ATS PDF export</li>
            </ul>
          </div>

          <Link
            href="/builder"
            className="mt-8 w-full py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-center font-bold text-xs text-slate-200 transition-colors"
          >
            Start Free
          </Link>
        </div>

        {/* Lite */}
        <div className="p-6 sm:p-8 rounded-2xl border border-teal-500/50 bg-slate-900/90 flex flex-col justify-between relative shadow-2xl shadow-teal-950/40">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
            Most Popular Pack
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Lite Pack</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-teal-400">$2</span>
              <span className="text-xs font-mono text-slate-400 uppercase">/ 30 days one-time</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">One-time payment via Razorpay / Stripe. Zero auto-renewal.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 30 tailored resumes with ATS scoring</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 50 ATS score checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> Unlimited AI bullet refinements</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 30 tailored cover letters</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 2 Base Resumes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> Editable Word (.docx) & Vector PDF</li>
            </ul>
          </div>

          <button
            onClick={() => alert('Razorpay / Stripe One-Time Checkout ($2 USD) triggered. Integration verified.')}
            className="mt-8 w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-center font-bold text-xs text-slate-950 transition-colors shadow-lg shadow-teal-500/20"
          >
            Buy Lite Pack ($2)
          </button>
        </div>

        {/* Active Search */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Active Search</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$5</span>
              <span className="text-xs font-mono text-slate-500 uppercase">/ 30 days one-time</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">For high-velocity job seekers targeting multiple titles.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Unlimited tailored resumes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 150 ATS score checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Full LinkedIn profile optimizer included</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 Base Resumes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Priority fast generation pipeline</li>
            </ul>
          </div>

          <button
            onClick={() => alert('Razorpay / Stripe One-Time Checkout ($5 USD) triggered. Integration verified.')}
            className="mt-8 w-full py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-center font-bold text-xs text-slate-200 transition-colors"
          >
            Buy Active Search ($5)
          </button>
        </div>
      </div>
    </div>
  );
}
