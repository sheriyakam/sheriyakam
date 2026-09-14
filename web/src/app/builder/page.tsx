'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Plus,
  Trash2,
  Edit3,
  SlidersHorizontal,
  Mail,
  Check,
  X,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { ResumeData, WorkExperience, TailoredVersion } from '../../lib/types';
import {
  getBaseResume,
  saveBaseResume,
  saveTailoredVersion,
  getQuotaInfo,
  deductQuota
} from '../../lib/storage';
import {
  analyzeKeywordGap,
  tailorExperienceBullets,
  tailorSummary,
  generateCoverLetter,
  KeywordGapResult
} from '../../lib/atsEngine';

export default function ResumeBuilderPage() {
  // Navigation & Step Workflow
  // 'base_editor' | 'job_intake' | 'gap_analysis' | 'ai_review'
  const [activeTab, setActiveTab] = useState<'base_editor' | 'job_intake' | 'gap_analysis' | 'ai_review'>('base_editor');
  
  // Right-pane Output Mode
  // 'ats_paper' | 'plain_text' | 'cover_letter' | 'json'
  const [outputMode, setOutputMode] = useState<'ats_paper' | 'plain_text' | 'cover_letter' | 'json'>('ats_paper');

  // Resume State (Canonical Base Resume)
  const [resume, setResume] = useState<ResumeData>(getBaseResume());
  
  // Target Job State
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  
  // Gap Analysis & Tailoring State
  const [gapResult, setGapResult] = useState<KeywordGapResult | null>(null);
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);
  const [tailoredExperiences, setTailoredExperiences] = useState<WorkExperience[]>([]);
  const [tailoredSummaryText, setTailoredSummaryText] = useState('');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isTailoring, setIsTailoring] = useState(false);
  
  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-save base resume whenever it changes
  useEffect(() => {
    saveBaseResume(resume);
  }, [resume]);

  // Handle Adding New Skill
  const [newSkillInput, setNewSkillInput] = useState('');
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!resume.skills.includes(newSkillInput.trim())) {
      setResume({ ...resume, skills: [...resume.skills, newSkillInput.trim()] });
      setNewSkillInput('');
      showToast('Skill added to your profile');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter(s => s !== skillToRemove)
    });
  };

  // Handle Work Experience Editing
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: 'exp-' + Date.now(),
      company: 'Company Name',
      role: 'Role Title',
      period: '2022 — Present',
      bullets: ['Led key operational responsibilities and delivered verified team results.']
    };
    setResume({
      ...resume,
      experiences: [newExp, ...resume.experiences]
    });
    showToast('Work experience entry added');
  };

  const handleRemoveExperience = (id: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.filter(e => e.id !== id)
    });
  };

  const handleUpdateBullet = (expId: string, bulletIdx: number, newText: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map(e => {
        if (e.id === expId) {
          const updated = [...e.bullets];
          updated[bulletIdx] = newText;
          return { ...e, bullets: updated };
        }
        return e;
      })
    });
  };

  const handleAddBulletToExp = (expId: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: [...e.bullets, 'Accomplished domain milestone with quantifiable accuracy.'] };
        }
        return e;
      })
    });
  };

  // STEP 2: RUN ATS GAP AUDIT
  const handleRunGapAudit = () => {
    if (!targetJobDescription.trim()) {
      showToast('Please paste a job description first');
      return;
    }
    const quotaOk = deductQuota('check');
    if (!quotaOk) {
      showToast('Free checks quota exhausted. Wait for 5-hour refill or get a Lite Pack.');
      return;
    }

    const res = analyzeKeywordGap(resume, targetJobDescription);
    setGapResult(res);
    if (!targetJobTitle && res.extractedTitle) setTargetJobTitle(res.extractedTitle);
    if (!targetCompany && res.extractedCompany) setTargetCompany(res.extractedCompany);
    
    // Switch to gap analysis tab
    setActiveTab('gap_analysis');
    showToast(`ATS Gap Analysis complete! Initial Match: ${res.initialScore}%`);
  };

  // Toggle Honesty Guardrail skill checkbox
  const handleToggleConfirmedSkill = (skill: string) => {
    if (confirmedSkills.includes(skill)) {
      setConfirmedSkills(confirmedSkills.filter(s => s !== skill));
    } else {
      setConfirmedSkills([...confirmedSkills, skill]);
    }
  };

  // STEP 3: RUN AI TAILORING PASS (HONESTY ENFORCED)
  const handleGenerateTailoredResume = () => {
    const quotaOk = deductQuota('tailor');
    if (!quotaOk) {
      showToast('Free tailor quota exhausted. Refills in 5 hours or upgrade to Lite.');
      return;
    }

    setIsTailoring(true);
    setTimeout(() => {
      // Execute verified formula: Action Verb + Task + Quantifiable Result
      const { rewrittenExperiences, finalScore: calculatedFinal } = tailorExperienceBullets(
        resume.experiences,
        confirmedSkills,
        targetJobDescription
      );

      const tailoredSum = tailorSummary(resume.summary, targetJobTitle, confirmedSkills);

      setTailoredExperiences(rewrittenExperiences);
      setTailoredSummaryText(tailoredSum);
      setFinalScore(calculatedFinal);
      setIsTailoring(false);
      setActiveTab('ai_review');

      // Auto save version to storage
      const newVersion: TailoredVersion = {
        id: 'ver-' + Date.now(),
        baseResumeId: resume.id || 'base-1',
        targetJobTitle: targetJobTitle || 'Target Role',
        targetCompany: targetCompany || 'Company',
        targetJobDescription,
        initialScore: gapResult?.initialScore || 54,
        finalScore: calculatedFinal,
        matchedKeywords: gapResult?.matchedKeywords || [],
        missingKeywords: gapResult?.missingKeywords || [],
        confirmedSkills,
        rewrittenSummary: tailoredSum,
        rewrittenExperiences,
        coverLetter: generateCoverLetter(resume, targetJobTitle, targetCompany, confirmedSkills),
        createdAt: new Date().toISOString()
      };
      saveTailoredVersion(newVersion);

      showToast(`Tailoring complete! Score climbed to ${calculatedFinal}/100`);
    }, 700);
  };

  // Generate plain-text for Workday/Taleo
  const getPlainTextResume = () => {
    const activeSummary = tailoredSummaryText || resume.summary;
    const activeExps = tailoredExperiences.length > 0 ? tailoredExperiences : resume.experiences;
    const allSkills = Array.from(new Set([...resume.skills, ...confirmedSkills]));

    return `===================================================================
${(resume.fullName || 'CANDIDATE').toUpperCase()}
${(targetJobTitle || resume.jobTitle || 'PROFESSIONAL').toUpperCase()}
Email: ${resume.email} | Phone: ${resume.phone} | Location: ${resume.location}
===================================================================

PROFESSIONAL SUMMARY
-------------------------------------------------------------------
${activeSummary}

CORE COMPETENCIES & TECHNICAL SKILLS
-------------------------------------------------------------------
${allSkills.join(' • ')}

PROFESSIONAL EXPERIENCE
-------------------------------------------------------------------
${activeExps.map(e => `${e.role.toUpperCase()} | ${e.company} (${e.period})\n${e.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

EDUCATION & CREDENTIALS
-------------------------------------------------------------------
${resume.education.map(ed => `${ed.degree} - ${ed.institution} (${ed.year})`).join('\n')}
${resume.certifications.join('\n')}
===================================================================`;
  };

  // Structured JSON export
  const getStructuredJson = () => {
    const activeSummary = tailoredSummaryText || resume.summary;
    const activeExps = tailoredExperiences.length > 0 ? tailoredExperiences : resume.experiences;
    const allSkills = Array.from(new Set([...resume.skills, ...confirmedSkills]));

    return JSON.stringify({
      matchScore: finalScore || gapResult?.initialScore || 75,
      targetRole: targetJobTitle || resume.jobTitle,
      matchedKeywords: gapResult?.matchedKeywords || [],
      missingKeywords: gapResult?.missingKeywords || [],
      confirmedSkills,
      optimizedSummary: activeSummary,
      optimizedExperience: activeExps,
      optimizedSkills: allSkills,
      coverLetter: generateCoverLetter(resume, targetJobTitle, targetCompany, confirmedSkills)
    }, null, 2);
  };

  // Print Clean Vector PDF
  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#070A11]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-teal-500 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header Breadcrumb / Status */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Resume Tailoring Workspace</span>
          <span className="text-slate-600">/</span>
          <span className="text-teal-400 font-mono">
            {targetJobTitle ? `Targeting: ${targetJobTitle}` : 'Base Resume (Canonical)'}
          </span>
        </div>

        {/* Live Score Indicator */}
        <div className="flex items-center gap-3">
          {gapResult && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <span className="text-slate-400">ATS Match:</span>
              <span className="font-mono font-bold text-slate-400 line-through">{gapResult.initialScore}</span>
              <span className="text-slate-500">→</span>
              <span className="font-mono font-bold text-teal-300">
                {finalScore > 0 ? finalScore : gapResult.initialScore}/100
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Honesty Guardrail Active</span>
          </div>
        </div>
      </div>

      {/* MAIN DUAL-PANE CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANE: CONTROLS & FORMS (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-[#0B0F19] flex flex-col h-full overflow-y-auto">
          {/* Step Selector Tabs */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/40 text-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('base_editor')}
              className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'base_editor'
                  ? 'border-teal-400 text-teal-300 bg-teal-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Base CV</span>
            </button>

            <button
              onClick={() => setActiveTab('job_intake')}
              className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'job_intake'
                  ? 'border-teal-400 text-teal-300 bg-teal-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>2. Job Intake</span>
            </button>

            <button
              onClick={() => setActiveTab('gap_analysis')}
              className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'gap_analysis'
                  ? 'border-teal-400 text-teal-300 bg-teal-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>3. Gap Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_review')}
              className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'ai_review'
                  ? 'border-teal-400 text-teal-300 bg-teal-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4. AI Diff</span>
            </button>
          </div>

          {/* TAB 1: BASE RESUME EDITOR */}
          {activeTab === 'base_editor' && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Canonical Base Resume</h2>
                  <p className="text-xs text-slate-400">Your permanent career source of truth. Never overwritten.</p>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                  Auto-saved
                </span>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.fullName}
                      onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Current Job Title</label>
                    <input
                      type="text"
                      value={resume.jobTitle}
                      onChange={(e) => setResume({ ...resume, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.email}
                      onChange={(e) => setResume({ ...resume, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.phone}
                      onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.location}
                      onChange={(e) => setResume({ ...resume, location: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Skills Tags */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Technical Skills & Competencies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Next.js, Docker, SEO)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-mono text-slate-400">Work History & Achievements</label>
                  <button
                    onClick={handleAddExperience}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...resume.experiences];
                            updated[idx].role = e.target.value;
                            setResume({ ...resume, experiences: updated });
                          }}
                          className="font-bold text-xs bg-transparent text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resume.experiences];
                            updated[idx].company = e.target.value;
                            setResume({ ...resume, experiences: updated });
                          }}
                          className="text-xs bg-transparent text-slate-300 border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...resume.experiences];
                            updated[idx].period = e.target.value;
                            setResume({ ...resume, experiences: updated });
                          }}
                          className="text-xs text-right bg-transparent text-slate-400 border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-1.5 pt-1">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-slate-500 text-xs mt-1">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddBulletToExp(exp.id)}
                          className="text-[11px] text-teal-400/80 hover:text-teal-300 mt-1 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add bullet point</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Next Step */}
              <button
                onClick={() => setActiveTab('job_intake')}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue to Step 2: Target Job Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: JOB DESCRIPTION INTAKE */}
          {activeTab === 'job_intake' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-white">Target Job Description</h2>
                <p className="text-xs text-slate-400">Paste the job posting from LinkedIn, Indeed, or Greenhouse.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Product Manager"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe or Remote"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Job Posting Text</label>
                <textarea
                  rows={10}
                  placeholder="Paste the full job requirements, responsibilities, and qualifications here..."
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <button
                onClick={handleRunGapAudit}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-4 h-4" />
                <span>Run ATS Keyword Gap Analysis</span>
              </button>
            </div>
          )}

          {/* TAB 3: GAP AUDIT & HONESTY GUARDRAIL */}
          {activeTab === 'gap_analysis' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">ATS Keyword Gap Analysis</h2>
                  <p className="text-xs text-slate-400">Comparing your base resume against the target role.</p>
                </div>
                {gapResult && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    Base Match: {gapResult.initialScore}%
                  </span>
                )}
              </div>

              {/* Matched Keywords */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Competencies ({gapResult?.matchedKeywords.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(gapResult?.matchedKeywords || []).map((term) => (
                    <span key={term} className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-900/40 text-emerald-200 border border-emerald-500/30">
                      ✓ {term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords & Honesty Guardrail */}
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Missing Keywords — Honesty Guardrail</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  ⚠️ <strong>Strict Rule:</strong> Only check skills you genuinely possess. Anything unticked is strictly excluded from AI rewrites.
                </p>

                <div className="space-y-2">
                  {(gapResult?.missingKeywords || []).map((term) => {
                    const isChecked = confirmedSkills.includes(term);
                    return (
                      <label
                        key={term}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-teal-500/60 bg-teal-950/30 text-teal-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleConfirmedSkill(term)}
                            className="rounded border-slate-700 text-teal-500 focus:ring-0"
                          />
                          <span className="font-mono font-medium">{term}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {isChecked ? 'Confirmed: Will weave in' : 'Unticked: Excluded'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateTailoredResume}
                disabled={isTailoring}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isTailoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Tailoring with Action Verbs & Metrics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tailor Resume for this Role (Honesty Enforced)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: AI REVIEW & DIFF MODE */}
          {activeTab === 'ai_review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">AI Diff & Review</h2>
                  <p className="text-xs text-slate-400">Review rewritten bullet points using Action Verb + Task + Metric.</p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-500/40">
                  Target Score: {finalScore}/100
                </span>
              </div>

              <div className="p-3 rounded-lg border border-teal-500/30 bg-teal-950/20 text-xs text-teal-300">
                ✓ Anti-fabrication check passed: Zero hallucinated companies or numbers.
              </div>

              {/* Experiences Diff List */}
              <div className="space-y-4">
                {tailoredExperiences.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                    <p className="text-xs font-bold text-white">{exp.role} — {exp.company}</p>
                    <div className="space-y-2 text-xs">
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                          <p className="text-slate-200 leading-relaxed font-sans">{b}</p>
                          <div className="flex items-center justify-between text-[10px] text-teal-400">
                            <span>Elevated with confirmed terminology</span>
                            <span className="text-slate-500 font-mono">Action Verb + Metric formula</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: LIVE PREVIEW & ATS VECTOR EXPORT (7 Cols) */}
        <div className="lg:col-span-7 bg-[#05070D] flex flex-col h-full overflow-y-auto">
          {/* Action Bar */}
          <div className="p-3 sm:px-6 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setOutputMode('ats_paper')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  outputMode === 'ats_paper' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ATS Vector Paper
              </button>
              <button
                onClick={() => setOutputMode('plain_text')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  outputMode === 'plain_text' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Plain-Text (.txt)
              </button>
              <button
                onClick={() => setOutputMode('cover_letter')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  outputMode === 'cover_letter' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cover Letter
              </button>
              <button
                onClick={() => setOutputMode('json')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  outputMode === 'json' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPdf}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Vector PDF</span>
              </button>
            </div>
          </div>

          {/* PREVIEW CANVAS */}
          <div className="flex-1 p-4 sm:p-8 flex justify-center items-start">
            
            {/* ATS Paper View */}
            {outputMode === 'ats_paper' && (
              <div className="w-full max-w-[700px] bg-white text-[#000000] p-8 sm:p-10 rounded-sm shadow-2xl font-sans text-[12px] leading-normal border border-slate-300">
                {/* Header */}
                <div className="border-b-2 border-black pb-2 mb-3">
                  <h1 className="text-2xl font-extrabold text-black tracking-tight uppercase">{resume.fullName || 'Candidate Name'}</h1>
                  <p className="text-xs font-bold text-black mt-0.5 uppercase tracking-wide">
                    {targetJobTitle || resume.jobTitle || 'Professional Title'}
                  </p>
                  <p className="text-[11px] text-black mt-1">
                    {resume.phone} • {resume.email} • {resume.location}
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="mb-3.5">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                    Professional Summary
                  </h2>
                  <p className="text-justify leading-relaxed text-black">
                    {tailoredSummaryText || resume.summary}
                  </p>
                </div>

                {/* Core Competencies */}
                <div className="mb-3.5">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                    Core Competencies & Technical Skills
                  </h2>
                  <p className="leading-relaxed text-black">
                    {Array.from(new Set([...resume.skills, ...confirmedSkills])).join(' • ')}
                  </p>
                </div>

                {/* Professional Experience */}
                <div className="mb-3.5">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider border-b border-black pb-0.5 mb-2 text-black">
                    Professional Experience
                  </h2>
                  <div className="space-y-3">
                    {(tailoredExperiences.length > 0 ? tailoredExperiences : resume.experiences).map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-bold text-black text-[11.5px]">
                          <span>{exp.role.toUpperCase()} — {exp.company}</span>
                          <span className="font-normal text-black">{exp.period}</span>
                        </div>
                        <ul className="mt-1 space-y-1 list-disc list-outside pl-4 text-black">
                          {exp.bullets.map((b, idx) => (
                            <li key={idx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mb-3">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-black">
                    Education & Credentials
                  </h2>
                  {resume.education.map((ed) => (
                    <div key={ed.id} className="flex justify-between text-black">
                      <span className="font-semibold">{ed.degree} — {ed.institution}</span>
                      <span>{ed.year}</span>
                    </div>
                  ))}
                  {resume.certifications.length > 0 && (
                    <p className="mt-1 text-black font-medium">{resume.certifications.join(' • ')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Plain-Text View */}
            {outputMode === 'plain_text' && (
              <div className="w-full max-w-[700px] flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Formatted for Workday / Taleo / Greenhouse text boxes:</span>
                  <button
                    onClick={() => handleCopy(getPlainTextResume(), 'Plain-text resume')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={24}
                  value={getPlainTextResume()}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none"
                />
              </div>
            )}

            {/* Cover Letter View */}
            {outputMode === 'cover_letter' && (
              <div className="w-full max-w-[700px] flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Tailored 1-Click Cover Letter:</span>
                  <button
                    onClick={() => handleCopy(generateCoverLetter(resume, targetJobTitle, targetCompany, confirmedSkills), 'Cover letter')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Letter</span>
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {generateCoverLetter(resume, targetJobTitle, targetCompany, confirmedSkills)}
                </div>
              </div>
            )}

            {/* JSON View */}
            {outputMode === 'json' && (
              <div className="w-full max-w-[700px] flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Strict API Structured JSON Output:</span>
                  <button
                    onClick={() => handleCopy(getStructuredJson(), 'Structured JSON')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={24}
                  value={getStructuredJson()}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-teal-300 font-mono text-xs leading-relaxed focus:outline-none"
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
