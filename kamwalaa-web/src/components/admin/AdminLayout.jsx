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
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { initSocket, joinAdminRoom } from '../../services/socketService';
import './AdminLayout.css';

// Simple Notification Sound (Data URI)
const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // Placeholder shortened

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
    const [scrolled, setScrolled] = useState(false);

    // Perist Notifications
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('adminNotifications');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [showNotifications, setShowNotifications] = useState(false);

    // Save on change
    useEffect(() => {
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }, [notifications]);

    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Audio Ref
    const audioRef = React.useRef(null);

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

    // Socket.io Notification Listener
    useEffect(() => {
        // Initialize Notification Sound - Using a reliable ping sound
        audioRef.current = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/Galaxy/pixel.mp3');
        audioRef.current.volume = 1.0;

        const socket = initSocket();

        const onConnect = () => {
            joinAdminRoom();
        };

        const onNewBooking = (data) => {
            console.log('🔔 Notification:', data);

            // Add to Notification List
            const newNotif = {
                id: Date.now(),
                message: data.message,
                bookingId: data.bookingId, // To navigate on click in future
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setNotifications(prev => [newNotif, ...prev]);

            // Play Sound
            if (audioRef.current) {
                audioRef.current.currentTime = 0; // Reset to start
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.warn('Sound blocked. Interaction required.', err);
                    });
                }
            }

            // Show Toast with custom style/icon
            toast.info(`🔔 ${data.message}`, 8000);
        };

        socket.on('connect', onConnect);
        socket.on('new_booking', onNewBooking);

        // If already connected, join immediately
        if (socket.connected) {
            joinAdminRoom();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('new_booking', onNewBooking);
        };
    }, [toast]);

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
                        <img src="/logo.png" alt="Kamwalaa Logo" style={{ height: '40px', width: 'auto' }} />
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

                    <div className="admin-header-actions" style={{ position: 'relative' }}>
                        <button
                            className="icon-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <FaBell />
                            {notifications.length > 0 && (
                                <span className="notification-badge">{notifications.length}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notif-header">
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Notifications</span>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setNotifications([]); }}
                                            style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="notif-list">
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                className="notif-item"
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    navigate('/admin/bookings');
                                                }}
                                            >
                                                <div className="notif-content">
                                                    <p className="notif-msg">{n.message}</p>
                                                    <span className="notif-time">{n.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
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
