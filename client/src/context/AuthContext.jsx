/**
 * @file AuthContext.jsx
 * @description React Context Provider for Global User Authentication & Authorization State
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Global State Management:
 *    Centralizes user authentication state (`user`, `token`, `isAuthenticated`, `isAdmin`) across the component tree.
 * 2. Persistent Authentication:
 *    Restores session automatically on app mount by checking localStorage and verifying JWT with backend `/api/auth/me`.
 */

import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Re-hydrate session on mount if token exists
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const res = await API.get('/auth/me');
                    if (res.data && res.data.success) {
                        setUser(res.data.user);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('[AuthContext] Session initialization failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Flexible Login handler supporting object or positional arguments
    const login = async (arg1, arg2) => {
        try {
            let email, password;
            if (typeof arg1 === 'object' && arg1 !== null) {
                email = arg1.email;
                password = arg1.password;
            } else {
                email = arg1;
                password = arg2;
            }

            const res = await API.post('/auth/login', { email, password });
            if (res.data && res.data.success) {
                const { token: newToken, user: userData } = res.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true, user: userData, token: newToken };
            }
            return { success: false, message: res.data?.message || 'Login failed' };
        } catch (error) {
            console.error('[Login Error]:', error);
            const message = error.response?.data?.message || 'Invalid email or password';
            return { success: false, message };
        }
    };

    // Flexible Register handler supporting object or positional arguments
    const register = async (arg1, arg2, arg3, arg4) => {
        try {
            let name, email, password, phone;
            if (typeof arg1 === 'object' && arg1 !== null) {
                name = arg1.name;
                email = arg1.email;
                password = arg1.password;
                phone = arg1.phone;
            } else {
                name = arg1;
                email = arg2;
                password = arg3;
                phone = arg4;
            }

            const res = await API.post('/auth/register', { name, email, password, phone });
            if (res.data && res.data.success) {
                const { token: newToken, user: userData } = res.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true, user: userData, token: newToken };
            }
            return { success: false, message: res.data?.message || 'Registration failed' };
        } catch (error) {
            console.error('[Register Error]:', error);
            const message = error.response?.data?.message || (error.message.includes('Network Error') ? 'Server connection error. Please try again in a few seconds as free cloud servers take a moment to wake up.' : 'Registration failed. Please try again.');
            return { success: false, message };
        }
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isAdmin,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
