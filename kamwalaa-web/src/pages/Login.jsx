import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [useOtpLogin, setUseOtpLogin] = useState(false); // Toggle between Password/OTP
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        otp: ''
    });

    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import './Login.css';

    const Login = () => {
        const { t } = useLanguage();
        const { login } = useAuth();
        const navigate = useNavigate();
        const [showPassword, setShowPassword] = useState(false);
        const [useOtpLogin, setUseOtpLogin] = useState(false);
        const [formData, setFormData] = useState({
            phone: '',
            password: '',
            otp: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            // Simulate Login Logic
            const mockUser = {
                name: 'Demo User',
                phone: formData.phone,
                email: 'user@example.com',
                address: '123, Green Park, Hyderabad'
            };

            login(mockUser);
            alert('Login Successful!');
            navigate('/profile');
        };

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSendOtp = () => {
            if (!formData.phone) return alert('Please enter phone number');
            alert('OTP Sent to: ' + formData.phone);
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
                                            placeholder="+91"
                                            required
                                        />
                                    </div>
                                </div>

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
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                Get OTP
                                            </button>
                                        </div>
                                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setUseOtpLogin(false)}
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
                                <button type="submit" className="btn btn-primary btn-lg submit-btn">
                                    {useOtpLogin ? 'Verify & Login' : 'Login'}
                                </button>



                                {/* Sign Up Link */}
                                <p className="signup-text">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="signup-link">
                                        {t.nav.signup}
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default Login;
