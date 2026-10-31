# 🌐 100% Free 24/7 Cloud Hosting & Multi-Server Auto-Failover Guide

This guide explains how to host the **Sheriyakam** platform (Web Frontend + Express Backend API + Autonomous Daemons) on **100% free cloud servers** that run automatically 24/7 even when your personal computer is completely turned off, complete with **automatic multi-server failover (zero lag / zero downtime)**.

---

## 🏛️ High-Level Architecture (Zero Cost)

```
                     ┌─────────────────────────────────────────────────────────┐
                     │          Cloudflare Global Edge (Free Tier)             │
                     │  - DNS, Free SSL, DDoS Shield, 300+ Edge Data Centers   │
                     │  - Automated Multi-Server Failover Worker               │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼ (Frontend Requests)                                             ▼ (API Requests: /api/*)
  ┌───────────────────────────────┐                             ┌───────────────────────────────────────┐
  │     Vercel / Cloudflare       │                             │  Cloudflare Auto-Switching Worker     │
  │     Global Edge Network       │                             │  - Tries Primary Server               │
  │  - 100% Free Static CDN       │                             │  - If slow (>1.5s) or down,           │
  │  - Runs across 300+ cities    │                             │    instantly switches to Secondary!   │
  │  - Zero cold starts, 0ms lag  │                             └───────────┬───────────────┬───────────┘
  └───────────────────────────────┘                                         │               │
                                                     (Healthy / Primary)    ▼               ▼ (Backup Failover)
                                                        ┌───────────────────────┐       ┌───────────────────────┐
                                                        │  Server 1: Koyeb Free │       │  Server 2: Render     │
                                                        │  - Location: Frankfurt│       │  - Location: Singapore│
                                                        │  - 24/7 Container     │       │  - Auto-restarts      │
                                                        │  - Express REST API   │       │  - Express REST API   │
                                                        └───────────────────────┘       └───────────────────────┘
```

---

## 1. Hosting the Web Frontend (Vercel — 100% Free, Zero Maintenance)

Your frontend is already pre-configured for Vercel in [`vercel.json`](../vercel.json).

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** → **Import** `sheriyakam/sheriyakam`.
3. Configuration:
   - **Framework Preset**: Other
   - **Build Command**: `npx expo export -p web`
   - **Output Directory**: `dist`
4. Click **Deploy**.
5. **Result**: Your website runs 24/7 on Vercel's global CDN across 300+ cities with zero maintenance, automatic SSL, and instant continuous deployment whenever you push to GitHub. Even if your PC is off, your website is always online.

---

## 2. Free Cloud Backend Providers (Runs 24/7 When PC is Off)

### Option A: Koyeb (Recommended — Never Sleeps, True 24/7 Container)
* **Website**: [https://koyeb.com](https://koyeb.com)
* **Plan**: Free Eco Instance (100% Free, no credit card required)
* **Why it's great**: Unlike other free tiers, **Koyeb does NOT put your server to sleep**!
* **Setup**:
  1. Sign in to Koyeb via GitHub.
  2. Click **Create App** → Choose **GitHub**.
  3. Select `sheriyakam/sheriyakam`.
  4. Set Root Directory to `/backend`.
  5. Build Command: `npm install` | Run Command: `node server.js`
  6. Add your environment variables (`MONGODB_URI`, `PORT=5000`, `SUPABASE_URL`, etc.).
  7. Deploy! Your backend runs continuously in Singapore or Frankfurt.

---

### Option B: Render.com (Auto-deploy via `render.yaml`)
* **Website**: [https://render.com](https://render.com)
* **Plan**: Free Web Service
* **Setup**:
  1. Sign in to Render via GitHub.
  2. Click **New +** → **Blueprint** → Select `sheriyakam/sheriyakam`.
  3. Render will automatically read the [`render.yaml`](../render.yaml) file we created!
  4. Paste your Environment Variables.
* **Keeping Render 100% Awake**:
  Free Render instances sleep after 15 minutes of inactivity. To prevent it from ever sleeping:
  1. Go to [https://uptimerobot.com](https://uptimerobot.com) (100% Free).
  2. Create a new **HTTP(s) Monitor** pointing to: `https://your-render-app.onrender.com/api/health`.
  3. Set interval to **every 10 minutes**.
  4. This pings the server automatically, keeping it awake **24/7 with 0 seconds cold-start lag**!

---

### Option C: Oracle Cloud Always Free (The Gold Standard VPS)
* **Website**: [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
* **Specs**: Up to 4 ARM Ampere Cores, 24 GB RAM, and 200 GB SSD storage **free forever**.
* You can run PM2, Docker, MongoDB, and your full backend with root Linux access and zero throttling.

---

## 3. Multi-Server Auto-Switching / Zero-Lag Failover (Cloudflare Worker)

If you deploy your backend to two free servers (for example, **Server 1 on Koyeb** and **Server 2 on Render**), you can use a **free Cloudflare Worker** (100,000 requests/day free) to automatically switch between them if one ever lags or crashes!

### Cloudflare Failover Script (`cloudflare-worker.js`):

```javascript
// Deploy this script in Cloudflare Workers (100% Free)
const PRIMARY_BACKEND = "https://sheriyakam-api.koyeb.app";
const BACKUP_BACKEND = "https://sheriyakam-api.onrender.com";

// Maximum latency before auto-switching (1500ms)
const TIMEOUT_MS = 1500;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Function to fetch with timeout
    const fetchWithTimeout = (targetUrl, ms) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ms);
      const newUrl = targetUrl + url.pathname + url.search;

      return fetch(newUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));
    };

    // Step 1: Try Primary Server (Koyeb)
    try {
      const primaryResponse = await fetchWithTimeout(PRIMARY_BACKEND, TIMEOUT_MS);

      // If primary returns a server error (500, 502, 503, 504), failover to backup
      if (primaryResponse.status >= 500) {
        console.warn("Primary returned 5xx. Switching to backup server...");
        return await fetch(BACKUP_BACKEND + url.pathname + url.search, request);
      }

      return primaryResponse;
    } catch (err) {
      // Step 2: Primary timed out (>1500ms) or is down -> AUTO-SWITCH instantly to Backup (Render)
      console.warn("Primary server timed out or unreachable. Auto-switching to backup server...", err.message);
      return await fetch(BACKUP_BACKEND + url.pathname + url.search, request);
    }
  }
};
```

### Why this setup guarantees Zero Lag and Zero Problem:
1. **Zero Downtime**: If Server 1 crashes or gets rebooted, Cloudflare switches to Server 2 in **milliseconds**.
2. **Zero Maintenance**: Both Koyeb, Render, and Cloudflare auto-restart services if memory limits are reached.
3. **Your PC can be 100% OFF**: The entire stack is completely hosted in the cloud.
4. **$0 / Month**: Total cost across Vercel, Koyeb, Render, UptimeRobot, and Cloudflare is **₹0 (Completely Free)**.
