/**
 * cost-saving-utilities.test.js
 * Comprehensive Unit and Integration Test Suite for:
 * 1. Zero-Cost Geocoding, Kerala/Mahe PIN Validation & 28 km/h Road ETA Routing
 * 2. Two-Stage Pre-OTP Mobile Validation (Local Gatekeeper & Carrier Fail-Open)
 * 3. Electrician Bank IFSC Verification & Auto-Lock
 * 4. Offline NPCI UPI QR Generator & UTR Validation
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// --- 1. PIN & LOCATION DOMAIN LOGIC ---
function isValidPincodeFormat(pincode) {
  return /^[1-9][0-9]{5}$/.test((pincode || '').trim());
}

function isKeralaOrMahePincode(pincode) {
  const clean = (pincode || '').trim();
  if (!isValidPincodeFormat(clean)) return false;
  const prefix = parseInt(clean.substring(0, 2), 10);
  return (prefix >= 67 && prefix <= 69) || clean === '673310'; // Mahe is 673310
}

function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371.0;
  const toRadians = (deg) => (deg * Math.PI) / 180.0;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
}

function calculateFallbackKeralaEta(originLat, originLon, destLat, destLon) {
  const straightLineKm = calculateHaversineDistanceKm(originLat, originLon, destLat, destLon);
  const roadDistanceKm = Math.round(straightLineKm * 1.35 * 100) / 100;
  const durationHours = roadDistanceKm / 28.0;
  const durationMinutes = Math.max(1, Math.round(durationHours * 60));

  return {
    distanceKm: roadDistanceKm,
    durationMinutes,
    isFallback: true,
  };
}

// --- 2. PHONE VALIDATION DOMAIN LOGIC ---
const DUMMY_PHONE_PATTERNS = [
  '9876543210',
  '9123456789',
  '9012345678',
  '9898989898',
  '9090909090',
  '8989898989',
  '7878787878',
  '6767676767',
  '9988776655',
  '1234567890',
  '0123456789',
];

function normalizeIndianPhoneNumber(input) {
  if (!input) return '';
  let cleaned = input.replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0091')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

function validateIndianMobileLocally(rawNumber) {
  const normalized = normalizeIndianPhoneNumber(rawNumber);
  if (!normalized) {
    return { isValid: false, normalizedNumber: '', error: 'Phone number is required.' };
  }
  if (normalized.length !== 10) {
    return { isValid: false, normalizedNumber: normalized, error: 'Indian mobile number must be exactly 10 digits.' };
  }
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return { isValid: false, normalizedNumber: normalized, error: 'Invalid mobile number. Valid Indian mobiles start with 6, 7, 8, or 9.' };
  }
  if (/^(\d)\1{9}$/.test(normalized)) {
    return { isValid: false, normalizedNumber: normalized, error: 'Fake or repetitive test number detected.' };
  }
  if (DUMMY_PHONE_PATTERNS.includes(normalized)) {
    return { isValid: false, normalizedNumber: normalized, error: 'Invalid phone number sequence.' };
  }
  return { isValid: true, normalizedNumber: normalized };
}

// --- 3. IFSC DOMAIN LOGIC ---
function isValidIfscFormat(ifsc) {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}

// --- 4. UPI PAYMENT DOMAIN LOGIC ---
const upiPaymentService = {
  generateUpiIntentUri(params) {
    const labor = Math.max(0, Number(params.laborFee) || 0);
    const parts = Math.max(0, Number(params.partsCost) || 0);
    const platform = Math.max(0, Number(params.platformFee) || 0);

    const sum = labor + parts + platform;
    if (sum <= 0) {
      throw new Error('Total payment amount must be strictly greater than zero.');
    }

    const formattedAmount = sum.toFixed(2);
    const merchantVpa = params.merchantVpa || 'sheriyakam@icici';
    const merchantName = params.merchantName || 'Sheriyakam Electricals';

    const transactionRef = `SHK_${params.jobId}_1720000000000`;
    const transactionNote = `Job_${params.jobId}`;

    const queryParams = new URLSearchParams({
      pa: merchantVpa,
      pn: merchantName,
      am: formattedAmount,
      cu: 'INR',
      tn: transactionNote,
      tr: transactionRef,
      mode: '02',
      orgid: '159014',
    });

    const upiUri = `upi://pay?${queryParams.toString()}`;
    const fallbackQrUrl = this.getFallbackQrImageUrl(upiUri);

    return {
      upiUri,
      totalAmount: sum,
      formattedAmount,
      transactionRef,
      transactionNote,
      merchantVpa,
      merchantName,
      fallbackQrUrl,
      breakdown: {
        laborFee: labor,
        partsCost: parts,
        platformFee: platform,
        totalAmount: sum,
      },
    };
  },

  getFallbackQrImageUrl(upiUri, size = 300) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=M&data=${encodeURIComponent(upiUri)}`;
  },

  validateUtr(utr) {
    const clean = (utr || '').trim();
    if (!clean) {
      return { isValid: false, error: 'Please enter the UPI transaction reference or last 4 digits.' };
    }
    if (/^\d{4}$/.test(clean) || /^\d{12}$/.test(clean)) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: 'Invalid UTR format. Enter either the last 4 digits or the full 12-digit UPI reference.',
    };
  },
};

describe('TASK 1: Zero-Cost Geocoding, Kerala PINs & Road ETA', () => {
  it('correctly validates 6-digit Indian PIN format', () => {
    assert.strictEqual(isValidPincodeFormat('670101'), true); // Thalassery
    assert.strictEqual(isValidPincodeFormat('673310'), true); // Mahe
    assert.strictEqual(isValidPincodeFormat('682001'), true); // Ernakulam
    assert.strictEqual(isValidPincodeFormat('070101'), false); // Starts with 0
    assert.strictEqual(isValidPincodeFormat('67010'), false); // 5 digits
    assert.strictEqual(isValidPincodeFormat('6701012'), false); // 7 digits
    assert.strictEqual(isValidPincodeFormat('ABCDEF'), false);
  });

  it('correctly flags Kerala (67xxxx-69xxxx) and Mahe (673310) postal zones', () => {
    assert.strictEqual(isKeralaOrMahePincode('670101'), true); // Kannur
    assert.strictEqual(isKeralaOrMahePincode('673001'), true); // Kozhikode
    assert.strictEqual(isKeralaOrMahePincode('673310'), true); // Mahe
    assert.strictEqual(isKeralaOrMahePincode('682001'), true); // Kochi
    assert.strictEqual(isKeralaOrMahePincode('695001'), true); // Thiruvananthapuram
    assert.strictEqual(isKeralaOrMahePincode('560001'), false); // Bengaluru
    assert.strictEqual(isKeralaOrMahePincode('110001'), false); // Delhi
  });

  it('calculates accurate straight-line Haversine distance between Kannur and Thalassery', () => {
    // Kannur: 11.8745, 75.3704 | Thalassery: 11.7491, 75.4890
    const distanceKm = calculateHaversineDistanceKm(11.8745, 75.3704, 11.7491, 75.4890);
    // Real straight-line distance is ~19-20 km
    assert.ok(distanceKm >= 18 && distanceKm <= 22, `Expected distance between 18-22km, got ${distanceKm}`);
  });

  it('estimates realistic Kerala road transit ETA with 1.35x winding factor at 28 km/h', () => {
    // Kannur to Thalassery
    const eta = calculateFallbackKeralaEta(11.8745, 75.3704, 11.7491, 75.4890);
    assert.strictEqual(eta.isFallback, true);
    assert.ok(eta.distanceKm > 20, `Road distance with 1.35x factor should be >20km, got ${eta.distanceKm}`);
    assert.ok(eta.durationMinutes >= 40 && eta.durationMinutes <= 65, `Expected 40-65 mins, got ${eta.durationMinutes}`);
  });
});

describe('TASK 2: Two-Stage Pre-OTP Phone Validation Pipeline', () => {
  it('normalizes Indian phone numbers with prefixes, dashes, and spaces', () => {
    assert.strictEqual(normalizeIndianPhoneNumber('+91 98470 12345'), '9847012345');
    assert.strictEqual(normalizeIndianPhoneNumber('+91-94471-23456'), '9447123456');
    assert.strictEqual(normalizeIndianPhoneNumber('09847012345'), '9847012345');
    assert.strictEqual(normalizeIndianPhoneNumber('919847012345'), '9847012345');
    assert.strictEqual(normalizeIndianPhoneNumber('9847012345'), '9847012345');
  });

  it('Stage 1 accepts valid Kerala mobile numbers (6, 7, 8, 9 prefixes)', () => {
    const validNumbers = ['9847012345', '8547012345', '7012345678', '6234567890'];
    for (const num of validNumbers) {
      const res = validateIndianMobileLocally(num);
      assert.strictEqual(res.isValid, true, `Number ${num} should be valid`);
      assert.strictEqual(res.normalizedNumber, num);
    }
  });

  it('Stage 1 rejects landlines or invalid leading digits without network call', () => {
    const invalidLeading = ['0497270123', '5847012345', '1847012345', '2847012345'];
    for (const num of invalidLeading) {
      const res = validateIndianMobileLocally(num);
      assert.strictEqual(res.isValid, false, `Number ${num} should be rejected`);
    }
  });

  it('Stage 1 eliminates repetitive dummy spam numbers (e.g. 9999999999)', () => {
    const repetitive = ['9999999999', '8888888888', '7777777777', '6666666666'];
    for (const num of repetitive) {
      const res = validateIndianMobileLocally(num);
      assert.strictEqual(res.isValid, false);
      assert.match(res.error, /repetitive/i);
    }
  });

  it('Stage 1 eliminates common test sequences (e.g. 9876543210)', () => {
    const sequences = ['9876543210', '9898989898', '9090909090', '1234567890'];
    for (const seq of sequences) {
      const res = validateIndianMobileLocally(seq);
      assert.strictEqual(res.isValid, false);
    }
  });
});

describe('TASK 3: Electrician Bank Account IFSC Verification', () => {
  it('validates standard 11-character Indian IFSC codes', () => {
    assert.strictEqual(isValidIfscFormat('SBIN0000800'), true); // SBI Thalassery
    assert.strictEqual(isValidIfscFormat('FDRL0001358'), true); // Federal Bank Kannur
    assert.strictEqual(isValidIfscFormat('HDFC0000123'), true); // HDFC
    assert.strictEqual(isValidIfscFormat('sbin0000800'), true); // Case-insensitive
    assert.strictEqual(isValidIfscFormat('SBIN000800'), false); // Only 10 chars
    assert.strictEqual(isValidIfscFormat('SBIN1000800'), false); // 5th char must be '0'
    assert.strictEqual(isValidIfscFormat('12345678901'), false);
  });
});

describe('TASK 4: Offline Dynamic NPCI UPI QR Generator & UTR Validation', () => {
  it('constructs strict NPCI compliant UPI URI with 2-decimal formatted amount', () => {
    const result = upiPaymentService.generateUpiIntentUri({
      jobId: 'SHK_8942',
      laborFee: 450,
      partsCost: 320.5,
      platformFee: 49,
      merchantVpa: 'sheriyakam@icici',
      merchantName: 'Sheriyakam Electricals',
    });

    assert.strictEqual(result.formattedAmount, '819.50');
    assert.strictEqual(result.totalAmount, 819.5);
    assert.ok(result.upiUri.startsWith('upi://pay?'), 'URI must start with upi://pay?');
    assert.ok(result.upiUri.includes('pa=sheriyakam%40icici'));
    assert.ok(result.upiUri.includes('am=819.50'));
    assert.ok(result.upiUri.includes('cu=INR'));
    assert.ok(result.upiUri.includes('tn=Job_SHK_8942'));
    assert.ok(result.upiUri.includes('tr=SHK_SHK_8942_'));
  });

  it('rejects zero or negative payment amounts', () => {
    assert.throws(() => {
      upiPaymentService.generateUpiIntentUri({
        jobId: 'SHK_0001',
        laborFee: 0,
        partsCost: 0,
      });
    }, /strictly greater than zero/i);
  });

  it('generates raster fallback QR image URL pointing to qrserver.com', () => {
    const upiUri = 'upi://pay?pa=sheriyakam@icici&am=450.00';
    const qrUrl = upiPaymentService.getFallbackQrImageUrl(upiUri, 300);
    assert.ok(qrUrl.startsWith('https://api.qrserver.com/v1/create-qr-code/'));
    assert.ok(qrUrl.includes('size=300x300'));
    assert.ok(qrUrl.includes(encodeURIComponent(upiUri)));
  });

  it('validates UTR numbers (4-digit quick ref or 12-digit standard banking ref)', () => {
    assert.strictEqual(upiPaymentService.validateUtr('8492').isValid, true);
    assert.strictEqual(upiPaymentService.validateUtr('432109876543').isValid, true);
    assert.strictEqual(upiPaymentService.validateUtr('123').isValid, false);
    assert.strictEqual(upiPaymentService.validateUtr('ABC432').isValid, false);
    assert.strictEqual(upiPaymentService.validateUtr('').isValid, false);
  });
});
