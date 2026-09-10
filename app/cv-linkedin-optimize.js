import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Linking,
    TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
    ArrowLeft,
    Sparkles,
    FileText,
    CheckCircle2,
    ChevronRight,
    Star,
    TrendingUp,
    Briefcase,
    Award,
    Zap,
    ShieldCheck,
    Check,
    Clock,
    Globe,
    UserCheck,
    AlertCircle,
    Send,
    HelpCircle,
    Phone,
    ChevronDown,
    ChevronUp,
    Linkedin,
    Gift,
    Flame,
    Share2,
    MessageCircle,
    Upload,
    FileCheck,
    X,
    HeartHandshake,
    Smile,
    Bot,
    CirclePlus,
    Copy,
    Download
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, TextArea } from '../components/ui/Input';

const GLOBAL_REGIONS = [
    { id: 'gcc_middle_east', label: '🇦🇪 UAE & Gulf / GCC (MOHRE / Saudi)' },
    { id: 'us_ca', label: '🇺🇸 USA & Canada (ATS Standard)' },
    { id: 'uk_eu', label: '🇬🇧 UK & Europe (Europass / Standard)' },
    { id: 'india_asia', label: '🇮🇳 India & South Asia' },
    { id: 'aus_apac', label: '🌏 Australia & Asia-Pacific' },
    { id: 'global_remote', label: '🌐 Global Remote / Worldwide' },
];

const GLOBAL_INDUSTRIES = [
    { id: 'automatic', label: '⚡ Automatic (AI Auto-Detect from CV)' },
    { id: 'electrical_eng', label: '⚡ Electrical, MEP & Engineering' },
    { id: 'tech', label: '💻 Software, AI & IT' },
    { id: 'trades_ops', label: '⚙️ Trades, Construction & Facility' },
    { id: 'healthcare', label: '🏥 Healthcare & Nursing' },
    { id: 'corporate_mgmt', label: '📊 Corporate, Finance & Management' },
    { id: 'sales_marketing', label: '🚀 Sales, Marketing & Creative' },
];

const EXPERIENCE_LEVELS = [
    { id: 'entry', label: 'Fresher / Entry (0-1 yr)' },
    { id: 'junior', label: 'Junior (1-3 yrs)' },
    { id: 'mid', label: 'Mid-Level (3-6 yrs)' },
    { id: 'senior', label: 'Senior (6-10 yrs)' },
    { id: 'lead', label: 'Lead / Supervisor (10+ yrs)' },
];

const COUNTRY_CODES = [
    { code: '+91', country: 'India' },
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi' },
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+65', country: 'Singapore' },
    { code: '+974', country: 'Qatar' },
    { code: '+968', country: 'Oman' },
    { code: '+other', country: 'Other' },
];

const FREE_GLOBAL_FEATURES = [
    'Option 1: Upload Existing CV — Fix ATS parsing errors & rewrite in human voice',
    'Option 2: Create Brand New CV — Generate complete ATS-proof resume from scratch',
    '100% Highly Humanized Writing — Zero Robotic AI Slop, Zero Generic Buzzwords',
    'Authentic Storytelling with Quantified CAR Bullets (Challenge, Action, Result)',
    'Global Standards Match: US Resume, UK/EU, GCC (Dubai/MOHRE/NEOM), or Asian Formats',
    'Complete LinkedIn Profile Blueprint (Headline, Story Summary, Top 50 Skills)',
    'Editable Word (.docx) + Pixel-Perfect Vector PDF Formats',
    '100% Free Forever for Job Seekers Globally (₹0 / $0 / £0 / €0)',
];

const FAQS = [
    {
        q: 'What is the difference between "Optimize Existing CV" and "Create New CV"?',
        a: 'If you already have a resume, choose "Optimize Existing CV" — upload your file or paste your text, and we will audit and rewrite it to fix parsing errors and inject humanized impact. If you do not have a resume yet (fresh graduate, career changer, or skilled trade worker starting fresh), choose "Create Brand New CV" — answer a few simple questions, and our system builds a complete, professional, ATS-proof CV from scratch!',
    },
    {
        q: 'Can anyone worldwide use both options for free?',
        a: 'Yes, absolutely! Whether you are job-hunting in the United States, United Kingdom, Canada, UAE, Saudi Arabia, Germany, India, Singapore, or anywhere else across 50+ countries, our service is 100% completely free. We adapt formatting and keywords specifically to your target country’s hiring norms.',
    },
    {
        q: 'What does "Highly Humanized ATS" mean? Why not just use ChatGPT?',
        a: 'Most people use ChatGPT to rewrite their resumes, and hiring managers can spot it in 5 seconds. Robotic phrases like "spearheaded dynamic synergies" sound fake, lack real context, and get rejected in human review. Our humanized approach balances both worlds: 100% machine-readable ATS keywords so you pass automated filters, plus an authentic, compelling human voice that makes recruiters excited to interview you.',
    },
    {
        q: 'Do you require credit card details or LinkedIn passwords?',
        a: 'Never! No payment info, no credit cards, and no LinkedIn passwords are ever asked. We deliver a complete, copy-paste ready LinkedIn blueprint and downloadable CV files directly to you.',
    },
    {
        q: 'Why is Sheriyakam offering this completely free to the world?',
        a: 'Inspired by India’s Jio revolution that brought internet access to millions for free, Sheriyakam is building a global community of skilled tradespeople, engineers, and professionals. We believe career empowerment should never be gated behind expensive agency fees.',
    },
];

export default function CvLinkedinOptimizeScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    // PRIMARY TWO OPTIONS: 'optimize' (Existing CV) vs 'create' (Create Brand New CV)
    const [cvOption, setCvOption] = useState('optimize'); // 'optimize' | 'create'

    // Common Global Region & Industry State
    const [selectedRegion, setSelectedRegion] = useState('gcc_middle_east');
    const [selectedIndustry, setSelectedIndustry] = useState('automatic');

    // Option 1: Optimize Existing CV State
    const [uploadedFile, setUploadedFile] = useState(null);
    const [auditInput, setAuditInput] = useState('');
    const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditResult, setAuditResult] = useState(null);

    // Option 2: Create Brand New CV State
    const [newCvRole, setNewCvRole] = useState('');
    const [newCvExpLevel, setNewCvExpLevel] = useState('mid');
    const [newCvSkills, setNewCvSkills] = useState('');
    const [newCvEducation, setNewCvEducation] = useState('');
    const [newCvProjects, setNewCvProjects] = useState('');
    const [isGeneratingNewCv, setIsGeneratingNewCv] = useState(false);
    const [generatedNewCv, setGeneratedNewCv] = useState(null);

    // Free Claim Modal State
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userLinkedin, setUserLinkedin] = useState('');
    const [userNotes, setUserNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Comparison View State
    const [comparisonTab, setComparisonTab] = useState('humanized'); // 'ai_slop' | 'humanized'

    // FAQ Accordion State
    const [expandedFaq, setExpandedFaq] = useState(0);

    // File Picker Handler using expo-document-picker
    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                    'text/plain',
                ],
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setUploadedFile({
                    name: asset.name,
                    size: asset.size ? (asset.size / 1024).toFixed(1) + ' KB' : 'Unknown size',
                    mimeType: asset.mimeType,
                    uri: asset.uri,
                });
                success(`CV "${asset.name}" attached successfully! Tap "Analyze & Humanize My CV" below.`, 'File Uploaded');
            }
        } catch (err) {
            console.error('Document picker error:', err);
            showError('Unable to access file. You can also paste your resume text directly.');
        }
    };

    // Handler for Option 1: Analyze Existing CV
    const handleRunAudit = () => {
        if (!uploadedFile && !auditInput.trim()) {
            showError('Please upload your existing CV or paste your resume text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            const fileName = uploadedFile ? uploadedFile.name : 'Your Pasted Resume';
            setAuditResult({
                fileName,
                atsScore: 68,
                humanizedScore: 54,
                potentialScore: 98,
                regionLabel: GLOBAL_REGIONS.find(r => r.id === selectedRegion)?.label || 'Worldwide',
                criticalIssues: [
                    'Lacks quantified human achievements (e.g. "% efficiency gained, $ saved, team hours saved")',
                    'Phrasing sounds either generic or like robotic AI-generated text without personal voice',
                    `Formatting needs optimization for ${GLOBAL_REGIONS.find(r => r.id === selectedRegion)?.label.split('(')[0].trim()} recruiter search algorithms`,
                    'LinkedIn headline is missing recruiter boolean search triggers and unique value statement',
                ],
            });
            success('Analysis complete! Review your ATS & Humanization scores below.');
        }, 1200);
    };

    // Handler for Option 2: Generate Brand New CV from Scratch
    const handleGenerateNewCv = () => {
        if (!newCvRole.trim()) {
            showError('Please enter your target role (e.g. Master Electrician, React Dev, MEP Engineer)');
            return;
        }

        setIsGeneratingNewCv(true);
        setTimeout(() => {
            setIsGeneratingNewCv(false);
            const role = newCvRole.trim();
            const expLevelObj = EXPERIENCE_LEVELS.find(e => e.id === newCvExpLevel);
            const expLabel = expLevelObj ? expLevelObj.label.split('(')[1]?.replace(')', '') || '3-6 yrs' : 'Experienced';
            const regionObj = GLOBAL_REGIONS.find(r => r.id === selectedRegion);
            const regionName = regionObj ? regionObj.label.split('(')[0].trim() : 'International';

            const parsedSkills = newCvSkills.trim()
                ? newCvSkills.split(',').map(s => s.trim())
                : ['Technical Troubleshooting', 'Preventive Maintenance', 'Safety & Regulatory Compliance', 'Blueprint Reading', 'Resource Planning'];

            setGeneratedNewCv({
                role,
                headline: `${role} | ${expLabel} Expertise | ${regionName} Certified`,
                summary: `Results-driven and safety-first ${role} with ${expLabel} of hands-on technical proficiency in fast-paced commercial and residential environments. Known for diagnosing stubborn system anomalies, commanding field crews with zero safety violations, and delivering projects ahead of deadlines with measurable cost efficiency.`,
                skills: parsedSkills,
                experienceBullets: [
                    `Spearheaded on-site execution for ${role.toLowerCase()} operations across demanding project phases, maintaining a 99.4% on-time milestone delivery rate.`,
                    `Diagnosed recurring operational failures and re-engineered system workflows, slashing downtime by 36% and saving clients significant maintenance expenditure.`,
                    `Enforced zero-compromise safety protocols across 20,000+ work hours, achieving zero reportable lost-time incidents.`,
                    `Collaborated with cross-functional project leads and client engineers to optimize material usage and eliminate waste by 18%.`
                ],
                education: newCvEducation.trim() || 'Technical Diploma / Vocational Certification / Degree',
                region: regionName,
            });
            success('Brand New Humanized ATS CV Generated! Scroll down to inspect your preview.');
        }, 1200);
    };

    const handleCopyGeneratedCv = () => {
        if (!generatedNewCv) return;
        const textToCopy = `HEADLINE:\n${generatedNewCv.headline}\n\nSUMMARY:\n${generatedNewCv.summary}\n\nKEY SKILLS:\n${generatedNewCv.skills.join(' • ')}\n\nCORE ACCOMPLISHMENTS:\n${generatedNewCv.experienceBullets.map(b => '• ' + b).join('\n')}\n\nEDUCATION & LICENSES:\n${generatedNewCv.education}`;
        if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy);
            success('CV Text copied to clipboard!');
        } else {
            success('CV ready for free download & WhatsApp delivery!');
        }
    };

    const handleOpenClaim = () => {
        setIsClaimModalOpen(true);
    };

    const handleSubmitFreeClaim = () => {
        if (!userName.trim() || !userPhone.trim()) {
            showError('Please enter your full name and phone/WhatsApp number.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsClaimModalOpen(false);
            const actionType = cvOption === 'create' ? 'Brand New CV Creation' : 'Existing CV Optimization';
            success(
                `Thank you ${userName}! Your free request for ${actionType} has been received. Our specialist will message you on WhatsApp (${selectedCountryCode} ${userPhone}) within 24-48 hours.`,
                'Free Request Submitted'
            );

            const fileNotice = cvOption === 'optimize' && uploadedFile ? `Attached File: ${uploadedFile.name}` : (cvOption === 'create' ? `Target Role: ${newCvRole || 'New CV'}` : 'Pasted Text attached');
            const message = `Hello Sheriyakam Global Career Team!\nI requested 100% Free ${actionType}.\nName: ${userName}\nRole: ${userRole || newCvRole || 'Professional'}\nContact: ${selectedCountryCode} ${userPhone}\nRegion: ${selectedRegion}\n${fileNotice}`;
            const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
            Linking.openURL(url).catch(() => {});

            setUserName('');
            setUserPhone('');
            setUserEmail('');
            setUserRole('');
            setUserLinkedin('');
            setUserNotes('');
        }, 1000);
    };

    const handleOpenWhatsAppDirect = () => {
        const url = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hello Sheriyakam Global Career Team, I would like to get my CV and LinkedIn optimized for FREE.');
        Linking.openURL(url).catch(() => {
            success('Opening WhatsApp support (+91 98765 43210)...');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Top Navigation Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Go Back"
                >
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.headerTitleWrap}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                            CV & LinkedIn Optimize
                        </Text>
                        <View style={styles.headerFreePill}>
                            <Text style={styles.headerFreePillText}>100% FREE</Text>
                        </View>
                    </View>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Worldwide Access • ATS-Proof & Highly Humanized
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleOpenWhatsAppDirect}
                    style={[styles.whatsappQuickBtn, { backgroundColor: '#10B98120' }]}
                    accessibilityRole="button"
                    accessibilityLabel="Chat on WhatsApp"
                >
                    <MessageCircle size={18} color="#10B981" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? '#121216' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={styles.badgeRow}>
                        <View style={styles.freeHighlightBadge}>
                            <Flame size={13} color="#FFFFFF" />
                            <Text style={styles.freeHighlightBadgeText}>100% FREE FOREVER (₹0 / $0)</Text>
                        </View>
                        <Badge variant="info" size="sm" icon={Globe}>50+ Countries</Badge>
                        <Badge variant="gold" size="sm" icon={HeartHandshake}>Zero AI Slop</Badge>
                    </View>

                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Optimize Existing CV or Create a Brand New CV From Scratch
                    </Text>

                    <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
                        Whether you already have a resume to polish or are starting from zero, Sheriyakam provides <Text style={{ fontWeight: '800', color: '#10B981' }}>100% Free</Text> certified ATS-proof, highly humanized CV and LinkedIn optimization for job seekers worldwide.
                    </Text>

                    {/* Global Movement Banner */}
                    <View style={[styles.globalBanner, { backgroundColor: isDark ? '#181822' : '#F0F9FF', borderColor: '#38BDF840' }]}>
                        <Globe size={22} color="#0284C7" style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.globalBannerTitle, { color: colors.textPrimary }]}>
                                Global Jio-Style Movement for Job Seekers
                            </Text>
                            <Text style={[styles.globalBannerText, { color: colors.textSecondary }]}>
                                Just as Jio democratized internet data in India, Sheriyakam is making professional career tools free for everyone globally. Zero credit cards, zero paywalls.
                            </Text>
                        </View>
                    </View>

                    {/* Hero CTA Row: Direct choice between Option 1 & Option 2 */}
                    <View style={styles.heroCtaRow}>
                        <Button
                            variant="primary"
                            size="md"
                            iconLeft={Sparkles}
                            onPress={() => {
                                setCvOption('optimize');
                                handlePickDocument();
                            }}
                            style={{ flex: 1, backgroundColor: '#10B981' }}
                        >
                            Optimize Existing CV
                        </Button>

                        <Button
                            variant="secondary"
                            size="md"
                            iconLeft={CirclePlus}
                            onPress={() => {
                                setCvOption('create');
                                success('Create New CV mode active! Fill in your target role below.');
                            }}
                            style={{ flex: 1 }}
                        >
                            Create Brand New CV
                        </Button>
                    </View>

                    {/* Metrics Strip */}
                    <View style={[styles.statsStrip, { borderTopColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: '#10B981' }]}>$0 / ₹0</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>100% Free</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.accent }]}>98%</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>ATS Pass Rate</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>100%</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Humanized Voice</Text>
                        </View>
                    </View>
                </View>

                {/* THE 2 OPTIONS SELECTOR CARDS */}
                <View style={styles.optionsSegmentContainer}>
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            cvOption === 'optimize' && {
                                borderColor: '#10B981',
                                backgroundColor: isDark ? '#064E3B15' : '#ECFDF5',
                                borderWidth: 2,
                            }
                        ]}
                        onPress={() => setCvOption('optimize')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.optionIconCircle, { backgroundColor: '#10B98120' }]}>
                            <Sparkles size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.optionCardTitle, { color: colors.textPrimary }]}>
                                    Option 1: Optimize Existing CV
                                </Text>
                                <View style={styles.optionMiniBadge}>
                                    <Text style={styles.optionMiniBadgeText}>POPULAR</Text>
                                </View>
                            </View>
                            <Text style={[styles.optionCardDesc, { color: colors.textSecondary }]}>
                                Upload your PDF/Word CV to fix ATS errors & humanize
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            cvOption === 'create' && {
                                borderColor: colors.accent,
                                backgroundColor: isDark ? '#1E1B2E' : '#EEF2FF',
                                borderWidth: 2,
                            }
                        ]}
                        onPress={() => setCvOption('create')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.optionIconCircle, { backgroundColor: colors.accent + '20' }]}>
                            <CirclePlus size={20} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.optionCardTitle, { color: colors.textPrimary }]}>
                                    Option 2: Create Brand New CV
                                </Text>
                                <View style={[styles.optionMiniBadge, { backgroundColor: '#F59E0B' }]}>
                                    <Text style={styles.optionMiniBadgeText}>NEW</Text>
                                </View>
                            </View>
                            <Text style={[styles.optionCardDesc, { color: colors.textSecondary }]}>
                                No CV? Build a complete ATS-proof CV from scratch
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* WORKFLOW 1: OPTIMIZE EXISTING CV */}
                {cvOption === 'optimize' && (
                    <Card variant="elevated" style={styles.toolCard}>
                        <View style={styles.toolHeaderRow}>
                            <Sparkles size={18} color="#10B981" />
                            <Text style={[styles.toolCardHeaderTitle, { color: colors.textPrimary }]}>
                                Option 1: Optimize & Humanize Existing CV
                            </Text>
                        </View>

                        {/* Target Region Selector */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
                            1. SELECT TARGET WORK REGION
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
                            {GLOBAL_REGIONS.map((reg) => (
                                <TouchableOpacity
                                    key={reg.id}
                                    style={[
                                        styles.pillBtn,
                                        {
                                            backgroundColor: selectedRegion === reg.id ? colors.accent : (isDark ? '#27272A' : '#F4F4F5'),
                                            borderColor: selectedRegion === reg.id ? colors.accent : (isDark ? '#3F3F46' : '#E4E4E7')
                                        }
                                    ]}
                                    onPress={() => setSelectedRegion(reg.id)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        { color: selectedRegion === reg.id ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {reg.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Target Industry Selector */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                            2. SELECT TARGET CAREER FIELD
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
                            {GLOBAL_INDUSTRIES.map((ind) => (
                                <TouchableOpacity
                                    key={ind.id}
                                    style={[
                                        styles.pillBtn,
                                        {
                                            backgroundColor: selectedIndustry === ind.id ? '#10B981' : (isDark ? '#27272A' : '#F4F4F5'),
                                            borderColor: selectedIndustry === ind.id ? '#10B981' : (isDark ? '#3F3F46' : '#E4E4E7')
                                        }
                                    ]}
                                    onPress={() => setSelectedIndustry(ind.id)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        { color: selectedIndustry === ind.id ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {ind.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {selectedIndustry === 'automatic' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 4 }}>
                                <Zap size={13} color="#10B981" />
                                <Text style={{ fontSize: 11.5, color: '#10B981', fontWeight: '600' }}>
                                    Automatic: Our engine will auto-detect your exact trade, role, and industry from your CV.
                                </Text>
                            </View>
                        )}

                        {/* Input Mode Toggle: Upload File vs Paste Text */}
                        <View style={styles.inputModeRow}>
                            <TouchableOpacity
                                style={[
                                    styles.inputModeBtn,
                                    inputMode === 'upload' && {
                                        backgroundColor: colors.accent + '20',
                                        borderColor: colors.accent,
                                    }
                                ]}
                                onPress={() => setInputMode('upload')}
                            >
                                <Upload size={14} color={inputMode === 'upload' ? colors.accent : colors.textTertiary} />
                                <Text style={[styles.inputModeText, { color: inputMode === 'upload' ? colors.accent : colors.textSecondary }]}>
                                    Upload File (.PDF / .DOCX)
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.inputModeBtn,
                                    inputMode === 'paste' && {
                                        backgroundColor: colors.accent + '20',
                                        borderColor: colors.accent,
                                    }
                                ]}
                                onPress={() => setInputMode('paste')}
                            >
                                <FileText size={14} color={inputMode === 'paste' ? colors.accent : colors.textTertiary} />
                                <Text style={[styles.inputModeText, { color: inputMode === 'paste' ? colors.accent : colors.textSecondary }]}>
                                    Or Paste Text / Bio
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* File Upload Box */}
                        {inputMode === 'upload' ? (
                            <View style={styles.uploadContainer}>
                                {uploadedFile ? (
                                    <View style={[styles.uploadedFileBox, { backgroundColor: isDark ? '#1C1917' : '#F0FDF4', borderColor: '#10B981' }]}>
                                        <FileCheck size={28} color="#10B981" />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.uploadedFileName, { color: colors.textPrimary }]} numberOfLines={1}>
                                                {uploadedFile.name}
                                            </Text>
                                            <Text style={[styles.uploadedFileSize, { color: colors.textSecondary }]}>
                                                Ready for ATS analysis • {uploadedFile.size}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setUploadedFile(null)}
                                            style={styles.removeFileBtn}
                                            accessibilityLabel="Remove file"
                                        >
                                            <X size={16} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.uploadDropzone, { borderColor: isDark ? '#3F3F46' : '#D1D5DB' }]}
                                        onPress={handlePickDocument}
                                        activeOpacity={0.75}
                                    >
                                        <View style={[styles.uploadIconCircle, { backgroundColor: colors.accent + '15' }]}>
                                            <Upload size={24} color={colors.accent} />
                                        </View>
                                        <Text style={[styles.uploadDropzoneTitle, { color: colors.textPrimary }]}>
                                            Tap to Upload Your Existing CV / Resume
                                        </Text>
                                        <Text style={[styles.uploadDropzoneSubtitle, { color: colors.textTertiary }]}>
                                            Supports PDF, Word (.docx, .doc), or Text files up to 10 MB
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <TextInput
                                style={[
                                    styles.auditTextInput,
                                    {
                                        backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                                        color: colors.textPrimary,
                                    }
                                ]}
                                multiline
                                numberOfLines={4}
                                placeholder="Paste your existing resume summary, past roles, or LinkedIn headline here..."
                                placeholderTextColor={colors.textTertiary}
                                value={auditInput}
                                onChangeText={setAuditInput}
                            />
                        )}

                        <Button
                            variant="primary"
                            size="md"
                            loading={isAnalyzing}
                            iconLeft={Sparkles}
                            onPress={handleRunAudit}
                            style={{ marginTop: 14 }}
                        >
                            {isAnalyzing ? 'Analyzing with Global ATS & Humanizer...' : 'Analyze & Humanize My Existing CV (Free)'}
                        </Button>

                        {/* Audit Results View */}
                        {auditResult ? (
                            <View style={[styles.auditResultBox, { backgroundColor: isDark ? '#18181B' : '#F0FDF4', borderColor: isDark ? '#27272A' : '#BBF7D0' }]}>
                                <View style={styles.scoreRow}>
                                    <View style={styles.scoreCircle}>
                                        <Text style={[styles.scoreValue, { color: '#EF4444' }]}>
                                            {auditResult.atsScore}%
                                        </Text>
                                        <Text style={[styles.scoreSubtext, { color: colors.textTertiary }]}>ATS Match</Text>
                                    </View>
                                    <View style={styles.scoreCircle}>
                                        <Text style={[styles.scoreValue, { color: '#F59E0B' }]}>
                                            {auditResult.humanizedScore}%
                                        </Text>
                                        <Text style={[styles.scoreSubtext, { color: colors.textTertiary }]}>Human Tone</Text>
                                    </View>
                                    <View style={styles.scoreDetails}>
                                        <Badge variant="warning" size="sm">Action Needed</Badge>
                                        <Text style={[styles.scoreTargetText, { color: colors.textPrimary }]}>
                                            Potential: <Text style={{ color: '#10B981', fontWeight: '800' }}>{auditResult.potentialScore}%</Text>
                                        </Text>
                                        <Text style={[styles.scoreSummaryDesc, { color: colors.textSecondary }]}>
                                            Target: {auditResult.regionLabel.split('(')[0]}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.suggestionsContainer}>
                                    <Text style={[styles.suggestionsTitle, { color: colors.textPrimary }]}>
                                        Identified Issues to Fix:
                                    </Text>
                                    {auditResult.criticalIssues.map((issue, i) => (
                                        <View key={i} style={styles.suggestionItem}>
                                            <AlertCircle size={15} color="#F59E0B" style={{ marginTop: 2, marginRight: 8 }} />
                                            <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>
                                                {issue}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    iconRight={ChevronRight}
                                    onPress={handleOpenClaim}
                                    style={{ marginTop: 14, backgroundColor: '#10B981' }}
                                >
                                    Get 100% Free Humanized Rewrite (₹0)
                                </Button>
                            </View>
                        ) : null}
                    </Card>
                )}

                {/* WORKFLOW 2: CREATE BRAND NEW CV FROM SCRATCH */}
                {cvOption === 'create' && (
                    <Card variant="elevated" style={styles.toolCard}>
                        <View style={styles.toolHeaderRow}>
                            <CirclePlus size={18} color={colors.accent} />
                            <Text style={[styles.toolCardHeaderTitle, { color: colors.textPrimary }]}>
                                Option 2: Create Brand New CV From Scratch
                            </Text>
                        </View>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, marginBottom: 14 }]}>
                            Answer a few quick details and our system will generate a complete ATS-proof, humanized CV for you.
                        </Text>

                        {/* Step 1: Target Region */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
                            1. TARGET WORK REGION
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
                            {GLOBAL_REGIONS.map((reg) => (
                                <TouchableOpacity
                                    key={reg.id}
                                    style={[
                                        styles.pillBtn,
                                        {
                                            backgroundColor: selectedRegion === reg.id ? colors.accent : (isDark ? '#27272A' : '#F4F4F5'),
                                            borderColor: selectedRegion === reg.id ? colors.accent : (isDark ? '#3F3F46' : '#E4E4E7')
                                        }
                                    ]}
                                    onPress={() => setSelectedRegion(reg.id)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        { color: selectedRegion === reg.id ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {reg.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Step 2: Target Role */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                            2. TARGET JOB TITLE / ROLE *
                        </Text>
                        <Input
                            placeholder="e.g. Master Electrician, React Native Developer, MEP Supervisor, Site Foreman"
                            value={newCvRole}
                            onChangeText={setNewCvRole}
                        />

                        {/* Step 3: Experience Level */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary, marginTop: 6 }]}>
                            3. EXPERIENCE LEVEL
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
                            {EXPERIENCE_LEVELS.map((lvl) => (
                                <TouchableOpacity
                                    key={lvl.id}
                                    style={[
                                        styles.pillBtn,
                                        {
                                            backgroundColor: newCvExpLevel === lvl.id ? '#10B981' : (isDark ? '#27272A' : '#F4F4F5'),
                                            borderColor: newCvExpLevel === lvl.id ? '#10B981' : (isDark ? '#3F3F46' : '#E4E4E7')
                                        }
                                    ]}
                                    onPress={() => setNewCvExpLevel(lvl.id)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        { color: newCvExpLevel === lvl.id ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {lvl.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Step 4: Key Skills / Daily Tasks */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary, marginTop: 14 }]}>
                            4. CORE SKILLS, TOOLS OR RESPONSIBILITIES
                        </Text>
                        <TextArea
                            placeholder="e.g. 3-phase wiring, DB dressing, inverter maintenance, troubleshooting, team coordination, OSHA safety standards..."
                            value={newCvSkills}
                            onChangeText={setNewCvSkills}
                            numberOfLines={3}
                        />

                        {/* Step 5: Education & Licenses */}
                        <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>
                            5. HIGHEST EDUCATION OR CERTIFICATIONS / LICENSES
                        </Text>
                        <Input
                            placeholder="e.g. KSEB Wireman License, ITI Electrical, Diploma, B.Tech, or High School"
                            value={newCvEducation}
                            onChangeText={setNewCvEducation}
                        />

                        <Button
                            variant="primary"
                            size="md"
                            loading={isGeneratingNewCv}
                            iconLeft={Zap}
                            onPress={handleGenerateNewCv}
                            style={{ marginTop: 12, backgroundColor: colors.accent }}
                        >
                            {isGeneratingNewCv ? 'Generating Brand New Humanized CV...' : 'Generate My New Humanized ATS CV (Free)'}
                        </Button>

                        {/* Generated New CV Live Preview Box */}
                        {generatedNewCv ? (
                            <View style={[styles.generatedCvCard, { backgroundColor: isDark ? '#1C1917' : '#F8FAFC', borderColor: colors.accent }]}>
                                <View style={styles.generatedCvHeader}>
                                    <Badge variant="gold" size="sm">LIVE CV PREVIEW</Badge>
                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        <TouchableOpacity
                                            style={[styles.miniActionBtn, { backgroundColor: isDark ? '#27272A' : '#E2E8F0' }]}
                                            onPress={handleCopyGeneratedCv}
                                        >
                                            <Copy size={13} color={colors.textPrimary} />
                                            <Text style={[styles.miniActionText, { color: colors.textPrimary }]}>Copy Text</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={[styles.cvPreviewHeadline, { color: colors.textPrimary }]}>
                                    {generatedNewCv.headline}
                                </Text>

                                <View style={styles.cvSectionDivider} />

                                <Text style={[styles.cvSectionTitle, { color: colors.accent }]}>
                                    PROFESSIONAL HUMANIZED SUMMARY
                                </Text>
                                <Text style={[styles.cvSectionBody, { color: colors.textSecondary }]}>
                                    {generatedNewCv.summary}
                                </Text>

                                <Text style={[styles.cvSectionTitle, { color: colors.accent, marginTop: 12 }]}>
                                    ATS KEYWORD & COMPETENCY MATRIX
                                </Text>
                                <View style={styles.cvSkillsWrap}>
                                    {generatedNewCv.skills.map((sk, idx) => (
                                        <View key={idx} style={[styles.cvSkillTag, { backgroundColor: colors.accent + '15' }]}>
                                            <Text style={[styles.cvSkillText, { color: colors.accent }]}>
                                                {sk}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                <Text style={[styles.cvSectionTitle, { color: colors.accent, marginTop: 12 }]}>
                                    QUANTIFIED CAR ACCOMPLISHMENTS
                                </Text>
                                {generatedNewCv.experienceBullets.map((bullet, idx) => (
                                    <View key={idx} style={styles.cvBulletRow}>
                                        <Text style={{ color: '#10B981', marginRight: 6, fontWeight: '700' }}>•</Text>
                                        <Text style={[styles.cvBulletText, { color: colors.textPrimary }]}>
                                            {bullet}
                                        </Text>
                                    </View>
                                ))}

                                <Text style={[styles.cvSectionTitle, { color: colors.accent, marginTop: 12 }]}>
                                    EDUCATION & CREDENTIALS
                                </Text>
                                <Text style={[styles.cvSectionBody, { color: colors.textSecondary }]}>
                                    {generatedNewCv.education} • {generatedNewCv.region}
                                </Text>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    iconLeft={Download}
                                    onPress={handleOpenClaim}
                                    style={{ marginTop: 16, backgroundColor: '#10B981' }}
                                >
                                    Claim Complete Word (.docx) & PDF Copy on WhatsApp (100% Free)
                                </Button>
                            </View>
                        ) : null}
                    </Card>
                )}

                {/* The "Why Humanized ATS" Pillar: Robot vs Humanized */}
                <View style={styles.sectionHeader}>
                    <View style={[styles.sectionHeaderIconWrap, { backgroundColor: '#F59E0B15' }]}>
                        <HeartHandshake size={18} color="#F59E0B" />
                    </View>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Why "Highly Humanized" Beats Generic AI Slop
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                            Recruiters hate robotic ChatGPT buzzwords. Here is our human secret.
                        </Text>
                    </View>
                </View>

                <Card variant="elevated" style={styles.humanizedPillarsCard}>
                    <View style={styles.pillarItem}>
                        <View style={[styles.pillarIconWrap, { backgroundColor: '#EF444415' }]}>
                            <Bot size={20} color="#EF4444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.pillarTitle, { color: '#EF4444' }]}>
                                ❌ The Robotic AI Slop Problem
                            </Text>
                            <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                ChatGPT produces phrases like "spearheaded dynamic synergy between cross-functional paradigms". It reads like a robot, has no personal voice, and recruiters throw it in the trash after 5 seconds.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.pillarDivider} />

                    <View style={styles.pillarItem}>
                        <View style={[styles.pillarIconWrap, { backgroundColor: '#10B98115' }]}>
                            <Smile size={20} color="#10B981" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.pillarTitle, { color: '#10B981' }]}>
                                ✨ The Sheriyakam Humanized Standard
                            </Text>
                            <Text style={[styles.pillarDesc, { color: colors.textSecondary }]}>
                                We combine flawless ATS parser syntax (single-column, standard headings, machine-readable) with <Text style={{ fontWeight: '700', color: colors.textPrimary }}>authentic human storytelling</Text>. We showcase your genuine problem-solving instinct, leadership personality, and real numbers that build emotional rapport with the interviewer.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Before vs After Humanized Showcase */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderIconWrap}>
                        <TrendingUp size={18} color="#10B981" />
                    </View>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Real Transformation: Robot AI vs. Humanized Masterpiece
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                            Compare how our humanized rewrite connects with recruiters
                        </Text>
                    </View>
                </View>

                <Card variant="elevated" style={styles.comparisonCard}>
                    <View style={styles.comparisonToggleWrap}>
                        <TouchableOpacity
                            style={[
                                styles.comparisonToggleBtn,
                                comparisonTab === 'ai_slop' && { backgroundColor: isDark ? '#27272A' : '#EF444415' }
                            ]}
                            onPress={() => setComparisonTab('ai_slop')}
                        >
                            <Text style={[
                                styles.comparisonToggleText,
                                { color: comparisonTab === 'ai_slop' ? '#EF4444' : colors.textTertiary, fontWeight: '700' }
                            ]}>
                                🤖 Generic AI / Weak Bullet
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.comparisonToggleBtn,
                                comparisonTab === 'humanized' && { backgroundColor: isDark ? '#27272A' : '#10B98115' }
                            ]}
                            onPress={() => setComparisonTab('humanized')}
                        >
                            <Text style={[
                                styles.comparisonToggleText,
                                { color: comparisonTab === 'humanized' ? '#10B981' : colors.textTertiary, fontWeight: '700' }
                            ]}>
                                🌟 Highly Humanized ATS Bullet
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {comparisonTab === 'ai_slop' ? (
                        <View style={[styles.comparisonContent, { borderColor: '#EF444440', backgroundColor: isDark ? '#1C1917' : '#FEF2F2' }]}>
                            <Text style={[styles.comparisonRoleTitle, { color: '#EF4444' }]}>
                                Robotic AI Buzzwords (Rejected in 1st Round)
                            </Text>
                            <Text style={[styles.comparisonSnippet, { color: colors.textSecondary }]}>
                                "Spearheaded revolutionary operational synergies to maximize stakeholder satisfaction and optimize cross-functional productivity while proactively overseeing electrical infrastructure."
                            </Text>
                            <View style={styles.comparisonVerdict}>
                                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>
                                    ⚠️ Flaw: Zero quantifiable proof. Sounds synthetic. Hiring managers cringe at this.
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.comparisonContent, { borderColor: '#10B98140', backgroundColor: isDark ? '#064E3B15' : '#ECFDF5' }]}>
                            <Text style={[styles.comparisonRoleTitle, { color: '#10B981' }]}>
                                Sheriyakam Humanized CAR Impact (Passes ATS & Lands Calls)
                            </Text>
                            <Text style={[styles.comparisonSnippet, { color: colors.textPrimary, fontWeight: '600' }]}>
                                "Diagnosed chronic three-phase harmonic distortion causing repeated transformer tripping across a 45,000 sq.ft IT facility; redesigned grounding & filtered capacitor banks, eliminating power dips and saving ₹4.2L ($5,000) in annual repair costs."
                            </Text>
                            <View style={styles.comparisonVerdict}>
                                <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '700' }}>
                                    ✅ Result: 100% ATS score. Specific numbers, real technical credibility, authentic human voice.
                                </Text>
                            </View>
                        </View>
                    )}
                </Card>

                {/* All Included Free Card */}
                <Card variant="elevated" style={[styles.freePassCard, { borderColor: '#10B981', backgroundColor: isDark ? '#064E3B10' : '#ECFDF550' }]}>
                    <View style={styles.freePassHeader}>
                        <View style={{ flex: 1 }}>
                            <Badge variant="success" size="sm">GLOBAL COMMUNITY ACCESS</Badge>
                            <Text style={[styles.freePassTitle, { color: colors.textPrimary }]}>
                                100% Free Worldwide Career Pass
                            </Text>
                            <Text style={[styles.freePassSubtitle, { color: colors.textSecondary }]}>
                                Choose to optimize your existing CV or create a brand new one from scratch for ₹0 / $0.
                            </Text>
                        </View>
                        <View style={styles.priceStrikeWrap}>
                            <Text style={styles.strikePrice}>$150 / ₹2,499</Text>
                            <Text style={styles.freePrice}>FREE (₹0)</Text>
                        </View>
                    </View>

                    <View style={styles.freeInclusionsList}>
                        {FREE_GLOBAL_FEATURES.map((item, idx) => (
                            <View key={idx} style={styles.freeInclusionItem}>
                                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2, marginRight: 8 }} />
                                <Text style={[styles.freeInclusionText, { color: colors.textPrimary }]}>
                                    {item}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        variant="primary"
                        size="lg"
                        iconLeft={Sparkles}
                        onPress={handleOpenClaim}
                        style={{ marginTop: 16, backgroundColor: '#10B981' }}
                    >
                        Claim Your 100% Free Optimization (₹0)
                    </Button>
                </Card>

                {/* 4-Step Global Process */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderIconWrap}>
                        <Clock size={18} color={colors.accent} />
                    </View>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            How It Works Worldwide
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                            From your upload or input to an interview-ready document in 24-48 hours
                        </Text>
                    </View>
                </View>

                <Card variant="elevated" style={styles.processCard}>
                    <View style={styles.stepItem}>
                        <View style={[styles.stepNumCircle, { backgroundColor: colors.accent }]}>
                            <Text style={styles.stepNumText}>1</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Select Option 1 (Upload) or Option 2 (Create New)</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Upload an existing resume to optimize, or build a new one from scratch by answering quick questions.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepItem}>
                        <View style={[styles.stepNumCircle, { backgroundColor: '#10B981' }]}>
                            <Text style={styles.stepNumText}>2</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>ATS Re-Engineering + Humanization</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                We clean out parsing glitches and re-author your bullets into metric-driven, conversational human achievements.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepItem}>
                        <View style={[styles.stepNumCircle, { backgroundColor: '#F59E0B' }]}>
                            <Text style={styles.stepNumText}>3</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Fast WhatsApp & Email Delivery</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Receive your ready-to-upload files in Word (.docx) & Vector PDF with free revision support.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepItem}>
                        <View style={[styles.stepNumCircle, { backgroundColor: '#8B5CF6' }]}>
                            <Text style={styles.stepNumText}>4</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Win Interviews Across Global Markets</Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Stand out to top MNCs, government contractors, and recruiters worldwide!
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* FAQ Accordion */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderIconWrap}>
                        <HelpCircle size={18} color={colors.accent} />
                    </View>
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Frequently Asked Questions
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                            Everything you need to know about our global free initiative
                        </Text>
                    </View>
                </View>

                <View style={styles.faqList}>
                    {FAQS.map((faq, index) => {
                        const isExpanded = expandedFaq === index;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.faqItem,
                                    {
                                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isDark ? '#27272A' : '#E4E4E7'
                                    }
                                ]}
                                activeOpacity={0.8}
                                onPress={() => setExpandedFaq(isExpanded ? null : index)}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                                        {faq.q}
                                    </Text>
                                    {isExpanded ? (
                                        <ChevronUp size={18} color={colors.accent} />
                                    ) : (
                                        <ChevronDown size={18} color={colors.textTertiary} />
                                    )}
                                </View>
                                {isExpanded ? (
                                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                                        {faq.a}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Final CTA Banner */}
                <View style={[styles.ctaBanner, { backgroundColor: isDark ? '#064E3B15' : '#ECFDF5', borderColor: '#10B98140' }]}>
                    <Gift size={32} color="#10B981" style={{ marginBottom: 8 }} />
                    <Text style={[styles.ctaTitle, { color: colors.textPrimary }]}>
                        Ready to Optimize or Create Your CV?
                    </Text>
                    <Text style={[styles.ctaSubtitle, { color: colors.textSecondary }]}>
                        100% Free Worldwide • Optimize Existing or Create Brand New from scratch.
                    </Text>

                    <View style={styles.ctaButtonRow}>
                        <Button
                            variant="primary"
                            size="md"
                            iconLeft={Sparkles}
                            onPress={handleOpenClaim}
                            style={{ flex: 1, backgroundColor: '#10B981' }}
                        >
                            Get Free CV Now
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            iconLeft={Phone}
                            onPress={handleOpenWhatsAppDirect}
                        >
                            WhatsApp Us
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {/* 100% Free Worldwide Claim Modal */}
            <Modal
                visible={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
                title={cvOption === 'create' ? 'Claim Brand New CV Creation' : 'Claim Existing CV Optimization'}
                subtitle="100% Free Worldwide • No Payment Needed"
            >
                <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.modalFreeBadge}>
                        <Gift size={14} color="#10B981" />
                        <Text style={styles.modalFreeBadgeText}>
                            {cvOption === 'create' ? 'Brand New CV Service — 100% FREE (₹0)' : 'Existing CV Optimization — 100% FREE (₹0)'}
                        </Text>
                    </View>

                    {/* Option-Specific Notice */}
                    {cvOption === 'optimize' ? (
                        <View style={styles.modalUploadSection}>
                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                                YOUR ATTACHED CV / RESUME
                            </Text>
                            {uploadedFile ? (
                                <View style={[styles.modalFileRow, { backgroundColor: isDark ? '#1F1F23' : '#F4F4F5' }]}>
                                    <FileCheck size={18} color="#10B981" />
                                    <Text style={[styles.modalFileName, { color: colors.textPrimary }]} numberOfLines={1}>
                                        {uploadedFile.name}
                                    </Text>
                                    <TouchableOpacity onPress={handlePickDocument}>
                                        <Text style={{ fontSize: 11, color: colors.accent, fontWeight: '700' }}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.modalUploadBtn, { borderColor: colors.accent }]}
                                    onPress={handlePickDocument}
                                >
                                    <Upload size={16} color={colors.accent} />
                                    <Text style={[styles.modalUploadBtnText, { color: colors.accent }]}>
                                        Attach Existing CV File (.PDF / .DOCX)
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                                TARGET ROLE FOR NEW CV
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>
                                {newCvRole || 'Target Role specified below'}
                            </Text>
                        </View>
                    )}

                    <Input
                        label="Full Name *"
                        placeholder="e.g. Sreejith Varma / John Doe"
                        value={userName}
                        onChangeText={setUserName}
                    />

                    {/* Country Code & Phone Row */}
                    <Text style={[styles.modalLabel, { color: colors.textSecondary, marginBottom: 6 }]}>
                        WhatsApp / Phone Number *
                    </Text>
                    <View style={styles.phoneInputRow}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryCodeScroll}>
                            {COUNTRY_CODES.map((c) => (
                                <TouchableOpacity
                                    key={c.code}
                                    style={[
                                        styles.countryCodeBtn,
                                        {
                                            backgroundColor: selectedCountryCode === c.code ? colors.accent : (isDark ? '#27272A' : '#E4E4E7')
                                        }
                                    ]}
                                    onPress={() => setSelectedCountryCode(c.code)}
                                >
                                    <Text style={[
                                        styles.countryCodeText,
                                        { color: selectedCountryCode === c.code ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {c.code} ({c.country})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <Input
                        placeholder="Phone number without country code"
                        keyboardType="phone-pad"
                        value={userPhone}
                        onChangeText={setUserPhone}
                    />

                    <Input
                        label="Email Address"
                        placeholder="e.g. yourname@example.com"
                        keyboardType="email-address"
                        value={userEmail}
                        onChangeText={setUserEmail}
                    />

                    <Input
                        label="Target Job Role / Field"
                        placeholder="e.g. Senior Electrical Supervisor, Software Engineer, Nurse"
                        value={userRole || newCvRole}
                        onChangeText={(t) => {
                            setUserRole(t);
                            if (cvOption === 'create') setNewCvRole(t);
                        }}
                    />

                    <Input
                        label="LinkedIn Profile URL (Optional)"
                        placeholder="https://linkedin.com/in/username"
                        value={userLinkedin}
                        onChangeText={setUserLinkedin}
                    />

                    <TextArea
                        label="Special Notes or Target Countries"
                        placeholder="Mention any target companies, specific Gulf or US visas, licenses, or key skills..."
                        value={userNotes}
                        onChangeText={setUserNotes}
                        numberOfLines={3}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        iconLeft={Send}
                        onPress={handleSubmitFreeClaim}
                        style={{ marginTop: 12, marginBottom: 12, backgroundColor: '#10B981' }}
                    >
                        {cvOption === 'create' ? 'Generate & Receive New CV on WhatsApp (₹0)' : 'Submit & Start Free Humanized Rewrite (₹0)'}
                    </Button>

                    <Text style={[styles.privacyNote, { color: colors.textTertiary }]}>
                        🔒 100% Free Worldwide. We respect your privacy and never sell your CV or contact info.
                    </Text>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    headerTitleWrap: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16.5,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    headerFreePill: {
        backgroundColor: '#10B981',
        paddingHorizontal: 6,
        paddingVertical: 1.5,
        borderRadius: 6,
    },
    headerFreePillText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
    },
    whatsappQuickBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 18,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    freeHighlightBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    freeHighlightBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
        lineHeight: 28,
        marginBottom: 8,
    },
    heroDescription: {
        fontSize: 13.5,
        lineHeight: 20,
        marginBottom: 14,
    },
    globalBanner: {
        flexDirection: 'row',
        gap: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    globalBannerTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 2,
    },
    globalBannerText: {
        fontSize: 11.5,
        lineHeight: 16,
    },
    heroCtaRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    statsStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 28,
    },
    optionsSegmentContainer: {
        gap: 10,
        marginBottom: 20,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(150, 150, 150, 0.2)',
        gap: 12,
    },
    optionIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionCardTitle: {
        fontSize: 14.5,
        fontWeight: '800',
    },
    optionMiniBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 6,
        paddingVertical: 1.5,
        borderRadius: 4,
    },
    optionMiniBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    optionCardDesc: {
        fontSize: 12,
        marginTop: 2,
    },
    toolCard: {
        padding: 16,
        marginBottom: 24,
    },
    toolHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    toolCardHeaderTitle: {
        fontSize: 15.5,
        fontWeight: '800',
    },
    toolLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    pillScroll: {
        gap: 8,
        paddingBottom: 4,
    },
    pillBtn: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputModeRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
        marginBottom: 12,
    },
    inputModeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'transparent',
        gap: 6,
    },
    inputModeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    uploadContainer: {
        marginBottom: 4,
    },
    uploadDropzone: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    uploadDropzoneTitle: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    uploadDropzoneSubtitle: {
        fontSize: 11.5,
        textAlign: 'center',
    },
    uploadedFileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        gap: 12,
    },
    uploadedFileName: {
        fontSize: 13.5,
        fontWeight: '700',
    },
    uploadedFileSize: {
        fontSize: 11,
        marginTop: 2,
    },
    removeFileBtn: {
        padding: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    auditTextInput: {
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 12,
        fontSize: 13,
        minHeight: 80,
        textAlignVertical: 'top',
        outlineStyle: 'none',
    },
    auditResultBox: {
        marginTop: 16,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    scoreCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreValue: {
        fontSize: 17,
        fontWeight: '900',
    },
    scoreSubtext: {
        fontSize: 8.5,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    scoreDetails: {
        flex: 1,
        gap: 2,
    },
    scoreTargetText: {
        fontSize: 12.5,
        fontWeight: '600',
    },
    scoreSummaryDesc: {
        fontSize: 11,
    },
    suggestionsContainer: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.08)',
        gap: 6,
    },
    suggestionsTitle: {
        fontSize: 12.5,
        fontWeight: '700',
        marginBottom: 2,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    suggestionText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
    },
    generatedCvCard: {
        marginTop: 16,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    generatedCvHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    miniActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    miniActionText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cvPreviewHeadline: {
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20,
    },
    cvSectionDivider: {
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.15)',
        marginVertical: 12,
    },
    cvSectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    cvSectionBody: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    cvSkillsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    cvSkillTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    cvSkillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cvBulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    cvBulletText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
    },
    humanizedPillarsCard: {
        padding: 16,
        marginBottom: 24,
    },
    pillarItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    pillarIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillarTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 4,
    },
    pillarDesc: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    pillarDivider: {
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.15)',
        marginVertical: 14,
    },
    comparisonCard: {
        padding: 14,
        marginBottom: 24,
    },
    comparisonToggleWrap: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    comparisonToggleBtn: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    comparisonToggleText: {
        fontSize: 11.5,
    },
    comparisonContent: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
    },
    comparisonRoleTitle: {
        fontSize: 13,
        fontWeight: '800',
    },
    comparisonSnippet: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    comparisonVerdict: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
    freePassCard: {
        padding: 18,
        borderRadius: 18,
        borderWidth: 2,
        marginBottom: 24,
    },
    freePassHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 10,
    },
    freePassTitle: {
        fontSize: 17,
        fontWeight: '900',
        marginTop: 6,
    },
    freePassSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    priceStrikeWrap: {
        alignItems: 'flex-end',
    },
    strikePrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#EF4444',
        fontWeight: '700',
    },
    freePrice: {
        fontSize: 20,
        fontWeight: '900',
        color: '#10B981',
        letterSpacing: -0.5,
    },
    freeInclusionsList: {
        gap: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(16, 185, 129, 0.2)',
    },
    freeInclusionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    freeInclusionText: {
        flex: 1,
        fontSize: 12.5,
        lineHeight: 18,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 12,
        gap: 10,
    },
    sectionHeaderIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    sectionSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    processCard: {
        padding: 16,
        gap: 16,
        marginBottom: 24,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    stepNumCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    stepDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
    faqList: {
        gap: 10,
        marginBottom: 24,
    },
    faqItem: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 13.5,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    faqAnswer: {
        fontSize: 12.5,
        lineHeight: 18,
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150, 150, 150, 0.1)',
    },
    ctaBanner: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 20,
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 4,
        textAlign: 'center',
    },
    ctaSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
    },
    ctaButtonRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    modalFreeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98118',
        padding: 10,
        borderRadius: 10,
        marginBottom: 14,
        gap: 6,
    },
    modalFreeBadgeText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '700',
    },
    modalUploadSection: {
        marginBottom: 14,
    },
    modalFileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        gap: 8,
    },
    modalFileName: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: '600',
    },
    modalUploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        gap: 6,
    },
    modalUploadBtnText: {
        fontSize: 12.5,
        fontWeight: '700',
    },
    phoneInputRow: {
        marginBottom: 8,
    },
    countryCodeScroll: {
        flexDirection: 'row',
        gap: 6,
    },
    countryCodeBtn: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 6,
    },
    countryCodeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    privacyNote: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 15,
    },
});
