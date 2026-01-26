import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';
import { getUserBookings } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { generateInvoice } from '../utils/generateInvoice';
import PageHero from '../components/common/PageHero';
import RateServiceModal from '../components/common/RateServiceModal';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './UserBookings.css';

const UserBookings = () => {
    const { user } = useAuth();
    const toast = useToast();
    const modal = useModal();
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

    const handleReviewSubmit = (reviewData) => {
        console.log('Review Submitted:', reviewData);
        toast.success('Thank you for your feedback!');
        setSelectedBookingForReview(null);
    };

    const handleInvoice = async (booking) => {
        try {
            // Check if booking is completed/paid (optional logic)
            toast.info('Generating invoice...', 2000);
            await generateInvoice(booking, user);
            toast.success('Invoice downloaded successfully');
        } catch (error) {
            console.error('Invoice generation failed:', error);
            toast.error('Could not generate invoice');
        }
    };

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.id) {
                try {
                    const response = await getUserBookings(user.id);
                    if (response.success) {
                        const formatted = response.data.map(b => ({
                            id: b.booking_number,
                            service: b.service_name || 'Service',
                            status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                            date: new Date(b.booking_date).toLocaleDateString(),
                            time: b.booking_time,
                            amount: `₹${b.total_amount}`,
                            professional: b.partner_name || 'Assigning...'
                        }));
                        setBookings(formatted);
                    }
                } catch (error) {
                    console.error('Error loading bookings:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (!user) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Please log in to view your bookings</h2>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login Now</Link>
            </div>
        );
    }

    return (
        <div className="user-bookings-page">
            <PageHero
                title="My Bookings"
                subtitle="Track your service history"
                backgroundImage="/assets/images/hero/user-bookings-hero.jpg"
                bgPosition="center center"
            />

            <div className="container bookings-container">
                {loading ? (
                    <div className="no-bookings">
                        <h3>Loading your bookings...</h3>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="no-bookings">
                        <h3>No bookings yet</h3>
                        <Link to="/services" className="btn btn-primary">Book a Service</Link>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                {/* Header: ID and Status */}
                                <div className="booking-header">
                                    <span className="booking-id">ID: {booking.id}</span>
                                    <span className={`booking-status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Body: Service Info and Price */}
                                <div className="booking-body">
                                    <div className="booking-info">
                                        <h3 className="booking-service">{booking.service}</h3>
                                        <div className="booking-details">
                                            <div className="detail-item">
                                                <FiCalendar /> <span>{booking.date}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FiClock /> <span>{booking.time}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FiMapPin /> <span>{user.address || 'Home Address'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="booking-price-tag">
                                        <span className="label">Total Amount</span>
                                        <span className="amount">{booking.amount}</span>
                                    </div>
                                </div>

                                {/* Footer: Actions */}
                                {booking.status === 'Completed' && (
                                    <div className="booking-footer">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => setSelectedBookingForReview(booking)}
                                        >
                                            <FiCheckCircle style={{ marginRight: '0.5rem' }} /> Rate Service
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleInvoice(booking)}
                                        >
                                            Invoice
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rate Service Modal */}
            {selectedBookingForReview && (
                <RateServiceModal
                    booking={selectedBookingForReview}
                    onClose={() => setSelectedBookingForReview(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
};

export default UserBookings;
