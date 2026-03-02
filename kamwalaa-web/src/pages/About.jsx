import React from 'react';
import { FiUsers, FiTarget, FiAward, FiShield, FiStar, FiTrendingUp, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './About.css';

const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Expert Partners' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '3', label: 'Cities & Growing' },
];

const values = [
    { icon: FiUsers, color: '#1a3a6b', title: 'Customer First', desc: 'Every decision we make centers on the customer experience — from booking to service completion.' },
    { icon: FiTarget, color: '#d4a843', title: 'Transparency', desc: 'Clear pricing, verified professionals, no hidden costs. You always know exactly what you pay for.' },
    { icon: FiAward, color: '#22c55e', title: 'Excellence', desc: 'Our professionals undergo rigorous training and background checks before joining the platform.' },
    { icon: FiShield, color: '#7c3aed', title: 'Safety & Trust', desc: 'All jobs are insured. We take full responsibility for every service booked through Kamwalaa.' },
    { icon: FiStar, color: '#e11d48', title: 'Quality Assured', desc: 'Post-service quality checks, real customer reviews, and continuous feedback loops keep standards high.' },
    { icon: FiTrendingUp, color: '#0891b2', title: 'Always Improving', desc: 'We invest in technology, training, and processes to deliver a better experience every single day.' },
];

const timeline = [
    { year: '2023', title: 'Kamwalaa Founded', desc: 'Started in Hyderabad with 5 service categories and a vision to organize home services.' },
    { year: '2024', title: 'Expanded to 3 Cities', desc: 'Grew to Hyderabad, Warangal & Nalgonda with 200+ verified partner professionals.' },
    { year: '2025', title: 'Tech Platform Launch', desc: 'Launched mobile-first app and partner management dashboard for real-time bookings.' },
    { year: '2026', title: 'Enterprise Scale', desc: 'Building towards 10 cities, enterprise APIs, and SaaS platform for B2B clients.' },
];

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page-v2">

            {/* ── HERO ── */}
            <section className="about-hero">
                <div className="about-hero-blob about-hero-blob-1" />
                <div className="about-hero-blob about-hero-blob-2" />
                <div className="container about-hero-inner">
                    <span className="about-eyebrow">🏆 Our Story</span>
                    <h1 className="about-hero-title">
                        Revolutionizing<br />
                        <span className="about-gold-text">Home Services</span>
                        <br />Across India
                    </h1>
                    <p className="about-hero-sub">
                        Kamwalaa connects households with verified, skilled professionals —
                        making quality home services accessible, affordable, and transparent.
                    </p>
                    <div className="about-hero-actions">
                        <button className="about-btn-gold" onClick={() => navigate('/services')}>
                            Explore Services
                        </button>
                        <button className="about-btn-outline" onClick={() => navigate('/become-partner')}>
                            Become a Partner
                        </button>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="about-stats-strip">
                <div className="container about-stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} className="about-stat-card">
                            <div className="about-stat-value">{s.value}</div>
                            <div className="about-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MISSION ── */}
            <section className="container about-mission-section">
                <div className="about-mission-grid">
                    <div className="about-mission-visual">
                        <div className="about-logo-card">
                            <img src="/logo.png" alt="Kamwalaa" className="about-logo-big" />
                            <div className="about-logo-ring about-logo-ring-1" />
                            <div className="about-logo-ring about-logo-ring-2" />
                        </div>
                        <div className="about-mission-badge about-mission-badge-1">
                            <FiCheckCircle /> Verified Professionals
                        </div>
                        <div className="about-mission-badge about-mission-badge-2">
                            <FiMapPin /> Hyderabad, Telangana
                        </div>
                    </div>

                    <div className="about-mission-text">
                        <span className="about-section-eyebrow">Our Mission</span>
                        <h2 className="about-section-title">
                            Organizing India's <span className="about-gold-text">Home Service Sector</span>
                        </h2>
                        <p>
                            Kamwalaa was founded on a simple belief: everyone deserves reliable, fairly priced home services they can trust. We bridge the gap between skilled tradespeople and households that need them — creating opportunities for both.
                        </p>
                        <p>
                            Whether it's AC repair, plumbing, electrical work, or photography — we've built a platform where quality, transparency and convenience are non-negotiable standards, not luxuries.
                        </p>
                        <div className="about-mission-points">
                            {['Background-verified partners', 'Real-time tracking & updates', 'Insured & guaranteed work', 'Transparent fixed pricing'].map((pt, i) => (
                                <div key={i} className="about-mission-point">
                                    <FiCheckCircle className="about-check" /> {pt}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="about-values-section">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-section-eyebrow">What We Stand For</span>
                        <h2 className="about-section-title">Our Core <span className="about-gold-text">Values</span></h2>
                        <p className="about-section-sub">The principles that guide every decision we make at Kamwalaa.</p>
                    </div>
                    <div className="about-values-grid">
                        {values.map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <div key={i} className="about-value-card" style={{ '--vc-color': v.color }}>
                                    <div className="avc-icon-wrap"><Icon /></div>
                                    <h3>{v.title}</h3>
                                    <p>{v.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ── */}
            <section className="container about-timeline-section">
                <div className="about-section-header">
                    <span className="about-section-eyebrow">Our Journey</span>
                    <h2 className="about-section-title">How We've <span className="about-gold-text">Grown</span></h2>
                </div>
                <div className="about-timeline">
                    {timeline.map((item, i) => (
                        <div key={i} className="about-tl-item">
                            <div className="about-tl-year">{item.year}</div>
                            <div className="about-tl-dot" />
                            <div className="about-tl-card">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="about-cta-banner">
                <div className="container about-cta-inner">
                    <h2>Ready to Experience the Kamwalaa Difference?</h2>
                    <p>Book your first service and see why 10,000+ families trust us.</p>
                    <div className="about-cta-btns">
                        <button className="about-btn-gold" onClick={() => navigate('/services')}>Book a Service</button>
                        <button className="about-btn-outline-light" onClick={() => navigate('/contact')}>Talk to Us</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
