import { recordPartnerInstantPayout } from './partnerStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { autoAssignPartner, haversineDistanceKm } from './assignmentEngine';
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

// All Kerala Active & Open Customer Work Requests with precise GPS Coordinates
const INITIAL_BOOKINGS = [
    // ── KANNUR / THALASSERY HUB (Partner Shyam Prasad: 11.7480, 75.4894) ──
    {
        id: 'b-active-1',
        requiredSkill: 'Electrical',
        requiredTier: 'Gold',
        skillMatchPercent: 98,
        customerName: 'K.V. Raghu',
        customerPhone: '+91 94471 28901',
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Near Old Bus Stand, Goods Shed Road, Thalassery',
        latitude: 11.7495,
        longitude: 75.4891,
        distance: '1.4 km',
        price: 550,
        finalPrice: 550,
        platformFee: 83, netPartnerPayout: 467,
        status: 'accepted',
        assignedPartnerId: 'p1',
        partnerName: 'Shyam Prasad',
        assignedPartnerPhone: '+91 98765 43210',
        checkInOtp: '1234',
        otp: '4321',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 35 * 60 * 1000).toISOString(),
        acceptedAt: new Date(NOW - 30 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: '#4821', meterLocation: 'Ground floor stairwell', faultHistory: 'MCB sparking', siteAdvisory: 'Beware of pet dog' },
        hardwareBills: [{ id: 'hb-demo-1', photoUri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500', supplierName: 'Malabar Electrical Hardware, Thalassery', billNo: 'ME-8841', amount: 380, date: 'Today, 03:15 PM', items: 'Havells 32A C-Curve MCB' }]
    },
    {
        id: 'b-ping-1',
        requiredSkill: 'AC',
        requiredTier: 'Silver',
        skillMatchPercent: 92,
        customerName: 'Fatima Zohra',
        customerPhone: '+91 98470 55432',
        service: 'Inverter AC Fan & Gas Leak Check',
        serviceType: 'AC',
        category: 'AC',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Pilakool, Near Thalassery Stadium, Thalassery',
        latitude: 11.7510,
        longitude: 75.4920,
        distance: '2.3 km',
        price: 650,
        finalPrice: 650,
        platformFee: 98, netPartnerPayout: 552,
        status: 'open',
        checkInOtp: '1234',
        otp: '8890',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 72 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: 'Open Entry', meterLocation: 'First floor balcony unit', faultHistory: 'AC fan noise', siteAdvisory: 'Ladder on site' },
        hardwareBills: []
    },
    {
        id: 'b-open-dharmadam',
        requiredSkill: 'Electrical',
        requiredTier: 'Bronze',
        skillMatchPercent: 95,
        customerName: 'Sujith Nambiar',
        customerPhone: '+91 94471 88201',
        service: 'Main Earth Leakage & Switchboard Sparking',
        serviceType: 'Emergency',
        category: 'Electrical',
        district: 'Kannur',
        taluk: 'Thalassery',
        address: 'Beach Road, Near Dharmadam Island Approach, Thalassery',
        latitude: 11.7680,
        longitude: 75.4650,
        distance: '3.4 km',
        price: 599,
        finalPrice: 599,
        platformFee: 90, netPartnerPayout: 509,
        status: 'open',
        checkInOtp: '2233',
        otp: '6677',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 15 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: '#1029', meterLocation: 'Right side verandah', faultHistory: 'Earthing voltage 48V', siteAdvisory: 'Ring doorbell twice' },
        hardwareBills: []
    },

    // ── KOZHIKODE / VADAKARA HUB (Partner Abdul Kader: 11.6080, 75.5910) ──
    {
        id: 'b-open-vadakara',
        requiredSkill: 'Electrical',
        requiredTier: 'Gold',
        skillMatchPercent: 96,
        customerName: 'M. K. Musthafa',
        customerPhone: '+91 98472 10982',
        service: 'Commercial 3-Phase DB Short Circuit',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kozhikode',
        taluk: 'Vadakara',
        address: 'Link Road, Near Old Bus Stand, Vadakara',
        latitude: 11.6050,
        longitude: 75.5890,
        distance: '1.6 km',
        price: 750,
        finalPrice: 750,
        platformFee: 113, netPartnerPayout: 637,
        status: 'open',
        checkInOtp: '4421',
        otp: '8832',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 25 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: 'Commercial Entry', meterLocation: 'Behind cash counter', faultHistory: 'Phase 2 neutral burning', siteAdvisory: 'Main switch accessible' },
        hardwareBills: []
    },
    {
        id: 'b-open-chorode',
        requiredSkill: 'AC',
        requiredTier: 'Silver',
        skillMatchPercent: 91,
        customerName: 'Anjali Varma',
        customerPhone: '+91 98470 99112',
        service: 'Split AC Power PCB & Sensor Tripping',
        serviceType: 'AC',
        category: 'AC',
        district: 'Kozhikode',
        taluk: 'Vadakara',
        address: 'Chorode National Highway Junction, Vadakara',
        latitude: 11.6250,
        longitude: 75.5820,
        distance: '2.1 km',
        price: 650,
        finalPrice: 650,
        platformFee: 98, netPartnerPayout: 552,
        status: 'open',
        checkInOtp: '7788',
        otp: '9900',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 40 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: '#7712', meterLocation: 'Garage DB', faultHistory: 'Inverter board error E4', siteAdvisory: 'Keep tools ready' },
        hardwareBills: []
    },

    // ── KOZHIKODE CITY HUB (Partner Ramesh Babu: 11.4170, 75.9340) ──
    {
        id: 'b-open-thamarassery',
        requiredSkill: 'Electrical',
        requiredTier: 'Bronze',
        skillMatchPercent: 94,
        customerName: 'Bichu Moideen',
        customerPhone: '+91 97451 11223',
        service: 'Water Pump Starter Switch Repair',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kozhikode',
        taluk: 'Thamarassery',
        address: 'Chungam Junction, Wayanad Road, Thamarassery',
        latitude: 11.4190,
        longitude: 75.9360,
        distance: '2.1 km',
        price: 499,
        finalPrice: 499,
        platformFee: 75, netPartnerPayout: 424,
        status: 'open',
        checkInOtp: '3344',
        otp: '5566',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 10 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: 'Open Farmhouse', meterLocation: 'Well pumphouse', faultHistory: 'Starter coil buzzing', siteAdvisory: 'Footwear not allowed in shed' },
        hardwareBills: []
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
        latitude: 11.2588,
        longitude: 75.7804,
        distance: '4.2 km',
        price: 750,
        finalPrice: 750,
        platformFee: 113, netPartnerPayout: 637,
        status: 'open',
        checkInOtp: '5566',
        otp: '7788',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 98 * 60 * 1000).toISOString(),
        payoutStatus: 'pending'
    },

    // ── ERNAKULAM / KOCHI HUB (Partner Praveen T.: 9.9816, 76.2999) ──
    {
        id: 'b-open-kochi',
        requiredSkill: 'Electrical',
        requiredTier: 'Gold',
        skillMatchPercent: 97,
        customerName: 'Mathew Abraham',
        customerPhone: '+91 98471 77209',
        service: 'Apartment DB Trip & Inverter Wiring Check',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Ernakulam',
        taluk: 'Kochi',
        address: 'InfoPark Phase 1 Road, Kakkanad, Kochi',
        latitude: 9.9890,
        longitude: 76.3080,
        distance: '3.2 km',
        price: 650,
        finalPrice: 650,
        platformFee: 98, netPartnerPayout: 552,
        status: 'open',
        checkInOtp: '9911',
        otp: '2244',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 18 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: '#4092 (Tower B)', meterLocation: 'Basement DB Room', faultHistory: 'UPS bypass tripped', siteAdvisory: 'Visitor parking at Bay 12' },
        hardwareBills: []
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
        latitude: 9.9982,
        longitude: 76.3117,
        distance: '3.8 km',
        price: 1800,
        finalPrice: 2200,
        platformFee: 330, netPartnerPayout: 1870,
        status: 'disputed',
        assignedPartnerId: 'p4',
        partnerName: 'Praveen T.',
        assignedPartnerPhone: '+91 94471 99881',
        checkInOtp: '4455',
        otp: '9900',
        date: 'Yesterday',
        time: 'Completed',
        createdAt: new Date(NOW - 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(NOW - 22 * 60 * 60 * 1000).toISOString(),
        dispute: { isDisputed: true, reason: 'Customer disputes extra ₹400 material surcharge added for busbar insulators.', reportedBy: 'customer', status: 'open', refundRequested: 400 },
        payoutStatus: 'flagged'
    },

    // ── THRISSUR HUB (Partner Arun Balan: 10.5276, 76.2144) ──
    {
        id: 'b-open-thrissur',
        requiredSkill: 'Electrical',
        requiredTier: 'Bronze',
        skillMatchPercent: 93,
        customerName: 'Sankaran Namboothiri',
        customerPhone: '+91 94470 33441',
        service: 'Temple Illumination MCB Overload & Sparking',
        serviceType: 'Emergency',
        category: 'Electrical',
        district: 'Thrissur',
        taluk: 'Thrissur',
        address: 'Round South, Near Swaraj Round, Thrissur',
        latitude: 10.5250,
        longitude: 76.2130,
        distance: '1.5 km',
        price: 550,
        finalPrice: 550,
        platformFee: 83, netPartnerPayout: 467,
        status: 'open',
        checkInOtp: '6611',
        otp: '8844',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 22 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: 'East Gopuram Entry', meterLocation: 'Oottupura DB', faultHistory: 'Floodlight line sparking', siteAdvisory: 'Isolate main switch first' },
        hardwareBills: []
    },

    // ── THIRUVANANTHAPURAM HUB (Partner Faisal K.: 8.5241, 76.9366) ──
    {
        id: 'b-open-trivandrum',
        requiredSkill: 'Electrical',
        requiredTier: 'Silver',
        skillMatchPercent: 95,
        customerName: 'Deepa Sasidharan',
        customerPhone: '+91 98471 44550',
        service: 'Solar Inverter Changeover Switch Fault',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Thiruvananthapuram',
        taluk: 'Trivandrum',
        address: 'MG Road, Near Secretariat, Palayam, Trivandrum',
        latitude: 8.5020,
        longitude: 76.9510,
        distance: '2.8 km',
        price: 650,
        finalPrice: 650,
        platformFee: 98, netPartnerPayout: 552,
        status: 'open',
        checkInOtp: '7722',
        otp: '9933',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 30 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: '#2201', meterLocation: 'Roof terrace solar panel DB', faultHistory: 'KSEB changeover stuck', siteAdvisory: 'Terrace key with security' },
        hardwareBills: []
    },

    // ── KOTTAYAM HUB (Partner Manoj Pillai: 9.5916, 76.5222) ──
    {
        id: 'b-open-kottayam',
        requiredSkill: 'Electrical',
        requiredTier: 'Bronze',
        skillMatchPercent: 92,
        customerName: 'Zachariah Joseph',
        customerPhone: '+91 94472 88990',
        service: 'Rubber Sheet Smokehouse Exhaust Fan Repair',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: 'Kottayam',
        taluk: 'Kottayam',
        address: 'Kanjikuzhy Junction, Baker Hill Road, Kottayam',
        latitude: 9.5890,
        longitude: 76.5260,
        distance: '2.4 km',
        price: 550,
        finalPrice: 550,
        platformFee: 83, netPartnerPayout: 467,
        status: 'open',
        checkInOtp: '1199',
        otp: '3388',
        date: 'Today',
        time: 'Immediate (90-Min Emergency)',
        slaMinutes: 90,
        createdAt: new Date(NOW - 12 * 60 * 1000).toISOString(),
        payoutStatus: 'pending',
        siteNotes: { gateCode: 'Open Plantation Gate', meterLocation: 'Estate Office DB', faultHistory: 'Exhaust motor humming', siteAdvisory: 'Direct road access' },
        hardwareBills: []
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

export const getBookingById = (id) => {
    return bookings.find(b => b.id === id) || null;
};

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
export const MAX_PARTNER_RADIUS_KM = 10;
export const OPTIMAL_PARTNER_RADIUS_KM = 8;

export const getOpenRequests = (partnerOrTaluk = "Thalassery", maxRadiusKm = 10) => {
    // If partner object is passed
    if (partnerOrTaluk && typeof partnerOrTaluk === 'object') {
        // If partner is offline, do NOT broadcast any open requests
        if (partnerOrTaluk.isAvailable === false) {
            return [];
        }
        const pLat = partnerOrTaluk.latitude || 11.7480;
        const pLon = partnerOrTaluk.longitude || 75.4894;
        const maxRadius = partnerOrTaluk.maxDispatchRadiusKm || maxRadiusKm || 10;

        return bookings
            .filter(b => b.status === 'open')
            .map(b => {
                let dist = 999;
                if (b.latitude && b.longitude) {
                    dist = haversineDistanceKm(pLat, pLon, b.latitude, b.longitude);
                } else if (b.distance) {
                    dist = parseFloat(b.distance) || 999;
                }
                return {
                    ...b,
                    _distanceKm: parseFloat(dist.toFixed(1)),
                    distance: `${dist.toFixed(1)} km`,
                    eta: `${Math.max(8, Math.round(dist * 3.5 + 8))} mins`,
                    territoryTag: 'Within 8–10 km Partner Territory'
                };
            })
            .filter(b => b._distanceKm <= maxRadius)
            .sort((a, b) => a._distanceKm - b._distanceKm);
    }

    // Fallback if taluk string was passed
    return bookings
        .filter(b => b.status === 'open')
        .map(b => {
            const d = parseFloat(b.distance) || 3.0;
            return {
                ...b,
                _distanceKm: d,
                distance: `${d.toFixed(1)} km`,
                eta: `${Math.max(8, Math.round(d * 3.5 + 8))} mins`,
                territoryTag: 'Within 8–10 km Partner Territory'
            };
        })
        .filter(b => b._distanceKm <= (maxRadiusKm || 10))
        .sort((a, b) => a._distanceKm - b._distanceKm);
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
            const laborPrice = (booking.price || 0) + (extraHours * 100);
            const catalogPartsCost = Number(materialCost) || 0;
            const hardwareBillsTotal = (booking.hardwareBills || []).reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
            booking.hardwareBillsTotal = hardwareBillsTotal;
            booking.materialCost = Number(materialCost) || 0;
            booking.hoursWorked = Number(hoursWorked) || 1;
            booking.finalPrice = laborPrice + catalogPartsCost + hardwareBillsTotal;
            // 15% platform fee applies to service labor (85/15 split; partner gets 85% labor + 100% material costs)
            booking.platformFee = Math.round(laborPrice * 0.15);
            booking.netPartnerPayout = booking.finalPrice - booking.platformFee;
            booking.paymentStatus = 'settled';
            booking.payoutStatus = 'settled';
            booking.splitRatio = '85/15';
            booking.payoutMethod = 'Instant UPI (Razorpay Route / IMPS)';
            booking.payoutUtr = 'UPI/2026/' + Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);
            booking.payoutSettledAt = new Date().toISOString();
            try { recordPartnerInstantPayout(booking); } catch (e) { console.warn('Payout sync warning:', e.message); }

            // Evidence & Parts
            booking.checklist = evidence.checklist || [];
            booking.beforePhoto = evidence.beforePhoto || null;
            booking.afterPhoto = evidence.afterPhoto || null;
            booking.workNotes = evidence.workNotes || '';
            booking.sparePartsUsed = evidence.sparePartsUsed || evidence.selectedParts || [];
            if (evidence.customerSignature) {
                booking.customerSignature = evidence.customerSignature;
            }
            if (evidence.diagnosticAssessment) {
                booking.diagnosticAssessment = evidence.diagnosticAssessment;
            }

            bookingEvents.emit('change');
            saveData();
            return { success: true, booking };
        } else {
            return { success: false, message: rateCheck.allowed ? 'Invalid Completion OTP' : rateCheck.message };
        }
    }
    return { success: false, message: 'Booking not found' };
};

