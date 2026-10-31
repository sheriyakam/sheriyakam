/**
 * api/cron-keepalive.ts
 * Anti-Sleep Cron Heartbeat for Sheriyakam Kerala.
 * 
 * Scheduled to run every morning at 8:00 AM via Vercel Crons:
 * 1. Pings the cloud database (Supabase REST) to prevent automatic 7-day free tier pausing
 * 2. Pings the secondary Cloudflare Worker backup server to eliminate cold-start latency
 * 3. Returns diagnostic status and system telemetry
 */

export default async function handler(req: any, res?: any) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(204).end();
    }
    return new Response(null, { status: 204, headers });
  }

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

  const backupWorkerUrl = 
    process.env.NEXT_PUBLIC_BACKUP_WORKER_URL || 
    process.env.EXPO_PUBLIC_BACKUP_WORKER_URL || 
    '';

  const diagnostics: Record<string, any> = {
    supabase: 'skipped',
    backupWorker: 'skipped',
  };

  // 1. Keep Supabase active via lightweight REST request
  if (supabaseUrl && supabaseKey) {
    try {
      const cleanUrl = supabaseUrl.replace(/\/+$/, '');
      const dbRes = await fetch(`${cleanUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      diagnostics.supabase = dbRes.ok || dbRes.status === 200 ? 'active' : `status_${dbRes.status}`;
    } catch (err: any) {
      diagnostics.supabase = `error: ${err?.message || 'unreachable'}`;
    }
  }

  // 2. Keep Cloudflare Worker warm if configured
  if (backupWorkerUrl && !backupWorkerUrl.includes('your-subdomain')) {
    try {
      const workerRes = await fetch(backupWorkerUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      diagnostics.backupWorker = workerRes.ok ? 'active' : `status_${workerRes.status}`;
    } catch (err: any) {
      diagnostics.backupWorker = `error: ${err?.message || 'unreachable'}`;
    }
  }

  const durationMs = Date.now() - startTime;

  const payload = {
    status: 'alive',
    timestamp,
    executionTimeMs: durationMs,
    diagnostics,
    message: 'Sheriyakam 24/7 cloud infrastructure keepalive heartbeat executed successfully',
  };

  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  return new Response(JSON.stringify(payload), { status: 200, headers });
}
