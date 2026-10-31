// Simple in-memory store for partner data
// In a real app, this would be a database
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sha256 } from '../utils/security';

// Initial mock data
const supervisors = {
    'Kozhikode': { id: 'sup1', name: 'Suresh Kumar', phone: '9876543210', taluk: 'Kozhikode' },
    'Thamarassery': { id: 'sup2', name: 'Ramesh Babu', phone: '8765432109', taluk: 'Thamarassery' },
    'Vadakara': { id: 'sup3', name: 'Abdul Kader', phone: '7654321098', taluk: 'Vadakara' },
    'Thalassery': { id: 'sup4', name: 'Suresh Kumar', phone: '9876543210', taluk: 'Thalassery' },
    'default': { id: 'sup0', name: 'Main Supervisor', phone: '9999999999', taluk: 'General' }
};

export const TIERS_CONFIG = [
    {
        tier: 'Bronze',
        badge: '🥉 Bronze Partner',
        minRating: 4.5,
        minPunctuality: 85,
        minCompletion: 88,
        multiplier: '1.0x',
        multiplierVal: 1.0,
        perks: 'Standard Residential Service Calls • Weekly Settlement',
        commercialAccess: 'Standard Residential Only',
        unlockedLeads: ['Single Phase Domestic Wiring', 'Ceiling Fan & Switch Replacement'],
        lockedLeads: ['3-Phase Commercial DB', 'HT/LT Substation Panels', 'Hospital ICU Backup AMC'],
        color: '#CD7F32',
        bgColor: 'rgba(205, 127, 50, 0.15)'
    },
    {
        tier: 'Silver',
        badge: '🥈 Silver Pro',
        minRating: 4.7,
        minPunctuality: 90,
        minCompletion: 92,
        multiplier: '1.2x',
        multiplierVal: 1.2,
        perks: '1.2x Dispatch Priority • Split AC AMC Contracts Access',
        commercialAccess: 'Domestic + Small Retail Shops',
        unlockedLeads: ['Inverter & Battery Bank Installations', 'Split AC Deep Cleaning AMC', 'Retail Shop LED & DB Setup'],
        lockedLeads: ['Commercial 3-Phase HT/LT', 'Industrial Automation'],
        color: '#94A3B8',
        bgColor: 'rgba(148, 163, 184, 0.15)'
    },
    {
        tier: 'Gold',
        badge: '🏆 Gold Partner',
        minRating: 4.85,
        minPunctuality: 95,
        minCompletion: 96,
        multiplier: '1.5x',
        multiplierVal: 1.5,
        perks: '1.5x Dispatch Priority • 3-Phase Commercial Leads • 0% Platform Fee on Night Emergencies',
        commercialAccess: 'Commercial Buildings & Showrooms',
        unlockedLeads: ['3-Phase Busbar & Capacitor Banks', 'Commercial Mall DB Rewiring', 'Hotel Kitchen Exhaust & Rewire'],
        lockedLeads: ['11kV HT Substation Inspections'],
        color: '#EAB308',
        bgColor: 'rgba(234, 179, 8, 0.15)'
    },
    {
        tier: 'Platinum',
        badge: '💎 Platinum Master',
        minRating: 4.95,
        minPunctuality: 98,
        minCompletion: 99,
        multiplier: '2.0x',
        multiplierVal: 2.0,
        perks: '2.0x Dispatch Priority • High-Value HT/LT Substation Access • Dedicated VIP Ops Manager',
        commercialAccess: 'Industrial Plants, Substations & Hospitals',
        unlockedLeads: ['11kV Substation Maintenance', 'Industrial HT/LT Switchgear', 'Hospital ICU Emergency Gen-set Sync'],
        lockedLeads: [],
        color: '#38BDF8',
        bgColor: 'rgba(56, 189, 248, 0.15)'
    }
];

export const ACTIVE_SURGES = [
    {
        id: 'surge-monsoon',
        title: 'Monsoon Hazard Surge',
        multiplier: 1.4,
        badgeText: '🌧️ 1.4x Monsoon Surge',
        districts: ['Kannur', 'Kozhikode', 'Wayanad', 'Malappuram'],
        reason: 'Water Ingress & Heavy Rain Ground Faults',
        active: true,
        hours: 'Active 24 Hours during Red/Orange Alert'
    },
    {
        id: 'surge-night',
        title: 'Late Night Emergency',
        multiplier: 1.5,
        badgeText: '🌙 1.5x Night Surge',
        districts: ['All 14 Kerala Districts'],
        reason: 'Urgent Short Circuit & Darkness Hazards',
        active: true,
        hours: '09:00 PM - 06:00 AM'
    },
    {
        id: 'surge-heatwave',
        title: 'Heatwave AC Peak',
        multiplier: 1.3,
        badgeText: '☀️ 1.3x AC Peak Surge',
        districts: ['Ernakulam', 'Palakkad', 'Thrissur'],
        reason: 'High Compressor Overheat Breakdown Demand',
        active: true,
        hours: '11:00 AM - 04:00 PM'
    }
];