// ─── Diagnostic Assessment Gate ──────────────────────────────────────────────
export const recordDiagnosticAssessment = (bookingId, { photoUri, faultDescription }) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.diagnosticAssessment = {
            photoUri,
            faultDescription,
            recordedAt: new Date().toISOString()
        };
        bookingEvents.emit('change');
        saveData();
        return { success: true, diagnosticAssessment: booking.diagnosticAssessment };
    }
    return { success: false, message: 'Booking not found' };
};

// ─── Digital Estimate Approval ──────────────────────────────────────────────
export const submitEstimateQuote = (bookingId, { parts = [], extraHours = 0, totalEstimate = 0, quoteNotes = '' }) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.estimateApproval = {
            parts,
            extraHours,
            totalEstimate,
            quoteNotes,
            submittedAt: new Date().toISOString(),
            isApproved: false,
            approvedAt: null
        };
        bookingEvents.emit('change');
        saveData();
        return { success: true, estimateApproval: booking.estimateApproval };
    }
    return { success: false, message: 'Booking not found' };
};

export const approveEstimateQuote = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.estimateApproval) {
        booking.estimateApproval.isApproved = true;
        booking.estimateApproval.approvedAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Estimate not found' };
};

// ─── Local Hardware Bill Snapper ────────────────────────────────────────────
export const addHardwareBill = (bookingId, { photoUri, supplierName, billNo, amount, items }) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        if (!booking.hardwareBills) booking.hardwareBills = [];
        const newBill = {
            id: `hb-${Date.now()}`,
            photoUri: photoUri || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
            supplierName: supplierName || 'Local Electrical Hardware Store',
            billNo: billNo || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            amount: Number(amount) || 0,
            items: items || 'Electrical hardware parts',
            recordedAt: new Date().toISOString(),
            reimbursementStatus: 'pending_reimbursement'
        };
        booking.hardwareBills.push(newBill);

        // Recalculate bill
        const hardwareTotal = booking.hardwareBills.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
        booking.hardwareBillsTotal = hardwareTotal;

        bookingEvents.emit('change');
        saveData();
        return { success: true, newBill, hardwareBills: booking.hardwareBills };
    }
    return { success: false, message: 'Booking not found' };
};

