import { EventEmitter } from 'events';

// Event emitter for real-time updates between screens
export const bookingEvents = new EventEmitter();

let bookings = [
    {
        id: 'b1',
        customerName: 'You', // For customer view
        partnerName: null,
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrician',
        date: 'Today',
        time: '2:00 PM',
        status: 'open', // open, accepted, completed, cancelled
        price: 500,
        address: 'Calicut Beach Road, Kozhikode',
        distance: '1.2 km',
        otp: '4582'
    },
    {
        id: 'b2',
        customerName: 'You',
        partnerName: null,
        service: 'AC Service Expert',
        serviceType: 'AC',
        date: 'Tomorrow',
        time: '10:00 AM',
        status: 'open',
        price: 1200,
        address: 'Mavoor Road, Kozhikode',
        distance: '3.5 km',
        otp: '1290'
    },
    {
        id: 'b3',
        customerName: 'You',
        partnerName: 'John Electrician',
        service: 'Wiring Check',
        serviceType: 'Electrician',
        date: 'Yesterday',
        time: '4:30 PM',
        status: 'Completed',
        price: 800,
        address: 'Mananchira, Kozhikode',
        distance: '0.8 km',
        otp: '7777'
    }
];

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
        return true;
    }
    return false;
};

export const completeBookingByPartner = (id, enteredOtp) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        if (booking.otp === enteredOtp) {
            booking.status = 'completed'; // Case sensitive check in UI?
            bookingEvents.emit('change');
            return { success: true };
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    }
    return { success: false, message: 'Booking not found' };
};

export const cancelBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'Cancelled';
        bookingEvents.emit('change');
    }
};
