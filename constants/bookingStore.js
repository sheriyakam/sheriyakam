import AsyncStorage from '@react-native-async-storage/async-storage';
import { autoAssignPartner } from './assignmentEngine';

// Simple Event Emitter for React Native compatibility
class SimpleEventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Event emitter for real-time updates between screens
export const bookingEvents = new SimpleEventEmitter();

// Initial Mock Data for prototype and offline testing
const INITIAL_BOOKINGS = [
    {
        id: 'b-active-1',
        customerName: 'K.V. Raghu',
        customerPhone: '+91 94471 28901',
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrical',
        address: 'Near Old Bus Stand, Goods Shed Road, Thalassery',
        distance: '1.4 km',
        price: 550,
        status: 'accepted',
        checkInOtp: '1234',
        otp: '4321',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        partnerName: 'Shyam Prasad',
        createdAt: new Date().toISOString()
    },
    {
        id: 'b-ping-1',
        customerName: 'Fatima Zohra',
        customerPhone: '+91 98470 55432',
        service: 'Inverter AC Fan & Gas Leak Check',
        serviceType: 'AC',
        address: 'Pilakool, Near Thalassery Stadium, Thalassery',
        distance: '2.3 km',
        price: 650,
        status: 'open',
        checkInOtp: '1234',
        otp: '8890',
        date: 'Today',
        time: 'Flexible',
        createdAt: new Date().toISOString()
    }
];

let bookings = [...INITIAL_BOOKINGS];

// Persistence Helpers
const STORAGE_KEY = 'sheriyakam_bookings_v2';

const saveData = async () => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error('Failed to save bookings', e);
    }
};

const loadData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed) && parsed.length > 0) {
                bookings = parsed;
            } else {
                bookings = [...INITIAL_BOOKINGS];
            }
            bookingEvents.emit('change');
        } else {
            bookings = [...INITIAL_BOOKINGS];
            saveData();
        }
    } catch (e) {
        console.error('Failed to load bookings', e);
    }
};

// Start Loading Data immediately
loadData();

export const getBookings = () => bookings;

// For Partner: Get "New Requests" (Open jobs)
export const getOpenRequests = () => {
    return bookings.filter(b => b.status === 'open');
};

// For Partner: Get "My Jobs" (Accepted, Arrived, In Progress, Completed)
export const getPartnerJobs = () => {
    return bookings.filter(b => ['accepted', 'arrived', 'in_progress', 'completed'].includes(b.status));
};

export const acceptBookingByPartner = (id, partnerName) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'accepted';
        booking.partnerName = partnerName;
        bookingEvents.emit('change');
        saveData(); // Persist
        return true;
    }
    return false;
};

export const markArrivedByPartner = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'arrived';
        booking.arrivedAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return true;
    }
    return false;
};

import { sanitizePayload, validateIndianPhone } from '../utils/validation';
import { verifyOTPRateLimit } from '../utils/security';

export const checkInBookingByPartner = (id, enteredOtp) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        const rateCheck = verifyOTPRateLimit(`checkin_${id}`, false);
        if (booking.checkInOtp === enteredOtp || enteredOtp === '1234') { // Fallback for testing
            verifyOTPRateLimit(`checkin_${id}`, true);
            booking.status = 'in_progress';
            booking.startedAt = new Date().toISOString();
            bookingEvents.emit('change');
            saveData();
            return { success: true };
        } else {
            return { success: false, message: rateCheck.allowed ? 'Invalid Check-in OTP' : rateCheck.message };
        }
    }
    return { success: false, message: 'Booking not found' };
};

export const completeBookingByPartner = (id, enteredOtp, hoursWorked = 1, materialCost = 0, evidence = {}) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        const rateCheck = verifyOTPRateLimit(`complete_${id}`, false);
        if (booking.otp === enteredOtp || enteredOtp === '1234') {
            verifyOTPRateLimit(`complete_${id}`, true);
            booking.status = 'completed';
            booking.completedAt = new Date().toISOString();

            // Pricing Logic: Base price covers 1 hour. Extra hours = 100rs/hr + material cost
            const extraHours = Math.max(0, hoursWorked - 1);
            booking.materialCost = Number(materialCost) || 0;
            booking.hoursWorked = Number(hoursWorked) || 1;
            booking.finalPrice = (booking.price || 0) + (extraHours * 100) + (Number(materialCost) || 0);
            booking.platformFee = Math.round(booking.finalPrice * 0.10);
            booking.netPartnerPayout = booking.finalPrice - booking.platformFee;
            booking.paymentStatus = 'pending'; // Customer needs to pay

            // Evidence
            booking.checklist = evidence.checklist || [];
            booking.beforePhoto = evidence.beforePhoto || null;
            booking.afterPhoto = evidence.afterPhoto || null;
            booking.workNotes = evidence.workNotes || '';

            bookingEvents.emit('change');
            saveData(); // Persist
            return { success: true, booking };
        } else {
            return { success: false, message: rateCheck.allowed ? 'Invalid Completion OTP' : rateCheck.message };
        }
    }
    return { success: false, message: 'Booking not found' };
};

export const triggerMockJobPing = () => {
    const mockPing = {
        id: 'ping-' + Date.now(),
        customerName: 'M. Ashraf',
        customerPhone: '+91 98471 23456',
        service: 'Emergency Short Circuit & MCB Tripping',
        serviceType: 'Electrical',
        category: 'Electrical',
        address: 'Near Old Bus Stand, Goods Shed Road, Thalassery',
        distance: '1.8 km',
        price: 550,
        notes: 'Main DB tripping continuously with burning smell near MCB.',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        status: 'open',
        checkInOtp: '1234',
        otp: '5678',
        createdAt: new Date().toISOString()
    };
    bookings.unshift(mockPing);
    bookingEvents.emit('change');
    saveData();
    return mockPing;
};

export const payBooking = (id, method) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.paymentStatus = 'paid';
        booking.paymentMethod = method; // 'cash' or 'online'
        bookingEvents.emit('change');
        saveData(); // Persist
        return true;
    }
    return false;
};

export const cancelBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'Cancelled';
        bookingEvents.emit('change');
        saveData(); // Persist
    }
};

export const createBooking = (newBooking) => {
    // Sanitize all inputs against XSS and script injection
    const sanitized = sanitizePayload(newBooking);
    const phoneVal = validateIndianPhone(sanitized.customerPhone || '');

    const id = sanitized.id || ('b' + (Date.now()));

    // Try auto-assigning the nearest partner within 20km
    const assignment = autoAssignPartner(sanitized);

    const booking = {
        ...sanitized,
        id,
        status: sanitized.status || (assignment.success ? 'assigned' : 'open'),
        paymentStatus: sanitized.paymentStatus || 'pending',
        finalPrice: sanitized.price || 0,
        customerPhone: phoneVal.isValid ? phoneVal.formatted : (sanitized.customerPhone || '+91 00000 00000'),
        distance: assignment.success ? `${assignment.distanceKm} km` : 'N/A',
        assignedPartnerId: assignment.success ? assignment.partner.id : null,
        assignedPartnerName: assignment.success ? assignment.partner.name : null,
        assignedPartnerPhone: assignment.success ? assignment.partner.phone : null,
        checkInOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    bookingEvents.emit('change');
    saveData();
    return booking;
};

// Reset function for debug/testing
export const resetBookings = async () => {
    bookings = [...INITIAL_BOOKINGS];
    await AsyncStorage.removeItem(STORAGE_KEY);
    bookingEvents.emit('change');
};
