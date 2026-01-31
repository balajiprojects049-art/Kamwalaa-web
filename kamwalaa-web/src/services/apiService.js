import api from '../utils/api';

// Cities
export const getCities = async () => {
    const response = await api.get('/cities');
    return response.data;
};

// Authentication
export const sendOTP = async (phone) => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
};

export const verifyOTP = async (phone, otp, name) => {
    const response = await api.post('/auth/verify-otp', { phone, otp, name });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (phone, password) => {
    const response = await api.post('/auth/login', { phone, password });
    return response.data;
};

export const setPin = async (phone, pin) => {
    const response = await api.post('/auth/set-pin', { phone, pin });
    return response.data;
};

export const pinLogin = async (phone, pin) => {
    const response = await api.post('/auth/pin-login', { phone, pin });
    return response.data;
};

export const adminLogin = async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
};

export const resetPasswordPin = async (phone, pin, newPassword) => {
    const response = await api.post('/auth/reset-password-pin', { phone, pin, newPassword });
    return response.data;
};

export const resetPinPassword = async (phone, password, newPin) => {
    const response = await api.post('/auth/reset-pin-password', { phone, password, newPin });
    return response.data;
};

// Services
export const getAllServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const getServiceCategories = async () => {
    const response = await api.get('/services/categories');
    return response.data;
};

export const getServicesByCategory = async (slug, city) => {
    const params = city ? { city } : {};
    const response = await api.get(`/services/category/${slug}`, { params });
    return response.data;
};

// Bookings
export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};

export const getAllBookings = async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
    const response = await api.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
};

// Users
export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const getUserProfile = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};



export const getUserAddresses = async (userId) => {
    const response = await api.get(`/users/${userId}/addresses`);
    return response.data;
};

export const addUserAddress = async (userId, addressData) => {
    const response = await api.post(`/users/${userId}/addresses`, addressData);
    return response.data;
};

// Reviews
export const submitReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};

export const getServiceReviews = async (serviceId) => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
};

export const getPartnerReviews = async (partnerId) => {
    const response = await api.get(`/reviews/partner/${partnerId}`);
    return response.data;
};
