import React, { useState, useEffect } from 'react';
import { getCurrentPartner, getPartnerBookings, updateBookingStatus } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FaClipboardCheck, FaMapMarkerAlt, FaPhone, FaClock, FaCheckCircle, FaUser } from 'react-icons/fa';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const [partner, setPartner] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Get Partner Profile
            const partnerRes = await getCurrentPartner();
            if (partnerRes.success) {
                setPartner(partnerRes.data);

                // 2. Get Bookings
                const bookingsRes = await getPartnerBookings(partnerRes.data.id);
                if (bookingsRes.success) {
                    setBookings(bookingsRes.data);
                }
            }
        } catch (err) {
            console.error(err);
            // Don't show error if it's just 404 (not a partner yet)
            if (err.response?.status !== 404) {
                error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (bookingId) => {
        if (!window.confirm('Are you sure you have completed this service? This will notify the admin and customer.')) return;

        try {
            const res = await updateBookingStatus(bookingId, 'completed');
            if (res.success) {
                success('Job marked as completed!');
                fetchData(); // Refresh
            }
        } catch (err) {
            console.error(err);
            error('Failed to update status');
        }
    };

    if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

    if (!partner) {
        return (
            <div className="partner-dashboard-container">
                <div className="no-access-card">
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h2>Partner Access Required</h2>
                        <p style={{ color: '#64748b', margin: '10px 0 20px' }}>
                            No service partner profile was found linked to your account.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <a href="/partner/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Register as a Partner
                            </a>
                            <a href="/partner/login" className="btn btn-secondary" style={{ textDecoration: 'none', background: '#e2e8f0', color: '#1e293b' }}>
                                Login as Partner
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="partner-dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Partner Dashboard</h1>
                    <p>Welcome back, {partner.business_name || user.name}</p>
                </div>
                <div className="header-stats">
                    <div className="stat-box">
                        <span className="stat-value">{bookings.filter(b => b.status === 'completed').length}</span>
                        <span className="stat-label">Completed Jobs</span>
                    </div>
                    <div className="stat-box active">
                        <span className="stat-value">{bookings.filter(b => b.status === 'assigned' || b.status === 'in_progress').length}</span>
                        <span className="stat-label">Active Jobs</span>
                    </div>
                </div>
            </div>

            {/* Jobs List */}
            <div className="jobs-section">
                <h2>Assigned Jobs</h2>
                {bookings.length === 0 ? (
                    <div className="no-jobs">
                        <FaClipboardCheck size={48} color="#cbd5e1" />
                        <p>No jobs assigned yet.</p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {bookings.map(booking => (
                            <div key={booking.id} className={`job-card ${booking.status}`}>
                                <div className="job-header">
                                    <span className="job-id">#{booking.booking_number}</span>
                                    <span className={`status-badge ${booking.status}`}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="job-body">
                                    <h3 className="service-title">{booking.service_name}</h3>

                                    <div className="job-detail">
                                        <FaUser className="icon" />
                                        <span>{booking.customer_name}</span>
                                    </div>
                                    <div className="job-detail">
                                        <FaPhone className="icon" />
                                        <a href={`tel:${booking.customer_phone}`}>{booking.customer_phone}</a>
                                    </div>
                                    <div className="job-detail">
                                        <FaMapMarkerAlt className="icon" />
                                        <span>{booking.address_line1}, {booking.city}</span>
                                    </div>
                                    <div className="job-detail">
                                        <FaClock className="icon" />
                                        <span>
                                            {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                                        </span>
                                    </div>

                                    {booking.special_instructions && (
                                        <div className="job-instructions">
                                            <strong>Note:</strong> {booking.special_instructions}
                                        </div>
                                    )}
                                </div>

                                <div className="job-footer">
                                    {(booking.status === 'assigned' || booking.status === 'in_progress') ? (
                                        <button
                                            className="btn-complete"
                                            onClick={() => handleComplete(booking.id)}
                                        >
                                            <FaCheckCircle /> Mark as Completed
                                        </button>
                                    ) : (
                                        <div className="completed-msg">
                                            {booking.status === 'completed' && <span><FaCheckCircle /> Completed</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerDashboard;
