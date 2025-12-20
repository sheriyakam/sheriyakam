# Deploy to Vercel (Alternative to Netlify)

## Why Vercel?
- ✅ 100% Free for personal projects
- ✅ Unlimited bandwidth
- ✅ Auto-deploy from GitHub
- ✅ Fast global CDN
- ✅ Easy setup

---

## Quick Deploy to Vercel

### Method 1: Via Vercel Website (Easiest)

1. **Go to**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository:
   - Select "sheriyakam/sheriyakam"
5. **Configure**:
   - Framework Preset: **Other**
   - Build Command: `npx expo export -p web`
   - Output Directory: `dist`
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. You'll get a URL: `https://sheriyakam.vercel.app`

---

### Method 2: Via Command Line

```bash
npx vercel --prod
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: **sheriyakam**
- Directory: **.**
- Override settings: **Y**
  - Build Command: `npx expo export -p web`
  - Output Directory: `dist`

---

## After Deployment

### Add Domain to Firebase:

1. Copy your Vercel URL (e.g., `sheriyakam.vercel.app`)
2. Go to Firebase Console → Authentication → Settings
3. Authorized domains → Add domain
4. Paste: `sheriyakam.vercel.app`
5. Click Add

---

## Vercel vs Netlify

| Feature | Netlify Free | Vercel Free |
|---------|-------------|-------------|
| Bandwidth | 100GB/month | **Unlimited** |
| Build minutes | 300/month | 6000/month |
| Sites | Unlimited | Unlimited |
| Custom domains | ✅ | ✅ |
| Auto-deploy | ✅ | ✅ |

**Vercel is better for high-traffic sites!**

---

## Your Code is Ready!

All your code is already on GitHub:
- ✅ Firebase Google Sign-In
- ✅ Login verification on booking
- ✅ Fresh interface for new users
- ✅ All features working

Just need to deploy to Vercel instead of Netlify!

---

## Need Help?

Let me know if you want me to:
- A) Help you fix Netlify limits
- B) Deploy to Vercel instead
- C) Try a different free hosting service
