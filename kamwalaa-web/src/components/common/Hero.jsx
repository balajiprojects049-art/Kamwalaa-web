import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiArrowRight, FiCheckCircle, FiZap, FiStar,
    FiShield, FiClock, FiMapPin, FiPlay, FiTrendingUp
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import HeroSearch from './HeroSearch';
import './Hero.css';

/* ---- Animated hero images ---- */
const HERO_IMAGES = [
    '/assets/images/hero-services.png',
    '/assets/images/hero-collage-2.jpg',
    '/assets/images/hero-collage-3.jpg',
];

/* ---- Feature pills ---- */
const FEATURES = [
    { icon: FiCheckCircle, label: 'Verified Experts' },
    { icon: FiShield, label: '100% Secure' },
    { icon: FiClock, label: 'Same-Day Service' },
    { icon: FiMapPin, label: '15+ Cities' },
];

/* ---- Recent bookings ticker (demo) ---- */
const BOOKINGS = [
    { name: 'Rahul K.', service: 'AC Service', city: 'Ranchi', time: '2 min ago' },
    { name: 'Priya S.', service: 'Electrician', city: 'Delhi', time: '5 min ago' },
    { name: 'Amit R.', service: 'RO Repair', city: 'Noida', time: '8 min ago' },
];

const Hero = () => {
    const { t } = useLanguage();
    const [imgIdx, setImgIdx] = useState(0);
    const [tickerIdx, setTickerIdx] = useState(0);

    /* Slideshow */
    useEffect(() => {
        const iv = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 4500);
        return () => clearInterval(iv);
    }, []);

    /* Booking ticker */
    useEffect(() => {
        const iv = setInterval(() => setTickerIdx(i => (i + 1) % BOOKINGS.length), 3500);
        return () => clearInterval(iv);
    }, []);

    const booking = BOOKINGS[tickerIdx];

    return (
        <section className="hero" aria-label="Hero section">

            {/* Animated mesh blobs */}
            <div className="hero-mesh" aria-hidden="true">
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <div className="hero-blob hero-blob-3" />
                <div className="hero-grid-overlay" />
            </div>

            <div className="container">
                <div className="hero-content">

                    {/* ================================================
              LEFT — TEXT
              ================================================ */}
                    <div className="hero-text">

                        {/* Trust badge */}
                        <div className="hero-trust-badge">
                            <span className="trust-badge-dot" />
                            <FiStar className="trust-badge-icon" />
                            Trusted by <strong>10,000+</strong> Happy Families
                        </div>

                        {/* Headline */}
                        <h1 className="hero-headline">
                            {t?.hero?.title || (
                                <>
                                    Premium Home Services,{' '}
                                    <span className="hero-headline-accent">
                                        Delivered to Your Door
                                    </span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle">
                            {t?.hero?.subtitle ||
                                'Book verified, background-checked professionals for AC service, electrical work, plumbing, photography, and 50+ more home services — in under 60 seconds.'}
                        </p>

                        {/* Search bar */}
                        <div className="hero-search-container">
                            <HeroSearch />
                        </div>

                        {/* Feature pills */}
                        <div className="hero-features">
                            {FEATURES.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div key={i} className="hero-feature-pill">
                                        <Icon className="pill-icon" />
                                        {f.label}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="hero-cta-group">
                            <Link to="/services" className="hero-cta-primary" id="hero-explore-btn">
                                Explore Services
                                <FiArrowRight />
                            </Link>
                            <Link to="/become-partner" className="hero-cta-secondary">
                                <FiPlay style={{ fontSize: '0.8rem' }} />
                                Become a Partner
                            </Link>
                        </div>

                        {/* Mini stats */}
                        <div className="hero-mini-stats">
                            {[
                                { num: '54+', lbl: 'Services' },
                                { num: '500+', lbl: 'Partners' },
                                { num: '4.8★', lbl: 'Rating' },
                            ].map((s, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div className="hero-mini-divider" />}
                                    <div className="hero-mini-stat">
                                        <div className="hero-mini-stat-num">{s.num}</div>
                                        <div className="hero-mini-stat-lbl">{s.lbl}</div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* ================================================
              RIGHT — VISUAL
              ================================================ */}
                    <div className="hero-visual" aria-hidden="true">

                        {/* Main image with 3D perspective */}
                        <div className="hero-image-wrapper">
                            {HERO_IMAGES.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Professional home service ${i + 1}`}
                                    className="hero-main-image"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: i === imgIdx ? 1 : 0,
                                        transition: 'opacity 1.2s ease-in-out',
                                        zIndex: i === imgIdx ? 2 : 1,
                                    }}
                                    onError={(e) => {
                                        e.target.src = `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80`;
                                    }}
                                />
                            ))}
                            {/* Image overlay */}
                            <div className="hero-image-overlay" />

                            {/* Live booking ticker */}
                            <div className="hero-ticker">
                                <span className="ticker-dot" />
                                <span>
                                    <strong>{booking.name}</strong> just booked{' '}
                                    <strong>{booking.service}</strong> in {booking.city} — {booking.time}
                                </span>
                            </div>
                        </div>

                        {/* Floating glass badge 1 — Same Day */}
                        <div className="floating-badge badge-1">
                            <div className="badge-icon-wrap gold">
                                <FiZap />
                            </div>
                            <div className="badge-content">
                                <span className="badge-title">Same Day Service</span>
                                <span className="badge-subtitle">Book in 60 seconds</span>
                            </div>
                        </div>

                        {/* Floating glass badge 2 — Satisfaction */}
                        <div className="floating-badge badge-2">
                            <div className="badge-icon-wrap green">
                                <FiCheckCircle />
                            </div>
                            <div className="badge-content">
                                <span className="badge-title">100% Satisfaction</span>
                                <span className="badge-subtitle">Money-back guarantee</span>
                            </div>
                        </div>

                        {/* Floating glass badge 3 — Partners */}
                        <div className="floating-badge badge-3">
                            <div className="badge-icon-wrap royal">
                                <FiTrendingUp />
                            </div>
                            <div className="badge-content">
                                <span className="badge-title">500+ Expert Partners</span>
                                <span className="badge-subtitle">Insured & verified</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
