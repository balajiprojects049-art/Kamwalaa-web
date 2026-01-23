import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/common/PageHero';
import RateServiceModal from '../components/common/RateServiceModal';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './UserBookings.css';

const UserBookings = () => {
    const { user } = useAuth();
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

    const handleReviewSubmit = (reviewData) => {
        console.log('Review Submitted:', reviewData);
        alert('Thank you for your feedback!');
        setSelectedBookingForReview(null);
    };

    const handleInvoice = (booking) => {
        alert(`Downloading Invoice for Booking #${booking.id}...\n(In a real app, this would download a PDF)`);
    };

    // Mock Data - In real app, fetch from API
    const bookings = [
        {
            id: 'BK1001',
            service: 'AC Repair',
            status: 'Completed',
            date: '2023-10-15',
            time: '10:00 AM',
            amount: '₹499',
            professional: 'Rahul Kumar'
        },
        {
            id: 'BK1002',
            service: 'Home Cleaning',
            status: 'Upcoming',
            date: '2023-11-20',
            time: '02:00 PM',
            amount: '₹1499',
            professional: 'Assigning...'
        }
    ];

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
            <PageHero title="My Bookings" subtitle="Track your service history" />

            <div className="container bookings-container">
                {bookings.length === 0 ? (
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
