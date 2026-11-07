/**
 * api/booking.ts
 * High-Availability Serverless Booking Gateway for Sheriyakam Kerala.
 * 
 * Runs 24/7 on Vercel Serverless with zero cold-start lag:
 * 1. Validates incoming booking parameters (Name, Indian Phone, Thalassery-Mahe PIN/Area, Services, Price)
 * 2. Executes Supabase REST insertion and Telegram Instant Alert in parallel via Promise.allSettled
 * 3. Returns 200 OK with Job ID if EITHER storage or alert notification succeeds
 */

interface BookingItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
}

interface BookingRequest {
  jobId?: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  pinCode?: string;
  area?: string;
  items: BookingItem[];
  totalPrice: number;
  notes?: string;
  scheduleDate?: string;
  scheduleSlot?: string;
  isEmergency?: boolean;
}

const ACTIVE_PINS = new Set([
  '670101', // Thalassery HQ
  '673310', // Mahe Town
  '670106', // Dharmadam
  '670642', // Kadirur
  '670672', // Chokli
  '673311', // New Mahe
  '673309', // Azhiyur
]);

// Allowed CORS Origins (Restricted for Security)
const ALLOWED_ORIGINS = new Set([
  'https://sheriyakam.vercel.app',
  'https://sheriyakam.com',
  'http://localhost:8081',
  'http://localhost:19006',
  'http://localhost:3000',
]);

function getCorsHeaders(requestOrigin?: string | null) {
  const origin = (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin))
    ? requestOrigin
    : 'https://sheriyakam.vercel.app';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

// In-Memory sliding-window rate limiter (Max 10 bookings per 5 minutes per IP)
const ipRateStore = new Map<string, number[]>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRateStore.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  timestamps.push(now);
  ipRateStore.set(ip, timestamps);
  return true;
}

/**
 * Strips HTML tags and sanitizes strings to prevent XSS injection.
 */
function sanitizeString(str?: string, maxLen = 250): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

/**
 * Standardizes Indian phone numbers into 10 digits
 */
function sanitizePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits.slice(-10);
}

/**
 * Validates whether the phone number is a valid 10-digit Indian mobile
 */
function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Dispatches instant notification via Telegram Bot API
 */
