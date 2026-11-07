/**
 * cloudClient.ts
 * Dual-Path Cloud Failover Client for Sheriyakam Kerala.
 * 
 * Provides fault-tolerant booking submission with zero cold-start lag:
 * 1. Primary: Vercel Serverless Function (/api/booking) with strict 3500ms timeout
 * 2. Secondary: Cloudflare Workers backup server (auto-switch on timeout/5xx)
 * 3. Last-Resort: Direct Telegram Dispatch Bot webhook + WhatsApp direct booking intent
 */

import { fetchWithTimeout, TimeoutError } from './fetchWithTimeout';

export interface BookingItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
}

export interface BookingPayload {
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

export interface BookingResult {
  success: boolean;
  jobId: string;
  source: 'primary' | 'backup_worker' | 'emergency_fallback';
  message: string;
  data?: any;
  whatsappUrl?: string;
}

// Configuration endpoints
const PRIMARY_ENDPOINT = '/api/booking';
const BACKUP_WORKER_URL = 
  process.env.NEXT_PUBLIC_BACKUP_WORKER_URL || 
  process.env.EXPO_PUBLIC_BACKUP_WORKER_URL || 
  'https://sheriyakam-backup.workers.dev/api/booking';

// Server environment variables (used if running in server-side Next.js context)
// Client bundles will NOT expose telegram bot tokens to the browser.
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const DISPATCH_WHATSAPP_PHONE = '919447128901';

/**
 * Generates an alphanumeric human-readable Job ID (e.g. SHK-4829).
 */
export function generateJobId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SHK-${randomSuffix}`;
}

/**
 * Formats structured booking details into a WhatsApp message.
 */
export function buildWhatsAppBookingMessage(payload: BookingPayload, jobId: string): string {
  const cleanPhone = payload.customerPhone.replace(/\D/g, '').slice(-10);
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

/**
 * Fires a direct client-side Telegram dispatch webhook in case both cloud APIs are down.
 */
async function sendEmergencyTelegramAlert(payload: BookingPayload, jobId: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return false;
  }

  const cleanPhone = payload.customerPhone.replace(/\D/g, '').slice(-10);
  const text = `🚨 *SHERIYAKAM EMERGENCY FAILOVER DISPATCH*\n` +
    `*Job ID:* \`${jobId}\`\n` +
    `*Customer:* ${payload.customerName}\n` +
    `*Phone:* \`+91${cleanPhone}\`\n` +
    `*Area:* ${payload.area || payload.address} (${payload.pinCode})\n` +
    `*Total:* ₹${payload.totalPrice}\n` +
    `*Services:* ${(payload.items || []).map(i => `${i.title} (x${i.quantity})`).join(', ')}\n\n` +
    `📞 [Call Customer](tel:+91${cleanPhone})\n` +
    `💬 [Open WhatsApp](https://wa.me/91${cleanPhone})`;

  try {
    const res = await fetchWithTimeout(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      timeoutMs: 3000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudClient] Emergency Telegram alert error:', err);
    return false;
  }
}

/**
 * Submits customer booking with multi-tier automatic failover:
 * Primary (Vercel 3.5s timeout) -> Backup (Cloudflare Worker) -> Last-Resort Emergency
 */
export async function submitBookingWithFailover(payload: BookingPayload): Promise<BookingResult> {
  const jobId = generateJobId();
  const enhancedPayload = {
    ...payload,
    jobId,
    timestamp: new Date().toISOString(),
  };

  // ─────────────────────────────────────────────────────────────
  // PATH 1: Primary Vercel Serverless API (3500ms strict timeout)
  // ─────────────────────────────────────────────────────────────
  try {
    const primaryRes = await fetchWithTimeout(PRIMARY_ENDPOINT, {
      method: 'POST',
      timeoutMs: 3500,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(enhancedPayload),
    });

    if (primaryRes.ok) {
      const data = await primaryRes.json();
      return {
        success: true,
        jobId: data.jobId || jobId,
        source: 'primary',
        message: 'Booking confirmed via primary cloud server',
        data,
      };
    }

    // If server returned 4xx client validation error, return it immediately without failover
    if (primaryRes.status >= 400 && primaryRes.status < 500) {
      const errData = await primaryRes.json().catch(() => ({}));
      return {
        success: false,
        jobId,
        source: 'primary',
        message: errData.message || `Validation error (${primaryRes.status})`,
      };
    }

    console.warn(`[CloudClient] Primary endpoint returned status ${primaryRes.status}. Switching to backup...`);
  } catch (primaryErr: any) {
    if (primaryErr instanceof TimeoutError) {
      console.warn('[CloudClient] Primary endpoint timed out (3500ms). Auto-switching to backup worker...');
    } else {
      console.warn('[CloudClient] Primary endpoint unreachable:', primaryErr?.message || primaryErr);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PATH 2: Auto-Switch Backup Server (Cloudflare Workers)
  // ─────────────────────────────────────────────────────────────
  if (BACKUP_WORKER_URL && !BACKUP_WORKER_URL.includes('your-subdomain')) {
    try {
      const backupRes = await fetchWithTimeout(BACKUP_WORKER_URL, {
        method: 'POST',
        timeoutMs: 4000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(enhancedPayload),
      });

      if (backupRes.ok) {
        const data = await backupRes.json();
        return {
          success: true,
          jobId: data.jobId || jobId,
          source: 'backup_worker',
          message: 'Booking confirmed via backup cloud worker',
          data,
        };
      }
      console.warn(`[CloudClient] Backup worker returned status ${backupRes.status}. Engaging emergency fallback...`);
    } catch (backupErr) {
      console.warn('[CloudClient] Backup worker failed or timed out:', backupErr);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PATH 3: Last-Resort Emergency Fallback (Telegram + WhatsApp)
  // ─────────────────────────────────────────────────────────────
  console.info('[CloudClient] Activating last-resort direct emergency dispatch...');

  // 1. Direct Telegram dispatch in background
  sendEmergencyTelegramAlert(enhancedPayload, jobId).catch(() => {});

  // 2. Pre-filled WhatsApp intent
  const waMessage = buildWhatsAppBookingMessage(enhancedPayload, jobId);
  const waUrl = `https://wa.me/${DISPATCH_WHATSAPP_PHONE}?text=${encodeURIComponent(waMessage)}`;

  // Automatically attempt opening WhatsApp if in browser
  if (typeof window !== 'undefined' && window.open) {
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Pop-up blockers may intercept, returned URL ensures user can tap to proceed
    }
  }

  return {
    success: true,
    jobId,
    source: 'emergency_fallback',
    message: 'Booking routed to Thalassery dispatch desk via direct emergency channel',
    whatsappUrl: waUrl,
    data: {
      jobId,
      customerName: payload.customerName,
      phone: payload.customerPhone,
      totalPrice: payload.totalPrice,
      dispatchedVia: 'WhatsApp Direct + Telegram PBX',
    },
  };
}
