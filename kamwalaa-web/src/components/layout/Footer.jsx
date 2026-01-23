import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();

    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/', label: t.nav.home },
        { path: '/services', label: t.nav.services },
        { path: '/about', label: t.nav.about },
        { path: '/contact', label: t.nav.contact }
    ];

    const serviceCategories = [
        'Electrical',
        'Plumbing',
        'Painting',
        'Cleaning',
        'Gardening',
        'Gas Services'
    ];

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-column">
                            <div className="footer-brand">
                                <img src="/logo.png" alt="Kamwalaa" className="footer-logo" />
                                <h2 className="footer-brand-name">Kamwalaa</h2>
                            </div>
                            <p className="footer-description">
                                Your trusted partner for professional home services. Quality, reliability, and transparency in every service we provide.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link">
                                    <FiFacebook />
                                </a>
                                <a href="#" className="social-link">
                                    <FiInstagram />
                                </a>
                                <a href="#" className="social-link">
                                    <FiTwitter />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-column">
                            <h3 className="footer-heading">{t.footer.quickLinks}</h3>
                            <ul className="footer-links">
                                {quickLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="footer-column">
                            <h3 className="footer-heading">Popular Services</h3>
                            <ul className="footer-links">
                                {serviceCategories.map((service) => (
                                    <li key={service}>
                                        <Link to="/services" className="footer-link">
                                            {service}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer-column">
                            <h3 className="footer-heading">{t.footer.contact}</h3>
                            <ul className="footer-contact">
                                <li className="contact-item">
                                    <FiMapPin className="contact-icon" />
                                    <span>Nellore, Andhra Pradesh, India</span>
                                </li>
                                <li className="contact-item">
                                    <FiPhone className="contact-icon" />
                                    <a href="tel:+919876543210">+91 98765 43210</a>
                                </li>
                                <li className="contact-item">
                                    <FiMail className="contact-icon" />
                                    <a href="mailto:info@kamwalaa.com">info@kamwalaa.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Kamwalaa. {t.footer.rights}.
                        </p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
