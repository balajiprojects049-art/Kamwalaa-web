import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    FaChartPie,
    FaCalendarAlt,
    FaTools,
    FaUsers,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaBell,
    FaSearch
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for authentication
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }

        // Scroll handler for header styling
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard' },
        { path: '/admin/bookings', icon: <FaCalendarAlt />, label: 'Bookings' },
        { path: '/admin/services', icon: <FaTools />, label: 'Services' },
        { path: '/admin/customers', icon: <FaUsers />, label: 'Customers' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'} lg:open`}> {/* Note: lg:open isn't real CSS, handled by media query in CSS file */}
                <div className="admin-sidebar-header">
                    <Link to="/admin/dashboard" className="admin-logo-link">
                        <span style={{ fontSize: '1.5rem' }}>🛠️</span>
                        <span className="admin-logo-text">Kamwalaa</span>
                    </Link>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-profile">
                        <div className="admin-avatar">A</div>
                        <div className="admin-user-info">
                            <p className="admin-user-name">Admin User</p>
                            <p className="admin-user-email">admin@kamwalaa.com</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main-wrapper">
                <header className={`admin-header ${scrolled ? 'scrolled' : ''}`}>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="admin-toggle-btn"
                    >
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className="admin-search">
                        <FaSearch color="#9ca3af" />
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="admin-header-actions">
                        <button className="icon-btn">
                            <FaBell />
                            <span className="notification-badge"></span>
                        </button>
                    </div>
                </header>

                <main className="admin-content-area">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="mobile-overlay lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminLayout;
