import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';
import { sendOTP, verifyOTP } from '../services/apiService';
import './Login.css';

const Login = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const modal = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [useOtpLogin, setUseOtpLogin] = useState(true); // OTP login as default
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        password: '',
        otp: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (useOtpLogin) {
                // OTP Login
                if (!otpSent) {
                    setError('Please request OTP first');
                    setLoading(false);
                    return;
                }

                const response = await verifyOTP(formData.phone, formData.otp, formData.name);

                if (response.success) {
                    login(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    toast.success('Login successful! Welcome back.');
                    navigate('/');
                }
            } else {
                // Password login (for future implementation)
                setError('Password login coming soon. Please use OTP login.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await sendOTP(formData.phone);

            if (response.success) {
                setOtpSent(true);
                toast.success(`OTP sent successfully to ${formData.phone}`);

                // Show OTP in modal for development
                if (response.otp) {
                    modal.alert(
                        '🔐 OTP Sent',
                        `Your OTP is: ${response.otp}\n\nThis is only shown in development mode.`
                    );
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side - Branding */}
                <div className="login-brand">
                    <div className="brand-content">
                        <img src="/logo.png" alt="Kamwalaa" className="brand-logo" />
                        <h1 className="brand-title">Welcome Back!</h1>
                        <p className="brand-subtitle">
                            Access your account to book professional home services with ease
                        </p>

                        <div className="brand-features">
                            <div className="brand-feature">
                                <div className="feature-icon">✨</div>
                                <div className="feature-text">
                                    <h4>Professional Services</h4>
                                    <p>Verified and skilled professionals</p>
                                </div>
                            </div>
                            <div className="brand-feature">
                                <div className="feature-icon">🔒</div>
                                <div className="feature-text">
                                    <h4>Secure Payments</h4>
                                    <p>100% safe and encrypted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">{useOtpLogin ? 'Login via OTP' : 'Login'}</h2>
                            <p className="form-subtitle">Enter your phone number to continue</p>
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                backgroundColor: '#fee',
                                color: '#c00',
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            {/* Phone Field */}
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Phone Number
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input no-icon"
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                        required
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            {/* Name Field - Only for OTP login */}
                            {useOtpLogin && (
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Your Name
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Enter your full name"
                                            required={useOtpLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password or OTP Field */}
                            {!useOtpLogin ? (
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setUseOtpLogin(true)}
                                            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Login via OTP instead?
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="otp" className="form-label">
                                        OTP Code
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Enter OTP"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleSendOtp}
                                            disabled={loading || otpSent}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {loading ? 'Sending...' : otpSent ? 'OTP Sent' : 'Get OTP'}
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUseOtpLogin(false);
                                                setOtpSent(false);
                                                setError('');
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Login with Password instead?
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Remember & Forgot - Only for Password Mode */}
                            {!useOtpLogin && (
                                <div className="form-options">
                                    <label className="checkbox-label">
                                        <input type="checkbox" className="checkbox-input" />
                                        <span>Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="forgot-link">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Please wait...' : (useOtpLogin ? 'Verify & Login' : 'Login')}
                            </button>

                            {/* Info text for new users */}
                            <p className="signup-text" style={{ textAlign: 'center', color: '#6b7280' }}>
                                New user? Just enter your details and verify OTP to get started! 🎉
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
