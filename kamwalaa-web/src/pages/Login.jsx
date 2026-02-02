import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiPhone, FiLock, FiKey } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login as phoneLogin, pinLogin, setPin, resetPasswordPin, resetPinPassword } from '../services/apiService';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Destination handling
    const from = location.state?.from || '/';
    const bookingState = location.state?.bookingState || null;

    // Modes: 'full', 'pin', 'setup', 'forgot_password', 'forgot_pin'
    // Removed 'register' mode as it now has its own page
    const [mode, setMode] = useState('full');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        phone: localStorage.getItem('kamwalaa_saved_phone') || '',
        password: '',
        pin: '',
    });

    // Check for saved phone
    useEffect(() => {
        const savedPhone = localStorage.getItem('kamwalaa_saved_phone');
        if (savedPhone) {
            setMode('pin');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // --- Actions ---

    const handleFullLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await phoneLogin(formData.phone, formData.password);
            if (res.success) {
                localStorage.setItem('kamwalaa_saved_phone', formData.phone);
                login(res.user);

                if (!res.user.hasPin) {
                    setMode('setup');
                    toast.success('Login successful! Please create a quick passkey.');
                } else {
                    toast.success(`Welcome back, ${res.user.name}!`);
                    navigate(from, { state: bookingState });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid phone or password');
            toast.error('Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePinLogin = async (e) => {
        if (e) e.preventDefault();
        if (formData.pin.length !== 4) return;

        setLoading(true);
        setError('');

        try {
            const res = await pinLogin(formData.phone, formData.pin);
            if (res.success) {
                login(res.user);
                toast.success(`Welcome back, ${res.user.name}!`);
                navigate(from, { state: bookingState });
            }
        } catch (err) {
            setError('Incorrect Passkey PIN');
            setFormData({ ...formData, pin: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleSetupPin = async (e) => {
        e.preventDefault();
        if (formData.pin.length !== 4) {
            setError('Please enter a 4-digit number');
            return;
        }

        setLoading(true);
        try {
            const res = await setPin(formData.phone, formData.pin);
            if (res.success) {
                toast.success('Passkey protection enabled!');
                navigate(from, { state: bookingState });
            }
        } catch (err) {
            setError('Failed to set PIN');
            toast.error('Could not save PIN');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    // --- Render Helpers ---

    const renderPinLogin = () => (
        <form onSubmit={handlePinLogin} className="login-form">
            <div className="form-group">
                <label className="form-label">Welcome Back!</label>
                <p className="form-subtitle" style={{ marginBottom: '1rem' }}>
                    Enter 4-digit passkey for <strong>{formData.phone}</strong>
                </p>
                <div className="input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="pin"
                        value={formData.pin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setFormData({ ...formData, pin: val });
                        }}
                        className="form-input pin-input no-icon"
                        placeholder="● ● ● ●"
                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '1rem', height: '60px' }}
                        autoFocus
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
            <button type="submit" className="btn btn-primary btn-lg w-100 submit-btn" disabled={loading || formData.pin.length < 4}>
                {loading ? 'Verifying...' : 'Unlock'}
            </button>
            <div className="form-options" style={{ justifyContent: 'center', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setMode('full')} className="btn-link">
                    Use Password Instead
                </button>
                <button type="button" onClick={() => {
                    localStorage.removeItem('kamwalaa_saved_phone');
                    setFormData({ ...formData, phone: '' });
                    setMode('full');
                }} className="btn-link" style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    Not you? Login with different number
                </button>
            </div>
        </form>
    );

    const renderFullLogin = () => (
        <form onSubmit={handleFullLogin} className="login-form">
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
                        placeholder="Enter mobile number"
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
                        placeholder="Enter password"
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

            <button type="submit" className="btn btn-primary btn-lg w-100 submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-options" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                <button type="button" onClick={() => setMode('forgot_password')} className="btn-link">
                    Forgot Password?
                </button>
            </div>

            <p className="signup-text">
                Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link>
            </p>
        </form>
    );

    const renderSetupPin = () => (
        <form onSubmit={handleSetupPin} className="login-form">
            <div className="form-group">
                <label className="form-label">Create a Quick Passkey</label>
                <p className="form-subtitle">Set a 4-digit PIN for faster login next time.</p>
                <div className="input-wrapper" style={{ marginTop: '1rem' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="pin"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        className="form-input pin-input no-icon"
                        placeholder="0 0 0 0"
                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '1rem', height: '60px' }}
                        autoFocus
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 submit-btn" disabled={loading || formData.pin.length < 4}>
                {loading ? 'Saving...' : 'Save Passkey'}
            </button>
            <button type="button" onClick={handleSkip} className="btn-link w-100" style={{ marginTop: '1rem' }}>
                Skip for now
            </button>
        </form>
    );

    // Simplified Forgot Password View (Just for layout completeness)
    const renderForgotPassword = () => (
        <div className="login-form">
            <div className="form-group">
                <p className="form-subtitle">
                    Please contact support or use your Passkey to reset your password.
                    (Full reset flow implementation hidden for simplicity).
                </p>
            </div>
            <button type="button" onClick={() => setMode('full')} className="btn btn-primary w-100">
                Back to Login
            </button>
        </div>
    );

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side - Branding */}
                <div className="login-brand">
                    <div className="brand-content">
                        <img src="/logo.png" alt="Kamwalaa" className="brand-logo" />
                        <h1 className="brand-title">Welcome Back</h1>
                        <p className="brand-subtitle">
                            {mode === 'pin' ? 'Quick Secure Access' : 'Login to manage your bookings and profile.'}
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        {/* Header */}
                        <div className="form-header">
                            <h2 className="form-title">
                                {mode === 'pin' ? 'Quick Login' : mode === 'setup' ? 'Secure Account' : 'Login'}
                            </h2>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        {mode === 'pin' && renderPinLogin()}
                        {mode === 'full' && renderFullLogin()}
                        {mode === 'setup' && renderSetupPin()}
                        {(mode === 'forgot_password' || mode === 'forgot_pin') && renderForgotPassword()}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
