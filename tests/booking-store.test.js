const { test, describe } = require('node:test');
const assert = require('assert');

// Clean Phone & Validation Helpers
function validateIndianPhone(input) {
    if (!input || typeof input !== 'string') {
        return { isValid: false, normalized: '', error: 'Phone number is required' };
    }

    const digits = input.replace(/\D/g, '');

    // 10 digits directly (e.g. 9876543210)
    if (digits.length === 10) {
        if (!/^[6-9]/.test(digits)) {
            return { isValid: false, normalized: '', error: 'Mobile number must start with 6, 7, 8, or 9' };
        }
        return { isValid: true, normalized: '+91' + digits, error: null };
    }

    // 12 digits with country code (e.g. 919876543210)
    if (digits.length === 12 && digits.startsWith('91')) {
        const local = digits.substring(2);
        if (!/^[6-9]/.test(local)) {
            return { isValid: false, normalized: '', error: 'Mobile number must start with 6, 7, 8, or 9' };
        }
        return { isValid: true, normalized: '+91' + local, error: null };
    }

    return { isValid: false, normalized: '', error: 'Please enter a valid 10-digit mobile number' };
}

// In-Memory Customer Store implementation
function createCustomerStore() {
    const customers = [];

    return {
        findCustomerByPhone(phone) {
            const val = validateIndianPhone(phone);
            if (!val.isValid) return null;
            return customers.find(c => c.phone === val.normalized) || null;
        },
        createOrUpdateOnBooking(phone, name, address) {
            const val = validateIndianPhone(phone);
            if (!val.isValid) throw new Error(val.error);

            let existing = customers.find(c => c.phone === val.normalized);
            if (existing) {
                existing.totalBookings += 1;
                existing.isRepeatCustomer = true;
                if (address && !existing.addresses.includes(address)) {
                    existing.addresses.push(address);
                }
                return existing;
            }

            const newCust = {
                id: 'cust_' + Math.random().toString(36).substring(2),
                phone: val.normalized,
                name: name.trim(),
                addresses: address ? [address] : [],
                totalBookings: 1,
                isRepeatCustomer: false,
                firstBookingAt: new Date().toISOString()
            };
            customers.push(newCust);
            return newCust;
        },
        getAll() {
            return [...customers];
        }
    };
}

// SLA Calculation Logic (90-Min Kerala emergency wireman standard)
function calculateSLA(booking, currentTime = Date.now()) {
    const maxMinutes = booking.slaMinutes || 90;
    const createdAtMs = new Date(booking.createdAt).getTime();
    const elapsedMinutes = Math.floor((currentTime - createdAtMs) / 60000);
    const remainingMinutes = maxMinutes - elapsedMinutes;

    return {
        slaMinutes: maxMinutes,
        elapsedMinutes: Math.max(0, elapsedMinutes),
        remainingMinutes,
        isWarning: remainingMinutes <= 30 && remainingMinutes > 0,
        isBreached: remainingMinutes <= 0 && booking.status !== 'completed' && booking.status !== 'Cancelled'
    };
}

describe('Booking & Customer State Store', () => {
    test('Validates 10-digit Indian phone numbers with +91 normalization', () => {
        const valid = validateIndianPhone('9876543210');
        assert.strictEqual(valid.isValid, true);
        assert.strictEqual(valid.normalized, '+919876543210');

        const validWithCode = validateIndianPhone('+91 94471 28901');
        assert.strictEqual(validWithCode.isValid, true);
        assert.strictEqual(validWithCode.normalized, '+919447128901');

        const invalidLeadingDigit = validateIndianPhone('4876543210');
        assert.strictEqual(invalidLeadingDigit.isValid, false);

        const invalidLength = validateIndianPhone('12345');
        assert.strictEqual(invalidLength.isValid, false);
    });

    test('Customer Store recognizes returning customers on subsequent bookings', () => {
        const store = createCustomerStore();

        // 1st booking -> Fresh customer
        const first = store.createOrUpdateOnBooking('9876543210', 'Alex Vance', 'Flat 4B, Panampilly Nagar, Kochi');
        assert.strictEqual(first.totalBookings, 1);
        assert.strictEqual(first.isRepeatCustomer, false);

        // 2nd booking -> Recognized as repeat client
        const second = store.createOrUpdateOnBooking('9876543210', 'Alex Vance', 'Office 12, MG Road, Kochi');
        assert.strictEqual(second.totalBookings, 2);
        assert.strictEqual(second.isRepeatCustomer, true);
        assert.strictEqual(second.addresses.length, 2);
    });

    test('SLA engine flags warning at 60 mins and breached at 90 mins for active emergency dispatches', () => {
        const baseTime = 1700000000000;
        const booking = {
            id: 'b-99',
            createdAt: new Date(baseTime).toISOString(),
            slaMinutes: 90,
            status: 'assigned'
        };

        // At 30 mins elapsed -> Normal
        const normal = calculateSLA(booking, baseTime + (30 * 60000));
        assert.strictEqual(normal.isWarning, false);
        assert.strictEqual(normal.isBreached, false);
        assert.strictEqual(normal.remainingMinutes, 60);

        // At 70 mins elapsed -> Warning (<= 30 mins remaining)
        const warning = calculateSLA(booking, baseTime + (70 * 60000));
        assert.strictEqual(warning.isWarning, true);
        assert.strictEqual(warning.isBreached, false);
        assert.strictEqual(warning.remainingMinutes, 20);

        // At 95 mins elapsed -> Breached
        const breached = calculateSLA(booking, baseTime + (95 * 60000));
        assert.strictEqual(breached.isBreached, true);
        assert.ok(breached.remainingMinutes <= 0);

        // Completed jobs are never marked as breached
        const completedBooking = { ...booking, status: 'completed' };
        const completedSla = calculateSLA(completedBooking, baseTime + (120 * 60000));
        assert.strictEqual(completedSla.isBreached, false);
    });
});
