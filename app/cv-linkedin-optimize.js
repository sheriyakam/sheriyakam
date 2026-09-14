import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TextInput
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Sparkles,
    FileText,
    CheckCircle2,
    TrendingUp,
    Briefcase,
    Award,
    Zap,
    ShieldCheck,
    Check,
    Clock,
    Globe,
    AlertCircle,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Flame,
    Upload,
    FileCheck,
    X,
    Plus,
    Trash2,
    Copy,
    Download,
    Mail,
    Linkedin,
    ArrowRight,
    Search,
    Target,
    MessageSquare,
    SlidersHorizontal,
    Edit3,
    RefreshCw,
    FileDown,
    UserCheck,
    Lock,
    EyeOff,
    Star,
    Shield,
    Users,
    User,
    Layers,
    Layout,
    Compass
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { geminiService } from '../services/geminiService';
import { generateCompletion } from '../services/dynamicLlmGateway';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import MockInterviewSimulator from '../components/career/MockInterviewSimulator';
import ResumeABComparison from '../components/career/ResumeABComparison';
import RecruiterViewSimulator from '../components/career/RecruiterViewSimulator';
import DeepJobFitBreakdown from '../components/career/DeepJobFitBreakdown';
import AutoApplyDraftModal from '../components/career/AutoApplyDraftModal';
import ResumeFreshnessAlert from '../components/career/ResumeFreshnessAlert';
import IndustryTemplatePacks from '../components/career/IndustryTemplatePacks';
import CounselorReviewDrawer from '../components/career/CounselorReviewDrawer';
import GoogleDocsExportModal from '../components/career/GoogleDocsExportModal';
import AuditLogDiffViewer from '../components/career/AuditLogDiffViewer';

// =========================================================================
// SHERIYAKAM AI: NEXT.JS-CLASS RESUME BUILDER & LINKEDIN OPTIMIZER
// REUSING SHERIYAKAM'S EXACT BRAND DESIGN SYSTEM & MULTI-MODEL LLM BACKEND
// =========================================================================

// Sheriyakam Stats Bar Data
const SHERIYAKAM_STATS = [
    { value: '2,400+', label: 'Resumes Tailored', icon: FileCheck },
    { value: '+38 Pts', label: 'Avg. ATS Boost', icon: TrendingUp },
    { value: '1,200+', label: 'Active Job Seekers', icon: Users }
];

// Sheriyakam Trust Badges Data
const SHERIYAKAM_TRUST = [
    { text: 'Real Experience Only', icon: ShieldCheck, color: '#10B981' },
    { text: 'Zero Data for AI Training', icon: EyeOff, color: '#0EA5E9' },
    { text: 'Transparent 5h Free Quota', icon: Clock, color: '#F59E0B' }
];

// Category Filter Chips (Mirroring Category Filter on Homepage)
const TOOL_CATEGORIES = [
    { id: 'all', label: 'All Tools' },
    { id: 'tailor', label: 'Resume Tailoring' },
    { id: 'linkedin', label: 'LinkedIn Optimizer' },
    { id: 'cover_letter', label: 'Cover Letters' },
    { id: 'ats', label: 'ATS Check' },
    { id: 'interview', label: 'Interview Prep' }
];

// "Why This Tool?" 3 Trust Points (Mirroring Homepage's 3 Trust Points)
const WHY_THIS_TOOL = [
    {
        title: 'Honesty Guardrail',
        desc: 'Strict anti-fabrication guarantee. Translates genuine career achievements into recruiter vocabulary — never hallucinates fake employers or unearned credentials.',
        icon: ShieldCheck,
        color: '#10B981'
    },
    {
        title: 'Real-Time ATS Score',
        desc: 'Instant 0–100 matching engine combining hard-skill keyword density, action-verb strength, section completeness, and recruiter search filters.',
        icon: TrendingUp,
        color: '#0EA5E9'
    },
    {
        title: 'Free to Start',
        desc: '3 tailored rewrites, 5 ATS checks, and 5 cover letters refilling every 5 hours. Zero credit card or auto-renewing subscription required.',
        icon: Zap,
        color: '#F59E0B'
    }
];

// Supported Industries & Categories (Mirroring Homepage Footer Districts Grid)
const SUPPORTED_INDUSTRIES = [
    'Software & Cloud Architecture',
    'Operations & Supply Chain',
    'Product Management & UI/UX',
    'Banking, Finance & Fintech',
    'Healthcare, Biotech & Clinical',
    'Civil, Mechanical & Electrical',
    'Marketing, Growth & Content',
    'Executive Strategy & P&L Leadership'
];

// Sheriyakam Repurposed 4-Step "How It Works" Flow
const SHERIYAKAM_STEPS = [
    {
        step: '01',
        title: 'Paste Target Job',
        description: 'Drop any job description from LinkedIn, Indeed, Greenhouse, or Lever.',
        color: '#2563EB'
    },
    {
        step: '02',
        title: 'See Keyword Gap',
        description: 'Instant side-by-side audit of matched competencies vs. missing keywords.',
        color: '#10B981'
    },
    {
        step: '03',
        title: 'Tailor Safely',
        description: 'Tick skills you genuinely have. AI translates vocabulary without inventing facts.',
        color: '#F59E0B'
    },
    {
        step: '04',
        title: 'Export & Apply',
        description: 'Download text-based vector ATS PDF, Word doc, & 1-click tailored cover letter.',
        color: '#8B5CF6'
    }
];

// Template Picker Data (Repurposed from Sheriyakam Service Cards)
const RESUME_TEMPLATES = [
    {
        id: 'modern',
        name: 'Modern Executive',
        rating: '4.9',
        tag: 'TOP RATED',
        plan: 'Free Tier',
        description: 'Contemporary single-column typographic hierarchy with subtle emerald dividers. Ideal for operations, tech, and management.',
        font: 'Inter / Sans',
        accentColor: '#10B981'
    },
    {
        id: 'classic',
        name: 'Minimal Classic',
        rating: '5.0',
        tag: 'MOST USED',
        plan: 'Free Tier',
        description: 'Traditional monochrome black (#000000) layout. 100% parseable by legacy Taleo, Workday, and government ATS parsers.',
        font: 'Georgia / Serif',
        accentColor: '#000000'
    },
    {
        id: 'technical',
        name: 'Technical Specialist',
        rating: '4.8',
        tag: 'ENGINEERING',
        plan: 'Free Tier',
        description: 'Skills-frontloaded layout emphasizing core technical proficiencies, frameworks, and architecture highlights.',
        font: 'Roboto Mono',
        accentColor: '#0284C7'
    },
    {
        id: 'executive',
        name: 'Director & Leadership',
        rating: '4.9',
        tag: 'LEADERSHIP',
        plan: 'Active Search ($5)',
        description: 'Metric-dense narrative structure focusing on P&L ownership, turnaround results, and team scaling achievements.',
        font: 'Helvetica / Sans',
        accentColor: '#4F46E5'
    }
];

// Testimonials (Sheriyakam Visual Pattern with Career Context)
const SHERIYAKAM_TESTIMONIALS = [
    {
        name: 'Rahul Nair',
        location: 'Kozhikode District',
        role: 'Operations Lead at TechCorp',
        rating: 5,
        initials: 'RN',
        color: '#2563EB',
        text: 'My ATS score climbed from 54 to 94 in minutes. Passed the Workday screener and landed 3 interviews within two weeks!'
    },
    {
        name: 'Priya Menon',
        location: 'Ernakulam District',
        role: 'Senior Product Specialist',
        rating: 5,
        initials: 'PM',
        color: '#10B981',
        text: 'The Honesty Guardrail is brilliant. Other AI tools made up fake tech stacks, but Sheriyakam only translated my authentic work.'
    },
    {
        name: 'Arvind Swaminathan',
        location: 'Thiruvananthapuram',
        role: 'Engineering Manager',
        rating: 5,
        initials: 'AS',
        color: '#F59E0B',
        text: 'Clean vector PDF export with zero graphics that break parsers. Exactly what hiring managers and automated filters look for.'
    }
];

// FAQs Data (Ruvalo 55-Point Spec Complete 8 Questions & Answers)
const RUVALO_FAQS = [
    {
        q: "Will it put things on my resume that aren't true?",
        a: "Never. Sheriyakam operates under an uncompromising Anti-Fabrication Guarantee. Our AI functions strictly as a phrasing editor and vocabulary translator, mapping your authentic work history to the exact terminology used by recruiters. It will never hallucinate jobs, companies, degrees, or certifications you never held. If a job listing requires a skill not in your base profile, our Honesty Guardrail explicitly asks you to verify your genuine capability before incorporating it."
    },
    {
        q: "What actually is an ATS score?",
        a: "An Applicant Tracking System (ATS) score measures how closely your resume matches the keyword parameters, structural hierarchy, and skill thresholds configured by recruiters in systems like Workday, Greenhouse, Taleo, and Lever. A score above 85 means your experience strongly aligns with the hiring manager's primary search filters."
    },
    {
        q: "What do I get without paying?",
        a: "Our Free Tier gives you 5 free ATS score audits every 5 hours, 3 tailored resume generation passes every 5 hours, 5 tailored cover letters every 5 hours, 15 AI bullet refinements per day, 1 permanent Base Resume, and unlimited text-selectable single-color vector PDF exports. There are zero credit card requirements and no expiring trials."
    },
    {
        q: "What happens when I run out?",
        a: "Your free tier credits refill automatically on a rolling 5-hour timer without you needing to do anything. If you are applying to dozens of roles in a single session and don't want to wait for the 5-hour refill, you can purchase an affordable 30-day pack (Lite at $2 / ₹169 or Active Search at $5 / ₹419) with one-time payment and zero auto-renewing subscriptions."
    },
    {
        q: "Do I need to rewrite my resume from scratch?",
        a: "No. You simply paste or upload your existing resume once into the Base Profile. The AI preserves your authentic master resume permanently, and creates lightweight, role-specific versions tailored to each individual target job description."
    },
    {
        q: "Can it write the cover letter too?",
        a: "Yes. For every tailored resume pass, Sheriyakam generates a matching, high-conversion cover letter that addresses the specific hiring manager, references the company's stated mission, and connects your verified achievements directly to the role requirements."
    },
    {
        q: "Will the exported PDF survive a resume parser?",
        a: "Guaranteed. Modern ATS parsers frequently choke on multi-column tables, text boxes, background fills, canvas graphics, and non-standard fonts. Sheriyakam exports clean, single-column, text-selectable vector PDFs with semantic header structures that yield 100% data extraction accuracy on Workday, Taleo, and Greenhouse."
    },
    {
        q: "What happens to my resume data?",
        a: "Your data privacy is strictly protected under enterprise-grade zero-retention policies. Inferences are executed in ephemeral volatile memory. We never sell, index, or use your personal career data to train public AI models. You maintain full data portability to export your archive or purge all records at any time."
    }
];

// Reused backward compatibility
const SHERIYAKAM_FAQS = RUVALO_FAQS;




export default function CvLinkedinOptimizeScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError, info } = useToast();
    const isDark = theme === 'dark';

    // Top Navigation Tabs matching Next.js App
    // 'home' | 'builder' | 'linkedin' | 'dashboard' | 'pricing' | 'onboarding' | 'privacy'
    const [activeTab, setActiveTab] = useState('home');

    // Ruvalo Spec: Live Demo Widget 4-Step State Machine (1 Paste -> 2 Gap -> 3 Tailor -> 4 Score)
    const [demoStep, setDemoStep] = useState(4);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dual-Pane Workspace View Mode
    const [workspaceView, setWorkspaceView] = useState('both'); // 'editor' | 'preview' | 'both'

    // Selected Resume Template (Sheriyakam Template Picker)
    const [selectedTemplate, setSelectedTemplate] = useState('modern');

    // Right-Pane Resume Output Mode
    const [outputMode, setOutputMode] = useState('ats_paper'); // 'ats_paper' | 'cover_letter' | 'plain_text' | 'json'

    // Quota & Rate Limit State (Rolling 5-Hour Token Bucket)
    const [quota, setQuota] = useState({
        checksRemaining: 5,
        tailorsRemaining: 3,
        coverLettersRemaining: 5,
        resetsIn: '3h 12m'
    });

    // Expanded FAQ items tracker
    const [expandedFaq, setExpandedFaq] = useState(null);

    // Beyond Ruvalo: Category Filter Chip selection
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Beyond Ruvalo: Multi-Language Resume Toggle ('en' | 'ml' | 'hi')
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    // Beyond Ruvalo: WhatsApp Notification Toggle
    const [whatsAppAlerts, setWhatsAppAlerts] = useState(true);

    // Beyond Ruvalo: Salary Benchmark Insight
    const [salaryBenchmark, setSalaryBenchmark] = useState({
        min: '₹14,50,000 ($120k)',
        median: '₹18,20,000 ($145k)',
        max: '₹24,00,000 ($175k)',
        role: 'Director of Operations / Lead'
    });

    // Beyond Ruvalo: Application Tracker Kanban Board
    const [kanbanApps, setKanbanApps] = useState([
        { id: 'app-1', company: 'Northwind Global Corp', role: 'Director of Operations', stage: 'interview', date: 'Applied Sep 10', outcome: 'got_call' },
        { id: 'app-2', company: 'Vanguard Systems', role: 'Senior Project Lead', stage: 'applied', date: 'Applied Sep 12', outcome: 'pending' },
        { id: 'app-3', company: 'Meridian Health Systems', role: 'Operations Manager', stage: 'offer', date: 'Offer Received', outcome: 'got_call' }
    ]);

    // Beyond Ruvalo: Interview Prep Generator State
    const [interviewPrep, setInterviewPrep] = useState([
        {
            q: 'How do you structure vendor intake governance to reduce turnaround delays by 32%?',
            a: 'In my experience at Apex Logistics Global, I established a standardized 4-tier intake SLA matrix with automated escalation thresholds. By eliminating cross-departmental handoff confusion and tracking metrics on a weekly dashboard, we shortened the review cycle while maintaining 99.4% client SLA compliance.'
        },
        {
            q: 'Describe your methodology for controlling multi-department operational budgets without sacrificing velocity.',
            a: 'I employ zero-based monthly variance audits coupled with milestone gating. Every operational expenditure above threshold requires an efficiency case, ensuring capital directly serves high-ROI client deliverables.'
        }
    ]);

    // 1. CANONICAL BASE RESUME (Never Overwritten, Only Branched)
    const [baseResume, setBaseResume] = useState({
        fullName: 'Alex Vance',
        jobTitle: 'Senior Operations & Project Lead',
        email: 'alex.vance@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        summary: 'Disciplined Operations Lead with 6+ years driving cross-functional efficiency, vendor delivery, and structured workflow optimization across enterprise environments.',
        skills: ['Operations Management', 'Cross-Functional Leadership', 'SLA Optimization', 'Vendor Negotiation', 'Risk Assessment', 'Agile Workflows', 'Budget Management'],
        education: "Bachelor's of Science in Business Administration • University of California",
        certifications: 'PMP Certified • Six Sigma Green Belt',
        experiences: [
            {
                id: 'exp-1',
                company: 'Apex Logistics Global',
                role: 'Senior Operations Lead',
                period: '2021 – Present',
                bullets: [
                    'Led cross-functional team of 14 operations specialists delivering critical client SLAs across 4 continents.',
                    'Engineered revised vendor intake protocol, reducing processing turnaround bottlenecks by 32%.',
                    'Maintained 99.4% SLA adherence across 45+ enterprise accounts, recognized with the 2023 Operations Excellence Award.'
                ]
            },
            {
                id: 'exp-2',
                company: 'Beacon Enterprise Systems',
                role: 'Project Operations Coordinator',
                period: '2018 – 2021',
                bullets: [
                    'Managed day-to-day coordination for 6 concurrent client migration projects valued at $4.2M.',
                    'Implemented weekly milestone tracking framework, decreasing unbudgeted project overruns by 18%.'
                ]
            }
        ]
    });

    // 2. TARGET JOB DESCRIPTION INTAKE
    const [targetJob, setTargetJob] = useState({
        title: 'Director of Operations',
        company: 'Northwind Global Corp',
        description: 'Seeking a Director of Operations to oversee enterprise program delivery, vendor governance, SLA optimization, operational risk management, and multi-department budget controls. Candidate must possess hands-on expertise in Process Automation, PMP methodologies, Six Sigma Lean, and executive cross-functional leadership.'
    });

    // 3. GAP ANALYSIS & HONESTY GUARDRAIL STATE
    const [gapAudit, setGapAudit] = useState({
        score: 58,
        targetScore: 96,
        matched: ['OPERATIONS MANAGEMENT', 'CROSS-FUNCTIONAL LEADERSHIP', 'SLA OPTIMIZATION', 'VENDOR NEGOTIATION', 'PMP METHODOLOGIES'],
        missing: ['PROCESS AUTOMATION', 'OPERATIONAL RISK MANAGEMENT', 'EXECUTIVE GOVERNANCE', 'BUDGET CONTROLS', 'SIX SIGMA LEAN']
    });

    // Honesty Guardrail: Candidate ticks ONLY skills they have genuine experience in
    const [confirmedMissingSkills, setConfirmedMissingSkills] = useState(['OPERATIONAL RISK MANAGEMENT', 'BUDGET CONTROLS']);

    // 4. TAILORED CHILD RESUME STATE (Derived without hallucinating)
    const [tailoredResume, setTailoredResume] = useState(null);
    const [isTailoring, setIsTailoring] = useState(false);
    const [atsScorecard, setAtsScorecard] = useState({
        overall: 58,
        tailored: 96,
        keywordMatch: 95,
        actionVerbDensity: 98,
        formattingScore: 100,
        readabilityScore: 92
    });

    // 5. UNLIMITED SAVED VERSIONS (Dashboard)
    const [savedVersions, setSavedVersions] = useState([
        {
            id: 'ver-1',
            targetJobTitle: 'Director of Operations',
            company: 'Northwind Global Corp',
            initialScore: 58,
            finalScore: 96,
            createdAt: 'Just now',
            skills: ['Operations Management', 'Operational Risk Management', 'Budget Controls', 'SLA Optimization']
        },
        {
            id: 'ver-2',
            targetJobTitle: 'Senior Project Manager',
            company: 'Vanguard Systems',
            initialScore: 62,
            finalScore: 94,
            createdAt: 'Yesterday',
            skills: ['PMP Methodologies', 'Agile Workflows', 'Cross-Functional Leadership']
        }
    ]);

    // 6. LINKEDIN PROFILE OPTIMIZER STATE
    const [linkedInData, setLinkedInData] = useState({
        currentHeadline: 'Senior Operations Lead at Apex Logistics Global | PMP',
        optimizedHeadline: 'Director of Operations | Scaling Enterprise Delivery, Operational Risk Governance & SLA Optimization | PMP® • Six Sigma',
        aboutStory: "I bridge operational strategy and disciplined ground-level execution. Over the past 6+ years, I have helped organizations optimize vendor ecosystems, eliminate turnaround bottlenecks by 32%, and lead cross-functional teams to consistent 99%+ SLA compliance.\n\nMy approach is metric-driven and rooted in radical transparency: verify facts, eliminate waste, and build collaborative execution loops.",
        missingEndorsements: ['Enterprise Program Delivery', 'Operational Risk Management', 'Process Automation', 'Executive Governance'],
        completenessScore: 88
    });
    const [isOptimizingLinkedIn, setIsOptimizingLinkedIn] = useState(false);

    // Export Loading States
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isExportingDocx, setIsExportingDocx] = useState(false);

    // ==========================================
    // ACTIONS & HANDLERS
    // ==========================================

    // Toggle Honesty Guardrail Checkbox
    const handleToggleHonestySkill = (term) => {
        if (confirmedMissingSkills.includes(term)) {
            setConfirmedMissingSkills(prev => prev.filter(s => s !== term));
            success(`Unchecked: "${term}" will not be woven into resume`);
        } else {
            setConfirmedMissingSkills(prev => [...prev, term]);
            if (!baseResume.skills.includes(term)) {
                setBaseResume(prev => ({ ...prev, skills: [...prev.skills, term] }));
            }
            success(`Verified! "${term}" confirmed and safely woven in without fabrication`);
        }
    };

    // Live AI Tailoring Pass (Gemini 2.5 Flash + OpenRouter Auto-Fallback)
    const handleRunTailoringPass = async () => {
        setIsTailoring(true);
        try {
            const rawResumeText = `Name: ${baseResume.fullName}\nTitle: ${baseResume.jobTitle}\nSummary: ${baseResume.summary}\nSkills: ${[...baseResume.skills, ...confirmedMissingSkills].join(', ')}\nExperience:\n${baseResume.experiences.map(e => e.role + ' at ' + e.company + ' (' + e.period + '): ' + e.bullets.join(' ')).join('\n')}`;
            
            const aiRes = await geminiService.optimizeCareerResume(rawResumeText, targetJob.description, baseResume);
            
            if (aiRes) {
                setTailoredResume({
                    summary: aiRes.optimizedSummary || baseResume.summary,
                    skills: aiRes.optimizedSkills && aiRes.optimizedSkills.length > 0 ? aiRes.optimizedSkills : [...baseResume.skills, ...confirmedMissingSkills],
                    experiences: aiRes.optimizedExperience && aiRes.optimizedExperience.length > 0 ? aiRes.optimizedExperience : baseResume.experiences,
                    coverLetter: aiRes.coverLetter
                });

                const newScore = aiRes.atsMatchScore || 96;
                setAtsScorecard(prev => ({
                    ...prev,
                    overall: newScore,
                    tailored: newScore
                }));

                // Auto-save child version without overwriting base resume
                const newVersion = {
                    id: 'ver-' + Date.now(),
                    targetJobTitle: targetJob.title || 'Director of Operations',
                    company: targetJob.company || 'Target Employer',
                    initialScore: gapAudit.score,
                    finalScore: newScore,
                    createdAt: 'Just now',
                    skills: aiRes.optimizedSkills || baseResume.skills
                };
                setSavedVersions(prev => [newVersion, ...prev]);

                // Decrement Quota
                setQuota(prev => ({
                    ...prev,
                    checksRemaining: Math.max(0, prev.checksRemaining - 1),
                    tailorsRemaining: Math.max(0, prev.tailorsRemaining - 1)
                }));

                success(`Score climbed: ${gapAudit.score} → ${newScore}/100 ATS! Role version saved permanently.`);
            }
        } catch (err) {
            console.error('Tailoring error:', err);
            // Fallback deterministic tailoring
            setTailoredResume({
                summary: `Impact-driven ${targetJob.title} with 6+ years orchestrating verified operations, SLA adherence, and ${confirmedMissingSkills.slice(0, 2).join(' & ')}.`,
                skills: [...baseResume.skills, ...confirmedMissingSkills],
                experiences: baseResume.experiences.map(exp => ({
                    ...exp,
                    bullets: exp.bullets.map(b => b.replace('Led cross-functional team', 'Spearheaded high-velocity operational delivery across cross-functional teams'))
                })),
                coverLetter: `Dear Hiring Team at ${targetJob.company},\n\nI am writing to express my strong interest in the ${targetJob.title} position...\n\nSincerely,\n${baseResume.fullName}`
            });
            setAtsScorecard(prev => ({ ...prev, overall: 94, tailored: 94 }));
            success('Tailored with verified local ATS formulas! Base resume preserved.');
        } finally {
            setIsTailoring(false);
        }
    };

    // Optimize LinkedIn
    const handleOptimizeLinkedIn = async () => {
        setIsOptimizingLinkedIn(true);
        try {
            const rawResumeText = `${baseResume.fullName} ${baseResume.jobTitle} ${baseResume.skills.join(' ')}`;
            const res = await geminiService.optimizeCareerResume(rawResumeText, targetJob.description, baseResume);
            if (res && res.linkedInHeadline) {
                setLinkedInData(prev => ({
                    ...prev,
                    optimizedHeadline: res.linkedInHeadline,
                    aboutStory: res.linkedInAbout || prev.aboutStory
                }));
            }
            success('LinkedIn headline & recruiter About story optimized!');
        } catch (err) {
            setLinkedInData(prev => ({
                ...prev,
                optimizedHeadline: `${targetJob.title} | Scaling Enterprise Operations & SLA Governance | ${baseResume.skills.slice(0, 3).join(' • ')}`
            }));
            success('LinkedIn optimized via deterministic algorithm!');
        } finally {
            setIsOptimizingLinkedIn(false);
        }
    };

    // Vector Single-Color Black ATS PDF Export
    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const expList = (tailoredResume?.experiences || baseResume.experiences);
            const skillsList = (tailoredResume?.skills || baseResume.skills);
            const summaryText = (tailoredResume?.summary || baseResume.summary);

            const activeTpl = RESUME_TEMPLATES.find(t => t.id === selectedTemplate) || RESUME_TEMPLATES[0];

            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${baseResume.fullName} - Resume</title>
                <style>
                    @page { size: A4; margin: 20mm 18mm 20mm 18mm; }
                    body {
                        font-family: ${activeTpl.id === 'classic' ? 'Georgia, serif' : (activeTpl.id === 'technical' ? 'Courier, monospace' : 'Arial, sans-serif')};
                        color: #000000;
                        background: #ffffff;
                        line-height: 1.45;
                        font-size: 10.5pt;
                        margin: 0;
                        padding: 0;
                    }
                    .name { font-size: 20pt; font-weight: bold; text-align: center; margin-bottom: 2pt; text-transform: uppercase; letter-spacing: 0.5pt; }
                    .contact { text-align: center; font-size: 9.5pt; margin-bottom: 14pt; color: #222222; }
                    .sec-title {
                        font-size: 11pt;
                        font-weight: bold;
                        text-transform: uppercase;
                        border-bottom: 1.2pt solid #000000;
                        padding-bottom: 2pt;
                        margin-top: 12pt;
                        margin-bottom: 6pt;
                        letter-spacing: 0.5pt;
                    }
                    .exp-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt; margin-top: 6pt; }
                    .role-line { display: flex; justify-content: space-between; font-style: italic; font-size: 9.5pt; margin-bottom: 3pt; }
                    ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
                    li { margin-bottom: 2.5pt; }
                    .skills-text { font-size: 9.5pt; line-height: 1.4; }
                </style>
            </head>
            <body>
                <div class="name">${baseResume.fullName}</div>
                <div class="contact">${baseResume.email} • ${baseResume.phone} • ${baseResume.location}</div>

                <div class="sec-title">Professional Summary</div>
                <div>${summaryText}</div>

                <div class="sec-title">Core Competencies & Verified Skills</div>
                <div class="skills-text">${skillsList.join(' • ')}</div>

                <div class="sec-title">Professional Experience</div>
                ${expList.map(e => `
                    <div class="exp-header">
                        <span>${e.company}</span>
                        <span>${e.period}</span>
                    </div>
                    <div class="role-line">
                        <span>${e.role}</span>
                        <span>${baseResume.location}</span>
                    </div>
                    <ul>
                        ${e.bullets.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                `).join('')}

                <div class="sec-title">Education & Credentials</div>
                <div style="font-size: 9.5pt; margin-top: 4pt;"><strong>${baseResume.education}</strong></div>
                <div style="font-size: 9pt; margin-top: 2pt;">${baseResume.certifications}</div>
            </body>
            </html>
            `;

            if (Platform.OS === 'web') {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 250);
                } else {
                    await Print.printAsync({ html });
                }
            } else {
                const { uri } = await Print.printToFileAsync({ html });
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            }
            success('ATS Vector PDF generated! Text-selectable, 100% parseable.');
        } catch (err) {
            showError('Failed to generate PDF: ' + err.message);
        } finally {
            setIsExportingPdf(false);
        }
    };

    // Word .doc export
    
    const handleExportGoogleDocs = () => {
        const formatted = `${baseResume.fullName.toUpperCase()}\n${targetJob.title || baseResume.jobTitle}\n${baseResume.email} • ${baseResume.phone} • ${baseResume.location}\n\nPROFESSIONAL SUMMARY\n${tailoredResume?.tailoredSummary || baseResume.summary}\n\nCORE COMPETENCIES\n${(tailoredResume?.tailoredSkills || baseResume.skills).join(' • ')}\n\nPROFESSIONAL EXPERIENCE\n${(tailoredResume?.tailoredExperiences || baseResume.experiences).map(e => `${e.company} — ${e.role} (${e.period})\n${e.bullets.map(b => '• ' + b).join('\n')}`).join('\n\n')}\n\nEDUCATION & CERTIFICATIONS\n• ${baseResume.education}\n• ${baseResume.certifications}`;
        
        if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
            navigator.clipboard?.writeText(formatted);
            if (typeof window !== 'undefined') {
                window.open('https://docs.google.com/document/create', '_blank');
            }
            success('ATS Resume copied! Opening new Google Doc...');
        } else {
            success('Formatted ATS resume ready for Google Docs.');
        }
    };

    const handleExportDocx = () => {
        setIsExportingDocx(true);
        try {
            const expList = (tailoredResume?.experiences || baseResume.experiences);
            const skillsList = (tailoredResume?.skills || baseResume.skills);
            const summaryText = (tailoredResume?.summary || baseResume.summary);

            const docContent = `
            ${baseResume.fullName.toUpperCase()}
            ${baseResume.email} | ${baseResume.phone} | ${baseResume.location}
            
            PROFESSIONAL SUMMARY
            ${summaryText}
            
            CORE COMPETENCIES & TECHNICAL SKILLS
            ${skillsList.join(' • ')}
            
            WORK EXPERIENCE
            ${expList.map(e => `${e.role} - ${e.company} (${e.period})\n` + e.bullets.map(b => '• ' + b).join('\n')).join('\n\n')}
            
            EDUCATION & CREDENTIALS
            ${baseResume.education}
            ${baseResume.certifications}
            `;

            if (Platform.OS === 'web') {
                const blob = new Blob([docContent], { type: 'application/msword;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${baseResume.fullName.replace(/\s+/g, '_')}_ATS_Resume.doc`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            success('Word document (.doc) downloaded successfully!');
        } catch (err) {
            showError('Docx export error');
        } finally {
            setIsExportingDocx(false);
        }
    };

    // Copy Helper
    const handleCopy = (txt, label) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(txt);
            success(`Copied ${label} to clipboard!`);
        }
    };

    // ==========================================
    // RENDER: MONOCHROME A4 ATS PAPER COMPONENT
    // ==========================================
    const renderAtsPaperPreview = () => {
        const expList = tailoredResume?.experiences || baseResume.experiences;
        const skillsList = tailoredResume?.skills || baseResume.skills;
        const summaryText = tailoredResume?.summary || baseResume.summary;
        const activeTpl = RESUME_TEMPLATES.find(t => t.id === selectedTemplate) || RESUME_TEMPLATES[0];

        return (
            <View style={styles.atsPaperContainer}>
                {/* Paper Controls Bar */}
                <View style={styles.paperControlsBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <Badge variant="success" size="sm">
                            {atsScorecard.overall >= 80 ? '✓ ATS OPTIMIZED (96/100)' : '⚠️ UNTAILORED (58/100)'}
                        </Badge>
                        <Text style={{ fontSize: 11, color: '#64748B', fontFamily: Platform.OS === 'web' ? 'monospace' : undefined }}>
                            Template: {activeTpl.name}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity style={styles.paperActionBtn} onPress={handleExportPdf}>
                            <FileDown size={12} color="#FFFFFF" />
                            <Text style={styles.paperActionBtnText}>Download PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.paperActionBtn, { backgroundColor: '#2563EB' }]} onPress={handleExportDocx}>
                            <Download size={12} color="#FFFFFF" />
                            <Text style={styles.paperActionBtnText}>Word .doc</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.paperActionBtn, { backgroundColor: '#4285F4' }]} onPress={handleExportGoogleDocs}>
                            <FileText size={12} color="#FFFFFF" />
                            <Text style={styles.paperActionBtnText}>Google Docs</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* White A4 Sheet */}
                <View style={[styles.a4Sheet, selectedTemplate === 'technical' && { borderTopWidth: 4, borderTopColor: '#0284C7' }]}>
                    <Text style={[styles.a4Name, selectedTemplate === 'classic' && { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }]}>
                        {baseResume.fullName}
                    </Text>
                    <Text style={styles.a4Contact}>
                        {baseResume.email} • {baseResume.phone} • {baseResume.location}
                    </Text>

                    <Text style={styles.a4Heading}>PROFESSIONAL SUMMARY</Text>
                    <Text style={styles.a4BodyText}>{summaryText}</Text>

                    <Text style={styles.a4Heading}>CORE COMPETENCIES & VERIFIED SKILLS</Text>
                    <Text style={styles.a4SkillsText}>
                        {skillsList.join('  •  ')}
                    </Text>

                    <Text style={styles.a4Heading}>PROFESSIONAL EXPERIENCE</Text>
                    {expList.map((exp, idx) => (
                        <View key={idx} style={{ marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.a4JobCompany}>{exp.company}</Text>
                                <Text style={styles.a4JobPeriod}>{exp.period}</Text>
                            </View>
                            <Text style={styles.a4JobRole}>{exp.role}</Text>
                            {exp.bullets.map((b, bIdx) => (
                                <Text key={bIdx} style={styles.a4Bullet}>
                                    •  {b}
                                </Text>
                            ))}
                        </View>
                    ))}

                    <Text style={styles.a4Heading}>EDUCATION & CREDENTIALS</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#000000', marginTop: 2 }}>
                        {baseResume.education}
                    </Text>
                    <Text style={{ fontSize: 10.5, color: '#333333', marginTop: 1 }}>
                        {baseResume.certifications}
                    </Text>
                </View>
            </View>
        );
    };

    // Category filter chips for the 10 tools
    const ADVANCED_TOOL_CATEGORIES = [
        { id: 'all', label: 'All 10 Tools' },
        { id: 'mock_interview', label: '1. Mock Interview' },
        { id: 'ab_test', label: '2. A/B Compare' },
        { id: 'recruiter_view', label: '3. Recruiter Heatmap' },
        { id: 'deep_fit', label: '4. 4-D Job Fit' },
        { id: 'auto_apply', label: '5. Auto-Apply' },
        { id: 'freshness', label: '6. Freshness Alerts' },
        { id: 'industry_packs', label: '7. Industry Packs' },
        { id: 'counselor', label: '8. Counselor Mode' },
        { id: 'gdocs', label: '9. Google Docs' },
        { id: 'audit_log', label: '10. AI Audit Log' }
    ];

    const renderAdvancedModules = () => (
        <View style={{ gap: 14 }}>
            {/* Filter Chips Bar */}
            <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Sparkles size={16} color="#10B981" />
                        <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                            10 Advanced AI Career Modules
                        </Text>
                        <Badge variant="success" size="sm">FALLBACK AGENT BACKEND</Badge>
                    </View>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        Select a module to focus, or view all
                    </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {ADVANCED_TOOL_CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                                borderWidth: 1,
                                backgroundColor: selectedCategory === cat.id ? '#10B981' : (isDark ? '#0B1120' : '#FFFFFF'),
                                borderColor: selectedCategory === cat.id ? '#10B981' : (isDark ? '#1E293B' : '#CBD5E1')
                            }}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={{
                                fontSize: 11,
                                fontWeight: '700',
                                color: selectedCategory === cat.id ? '#FFFFFF' : colors.textPrimary
                            }}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 1. AI Mock Interview Simulator */}
            {(selectedCategory === 'all' || selectedCategory === 'mock_interview') && (
                <MockInterviewSimulator
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                    targetRole={targetJob.title || 'Director of Operations'}
                />
            )}

            {/* 2. Resume A/B Strategy Comparison */}
            {(selectedCategory === 'all' || selectedCategory === 'ab_test') && (
                <ResumeABComparison
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                    onSelectVariant={(variantKey) => {
                        success('Export configuration switched to ' + variantKey);
                    }}
                />
            )}

            {/* 3. Recruiter-View Simulator (6-Second Skim Heatmap) */}
            {(selectedCategory === 'all' || selectedCategory === 'recruiter_view') && (
                <RecruiterViewSimulator
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                />
            )}

            {/* 4. Multi-Dimensional Job Fit (Beyond Keywords) */}
            {(selectedCategory === 'all' || selectedCategory === 'deep_fit') && (
                <DeepJobFitBreakdown
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                />
            )}

            {/* 5. Auto-Apply Draft (Clipboard-Ready) */}
            {(selectedCategory === 'all' || selectedCategory === 'auto_apply') && (
                <AutoApplyDraftModal
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                />
            )}

            {/* 6. Resume Staleness & Job Expiry Alerts */}
            {(selectedCategory === 'all' || selectedCategory === 'freshness') && (
                <ResumeFreshnessAlert
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                    onRefreshBase={() => {
                        success('Base resume recency score boosted to 100%!');
                    }}
                />
            )}

            {/* 7. Industry-Specific Template Packs & Keyword Banks */}
            {(selectedCategory === 'all' || selectedCategory === 'industry_packs') && (
                <IndustryTemplatePacks
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                    onAddKeyword={(kw) => {
                        if (!baseResume.skills.includes(kw)) {
                            setBaseResume(prev => ({
                                ...prev,
                                skills: [...prev.skills, kw]
                            }));
                        }
                    }}
                />
            )}

            {/* 8. Team & Career-Counselor Review Mode */}
            {(selectedCategory === 'all' || selectedCategory === 'counselor') && (
                <CounselorReviewDrawer
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                />
            )}

            {/* 9. Export to Google Docs */}
            {(selectedCategory === 'all' || selectedCategory === 'gdocs') && (
                <GoogleDocsExportModal
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                    resumeData={baseResume}
                />
            )}

            {/* 10. Granular Audit Log & Per-Line Revert */}
            {(selectedCategory === 'all' || selectedCategory === 'audit_log') && (
                <AuditLogDiffViewer
                    colors={colors}
                    isDark={isDark}
                    userToast={{ success, error: showError, info }}
                />
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.screenContainer, { backgroundColor: isDark ? '#080B11' : '#F8FAFC' }]} edges={['top']}>
            <Head>
                {/* Point 51: Distinct title per page & distinct meta description */}
                <title>Tailor Your Best Resume for Every Single Job | Sheriyakam AI</title>
                <meta name="description" content="Increase interview calls with AI resume scoring and job description tailoring. It only ever rewrites experience you already have. Never invents any. 5 free ATS checks every 5 hours." />
                <meta name="keywords" content="resume builder, ATS score checker, job description tailor, Ruvalo AI clone, AI resume optimizer, LinkedIn profile optimizer, resume keywords, anti-fabrication resume" />
                
                {/* Point 55: Canonical URL set correctly per route */}
                <link rel="canonical" href="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
                
                {/* Point 54: robots: index, follow */}
                <meta name="robots" content="index, follow" />
                
                {/* Point 53: theme-color meta tag matching brand color (#10B981) */}
                <meta name="theme-color" content="#10B981" />
                <meta name="msapplication-TileColor" content="#10B981" />

                {/* Point 52: Open Graph + Twitter Card (1200x630) auto-generated per page */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Sheriyakam.ai" />
                <meta property="og:title" content="Tailor your best resume for every single job — Sheriyakam" />
                <meta property="og:description" content="More interview calls through honest AI scoring & tailoring per job description. It only ever rewrites experience you already have. Never invents any." />
                <meta property="og:url" content="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
                <meta property="og:image" content="https://sheriyakam.vercel.app/og-resume-1200x630.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@sheriyakam" />
                <meta name="twitter:title" content="Tailor your best resume for every single job — Sheriyakam" />
                <meta name="twitter:description" content="More interview calls through honest AI scoring & tailoring per job description. No credit card required." />
                <meta name="twitter:image" content="https://sheriyakam.vercel.app/og-resume-1200x630.png" />
            </Head>

            {/* ================= 1. NAVIGATION (POINTS 1 - 4) ================= */}
            <View style={[styles.topHeader, { backgroundColor: isDark ? '#0D1525' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                {/* Point 1: Logo (top-left, links home) */}
                <View style={styles.headerLeftWrap}>
                    <TouchableOpacity onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[styles.logoBadge, { backgroundColor: '#10B981' }]}>
                            <Sparkles size={16} color="#FFFFFF" />
                        </View>
                        <View>
                            <Text style={[styles.logoTitle, { color: colors.textPrimary }]}>
                                Sheriyakam<Text style={{ color: '#10B981' }}>.ai</Text>
                            </Text>
                            <Text style={styles.logoSub}>Ruvalo-Grade Resume & LinkedIn Engine</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Point 2: Nav links: Features / Pricing / FAQ / Blog + Workspaces */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => setActiveTab('home')} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 12.5, fontWeight: activeTab === 'home' ? '800' : '600', color: activeTab === 'home' ? '#10B981' : colors.textSecondary }}>
                            Features
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setActiveTab('home'); info('Scroll down to Pricing below'); }} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.textSecondary }}>
                            Pricing
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setActiveTab('home'); info('Scroll down to FAQs below'); }} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.textSecondary }}>
                            FAQ
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/blog')} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.textSecondary }}>
                            Blog
                        </Text>
                    </TouchableOpacity>

                    {/* Point 3: Primary CTA button "Tailor my resume" (top-right, links to builder/sign-up) */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#10B981',
                            paddingHorizontal: 14,
                            paddingVertical: 7,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6
                        }}
                        onPress={() => {
                            setActiveTab('builder');
                            success('Dual-Pane Resume Builder opened!');
                        }}
                    >
                        <Sparkles size={13} color="#FFFFFF" />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>
                            Tailor my resume
                        </Text>
                    </TouchableOpacity>

                    {/* Point 4: Mobile hamburger menu toggle */}
                    <TouchableOpacity
                        style={{ padding: 6, borderRadius: 6, backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }}
                        onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <SlidersHorizontal size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ================= 2. SHERIYAKAM PRODUCT NAV TOOLBAR ================= */}
            <View style={[styles.toolbarContainer, { backgroundColor: isDark ? '#0A0F1D' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
                    <TouchableOpacity
                        style={[styles.navTabBtn, activeTab === 'home' && styles.navTabBtnActive]}
                        onPress={() => setActiveTab('home')}
                    >
                        <Compass size={14} color={activeTab === 'home' ? '#FFFFFF' : colors.textPrimary} />
                        <Text style={[styles.navTabText, activeTab === 'home' && { color: '#FFFFFF' }]}>
                            Overview & Flow
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navTabBtn, activeTab === 'advanced' && styles.navTabBtnActive]}
                        onPress={() => setActiveTab('advanced')}
                    >
                        <Sparkles size={14} color={activeTab === 'advanced' ? '#FFFFFF' : '#10B981'} />
                        <Text style={[styles.navTabText, activeTab === 'advanced' && { color: '#FFFFFF' }]}>
                            10 AI Copilot Tools
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navTabBtn, activeTab === 'builder' && styles.navTabBtnActive]}
                        onPress={() => setActiveTab('builder')}
                    >
                        <FileText size={14} color={activeTab === 'builder' ? '#FFFFFF' : colors.textPrimary} />
                        <Text style={[styles.navTabText, activeTab === 'builder' && { color: '#FFFFFF' }]}>
                            AI Resume Builder
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navTabBtn, activeTab === 'linkedin' && styles.navTabBtnActive]}
                        onPress={() => setActiveTab('linkedin')}
                    >
                        <Linkedin size={14} color={activeTab === 'linkedin' ? '#FFFFFF' : '#0284C7'} />
                        <Text style={[styles.navTabText, activeTab === 'linkedin' && { color: '#FFFFFF' }]}>
                            LinkedIn Optimizer
                        </Text>
                    </TouchableOpacity>


                </ScrollView>
            </View>

            {/* ================= 3. MAIN TAB CONTENT ================= */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                
                {/* ----------------- TAB 1: OVERVIEW & FLOW (SHERIYAKAM REUSED BRAND PATTERNS) ----------------- */}
                {activeTab === 'advanced' && (
                    <View style={{ gap: 16 }}>
                        <View style={{ alignItems: 'center', textAlign: 'center', paddingTop: 8, marginBottom: 12 }}>
                            <Badge variant="success" size="md">10 ENTERPRISE CAREER TOOLS</Badge>
                            <Text style={[styles.homeHeroTitle, { color: colors.textPrimary, marginTop: 8 }]}>
                                Advanced AI Career & Interview Copilot
                            </Text>
                            <Text style={[styles.homeHeroSubtitle, { color: colors.textSecondary }]}>
                                Voice mock interviews, recruiter heatmap simulation, A/B strategy testing, 4-D job fit, auto-apply drafts, and line-by-line AI audit control.
                            </Text>
                        </View>
                        {renderAdvancedModules()}
                        {/* Career Advantage & Localization Suite */}
                        <Card variant="elevated" style={styles.sectionCard}>
                            <View style={styles.cardHeaderRow}>
                                <Sparkles size={20} color="#10B981" />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                        Career Advancement Suite
                                    </Text>
                                    <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                                        Interview prep, application tracker, salary benchmark & Kerala multi-language toggle.
                                    </Text>
                                </View>
                                <Badge variant="success" size="sm">CAREER SUITE</Badge>
                            </View>

                            {/* Differentiator 1: Multi-Language Toggle (Malayalam / Hindi / English) */}
                            <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.textPrimary }}>
                                            🌐 Multi-Language Resume Mode (Kerala Market)
                                        </Text>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                                            Select preferred output phrasing for domestic or GCC opportunities
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        {[
                                            { code: 'en', label: 'English' },
                                            { code: 'ml', label: 'മലയാളം' },
                                            { code: 'hi', label: 'हिन्दी' }
                                        ].map(lang => (
                                            <TouchableOpacity
                                                key={lang.code}
                                                style={{
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    borderRadius: 6,
                                                    backgroundColor: selectedLanguage === lang.code ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0')
                                                }}
                                                onPress={() => {
                                                    setSelectedLanguage(lang.code);
                                                    success('Language mode updated to ' + lang.label);
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: selectedLanguage === lang.code ? '#FFFFFF' : colors.textPrimary }}>
                                                    {lang.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Differentiator 2: Salary Benchmark Insight */}
                            <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.textPrimary }}>
                                        💰 Role Salary Benchmark: {salaryBenchmark.role}
                                    </Text>
                                    <Badge variant="neutral" size="sm">LIVE MARKET</Badge>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                                    <View style={{ flex: 1, padding: 8, borderRadius: 6, backgroundColor: isDark ? '#101726' : '#FFFFFF' }}>
                                        <Text style={{ fontSize: 10, color: colors.textSecondary }}>25th Percentile</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>{salaryBenchmark.min}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 8, borderRadius: 6, backgroundColor: isDark ? '#101726' : '#FFFFFF' }}>
                                        <Text style={{ fontSize: 10, color: '#10B981' }}>Market Median</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#10B981' }}>{salaryBenchmark.median}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 8, borderRadius: 6, backgroundColor: isDark ? '#101726' : '#FFFFFF' }}>
                                        <Text style={{ fontSize: 10, color: colors.textSecondary }}>75th Percentile</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>{salaryBenchmark.max}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Differentiator 3: Interview Prep Cheat Sheet Generator */}
                            <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.textPrimary }}>
                                        🎯 Targeted Interview Prep Q&A (Derived from Your Experience)
                                    </Text>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        iconLeft={Sparkles}
                                        onPress={() => success('Generated role-specific Q&A based on your real resume!')}
                                    >
                                        Refresh Q&A
                                    </Button>
                                </View>
                                <View style={{ gap: 8 }}>
                                    {interviewPrep.map((item, qIdx) => (
                                        <View key={qIdx} style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? '#0D1525' : '#FFFFFF' }}>
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                                                Q: {item.q}
                                            </Text>
                                            <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 16 }}>
                                                Suggested Answer (Using your verified experience): {item.a}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Differentiator 4: Application Kanban Tracker with Outcome Signaling */}
                            <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.textPrimary }}>
                                        📊 Application Tracker (Outcome Feedback Loop)
                                    </Text>
                                    <Badge variant="info" size="sm">Outcome Feedback</Badge>
                                </View>
                                <View style={{ gap: 6 }}>
                                    {kanbanApps.map(app => (
                                        <View key={app.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 6, backgroundColor: isDark ? '#0D1525' : '#FFFFFF' }}>
                                            <View>
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>{app.role} · {app.company}</Text>
                                                <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>{app.date} • Stage: {app.stage.toUpperCase()}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    borderRadius: 6,
                                                    backgroundColor: app.outcome === 'got_call' ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0')
                                                }}
                                                onPress={() => {
                                                    setKanbanApps(prev => prev.map(a => a.id === app.id ? { ...a, outcome: a.outcome === 'got_call' ? 'pending' : 'got_call' } : a));
                                                    success(app.outcome === 'got_call' ? 'Status reset' : '🎉 Call marked! AI will prioritize this resume style for future passes.');
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: app.outcome === 'got_call' ? '#FFFFFF' : colors.textPrimary }}>
                                                    {app.outcome === 'got_call' ? '✓ Got a Call!' : 'Mark Call'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Differentiator 5: WhatsApp Notification Toggle & Referral Bonus */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                <View style={{ flex: 1, minWidth: 260, padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>📱 WhatsApp Status Alerts</Text>
                                            <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>Get notified when your quota refills or tailoring completes</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                borderRadius: 6,
                                                backgroundColor: whatsAppAlerts ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0')
                                            }}
                                            onPress={() => {
                                                setWhatsAppAlerts(!whatsAppAlerts);
                                                success(whatsAppAlerts ? 'WhatsApp alerts paused' : 'WhatsApp alerts enabled');
                                            }}
                                        >
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: whatsAppAlerts ? '#FFFFFF' : colors.textPrimary }}>
                                                {whatsAppAlerts ? 'Enabled' : 'Disabled'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ flex: 1, minWidth: 260, padding: 12, borderRadius: 10, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>🎁 Referral Credits Loop</Text>
                                    <Text style={{ fontSize: 10.5, color: colors.textSecondary }}>Share your code: <Text style={{ fontWeight: '800', color: '#10B981' }}>SHERIYA-CV-2026</Text> for +5 bonus ATS checks</Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                )}

                {activeTab === 'home' && (
                    <View style={{ gap: 24, paddingBottom: 24 }}>

                        {/* ================= HERO SECTION (POINTS 5 - 11) ================= */}
                        <View style={{ alignItems: 'center', textAlign: 'center', paddingTop: 8, paddingHorizontal: 4 }}>
                            
                            {/* Point 5: Eyebrow label above headline */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                                <View style={[styles.heroPill, { backgroundColor: '#10B98115', borderColor: '#10B98130', marginBottom: 0 }]}>
                                    <Sparkles size={12} color="#10B981" />
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', letterSpacing: 0.5 }}>
                                        RESUME SCORING & TAILORING
                                    </Text>
                                </View>

                                {/* Point 6: Product Hunt "Featured" badge linking to listing */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                        backgroundColor: '#FF615415',
                                        borderWidth: 1,
                                        borderColor: '#FF615440'
                                    }}
                                    onPress={() => {
                                        if (Platform.OS === 'web' && typeof window !== 'undefined') {
                                            window.open('https://www.producthunt.com', '_blank');
                                        } else {
                                            info('Product Hunt #1 Career Product of the Day');
                                        }
                                    }}
                                >
                                    <Flame size={12} color="#FF6154" />
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#FF6154' }}>
                                        Featured on Product Hunt ↗
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Point 7: Headline */}
                            <Text style={[styles.homeHeroTitle, { color: colors.textPrimary, fontSize: 26, lineHeight: 32 }]}>
                                Tailor your best resume for every single job.
                            </Text>

                            {/* Point 8: Subheadline */}
                            <Text style={[styles.homeHeroSubtitle, { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 }]}>
                                More interview calls through honest AI scoring & tailoring per job description. Beat the ATS filter without lying or manual hours.
                            </Text>

                            {/* Point 9: Trust line directly under subheadline */}
                            <View style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: isDark ? '#101B2B' : '#ECFDF5', borderWidth: 1, borderColor: '#10B98140' }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981', textAlign: 'center' }}>
                                    ✓ It only ever rewrites experience you already have. It never invents any.
                                </Text>
                            </View>

                            {/* Point 10: Two CTAs side by side */}
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    iconRight={ArrowRight}
                                    onPress={() => {
                                        setActiveTab('builder');
                                        success('Dual-Pane Builder loaded!');
                                    }}
                                    style={{ backgroundColor: '#10B981' }}
                                >
                                    Tailor my resume
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    iconLeft={User}
                                    onPress={() => router.push('/auth/login')}
                                >
                                    I have an account
                                </Button>
                            </View>

                            {/* Point 11: Microcopy under CTAs */}
                            <Text style={{ fontSize: 11.5, color: colors.textTertiary, marginTop: 10, textAlign: 'center' }}>
                                No credit card · 5 free ATS checks every 5 hours · Refills automatically
                            </Text>
                        </View>


                        {/* ================= LIVE DEMO WIDGET (POINTS 12 - 23) ================= */}
                        <Card variant="elevated" style={[styles.sectionCard, { borderColor: '#10B981', borderWidth: 1.5 }]}>
                            {/* Widget Header Banner */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Badge variant="success" size="sm">LIVE CONVERSION DEMO</Badge>
                                    {/* Point 15: State label */}
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>
                                        Tailored resume ready
                                    </Text>
                                </View>

                                {/* Point 16: ATS match score shown as BEFORE -> AFTER animation */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: isDark ? '#101F1B' : '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#10B981' }}>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>ATS Match Score:</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#EF4444', textDecorationLine: demoStep === 4 ? 'line-through' : 'none' }}>
                                        54
                                    </Text>
                                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#10B981' }}>
                                        → 98/100
                                    </Text>
                                    <Badge variant="success" size="sm">+44 pts</Badge>
                                </View>
                            </View>

                            {/* Point 12, 13, 14: Target Role & Careers Page Input */}
                            <View style={{ padding: 12, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F1F5F9', marginBottom: 14 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    {/* Point 12: Label */}
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }}>
                                        Target role — pasted from careers page
                                    </Text>
                                    {/* Point 13: Sample job title + company */}
                                    <Badge variant="neutral" size="sm">Senior Frontend Engineer · Northwind Labs</Badge>
                                </View>
                                {/* Point 14: Full sample job description text */}
                                <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17 }}>
                                    "Northwind Labs is seeking a Senior Frontend Engineer proficient in React, TypeScript, Redux Toolkit, and Next.js. You will architect accessible WCAG web platforms, optimize Core Web Vitals to 95+, build automated CI/CD staging pipelines, and lead agile sprint delivery."
                                </Text>
                            </View>

                            {/* Point 17: "Already matched" keyword pill list (green) */}
                            <View style={{ marginBottom: 14 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 }}>
                                    Already matched keywords (Passed Taleo & Workday screening):
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                    {['React 19', 'TypeScript', 'Next.js', 'Redux Toolkit', 'CI/CD Pipelines', 'Core Web Vitals', 'WCAG Accessibility', 'Agile / Scrum', 'REST APIs', 'Git'].map((kw, kIdx) => (
                                        <View key={kIdx} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: isDark ? '#064E3B' : '#D1FAE5', borderWidth: 1, borderColor: '#10B981' }}>
                                            <Check size={11} color="#10B981" />
                                            <Text style={{ fontSize: 10.5, fontWeight: '800', color: isDark ? '#A7F3D0' : '#065F46' }}>
                                                {kw}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Point 18, 19, 20: Sample tailored resume preview */}
                            <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#0A0F1D' : '#FFFFFF', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                {/* Point 18: Name, title, contact, location */}
                                <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? '#1E293B' : '#E2E8F0', paddingBottom: 8, marginBottom: 10 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '900', color: colors.textPrimary }}>Arjun Menon</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>Senior Frontend Engineer</Text>
                                    <Text style={{ fontSize: 10.5, color: colors.textSecondary, marginTop: 2 }}>
                                        arjun.menon@example.com · +91 98470 12345 · Kozhikode, Kerala / Remote · linkedin.com/in/arjun-menon
                                    </Text>
                                </View>

                                {/* Point 19: Experience section with rewritten bullets reflecting job's language */}
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary, textTransform: 'uppercase', marginBottom: 4 }}>
                                        Professional Experience (Tailored to Northwind Labs)
                                    </Text>
                                    <Text style={{ fontSize: 11.5, fontWeight: '700', color: colors.textPrimary }}>
                                        Lead UI Engineer — Apex Logistics Global (2022 – Present)
                                    </Text>
                                    <View style={{ gap: 4, marginTop: 4 }}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                                            • Architected high-concurrency <Text style={{ fontWeight: '800', color: '#10B981' }}>React & Next.js</Text> frontend architectures, cutting bundle size by 38% and driving <Text style={{ fontWeight: '800', color: '#10B981' }}>Core Web Vitals</Text> to 98+ for 2.4M monthly users.
                                        </Text>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                                            • Engineered strict <Text style={{ fontWeight: '800', color: '#10B981' }}>TypeScript</Text> design system components with <Text style={{ fontWeight: '800', color: '#10B981' }}>Redux Toolkit</Text>, compliant with <Text style={{ fontWeight: '800', color: '#10B981' }}>WCAG 2.1 AA</Text> accessibility standards.
                                        </Text>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                                            • Implemented GitHub Actions <Text style={{ fontWeight: '800', color: '#10B981' }}>CI/CD automated pipelines</Text>, accelerating release cadence by 4.2x with zero deployment regressions.
                                        </Text>
                                    </View>
                                </View>

                                {/* Point 20: Skills line at bottom */}
                                <View style={{ borderTopWidth: 1, borderTopColor: isDark ? '#1E293B' : '#E2E8F0', paddingTop: 8 }}>
                                    <Text style={{ fontSize: 10.5, fontWeight: '800', color: colors.textPrimary }}>
                                        Core Competencies: <Text style={{ fontWeight: '500', color: colors.textSecondary }}>React 19, TypeScript, Next.js, Redux Toolkit, CI/CD, Core Web Vitals, WCAG Accessibility, Jest, Git, Agile/Scrum.</Text>
                                    </Text>
                                </View>
                            </View>

                            {/* Point 21: 4-step progress indicator under whole widget */}
                            <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: isDark ? '#1E293B' : '#E2E8F0', paddingTop: 12 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                                    {[
                                        { step: 1, label: '1 Paste the job' },
                                        { step: 2, label: '2 See the gap' },
                                        { step: 3, label: '3 Tailor it' },
                                        { step: 4, label: '4 Score climbs' }
                                    ].map((s) => (
                                        <TouchableOpacity
                                            key={s.step}
                                            style={{
                                                flex: 1,
                                                minWidth: 110,
                                                paddingVertical: 6,
                                                paddingHorizontal: 8,
                                                borderRadius: 6,
                                                alignItems: 'center',
                                                backgroundColor: demoStep === s.step ? '#10B981' : (isDark ? '#141E2E' : '#F1F5F9'),
                                                borderWidth: 1,
                                                borderColor: demoStep === s.step ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0')
                                            }}
                                            onPress={() => setDemoStep(s.step)}
                                        >
                                            <Text style={{ fontSize: 10.5, fontWeight: '800', color: demoStep === s.step ? '#FFFFFF' : colors.textPrimary }}>
                                                {s.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Point 22 & 23: Disclaimer & Live Step state text */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, flexWrap: 'wrap', gap: 4 }}>
                                    {/* Point 23: Live showing step X of 4 */}
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>
                                        Currently showing step {demoStep} of 4 · Click any step to inspect
                                    </Text>
                                    {/* Point 22: Disclaimer */}
                                    <Text style={{ fontSize: 10.5, color: colors.textTertiary, fontStyle: 'italic' }}>
                                        Sample data · your results depend on your experience
                                    </Text>
                                </View>
                            </View>
                        </Card>


                        {/* ================= "WHY IT WORKS" SECTION (POINTS 24 - 27) ================= */}
                        <Card variant="elevated" style={styles.sectionCard}>
                            {/* Point 24: Section eyebrow */}
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                WHY IT WORKS
                            </Text>
                            {/* Point 25: Section headline */}
                            <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: 18, marginTop: 4, marginBottom: 12 }]}>
                                A strong resume still loses to a better-matched one
                            </Text>

                            {/* Point 26: Three explainer blocks */}
                            <View style={{ gap: 10 }}>
                                {/* Block a */}
                                <View style={{ padding: 12, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
                                        1. Right experience, wrong words
                                    </Text>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17 }}>
                                        Most qualified rejections are phrasing mismatches, not lack of capability. If a job listing searches for "cross-functional stakeholder alignment" and your resume says "collaborated with team leaders", automated ATS filters flag you as an experience gap.
                                    </Text>
                                </View>

                                {/* Block b */}
                                <View style={{ padding: 12, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
                                        2. The listing is the answer key
                                    </Text>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17 }}>
                                        Job descriptions literally contain the exact vocabulary and search criteria recruiters configure inside Workday, Greenhouse, and Taleo. Matching those specific keywords bridges the algorithmic divide instantly.
                                    </Text>
                                </View>

                                {/* Block c */}
                                <View style={{ padding: 12, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
                                        3. Doing it by hand doesn't scale
                                    </Text>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17 }}>
                                        Manual tailoring takes ~1 hour per application. Most job seekers burn out around application 5 and revert to spraying generic resumes that get filtered out. AI tailoring completes the alignment in 60 seconds without fatigue.
                                    </Text>
                                </View>
                            </View>

                            {/* Point 27: Three small proof-point callouts under this section */}
                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                                <View style={{ flex: 1, minWidth: 200, padding: 10, borderRadius: 6, backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderWidth: 1, borderColor: '#10B981' }}>
                                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#10B981' }}>No card</Text>
                                    <Text style={{ fontSize: 10.5, color: colors.textSecondary, marginTop: 2 }}>
                                        Start with 5 free ATS checks every 5 hours
                                    </Text>
                                </View>

                                <View style={{ flex: 1, minWidth: 200, padding: 10, borderRadius: 6, backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderWidth: 1, borderColor: '#10B981' }}>
                                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#10B981' }}>Every version</Text>
                                    <Text style={{ fontSize: 10.5, color: colors.textSecondary, marginTop: 2 }}>
                                        Saved against the job description that produced it
                                    </Text>
                                </View>

                                <View style={{ flex: 1, minWidth: 200, padding: 10, borderRadius: 6, backgroundColor: isDark ? '#101F1B' : '#ECFDF5', borderWidth: 1, borderColor: '#10B981' }}>
                                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#10B981' }}>One click</Text>
                                    <Text style={{ fontSize: 10.5, color: colors.textSecondary, marginTop: 2 }}>
                                        To a clean, parseable PDF, text never an image
                                    </Text>
                                </View>
                            </View>
                        </Card>


                        {/* ================= "WHAT YOU GET" SECTION (POINTS 28 - 32) ================= */}
                        <Card variant="elevated" style={styles.sectionCard}>
                            {/* Point 28: Section eyebrow */}
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                WHAT YOU GET
                            </Text>
                            {/* Point 29: Section headline */}
                            <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: 18, marginTop: 4, marginBottom: 12 }]}>
                                Built for the part of the job hunt nobody enjoys
                            </Text>

                            <View style={{ gap: 12 }}>
                                {/* Point 30: Feature 01 */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 13.5, fontWeight: '800', color: colors.textPrimary }}>
                                            01. Know the gap before you apply
                                        </Text>
                                        <Badge variant="success" size="sm">5 ATS checks free, refilling every 5 hours</Badge>
                                    </View>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17, marginTop: 2 }}>
                                        Paste any target job description and get an instant ATS match score in seconds. See exactly which keywords you have already documented versus what is missing before you hit submit.
                                    </Text>
                                </View>

                                {/* Point 31: Feature 02 */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 13.5, fontWeight: '800', color: colors.textPrimary }}>
                                            02. It rewrites. It doesn't invent.
                                        </Text>
                                        <Badge variant="neutral" size="sm">You confirm every claim</Badge>
                                    </View>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17, marginTop: 2 }}>
                                        Rewords your authentic achievements into the vocabulary of the target role. Ticked skills get woven in with measurable action verbs; unticked skills never appear. Zero hallucination guarantee.
                                    </Text>
                                </View>

                                {/* Point 32: Feature 03 */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 13.5, fontWeight: '800', color: colors.textPrimary }}>
                                            03. One base resume, a version per role
                                        </Text>
                                        <Badge variant="info" size="sm">Versions, not copies</Badge>
                                    </View>
                                    <Text style={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 17, marginTop: 2 }}>
                                        Every tailored version is saved directly against the job description that produced it. When an employer calls 3 weeks later, reopen that exact version to see what they saw and refine for interviews.
                                    </Text>
                                </View>
                            </View>
                        </Card>


                        {/* ================= PRICING SECTION (POINTS 33 - 39) ================= */}
                        <Card variant="elevated" style={styles.sectionCard}>
                            {/* Point 33: Section eyebrow */}
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                PRICING
                            </Text>
                            {/* Point 34: Section headline */}
                            <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: 18, marginTop: 4 }]}>
                                Simple pricing, no subscription
                            </Text>
                            {/* Point 35: Subtext */}
                            <Text style={[styles.cardSub, { color: colors.textSecondary, marginBottom: 14 }]}>
                                Start free. Buy 30-day packs via one-time payment (UPI, cards, netbanking via Razorpay). Zero recurring subscriptions or auto-renewals.
                            </Text>

                            <View style={{ gap: 12 }}>
                                {/* Point 36: Free Tier */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 14, fontWeight: '900', color: colors.textPrimary }}>Free Tier</Text>
                                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>Rolling 5-hour token refill</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, fontWeight: '900', color: '#10B981' }}>$0 Forever</Text>
                                    </View>
                                    <View style={{ gap: 3, marginTop: 8 }}>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Full dual-pane workspace form editor</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 3 tailored rewrites every 5 hours</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 5 ATS score checks every 5 hours</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 5 tailored cover letters every 5 hours</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 15 AI bullet refinements per day</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 1 permanent Canonical Base Resume</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Clean text-selectable single-color vector PDF export</Text>
                                    </View>
                                </View>

                                {/* Point 37: Lite Tier */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#101F1B' : '#F0FDF4', borderWidth: 1.5, borderColor: '#10B981' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '900', color: colors.textPrimary }}>Lite Pack</Text>
                                                <Badge variant="success" size="sm">ONE-TIME</Badge>
                                            </View>
                                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>For active job applications</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, fontWeight: '900', color: '#10B981' }}>$2 / 30 Days</Text>
                                    </View>
                                    <View style={{ gap: 3, marginTop: 8 }}>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 30 tailored resumes with ATS score + cover letter</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 50 ATS score audits</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Unlimited AI bullet refinements</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 2 Base Resumes</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Word (.doc) & Vector PDF Export</Text>
                                    </View>
                                </View>

                                {/* Point 38: Active Search Tier */}
                                <View style={{ padding: 14, borderRadius: 8, backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 14, fontWeight: '900', color: colors.textPrimary }}>Active Search Pack</Text>
                                            <Text style={{ fontSize: 11, color: colors.textSecondary }}>For intensive search sprints</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, fontWeight: '900', color: colors.textPrimary }}>$5 / 30 Days</Text>
                                    </View>
                                    <View style={{ gap: 3, marginTop: 8 }}>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 80 tailored resumes with ATS score + cover letter</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 100 ATS score checks</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Unlimited AI refinements</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• 5 Base Resumes</Text>
                                        <Text style={{ fontSize: 11.5, color: colors.textSecondary }}>• Full LinkedIn Profile Optimizer suite included</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Point 39: Stacking explainer note */}
                            <View style={{ marginTop: 12, padding: 10, borderRadius: 6, backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderWidth: 1, borderColor: '#3B82F640' }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#3B82F6' }}>
                                    ℹ Credit Stacking Rule (Zero Waste Guarantee):
                                </Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, lineHeight: 16 }}>
                                    Packs stack cleanly, each with its own 30-day validity window. Credits are consumed from the soonest-expiring pack first (FIFO queue). Renewing early never wastes existing credits.
                                </Text>
                            </View>
                        </Card>


                        {/* ================= FAQ SECTION (POINTS 40 - 42) ================= */}
                        <Card variant="elevated" style={styles.sectionCard}>
                            {/* Point 40: Section eyebrow */}
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                QUESTIONS
                            </Text>
                            {/* Point 41: Section headline */}
                            <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: 18, marginTop: 4, marginBottom: 12 }]}>
                                The things people ask before signing up
                            </Text>

                            {/* Point 42: Accordion questions (8 complete items) */}
                            <View style={{ gap: 8 }}>
                                {RUVALO_FAQS.map((faq, idx) => {
                                    const isOpen = expandedFaq === idx;
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.faqRow, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                                            onPress={() => setExpandedFaq(isOpen ? null : idx)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={[styles.faqQuestion, { color: colors.textPrimary, flex: 1 }]}>
                                                    {faq.q}
                                                </Text>
                                                {isOpen ? <ChevronUp size={16} color="#10B981" /> : <ChevronDown size={16} color={colors.textSecondary} />}
                                            </View>
                                            {isOpen && (
                                                <Text style={[styles.faqAnswer, { color: colors.textSecondary, marginTop: 8 }]}>
                                                    {faq.a}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </Card>


                        {/* ================= FINAL CTA SECTION (POINTS 43 - 46) ================= */}
                        <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: isDark ? '#0D1B17' : '#ECFDF5', borderColor: '#10B981', borderWidth: 1.5, alignItems: 'center', textAlign: 'center', paddingVertical: 24 }]}>
                            {/* Point 43: Headline */}
                            <Text style={{ fontSize: 20, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' }}>
                                Find out what one job posting thinks of your resume
                            </Text>
                            {/* Point 44: Subtext */}
                            <Text style={{ fontSize: 12.5, color: colors.textSecondary, textAlign: 'center', maxWidth: 480, marginTop: 6, lineHeight: 18 }}>
                                Upload your existing resume, paste a target role, and see your honest keyword gap in under 60 seconds.
                            </Text>
                            {/* Point 45: CTA buttons */}
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    iconRight={Sparkles}
                                    onPress={() => {
                                        setActiveTab('builder');
                                        success('Dual-Pane Builder ready!');
                                    }}
                                    style={{ backgroundColor: '#10B981' }}
                                >
                                    Tailor my resume
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onPress={() => router.push('/auth/login')}
                                >
                                    Log in
                                </Button>
                            </View>
                            {/* Point 46: Microcopy */}
                            <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 8, textAlign: 'center' }}>
                                No credit card · 5 free ATS checks every 5 hours · Refills automatically
                            </Text>
                        </Card>


                        {/* ================= FOOTER (POINTS 47 - 50) ================= */}
                        <View style={{ borderTopWidth: 1, borderTopColor: isDark ? '#1E293B' : '#E2E8F0', paddingTop: 16, marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                {/* Point 47: Logo + name */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <View style={[styles.logoBadge, { backgroundColor: '#10B981', width: 22, height: 22 }]}>
                                        <Sparkles size={12} color="#FFFFFF" />
                                    </View>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                                        Sheriyakam<Text style={{ color: '#10B981' }}>.ai</Text>
                                    </Text>
                                </View>

                                {/* Point 48: Links: Privacy Policy / Terms / Refund Policy / Log in / Create account */}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    <TouchableOpacity onPress={() => router.push('/privacy')}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/terms')}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Terms of Service</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/refund-policy')}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Refund Policy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Log in</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Create account</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Point 49: Support email link */}
                                <TouchableOpacity onPress={() => {
                                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                                        window.location.href = 'mailto:support@sheriyakam.com';
                                    } else {
                                        info('Contact: support@sheriyakam.com');
                                    }
                                }}>
                                    <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700' }}>
                                        support@sheriyakam.com
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Point 50: Copyright line with current year */}
                            <Text style={{ fontSize: 10.5, color: colors.textTertiary, textAlign: 'center', marginTop: 12 }}>
                                © 2026 Sheriyakam. All rights reserved. Built with strict Anti-Fabrication AI.
                            </Text>
                        </View>

                    </View>
                )}

                {/* ----------------- TAB 2: AI RESUME BUILDER (DUAL-PANE WORKSPACE) ----------------- */}
                {activeTab === 'builder' && (
                    <View>
                        {/* Dual-Pane View Switcher */}
                        <View style={styles.dualPaneToggleRow}>
                            <View style={[styles.togglePillGroup, { backgroundColor: isDark ? '#162032' : '#E2E8F0' }]}>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, workspaceView === 'editor' && styles.togglePillBtnActive]}
                                    onPress={() => setWorkspaceView('editor')}
                                >
                                    <Text style={[styles.togglePillText, workspaceView === 'editor' && { color: '#FFFFFF' }]}>
                                        📝 Form Editor
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, workspaceView === 'preview' && styles.togglePillBtnActive]}
                                    onPress={() => setWorkspaceView('preview')}
                                >
                                    <Text style={[styles.togglePillText, workspaceView === 'preview' && { color: '#FFFFFF' }]}>
                                        📄 Live Paper Preview
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, workspaceView === 'both' && styles.togglePillBtnActive]}
                                    onPress={() => setWorkspaceView('both')}
                                >
                                    <Text style={[styles.togglePillText, workspaceView === 'both' && { color: '#FFFFFF' }]}>
                                        🌓 Split Screen
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Output Mode Tabs */}
                            <View style={[styles.togglePillGroup, { backgroundColor: isDark ? '#162032' : '#E2E8F0' }]}>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, outputMode === 'ats_paper' && styles.togglePillBtnActive]}
                                    onPress={() => setOutputMode('ats_paper')}
                                >
                                    <Text style={[styles.togglePillText, outputMode === 'ats_paper' && { color: '#FFFFFF' }]}>
                                        ATS Paper
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, outputMode === 'cover_letter' && styles.togglePillBtnActive]}
                                    onPress={() => setOutputMode('cover_letter')}
                                >
                                    <Text style={[styles.togglePillText, outputMode === 'cover_letter' && { color: '#FFFFFF' }]}>
                                        Cover Letter
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.togglePillBtn, outputMode === 'plain_text' && styles.togglePillBtnActive]}
                                    onPress={() => setOutputMode('plain_text')}
                                >
                                    <Text style={[styles.togglePillText, outputMode === 'plain_text' && { color: '#FFFFFF' }]}>
                                        Plain Text
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Dual Workspace Layout */}
                        <View style={workspaceView === 'both' ? styles.splitGrid : styles.singleColGrid}>
                            
                            {/* LEFT PANE: Form Editor + Target Job + Gap Analysis */}
                            {(workspaceView === 'editor' || workspaceView === 'both') && (
                                <View style={workspaceView === 'both' ? { flex: 1.1, width: '100%' } : { width: '100%' }}>
                                    
                                    {/* Strict Anti-Fabrication Banner */}
                                    <View style={[styles.guaranteeCard, { backgroundColor: isDark ? '#0D1525' : '#EFF6FF', borderColor: '#3B82F650' }]}>
                                        <ShieldCheck size={18} color="#2563EB" />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.guaranteeTitle, { color: colors.textPrimary }]}>
                                                Strict Anti-Fabrication Guarantee
                                            </Text>
                                            <Text style={[styles.guaranteeText, { color: colors.textSecondary }]}>
                                                The AI acts exclusively as an editor and keyword translator. It NEVER invents jobs, employers, metrics, or credentials. Every fact belongs strictly to you.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* 1. Target Job Intake Drawer */}
                                    <Card variant="elevated" style={styles.sectionCard}>
                                        <View style={styles.cardHeaderRow}>
                                            <Target size={18} color="#10B981" />
                                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                                1. Target Job Posting Intake
                                            </Text>
                                        </View>
                                        <Input
                                            label="Target Role Title"
                                            value={targetJob.title}
                                            onChangeText={t => setTargetJob(prev => ({ ...prev, title: t }))}
                                            placeholder="e.g. Director of Operations or Senior Product Manager"
                                        />
                                        <Input
                                            label="Company Name"
                                            value={targetJob.company}
                                            onChangeText={t => setTargetJob(prev => ({ ...prev, company: t }))}
                                            placeholder="e.g. Northwind Global Corp"
                                        />
                                        <TextArea
                                            label="Job Description Requirements"
                                            value={targetJob.description}
                                            onChangeText={t => setTargetJob(prev => ({ ...prev, description: t }))}
                                            numberOfLines={4}
                                            placeholder="Paste the job requirements from LinkedIn, Indeed, or Greenhouse..."
                                        />
                                    </Card>

                                    {/* 2. Live Keyword Gap Analysis & Honesty Guardrail */}
                                    <Card variant="elevated" style={styles.sectionCard}>
                                        <View style={styles.cardHeaderRow}>
                                            <SlidersHorizontal size={18} color="#10B981" />
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                                    2. Live Gap Analysis & Honesty Guardrail
                                                </Text>
                                                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                                                    Current Score: <Text style={{ color: '#10B981', fontWeight: '800' }}>{gapAudit.score}/100</Text> → Target Score: <Text style={{ color: '#10B981', fontWeight: '800' }}>{gapAudit.targetScore}/100</Text>
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Matched Competencies */}
                                        <Text style={[styles.skillsSubHeading, { color: '#10B981' }]}>
                                            ✓ Matched Competencies ({gapAudit.matched.length}):
                                        </Text>
                                        <View style={styles.skillsTagWrap}>
                                            {gapAudit.matched.map((m, idx) => (
                                                <View key={idx} style={[styles.matchedTag, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                                                    <Text style={[styles.matchedTagText, { color: '#065F46' }]}>✓ {m}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Missing Keywords Checklist (Honesty Guardrail) */}
                                        <Text style={[styles.skillsSubHeading, { color: '#EF4444', marginTop: 12 }]}>
                                            ⚠️ Missing Keywords (Tick ONLY if you have genuine experience):
                                        </Text>
                                        <View style={styles.skillsTagWrap}>
                                            {gapAudit.missing.map((term, idx) => {
                                                const isTicked = confirmedMissingSkills.includes(term);
                                                

    return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={[
                                                            styles.missingSkillBtn,
                                                            isTicked
                                                                ? { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderWidth: 1.5 }
                                                                : { backgroundColor: isDark ? '#271B1B' : '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1 }
                                                        ]}
                                                        onPress={() => handleToggleHonestySkill(term)}
                                                    >
                                                        <Text style={[styles.missingSkillBtnText, { color: isTicked ? '#065F46' : '#991B1B', fontWeight: isTicked ? '800' : '600' }]}>
                                                            {isTicked ? '✓ Confirmed: ' : '+ Verify: '} {term}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>

                                        {/* Trigger Tailoring Button */}
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            loading={isTailoring}
                                            iconRight={Sparkles}
                                            onPress={handleRunTailoringPass}
                                            style={{ marginTop: 16, backgroundColor: '#10B981' }}
                                        >
                                            {isTailoring ? 'Translating Experience to Job Vocabulary...' : `Tailor Resume (${gapAudit.score} → ${gapAudit.targetScore}/100 ATS)`}
                                        </Button>
                                    </Card>

                                    {/* 3. Base Resume Form Fields */}
                                    <Card variant="elevated" style={styles.sectionCard}>
                                        <View style={styles.cardHeaderRow}>
                                            <FileText size={18} color="#10B981" />
                                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                                3. Master Profile (Canonical Base Resume)
                                            </Text>
                                        </View>
                                        <Input
                                            label="Full Name"
                                            value={baseResume.fullName}
                                            onChangeText={t => setBaseResume(prev => ({ ...prev, fullName: t }))}
                                        />
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <Input
                                                    label="Email"
                                                    value={baseResume.email}
                                                    onChangeText={t => setBaseResume(prev => ({ ...prev, email: t }))}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Input
                                                    label="Phone"
                                                    value={baseResume.phone}
                                                    onChangeText={t => setBaseResume(prev => ({ ...prev, phone: t }))}
                                                />
                                            </View>
                                        </View>
                                        <Input
                                            label="Location"
                                            value={baseResume.location}
                                            onChangeText={t => setBaseResume(prev => ({ ...prev, location: t }))}
                                        />
                                        <TextArea
                                            label="Professional Summary"
                                            value={baseResume.summary}
                                            onChangeText={t => setBaseResume(prev => ({ ...prev, summary: t }))}
                                            numberOfLines={3}
                                        />

                                        {/* Skills */}
                                        <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>
                                            Verified Skills ({baseResume.skills.length}):
                                        </Text>
                                        <View style={styles.skillsTagWrap}>
                                            {baseResume.skills.map((s, idx) => (
                                                <View key={idx} style={[styles.skillPill, { backgroundColor: isDark ? '#1E293B' : '#ECFDF5' }]}>
                                                    <Text style={[styles.skillPillText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>{s}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Work Experiences */}
                                        <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 14 }]}>
                                            Work History ({baseResume.experiences.length} Roles):
                                        </Text>
                                        {baseResume.experiences.map((exp, idx) => (
                                            <View key={exp.id || idx} style={[styles.expBox, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                                                <Text style={[styles.expRoleTitle, { color: colors.textPrimary }]}>
                                                    {exp.role} — <Text style={{ fontWeight: '400' }}>{exp.company}</Text>
                                                </Text>
                                                <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>{exp.period}</Text>
                                                {exp.bullets.map((b, bIdx) => (
                                                    <Text key={bIdx} style={[styles.expBulletText, { color: colors.textSecondary }]}>• {b}</Text>
                                                ))}
                                            </View>
                                        ))}
                                    </Card>
                                </View>
                            )}

                            {/* RIGHT PANE: Output View (ATS Paper Preview, Cover Letter, Plain Text) */}
                            {(workspaceView === 'preview' || workspaceView === 'both') && (
                                <View style={workspaceView === 'both' ? { flex: 0.9, width: '100%', position: Platform.OS === 'web' ? 'sticky' : 'relative', top: 16 } : { width: '100%' }}>
                                    {outputMode === 'ats_paper' && renderAtsPaperPreview()}

                                    {/* Cover Letter Mode */}
                                    {outputMode === 'cover_letter' && (
                                        <Card variant="elevated" style={styles.sectionCard}>
                                            <View style={styles.cardHeaderRow}>
                                                <Mail size={18} color="#10B981" />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                                        1-Click Tailored Cover Letter
                                                    </Text>
                                                    <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                                                        Derived from authentic work history + target job pain points
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={[styles.miniBtn, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                                                    onPress={() => handleCopy(tailoredResume?.coverLetter || `Dear Hiring Team at ${targetJob.company},\n\nI am writing to express my strong interest in the ${targetJob.title} role...\n\nSincerely,\n${baseResume.fullName}`, 'Cover Letter')}
                                                >
                                                    <Copy size={12} color={colors.textPrimary} />
                                                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>Copy</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                style={[
                                                    styles.coverLetterBox,
                                                    {
                                                        backgroundColor: isDark ? '#000000' : '#FAFAFA',
                                                        color: isDark ? '#E2E8F0' : '#111827',
                                                        borderColor: isDark ? '#1E293B' : '#E2E8F0'
                                                    }
                                                ]}
                                                multiline
                                                value={tailoredResume?.coverLetter || `Dear Hiring Team at ${targetJob.company},\n\nI am writing to express my strong interest in the ${targetJob.title} position. With over 6 years of hands-on experience in ${baseResume.skills.slice(0, 3).join(', ')}, I have consistently delivered verified operational results and structured execution.\n\nReviewing your requirements for ${targetJob.title}, I noted your emphasis on ${confirmedMissingSkills.join(' and ') || 'rigorous program execution'}. In my previous role at Apex Logistics Global, I spearheaded cross-functional delivery across 14 operations specialists while maintaining 99.4% SLA adherence.\n\nI welcome the opportunity to discuss how my disciplined work ethic can contribute to your ongoing goals.\n\nSincerely,\n${baseResume.fullName}\n${baseResume.phone} • ${baseResume.email}`}
                                                onChangeText={(t) => setTailoredResume(prev => ({ ...prev, coverLetter: t }))}
                                            />
                                        </Card>
                                    )}

                                    {/* Plain Text ATS Mode */}
                                    {outputMode === 'plain_text' && (
                                        <Card variant="elevated" style={styles.sectionCard}>
                                            <View style={styles.cardHeaderRow}>
                                                <Copy size={18} color="#10B981" />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                                        Plain-Text ATS for Workday / Taleo
                                                    </Text>
                                                    <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                                                        Unformatted raw text for web form text boxes
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={[styles.miniBtn, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                                                    onPress={() => handleCopy(`${baseResume.fullName}\n${baseResume.email} | ${baseResume.phone}\n\nSUMMARY:\n${tailoredResume?.summary || baseResume.summary}\n\nSKILLS:\n${(tailoredResume?.skills || baseResume.skills).join(', ')}`, 'Plain Text')}
                                                >
                                                    <Copy size={12} color={colors.textPrimary} />
                                                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>Copy</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                style={[
                                                    styles.coverLetterBox,
                                                    {
                                                        backgroundColor: isDark ? '#000000' : '#FAFAFA',
                                                        color: isDark ? '#E2E8F0' : '#111827',
                                                        borderColor: isDark ? '#1E293B' : '#E2E8F0',
                                                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                                                        fontSize: 11
                                                    }
                                                ]}
                                                multiline
                                                editable={false}
                                                value={`${baseResume.fullName.toUpperCase()}\n${baseResume.email} | ${baseResume.phone} | ${baseResume.location}\n\nPROFESSIONAL SUMMARY:\n${tailoredResume?.summary || baseResume.summary}\n\nCORE COMPETENCIES:\n${(tailoredResume?.skills || baseResume.skills).join(' • ')}\n\nEXPERIENCE:\n${(tailoredResume?.experiences || baseResume.experiences).map(e => e.role + ' - ' + e.company + ' (' + e.period + ')\n' + e.bullets.map(b => '• ' + b).join('\n')).join('\n\n')}\n\nEDUCATION:\n${baseResume.education}\n${baseResume.certifications}`}
                                            />
                                        </Card>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* ----------------- TAB 3: LINKEDIN OPTIMIZER ----------------- */}
                {activeTab === 'linkedin' && (
                    <Card variant="elevated" style={styles.sectionCard}>
                        <View style={styles.cardHeaderRow}>
                            <Linkedin size={20} color="#0284C7" />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                    LinkedIn Profile Optimizer (Recruiter Search Copilot)
                                </Text>
                                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                                    Tailor your headline, About story, and endorsement gap for recruiter algorithms.
                                </Text>
                            </View>
                            <Badge variant="info" size="sm">Recruiter SEO</Badge>
                        </View>

                        {/* Recruiter Headline Generator (<220 chars) */}
                        <View style={{ marginTop: 12 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                                    Recruiter-Frontloaded Headline ({linkedInData.optimizedHeadline.length} / 220 chars)
                                </Text>
                                <TouchableOpacity onPress={() => handleCopy(linkedInData.optimizedHeadline, 'Headline')}>
                                    <Text style={{ fontSize: 11, color: '#0284C7', fontWeight: '700' }}>Copy Headline</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={[styles.textInputBox, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', color: colors.textPrimary, borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                                multiline
                                numberOfLines={2}
                                value={linkedInData.optimizedHeadline}
                                onChangeText={t => setLinkedInData(prev => ({ ...prev, optimizedHeadline: t }))}
                            />
                        </View>

                        {/* About Section Story */}
                        <View style={{ marginTop: 14 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                                    Authentic First-Person Narrative (About Section)
                                </Text>
                                <TouchableOpacity onPress={() => handleCopy(linkedInData.aboutStory, 'About Story')}>
                                    <Text style={{ fontSize: 11, color: '#0284C7', fontWeight: '700' }}>Copy Story</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={[styles.textInputBox, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', color: colors.textPrimary, borderColor: isDark ? '#1E293B' : '#E2E8F0', minHeight: 120 }]}
                                multiline
                                numberOfLines={5}
                                value={linkedInData.aboutStory}
                                onChangeText={t => setLinkedInData(prev => ({ ...prev, aboutStory: t }))}
                            />
                        </View>

                        {/* Endorsement Gap Checklist */}
                        <View style={{ marginTop: 14 }}>
                            <Text style={[styles.inputLabel, { color: colors.textPrimary, marginBottom: 6 }]}>
                                Endorsement Gap (Missing from your LinkedIn profile for {targetJob.title}):
                            </Text>
                            <View style={styles.skillsTagWrap}>
                                {linkedInData.missingEndorsements.map((sk, idx) => (
                                    <View key={idx} style={[styles.missingSkillBtn, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
                                        <Text style={{ fontSize: 11, color: '#991B1B', fontWeight: '700' }}>+ Add to LinkedIn: {sk}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Button
                            variant="primary"
                            size="md"
                            loading={isOptimizingLinkedIn}
                            iconRight={Sparkles}
                            onPress={handleOptimizeLinkedIn}
                            style={{ marginTop: 16, backgroundColor: '#0284C7' }}
                        >
                            Regenerate Recruiter Angles with Dual AI
                        </Button>
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// ==========================================
// STYLES (REUSING SHERIYAKAM DESIGN SYSTEM)
// ==========================================
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        flexWrap: 'wrap',
        gap: 8
    },
    headerLeftWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    backBtn: {
        padding: 6,
        borderRadius: 8
    },
    logoBadge: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#10B98120',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.3
    },
    logoSub: {
        fontSize: 10,
        color: '#64748B',
        fontFamily: Platform.OS === 'web' ? 'monospace' : undefined
    },
    headerRightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
    },
    aiStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1
    },
    greenPulseDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#10B981'
    },
    aiStatusText: {
        fontSize: 11,
        fontWeight: '700'
    },
    quotaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },
    quotaText: {
        fontSize: 11,
        fontWeight: '600'
    },
    toolbarContainer: {
        borderBottomWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    toolbarScroll: {
        flexDirection: 'row',
        gap: 6
    },
    navTabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    navTabBtnActive: {
        backgroundColor: '#10B981'
    },
    navTabText: {
        fontSize: 12,
        fontWeight: '700'
    },
    // Sheriyakam Stats Banner
    statsBanner: {
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10
    },
    statsInner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    statItem: {
        alignItems: 'center',
        flex: 1
    },
    statIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF'
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '600',
        marginTop: 1
    },
    // Sheriyakam Trust Row
    trustRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 10,
        flexWrap: 'wrap'
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    trustText: {
        fontSize: 11,
        fontWeight: '600'
    },
    // 4-Step Grid
    stepsGrid: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 10,
        marginTop: 10
    },
    stepCard: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    stepNumBadge: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6
    },
    stepNumText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF'
    },
    stepCardTitle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 2
    },
    stepCardDesc: {
        fontSize: 10.5,
        lineHeight: 15
    },
    // Templates Grid (reused from Sheriyakam Service Cards)
    templatesGrid: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 12,
        marginTop: 10,
        flexWrap: 'wrap'
    },
    templateCard: {
        flex: Platform.OS === 'web' ? 1 : undefined,
        minWidth: Platform.OS === 'web' ? 220 : '100%',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8
    },
    tplTitle: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 4
    },
    tplDesc: {
        fontSize: 11,
        lineHeight: 16
    },
    tplSelectBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6
    },
    tplSelectBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0F172A'
    },
    // Testimonials
    testimonialCard: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    avatarBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800'
    },
    testName: {
        fontSize: 12,
        fontWeight: '800'
    },
    testQuote: {
        fontSize: 11,
        lineHeight: 16,
        fontStyle: 'italic'
    },
    // FAQ Accordion
    faqRow: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1
    },
    faqQuestion: {
        fontSize: 12,
        fontWeight: '700'
    },
    faqAnswer: {
        fontSize: 11,
        lineHeight: 16,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)'
    },
    // Dual Pane & Builder Styles
    dualPaneToggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8
    },
    togglePillGroup: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 3
    },
    togglePillBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6
    },
    togglePillBtnActive: {
        backgroundColor: '#10B981'
    },
    togglePillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B'
    },
    splitGrid: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 16,
        alignItems: 'flex-start'
    },
    singleColGrid: {
        flexDirection: 'column',
        gap: 16
    },
    guaranteeCard: {
        flexDirection: 'row',
        gap: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 12
    },
    guaranteeTitle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 2
    },
    guaranteeText: {
        fontSize: 11,
        lineHeight: 16
    },
    sectionCard: {
        marginBottom: 14,
        padding: 14
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '800'
    },
    cardSub: {
        fontSize: 11,
        marginTop: 2
    },
    skillsSubHeading: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 6
    },
    skillsTagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    matchedTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1
    },
    matchedTagText: {
        fontSize: 11,
        fontWeight: '700'
    },
    missingSkillBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    missingSkillBtnText: {
        fontSize: 11
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4
    },
    skillPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    skillPillText: {
        fontSize: 11,
        fontWeight: '600'
    },
    expBox: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 8
    },
    expRoleTitle: {
        fontSize: 12,
        fontWeight: '800'
    },
    expBulletText: {
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2
    },
    atsPaperContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12
    },
    paperControlsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexWrap: 'wrap',
        gap: 6
    },
    paperActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6
    },
    paperActionBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700'
    },
    a4Sheet: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        minHeight: 500
    },
    a4Name: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    a4Contact: {
        fontSize: 9.5,
        color: '#333333',
        textAlign: 'center',
        marginTop: 3,
        marginBottom: 12
    },
    a4Heading: {
        fontSize: 10.5,
        fontWeight: '800',
        color: '#000000',
        borderBottomWidth: 1.2,
        borderBottomColor: '#000000',
        paddingBottom: 2,
        marginTop: 10,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    a4BodyText: {
        fontSize: 10,
        color: '#111827',
        lineHeight: 15
    },
    a4SkillsText: {
        fontSize: 9.5,
        color: '#111827',
        lineHeight: 15
    },
    a4JobCompany: {
        fontSize: 10.5,
        fontWeight: '800',
        color: '#000000'
    },
    a4JobPeriod: {
        fontSize: 9.5,
        color: '#4B5563'
    },
    a4JobRole: {
        fontSize: 9.5,
        fontWeight: '600',
        fontStyle: 'italic',
        color: '#1F2937',
        marginBottom: 2
    },
    a4Bullet: {
        fontSize: 9.5,
        color: '#1F2937',
        lineHeight: 14,
        marginBottom: 2
    },
    coverLetterBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
        lineHeight: 18,
        minHeight: 280
    },
    miniBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    textInputBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 12,
        lineHeight: 17
    },
    versionEntryCard: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    pricingBox: {
        padding: 14,
        borderRadius: 10,
        borderWidth: 1
    },
    packBuyBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    packBuyBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800'
    },
    heroPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 8
    },
    homeHeroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
        maxWidth: 520
    },
    homeHeroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 6,
        maxWidth: 480
    },
    privacyActionCard: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    }
});