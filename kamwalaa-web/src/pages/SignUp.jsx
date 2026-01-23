import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import './Login.css'; // Reusing Login CSS

const SignUp = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-brand">
                    <div className="brand-content">
                        <img src="/logo.png" alt="Kamwalaa" className="brand-logo" />
                        <h1 className="brand-title">Join Kamwalaa!</h1>
                        <p className="brand-subtitle">
                            Create an account to book professional home services
                        </p>

                        <div className="brand-features">
                            <div className="brand-feature">
                                <div className="feature-icon">✨</div>
                                <div className="feature-text">
                                    <h4>Expert Professionals</h4>
                                    <p>Access to verified and skilled service providers</p>
                                </div>
                            </div>
                            <div className="brand-feature">
                                <div className="feature-icon">⚡</div>
                                <div className="feature-text">
                                    <h4>Instant Booking</h4>
                                    <p>Book services in just a few clicks</p>
                                </div>
                            </div>
                            <div className="brand-feature">
                                <div className="feature-icon">🎯</div>
                                <div className="feature-text">
                                    <h4>Best Prices</h4>
                                    <p>Transparent pricing with no hidden charges</p>
                                </div>
                            </div>
                            <div className="brand-feature">
                                <div className="feature-icon">💯</div>
                                <div className="feature-text">
                                    <h4>Quality Guaranteed</h4>
                                    <p>100% satisfaction or money back</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">Create Account</h2>
                            <p className="form-subtitle">Join thousands of happy customers</p>
                        </div>

                        <form className="login-form">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <input type="text" className="form-input no-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address (Optional)</label>
                                <div className="input-wrapper">
                                    <input type="email" className="form-input no-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="input-wrapper">
                                    <input type="tel" className="form-input no-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <input type="password" className="form-input no-icon" />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg submit-btn">Sign Up</button>

                            <p className="signup-text">
                                Already have an account? <Link to="/login" className="signup-link">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
