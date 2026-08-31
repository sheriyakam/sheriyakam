import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../config/supabaseConfig';

const AuthContext = createContext();

const LOCAL_STORAGE_KEY = '@sheriyakam_user_session';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatSupabaseUser = (sbUser) => {
        if (!sbUser) return null;
        return {
            id: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.name || sbUser.email.split('@')[0],
            mobile: sbUser.user_metadata?.mobile || '',
            role: sbUser.user_metadata?.role || 'user'
        };
    };

    // Restore session on app load
    useEffect(() => {
        const restoreSession = async () => {
            try {
                if (isSupabaseConfigured && supabase) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        setUser(formatSupabaseUser(session.user));
                    }
                } else {
                    // Local session fallback
                    const saved = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
                    if (saved) {
                        setUser(JSON.parse(saved));
                    }
                }
            } catch (err) {
                console.error('[AuthContext] Session restore error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();

        // Subscribe to auth state updates if Supabase is active
        if (isSupabaseConfigured && supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    setUser(formatSupabaseUser(session.user));
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            });

            return () => {
                subscription?.unsubscribe();
            };
        }
    }, []);

    /** Sign in with email and password */
    const login = useCallback(async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password
            });
            if (error) throw error;
            return data;
        }

        // Local session fallback
        const localUser = {
            id: `usr_${Date.now()}`,
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            mobile: '',
            role: 'user'
        };
        setUser(localUser);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUser));
        return { user: localUser };
    }, []);

    /** Sign up with email, password and meta fields */
    const register = useCallback(async (email, password, name, mobile) => {
        const cleanEmail = email.trim().toLowerCase();
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: {
                        name: (name || '').trim(),
                        mobile: (mobile || '').trim(),
                        role: 'user'
                    }
                }
            });
            if (error) throw error;
            return data;
        }

        // Local session fallback
        const localUser = {
            id: `usr_${Date.now()}`,
            email: cleanEmail,
            name: (name || cleanEmail.split('@')[0]).trim(),
            mobile: (mobile || '').trim(),
            role: 'user'
        };
        setUser(localUser);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUser));
        return { user: localUser };
    }, []);

    /** Social OAuth Sign In (Google/Apple) */
    const signInWithOAuth = useCallback(async (provider) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: typeof window !== 'undefined' ? window.location.origin : 'sheriyakam://auth-callback'
                }
            });
            if (error) throw error;
            return data;
        }

        // Local social sign-in fallback
        const localUser = {
            id: `oauth_${provider.toLowerCase()}_${Date.now()}`,
            email: `user_${provider.toLowerCase()}@sheriyakam.com`,
            name: `${provider} User`,
            mobile: '',
            role: 'user'
        };
        setUser(localUser);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUser));
        return { user: localUser };
    }, []);

    /** Send Password Reset Link */
    const sendPasswordReset = useCallback(async (email) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
                redirectTo: 'sheriyakam://reset-password'
            });
            if (error) throw error;
            return data;
        }
        return { success: true };
    }, []);

    /** Sign out and clear active session */
    const logout = useCallback(async () => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        }
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
        setUser(null);
    }, []);

    /** Delete User Profile and Auth Record */
    const deleteAccount = useCallback(async () => {
        try {
            if (isSupabaseConfigured && supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (token) {
                    const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
                    await fetch(`${backendUrl}/api/auth/delete-account`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
                await supabase.auth.signOut();
            }
            await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
            setUser(null);
        } catch (error) {
            console.error('[AuthContext] Account deletion error:', error);
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAdmin: user?.role === 'admin',
            login,
            logout,
            register,
            signInWithOAuth,
            sendPasswordReset,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return {
            user: null,
            isLoading: false,
            isAdmin: false,
            login: async () => {},
            logout: async () => {},
            register: async () => {},
            signInWithOAuth: async () => {},
            sendPasswordReset: async () => {},
            deleteAccount: async () => {}
        };
    }
    return context;
};
