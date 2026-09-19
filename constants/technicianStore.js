/**
 * Technician Store & Roster
 * Allows managing electricians, phone contacts, skills, and availability.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@sheriyakam_technicians_v1';

const INITIAL_TECHNICIANS = [
    {
        id: 'tech_zanjan',
        name: 'Zanjan',
        phone: '+91 75940 56789',
        role: 'Owner & Lead Wireman',
        district: 'Kannur',
        taluk: 'Thalassery',
        skills: ['Wiring', 'MCB DB', 'Fan', 'Inverter', 'AC Connection'],
        isActive: true,
        isAvailable: true,
        rating: 4.98,
        completedJobs: 42,
    },
    {
        id: 'tech_shyam',
        name: 'Shyam Prasad',
        phone: '+91 98765 43210',
        role: 'Senior Wireman',
        district: 'Kannur',
        taluk: 'Thalassery',
        skills: ['Fan Repair', 'Switch & Socket', 'Earthing'],
        isActive: true,
        isAvailable: true,
        rating: 4.92,
        completedJobs: 28,
    },
    {
        id: 'tech_pratheesh',
        name: 'Pratheesh K.',
        phone: '+91 94471 99882',
        role: 'Emergency Specialist',
        district: 'Kozhikode',
        taluk: 'Vadakara',
        skills: ['Short Circuit', 'MCB Tripping', '3-Phase Maintenance'],
        isActive: true,
        isAvailable: true,
        rating: 4.88,
        completedJobs: 19,
    }
];

let technicians = [...INITIAL_TECHNICIANS];

async function loadTechnicians() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            technicians = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load technicians:', e);
    }
}

async function saveTechnicians() {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(technicians));
    } catch (e) {
        console.warn('Failed to save technicians:', e);
    }
}

loadTechnicians();

export function getTechnicians(activeOnly = true) {
    if (activeOnly) return technicians.filter(t => t.isActive);
    return [...technicians];
}

export function getTechnicianById(id) {
    return technicians.find(t => t.id === id) || null;
}

export function saveTechnician(techData) {
    const existingIndex = technicians.findIndex(t => t.id === techData.id);
    if (existingIndex >= 0) {
        technicians[existingIndex] = { ...technicians[existingIndex], ...techData };
    } else {
        const newTech = {
            id: techData.id || `tech_${Date.now().toString(36)}`,
            name: techData.name || 'Technician',
            phone: techData.phone || '+91 00000 00000',
            role: techData.role || 'Wireman',
            district: techData.district || 'Kannur',
            taluk: techData.taluk || 'Thalassery',
            skills: techData.skills || ['Electrical'],
            isActive: techData.isActive !== false,
            isAvailable: techData.isAvailable !== false,
            rating: 5.0,
            completedJobs: 0,
        };
        technicians.push(newTech);
    }
    saveTechnicians();
    return { success: true, technicians: getTechnicians(false) };
}
