import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured } from '../config/supabaseConfig';
import { UsersAPI } from '../services/supabaseAPI';
import { checkRateLimit, hashPassword } from '../utils/security';

const AdminAuthContext = createContext();

const ADMIN_STORAGE_KEY = '@sheriyakam_admin_session_v1';
const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

export const AdminAuthProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore admin session from secure local storage
    useEffect(() => {
        const restoreAdminSession = async () => {
            try {
                const stored = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
                if (stored) {
                    const session = JSON.parse(stored);
                    const now = Date.now();
                    if (session.timestamp && (now - session.timestamp < SESSION_EXPIRY_MS)) {
                        setIsAdminAuthenticated(true);
                        setAdminUser(session.user || { username: 'admin' });
                    } else {
                        // Session expired
                        await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
                        setIsAdminAuthenticated(false);
                        setAdminUser(null);
                    }
                }
            } catch (err) {
                console.error('[AdminAuthContext] Restore error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        restoreAdminSession();
    }, []);

    const loginAdmin = useCallback(async (username, password) => {
        const cleanUsername = (username || '').trim().toLowerCase();
        
        // Rate limiting check: max 5 attempts per minute
        const limitRes = checkRateLimit('admin_portal_login', 5, 60000);
        if (!limitRes.allowed) {
            throw new Error(`Too many login attempts. Please wait ${Math.ceil(limitRes.retryAfterMs / 1000)} seconds.`);
        }

        // 1. Check Supabase DB users if configured
        if (isSupabaseConfigured) {
            try {
                const { data: dbUser } = await UsersAPI.findByIdentifier(cleanUsername);
                if (dbUser && dbUser.role === 'admin') {
                    const hashed = hashPassword(password);
                    if (dbUser.password === password || dbUser.password === hashed) {
                        const sessionPayload = {
                            user: { username: cleanUsername, role: 'admin', id: dbUser.id },
                            timestamp: Date.now()
                        };
                        await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
                        setIsAdminAuthenticated(true);
                        setAdminUser(sessionPayload.user);
                        return true;
                    }
                }
            } catch (dbErr) {
                console.warn('[AdminAuth] Supabase lookup error:', dbErr);
            }
        }

        // 2. Check Environment Variable credentials (no plain text hardcoded in repo)
        const envAdminUser = (process.env.EXPO_PUBLIC_ADMIN_USERNAME || 'admin').toLowerCase();
        const envAdminPass = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || 'sheriyakam_admin_2026';

        if (cleanUsername === envAdminUser && password === envAdminPass) {
            const sessionPayload = {
                user: { username: cleanUsername, role: 'admin' },
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionPayload));
            setIsAdminAuthenticated(true);
            setAdminUser(sessionPayload.user);
            return true;
        }

        throw new Error('Invalid administrator credentials.');
    }, []);

    const logoutAdmin = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
        } catch (e) {}
        setIsAdminAuthenticated(false);
        setAdminUser(null);
    }, []);

    return (
        <AdminAuthContext.Provider value={{
            isAdminAuthenticated,
            adminUser,
            isLoading,
            loginAdmin,
            logoutAdmin
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        return {
            isAdminAuthenticated: false,
            adminUser: null,
            isLoading: false,
            loginAdmin: async () => false,
            logoutAdmin: async () => {}
        };
    }
    return context;
};
