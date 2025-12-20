# How to Remove/Delete Project from Vercel

## Method 1: Via Vercel Dashboard (Recommended)

### Steps:
1. Go to: https://vercel.com/dashboard
2. Sign in to your account
3. Find your **"sheriyakam"** project in the list
4. Click on the project name
5. Click **"Settings"** (in the top navigation)
6. Scroll all the way down to **"Delete Project"** section
7. Click **"Delete"** button
8. Type the project name to confirm: `sheriyakam`
9. Click **"Delete"** to confirm

### What gets deleted:
- All deployments (including production)
- All preview deployments
- All environment variables
- All domain configurations
- The entire project from Vercel

---

## Method 2: Via Vercel CLI

If you prefer using the command line:

```bash
npx vercel remove sheriyakam --yes
```

---

## After Deletion

### Clean up local files (optional):
You can delete the `.vercel` folder from your project:
```
C:\Users\zanja\Desktop\sheriyakam\.vercel
```

This folder contains Vercel deployment configuration. It's safe to delete.

---

## What to do next:

Since you're moving to Netlify:
1. ✅ Delete from Vercel (using steps above)
2. 🚀 Deploy to Netlify (using DEPLOY_TO_NETLIFY.md guide)
3. 🔧 Update Firebase Authorized Domains:
   - Remove: `sheriyakam-sooty.vercel.app`
   - Add: Your new Netlify domain

---

## Need help?
Let me know once you've deleted it from Vercel, and I'll help you complete the Netlify deployment!
