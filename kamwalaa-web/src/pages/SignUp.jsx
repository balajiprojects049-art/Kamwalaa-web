import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import './Login.css'; // Reusing Login CSS

const SignUp = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = (e) => {
        e.preventDefault();
        // Mock OTP generation
        const mockOtp = Math.floor(1000 + Math.random() * 9000);
        alert(`Your Kamwalaa Verification Code is: ${mockOtp}`);
        console.log('Generated OTP:', mockOtp); // For debugging
        setOtpSent(true);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        // Here you would verify the OTP matches the input
        console.log('Signing up with OTP verified');
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

                        <form className="login-form" onSubmit={otpSent ? handleSignUp : handleSendOtp}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <input type="text" className="form-input no-icon" required />
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
                                    <input
                                        type="tel"
                                        className="form-input no-icon"
                                        required
                                        placeholder="+91"
                                        disabled={otpSent} // Lock phone after OTP sent
                                    />
                                </div>
                            </div>

                            {/* OTP Field - Only shown after sending */}
                            {otpSent && (
                                <div className="form-group animate-fade-in-up">
                                    <label className="form-label">Enter OTP</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className="form-input no-icon"
                                            placeholder="Enter 4-digit code"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                        We sent a code to your phone number.
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, marginLeft: '0.25rem' }}
                                        >
                                            Change Number?
                                        </button>
                                    </p>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg submit-btn">
                                {otpSent ? 'Verify & Sign Up' : 'Get OTP'}
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
