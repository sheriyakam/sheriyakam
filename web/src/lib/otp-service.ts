import crypto from 'crypto';

interface StoredOtpSession {
  phone: string;
  otpHash: string;
  attempts: number;
  sendCount: number;
  lastSentAt: number;
  expiresAt: number;
  verified: boolean;
  token?: string;
}

// In-memory token bucket session store (In production, replace with Redis or Supabase)
const otpStore = new Map<string, StoredOtpSession>();

// Secret key for HMAC signature
const OTP_SECRET = process.env.OTP_SECRET || 'sheriyakam_otp_internal_secret_2026';

export interface OtpProvider {
  sendSms(phone: string, otp: string): Promise<{ success: boolean; error?: string }>;
}

/**
 * Dev fallback provider. Never logs full production secrets.
 */
class DevOtpProvider implements OtpProvider {
  async sendSms(phone: string, otp: string) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[SECURITY] DevOtpProvider invoked in production environment. Refusing delivery.');
      return { success: false, error: 'SMS Provider not configured for production.' };
    }
    console.log(`\n========================================`);
    console.log(`[DEV OTP ONLY] Delivery to +91 ${phone}: ${otp}`);
    console.log(`========================================\n`);
    return { success: true };
  }
}

/**
 * Production SMS Provider Interface (MSG91 / Fast2SMS / Twilio)
 */
class Msg91Provider implements OtpProvider {
  private authKey: string;
  private templateId: string;

  constructor(authKey: string, templateId: string) {
    this.authKey = authKey;
    this.templateId = templateId;
  }

  async sendSms(phone: string, otp: string) {
    try {
      const res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${this.templateId}&mobile=91${phone}&authkey=${this.authKey}&otp=${otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return { success: data.type === 'success', error: data.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

function getProvider(): OtpProvider {
  const msg91Key = process.env.MSG91_AUTH_KEY;
  const msg91Template = process.env.MSG91_TEMPLATE_ID;

  if (msg91Key && msg91Template) {
    return new Msg91Provider(msg91Key, msg91Template);
  }

  return new DevOtpProvider();
}

function hashOtp(phone: string, otp: string): string {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${phone}:${otp}`)
    .digest('hex');
}

export function validateIndianPhone(phone: string): { valid: boolean; formatted: string } {
  const clean = (phone || '').replace(/\D/g, '');
  const tenDigit = clean.length === 12 && clean.startsWith('91') 
    ? clean.substring(2) 
    : clean.length === 11 && clean.startsWith('0')
    ? clean.substring(1)
    : clean;

  const isValid = /^[6-9]\d{9}$/.test(tenDigit);
  return { valid: isValid, formatted: tenDigit };
}

export async function requestOtp(rawPhone: string): Promise<{
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  devOtpHint?: string;
}> {
  const { valid, formatted: phone } = validateIndianPhone(rawPhone);
  if (!valid) {
    return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  const now = Date.now();
  const existing = otpStore.get(phone);

  // Rate Limiting: Max 3 sends per 15 minutes
  if (existing && existing.sendCount >= 3 && now - existing.lastSentAt < 15 * 60 * 1000) {
    const waitMin = Math.ceil((15 * 60 * 1000 - (now - existing.lastSentAt)) / 60000);
    return {
      success: false,
      message: `Too many OTP requests. Please wait ${waitMin} minutes before trying again.`
    };
  }

  // Cooldown: 45 seconds between consecutive sends
  if (existing && now - existing.lastSentAt < 45 * 1000) {
    const remaining = Math.ceil((45 * 1000 - (now - existing.lastSentAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining}s before requesting a new OTP.`,
      cooldownSeconds: remaining
    };
  }

  // Generate cryptographic 6-digit numeric code (e.g. 100000 to 999999)
  const otpNumber = crypto.randomInt(100000, 999999).toString();
  const otpHash = hashOtp(phone, otpNumber);

  const session: StoredOtpSession = {
    phone,
    otpHash,
    attempts: 0,
    sendCount: existing ? existing.sendCount + 1 : 1,
    lastSentAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5 minute TTL
    verified: false
  };

  otpStore.set(phone, session);

  const provider = getProvider();
  const delivery = await provider.sendSms(phone, otpNumber);

  if (!delivery.success && process.env.NODE_ENV === 'production') {
    return { success: false, message: 'Failed to deliver SMS. Please try again later.' };
  }

  return {
    success: true,
    message: 'OTP sent successfully to +91 ' + phone,
    cooldownSeconds: 45,
    // Dev only hint when in development environment
    devOtpHint: process.env.NODE_ENV !== 'production' ? otpNumber : undefined
  };
}

export function verifyOtp(rawPhone: string, inputOtp: string): {
  success: boolean;
  message: string;
  token?: string;
} {
  const { valid, formatted: phone } = validateIndianPhone(rawPhone);
  if (!valid) {
    return { success: false, message: 'Invalid phone number format.' };
  }

  const cleanOtp = (inputOtp || '').trim().replace(/\D/g, '');
  if (cleanOtp.length !== 6) {
    return { success: false, message: 'OTP must be a 6-digit number.' };
  }

  const session = otpStore.get(phone);
  if (!session) {
    return { success: false, message: 'No active OTP request found. Please request a new OTP.' };
  }

  const now = Date.now();
  if (now > session.expiresAt) {
    otpStore.delete(phone);
    return { success: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (session.attempts >= 3) {
    otpStore.delete(phone);
    return { success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' };
  }

  const expectedHash = hashOtp(phone, cleanOtp);
  if (expectedHash !== session.otpHash) {
    session.attempts += 1;
    const remaining = 3 - session.attempts;
    return {
      success: false,
      message: remaining > 0 ? `Incorrect OTP. ${remaining} attempts remaining.` : 'Incorrect OTP. Session expired.'
    };
  }

  // Mark verified & generate token
  const token = crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${phone}:${now}:verified`)
    .digest('hex');

  session.verified = true;
  session.token = token;

  return {
    success: true,
    message: 'Phone number verified successfully.',
    token
  };
}

export function isPhoneVerified(phone: string, token: string): boolean {
  const { valid, formatted } = validateIndianPhone(phone);
  if (!valid || !token) return false;

  const session = otpStore.get(formatted);
  if (!session || !session.verified || session.token !== token) return false;

  // Verification token valid for 1 hour
  return Date.now() - session.lastSentAt < 60 * 60 * 1000;
}
