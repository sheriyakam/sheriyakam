# Deploy Sheriyakam to Vercel - Step by Step

## ✅ Your Code is Ready!

Everything is already on GitHub and configured. Just need to deploy to Vercel!

---

## 🚀 Method 1: Deploy via Vercel Website (Easiest - 2 minutes)

### Step 1: Go to Vercel
Open: **https://vercel.com/**

### Step 2: Sign Up / Log In
- Click **"Sign Up"** (or "Log in")
- Choose **"Continue with GitHub"**
- Authorize Vercel to access your GitHub

### Step 3: Create New Project
- Click **"Add New..."** → **"Project"**
- You'll see your GitHub repositories

### Step 4: Import Repository
- Find and click **"sheriyakam"** repository
- Click **"Import"**

### Step 5: Configure Project
Vercel will auto-detect settings, but verify:

**Project Name:** `sheriyakam`

**Framework Preset:** Other (or leave as detected)

**Root Directory:** `./` (leave as is)

**Build Settings:**
- **Build Command:** `npx expo export -p web`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 6: Deploy!
- Click **"Deploy"**
- Wait 2-3 minutes for build to complete
- You'll get a URL: `https://sheriyakam.vercel.app`

---

## 🚀 Method 2: Deploy via Command Line (Advanced)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```
Enter your email and verify.

### Step 3: Deploy
```bash
cd C:\Users\zanja\Desktop\sheriyakam
vercel --prod
```

Follow prompts:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: **sheriyakam**
- Directory: **.** (current)
- Override settings: **Y**
  - Build Command: `npx expo export -p web`
  - Output Directory: `dist`
  - Development Command: `npx expo start --web`

---

## 📋 After Deployment

### 1. Get Your URL
You'll receive a URL like:
- `https://sheriyakam.vercel.app`
- Or `https://sheriyakam-xyz123.vercel.app`

### 2. Add to Firebase Authorized Domains

**Important!** Add your Vercel URL to Firebase:

1. Go to: https://console.firebase.google.com/
2. Select **Sheriyakam** project
3. Click **Authentication** → **Settings** tab
4. Scroll to **"Authorized domains"**
5. Click **"Add domain"**
6. Enter: `sheriyakam.vercel.app` (your actual URL, without https://)
7. Click **"Add"**

### 3. Test Your Site!

Visit your Vercel URL and test:
- ✅ Site loads
- ✅ Google Sign-In works
- ✅ Can create bookings
- ✅ All features working

---

## 🔄 Automatic Deployments

**Great news!** Now every time you push to GitHub:

```bash
git add .
git commit -m "your changes"
git push origin master
```

Vercel will **automatically**:
1. Detect the push
2. Build your app
3. Deploy updates
4. Your site is updated in 2-3 minutes!

---

## 🎨 Custom Domain (Optional)

Want `sheriyakam.com` instead of `sheriyakam.vercel.app`?

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records (Vercel will show you how)

---

## 📊 Vercel Dashboard

Access your dashboard at: https://vercel.com/dashboard

You can:
- ✅ View deployments
- ✅ Check build logs
- ✅ Monitor analytics
- ✅ Manage domains
- ✅ Rollback to previous versions

---

## 🆘 Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Make sure `vercel.json` is committed
- Verify build command: `npx expo export -p web`

### Google Sign-In Not Working?
- Make sure you added Vercel domain to Firebase Authorized domains
- Domain should match exactly (no https://, no trailing slash)

### Site Not Loading?
- Check if build completed successfully
- Look for errors in Vercel deployment logs

---

## ✅ Summary

**What You Get with Vercel:**
- ✅ Unlimited bandwidth (no limits!)
- ✅ Free forever
- ✅ Auto-deploy from GitHub
- ✅ Fast global CDN
- ✅ Free SSL/HTTPS
- ✅ Analytics included

**Your app is production-ready!** 🎉

---

## 🎯 Next Steps

1. **Deploy to Vercel** (follow steps above)
2. **Add domain to Firebase** (for Google Sign-In)
3. **Test everything** (login, booking, etc.)
4. **Share your site!** 🚀

---

**Need help? Let me know which method you want to use!**
