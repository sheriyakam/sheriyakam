/**
 * Truth & Authenticity Service Configuration
 * Genuine operational pilot parameters for the Thalassery–Mahe Corridor.
 */

export const SUPPORT_PHONE = process.env.EXPO_PUBLIC_SUPPORT_PHONE || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91 94471 28901';
export const SUPPORT_PHONE_DISPLAY = '+91 94471 28901';
export const SUPPORT_WHATSAPP = process.env.EXPO_PUBLIC_SUPPORT_WHATSAPP || process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '919447128901';
export const SUPPORT_EMAIL = 'support@sheriyakam.in';

export const PILOT_ZONE = {
    corridor: 'Thalassery–Mahe Corridor',
    radiusKm: 12,
    hubAddress: 'Sheriyakam Workshop, Main Road, Near Old Bus Stand, Thalassery, Kannur, Kerala - 670101',
    activeTowns: [
        { id: 'thalassery', name: 'Thalassery', pincode: '670101', type: 'Municipality (HQ Hub)' },
        { id: 'mahe', name: 'Mahe', pincode: '673310', type: 'Town Centre' },
        { id: 'dharmadam', name: 'Dharmadam', pincode: '670106', type: 'Panchayat' },
        { id: 'kadirur', name: 'Kadirur', pincode: '670642', type: 'Panchayat' },
        { id: 'chokli', name: 'Chokli', pincode: '670672', type: 'Panchayat' },
        { id: 'new-mahe', name: 'New Mahe', pincode: '673311', type: 'Panchayat' },
        { id: 'azhiyur', name: 'Azhiyur', pincode: '673309', type: 'Panchayat' }
    ]
};