export const CORE_ECONOMICS = {
    platformFeePercent: 15,
    partnerSharePercent: 85,
    platformFeeRate: 0.15,
    partnerShareRate: 0.85,
    minimumJobFloor: 499,
    baselinePlatformGross: 75, // 15% of ₹499 minimum floor
    dailySprint: {
        targetJobs: 10,
        targetBilling: 7500,
        bonusPercent: 5,
        minAcceptanceRate: 90,
        minRatingFloor: 4.5
    }
};

export const DEFAULT_PARTNER_MOCK = {
    id: 'p1',
    name: 'Shyam Prasad',
    phone: '9876543210',
    email: 'shyam.electrician@sheriyakam.com',
    status: 'approved',
    isAvailable: true,
    taluk: 'Thalassery',
    district: 'Kannur',
    latitude: 11.7480,
    longitude: 75.4894,
    experienceYears: 7,
    kselbLicense: 'KSELB/WB-4102/KL',
    insuranceCover: '₹5 Lakh Active Trade Cover (Policy #SH-KL-9921)',
    serviceTypes: ['Electrical', 'AC', 'Plumbing', 'CCTV', 'Emergency'],
    categoryCertifications: [
        { category: 'Electrical', verified: true, score: '98%' },
        { category: 'AC', verified: true, score: '92%' },
        { category: 'Plumbing', verified: true, score: '90%' },
        { category: 'CCTV', verified: true, score: '94%' },
        { category: 'Emergency', verified: true, score: '96%' }
    ],
    ratings: {
        overall: 4.92,
        totalReviews: 148,
        punctuality: 4.95,
        quality: 4.90,
        safety: 4.98,
        priorityTier: 'Tier 1 (Priority Dispatch • 1.5x Pings)'
    },
    totalJobsCompleted: 148,
    performanceScore: 96,
    onlineHoursToday: 4.5,
    todayEarnings: 1240,
    bankDetails: {
        accountHolder: 'Shyam Prasad',
        bankName: 'State Bank of India',
        branch: 'Thalassery Main',
        accountNumber: '•••• •••• 4821',
        ifsc: 'SBIN0070123',
        upiId: 'shyam.electrician@oksbi',
        payoutSchedule: 'Weekly every Tuesday'
    },
    suspensionLogs: [],
    trainingModules: [
        { id: 'm1', title: 'KSELB Safety Code & Live Wire Isolation', category: 'Safety', status: 'completed', score: '98%' },
        { id: 'm2', title: 'Inverter, UPS & Battery Bank Wiring', category: 'Electrical', status: 'completed', score: '95%' },
        { id: 'm3', title: 'Inverter AC Gas Leak & Copper Flare Jointing', category: 'AC', status: 'completed', score: '92%' },
        { id: 'm4', title: 'IP CCTV & Hikvision/Dahua NVR Setup', category: 'CCTV', status: 'completed', score: '94%' },
        { id: 'm5', title: 'Smart Switch Automation (Matter / Zigbee)', category: 'Smart Home', status: 'in_progress', progress: 60 },
        { id: 'm6', title: 'Commercial 3-Phase HT/LT Distribution Boards', category: 'Industrial', status: 'locked' }
    ],
    schedule: [
        { id: 'sch-1', date: 'Tomorrow', time: '10:00 AM - 12:00 PM', service: 'AC Annual Maintenance (AMC)', customer: 'Dr. Vivek Menon', address: 'Sea View Ward, Thalassery', payout: 750, status: 'confirmed' },
        { id: 'sch-2', date: 'Thursday', time: '02:00 PM - 04:00 PM', service: 'Full House Earth Resistance Audit', customer: 'Kottayam House', address: 'Temple Gate, Thalassery', payout: 1200, status: 'confirmed' }
    ],
    weeklyIncentive: {
        targetJobs: 10,
        completedJobs: 7,
        rewardAmount: 500,
        expiresDays: 3,
        progressPercent: 70
    },
    surgeMultiplier: 1.25,
    loyaltyTier: {
        tier: 'Gold',
        score: 4.92,
        badge: '🏆 Gold Partner',
        perk: '1.5x Dispatch Priority • 0% Fee on Night Emergencies',
        nextTier: 'Platinum (At 200 jobs)'
    },
    referral: {
        code: 'SHYAM7821',
        invitedCount: 4,
        activeCount: 3,
        bonusEarned: 1500,
        bonusPerReferral: 500
    },
    documentExpiry: {
        kselbLicense: '15 Oct 2026',
        daysLeft: 25,
        alertStatus: 'warning',
        renewalUrl: 'https://kselb.kerala.gov.in'
    },
        dailySprint: {
        targetJobs: 10,
        completedJobsToday: 3,
        targetBilling: 7500,
        currentBillingToday: 2450,
        bonusPercent: 5,
        minJobFloor: 499,
        platformFeeRate: 0.15,
        partnerShareRate: 0.85,
        acceptanceRate: 94,
        minAcceptanceRate: 90,
        ratingFloor: 4.5,
        currentRating: 4.92,
        unlocked: false,
        estimatedBonusAmount: 375
    },
    punctualityRate: 97,
    completionRate: 98,
    availableCreditLimit: 2000,
    usedCredit: 0,
    microAdvances: [
        {
            id: 'adv-1',
            amount: 1500,
            reason: 'Emergency MCB & 4 sq mm Finolex wire roll purchase at Malabar Electricals',
            requestedAt: '24 Sep 2026, 04:15 PM',
            status: 'settled',
            deductedFromPayout: 'TX-2026-SEP-W4'
        }
    ],
    apprentices: [
        {
            id: 'app-1',
            name: 'Arjun K. Vijayan',
            phone: '94472 88102',
            role: 'Assistant Wireman',
            aadhaarLast4: '8812',
            kselbTraineeId: 'KSELB/TR-9021',
            status: 'active',
            joinedDate: '15 Aug 2026',
            jobsAssisted: 34
        },
        {
            id: 'app-2',
            name: 'Rahul C. M.',
            phone: '98463 11209',
            role: 'AC & Refrigeration Helper',
            aadhaarLast4: '4190',
            kselbTraineeId: 'KSELB/TR-9450',
            status: 'active',
            joinedDate: '01 Sep 2026',
            jobsAssisted: 18
        }
    ],
    blockedSlots: [
        { id: 'blk-1', date: 'Sunday, 27 Sep', timeSlot: '02:00 PM - 06:00 PM', reason: 'Family Function' },
        { id: 'blk-2', date: 'Friday, 02 Oct', timeSlot: '12:00 PM - 03:00 PM', reason: 'Friday Prayer & Rest' }
    ]
};

