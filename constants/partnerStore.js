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

let currentPartner = null;

export const getPartners = () => partners;

const PARTNER_SESSION_SECRET = process.env.EXPO_PUBLIC_PARTNER_SESSION_SECRET || "sheriyakam_partner_session_security_key_2026_!!";

export const loginPartner = async (partner) => {
    const sessionData = {
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
