import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { success, error } = useToast();

    // Redirect if already logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            console.log('✅ Admin already logged in, redirecting to dashboard');
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('🔑 Admin login attempt for:', email);
        setLoading(true);

        try {
            const { adminLogin } = await import('../../services/apiService');
            const response = await adminLogin(email, password);

            console.log('📡 Login response:', response);

            if (response.success) {
                // Save admin token
                localStorage.setItem('adminToken', response.user.token);
                localStorage.setItem('kamwalaa_admin_user', JSON.stringify(response.user));

                console.log('✅ Admin logged in successfully');
                success('Welcome back, Admin!');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('❌ Admin login error:', err);
            error(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                {/* Left Side - Branding & Background */}
                <div className="admin-brand-section">
                    <div className="admin-bg-decoration">
                        <div className="admin-blob-1"></div>
                        <div className="admin-blob-2"></div>
                        <div className="admin-blob-3"></div>
                    </div>

                    <div className="brand-content-wrapper">
                        <div className="admin-icon-circle">
                            <FaUserShield />
                        </div>
                        <h2>Admin Portal</h2>
                        <p>Secure Dashboard Access</p>

                        <div className="admin-features">
                            <div className="admin-feature">
                                <div className="feature-dot"></div>
                                <span>Manage Users & Bookings</span>
                            </div>
                            <div className="admin-feature">
                                <div className="feature-dot"></div>
                                <span>Monitor Revenue</span>
                            </div>
                            <div className="admin-feature">
                                <div className="feature-dot"></div>
                                <span>System Settings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="admin-form-section">
                    <div className="form-header">
                        <h3>Welcome Back</h3>
                        <p>Please enter your details</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-login-btn"
                        >
                            {loading ? (
                                <span className="loading-spinner">
                                    <svg className="spinner-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                'Login to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <button className="back-link" onClick={() => navigate('/')}>
                            ← Back to Website
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
