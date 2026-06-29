import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabaseConfig';

const AuthContext = createContext();

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

    // Restore session on app load and listen for changes
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        // 1. Restore initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(formatSupabaseUser(session.user));
            }
            setIsLoading(false);
        }).catch((err) => {
            console.error('[AuthContext] Session restore error:', err);
            setIsLoading(false);
        });

        // 2. Subscribe to auth state updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`[AuthContext] Auth state changed: ${event}`);
            if (session?.user) {
                setUser(formatSupabaseUser(session.user));
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    /** Sign in with email and password */
    const login = useCallback(async (email, password) => {
        if (!isSupabaseConfigured) {
            // Dev Mock Bypass
            const mockUser = { id: 'mock_uid', email, name: email.split('@')[0], mobile: '', role: 'user' };
            setUser(mockUser);
            return { user: mockUser };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });
        if (error) throw error;
        return data;
    }, []);

    /** Sign up with email, password and meta fields */
    const register = useCallback(async (email, password, name, mobile) => {
        if (!isSupabaseConfigured) {
            // Dev Mock Bypass
            return { user: { email, name } };
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
                data: {
                    name: name.trim(),
                    mobile: mobile.trim(),
                    role: 'user'
                }
            }
        });
        if (error) throw error;
        return data;
    }, []);

    /** Social OAuth Sign In (Google/GitHub) */
    const signInWithOAuth = useCallback(async (provider) => {
        if (!isSupabaseConfigured) return;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: 'sheriyakam://auth-callback'
            }
        });
        if (error) throw error;
        return data;
    }, []);

    /** Send Password Reset Link */
    const sendPasswordReset = useCallback(async (email) => {
        if (!isSupabaseConfigured) return;
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: 'sheriyakam://reset-password'
        });
        if (error) throw error;
        return data;
    }, []);

    /** Sign out and clear active session */
    const logout = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setUser(null);
            return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, []);

    /** Delete User Profile and Auth Record */
    const deleteAccount = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setUser(null);
            return;
        }

        try {
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

export const useAuth = () => useContext(AuthContext);
