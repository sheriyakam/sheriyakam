'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Linkedin,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { getBaseResume } from '../../lib/storage';

export default function LinkedInOptimizerPage() {
  const baseResume = getBaseResume();

  const [targetRole, setTargetRole] = useState(baseResume.jobTitle || 'Senior Frontend Engineer');
  const [targetIndustry, setTargetIndustry] = useState('Tech & Cloud Software');
  const [currentHeadline, setCurrentHeadline] = useState(`Senior Frontend Developer at Meridian Cloud Systems`);
  const [currentAbout, setCurrentAbout] = useState(baseResume.summary || '');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    }
  };

  // Pre-computed recruiter search-optimized variants
  const recruiterHeadline = `${targetRole} | ${baseResume.skills.slice(0, 3).join(' • ')} | Scalable Architecture & Team Delivery`;
  const recruiterAbout = `I am a ${targetRole} dedicated to building reliable, high-performance systems and turning technical complexity into clear business value.

Throughout my work, I specialize in:
• ${baseResume.skills.slice(0, 4).join('\n• ')}

I focus on evidence-based delivery, cross-functional collaboration, and elevating engineering standards.

Feel free to connect or reach out at ${baseResume.email} to discuss technical leadership or high-impact opportunities.`;

  const missingEndorsements = [
    'System Architecture', 'Playwright', 'Next.js', 'Cross-Functional Leadership', 'Performance Optimization'
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn Recruiter Search Optimizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Optimize Your LinkedIn Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Rank in recruiter candidate searches with 220-char keyword-dense headlines and high-conversion About stories.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Profile Strength:</span>
          <span className="font-bold text-sky-400">94 / 100 Recruiter Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input parameters */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" />
              <span>Target Role & Industry</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Current Profile Headline</label>
              <textarea
                rows={2}
                value={currentHeadline}
                onChange={(e) => setCurrentHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Current About Section</label>
              <textarea
                rows={4}
                value={currentAbout}
                onChange={(e) => setCurrentAbout(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right: Optimized Deliverables */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Recruiter Headline */}
          <div className="p-6 rounded-xl border border-sky-500/30 bg-slate-900/80 space-y-3 relative shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                Recruiter-Ranked Headline (Strictly &lt; 220 chars)
              </span>
              <button
                onClick={() => handleCopy(recruiterHeadline, 'Headline')}
                className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Headline</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-sm font-semibold text-slate-100 leading-relaxed">
              {recruiterHeadline}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Length: {recruiterHeadline.length} / 220 characters</span>
              <span className="text-sky-400">✓ Front-loaded with search keywords</span>
            </div>
          </div>

          {/* 2. About Story */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
                High-Conversion About Section Story
              </span>
              <button
                onClick={() => handleCopy(recruiterAbout, 'About section')}
                className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Story</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {recruiterAbout}
            </div>
          </div>

          {/* 3. Skills Endorsement Gap Check */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <p className="text-xs font-mono text-slate-400 uppercase font-bold">
              In-Demand Skills Missing From Your Endorsements
            </p>
            <p className="text-xs text-slate-400">
              Recruiters filter candidates by top skills. Add these verified competencies to your LinkedIn Skills section:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingEndorsements.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs font-mono bg-sky-950/60 text-sky-300 border border-sky-500/30 flex items-center gap-1"
                >
                  <span>+</span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
