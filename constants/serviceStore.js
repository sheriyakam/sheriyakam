/**
 * Dynamic Service Catalog Store
 * Allows managing prices, descriptions, and active/inactive status without frontend rebuilds.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@sheriyakam_services_v1';

const INITIAL_SERVICES = [
    {
        id: 'fan-repair',
        name: 'Ceiling & Exhaust Fan Repair',
        shortName: 'Fan Repair',
        category: 'Electrical',
        description: 'Complete inspection, capacitor fix, bearing noise repair, and regulator replacement.',
        price: 249,
        duration: '30-45 mins',
        problemsCovered: ['Fan humming', 'Slow speed', 'Burnt regulator', 'Bearing noise'],
        isActive: true,
        displayOrder: 1,
    },
    {
        id: 'switch-socket',
        name: 'Modular Switch & Socket Replacement',
        shortName: 'Switch & Socket',
        category: 'Electrical',
        description: 'Replace burned switch points, loose sockets, 16A heavy power points, and AC points.',
        price: 149,
        duration: '20-40 mins',
        problemsCovered: ['Sparking switch', 'Loose socket', 'Burned 16A point', 'AC switch replacement'],
        isActive: true,
        displayOrder: 2,
    },
    {
        id: 'mcb-tripping',
        name: 'MCB Distribution Box & Fuse Repair',
        shortName: 'MCB & DB Repair',
        category: 'Electrical',
        description: 'Diagnose tripping circuit breakers, short circuits, phase drops, and replace burnt MCBs.',
        price: 349,
        duration: '45-90 mins',
        problemsCovered: ['Main MCB tripping', 'Short circuit', 'Phase drop', 'Burning smell at DB'],
        isActive: true,
        displayOrder: 3,
    },
    {
        id: 'house-wiring',
        name: 'Complete Home Wiring & Safety Earthing',
        shortName: 'House Wiring',
        category: 'Electrical',
        description: 'Full house rewiring, electric shock prevention, ground earthing, and new point wiring.',
        price: 550,
        duration: '2-4 hours',
        problemsCovered: ['Electric shock from tap', 'Earth fault', 'Full house rewiring', 'New points'],
        isActive: true,
        displayOrder: 4,
    },
    {
        id: 'inverter-wiring',
        name: 'Inverter & Battery Wiring',
        shortName: 'Inverter Wiring',
        category: 'Electrical',
        description: 'Battery terminal connection, changeover switch setup, and backup load distribution.',
        price: 500,
        duration: '45-60 mins',
        problemsCovered: ['Inverter not charging', 'Changeover switch fault', 'Power backup failure'],
        isActive: true,
        displayOrder: 5,
    },
    {
        id: 'callback',
        name: 'Phone Callback & Expert Guidance',
        shortName: 'Phone Callback',
        category: 'Consultation',
        description: 'Direct phone callback with a licensed master wireman to evaluate electrical queries.',
        price: 0,
        duration: '15 mins',
        problemsCovered: ['General question', 'Quotation request', 'Project guidance'],
        isActive: true,
        displayOrder: 6,
    }
];

let services = [...INITIAL_SERVICES];

async function loadServices() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            services = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load services:', e);
    }
}

async function saveServices() {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (e) {
        console.warn('Failed to save services:', e);
    }
}

loadServices();

export function getServices(includeInactive = false) {
    if (includeInactive) return [...services];
    return services.filter(s => s.isActive);
}

export function getServiceById(id) {
    return services.find(s => s.id === id) || null;
}

export function saveService(serviceData) {
    const existingIndex = services.findIndex(s => s.id === serviceData.id);
    if (existingIndex >= 0) {
        services[existingIndex] = { ...services[existingIndex], ...serviceData, updatedAt: new Date().toISOString() };
    } else {
        const newService = {
            id: serviceData.id || `srv_${Date.now().toString(36)}`,
            name: serviceData.name || 'New Service',
            shortName: serviceData.shortName || serviceData.name || 'Service',
            category: serviceData.category || 'Electrical',
            description: serviceData.description || '',
            price: Number(serviceData.price) || 299,
            duration: serviceData.duration || '30-60 mins',
            problemsCovered: serviceData.problemsCovered || [],
            isActive: serviceData.isActive !== false,
            displayOrder: serviceData.displayOrder || services.length + 1,
            createdAt: new Date().toISOString(),
        };
        services.push(newService);
    }
    saveServices();
    return { success: true, services: getServices(true) };
}

export function updateServicePrice(id, newPrice) {
    const service = getServiceById(id);
    if (service) {
        service.price = Number(newPrice);
        saveServices();
        return { success: true, service };
    }
    return { success: false, message: 'Service not found' };
}

export function toggleServiceStatus(id) {
    const service = getServiceById(id);
    if (service) {
        service.isActive = !service.isActive;
        saveServices();
        return { success: true, service };
    }
    return { success: false, message: 'Service not found' };
}
