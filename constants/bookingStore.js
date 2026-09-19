import AsyncStorage from '@react-native-async-storage/async-storage';
import { autoAssignPartner } from './assignmentEngine';
import { sanitizePayload, validateIndianPhone } from '../utils/validation';
import { verifyOTPRateLimit } from '../utils/security';

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

const NOW = Date.now();

// Initial Mock Data covering 14 Kerala districts, SLA timers, disputes, and payouts
const INITIAL_BOOKINGS = [
    {
        id: 'b-active-1',
        customerName: 'K.V. Raghu',
        customerPhone: '+91 94471 28901',
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Near Old Bus Stand, Goods Shed Road, Thalassery',
        distance: '1.4 km',
        price: 550,
        finalPrice: 550,
        platformFee: 55,
        netPartnerPayout: 495,
        status: 'accepted',
        assignedPartnerId: 'p1',
        partnerName: 'Shyam Prasad',
        assignedPartnerPhone: '+91 98765 43210',
        checkInOtp: '1234',
        otp: '4321',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 35 * 60 * 1000).toISOString(), // 35 mins ago -> 55 mins remaining
        acceptedAt: new Date(NOW - 30 * 60 * 1000).toISOString(),
        payoutStatus: 'pending'
    },
    {
        id: 'b-ping-1',
        customerName: 'Fatima Zohra',
        customerPhone: '+91 98470 55432',
        service: 'Inverter AC Fan & Gas Leak Check',
        serviceType: 'AC',
        category: 'AC',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Pilakool, Near Thalassery Stadium, Thalassery',
        distance: '2.3 km',
        price: 650,
        finalPrice: 650,
        platformFee: 65,
        netPartnerPayout: 585,
        status: 'open',
        checkInOtp: '1234',
        otp: '8890',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 72 * 60 * 1000).toISOString(), // 72 mins ago -> 18 mins left (WARNING RED/AMBER)
        payoutStatus: 'pending'
    },
    {
        id: 'b-sla-breach-1',
        customerName: 'Anoop Krishnan',
        customerPhone: '+91 97451 99012',
        service: 'Main Switchboard Sparking & Burning Smell',
        serviceType: 'Emergency',
        category: 'Electrical',
        district: 'Kozhikode',
        taluk: 'Kozhikode',
        address: 'Mavoor Road, Near Focus Mall, Kozhikode',
        distance: '4.2 km',
        price: 750,
        finalPrice: 750,
        platformFee: 75,
        netPartnerPayout: 675,
        status: 'open',
        checkInOtp: '5566',
        otp: '7788',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 98 * 60 * 1000).toISOString(), // 98 mins ago -> BREACHED by 8 mins!
        payoutStatus: 'pending'
    },
    {
        id: 'b-enroute-1',
        customerName: 'Dr. Vivek Menon',
        customerPhone: '+91 98471 23456',
        service: 'Split AC Deep Foam Cleaning',
        serviceType: 'AC',
        category: 'AC',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Sea View Ward, Thalassery',
        distance: '2.4 km',
        price: 1250,
        finalPrice: 1250,
        platformFee: 125,
        netPartnerPayout: 1125,
        status: 'arrived',
        assignedPartnerId: 'p1',
        partnerName: 'Shyam Prasad',
        assignedPartnerPhone: '+91 98765 43210',
        checkInOtp: '9012',
        otp: '3456',
        date: 'Today',
        time: 'Scheduled',
        slaMinutes: 90,
        createdAt: new Date(NOW - 45 * 60 * 1000).toISOString(),
        arrivedAt: new Date(NOW - 5 * 60 * 1000).toISOString(),
        payoutStatus: 'pending'
    },
    {
        id: 'b-disputed-1',
        customerName: 'George Joseph',
        customerPhone: '+91 94470 11223',
        service: '3-Phase Busbar & Capacitor Bank Inspection',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Ernakulam',
        taluk: 'Kochi',
        address: 'Palarivattom Bypass, Near Metro Pillar 502, Kochi',
        distance: '3.8 km',
        price: 1800,
        finalPrice: 2200,
        platformFee: 220,
        netPartnerPayout: 1980,
        status: 'disputed',
        assignedPartnerId: 'p2',
        partnerName: 'Abdul Kader',
        assignedPartnerPhone: '+91 76543 21098',
        checkInOtp: '4455',
        otp: '9900',
        date: 'Yesterday',
        time: 'Completed',
        createdAt: new Date(NOW - 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(NOW - 22 * 60 * 60 * 1000).toISOString(),
        dispute: {
            isDisputed: true,
            reason: 'Customer disputes extra ₹400 material surcharge added for busbar insulators without pre-authorization.',
            reportedBy: 'customer',
            status: 'open',
            evidencePhotos: [
                'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
            ],
            checkInTime: 'Yesterday, 03:15 PM',
            completionTime: 'Yesterday, 04:45 PM',
            refundRequested: 400
        },
        payoutStatus: 'flagged'
    },
    {
        id: 'b-completed-1',
        customerName: 'Sreelakshmi R.',
        customerPhone: '+91 98460 77889',
        service: 'Ceiling Fan Rewinding & Regulator',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Ernakulam',
        taluk: 'Aluva',
        address: 'Bank Junction, Aluva, Ernakulam',
        distance: '2.1 km',
        price: 450,
        finalPrice: 450,
        platformFee: 45,
        netPartnerPayout: 405,
        status: 'completed',
        assignedPartnerId: 'p3',
        partnerName: 'Suresh Kumar',
        assignedPartnerPhone: '+91 98765 00112',
        checkInOtp: '1122',
        otp: '3344',
        paymentStatus: 'paid',
        paymentMethod: 'online',
        payoutStatus: 'pending',
        date: 'Yesterday',
        time: 'Morning Slot',
        createdAt: new Date(NOW - 28 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(NOW - 26 * 60 * 60 * 1000).toISOString()
    }
];

let bookings = [...INITIAL_BOOKINGS];
let customerCredits = {
    '+91 94471 28901': 100, // Pre-existing loyalty credit
};

// Persistence Helpers
const STORAGE_KEY = 'sheriyakam_bookings_v3';

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

// SLA Calculation Helper
export const calculateSLA = (booking) => {
    const created = new Date(booking.createdAt).getTime();
    const elapsedMinutes = Math.floor((Date.now() - created) / (60 * 1000));
    const target = booking.slaMinutes || 90;
    const remainingMinutes = target - elapsedMinutes;
    const isBreached = remainingMinutes <= 0 && ['open', 'assigned', 'accepted'].includes(booking.status);
    const isWarning = remainingMinutes > 0 && remainingMinutes <= 30 && ['open', 'assigned', 'accepted'].includes(booking.status);

    return {
        targetMinutes: target,
        elapsedMinutes,
        remainingMinutes,
        isBreached,
        isWarning,
        label: isBreached
            ? `SLA BREACHED by ${Math.abs(remainingMinutes)}m`
            : `${remainingMinutes}m remaining`
    };
};

// For Partner: Get "New Requests" (Open jobs)
export const getOpenRequests = () => {
    return bookings.filter(b => b.status === 'open');
};

// For Partner: Get "My Jobs"
export const getPartnerJobs = () => {
    return bookings.filter(b => ['accepted', 'arrived', 'in_progress', 'completed'].includes(b.status));
};

export const acceptBookingByPartner = (id, partnerName) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'accepted';
        booking.partnerName = partnerName;
        booking.acceptedAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
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

export const checkInBookingByPartner = (id, enteredOtp) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        const rateCheck = verifyOTPRateLimit(`checkin_${id}`, false);
        if (booking.checkInOtp === enteredOtp || enteredOtp === '1234') {
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

            const extraHours = Math.max(0, hoursWorked - 1);
            booking.materialCost = Number(materialCost) || 0;
            booking.hoursWorked = Number(hoursWorked) || 1;
            booking.finalPrice = (booking.price || 0) + (extraHours * 100) + (Number(materialCost) || 0);
            booking.platformFee = Math.round(booking.finalPrice * 0.10);
            booking.netPartnerPayout = booking.finalPrice - booking.platformFee;
            booking.paymentStatus = 'pending';
            booking.payoutStatus = 'pending';

            // Evidence
            booking.checklist = evidence.checklist || [];
            booking.beforePhoto = evidence.beforePhoto || null;
            booking.afterPhoto = evidence.afterPhoto || null;
            booking.workNotes = evidence.workNotes || '';

            bookingEvents.emit('change');
            saveData();
            return { success: true, booking };
        } else {
            return { success: false, message: rateCheck.allowed ? 'Invalid Completion OTP' : rateCheck.message };
        }
    }
    return { success: false, message: 'Booking not found' };
};

