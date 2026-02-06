import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        // 'kamwalaa_user' is the key used in AuthContext, let's look for both common keys just in case
        // But referencing the codebase, AuthContext uses 'kamwalaa_user'. api.js lines 17 used 'user'.
        // Step 2105 confirms 'kamwalaa_user'.
        // Let's check both or fix it.
        const userStr = localStorage.getItem('kamwalaa_user') || localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};

        // CTX CHECK: Are we in Admin Portal?
        const isAdminPath = window.location.pathname.startsWith('/admin');

        if (isAdminPath) {
            // FORCE Admin Token for any request coming from Admin Portal
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
            }
        } else {
            // Otherwise use User Token
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if the error is 401 Unauthorized
        if (error.response?.status === 401) {
            const isAdminPath = window.location.pathname.startsWith('/admin');

            // IGNORE redirect for specific login endpoints
            if (error.config.url.includes('/login')) {
                return Promise.reject(error);
            }

            // IGNORE redirect for specific public actions
            if (error.config.url.includes('/bookings') && error.config.method === 'post') {
                return Promise.reject(error);
            }

            // For other requests, handle redirect based on context
            if (isAdminPath) {
                // Clean Admin State
                localStorage.removeItem('adminToken');
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            } else {
                // Clean User State
                localStorage.removeItem('kamwalaa_user');
                localStorage.removeItem('user'); // Clean legacy key too
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
