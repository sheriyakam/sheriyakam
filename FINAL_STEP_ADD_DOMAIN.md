# Final Step: Add Authorized Domain to Firebase

## Your app is deployed at:
- https://sheriyakam-sooty.vercel.app

## Now add this domain to Firebase:

### Steps:

1. Go back to your Firebase Console: https://console.firebase.google.com/
2. Select your **Sheriyakam** project
3. Click **Authentication** in the left sidebar
4. Click the **Settings** tab (next to "Sign-in method")
5. Scroll down to **"Authorized domains"**
6. Click **"Add domain"**
7. Enter: `sheriyakam-sooty.vercel.app`
8. Click **Add**

### You should see:
- `localhost` (already there)
- `sheriyakam-signup.firebaseapp.com` (already there)
- `sheriyakam-sooty.vercel.app` (newly added)

## Test Google Sign-In:

Once you've added the domain:

1. Go to: https://sheriyakam-sooty.vercel.app
2. Click on the login/signup button
3. Click **"Continue with Google"**
4. Select your Google account
5. You should be logged in! ✅

## Expected Result:
- Google popup opens
- You select your account
- Popup closes
- You're logged into the app with your Google name and email

## If you get an error:
- "auth/unauthorized-domain" → Make sure you added the domain correctly
- "Popup blocked" → Allow popups in your browser settings
- Refresh the page and try again

---

**Screenshot when it works!** 📸