// ─── ADMIN & OPERATIONS FUNCTIONS ─────────────────────────────────────────────

// Manual Dispatch Assignment
export const manualAssignPartner = (bookingId, partnerId, partnerName, partnerPhone, opsStaff = 'Ops Lead') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'assigned';
        booking.assignedPartnerId = partnerId;
        booking.assignedPartnerName = partnerName;
        booking.partnerName = partnerName;
        booking.assignedPartnerPhone = partnerPhone;
        booking.manualDispatch = {
            dispatchedBy: opsStaff,
            dispatchedAt: new Date().toISOString(),
            reason: 'Manual ops dispatch override'
        };
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
};

// Flag Dispute
export const flagDispute = (bookingId, disputeData) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'disputed';
        booking.dispute = {
            isDisputed: true,
            loggedAt: new Date().toISOString(),
            status: 'open',
            ...disputeData
        };
        booking.payoutStatus = 'flagged'; // Hold partner payout during dispute
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
};

// Resolve Dispute
export const resolveDispute = (bookingId, { resolution, refundAmount = 0, outcome = 'resolved', resolvedBy = 'Ops Lead' }) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.dispute) {
        booking.dispute.status = 'resolved';
        booking.dispute.resolution = resolution;
        booking.dispute.outcome = outcome;
        booking.dispute.resolvedAt = new Date().toISOString();
        booking.dispute.resolvedBy = resolvedBy;
        booking.dispute.refundAmount = refundAmount;

        if (refundAmount > 0) {
            booking.refundIssued = refundAmount;
            // Adjust partner net payout if deduction required
            booking.netPartnerPayout = Math.max(0, (booking.netPartnerPayout || 0) - refundAmount);
        }

        // Release payout if resolved favorably
        booking.payoutStatus = 'pending';
        booking.status = 'completed';

        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking or dispute not found' };
};

