// Simple in-memory store for partner data
// In a real app, this would be a database

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
        joinDate: '2025-06-01', // < 1 year (Dec 2025 - June 2025 = 6 months)
        performanceScore: 75 // Good
    }
];

export const getSupervisorForPartner = (partner) => {
    if (!partner || !partner.taluk) return supervisors['default'];
    return supervisors[partner.taluk] || supervisors['default'];
};

let currentPartner = null;

export const getPartners = () => partners;

export const loginPartner = (partner) => {
    currentPartner = partner;
};

export const logoutPartner = () => {
    currentPartner = null;
};

export const getCurrentPartner = () => currentPartner;

export const togglePartnerAvailability = () => {
    if (currentPartner) {
        currentPartner.isAvailable = !currentPartner.isAvailable;
        return currentPartner.isAvailable; // Return new status
    }
    return false;
    return false;
};

export const toggleCommunityMute = () => {
    if (currentPartner) {
        currentPartner.isCommunityMuted = !currentPartner.isCommunityMuted;
        return currentPartner.isCommunityMuted;
    }
    return false;
};

export const getCommunityMuteStatus = () => {
    return currentPartner?.isCommunityMuted || false;
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
