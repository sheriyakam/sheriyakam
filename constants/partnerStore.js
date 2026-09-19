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
    kselbLicense: 'KSELB/CA-7821/KL',
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