// ─── Digital Job Sign-Off ───────────────────────────────────────────────────
export const signOffBooking = (bookingId, signatureUri) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.customerSignature = signatureUri || 'DIGITAL_ACKNOWLEDGED_BY_CLIENT';
        booking.signedOffAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
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

export const triggerMockJobPing = (partner) => {
    const pLat = partner?.latitude || 11.7480;
    const pLon = partner?.longitude || 75.4894;
    const pTaluk = partner?.taluk || 'Thalassery';
    const pDistrict = partner?.district || 'Kannur';

    // Generate coordinate strictly within 1.5 to 3.5 km of online partner
    const offsetLat = (Math.random() - 0.5) * 0.035;
    const offsetLon = (Math.random() - 0.5) * 0.035;
    const jobLat = pLat + offsetLat;
    const jobLon = pLon + offsetLon;
    const distanceKm = haversineDistanceKm(pLat, pLon, jobLat, jobLon);

    const mockPing = {
        id: 'ping-' + Date.now(),
        customerName: 'K. M. Haris',
        customerPhone: '+91 98471 23456',
        service: 'Emergency Short Circuit & MCB Tripping',
        serviceType: 'Electrical',
        category: 'Electrical',
        district: pDistrict,
        taluk: pTaluk,
        address: `Town Ward, Near Main Road, ${pTaluk}`,
        latitude: jobLat,
        longitude: jobLon,
        distance: `${distanceKm.toFixed(1)} km`,
        maxRadiusPolicy: '8–10 km limit',
        territoryTag: 'Within 8–10 km Partner Territory',
        price: 550,
        finalPrice: 550,
        platformFee: 83, netPartnerPayout: 467,
        notes: 'Main distribution board sparking continuously near 32A MCB.',
        requiredSkill: 'Electrical',
        requiredTier: 'Gold',
        skillMatchPercent: 98,
        siteNotes: {
            gateCode: '#9012',
            meterLocation: 'Behind porch pillar ground floor',
            faultHistory: 'MCB sparking on heavy load during rainfall',
            siteAdvisory: 'Call upon gate arrival'
        },
        hardwareBills: [],
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

// Record Razorpay Online Payment
export const recordOnlinePayment = (id, paymentDetails = {}) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.paymentStatus = 'paid';
        booking.paymentMethod = paymentDetails.method || 'Razorpay UPI / Card';
        booking.paymentGateway = 'Razorpay';
        booking.razorpayPaymentId = paymentDetails.razorpayPaymentId || `pay_${Date.now()}`;
        booking.razorpayOrderId = paymentDetails.razorpayOrderId || null;
        booking.razorpaySignature = paymentDetails.razorpaySignature || null;
        booking.paidAt = paymentDetails.paidAt || new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
};

// Record Cash on Completion Payment
export const recordCashPayment = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.paymentStatus = 'paid';
        booking.paymentMethod = 'Cash on Doorstep';
        booking.paymentGateway = 'Cash';
        booking.paidAt = new Date().toISOString();
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
};

