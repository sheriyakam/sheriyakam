import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase Configuration
// To set up Google Sign-In:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Go to Authentication > Sign-in method > Enable Google
// 4. Go to Project Settings > General > Your apps > Web app
// 5. Copy the config values below
// 6. For web deployment, add your domain to Authorized domains in Authentication settings

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Check if Firebase is properly configured
const isConfigured = !!firebaseConfig.apiKey;

let app = null;
let auth = null;
let analytics = null;

if (isConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        
        // Initialize Analytics for Web automatically
        isSupported().then(supported => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        });

    } catch (error) {
        console.error('Firebase initialization error:', error);
        auth = null;
    }
} else if (__DEV__) {
    console.warn('⚠️ Firebase is not configured. Google Sign-In will not work.');
    console.warn('Please update config/firebaseConfig.js or set environment variables.');
}

export { auth, analytics, isConfigured };
