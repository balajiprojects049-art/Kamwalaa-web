import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useCity } from '../../context/CityContext';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const { currentLanguage, changeLanguage, t, languages } = useLanguage();
    const { selectedCity, changeCity } = useCity();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: t.nav.home },
        { path: '/services', label: t.nav.services },
        { path: '/about', label: t.nav.about },
        { path: '/contact', label: t.nav.contact },
        { path: '/become-partner', label: 'Become a Partner' } // Added Link
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="Kamwalaa" className="logo-img" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="header-actions">
                        {/* City Selector */}
                        <button
                            className="city-selector-btn"
                            onClick={changeCity}
                            aria-label="Change city"
                        >
                            <FiMapPin />
                            <span className="city-name">{selectedCity || 'Select City'}</span>
                        </button>

                        {/* Language Selector */}
                        <div className="language-selector">
                            <button
                                className="language-btn"
                                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            >
                                <span className="language-name">
                                    {languages.find(l => l.code === currentLanguage)?.name}
                                </span>
                                <FiChevronDown className={`dropdown-icon ${isLangDropdownOpen ? 'rotate' : ''}`} />
                            </button>

                            {isLangDropdownOpen && (
                                <div className="language-dropdown">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setIsLangDropdownOpen(false);
                                            }}
                                        >
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth Buttons */}
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            {t.nav.login}
                        </Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">
                            {t.nav.signup}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <nav className="mobile-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mobile-auth-buttons">
                            <Link to="/login" className="btn btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                                {t.nav.login}
                            </Link>
                            <Link to="/signup" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                {t.nav.signup}
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
