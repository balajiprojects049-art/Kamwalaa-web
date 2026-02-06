import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendOTP, verifyOTP } from '../../services/apiService';
import { FiPhone, FiCheckCircle } from 'react-icons/fi';
import './PartnerDashboard.css';

const PartnerLogin = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        logout();
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendOTP(phone);
            if (res.success) {
                setStep('otp');
                success('OTP sent to your WhatsApp!');
            }
        } catch (err) {
            console.error(err);
            error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Passing 'Partner' as name just in case it's a new user (unlikely for partners)
            const res = await verifyOTP(phone, otp, 'Partner');
            if (res.success) {
                login(res.user);
                success(`Welcome back, ${res.user.name}!`);
                navigate('/partner/dashboard');
            }
        } catch (err) {
            console.error(err);
            error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="partner-dashboard-container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <div className="job-card" style={{ padding: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#1e3a8a', fontSize: '24px' }}>Partner Portal</h1>
                    <p style={{ color: '#64748b' }}>
                        <strong>New Registration</strong> or <strong>Login</strong><br />
                        Enter your mobile number to proceed.
                    </p>
                </div>

                {step === 'phone' ? (
                    <form onSubmit={handleSendOTP}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <FiPhone style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter mobile number"
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || phone.length < 10}
                            className="btn-complete"
                            style={{
                                width: '100%',
                                background: '#2563eb',
                                padding: '14px',
                                fontSize: '16px'
                            }}
                        >
                            {loading ? 'Sending OTP...' : 'Send WhatsApp OTP'}
                        </button>
                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            ℹ️ New to Kamwalaa? <br />
                            Simply verify your number above to start your <strong>Partner Registration</strong>.
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div className="form-group" style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontWeight: '500' }}>Enter OTP</label>
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Change Number
                                </button>
                            </div>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="0 0 0 0 0 0"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '24px',
                                    textAlign: 'center',
                                    letterSpacing: '8px'
                                }}
                                required
                            />
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
                                Check your WhatsApp for the code
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || otp.length < 4}
                            className="btn-complete"
                            style={{
                                width: '100%',
                                background: '#16a34a',
                                padding: '14px',
                                fontSize: '16px'
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PartnerLogin;
