# Firebase Google Sign-In Setup Guide

## Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### 2. Enable Google Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Set a support email
5. Click **Save**

### 3. Get Your Configuration
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Sheriyakam Web")
5. Copy the `firebaseConfig` object

### 4. Update Your Code
Replace the values in `config/firebaseConfig.js`:

```javascript
const firebaseConfig = {
    apiKey: "AIza...",  // Your actual API key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 5. Add Authorized Domains (for production)
1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `sheriyakam-sooty.vercel.app`
3. Add any custom domains you use

### 6. Test Locally
```bash
npm start
```
Navigate to the login screen and click "Continue with Google"

## Environment Variables (Optional)
For better security, you can use environment variables:

Create `.env` file:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Troubleshooting

### "Pop-up blocked" error
- Allow pop-ups for your site in browser settings
- Or the code will automatically fall back to redirect method

### "auth/unauthorized-domain" error
- Add your domain to Authorized domains in Firebase Console

### "Firebase not configured" warning
- Make sure you've replaced all "YOUR_" placeholders in firebaseConfig.js

## Testing
Once configured, the Google Sign-In button will:
1. Open Google account selection popup
2. Request permission to access basic profile info
3. Return user's name, email, and profile picture
4. Automatically log them into your app
