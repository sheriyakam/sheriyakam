/**
 * Customer Store & Registry
 * Tracks customer profiles by unique mobile number, booking history, and addresses.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@sheriyakam_customers_v1';

let customers = [
    {
        id: 'c_raghu',
        phone: '+91 94471 28901',
        name: 'K.V. Raghu',
        addresses: ['Near Old Bus Stand, Goods Shed Road, Thalassery'],
        totalBookings: 3,
        isRepeat: true,
        lastBookingAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        notes: 'House near Goods Shed road. Prefers morning appointments.'
    },
    {
        id: 'c_fatima',
        phone: '+91 98470 55432',
        name: 'Fatima Zohra',
        addresses: ['Pilakool, Near Thalassery Stadium, Thalassery'],
        totalBookings: 1,
        isRepeat: false,
        lastBookingAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        notes: 'Inverter AC inspection'
    }
];

// Load from AsyncStorage if available
async function loadCustomers() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            customers = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load customers from storage:', e);
    }
}

async function saveCustomers() {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
        console.warn('Failed to save customers to storage:', e);
    }
}

loadCustomers();

export function getCustomers() {
    return [...customers];
}

export function findCustomerByPhone(phone) {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    return customers.find(c => c.phone.replace(/\D/g, '').endsWith(clean.slice(-10))) || null;
}

export function recordCustomerBooking({ phone, name, address }) {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    let customer = customers.find(c => c.phone.replace(/\D/g, '').endsWith(clean.slice(-10)));

    if (customer) {
        customer.totalBookings += 1;
        customer.isRepeat = true;
        customer.lastBookingAt = new Date().toISOString();
        if (name && name !== 'Resident' && name !== 'Resident Customer') {
            customer.name = name;
        }
        if (address && !customer.addresses.includes(address)) {
            customer.addresses.push(address);
        }
    } else {
        customer = {
            id: 'c_' + Date.now().toString(36),
            phone: phone.startsWith('+91') ? phone : `+91 ${clean}`,
            name: name && name.trim() ? name.trim() : 'Resident Customer',
            addresses: address ? [address] : ['Thalassery'],
            totalBookings: 1,
            isRepeat: false,
            lastBookingAt: new Date().toISOString(),
            notes: ''
        };
        customers.unshift(customer);
    }

    saveCustomers();
    return customer;
}

export function updateCustomerNotes(phone, notes) {
    const customer = findCustomerByPhone(phone);
    if (customer) {
        customer.notes = notes;
        saveCustomers();
        return { success: true, customer };
    }
    return { success: false, message: 'Customer not found' };
}
