import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiPhone, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { register } from '../services/apiService';
import './Login.css'; // Reusing Login CSS for consistent look

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        email: '',
        city: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) return "Password must be at least 8 characters long";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter";
        if (!hasLowerCase) return "Password must contain at least one lowercase letter";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecialChar) return "Password must contain at least one special character";

        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Password mismatch');
            return;
        }

        const passError = validatePassword(formData.password);
        if (passError) {
            setError(passError);
            toast.error(passError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await register({
                name: formData.name,
                phone: formData.phone,
                password: formData.password,
                email: formData.email,
                city: formData.city
            });

            if (res.success) {
                // Always redirect to login page after registration
                toast.success('Account created successfully! Please login to continue.');
                navigate('/login', { state: { newUser: true, phone: formData.phone } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            toast.error('Sign Up Failed');
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
                        <h1 className="brand-title">Join Kamwalaa</h1>
                        <p className="brand-subtitle">
                            Create an account today and get access to top-rated home services at your doorstep.
                        </p>
                        <div className="brand-features">
                            <div className="brand-feature">
                                <span className="feature-icon"><FiCheckCircle /></span>
                                <div className="feature-text">
                                    <h4>Verified Professionals</h4>
                                    <p>Safe and trusted experts.</p>
                                </div>
                            </div>
                            <div className="brand-feature">
                                <span className="feature-icon"><FiCheckCircle /></span>
                                <div className="feature-text">
                                    <h4>Fast Booking</h4>
                                    <p>Book in seconds, service in minutes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        {/* Header */}
                        <div className="form-header">
                            <h2 className="form-title">Values Your Home</h2>
                            <p className="form-subtitle">Fill in the details to get started</p>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleRegister} className="login-form">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><FiUser /></span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><FiPhone /></span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="10-digit mobile number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><FiLock /></span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Min 8 chars, 1 uppercase, 1 special"
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

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><FiLock /></span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 submit-btn" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>

                            <p className="signup-text">
                                Already have an account? <Link to="/login" className="signup-link">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
