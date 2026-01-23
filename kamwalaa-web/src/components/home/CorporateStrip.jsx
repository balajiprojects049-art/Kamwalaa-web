import React from 'react';
import { FiCheck, FiDownload, FiSmartphone, FiBriefcase } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import './CorporateStrip.css';

export const CorporateStats = () => {
    return (
        <div className="corporate-stats-strip">
            <div className="stats-container">
                <div className="corp-stat-item">
                    <span className="corp-stat-number">50k+</span>
                    <span className="corp-stat-label">Services Delivered</span>
                </div>
                <div className="corp-stat-item">
                    <span className="corp-stat-number">4.8</span>
                    <span className="corp-stat-label">Average Customer Rating</span>
                </div>
                <div className="corp-stat-item">
                    <span className="corp-stat-number">2000+</span>
                    <span className="corp-stat-label">Verified Professionals</span>
                </div>
                <div className="corp-stat-item">
                    <span className="corp-stat-number">15+</span>
                    <span className="corp-stat-label">Cities Covered</span>
                </div>
            </div>
        </div>
    );
};

export const CorporatePartners = () => {
    return (
        <div className="corporate-partners-section">
            <div className="container">
                <h4 className="partners-title">TRUSTED BY LEADING BRANDS</h4>
                <div className="partners-logos">
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1' }}>UrbanHome</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1' }}>TechSpace</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1' }}>GreenLife</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1' }}>BuildWell</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1' }}>SafeStay</div>
                </div>
            </div>
        </div>
    );
};

export const CorporateBusinessCTA = () => {
    return (
        <div className="corporate-cta-section">
            <div className="cta-content-wrapper">
                <div className="cta-text-content">
                    <span className="cta-badge">KAMWALAA FOR BUSINESS</span>
                    <h2 className="cta-title">Managing facilities? <br />We've got you covered.</h2>
                    <p className="cta-description">
                        Get enterprise-grade facility management services for your office or business.
                        Dedicated account managers, GST invoices, and priority support.
                    </p>
                    <div className="cta-buttons">
                        <a href="#" className="btn-store">
                            <FiBriefcase className="store-icon" />
                            <div className="store-text">
                                <span className="store-subtitle">Partner with us</span>
                                <span className="store-title">Kamwalaa Business</span>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="cta-image-wrapper">
                    <div style={{
                        width: '400px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '20px'
                    }}>
                        <FiBriefcase style={{ fontSize: '64px', opacity: 0.5 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CorporateStrip = () => {
    return (
        <>
            <CorporateStats />
            <CorporatePartners />
            <CorporateBusinessCTA />
        </>
    );
};

export default CorporateStrip;
