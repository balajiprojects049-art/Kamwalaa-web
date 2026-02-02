import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiPackage, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/apiService';
import PageHero from '../components/common/PageHero';
import './MyBookings.css';

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(user.id);
                if (response.success) {
                    setBookings(response.data);
                } else {
                    setError('Failed to fetch bookings');
                }
            } catch (err) {
                console.error('Error loading bookings:', err);
                setError('Failed to load your bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'confirmed': return 'primary';
            case 'in_progress': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'gray';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FiLoader className="spinner" />
                <p>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <PageHero
                title="My Bookings"
                subtitle="Manage your service requests and view history"
                backgroundImage="/assets/images/hero/services-hero.jpg"
            />

            <div className="container section">
                {error && (
                    <div className="error-alert">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                {bookings.length === 0 && !error ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>No Bookings Found</h3>
                        <p>You haven't booked any services yet.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/services')}
                        >
                            Explore Services
                        </button>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-id">
                                        <span className="label">Booking ID:</span>
                                        <span className="value">#{booking.booking_number}</span>
                                    </div>
                                    <div className={`booking-status status-${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="booking-body">
                                    <div className="booking-service">
                                        <div className="service-icon">
                                            {booking.service_image ? (
                                                <img src={booking.service_image} alt={booking.service_name} />
                                            ) : (
                                                <FiPackage />
                                            )}
                                        </div>
                                        <div className="service-info">
                                            <h3>{booking.service_name}</h3>
                                            <p className="partner-name">
                                                {booking.partner_name ? `By ${booking.partner_name}` : 'Partner to be assigned'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-item">
                                            <FiCalendar />
                                            <span>{formatDate(booking.booking_date)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiClock />
                                            <span>{booking.booking_time}</span>
                                        </div>
                                        <div className="detail-item price">
                                            <span>Total:</span>
                                            <strong>₹{booking.total_amount}</strong>
                                        </div>
                                    </div>

                                    <div className="booking-address">
                                        <FiMapPin />
                                        <p>{booking.address_line1}, {booking.city} - {booking.pincode}</p>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    {booking.status === 'pending' && (
                                        <button className="btn btn-outline-danger btn-sm">Cancel Booking</button>
                                    )}
                                    <button className="btn btn-outline btn-sm">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
