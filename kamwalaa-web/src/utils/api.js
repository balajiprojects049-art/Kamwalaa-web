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
        // 1. Check for Admin Token first if it's an admin route or if explicitly requested
        const adminToken = localStorage.getItem('adminToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Logic: Use Admin Token for admin routes, otherwise User Token
        // Or if only admin token exists, use that.

        if (config.url.includes('/admin') || (adminToken && !user.token)) {
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
            }
        } else if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
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
            // IGNORE redirect for admin login attempts
            if (error.config.url.includes('/auth/admin/login')) {
                return Promise.reject(error);
            }

            // IGNORE redirect for guest bookings
            if (error.config.url.includes('/bookings') && error.config.method === 'post') {
                return Promise.reject(error);
            }

            // For other requests, clear user data and redirect to login
            localStorage.removeItem('user');
            // Only redirect if we are not already on the login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
