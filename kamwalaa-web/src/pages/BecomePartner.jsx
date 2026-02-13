import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiClock, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import './BecomePartner.css';

const BecomePartner = () => {
    const { user } = useAuth();
    const landingPath = user ? '/partner/dashboard' : '/partner/login';

    return (
        <div className="partner-page">
            <PageHero
                title="Become a Partner"
                subtitle="Join India's fastest growing home services platform"
                backgroundImage="/assets/images/hero/partner-hero.png"
                bgPosition="center 25%"
            />

            <div className="container partner-layout" style={{ display: 'block' }}>
                <div className="partner-benefits" style={{ maxWidth: '100%', marginBottom: '40px' }}>
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#1e3a8a' }}>Why Join Kamwalaa?</h2>
                        <p className="partner-intro" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                            Are you a skilled professional looking to grow your business?
                            Join Kamwalaa today and get access to thousands of customers looking for your services.
                            We provide the platform, marketing, and support you need to succeed.
                        </p>

                        <div style={{ marginTop: '40px' }}>
                            <Link to={landingPath} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '50px' }}>
                                Register as Partner <FiArrowRight />
                            </Link>
                            <p style={{ marginTop: '15px', color: '#64748b' }}>
                                Already have an account? <Link to="/partner/login" style={{ color: '#2563eb' }}>Login here</Link>
                            </p>
                        </div>
                    </div>

                    <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FiTrendingUp /></div>
                            <div>
                                <h3>Grow Your Business</h3>
                                <p>Get verified leads and expand your customer base instantly without marketing costs.</p>
                            </div>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon"><FiClock /></div>
                            <div>
                                <h3>Work on Your Terms</h3>
                                <p>Choose your own timings and location. You are your own boss.</p>
                            </div>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon"><FiDollarSign /></div>
                            <div>
                                <h3>Earn More</h3>
                                <p>Transparent pricing and regular payments directly to your account. No hidden charges.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works Section */}
            <div className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How it Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h4>Register Online</h4>
                            <p>Click "Register as Partner", login with your mobile number, and submit your documents.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h4>Get Verified</h4>
                            <p>Our admin Team will verify your documents and approve your request within 24 hours.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h4>Start Working</h4>
                            <p>Once approved, you'll receive a WhatsApp notification and can start accepting jobs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomePartner;
// Updated CSS styles for input alignment