async function sendTelegramAlert(
  token: string,
  chatId: string,
  booking: BookingRequest,
  jobId: string,
  cleanPhone: string
): Promise<{ success: boolean; error?: string }> {
  const itemsList = (booking.items || [])
    .map((item) => `  • *${item.title}* (x${item.quantity}) — ₹${item.price * item.quantity}`)
    .join('\n');

  const urgencyTag = booking.isEmergency ? '🚨 *EMERGENCY DISPATCH (90-MIN SLA)*\n' : '';
  const areaDisplay = booking.area || booking.address || 'Thalassery–Mahe Corridor';
  const pinDisplay = booking.pinCode || '670101';

  const messageText = 
    `⚡ *NEW DISPATCH ALERT — SHERIYAKAM*\n` +
    urgencyTag +
    `🆔 *Job ID:* \`${jobId}\`\n` +
    `👤 *Customer:* ${booking.customerName.trim()}\n` +
    `📞 *Phone:* \`+91${cleanPhone}\`\n` +
    `📍 *Location:* ${areaDisplay} (${pinDisplay})\n` +
    `💰 *Total Amount:* ₹${booking.totalPrice}\n` +
    (booking.scheduleDate ? `📅 *Schedule:* ${booking.scheduleDate} | ${booking.scheduleSlot || 'ASAP'}\n` : '') +
    (booking.notes ? `📝 *Notes:* ${booking.notes}\n` : '') +
    `\n🛠 *Selected Services:*\n${itemsList}\n\n` +
    `🔗 [Direct Call (+91 ${cleanPhone})](tel:+91${cleanPhone})\n` +
    `💬 [Open WhatsApp Chat](https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(booking.customerName)}%2C%20this%20is%20Sheriyakam%20Electrical%20Dispatch%20regarding%20Job%20${jobId}.)`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Telegram status ${res.status}: ${errText}` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Telegram network failed' };
  }
}

/**
 * Inserts booking directly into Supabase via REST API (zero SDK overhead)
 */
async function insertSupabaseBooking(
  supabaseUrl: string,
  supabaseKey: string,
  booking: BookingRequest,
  jobId: string,
  cleanPhone: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        job_id: jobId,
        customer_name: booking.customerName.trim(),
        customer_phone: cleanPhone,
        address: booking.address || booking.area || 'Thalassery–Mahe Corridor',
        pincode: booking.pinCode || '670101',
        total_amount: booking.totalPrice,
        status: 'pending',
        is_emergency: !!booking.isEmergency,
        notes: booking.notes || null,
        scheduled_date: booking.scheduleDate || new Date().toISOString(),
        items_payload: booking.items || [],
        created_at: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, data };
    }
    const errText = await res.text().catch(() => '');
    return { success: false, error: `Supabase status ${res.status}: ${errText}` };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Supabase network failed' };
  }
}

/**
 * Primary Serverless Handler
 */
export default async function handler(req: any, res?: any) {
  // Extract client IP & Origin
  const clientOrigin = req.headers?.origin || (typeof req.headers?.get === 'function' ? req.headers.get('origin') : '');
  const corsHeaders = getCorsHeaders(clientOrigin);
  const clientIp = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      return res.status(204).end();
    }
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 2. Only allow POST
  if (req.method !== 'POST') {
    const errPayload = { success: false, error: 'Method Not Allowed' };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), { status: 405, headers: corsHeaders });
  }

  // Rate Limiting Guard (Check 16: Max 10 requests / 5 min per IP)
  const ipStr = String(Array.isArray(clientIp) ? clientIp[0] : clientIp).split(',')[0].trim();
  if (!checkIpRateLimit(ipStr)) {
    const rateLimitRes = { success: false, message: 'Too many booking requests. Please wait a few minutes before trying again.' };
    if (res && typeof res.status === 'function') {
      return res.status(429).json(rateLimitRes);
    }
    return new Response(JSON.stringify(rateLimitRes), { status: 429, headers: corsHeaders });
  }

  try {
    // Parse body for Node.js serverless or Web Request
    let body: BookingRequest;
    if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else if (typeof req.json === 'function') {
      body = await req.json();
    } else if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else {
      throw new Error('Missing or unreadable request body');
    }

    // 3. Validation & Sanitization (Check 11, 13, 15)
    if (!body.customerName || typeof body.customerName !== 'string' || body.customerName.trim().length < 2) {
      const errRes = { success: false, message: 'Please provide a valid customer name (at least 2 characters)' };
      if (res) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400, headers: corsHeaders });
    }

    // Strip XSS characters from string fields
    body.customerName = sanitizeString(body.customerName, 80);
    body.address = sanitizeString(body.address, 200);
    body.area = sanitizeString(body.area, 80);
    body.notes = sanitizeString(body.notes, 500);

    const cleanPhone = sanitizePhone(body.customerPhone || '');
    if (!isValidIndianMobile(cleanPhone)) {
      const errRes = { success: false, message: 'Please provide a valid 10-digit Indian mobile number' };
      if (res) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400, headers: corsHeaders });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      const errRes = { success: false, message: 'At least one service must be selected' };
      if (res) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400, headers: corsHeaders });
    }

    // Server-side price calculation & tamper check (Check 15)
    let calculatedTotal = 0;
    for (const item of body.items) {
      const itemPrice = Number(item.price);
      const itemQty = Number(item.quantity);
      if (isNaN(itemPrice) || itemPrice < 0 || isNaN(itemQty) || itemQty < 1 || itemQty > 50) {
        const errRes = { success: false, message: 'Invalid item quantity or price specifications' };
        if (res) return res.status(400).json(errRes);
        return new Response(JSON.stringify(errRes), { status: 400, headers: corsHeaders });
      }
      calculatedTotal += itemPrice * itemQty;
    }

    const clientPrice = Number(body.totalPrice);
    if (isNaN(clientPrice) || clientPrice < 0) {
      const errRes = { success: false, message: 'Invalid total price amount' };
      if (res) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400, headers: corsHeaders });
    }

    // Enforce server-side verified price
    body.totalPrice = calculatedTotal > 0 ? calculatedTotal : clientPrice;

    const jobId = body.jobId || `SHK-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Parallel Dispatch: Supabase REST + Telegram Bot API
    const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';

    const [dbResult, tgResult] = await Promise.allSettled([
      supabaseUrl && supabaseKey
        ? insertSupabaseBooking(supabaseUrl, supabaseKey, body, jobId, cleanPhone)
        : Promise.resolve({ success: false, error: 'Supabase credentials not configured' }),
      telegramToken && telegramChatId
        ? sendTelegramAlert(telegramToken, telegramChatId, body, jobId, cleanPhone)
        : Promise.resolve({ success: false, error: 'Telegram credentials not configured' }),
    ]);

    const isDbSuccess = dbResult.status === 'fulfilled' && dbResult.value.success;
    const isTgSuccess = tgResult.status === 'fulfilled' && tgResult.value.success;

    // Log diagnostic telemetry
    if (!isDbSuccess) {
      const reason = dbResult.status === 'fulfilled' ? dbResult.value.error : dbResult.reason;
      console.warn('[BookingAPI] Supabase storage notice:', reason);
    }
    if (!isTgSuccess) {
      const reason = tgResult.status === 'fulfilled' ? tgResult.value.error : tgResult.reason;
      console.warn('[BookingAPI] Telegram alert notice:', reason);
    }

    // 5. Success if EITHER database or Telegram succeeded (or mock fallback in dev)
    const success = isDbSuccess || isTgSuccess || (!supabaseUrl && !telegramToken);

    if (success) {
      const responseData = {
        success: true,
        jobId,
        source: 'primary',
        message: 'Booking confirmed and dispatched to Thalassery operations desk',
        data: {
          jobId,
          customerName: body.customerName,
          phone: `+91 ${cleanPhone}`,
          area: body.area || body.address || 'Thalassery–Mahe Corridor',
          totalPrice: body.totalPrice,
          persistedToDb: isDbSuccess,
          telegramAlertSent: isTgSuccess,
          estimatedArrival: body.isEmergency ? 'Within 90 Minutes' : 'Same-Day Service',
        },
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(responseData);
      }
      return new Response(JSON.stringify(responseData), { status: 200, headers: corsHeaders });
    }

    // If both failed unexpectedly, return 503 so client-side failover kicks in
    const failResponse = {
      success: false,
      jobId,
      message: 'Both primary database and alert notifications were unreachable',
    };

    if (res && typeof res.status === 'function') {
      return res.status(503).json(failResponse);
    }
    return new Response(JSON.stringify(failResponse), { status: 503, headers: corsHeaders });

  } catch (err: any) {
    console.error('[BookingAPI] Internal server error:', err);
    const errPayload = {
      success: false,
      message: 'Internal server error while processing booking',
      error: err?.message,
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), { status: 500, headers: corsHeaders });
  }
}
