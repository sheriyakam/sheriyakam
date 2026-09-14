'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Trash2,
  Search,
  CheckCircle2
} from 'lucide-react';
import { getBaseResume, getTailoredVersions } from '../../lib/storage';
import { TailoredVersion, ResumeData } from '../../lib/types';

export default function DashboardPage() {
  const [baseResume, setBaseResume] = useState<ResumeData | null>(null);
  const [versions, setVersions] = useState<TailoredVersion[]>([]);

  useEffect(() => {
    setBaseResume(getBaseResume());
    setVersions(getTailoredVersions());
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono text-teal-400 uppercase">Career Version Control</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            My Resumes & Tailored Versions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every tailored resume is pinned permanently to the target job description that created it.
          </p>
        </div>

        <Link
          href="/builder"
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailor New Role</span>
        </Link>
      </div>

      {/* Canonical Base Resume Card */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          Canonical Base Resume (1)
        </h2>
        {baseResume && (
          <div className="p-5 rounded-xl border border-teal-500/40 bg-slate-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-950 border border-teal-500/40 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{baseResume.fullName} — Master Profile</p>
                <p className="text-xs text-slate-400">{baseResume.jobTitle} • {baseResume.skills.length} skills • {baseResume.experiences.length} roles</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/builder"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Edit Master
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Role-Tailored Child Versions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Role-Tailored Child Versions ({versions.length})
          </h2>
        </div>

        {versions.length === 0 ? (
          <div className="p-10 rounded-xl border border-dashed border-slate-800 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No tailored versions created yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Paste a job description in the Resume Builder to see your first role-tailored version appear here.
            </p>
            <Link
              href="/builder"
              className="inline-flex px-4 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs mt-2"
            >
              Create first tailored version
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">{ver.targetJobTitle}</p>
                    <p className="text-xs text-teal-400">{ver.targetCompany}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                    {ver.finalScore}/100 ATS
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {ver.rewrittenSummary}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Tailored {new Date(ver.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href="/builder"
                    className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                  >
                    <span>Open in Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
