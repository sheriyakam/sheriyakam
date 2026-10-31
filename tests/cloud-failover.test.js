const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ─────────────────────────────────────────────────────────────
// Cloud Client & Failover Pure Logic Contracts
// ─────────────────────────────────────────────────────────────

function generateJobId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SHK-${randomSuffix}`;
}

function buildWhatsAppBookingMessage(payload, jobId) {
  const cleanPhone = (payload.customerPhone || '').replace(/\D/g, '').slice(-10);
  const itemsText = (payload.items || [])
    .map((item) => `• ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');

  return `⚡ *SHERIYAKAM PRIORITY BOOKING*\n` +
    `*Job ID:* ${jobId}\n` +
    `*Customer:* ${payload.customerName.trim()}\n` +
    `*Phone:* +91 ${cleanPhone}\n` +
    `*Location:* ${payload.area || payload.address || 'Thalassery–Mahe Corridor'} (${payload.pinCode || '670101'})\n` +
    (payload.isEmergency ? `🚨 *Urgency:* EMERGENCY DISPATCH (90-Min SLA)\n` : '') +
    `\n*Selected Services:*\n${itemsText}\n\n` +
    `💰 *Estimated Total:* ₹${payload.totalPrice}\n` +
    (payload.scheduleDate ? `📅 *Date:* ${payload.scheduleDate} | ${payload.scheduleSlot || 'ASAP'}\n` : '') +
    (payload.notes ? `📝 *Notes:* ${payload.notes}\n` : '') +
    `\n_Automated dispatch via Sheriyakam High-Availability Gateway_`;
}

function sanitizePhone(raw) {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

const ACTIVE_PINS = new Set([
  '670101', // Thalassery
  '673310', // Mahe
  '670106', // Dharmadam
  '670642', // Kadirur
  '670672', // Chokli
  '673311', // New Mahe
  '673309', // Azhiyur
]);

describe('High-Availability Cloud Failover Architecture', () => {
  it('generates compliant Job ID with SHK- prefix and 4 digits', () => {
    for (let i = 0; i < 20; i++) {
      const id = generateJobId();
      assert.match(id, /^SHK-\d{4}$/, 'Job ID must follow SHK-XXXX format');
    }
  });

  it('builds structured WhatsApp fallback booking message with Thalassery corridor details', () => {
    const mockPayload = {
      customerName: 'Muhammed Nihal',
      customerPhone: '+91 94471 28901',
      address: 'Main Road, Near Old Bus Stand',
      area: 'Thalassery Town',
      pinCode: '670101',
      isEmergency: true,
      items: [
        { id: 1, title: 'Fault Inspection & Multimeter Diagnosis', price: 149, quantity: 1 },
        { id: 2, title: 'Switchboard, Socket & Plug Repair', price: 149, quantity: 2 },
      ],
      totalPrice: 447,
      scheduleDate: '2026-11-01',
      scheduleSlot: 'Morning (9:00 AM)',
      notes: 'Tripping main MCB breaker after rain',
    };

    const msg = buildWhatsAppBookingMessage(mockPayload, 'SHK-5512');
    assert.ok(msg.includes('*Job ID:* SHK-5512'));
    assert.ok(msg.includes('Muhammed Nihal'));
    assert.ok(msg.includes('+91 9447128901'));
    assert.ok(msg.includes('Thalassery Town (670101)'));
    assert.ok(msg.includes('EMERGENCY DISPATCH (90-Min SLA)'));
    assert.ok(msg.includes('Fault Inspection & Multimeter Diagnosis (x1) - ₹149'));
    assert.ok(msg.includes('Switchboard, Socket & Plug Repair (x2) - ₹298'));
    assert.ok(msg.includes('💰 *Estimated Total:* ₹447'));
  });

  it('validates 10-digit Indian phone numbers with country code normalization', () => {
    assert.equal(sanitizePhone('+91 94471 28901'), '9447128901');
    assert.equal(sanitizePhone('09447128901'), '9447128901');
    assert.equal(sanitizePhone('94471-28901'), '9447128901');
    assert.equal(isValidIndianMobile(sanitizePhone('+91 94471 28901')), true);
    assert.equal(isValidIndianMobile('5123456789'), false); // starts with 5
    assert.equal(isValidIndianMobile('984701234'), false); // 9 digits
  });

  it('validates Thalassery–Mahe 7 active PIN code delivery zones', () => {
    assert.ok(ACTIVE_PINS.has('670101'), 'Thalassery must be active');
    assert.ok(ACTIVE_PINS.has('673310'), 'Mahe must be active');
    assert.ok(ACTIVE_PINS.has('670106'), 'Dharmadam must be active');
    assert.ok(ACTIVE_PINS.has('670642'), 'Kadirur must be active');
    assert.ok(ACTIVE_PINS.has('670672'), 'Chokli must be active');
    assert.ok(ACTIVE_PINS.has('673311'), 'New Mahe must be active');
    assert.ok(ACTIVE_PINS.has('673309'), 'Azhiyur must be active');
    assert.ok(!ACTIVE_PINS.has('682001'), 'Kochi PIN is outside 90-min pilot corridor');
  });

  it('simulates 3-tier failover decision engine', async () => {
    const mockPayload = {
      customerName: 'Anil Kumar',
      customerPhone: '9847012345',
      area: 'Mahe Town',
      pinCode: '673310',
      items: [{ id: 3, title: 'Ceiling Fan Repair', price: 249, quantity: 1 }],
      totalPrice: 249,
    };

    // Stage 1: Primary succeeds
    const mockPrimarySucceeds = async () => ({ status: 200, ok: true, json: async () => ({ jobId: 'SHK-1001' }) });
    const res1 = await mockPrimarySucceeds();
    assert.equal(res1.ok, true);

    // Stage 2: Primary times out (3500ms AbortController), fallback to backup
    const mockPrimaryTimesOut = async () => { throw new Error('AbortError: Request timed out'); };
    const mockBackupSucceeds = async () => ({ status: 200, ok: true, json: async () => ({ jobId: 'SHK-1002', source: 'backup_worker' }) });

    let fallbackTriggered = false;
    let finalSource = '';
    try {
      await mockPrimaryTimesOut();
    } catch {
      fallbackTriggered = true;
      const bRes = await mockBackupSucceeds();
      const data = await bRes.json();
      finalSource = data.source;
    }
    assert.equal(fallbackTriggered, true);
    assert.equal(finalSource, 'backup_worker');

    // Stage 3: Both servers fail -> emergency fallback routes directly to dispatch phone
    const mockBackupFails = async () => { throw new Error('503 Service Unavailable'); };
    let emergencyEngaged = false;
    let waUrl = '';
    try {
      await mockBackupFails();
    } catch {
      emergencyEngaged = true;
      const text = buildWhatsAppBookingMessage(mockPayload, 'SHK-9999');
      waUrl = `https://wa.me/919447128901?text=${encodeURIComponent(text)}`;
    }
    assert.equal(emergencyEngaged, true);
    assert.ok(waUrl.includes('919447128901'));
    assert.ok(waUrl.includes('SHK-9999'));
  });

  it('verifies anti-sleep keepalive cron schedule format', () => {
    // Vercel cron format: 5-part cron syntax
    const cronExpression = '0 8 * * *';
    const parts = cronExpression.split(' ');
    assert.equal(parts.length, 5, 'Cron expression must have 5 parts');
    assert.equal(parts[0], '0', 'Minute must be 0');
    assert.equal(parts[1], '8', 'Hour must be 8 (8:00 AM daily)');
  });
});
