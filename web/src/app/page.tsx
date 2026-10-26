'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Linkedin,
  ShieldCheck,
  Zap,
  Lock,
  Download,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  const [demoStep, setDemoStep] = useState<1 | 2 | 3 | 4>(4);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Does Sheriyakam AI invent experience, metrics, or credentials I don't have?",
      a: "Never. Sheriyakam enforces a strict Anti-Fabrication Guarantee. It only rewrites experience you already have into the terminology of the target job description. For any skills you possess but didn't document, an explicit checkbox allows you to confirm them before they are woven in. Anything unticked is strictly omitted."
    },
    {
      q: "What does the ATS match score (e.g. 54 → 98/100) actually mean?",
      a: "The score reflects your alignment with ATS screener algorithms (Workday, Taleo, Greenhouse, iCIMS). It evaluates keyword match percentage against the job listing, experience title relevance, hard-skill density, and action-verb strength."
    },
    {
      q: "How is my personal data handled and stored?",
      a: "Your resume and job descriptions are never used to train public AI models. Data is encrypted in transit and at rest, and you have complete control with a single-click data wipe option."
    },
    {
      q: "What happens when I exhaust my free tier quota?",
      a: "Your free tier includes 3 tailored resumes, 5 ATS checks, and 5 cover letters every 5 hours, plus 15 AI bullet refinements per day. When depleted, you can wait for the 5-hour timer to refill or purchase a 30-day one-time pack (Lite $2, Active Search $5). Packs stack, and oldest-expiring credits are always pulled first with zero auto-renewals."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.18),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-xs font-mono text-teal-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Honest ATS Scoring & Role-Tailoring · Zero Hallucinations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Tailor your best resume{' '}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              for every single job.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Increase your interview calls with an AI-powered resume builder that scores and tailors your resume to each job description in 90 seconds.
          </p>

          <p className="mt-2 text-base font-semibold text-teal-300">
            It only ever rewrites experience you already have. It never invents any.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Tailor my resume free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/linkedin"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              <Linkedin className="w-4 h-4 text-sky-400" />
              <span>Optimize LinkedIn Profile</span>
            </Link>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-500">
            No credit card required · 5 free ATS checks refilling every 5 hours
          </p>
        </div>
      </section>

      {/* LIVE 4-STEP INTERACTIVE DEMO (RUVALO AI PARADIGM) */}
      <section className="py-16 md:py-24 bg-[#0B0F19] border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">Live Interactive Demo</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              See the 4-step tailoring loop in action
            </h2>
          </div>

          {/* Interactive Workspace Mockup */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F1626] p-4 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Job Intake & Gap Analysis */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Target Role Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono uppercase">Target Role</span>
                    <span className="font-mono text-slate-500">pasted from careers board</span>
                  </div>
                  <p className="font-bold text-slate-100 text-sm">
                    Senior Frontend Engineer <span className="font-normal text-slate-400">· Northwind Labs</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    "Looking for a Senior Frontend Engineer to lead our Next.js migration and extend a shared React + TypeScript design system. Must have experience with Playwright test automation, CI/CD, and WCAG accessibility standards."
                  </p>
                </div>

                {/* ATS Match Gauge */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">ATS Match Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono text-slate-500 line-through">54</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-3xl font-extrabold text-teal-400 font-display">91</span>
                      <span className="text-xs font-mono text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 w-[91%]" />
                  </div>

                  {/* Matched Keywords */}
                  <div className="mt-4">
                    <p className="text-xs font-mono text-emerald-400 flex items-center gap-1 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Matched Competencies (8):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'TypeScript', 'Next.js', 'CI/CD', 'Playwright', 'Design Systems', 'Accessibility', 'REST APIs'].map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tailored Resume Paper Preview */}
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-slate-200 bg-white text-slate-950 p-6 shadow-xl font-sans text-xs">
                  <div className="border-b border-slate-950 pb-2 mb-3">
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-950">ALEX MERCADO</h3>
                    <p className="text-[11px] text-slate-700 font-semibold">
                      Senior Frontend Engineer <span className="text-slate-400">·</span> alex.mercado@email.com <span className="text-slate-400">·</span> San Francisco, CA
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold tracking-wider text-[11px] uppercase border-b border-slate-300 pb-1 mb-2 text-slate-900">
                      Professional Experience
                    </h4>
                    <div className="mb-2">
                      <div className="flex justify-between font-bold text-slate-900 text-[11.5px]">
                        <span>Senior Frontend Developer — Meridian Cloud Systems</span>
                        <span className="font-normal text-slate-600">2021 — Present</span>
                      </div>
                      <ul className="mt-1.5 space-y-1 text-slate-800 leading-relaxed list-disc list-inside">
                        <li>
                          <span className="bg-teal-100 font-medium text-slate-900 px-1 py-0.5 rounded">
                            Engineered 40+ features into a shared React and TypeScript component system
                          </span>{' '}
                          used by 6 product squads.
                        </li>
                        <li>
                          <span className="bg-teal-100 font-medium text-slate-900 px-1 py-0.5 rounded">
                            Led Next.js migration across customer portal
                          </span>, cutting Largest Contentful Paint (LCP) from 4.1s to 1.3s across 12 routes.
                        </li>
                        <li>
                          <span className="bg-teal-100 font-medium text-slate-900 px-1 py-0.5 rounded">
                            Architected CI/CD test automation in Playwright
                          </span>, expanding coverage to 88% and eliminating deployment regressions.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-extrabold tracking-wider text-[11px] uppercase border-b border-slate-300 pb-1 mb-1.5 text-slate-900">
                      Technical Skills
                    </h4>
                    <p className="text-slate-800">
                      React • TypeScript • Next.js • Tailwind CSS • CI/CD • Playwright • GraphQL • Accessibility (WCAG 2.2) • Jest • Git
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 4-Step Nav Toggle */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
              {[
                { step: 1, title: '1. Paste the job', sub: 'Any listing, any company board.' },
                { step: 2, title: '2. See the gap', sub: 'Which keywords you are missing.' },
                { step: 3, title: '3. Tailor it', sub: 'One pass, elevated phrasing.' },
                { step: 4, title: '4. Score climbs', sub: '54 → 91 against this role.' },
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setDemoStep(item.step as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    demoStep === item.step
                      ? 'border-teal-500/50 bg-teal-950/30'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/50'
                  }`}
                >
                  <p className={`text-xs font-bold ${demoStep === item.step ? 'text-teal-300' : 'text-slate-300'}`}>
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT WORKS SECTION */}
      <section className="py-16 md:py-24 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">Why it works</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
              A strong resume still loses to a better-matched one.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h3 className="text-lg font-bold text-white mb-2">Right experience, wrong words</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Most rejections at the initial screening stage aren't a verdict on capability. They're a resume phrased for the job you had rather than the one you're applying to, filtered out by automated screening software.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h3 className="text-lg font-bold text-white mb-2">The listing is the answer key</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Job descriptions are written with the exact vocabulary a screener searches for. Matching it isn't gaming the system—it's answering the question that was asked, in the precise terminology requested.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h3 className="text-lg font-bold text-white mb-2">Doing it by hand doesn't scale</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Rewriting a resume properly for one role takes over an hour. Which is why almost everyone stops doing it after application number five, right when volume and targeted precision matter most.
              </p>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-[#0B0F19] p-6">
              <p className="text-2xl font-extrabold text-white">No card needed</p>
              <p className="text-xs text-slate-400 mt-1">Start with 5 free ATS checks refilling every 5 hours</p>
            </div>
            <div className="bg-[#0B0F19] p-6">
              <p className="text-2xl font-extrabold text-white">Every version saved</p>
              <p className="text-xs text-slate-400 mt-1">Pinned permanently to the job description that produced it</p>
            </div>
            <div className="bg-[#0B0F19] p-6">
              <p className="text-2xl font-extrabold text-white">One click to PDF</p>
              <p className="text-xs text-slate-400 mt-1">Clean, parseable vector text—never an image or table</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION (RUVALO AI PAY-PER-PACK MODEL) */}
      <section className="py-16 md:py-24 bg-[#0B0F19] border-b border-slate-800/60" id="pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Simple pricing, no subscriptions.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Start free. When you need high volume, buy a 30-day pack with a one-time payment: UPI, cards, and netbanking. No auto-renewal, ever. Packs stack.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Free Forever</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs font-mono text-slate-500 uppercase">forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Everything you need to land interviews—you just wait between rewrites.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Full resume editor</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 3 tailored rewrites every 5 hours</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 ATS score checks every 5 hours</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 tailored cover letters every 5 hours</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 1 canonical base resume</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Text-based ATS PDF download</li>
                </ul>
              </div>

              <Link
                href="/builder"
                className="mt-8 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-center font-semibold text-sm text-slate-200 transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Lite Pack */}
            <div className="rounded-2xl border border-teal-500/40 bg-slate-900/90 p-6 flex flex-col justify-between relative shadow-xl shadow-teal-950/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Lite Pack</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-teal-400">$2</span>
                  <span className="text-xs font-mono text-slate-400 uppercase">/ 30 days one-time</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">One-time payment. No subscription, packs stack seamlessly.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 30 tailored resumes with ATS scoring</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 50 ATS score checks</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> Unlimited AI bullet refinements</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 30 tailored cover letters</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> 2 Base Resumes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 font-bold" /> Editable Word (.docx) & Vector PDF</li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="mt-8 w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-center font-bold text-sm text-slate-950 transition-colors shadow-md shadow-teal-500/20"
              >
                Get Lite Pack ($2)
              </Link>
            </div>

            {/* Active Search Pack */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Active Search</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$5</span>
                  <span className="text-xs font-mono text-slate-500 uppercase">/ 30 days one-time</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">For aggressive job hunts across multiple industries.</p>
                
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Unlimited tailored resumes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 150 ATS score checks</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Full LinkedIn profile optimizer included</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 Base Resumes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Priority fast generation pipeline</li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="mt-8 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-center font-semibold text-sm text-slate-200 transition-colors"
              >
                Get Active Search ($5)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono tracking-widest text-teal-400 uppercase">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
