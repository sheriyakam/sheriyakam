import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
//  SUPABASE CONFIGURATION
//  Replace these with your actual Supabase project credentials
// ============================================================

const SUPABASE_URL = 'YOUR_SUPABASE_URL';         // e.g., https://abcdefghij.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g., eyJhbGciOiJIUzI1NiIs...

// Check if Supabase is configured
export const isSupabaseConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

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
