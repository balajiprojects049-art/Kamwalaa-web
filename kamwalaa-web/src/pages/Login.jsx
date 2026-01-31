import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login as phoneLogin, pinLogin, setPin, register } from '../services/apiService';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [mode, setMode] = useState('full');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: localStorage.getItem('kamwalaa_saved_phone') || '',
        password: '',
        confirmPassword: '',
        pin: '',
        email: '',
        city: ''
    });

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
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid phone or password');
            toast.error('Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Password mismatch');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
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
                localStorage.setItem('kamwalaa_saved_phone', formData.phone);
                login(res.user);
                setMode('setup');
                toast.success('Account created! Now set your quick passkey.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            toast.error('Sign Up Failed');
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
                toast.success(`Securely logged in! Welcome, ${res.user.name}`);
                navigate('/');
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
                toast.success('Passkey PIN set successfully!');
                navigate('/');
            }
        } catch (err) {
            setError('Failed to set PIN');
            toast.error('Could not save PIN');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        toast.info('You can set your passkey later in Profile.');
        navigate('/');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-brand">
                    <div className="brand-content">
                        <img src="/logo.png" alt="Kamwalaa" className="brand-logo" />
                        <h1 className="brand-title">
                            {mode === 'setup' ? 'Secure Your Account' : mode === 'register' ? 'Join Us' : 'Easy Login'}
                        </h1>
                        <p className="brand-subtitle">
                            {mode === 'pin'
                                ? 'Use your 4-digit passkey for instant access.'
                                : 'Experience the best home services in your city.'}
                        </p>
                    </div>
                </div>

                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        {/* Header */}
                        <div className="form-header">
                            <h2 className="form-title">
                                {mode === 'pin' ? 'Quick Access' : mode === 'setup' ? 'Set Passkey' : mode === 'register' ? 'Create Account' : 'Login'}
                            </h2>
                            <p className="form-subtitle">
                                {mode === 'pin' ? `Welcome back, ${formData.phone}` : 'Enter your details to continue'}
                            </p>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        {/* PIN LOGIN MODE */}
                        {mode === 'pin' && (
                            <form onSubmit={handlePinLogin} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>4-Digit Passkey</label>
                                    <input
                                        type="password"
                                        name="pin"
                                        value={formData.pin}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            setFormData({ ...formData, pin: val });
                                        }}
                                        className="form-input pin-input no-icon"
                                        placeholder="● ● ● ●"
                                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '1rem', width: '100%', height: '60px', borderRadius: '12px' }}
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading || formData.pin.length < 4}>
                                    {loading ? 'Verifying...' : 'Login'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('full')}
                                    className="btn-link"
                                    style={{ marginTop: '1.5rem', width: '100%', color: '#2563eb', fontWeight: '600' }}
                                >
                                    Login with Password?
                                </button>
                            </form>
                        )}

                        {/* FULL LOGIN MODE */}
                        {mode === 'full' && (
                            <form onSubmit={handleFullLogin} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Phone Number</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input no-icon"
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
                                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                                    {loading ? 'Authenticating...' : 'Login'}
                                </button>
                                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Don't have an account? </span>
                                    <button type="button" onClick={() => setMode('register')} className="btn-link">Sign Up</button>
                                </div>
                            </form>
                        )}

                        {/* REGISTER MODE */}
                        {mode === 'register' && (
                            <form onSubmit={handleRegister} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Full Name</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Phone Number</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Create Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Minimum 6 characters"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Confirm Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="form-input no-icon"
                                            placeholder="Retype your password"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Already have an account? </span>
                                    <button type="button" onClick={() => setMode('full')} className="btn-link">Login</button>
                                </div>
                            </form>
                        )}

                        {/* SETUP PIN MODE */}
                        {mode === 'setup' && (
                            <form onSubmit={handleSetupPin} className="login-form">
                                <p style={{ marginBottom: '1.5rem', color: '#4b5563', textAlign: 'center' }}>
                                    Create a 4-digit PIN for faster login next time.
                                </p>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: '#000000', fontWeight: 'bold' }}>Create 4-Digit Passkey</label>
                                    <input
                                        type="password"
                                        name="pin"
                                        value={formData.pin}
                                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                        className="form-input pin-input no-icon"
                                        placeholder="0 0 0 0"
                                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '1rem', width: '100%', height: '60px' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading || formData.pin.length < 4}>
                                    {loading ? 'Saving PIN...' : 'Save & Continue'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="btn-link"
                                    style={{ marginTop: '1rem', width: '100%' }}
                                >
                                    Skip for now
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .error-alert {
                    padding: 0.75rem;
                    margin-bottom: 1.5rem;
                    background: #fee;
                    color: #c00;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .btn-link {
                    background: none;
                    border: none;
                    color: #2563eb;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn-link:hover {
                    text-decoration: underline;
                }
                .pin-input:focus {
                    border-color: #2563eb;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                .form-label {
                   display: block !important;
                   opacity: 1 !important;
                   visibility: visible !important;
                   color: #000000 !important;
                   font-weight: bold !important;
                }
            `}</style>
        </div>
    );
};

export default Login;
