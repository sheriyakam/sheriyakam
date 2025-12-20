# Deploy to Netlify - Step by Step Guide

## Option 1: Deploy via Netlify CLI (Recommended)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build your app
```bash
npx expo export -p web
```

### Step 3: Login to Netlify
```bash
netlify login
```
This will open a browser window to authorize the CLI.

### Step 4: Deploy
```bash
netlify deploy --prod
```

When prompted:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: sheriyakam (or your preferred name)
- **Publish directory**: `dist`

---

## Option 2: Deploy via Netlify Website (Easier)

### Step 1: Build your app locally
```bash
npx expo export -p web
```

### Step 2: Go to Netlify
1. Visit: https://app.netlify.com/
2. Sign up or log in
3. Click **"Add new site"** → **"Deploy manually"**

### Step 3: Drag & Drop
1. Open your project folder
2. Find the **`dist`** folder (created by the build command)
3. Drag the entire **`dist`** folder into the Netlify upload area
4. Wait for deployment to complete

### Step 4: Get your URL
Netlify will give you a URL like: `https://random-name-123456.netlify.app`

---

## Option 3: Connect to GitHub (Best for continuous deployment)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect Netlify to GitHub
1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your **sheriyakam** repository
5. Configure build settings:
   - **Build command**: `npx expo export -p web`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

---

## After Deployment: Add Domain to Firebase

Once deployed, you'll get a URL like:
- `https://sheriyakam.netlify.app` (if you set a custom name)
- OR `https://random-name-123456.netlify.app`

### Add this to Firebase:
1. Go to Firebase Console → Authentication → Settings
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Enter your Netlify URL (without https://)
   - Example: `sheriyakam.netlify.app`
5. Click **Add**

---

## Test Google Sign-In

1. Visit your Netlify URL
2. Click Login/Signup
3. Click "Continue with Google"
4. Select your Google account
5. ✅ You should be logged in!

---

## Troubleshooting

### Build fails?
Make sure you have all dependencies:
```bash
npm install
```

### "dist" folder not found?
Run the build command first:
```bash
npx expo export -p web
```

### Google Sign-In not working?
- Check that you added your Netlify domain to Firebase Authorized domains
- Make sure the domain matches exactly (no https://, no trailing slash)

---

## Which option should you choose?

- **Option 1 (CLI)**: Best for developers, easy updates
- **Option 2 (Drag & Drop)**: Fastest for one-time deployment
- **Option 3 (GitHub)**: Best for automatic deployments on every code change

Choose the one that fits your workflow!
