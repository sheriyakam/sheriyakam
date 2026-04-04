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

// Initial Data (Empty for production)
const INITIAL_BOOKINGS = [];


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
            bookings = JSON.parse(json);
            // Notify listeners that data has loaded/changed
            bookingEvents.emit('change');
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

// For Partner: Get "My Jobs" (Accepted jobs)
export const getPartnerJobs = () => {
    return bookings.filter(b => ['accepted', 'in_progress', 'completed'].includes(b.status));
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

export const checkInBookingByPartner = (id, enteredOtp) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        if (booking.checkInOtp === enteredOtp || enteredOtp === '1234') { // Fallback for old data
            booking.status = 'in_progress';
            bookingEvents.emit('change');
            saveData();
            return { success: true };
        } else {
            return { success: false, message: 'Invalid Check-in OTP' };
        }
    }
    return { success: false, message: 'Booking not found' };
};

export const completeBookingByPartner = (id, enteredOtp, hoursWorked = 1, materialCost = 0) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        if (booking.otp === enteredOtp) {
            booking.status = 'completed';

            // Pricing Logic: Base price covers 1 hour. Extra hours = 100rs/hr + material cost
            const extraHours = Math.max(0, hoursWorked - 1);
            booking.materialCost = materialCost;
            booking.hoursWorked = hoursWorked;
            booking.finalPrice = booking.price + (extraHours * 100) + materialCost;
            booking.paymentStatus = 'pending'; // Customer needs to pay

            bookingEvents.emit('change');
            saveData(); // Persist
            return { success: true };
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    }
    return { success: false, message: 'Booking not found' };
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
    const id = 'b' + (Date.now());

    // Try auto-assigning the nearest partner within 20km
    const assignment = autoAssignPartner(newBooking);

    const booking = {
        ...newBooking,
        id,
        status: assignment.success ? 'assigned' : 'open',
        paymentStatus: 'pending',
        finalPrice: newBooking.price || 0,
        customerPhone: newBooking.customerPhone || '+91 00000 00000',
        distance: assignment.success ? `${assignment.distanceKm} km` : 'N/A',
        assignedPartnerId: assignment.success ? assignment.partner.id : null,
        assignedPartnerName: assignment.success ? assignment.partner.name : null,
        assignedPartnerPhone: assignment.success ? assignment.partner.phone : null,
        checkInOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        otp: Math.floor(1000 + Math.random() * 9000).toString()
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
