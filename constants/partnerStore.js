// Simple in-memory store for partner data
// In a real app, this would be a database
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial mock data
const supervisors = {
    'Kozhikode': { id: 'sup1', name: 'Suresh Kumar', phone: '9876543210', taluk: 'Kozhikode' },
    'Thamarassery': { id: 'sup2', name: 'Ramesh Babu', phone: '8765432109', taluk: 'Thamarassery' },
    'Vadakara': { id: 'sup3', name: 'Abdul Kader', phone: '7654321098', taluk: 'Vadakara' },
    // Default fallback
    'default': { id: 'sup0', name: 'Main Supervisor', phone: '9999999999', taluk: 'General' }
};

let partners = [
    {
        id: 'p1',
        name: 'John Electrician',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
        status: 'approved', // approved, pending, rejected
        serviceTypes: ['Electrician'],
        location: { lat: 11.2588, lng: 75.7804 }, // Calicut
        taluk: 'Kozhikode',
        joinDate: '2023-01-01', // > 1 year ago
        performanceScore: 92 // Excellent
    },
    {
        id: 'p2',
        name: 'New Partner',
        email: 'new@example.com',
        phone: '0987654321',
        password: 'password123',
        status: 'pending',
        serviceTypes: ['AC'],
        location: { lat: 11.2500, lng: 75.7800 },
        taluk: 'Thamarassery',
        joinDate: '2024-05-20', // < 1 year
        performanceScore: 75 // Good
    }
];

export const getSupervisorForPartner = (partner) => {
    if (!partner || !partner.taluk) return supervisors['default'];
    return supervisors[partner.taluk] || supervisors['default'];
};

let currentPartner = null;

export const getPartners = () => partners;

export const loginPartner = async (partner) => {
    currentPartner = partner;
    try {
        await AsyncStorage.setItem('partner_session', JSON.stringify(partner));
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
            currentPartner = JSON.parse(session);
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
