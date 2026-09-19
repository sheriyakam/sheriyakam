// Simple in-memory store for partner data
// In a real app, this would be a database
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sha256 } from '../utils/security';

// Initial mock data
const supervisors = {
    'Kozhikode': { id: 'sup1', name: 'Suresh Kumar', phone: '9876543210', taluk: 'Kozhikode' },
    'Thamarassery': { id: 'sup2', name: 'Ramesh Babu', phone: '8765432109', taluk: 'Thamarassery' },
    'Vadakara': { id: 'sup3', name: 'Abdul Kader', phone: '7654321098', taluk: 'Vadakara' },
    // Default fallback
    'default': { id: 'sup0', name: 'Main Supervisor', phone: '9999999999', taluk: 'General' }
};

let partners = [];

export const getSupervisorForPartner = (partner) => {
    if (!partner || !partner.taluk) return supervisors['default'];
    return supervisors[partner.taluk] || supervisors['default'];
};

export const DEFAULT_PARTNER_MOCK = {
    id: 'p1',
    name: 'Shyam Prasad',
    phone: '9876543210',
    email: 'shyam.electrician@sheriyakam.com',
    status: 'approved',
    isAvailable: false, // Default offline per Swiggy/Urban Company safety
    taluk: 'Thalassery',
    district: 'Kannur',
    experienceYears: 7,
    kselbLicense: 'KSELB/CA-7821/KL',
    insuranceCover: '₹5 Lakh Active Trade Cover (Policy #SH-KL-9921)',
    serviceTypes: ['Electrical', 'AC', 'Plumbing', 'CCTV', 'Emergency'],
    bankDetails: {
        accountHolder: 'Shyam Prasad',
        bankName: 'State Bank of India',
        branch: 'Thalassery Main',
        accountNumber: '•••• •••• 4821',
        ifsc: 'SBIN0070123',
        upiId: 'shyam.electrician@oksbi',
        payoutSchedule: 'Weekly every Tuesday'
    },
    ratings: {
        overall: 4.92,
        totalReviews: 148,
        punctuality: 4.95,
        quality: 4.90,
        safety: 4.98,
        priorityTier: 'Tier 1 (Priority Dispatch • 1.5x Pings)'
    },
    performanceScore: 96,
    onlineHoursToday: 4.5,
    todayEarnings: 1240,
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

let currentPartner = DEFAULT_PARTNER_MOCK;

export const getPartners = () => partners;

const PARTNER_SESSION_SECRET = process.env.EXPO_PUBLIC_PARTNER_SESSION_SECRET || "sheriyakam_partner_session_security_key_2026_!!";

export const loginPartner = async (partner) => {
    const sessionData = {
        ...DEFAULT_PARTNER_MOCK,
        ...partner,
        createdAt: Date.now()
    };
    
    // Create signature
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
            
            // 1. Session Expiry Check (24 hours)
            const ageMs = Date.now() - (parsed.createdAt || 0);
            if (ageMs > 24 * 60 * 60 * 1000) {
                console.log('[partnerStore] Session expired.');
                await AsyncStorage.removeItem('partner_session');
                currentPartner = null;
                return null;
            }

            // 2. Session Integrity Signature Check
            const rawStr = JSON.stringify({
                id: parsed.id,
                phone: parsed.phone,
                createdAt: parsed.createdAt
            });
            const expectedSig = sha256(rawStr + PARTNER_SESSION_SECRET);
            if (parsed.signature !== expectedSig) {
                console.warn('[Security Warning] Partner session tampered! Clearing session.');
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
        return currentPartner.isAvailable; // Return new status
    }
    return false;
};

export const addPartner = (partner) => {
    const newPartner = {
        ...partner,
        id: `p${partners.length + 1}`,
        status: 'pending', // Default status is pending
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

// Admin function to approve
export const approvePartner = (id) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'approved';
        return true;
    }
    return false;
};

// Admin function to reject
export const rejectPartner = (id) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'rejected';
        return true;
    }
    return false;
};
