import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', formData);
        // Add your login logic here
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                            <div className="brand-feature">
                                <div className="feature-icon">⚡</div>
                                <div className="feature-text">
                                    <h4>Quick Booking</h4>
                                    <p>Book in just 3 clicks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">{t.nav.login}</h2>
                            <p className="form-subtitle">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <div className="input-wrapper">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
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
                            </div>

                            {/* Remember & Forgot */}
                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" className="checkbox-input" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-lg submit-btn">
                                {t.nav.login}
                            </button>

                            {/* Social Login */}
                            <div className="social-login">
                                <div className="divider">
                                    <span>Or continue with</span>
                                </div>
                                <div className="social-buttons">
                                    <button type="button" className="social-btn">
                                        <img src="https://www.google.com/favicon.ico" alt="Google" />
                                        Google
                                    </button>
                                    <button type="button" className="social-btn">
                                        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
                                        Facebook
                                    </button>
                                </div>
                            </div>

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