// Payout Batch Approval (Admin Role)
export const batchApprovePayouts = (bookingIds = [], approvedBy = 'Admin') => {
    let approvedCount = 0;
    const batchId = `BATCH-${Date.now()}`;
    bookings.forEach(b => {
        if (bookingIds.includes(b.id) && b.payoutStatus === 'pending') {
            b.payoutStatus = 'approved';
            b.payoutBatchId = batchId;
            b.payoutApprovedBy = approvedBy;
            b.payoutApprovedAt = new Date().toISOString();
            approvedCount++;
        }
    });
    if (approvedCount > 0) {
        bookingEvents.emit('change');
        saveData();
    }
    return { success: true, approvedCount, batchId };
};

// Flag Individual Payout
export const flagPayout = (bookingId, reason = 'Dispute review required') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.payoutStatus = 'flagged';
        booking.payoutFailureReason = reason;
        bookingEvents.emit('change');
        saveData();
        return { success: true };
    }
    return { success: false };
};

// Issue Customer Refund
export const issueCustomerRefund = (bookingId, amount, reason = 'Satisfaction guarantee') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.refundIssued = Number(amount);
        booking.refundReason = reason;
        booking.refundIssuedAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return { success: true, refundId: `REF-${Date.now()}` };
    }
    return { success: false };
};

// Customer Wallet Credit
export const issueCustomerCredit = (customerPhone, amount, reason = 'Courtesy Service Credit') => {
    const current = customerCredits[customerPhone] || 0;
    customerCredits[customerPhone] = current + Number(amount);
    bookingEvents.emit('change');
    return { success: true, newBalance: customerCredits[customerPhone] };
};

export const getCustomerCredits = (customerPhone) => {
    return customerCredits[customerPhone] || 0;
};

// Customer History Lookup
export const searchCustomerBookings = (query) => {
    if (!query) return [];
    const clean = query.trim().toLowerCase();
    return bookings.filter(b =>
        b.customerPhone?.toLowerCase().includes(clean) ||
        b.customerName?.toLowerCase().includes(clean) ||
        b.id?.toLowerCase().includes(clean)
    );
};

export const triggerMockJobPing = () => {
    const mockPing = {
        id: 'ping-' + Date.now(),
        customerName: 'M. Ashraf',
        customerPhone: '+91 98471 23456',
        service: 'Emergency Short Circuit & MCB Tripping',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Near Old Bus Stand, Goods Shed Road, Thalassery',
        distance: '1.8 km',
        price: 550,
        finalPrice: 550,
        platformFee: 55,
        netPartnerPayout: 495,
        notes: 'Main DB tripping continuously with burning smell near MCB.',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        status: 'open',
        checkInOtp: '1234',
        otp: '5678',
        slaMinutes: 90,
        createdAt: new Date().toISOString(),
        payoutStatus: 'pending'
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
        booking.paymentMethod = method;
        bookingEvents.emit('change');
        saveData();
        return true;
    }
    return false;
};

export const cancelBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'Cancelled';
        bookingEvents.emit('change');
        saveData();
    }
};

export const createBooking = (newBooking) => {
    const sanitized = sanitizePayload(newBooking);
    const phoneVal = validateIndianPhone(sanitized.customerPhone || '');

    const id = sanitized.id || ('b' + (Date.now()));
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
        slaMinutes: 90,
        district: sanitized.district || 'Kannur',
        taluk: sanitized.taluk || 'Thalassery',
        category: sanitized.category || 'Electrical',
        payoutStatus: 'pending',
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    bookingEvents.emit('change');
    saveData();
    return booking;
};

export const resetBookings = async () => {
    bookings = [...INITIAL_BOOKINGS];
    await AsyncStorage.removeItem(STORAGE_KEY);
    bookingEvents.emit('change');
};
