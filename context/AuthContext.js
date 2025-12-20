import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Current user state (null = guest, object = logged in)
    const [user, setUser] = useState(null);

    // Mock Server Database
    const [registeredUsers, setRegisteredUsers] = useState([
        {
            email: 'user@example.com',
            mobile: '+919876543210',
            password: 'password123',
            name: 'Demo User'
        }
    ]);

    const login = async (userData) => {
        setUser(userData);

        // Check if this is a new user (first time login)
        const userKey = `user_${userData.email}_first_login`;
        const hasLoggedInBefore = await AsyncStorage.getItem(userKey);

        if (!hasLoggedInBefore) {
            // New user - clear bookings to start fresh
            await AsyncStorage.removeItem('sheriyakam_bookings_v1');
            await AsyncStorage.setItem(userKey, 'true');
        }
    };

    const register = (userData) => {
        // Check if already registered
        const existing = registeredUsers.find(u =>
            u.email === userData.email || u.mobile === userData.mobile
        );

        if (!existing) {
            setRegisteredUsers([...registeredUsers, userData]);
            return true;
        }
        return false; // Already exists
    };

    const recoverCredentials = (identifier) => {
        // Find user by email or mobile
        const foundUser = registeredUsers.find(u =>
            u.email === identifier || u.mobile === identifier
        );
        return foundUser;
    };

    const logout = async () => {
        setUser(null);
        // Optional: Clear bookings on logout for privacy
        // await AsyncStorage.removeItem('sheriyakam_bookings_v1');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, recoverCredentials }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
