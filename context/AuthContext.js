import React, { createContext, useState, useContext } from 'react';

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

    const login = (userData) => {
        setUser(userData);
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

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, recoverCredentials }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
