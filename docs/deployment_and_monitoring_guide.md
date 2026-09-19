# Sheriyakam: Deployment, Monitoring & Rollback SOP

This guide provides step-by-step procedures for error monitoring, pre-deploy verification, uptime checks, and instant rollback on Vercel.

---

## 1. Sentry Error Monitoring & Alert Setup

### How Error Monitoring Works
- The site includes a lightweight Sentry integration (`services/sentry.js`) and `<SectionErrorBoundary>` component wrappers.
- Any uncaught runtime exception, unhandled promise rejection, or component crash is automatically transmitted to your Sentry dashboard.

### Connecting Your Free Sentry Project
1. Create a free account at [sentry.io](https://sentry.io).
2. Create a new Project (select **React** or **JavaScript**).
3. Copy the **DSN** (e.g. `https://xxxxxx@o123456.ingest.sentry.io/78910`).
4. In your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables**:
   - Variable Name: `EXPO_PUBLIC_SENTRY_DSN`
   - Value: `https://xxxxxx@o123456.ingest.sentry.io/78910`
   - Environment: Production, Preview, Development.
5. Redeploy.

### Setting Up Instant Alerts (Email / WhatsApp / Slack)
1. In Sentry: Go to **Alerts** -> **Create Alert Rule**.
2. Trigger: *"A new issue is created"* (alerts on any previously unseen error type).
3. Actions: Add **Send notification to Email** (or connect Slack webhook / PagerDuty).

---

## 2. Free Uptime Monitoring (UptimeRobot)

Catches network, domain, or hosting downtime (different failure mode than a JS crash):
1. Sign up for free at [uptimerobot.com](https://uptimerobot.com).
2. Click **+ Add New Monitor**:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Sheriyakam Web Production`
   - URL: `https://sheriyakam.vercel.app`
   - Monitoring Interval: `5 minutes`
3. Select your Alert Contact (Email / SMS / WhatsApp webhook).
4. Save Monitor. You will receive an immediate notification if the server is unreachable.

---

## 3. Vercel Staging & Preview Workflow

### Automatic Preview URLs
- Every push to any non-master branch (or Pull Request) automatically generates a dedicated, isolated Preview URL on Vercel (e.g., `https://sheriyakam-git-feature-xxxx.vercel.app`).

### Pre-Deploy 3-Minute Manual Checklist
Before promoting any change to `master` (production):
1. Run local verification: `npm run lint` and `npx expo export -p web`.
2. Load the Preview URL on your mobile phone or desktop browser.
3. Test the core user flow:
   - Click "What's the problem? — Book Now".
   - Select a service (e.g. Fan repair) -> Select location -> Enter phone -> Submit.
   - Verify WhatsApp opens with prefilled lead details.
   - Open `/admin/manual-dispatch` -> Enter PIN `1998` -> Confirm booking is listed.

---

## 4. 3-Click Instant Rollback in Vercel

If a bug is discovered on production, roll back in under 60 seconds without writing code:
1. Open the [Vercel Dashboard](https://vercel.com/dashboard) and click on **sheriyakam**.
2. Go to the **Deployments** tab.
3. Find the previous stable deployment in the list (look for the green checkmark and previous commit message).
4. Click the three dots `...` on that deployment -> Click **Promote to Production** (or **Rollback**).
5. Vercel instantly routes 100% of live traffic back to the working build within 5 seconds.
