import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiMenu, FiX, FiChevronDown, FiMapPin, FiShoppingCart,
    FiMoon, FiSun, FiBell, FiUser, FiSettings, FiLogOut,
    FiBookmark, FiHome, FiGrid, FiInfo, FiPhone, FiStar,
    FiDollarSign, FiTrendingUp
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useCity } from '../../context/CityContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../cart/CartSidebar';
import './Header.css';
import './UserDropdown.css';

/* ---- Dark Mode Hook ---- */
const useDarkMode = () => {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('kamwalaa-theme');
        if (stored) return stored === 'dark';
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('kamwalaa-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggle = useCallback(() => setIsDark(d => !d), []);
    return [isDark, toggle];
};

/* ---- Nav Link Icons map ---- */
const NAV_ICONS = {
    '/': FiHome,
    '/services': FiGrid,
    '/about': FiInfo,
    '/contact': FiPhone,
    '/become-partner': FiStar,
};

/* ====================================================
   HEADER COMPONENT
   ==================================================== */
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenu] = useState(false);
    const [isLangOpen, setLangOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isDark, toggleDark] = useDarkMode();

    const { currentLanguage, changeLanguage, t, languages } = useLanguage();
    const { selectedCity, changeCity } = useCity();
    const { user, logout } = useAuth();
    const { getCartCount, toggleCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const langRef = useRef(null);
    const userMenuRef = useRef(null);

    /* ---- Scroll listener ---- */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ---- Close mobile menu on route change ---- */
    useEffect(() => { setMobileMenu(false); }, [location.pathname]);

    /* ---- Click-outside for dropdowns ---- */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ---- Lock body scroll when mobile menu open ---- */
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { path: '/', label: t?.nav?.home || 'Home', icon: FiHome },
        { path: '/services', label: t?.nav?.services || 'Services', icon: FiGrid },
        { path: '/become-partner', label: 'Become a Partner', icon: FiStar },
        { path: '/about', label: t?.nav?.about || 'About', icon: FiInfo },
        { path: '/contact', label: t?.nav?.contact || 'Contact', icon: FiPhone },
    ];

    const isActive = (path) => location.pathname === path;
    const isPartner = location.pathname.startsWith('/partner') || location.pathname === '/become-partner';
    const cartCount = getCartCount?.() ?? 0;

    /* ====================================================
       PARTNER-MODE HEADER (minimal)
       ==================================================== */
    if (isPartner) {
        return (
            <header className="header header-scrolled header-partner-mode">
                <div className="container">
                    <div className="header-inner">
                        <Link to="/" className="header-logo">
                            <img src="/logo.png" alt="Kamwalaa" className="header-logo-img" />
                            <span className="header-logo-suffix">Partner</span>
                        </Link>

                        <div className="header-actions">
                            {/* Dark Mode */}
                            <button className="dark-mode-toggle" onClick={toggleDark} aria-label="Toggle dark mode">
                                {isDark ? <FiSun /> : <FiMoon />}
                            </button>

                            <a
                                href="https://wa.me/919030545655"
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline"
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                Help Center
                            </a>

                            {user ? (
                                <button
                                    onClick={() => { logout(); navigate('/partner/login'); }}
                                    className="btn btn-sm"
                                    style={{ color: 'var(--error-600)', background: 'rgba(220,38,38,0.08)', border: 'none' }}
                                >
                                    <FiLogOut /> Logout
                                </button>
                            ) : (
                                <Link to="/" className="btn btn-sm btn-outline">
                                    ← Back to Home
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    /* ====================================================
       MAIN HEADER
       ==================================================== */
    return (
        <>
            <header className={`header ${isScrolled ? 'header-scrolled' : 'header-transparent header-white'}`}>
                <div className="container">
                    <div className="header-inner">

                        {/* ---- LOGO ---- */}
                        <Link to="/" className="header-logo">
                            <img src="/logo.png" alt="Kamwalaa" className="header-logo-img" />
                        </Link>

                        {/* ---- DESKTOP NAV ---- */}
                        <nav className="nav-desktop" aria-label="Main navigation">
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

                        {/* ---- RIGHT ACTIONS ---- */}
                        <div className="header-actions">

                            {/* City Selector */}
                            <button
                                className="city-selector-btn"
                                onClick={changeCity}
                                aria-label="Change city"
                                title="Change city"
                            >
                                <FiMapPin className="city-icon" />
                                <span className="city-name">{selectedCity || 'City'}</span>
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                className="dark-mode-toggle"
                                onClick={toggleDark}
                                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                                title={isDark ? 'Light Mode' : 'Dark Mode'}
                            >
                                {isDark ? <FiSun /> : <FiMoon />}
                            </button>

                            {/* Language Selector */}
                            <div className="language-selector" ref={langRef}>
                                <button
                                    className="language-btn"
                                    onClick={() => setLangOpen(o => !o)}
                                    aria-expanded={isLangOpen}
                                    aria-haspopup="listbox"
                                >
                                    <span>{languages?.find(l => l.code === currentLanguage)?.name || 'EN'}</span>
                                    <FiChevronDown className={`dropdown-icon ${isLangOpen ? 'rotate' : ''}`} />
                                </button>

                                {isLangOpen && (
                                    <div className="language-dropdown" role="listbox">
                                        {languages?.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                                role="option"
                                                aria-selected={currentLanguage === lang.code}
                                                onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="cart-btn-wrapper">
                                <button
                                    className="cart-btn"
                                    onClick={toggleCart}
                                    aria-label={`Cart (${cartCount} items)`}
                                    id="cart-toggle-btn"
                                >
                                    <FiShoppingCart />
                                </button>
                                {cartCount > 0 && (
                                    <span className="cart-badge" aria-live="polite">{cartCount}</span>
                                )}
                            </div>

                            {/* Auth */}
                            {user ? (
                                <div className="user-menu-container" ref={userMenuRef}>
                                    <button
                                        className="user-menu-btn"
                                        onClick={() => setUserMenuOpen(o => !o)}
                                        aria-expanded={isUserMenuOpen}
                                        aria-haspopup="menu"
                                        id="user-menu-btn"
                                    >
                                        <div className="user-avatar" aria-hidden="true">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                                        </div>
                                        <span className="user-name">{user.name?.split(' ')[0] || 'Account'}</span>
                                        <FiChevronDown className={`dropdown-icon ${isUserMenuOpen ? 'rotate' : ''}`} />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="user-dropdown" role="menu" aria-labelledby="user-menu-btn">
                                            {/* Header info */}
                                            <div className="dropdown-header">
                                                <span className="dropdown-user-name">{user.name || 'User'}</span>
                                                <span className="dropdown-user-email">{user.email || user.phone || ''}</span>
                                            </div>

                                            <Link
                                                to="/bookings"
                                                className="dropdown-item"
                                                role="menuitem"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <FiBookmark className="dropdown-item-icon" /> My Bookings
                                            </Link>

                                            <Link
                                                to="/profile"
                                                className="dropdown-item"
                                                role="menuitem"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <FiUser className="dropdown-item-icon" /> Profile Settings
                                            </Link>

                                            {user.role === 'partner' && (
                                                <Link
                                                    to="/partner/dashboard"
                                                    className="dropdown-item"
                                                    role="menuitem"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <FiTrendingUp className="dropdown-item-icon" /> Partner Dashboard
                                                </Link>
                                            )}

                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="dropdown-item"
                                                    role="menuitem"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <FiSettings className="dropdown-item-icon" /> Admin Panel
                                                </Link>
                                            )}

                                            <div className="dropdown-divider" role="separator" />

                                            <button
                                                className="dropdown-item logout-item"
                                                role="menuitem"
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                    navigate('/login');
                                                }}
                                            >
                                                <FiLogOut className="dropdown-item-icon" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn btn-primary btn-sm"
                                    id="login-btn"
                                    style={{ borderRadius: 'var(--radius-full)' }}
                                >
                                    {t?.nav?.login || 'Login'}
                                </Link>
                            )}

                            {/* Mobile hamburger */}
                            <button
                                className="mobile-menu-toggle"
                                onClick={() => setMobileMenu(true)}
                                aria-label="Open menu"
                                id="mobile-menu-toggle"
                            >
                                <FiMenu />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ====================================================
          MOBILE MENU
          ==================================================== */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="mobile-menu-overlay"
                        onClick={() => setMobileMenu(false)}
                        aria-hidden="true"
                    />

                    <aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
                        {/* Mobile Header */}
                        <div className="mobile-menu-header">
                            <Link to="/" className="header-logo" onClick={() => setMobileMenu(false)}>
                                <img src="/logo.png" alt="Kamwalaa" className="header-logo-img" />
                            </Link>
                            <button
                                className="mobile-menu-close"
                                onClick={() => setMobileMenu(false)}
                                aria-label="Close menu"
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* User Info Card (if logged in) */}
                        {user && (
                            <div className="mobile-user-card">
                                <div className="avatar avatar-md avatar-royal">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                                </div>
                                <div className="mobile-user-info">
                                    <span className="mobile-user-name">{user.name || 'User'}</span>
                                    <span className="mobile-user-role">{user.role || 'customer'}</span>
                                </div>
                            </div>
                        )}

                        {/* Nav Links */}
                        <nav className="mobile-nav" aria-label="Mobile navigation">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        <span className="mobile-nav-icon"><Icon /></span>
                                        {link.label}
                                    </Link>
                                );
                            })}

                            {user && (
                                <>
                                    <div className="mobile-divider" />
                                    <Link
                                        to="/bookings"
                                        className="mobile-nav-link"
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        <span className="mobile-nav-icon"><FiBookmark /></span>
                                        My Bookings
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="mobile-nav-link"
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        <span className="mobile-nav-icon"><FiUser /></span>
                                        Profile
                                    </Link>
                                </>
                            )}

                            <div className="mobile-divider" />

                            {/* Dark mode in mobile */}
                            <button
                                className="mobile-nav-link"
                                onClick={toggleDark}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                            >
                                <span className="mobile-nav-icon">{isDark ? <FiSun /> : <FiMoon />}</span>
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </button>

                            {/* City in mobile */}
                            <button
                                className="mobile-nav-link"
                                onClick={() => { changeCity(); setMobileMenu(false); }}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                            >
                                <span className="mobile-nav-icon"><FiMapPin /></span>
                                {selectedCity || 'Select City'}
                            </button>
                        </nav>

                        {/* Bottom Auth Section */}
                        <div className="mobile-auth-section">
                            {user ? (
                                <button
                                    className="btn btn-sm"
                                    onClick={() => { logout(); setMobileMenu(false); navigate('/login'); }}
                                    style={{ color: 'var(--error-600)', background: 'rgba(220,38,38,0.08)', border: 'none', justifyContent: 'center' }}
                                >
                                    <FiLogOut /> Sign Out
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn btn-primary btn-full"
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        {t?.nav?.login || 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-outline btn-full"
                                        onClick={() => setMobileMenu(false)}
                                        style={{ borderRadius: 'var(--radius-lg)' }}
                                    >
                                        Sign Up Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </aside>
                </>
            )}

            {/* Cart Sidebar */}
            <CartSidebar />
        </>
    );
};

export default Header;
