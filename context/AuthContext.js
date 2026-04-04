import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sanitizeEmail, sanitizeInput } from '../utils/security';
import { UsersAPI } from '../services/supabaseAPI';
import { isSupabaseConfigured } from '../config/supabaseConfig';


const SESSION_KEY = 'sheriyakam_user_session';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock Server Database (fallback when Supabase not configured)
    const [registeredUsers, setRegisteredUsers] = useState([
        {
            email: ADMIN_EMAIL,
            mobile: '+919000000000',
            password: 'admin123',
            name: 'Admin',
            role: 'admin'
        }
    ]);

    // Restore session on app load
    useEffect(() => {
        restoreSession();
    }, []);

    const restoreSession = async () => {
        try {
            const saved = await AsyncStorage.getItem(SESSION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setUser(parsed);
            }
        } catch (e) {
            console.error('Session restore error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    /** Check if user is admin */
    const isAdmin = useCallback((email) => {
        return sanitizeEmail(email) === ADMIN_EMAIL;
    }, []);

    /** Login user — persists session */
    const login = useCallback(async (userData) => {
        const sanitizedUser = {
            ...userData,
            name: sanitizeInput(userData.name),
            email: sanitizeEmail(userData.email),
            role: isAdmin(userData.email) ? 'admin' : (userData.role || 'user'),
        };

        setUser(sanitizedUser);

        // Persist session
        try {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sanitizedUser));
        } catch (e) {
            console.error('Session save error:', e);
        }

        // Sync to Supabase if configured
        if (isSupabaseConfigured) {
            try {
                const { data } = await UsersAPI.findByEmail(sanitizedUser.email);
                if (!data) {
                    await UsersAPI.create(sanitizedUser);
                }
            } catch (e) {
                console.error('Supabase sync error:', e);
            }
        }

        // First login — fresh bookings
        const userKey = `user_${sanitizedUser.email}_first_login`;
        const hasLoggedInBefore = await AsyncStorage.getItem(userKey);
        if (!hasLoggedInBefore) {
            await AsyncStorage.removeItem('sheriyakam_bookings_v2');
            await AsyncStorage.setItem(userKey, 'true');
        }
    }, []);

    /** Register new user */
    const register = useCallback(async (userData) => {
        const sanitized = {
            ...userData,
            name: sanitizeInput(userData.name),
            email: sanitizeEmail(userData.email),
        };

        // Check if already registered (local)
        const existing = registeredUsers.find(u =>
            u.email === sanitized.email || u.mobile === sanitized.mobile
        );

        if (existing) return false;

        // Save locally
        setRegisteredUsers(prev => [...prev, sanitized]);

        // Sync to Supabase
        if (isSupabaseConfigured) {
            try {
                await UsersAPI.create(sanitized);
            } catch (e) {
                console.error('User registration sync error:', e);
            }
        }

        return true;
    }, [registeredUsers]);

    /** Find user for credential recovery */
    const recoverCredentials = useCallback((identifier) => {
        const clean = identifier.includes('@')
            ? sanitizeEmail(identifier)
            : identifier;
        return registeredUsers.find(u =>
            u.email === clean || u.mobile === clean
        );
    }, [registeredUsers]);

    /** Logout — clears session */
    const logout = useCallback(async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem(SESSION_KEY);
        } catch (e) {
            console.error('Session clear error:', e);
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
            recoverCredentials,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
