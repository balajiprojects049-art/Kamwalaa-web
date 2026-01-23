import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Reusing Login CSS

const SignUp = () => {
    // Standard Signup State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        // Here you would send the data to your backend
        console.log('Signing up with:', formData);
        alert('Account created successfully! Please login.');
        // Redirect to login or auto-login logic here
    };

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

                        <form className="login-form" onSubmit={handleSignUp}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="form-input no-icon"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address (Optional)</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input no-icon"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="input-wrapper">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input no-icon"
                                        required
                                        placeholder="+91"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input no-icon"
                                        required
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg submit-btn">
                                Sign Up
                            </button>

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
