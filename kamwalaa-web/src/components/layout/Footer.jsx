import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube,
    FiMail, FiPhone, FiMapPin, FiArrowRight,
    FiShield, FiAward, FiStar, FiCheckCircle
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();
    const year = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) { setSubscribed(true); setEmail(''); }
    };

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'All Services' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
        { path: '/become-partner', label: 'Become a Partner' },
    ];

    const serviceLinks = [
        { path: '/services/appliances-repair', label: 'AC Service & Repair' },
        { path: '/services/electrician', label: 'Electrician' },
        { path: '/services/plumber', label: 'Plumber' },
        { path: '/services/painting-services', label: 'Painting Services' },
        { path: '/services/photographer', label: 'Photography' },
        { path: '/services/gadgets-repair', label: 'Gadgets Repair' },
    ];

    const legalLinks = [
        { path: '/privacy', label: 'Privacy Policy' },
        { path: '/terms', label: 'Terms of Service' },
        { path: '/refund', label: 'Refund Policy' },
        { path: '/cancellation', label: 'Cancellation Policy' },
    ];

    const socials = [
        { href: '#', icon: FiFacebook, label: 'Facebook' },
        { href: '#', icon: FiInstagram, label: 'Instagram' },
        { href: '#', icon: FiTwitter, label: 'Twitter' },
        { href: '#', icon: FiLinkedin, label: 'LinkedIn' },
        { href: '#', icon: FiYoutube, label: 'YouTube' },
    ];

    const trustItems = [
        { icon: FiShield, label: 'SSL Secured Payments' },
        { icon: FiAward, label: 'ISO Certified Company' },
        { icon: FiStar, label: '4.8 Average Rating' },
        { icon: FiCheckCircle, label: 'Verified Professionals' },
    ];

    return (
        <footer className="footer-enterprise" aria-label="Site footer">

            {/* Newsletter Banner */}
            <div className="footer-newsletter">
                <div className="container">
                    <div className="newsletter-inner">
                        <div className="newsletter-text">
                            <h3 className="newsletter-title">Get Exclusive Offers &amp; Updates</h3>
                            <p className="newsletter-desc">Subscribe for special deals, service tips, and priority booking.</p>
                        </div>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            {subscribed ? (
                                <div className="newsletter-success">
                                    <FiCheckCircle />
                                    <span>Thank you! You're subscribed.</span>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="newsletter-input"
                                        required
                                        aria-label="Email for newsletter"
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        Subscribe <FiArrowRight />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">

                        {/* ---- Brand Column ---- */}
                        <div className="footer-col footer-col-brand">
                            <Link to="/" className="footer-logo-wrap">
                                <img src="/logo.png" alt="Kamwalaa" className="footer-logo" />
                            </Link>
                            <p className="footer-tagline">
                                India's premium home service marketplace connecting households with verified, expert professionals — fast, safe, and affordable.
                            </p>

                            {/* Socials */}
                            <div className="footer-socials">
                                {socials.map(({ href, icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="footer-social-btn"
                                        aria-label={label}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>

                            {/* App badges */}
                            <div className="footer-app-badges">
                                <div className="app-badge">
                                    <span className="app-badge-icon">📱</span>
                                    <div>
                                        <div className="app-badge-sub">Coming Soon on</div>
                                        <div className="app-badge-name">App Store</div>
                                    </div>
                                </div>
                                <div className="app-badge">
                                    <span className="app-badge-icon">📲</span>
                                    <div>
                                        <div className="app-badge-sub">Coming Soon on</div>
                                        <div className="app-badge-name">Google Play</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---- Quick Links ---- */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Quick Links</h4>
                            <ul className="footer-link-list">
                                {quickLinks.map(l => (
                                    <li key={l.path}>
                                        <Link to={l.path} className="footer-link">
                                            <FiArrowRight className="footer-link-arrow" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ---- Services ---- */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Popular Services</h4>
                            <ul className="footer-link-list">
                                {serviceLinks.map(l => (
                                    <li key={l.path}>
                                        <Link to={l.path} className="footer-link">
                                            <FiArrowRight className="footer-link-arrow" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ---- Contact ---- */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Get In Touch</h4>
                            <ul className="footer-contact-list">
                                <li className="footer-contact-item">
                                    <div className="footer-contact-icon"><FiMapPin /></div>
                                    <span>
                                        Plot No: 18, Hno: 2-1-54/18, Bitla Residency,
                                        Venkateshwara Colony, Near Uppal Metro Station,
                                        Uppal, Hyderabad, Telangana — 500039
                                    </span>
                                </li>
                                <li className="footer-contact-item">
                                    <div className="footer-contact-icon"><FiPhone /></div>
                                    <a href="tel:+919030545655">+91 90305 45655</a>
                                </li>
                                <li className="footer-contact-item">
                                    <div className="footer-contact-icon"><FiMail /></div>
                                    <a href="mailto:support@kamwalaa.com">support@kamwalaa.com</a>
                                </li>
                            </ul>

                            {/* Business hours */}
                            <div className="footer-hours">
                                <div className="footer-hours-title">Support Hours</div>
                                <div className="footer-hours-row">
                                    <span>Mon – Sat</span>
                                    <span>8:00 AM – 8:00 PM</span>
                                </div>
                                <div className="footer-hours-row">
                                    <span>Sunday</span>
                                    <span>10:00 AM – 6:00 PM</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Trust badges */}
                    <div className="footer-trust">
                        {trustItems.map(({ icon: Icon, label }) => (
                            <div key={label} className="footer-trust-item">
                                <Icon className="footer-trust-icon" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gold divider */}
            <div className="footer-gold-divider" aria-hidden="true" />

            {/* Bottom bar */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-inner">
                        <p className="footer-copyright">
                            © {year} <strong>Kamwalaa</strong>. All rights reserved. Made with ❤️ in India.
                        </p>

                        <div className="footer-legal-links">
                            {legalLinks.map(l => (
                                <Link key={l.path} to={l.path} className="footer-legal-link">
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        <div className="footer-payments">
                            {['Visa', 'Mastercard', 'UPI', 'Razorpay'].map(p => (
                                <span key={p} className="footer-payment-badge">{p}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
