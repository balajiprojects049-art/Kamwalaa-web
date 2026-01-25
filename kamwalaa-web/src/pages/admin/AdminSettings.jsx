import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
    FaUserCog,
    FaLock,
    FaBell,
    FaGlobe,
    FaPalette,
    FaArrowRight,
    FaSave,
    FaMoon,
    FaSun
} from 'react-icons/fa';
import './AdminSettings.css';

const AdminSettings = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(true); // Default matching admin theme

    // Profile Settings State
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@kamwalaa.com',
        phone: '+91 98765 43210',
        role: 'Super Admin'
    });

    // Password State
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Appearance State
    const [appearance, setAppearance] = useState({
        sidebarCollapsed: false,
        density: 'comfortable'
    });

    // Notification State
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        browserPush: false,
        newBooking: true,
        userSignup: true,
        marketing: false
    });

    // Handlers
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        showToast('Profile information updated successfully', 'success');
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            showToast('New passwords do not match', 'error');
            return;
        }
        showToast('Password changed successfully', 'success');
        setPassword({ current: '', new: '', confirm: '' });
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        showToast('Notification preference saved', 'info');
    };

    return (
        <div className="admin-settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar Navigation */}
                <div className="settings-sidebar">
                    <button
                        className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUserCog /> Profile Settings
                    </button>
                    <button
                        className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <FaLock /> Security
                    </button>
                    <button
                        className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <FaPalette /> Appearance
                    </button>
                    <button
                        className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FaBell /> Notifications
                    </button>
                </div>

                {/* Content Area */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-panel">
                            <h2>Profile Information</h2>
                            <p className="panel-desc">Update your account's profile information and email address.</p>

                            <form onSubmit={handleProfileUpdate} className="settings-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="settings-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="settings-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="settings-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        disabled
                                        className="settings-input disabled"
                                    />
                                    <span className="helper-text">Role cannot be changed.</span>
                                </div>

                                <button type="submit" className="save-btn">
                                    <FaSave /> Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-panel">
                            <h2>Security Settings</h2>
                            <p className="panel-desc">Ensure your account is secure along with a strong password.</p>

                            <form onSubmit={handlePasswordUpdate} className="settings-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={password.current}
                                        onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                        className="settings-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={password.new}
                                        onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                        className="settings-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={password.confirm}
                                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                        className="settings-input"
                                        required
                                    />
                                </div>

                                <button type="submit" className="save-btn">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="settings-panel">
                            <h2>Appearance</h2>
                            <p className="panel-desc">Customize how the admin panel looks on your device.</p>

                            <div className="appearance-options">
                                <div className="option-row">
                                    <div className="option-info">
                                        <h3>Theme</h3>
                                        <p>Select your preferred interface theme.</p>
                                    </div>
                                    <div className="theme-toggle">
                                        <button
                                            className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
                                            onClick={() => setIsDarkMode(false)}
                                        >
                                            <FaSun /> Light
                                        </button>
                                        <button
                                            className={`theme-btn ${isDarkMode ? 'active' : ''}`}
                                            onClick={() => setIsDarkMode(true)}
                                        >
                                            <FaMoon /> Dark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-panel">
                            <h2>Notifications</h2>
                            <p className="panel-desc">Manage how you receive notifications and alerts.</p>

                            <div className="notification-list">
                                <div className="notification-item">
                                    <div className="notif-info">
                                        <h3>New Booking Alerts</h3>
                                        <p>Get notified when a new booking is received.</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.newBooking}
                                            onChange={() => toggleNotification('newBooking')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notification-item">
                                    <div className="notif-info">
                                        <h3>New User Signups</h3>
                                        <p>Get notified when a new user registers.</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.userSignup}
                                            onChange={() => toggleNotification('userSignup')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notification-item">
                                    <div className="notif-info">
                                        <h3>Email Notifications</h3>
                                        <p>Receive daily summaries via email.</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications.emailAlerts}
                                            onChange={() => toggleNotification('emailAlerts')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