// Initial Mock Partners Directory across Kerala
let partners = [
    DEFAULT_PARTNER_MOCK,
    {
        id: 'p2',
        name: 'Abdul Kader',
        phone: '7654321098',
        email: 'abdul.kader@sheriyakam.com',
        status: 'approved',
        isAvailable: true,
        taluk: 'Vadakara',
        district: 'Kozhikode',
        latitude: 11.6080,
        longitude: 75.5910,
        experienceYears: 10,
        kselbLicense: 'KSELB/WB-4102/KL',
        insuranceCover: '₹5 Lakh Active Trade Cover',
        serviceTypes: ['Electrical', 'Emergency'],
        categoryCertifications: [
            { category: 'Electrical', verified: true, score: '95%' },
            { category: 'Emergency', verified: true, score: '98%' }
        ],
        ratings: { overall: 4.88, totalReviews: 210 },
        totalJobsCompleted: 210,
        suspensionLogs: []
    },
    {
        id: 'p3',
        name: 'Ramesh Babu',
        phone: '8765432109',
        email: 'ramesh.babu@sheriyakam.com',
        status: 'approved',
        isAvailable: false,
        taluk: 'Thamarassery',
        district: 'Kozhikode',
        latitude: 11.4170,
        longitude: 75.9340,
        experienceYears: 5,
        kselbLicense: 'KSELB/CA-9912/KL',
        insuranceCover: '₹5 Lakh Active Trade Cover',
        serviceTypes: ['Electrical', 'AC', 'CCTV'],
        categoryCertifications: [
            { category: 'Electrical', verified: true, score: '91%' },
            { category: 'AC', verified: true, score: '88%' }
        ],
        ratings: { overall: 4.75, totalReviews: 86 },
        totalJobsCompleted: 86,
        suspensionLogs: []
    },
    {
        id: 'p4',
        name: 'K. Sreeraj',
        phone: '9447199881',
        email: 'sreeraj.wireman@gmail.com',
        status: 'pending', // Pending KSELB review queue
        isAvailable: false,
        taluk: 'Kochi',
        district: 'Ernakulam',
        latitude: 9.9816,
        longitude: 76.2999,
        experienceYears: 4,
        kselbLicense: 'KSELB/AP-8821/KL',
        licenseDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
        policeClearanceStatus: 'Verified (Thrikkakara Station)',
        insuranceCover: 'Pending Platform Enrolment',
        serviceTypes: ['Electrical', 'AC'],
        categoryCertifications: [
            { category: 'Electrical', verified: false, score: 'Pending Practical Exam' }
        ],
        ratings: { overall: 0, totalReviews: 0 },
        totalJobsCompleted: 0,
        suspensionLogs: []
    },
    {
        id: 'p5',
        name: 'Vinod Nair',
        phone: '9846012349',
        email: 'vinod.nair.kl@gmail.com',
        status: 'suspended', // Suspended account for audit
        isAvailable: false,
        taluk: 'Thrissur',
        district: 'Thrissur',
        latitude: 10.5276,
        longitude: 76.2144,
        experienceYears: 8,
        kselbLicense: 'KSELB/WB-2311/KL',
        insuranceCover: 'Suspended',
        serviceTypes: ['Electrical'],
        categoryCertifications: [
            { category: 'Electrical', verified: true, score: '89%' }
        ],
        ratings: { overall: 4.35, totalReviews: 64 },
        totalJobsCompleted: 64,
        suspensionLogs: [
            {
                suspendedAt: '15 Sep 2026',
                suspendedBy: 'Admin Ops',
                reason: 'Repeated off-platform billing dispute without KSELB compliance documentation.'
            }
        ]
    }
];

