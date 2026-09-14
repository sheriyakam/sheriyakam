# Deploy to Vercel

## Why Vercel?
- ✅ 100% Free for production deployments
- ✅ Unlimited bandwidth & fast global Edge CDN
- ✅ Automated continuous deployment from GitHub master branch
- ✅ Native clean URL routing & zero-config SSL

---

## Quick Deploy to Vercel

### Method 1: Via Vercel Website (Recommended)

1. **Go to**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository:
   - Select `sheriyakam/sheriyakam`
5. **Configure**:
   - Framework Preset: **Other**
   - Build Command: `npx expo export -p web`
   - Output Directory: `dist`
6. Click **"Deploy"**
7. Your app is live at: `https://sheriyakam.vercel.app`

---

### Method 2: Via Vercel CLI

```bash
npx vercel --prod
```

Settings:
- Build Command: `npx expo export -p web`
- Output Directory: `dist`

---

## After Deployment

### Add Domain to Firebase:
1. Copy your Vercel URL (`sheriyakam.vercel.app`)
2. Go to Firebase Console → Authentication → Settings
3. Authorized domains → Add domain
4. Paste: `sheriyakam.vercel.app`
5. Click Save
