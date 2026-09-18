import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Sparkles, FileText, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sheriyakam AI — AI Resume Builder & LinkedIn Profile Optimizer',
  description: 'Tailor your resume and LinkedIn profile for every single job description without ever inventing experience. ATS score verification and honest keyword gap matching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-200">
        {/* Universal Top Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-200 bg-clip-text text-transparent">
                  Sheriyakam<span className="text-teal-400 font-extrabold">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400/80 -mt-1">
                  Ruvalo-Class Copilot
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-400">
              <Link href="/builder" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                Resume Builder
              </Link>
              <Link href="/linkedin" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-sky-400" />
                LinkedIn Optimizer
              </Link>
              <Link href="/dashboard" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
                Versions
              </Link>
              <Link href="/pricing" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
                Packs (No Sub)
              </Link>
              <Link href="/onboarding" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors text-teal-300">
                Demo
              </Link>
              <Link href="/settings" className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors">
                Privacy
              </Link>
            </nav>

            {/* Quota Indicator & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-xs font-mono text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>5 free checks · resets in 3h 12m</span>
              </div>
              <Link
                href="/builder"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/25 transition-all hover:translate-y-[-1px]"
              >
                Tailor Resume Free
              </Link>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#05070B] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Strict Anti-Fabrication Guarantee · Zero Hallucinated Experience</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Pay-Per-Pack (No Auto-Renewals)</span>
              <span>100% Vector ATS PDF Export</span>
              <span className="text-slate-400">© 2026 Sheriyakam AI</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