export const getSupervisorForPartner = (partner) => {
    if (!partner || !partner.taluk) return supervisors['default'];
    return supervisors[partner.taluk] || supervisors['default'];
};

let currentPartner = DEFAULT_PARTNER_MOCK;

export const getPartners = () => partners;

const PARTNER_SESSION_SECRET = process.env.EXPO_PUBLIC_PARTNER_SESSION_SECRET || "sheriyakam_partner_session_security_key_2026_!!";

export const loginPartner = async (partner) => {
    const sessionData = {
        ...DEFAULT_PARTNER_MOCK,
        ...partner,
        createdAt: Date.now()
    };
    
    const rawStr = JSON.stringify({
        id: sessionData.id,
        phone: sessionData.phone,
        createdAt: sessionData.createdAt
    });
    sessionData.signature = sha256(rawStr + PARTNER_SESSION_SECRET);

    currentPartner = sessionData;
    try {
        await AsyncStorage.setItem('partner_session', JSON.stringify(sessionData));
    } catch (e) {
        console.error('Failed to save partner session', e);
    }
};

export const logoutPartner = async () => {
    currentPartner = null;
    try {
        await AsyncStorage.removeItem('partner_session');
    } catch (e) {
        console.error('Failed to remove partner session', e);
    }
};

export const initializePartnerSession = async () => {
    try {
        const session = await AsyncStorage.getItem('partner_session');
        if (session) {
            const parsed = JSON.parse(session);
            const ageMs = Date.now() - (parsed.createdAt || 0);
            if (ageMs > 24 * 60 * 60 * 1000) {
                await AsyncStorage.removeItem('partner_session');
                currentPartner = null;
                return null;
            }

            const rawStr = JSON.stringify({
                id: parsed.id,
                phone: parsed.phone,
                createdAt: parsed.createdAt
            });
            const expectedSig = sha256(rawStr + PARTNER_SESSION_SECRET);
            if (parsed.signature !== expectedSig) {
                await AsyncStorage.removeItem('partner_session');
                currentPartner = null;
                return null;
            }

            currentPartner = parsed;
            return currentPartner;
        }
    } catch (e) {
        console.error('Failed to load partner session', e);
    }
    return null;
};

export const getCurrentPartner = () => currentPartner;

export const togglePartnerAvailability = () => {
    if (currentPartner) {
        currentPartner.isAvailable = !currentPartner.isAvailable;
        return currentPartner.isAvailable;
    }
    return false;
};

