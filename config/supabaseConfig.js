import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
//  SUPABASE CONFIGURATION
//  Keys loaded from .env file (EXPO_PUBLIC_ prefix for Expo)
// ============================================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured with real credentials (not placeholders)
export const isSupabaseConfigured = 
    Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) && 
    !SUPABASE_URL.includes('YOUR-PROJECT') && 
    !SUPABASE_ANON_KEY.includes('your-anon-key');

// Create Supabase client
export const supabase = isSupabaseConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    })
    : null;

export default supabase;
