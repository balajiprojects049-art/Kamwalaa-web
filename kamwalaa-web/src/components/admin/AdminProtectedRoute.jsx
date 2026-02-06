import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminProtectedRoute
 * 
 * Secure guard for Admin routes ONLY.
 * Checks for 'adminToken' in localStorage.
 * Completely independent of User Auth Context.
 */
const AdminProtectedRoute = ({ children }) => {
    const location = useLocation();
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
        // Redirect to Admin Login, NOT User Login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