export const addPartner = (partner) => {
    const newPartner = {
        ...partner,
        id: `p${partners.length + 1}`,
        status: 'pending',
        suspensionLogs: [],
        totalJobsCompleted: 0,
        ratings: { overall: 5.0, totalReviews: 0 }
    };
    partners.push(newPartner);
    return newPartner;
};

export const findPartner = (phone, password) => {
    return partners.find(p => p.phone === phone && p.password === password);
};

export const findPartnerByPhone = (phone) => {
    return partners.find(p => p.phone === phone);
};

// Admin function to approve application
export const approvePartner = (id) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'approved';
        return true;
    }
    return false;
};

// Admin function to reject application
export const rejectPartner = (id) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'rejected';
        return true;
    }
    return false;
};

// Admin function to suspend partner
export const suspendPartner = (id, reason = 'Administrative review', adminName = 'Ops Lead') => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'suspended';
        partner.isAvailable = false;
        if (!partner.suspensionLogs) partner.suspensionLogs = [];
        partner.suspensionLogs.unshift({
            suspendedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            suspendedBy: adminName,
            reason
        });
        return { success: true, partner };
    }
    return { success: false, message: 'Partner not found' };
};

// Admin function to reactivate partner
export const reactivatePartner = (id, adminName = 'Ops Lead') => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'approved';
        if (!partner.suspensionLogs) partner.suspensionLogs = [];
        partner.suspensionLogs.unshift({
            suspendedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            suspendedBy: adminName,
            reason: 'Account reinstated following review clearance.'
        });
        return { success: true, partner };
    }
    return { success: false, message: 'Partner not found' };
};

export const getPartnerSuspensionLogs = (id) => {
    const partner = partners.find(p => p.id === id);
    return partner?.suspensionLogs || [];
};

// Slot Blocking Helpers
export const getBlockedSlots = () => {
    return currentPartner?.blockedSlots || DEFAULT_PARTNER_MOCK.blockedSlots || [];
};

export const addBlockedSlot = (slot) => {
    const newSlot = {
        id: `blk-${Date.now()}`,
        date: slot.date || 'Tomorrow',
        timeSlot: slot.timeSlot || '02:00 PM - 06:00 PM',
        reason: slot.reason || 'Personal Time-Off'
    };
    if (!currentPartner.blockedSlots) currentPartner.blockedSlots = [];
    currentPartner.blockedSlots.push(newSlot);
    return newSlot;
};

export const removeBlockedSlot = (id) => {
    if (currentPartner?.blockedSlots) {
        currentPartner.blockedSlots = currentPartner.blockedSlots.filter(s => s.id !== id);
        return true;
    }
    return false;
};

// Kerala Weekly Leaderboard Dataset
export const KERALA_WEEKLY_LEADERBOARD = [
    { rank: 1, name: 'Shyam Prasad', taluk: 'Thalassery', district: 'Kannur', jobsCompleted: 28, rating: 4.98, bonusEarned: 1800, badge: '🥇 Top Performer' },
    { rank: 2, name: 'Abdul Kader', taluk: 'Vadakara', district: 'Kozhikode', jobsCompleted: 26, rating: 4.94, bonusEarned: 1500, badge: '🥈 Silver Ace' },
    { rank: 3, name: 'Sanoop K.', taluk: 'Kannur', district: 'Kannur', jobsCompleted: 24, rating: 4.92, bonusEarned: 1200, badge: '🥉 Bronze Pro' },
    { rank: 4, name: 'Rajesh Kumar', taluk: 'Kozhikode', district: 'Kozhikode', jobsCompleted: 22, rating: 4.89, bonusEarned: 1000 },
    { rank: 5, name: 'Kiran Varma', taluk: 'Aluva', district: 'Ernakulam', jobsCompleted: 21, rating: 4.88, bonusEarned: 900 },
    { rank: 6, name: 'Praveen T.', taluk: 'Kochi', district: 'Ernakulam', jobsCompleted: 19, rating: 4.87, bonusEarned: 800 },
    { rank: 7, name: 'Arun Balan', taluk: 'Thrissur', district: 'Thrissur', jobsCompleted: 18, rating: 4.85, bonusEarned: 700 },
    { rank: 8, name: 'Manoj Pillai', taluk: 'Kottayam', district: 'Kottayam', jobsCompleted: 17, rating: 4.84, bonusEarned: 600 },
    { rank: 9, name: 'Deepak Nair', taluk: 'Palakkad', district: 'Palakkad', jobsCompleted: 16, rating: 4.82, bonusEarned: 500 },
    { rank: 10, name: 'Faisal K.', taluk: 'Trivandrum', district: 'Thiruvananthapuram', jobsCompleted: 15, rating: 4.81, bonusEarned: 500 }
];

