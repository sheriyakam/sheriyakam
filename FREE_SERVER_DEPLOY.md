# Quick Deploy to Netlify (Free Server)

## Method 1: Netlify Drop (Easiest - No Installation)

### Step 1: Build Your App
Open Command Prompt (not PowerShell):
```
cd C:\Users\zanja\Desktop\sheriyakam
npx expo export -p web
```

### Step 2: Deploy
1. Go to: https://app.netlify.com/drop
2. Sign up/Login (free account)
3. Drag the **`dist`** folder from your project
4. Done! You get a free URL instantly

---

## Method 2: Netlify via GitHub (Automatic Updates)

### Already Done! ✅
Your code is on GitHub: https://github.com/sheriyakam/sheriyakam

### Deploy Steps:
1. Go to: https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select "sheriyakam/sheriyakam"
5. Settings:
   - Build: `npx expo export -p web`
   - Publish: `dist`
6. Click "Deploy"

**Benefit**: Every GitHub push auto-deploys!

---

## Alternative Free Servers

### Option A: Vercel (Also Free)
```
npx vercel --prod
```
- Free tier: Unlimited bandwidth
- Auto HTTPS
- Fast CDN

### Option B: Firebase Hosting (Free)
```
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```
- Free tier: 10GB storage, 360MB/day
- Google infrastructure

### Option C: GitHub Pages (Free)
- Free static hosting
- yourname.github.io/sheriyakam

---

## Recommended: Netlify

**Why Netlify?**
- ✅ 100% Free for your use case
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy from GitHub
- ✅ Easy custom domains
- ✅ 100GB bandwidth/month (more than enough)

**Your app will be at:**
`https://sheriyakam.netlify.app` (or similar)

---

## Quick Start (Right Now!)

### Option 1: Drag & Drop (2 minutes)
```cmd
cd C:\Users\zanja\Desktop\sheriyakam
npx expo export -p web
```
Then go to https://app.netlify.com/drop and drag the `dist` folder

### Option 2: GitHub Integration (5 minutes)
1. https://app.netlify.com/
2. "Import from GitHub"
3. Select your repo
4. Deploy!

---

## After Deployment

### Add to Firebase:
1. Get your Netlify URL
2. Firebase Console → Authentication → Settings
3. Add domain to "Authorized domains"

### Test:
1. Visit your Netlify URL
2. Try Google Sign-In
3. Create a booking
4. Everything should work!

---

## Need Help?

Tell me which method you want to use:
- **A**: Drag & Drop (fastest)
- **B**: GitHub integration (best long-term)
- **C**: Different free server

I'll guide you step-by-step!