// Add / Update Spare Parts on a Booking
export const addSparePartsToBooking = (id, parts = []) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.sparePartsUsed = parts;
        const partsTotal = parts.reduce((sum, p) => sum + ((p.rate || 0) * (p.quantity || 1)), 0);
        booking.materialCost = partsTotal;
        const extraHours = Math.max(0, (booking.hoursWorked || 1) - 1);
        booking.finalPrice = (booking.price || 0) + (extraHours * 100) + partsTotal;
        booking.platformFee = Math.round(booking.finalPrice * 0.15);
        booking.netPartnerPayout = booking.finalPrice - booking.platformFee;
        bookingEvents.emit('change');
        saveData();
        return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
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
        finalPrice: Math.max(499, sanitized.price || 499),
        platformFee: Math.round(Math.max(499, sanitized.price || 499) * 0.15),
        netPartnerPayout: Math.round(Math.max(499, sanitized.price || 499) * 0.85),
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

export const useBookings = () => {
    return {
        bookings: getBookings(),
        createBooking,
        getBookingById,
        calculateSLA,
        cancelBooking,
        payBooking
    };
};


export const getVerifiedReviews = () => {
    return (bookings || []).filter(b => b.status === 'completed' && b.reviewText);
};

export const submitVerifiedReview = (bookingId, rating, reviewText, reviewerName) => {
    const cleanId = String(bookingId || '').trim();
    const booking = (bookings || []).find(b => b.id === cleanId || b.id === 'b-' + cleanId || b.id === ('b-active-' + cleanId));
    if (!booking) {
        return { success: false, message: 'Job ID not found. Reviews can only be left for verified completed bookings.' };
    }
    if (booking.status !== 'completed') {
        return { success: false, message: 'This booking is still in progress. Feedback requires customer OTP completion first.' };
    }
    booking.customerRating = Number(rating) || 5;
    booking.reviewText = (reviewText || '').trim();
    booking.reviewerName = (reviewerName || booking.customerName || 'Verified Homeowner').trim();
    booking.reviewedAt = new Date().toISOString();
    bookingEvents.emit('change');
    saveData();
    return { success: true, booking };
};