export const getKeralaLeaderboard = () => KERALA_WEEKLY_LEADERBOARD;

// ─── Instant Cash-Out & Micro-Advance Ledger ────────────────────────────────
export const getMicroAdvances = () => {
    return currentPartner?.microAdvances || DEFAULT_PARTNER_MOCK.microAdvances || [];
};

export const requestMicroAdvance = (amount, reason, notes = '') => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return { success: false, message: 'Invalid advance amount' };
    const limit = currentPartner?.availableCreditLimit ?? 2000;
    const used = currentPartner?.usedCredit ?? 0;
    const available = limit - used;

    if (num > available) {
        return {
            success: false,
            message: `Requested ₹${num} exceeds available credit balance of ₹${available}. Complete verified jobs to unlock more.`
        };
    }

    const newAdvance = {
        id: `adv-${Date.now()}`,
        amount: num,
        reason: reason || 'Emergency spare parts purchase',
        notes,
        requestedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
        autoSettledAt: 'Next Batch Tuesday',
        deductedFromPayout: 'Upcoming Settlement'
    };

    if (!currentPartner.microAdvances) currentPartner.microAdvances = [];
    currentPartner.microAdvances.unshift(newAdvance);
    currentPartner.usedCredit = used + num;

    return {
        success: true,
        advance: newAdvance,
        remainingCredit: available - num
    };
};

// ─── Team & Apprentice Onboarding Engine ─────────────────────────────────────
export const getApprentices = () => {
    return currentPartner?.apprentices || DEFAULT_PARTNER_MOCK.apprentices || [];
};

export const addApprentice = (data) => {
    if (!data.name || !data.phone) {
        return { success: false, message: 'Apprentice name and mobile number required.' };
    }
    const newApp = {
        id: `app-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        role: data.role || 'Assistant Wireman',
        aadhaarLast4: data.aadhaarLast4 || 'XXXX',
        kselbTraineeId: data.kselbTraineeId || 'KSELB/TR-PENDING',
        status: 'active',
        joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        jobsAssisted: 0
    };

    if (!currentPartner.apprentices) currentPartner.apprentices = [];
    currentPartner.apprentices.unshift(newApp);

    return { success: true, apprentice: newApp };
};

export const removeApprentice = (id) => {
    if (currentPartner?.apprentices) {
        currentPartner.apprentices = currentPartner.apprentices.filter(a => a.id !== id);
        return true;
    }
    return false;
};

export const toggleApprenticeStatus = (id) => {
    if (currentPartner?.apprentices) {
        const item = currentPartner.apprentices.find(a => a.id === id);
        if (item) {
            item.status = item.status === 'active' ? 'inactive' : 'active';
            return { success: true, status: item.status };
        }
    }
    return { success: false };
};


// ─── Value-Weighted Daily 10-Job Bonus Sprint Helper ───────────────────────
export const getDailySprintStatus = (partner = currentPartner || DEFAULT_PARTNER_MOCK) => {
    const sprint = partner.dailySprint || DEFAULT_PARTNER_MOCK.dailySprint;
    const completed = sprint.completedJobsToday || 0;
    const billing = sprint.currentBillingToday || 0;
    const jobsProgress = Math.min(100, Math.round((completed / sprint.targetJobs) * 100));
    const billingProgress = Math.min(100, Math.round((billing / sprint.targetBilling) * 100));
    const overallProgress = Math.max(jobsProgress, billingProgress);

    const meetsAcceptance = (sprint.acceptanceRate || 94) >= sprint.minAcceptanceRate;
    const meetsRating = (partner.ratings?.overall || 4.92) >= sprint.ratingFloor;
    const meetsFloor = (billing / (completed || 1)) >= sprint.minJobFloor;

    const isQualified = (completed >= sprint.targetJobs || billing >= sprint.targetBilling) && meetsAcceptance && meetsRating;
    const bonusEarned = isQualified ? Math.round(billing * 0.05) : 0;

    return {
        ...sprint,
        jobsProgress,
        billingProgress,
        overallProgress,
        meetsAcceptance,
        meetsRating,
        meetsFloor,
        isQualified,
        bonusEarned,
        jobsRemaining: Math.max(0, sprint.targetJobs - completed),
        billingRemaining: Math.max(0, sprint.targetBilling - billing),
        projectedBonus: Math.round(Math.max(billing, sprint.targetBilling) * 0.05)
    };
};
