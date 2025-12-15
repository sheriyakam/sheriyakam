import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initial Mock Data (Used if storage is empty)
const INITIAL_BOOKINGS = [
    {
        id: 'b1',
        customerName: 'Alice Smith',
        customerPhone: '+91 98765 43210',
        partnerName: null,
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrician',
        date: 'Today',
        time: '2:00 PM',
        status: 'open',
        price: 500,
        address: 'Calicut Beach Road, Kozhikode',
        distance: '1.2 km',
        otp: '4582',
        paymentStatus: 'pending',
        finalPrice: 500
    },
    {
        id: 'b2',
        customerName: 'Mohammed Fasil',
        customerPhone: '+91 90876 54321',
        partnerName: null,
        service: 'AC Service Expert',
        serviceType: 'AC',
        date: 'Tomorrow',
        time: '10:00 AM',
        status: 'open',
        price: 1200,
        address: 'Mavoor Road, Kozhikode',
        distance: '3.5 km',
        otp: '1290',
        paymentStatus: 'pending',
        finalPrice: 1200
    },
    {
        id: 'b3',
        customerName: 'Sneha Gupta',
        customerPhone: '+91 87654 32109',
        partnerName: 'John Electrician',
        service: 'Wiring Check',
        serviceType: 'Electrician',
        date: 'Yesterday',
        time: '4:30 PM',
        status: 'completed',
        price: 800,
        address: 'Mananchira, Kozhikode',
        distance: '0.8 km',
        otp: '7777',
        paymentStatus: 'pending',
        finalPrice: 800
    }
];

let bookings = [...INITIAL_BOOKINGS];

// Persistence Helpers
const STORAGE_KEY = 'sheriyakam_bookings_v1';

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
    return bookings.filter(b => b.status === 'accepted' || b.status === 'completed');
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

export const completeBookingByPartner = (id, enteredOtp, hoursWorked = 1) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        if (booking.otp === enteredOtp) {
            booking.status = 'completed';

            // Pricing Logic: Base price covers 1 hour. Extra hours = 100rs/hr
            const extraHours = Math.max(0, hoursWorked - 1);
            booking.finalPrice = booking.price + (extraHours * 100);
            booking.hoursWorked = hoursWorked;
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
    const booking = {
        ...newBooking,
        id,
        status: 'open',
        paymentStatus: 'pending',
        finalPrice: newBooking.price || 0,
        // Add minimal mocks if missing
        customerPhone: newBooking.customerPhone || '+91 00000 00000',
        distance: '2.0 km',
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
