const { test, describe } = require('node:test');
const assert = require('assert');

// 1. Mock Customer Store
function createCustomerStore() {
    const customers = new Map();
    return {
        registerOrUpdate(phone, name, address) {
            const normalized = phone.startsWith('+91') ? phone : '+91' + phone.replace(/\D/g, '');
            if (customers.has(normalized)) {
                const existing = customers.get(normalized);
                existing.totalBookings += 1;
                existing.isRepeatCustomer = true;
                if (address && !existing.addresses.includes(address)) existing.addresses.push(address);
                return existing;
            }
            const customer = {
                id: 'cust_' + Math.random().toString(36).substring(2),
                phone: normalized,
                name: name.trim(),
                addresses: address ? [address] : [],
                totalBookings: 1,
                isRepeatCustomer: false
            };
            customers.set(normalized, customer);
            return customer;
        }
    };
}

// 2. Mock AI Triage
function aiTriageProblem(text) {
    const lower = text.toLowerCase();
    if (lower.includes('spark') || lower.includes('mcb') || lower.includes('shock')) {
        return {
            serviceId: 'emergency-repair',
            serviceName: 'Emergency Repair Specialist (90-Min)',
            estimatedPrice: '₹449 - ₹899',
            urgency: 'Emergency'
        };
    }
    if (lower.includes('fan') || lower.includes('slow')) {
        return {
            serviceId: 'fan-repair',
            serviceName: 'Ceiling & Exhaust Fan Repair',
            estimatedPrice: '₹249',
            urgency: 'Standard'
        };
    }
    return {
        serviceId: 'general-diagnostic',
        serviceName: 'General Electrical Diagnostic',
        estimatedPrice: '₹299',
        urgency: 'Standard'
    };
}

// 3. Mock Booking & Dispatch Lifecycle
function createBookingEngine() {
    const bookings = [];

    return {
        createBooking({ customerId, customerName, customerPhone, address, problemText, triage }) {
            const booking = {
                id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
                customerId,
                customerName,
                customerPhone,
                address,
                serviceId: triage.serviceId,
                serviceTitle: triage.serviceName,
                price: triage.urgency === 'Emergency' ? 449 : 249,
                finalPrice: null,
                status: 'open',
                assignedTo: null,
                checkInOtp: '1234',
                completionOtp: '4321',
                photos: { before: null, after: null },
                warrantyDays: 0,
                createdAt: new Date().toISOString()
            };
            bookings.push(booking);
            return booking;
        },
        assignTechnician(bookingId, techId, techName) {
            const b = bookings.find(item => item.id === bookingId);
            if (!b) throw new Error('Booking not found');
            b.assignedTo = techId;
            b.assignedTechName = techName;
            b.status = 'assigned';
            return b;
        },
        checkIn(bookingId, otp) {
            const b = bookings.find(item => item.id === bookingId);
            if (!b) throw new Error('Booking not found');
            if (b.checkInOtp !== otp) throw new Error('Invalid check-in OTP');
            b.status = 'in_progress';
            b.checkedInAt = new Date().toISOString();
            return b;
        },
        completeJob(bookingId, otp, finalPrice, beforePhoto, afterPhoto) {
            const b = bookings.find(item => item.id === bookingId);
            if (!b) throw new Error('Booking not found');
            if (b.completionOtp !== otp) throw new Error('Invalid completion OTP');
            b.status = 'completed';
            b.finalPrice = finalPrice;
            b.photos.before = beforePhoto;
            b.photos.after = afterPhoto;
            b.warrantyDays = 30; // 30-Day rework protection
            b.completedAt = new Date().toISOString();
            return b;
        },
        generateInvoice(bookingId) {
            const b = bookings.find(item => item.id === bookingId);
            if (!b || b.status !== 'completed') throw new Error('Invoice only available for completed bookings');

            const baseLabor = b.finalPrice * 0.7;
            const spares = b.finalPrice * 0.3;
            const platformFee = 29.00;
            const taxable = baseLabor + platformFee;
            const gst = Number((taxable * 0.18).toFixed(2));
            const total = Math.round(taxable + spares + gst);

            return {
                invoiceId: 'VF-' + b.id.replace('BK-', ''),
                bookingId: b.id,
                customerName: b.customerName,
                sacCode: '998732',
                baseLabor: Number(baseLabor.toFixed(2)),
                spares: Number(spares.toFixed(2)),
                platformFee,
                gst,
                total,
                warranty: '30 Days Workmanship Guarantee Active'
            };
        }
    };
}

describe('End-to-End Kerala Electrical Service Booking & Fulfillment Workflow', () => {
    test('Simulates complete lifecycle: Intake -> AI Triage -> Dispatch -> On-Site OTP -> Invoice', () => {
        const customerStore = createCustomerStore();
        const bookingEngine = createBookingEngine();

        // 1. Customer Lead Intake
        const customer = customerStore.registerOrUpdate('9447128901', 'Vinod Nambiar', 'Goods Shed Road, Thalassery, Kannur');
        assert.strictEqual(customer.totalBookings, 1);
        assert.strictEqual(customer.isRepeatCustomer, false);

        // 2. AI Smart Triage
        const triage = aiTriageProblem('The bedroom ceiling fan is completely stopped and regulator is hot');
        assert.strictEqual(triage.serviceId, 'fan-repair');
        assert.strictEqual(triage.urgency, 'Standard');

        // 3. Create Booking
        const booking = bookingEngine.createBooking({
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            address: customer.addresses[0],
            problemText: 'The bedroom ceiling fan is completely stopped',
            triage
        });
        assert.strictEqual(booking.status, 'open');
        assert.ok(booking.id.startsWith('BK-'));

        // 4. Admin Dispatch Desk assigns Wireman
        const assigned = bookingEngine.assignTechnician(booking.id, 'tech_owner', 'Zanjan (Lead Wireman)');
        assert.strictEqual(assigned.status, 'assigned');
        assert.strictEqual(assigned.assignedTechName, 'Zanjan (Lead Wireman)');

        // 5. On-site Check-in with Customer OTP
        const checkedIn = bookingEngine.checkIn(booking.id, '1234');
        assert.strictEqual(checkedIn.status, 'in_progress');
        assert.ok(checkedIn.checkedInAt);

        // 6. Job Completion with Before/After Photos & Final Price
        const completed = bookingEngine.completeJob(
            booking.id,
            '4321',
            350,
            'https://storage.supabase.co/job-photos/before_1.jpg',
            'https://storage.supabase.co/job-photos/after_1.jpg'
        );
        assert.strictEqual(completed.status, 'completed');
        assert.strictEqual(completed.finalPrice, 350);
        assert.strictEqual(completed.warrantyDays, 30);

        // 7. Digital Tax Invoice Generation
        const invoice = bookingEngine.generateInvoice(booking.id);
        assert.ok(invoice.invoiceId.startsWith('VF-'));
        assert.strictEqual(invoice.sacCode, '998732');
        assert.ok(invoice.total > 0);
        assert.strictEqual(invoice.warranty, '30 Days Workmanship Guarantee Active');

        // 8. Subsequent Booking Recognition
        const repeatCustomer = customerStore.registerOrUpdate('9447128901', 'Vinod Nambiar', 'Office Annex, Thalassery');
        assert.strictEqual(repeatCustomer.totalBookings, 2);
        assert.strictEqual(repeatCustomer.isRepeatCustomer, true);
    });
});
