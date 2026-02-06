import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiMapPin, FiShoppingCart } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useCity } from '../../context/CityContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../cart/CartSidebar';
import './Header.css';
import './UserDropdown.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { currentLanguage, changeLanguage, t, languages } = useLanguage();
    const { selectedCity, changeCity } = useCity();
    const { user, logout } = useAuth();
    const { getCartCount, toggleCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

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
        { path: '/become-partner', label: 'Become a Partner' },
        { path: '/about', label: t.nav.about },
        { path: '/contact', label: t.nav.contact }
    ];

    const isActive = (path) => location.pathname === path;
    const isPartnerPage = location.pathname.startsWith('/partner') || location.pathname === '/become-partner';

    if (isPartnerPage) {
        return (
            <header className="header header-scrolled">
                <div className="container">
                    <div className="header-content" style={{ justifyContent: 'space-between' }}>
                        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="/logo.png" alt="Kamwalaa" className="logo-img" />
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a8a', paddingLeft: '10px', borderLeft: '2px solid #cbd5e1' }}>Partner</span>
                        </Link>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <a href="https://wa.me/919030545655" target="_blank" rel="noreferrer" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>
                                Help Center
                            </a>
                            {user ? (
                                <button onClick={() => { logout(); navigate('/partner/login'); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                                    Logout
                                </button>
                            ) : (
                                <Link to="/" className="btn btn-sm btn-outline" style={{ border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px' }}>
                                    Back to Home
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

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
                        {user ? (
                            <div className="user-menu-container">
                                <button
                                    className="user-menu-btn"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <div className="user-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="user-name">{user.name || 'User'}</span>
                                    <FiChevronDown />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="user-dropdown">
                                        <Link to="/bookings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            My Bookings
                                        </Link>
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            Profile Settings
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={() => {
                                            logout();
                                            setIsUserMenuOpen(false);
                                            navigate('/login');
                                        }} className="dropdown-item logout-item">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary btn-sm">
                                    {t.nav.login}
                                </Link>
                            </>
                        )}

                        {/* Cart Button */}
                        <div className="cart-btn-wrapper">
                            <button className="cart-btn" onClick={toggleCart}>
                                <FiShoppingCart />
                                {getCartCount() > 0 && (
                                    <span className="cart-badge">{getCartCount()}</span>
                                )}
                            </button>
                        </div>

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
                        {!user && (
                            <div className="mobile-auth-buttons">
                                <Link to="/login" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                    {t.nav.login}
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
            {/* Cart Sidebar */}
            <CartSidebar />
        </header>
    );
};

export default Header;
