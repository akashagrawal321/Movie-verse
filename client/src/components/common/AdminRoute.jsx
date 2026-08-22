/**
 * @file AdminRoute.jsx
 * @description Higher-Order Route Protection Wrapper for Admin Pages
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Role-Based Access Control (RBAC): Verifies both `isAuthenticated` and `user.role === 'admin'`.
 * 2. Un-Authorized Redirection: Redirects non-admin users to the homepage (`/`).
 */

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner text="Verifying admin credentials..." />;
    }

    // Check if authenticated AND role is 'admin'
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
