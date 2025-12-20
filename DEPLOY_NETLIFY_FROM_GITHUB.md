# Deploy to Netlify from GitHub - Complete Guide

## ✅ Your code is now on GitHub!
Repository: https://github.com/sheriyakam/sheriyakam

---

## 🚀 Deploy to Netlify (3 Easy Steps)

### **Step 1: Go to Netlify**
Visit: https://app.netlify.com/

- Click **"Sign up"** (or "Log in" if you have an account)
- Choose **"Sign up with GitHub"** for easy integration

---

### **Step 2: Import Your Project**

1. Click **"Add new site"** button
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub (if first time)
5. Find and select **"sheriyakam/sheriyakam"** repository
6. Click on it

---

### **Step 3: Configure Build Settings**

You'll see a configuration screen. Enter these settings:

**Build Settings:**
- **Branch to deploy**: `master`
- **Build command**: `npx expo export -p web`
- **Publish directory**: `dist`

**Advanced Settings (Optional):**
- Click "Show advanced" if you want to add environment variables
- You can add Firebase config as environment variables for extra security

Then click **"Deploy site"**

---

## ⏳ Wait for Deployment

Netlify will:
1. Clone your repository
2. Run the build command
3. Deploy the `dist` folder
4. Give you a URL

**This takes about 2-3 minutes.**

---

## 🎉 You'll Get a URL

Netlify will assign a URL like:
- `https://random-name-123456.netlify.app`

You can customize it:
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `sheriyakam` (if available)
4. Your URL becomes: `https://sheriyakam.netlify.app`

---

## 🔧 Final Step: Add to Firebase

1. Copy your Netlify URL (without `https://`)
   - Example: `sheriyakam.netlify.app`

2. Go to Firebase Console → **Authentication** → **Settings**

3. Scroll to **"Authorized domains"**

4. Click **"Add domain"**

5. Paste: `sheriyakam.netlify.app` (or your custom name)

6. Click **"Add"**

---

## ✅ Test Everything

1. Visit your Netlify URL
2. Try Google Sign-In
3. Create a booking
4. Check "My Bookings" - should be empty for new users!

---

## 🔄 Automatic Deployments

**Good news!** Now whenever you push to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin master
```

Netlify will **automatically rebuild and deploy** your site!

---

## 📊 What's New in This Update:

✅ **Fresh Start for New Users**
- New customers see empty "My Bookings" page
- No mock data shown to new registrations
- Clean, professional first impression

✅ **Google Sign-In Working**
- Real Firebase authentication
- Gets user's actual Google profile

✅ **Pull-to-Refresh**
- Swipe down on bookings to refresh

✅ **Input Validation**
- Email and phone number validation on signup

---

## Need Help?

If deployment fails:
1. Check the Netlify deploy logs
2. Make sure build command is correct
3. Verify the `dist` folder is being created

**Let me know when your site is live on Netlify!** 🎊
