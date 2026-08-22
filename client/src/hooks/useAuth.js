/**
 * @file useAuth.js
 * @description Custom React Hook for accessing global AuthContext
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Custom Hooks Pattern:
 *    Encapsulates `useContext(AuthContext)` logic with error checking if used outside provider.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
