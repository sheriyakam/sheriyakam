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
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDrhmWm9sgyNyspopGbB-sQAs10j3aVZuQ",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "sheriyakam.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "sheriyakam",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "sheriyakam.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "272877589112",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:272877589112:web:de329f9df5ae2adba6138d",
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-SD9LPN9W3E"
};

// Check if Firebase is properly configured
const isConfigured = !firebaseConfig.apiKey.includes('YOUR_');

if (!isConfigured && __DEV__) {
    console.warn('⚠️ Firebase is not configured. Google Sign-In will not work.');
    console.warn('Please update config/firebaseConfig.js or set environment variables.');
}

let app;
let auth;
let analytics = null;

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
    // Create a dummy auth object to prevent crashes
    auth = null;
}

export { auth, analytics, isConfigured };
