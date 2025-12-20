# Deploy Sheriyakam to Netlify via GitHub - Step by Step

## ✅ Prerequisites (Already Done!)
- [x] Code is on GitHub: https://github.com/sheriyakam/sheriyakam
- [x] Firebase configured
- [x] All features working locally

---

## 🚀 Deployment Steps

### **Step 1: Go to Netlify**
Open your browser and visit: **https://app.netlify.com/**

---

### **Step 2: Sign Up / Log In**

**If you don't have an account:**
1. Click **"Sign up"**
2. Choose **"Sign up with GitHub"** (easiest option)
3. Authorize Netlify to access your GitHub
4. You'll be redirected to Netlify dashboard

**If you already have an account:**
1. Click **"Log in"**
2. Enter your credentials

---

### **Step 3: Add New Site**

1. On the Netlify dashboard, click the **"Add new site"** button (top right)
2. Select **"Import an existing project"**

---

### **Step 4: Connect to GitHub**

1. You'll see deployment options - click **"Deploy with GitHub"**
2. If first time, authorize Netlify to access your repositories
3. You'll see a list of your repositories

---

### **Step 5: Select Your Repository**

1. Find **"sheriyakam"** in the list
   - Use the search box if needed
2. Click on **"sheriyakam"** repository

---

### **Step 6: Configure Build Settings**

You'll see a configuration page. Fill in these exact values:

**Owner:** (Your GitHub username - auto-filled)

**Branch to deploy:** `master`

**Build settings:**
- **Base directory:** (leave empty)
- **Build command:** `npx expo export -p web`
- **Publish directory:** `dist`

**Advanced build settings (Optional - click "Show advanced"):**
You can add environment variables here if you want to hide Firebase keys:
- `EXPO_PUBLIC_FIREBASE_API_KEY` = `AIzaSyAYmD6OEI9TwHbU9eu42XA_E7cMCwOf1fg`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` = `sheriyakam-signup.firebaseapp.com`
- etc.

*(Skip this for now - you can add later)*

---

### **Step 7: Deploy!**

1. Review your settings
2. Click **"Deploy sheriyakam"** button (or "Deploy site")
3. Wait for deployment to start

---

### **Step 8: Watch the Build**

You'll see a build log showing:
```
Building...
Running build command: npx expo export -p web
...
Site is live ✓
```

**This takes 2-3 minutes.**

---

### **Step 9: Get Your URL**

Once deployed, you'll see:
- **Site URL:** `https://random-name-123456.netlify.app`

**To customize it:**
1. Click **"Site settings"**
2. Click **"Change site name"** (under Site details)
3. Enter: `sheriyakam` (if available)
4. Click **"Save"**
5. Your URL becomes: `https://sheriyakam.netlify.app`

---

### **Step 10: Add Domain to Firebase**

1. Copy your Netlify URL (without https://)
   - Example: `sheriyakam.netlify.app`

2. Go to **Firebase Console**: https://console.firebase.google.com/

3. Select **Sheriyakam** project

4. Click **Authentication** → **Settings** tab

5. Scroll to **"Authorized domains"**

6. Click **"Add domain"**

7. Paste: `sheriyakam.netlify.app`

8. Click **"Add"**

---

## ✅ Test Your Live Site!

1. Visit your Netlify URL: `https://sheriyakam.netlify.app`

2. **Test Google Sign-In:**
   - Click Login/Signup
   - Click "Continue with Google"
   - Select your account
   - Should work! ✨

3. **Test New User Experience:**
   - Sign up with a new account
   - Go to "My Bookings"
   - Should be empty (fresh interface) ✓

4. **Create a booking:**
   - Select a service
   - Fill details
   - Confirm
   - Should appear in "My Bookings" ✓

---

## 🔄 Automatic Deployments

**Great news!** Now whenever you make changes:

```bash
git add .
git commit -m "your changes"
git push origin master
```

Netlify will **automatically**:
1. Detect the push
2. Rebuild your site
3. Deploy the updates
4. Your site is updated in 2-3 minutes!

---

## 📊 What to Check After Deployment

✅ Site loads correctly  
✅ Google Sign-In works  
✅ New users see empty bookings  
✅ Can create bookings  
✅ Pull-to-refresh works  
✅ All pages accessible  

---

## 🎉 You're Live!

Your app is now:
- ✅ Hosted on free Netlify server
- ✅ Auto-deploying from GitHub
- ✅ Using Firebase authentication
- ✅ Professional and production-ready

---

## Need Help?

**If build fails:**
- Check the deploy logs in Netlify
- Make sure build command is exactly: `npx expo export -p web`
- Verify publish directory is: `dist`

**If Google Sign-In fails:**
- Make sure you added the Netlify domain to Firebase Authorized domains
- Domain should match exactly (no https://, no trailing slash)

**Screenshot your Netlify dashboard when done!** 📸

I'll help you troubleshoot if needed.
