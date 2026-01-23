import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiMapPin, FiClock, FiHome } from 'react-icons/fi';
import './BookingSuccess.css';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingDetails = location.state || {};

    if (!bookingDetails.bookingId) {
        navigate('/');
        return null;
    }

    return (
        <div className="booking-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <FiCheckCircle />
                </div>
                <h1>Booking Confirmed!</h1>
                <p className="success-message">
                    Your service request has been successfully placed. Our service provider will contact you shortly.
                </p>

                <div className="booking-id">
                    <span>Booking ID:</span>
                    <strong>{bookingDetails.bookingId}</strong>
                </div>

                <div className="booking-details-card">
                    <h3>Booking Details</h3>

                    <div className="detail-row">
                        <FiMapPin />
                        <div>
                            <h4>Service Address</h4>
                            <p>{bookingDetails.fullName}</p>
                            <p>{bookingDetails.address}, {bookingDetails.city}</p>
                            <p>{bookingDetails.pincode}</p>
                            {bookingDetails.landmark && <p>Landmark: {bookingDetails.landmark}</p>}
                        </div>
                    </div>

                    <div className="detail-row">
                        <FiCalendar />
                        <div>
                            <h4>Service Date</h4>
                            <p>{new Date(bookingDetails.date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <FiClock />
                        <div>
                            <h4>Time Slot</h4>
                            <p>{bookingDetails.timeSlot}</p>
                        </div>
                    </div>

                    {bookingDetails.specialInstructions && (
                        <div className="detail-row">
                            <div>
                                <h4>Special Instructions</h4>
                                <p>{bookingDetails.specialInstructions}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="next-steps">
                    <h3>What happens next?</h3>
                    <div className="steps-list">
                        <div className="step-item">
                            <span className="step-num">1</span>
                            <p>Service provider will verify your booking and contact you</p>
                        </div>
                        <div className="step-item">
                            <span className="step-num">2</span>
                            <p>They will confirm the service scope and final pricing</p>
                        </div>
                        <div className="step-item">
                            <span className="step-num">3</span>
                            <p>Professional will arrive at your scheduled time</p>
                        </div>
                        <div className="step-item">
                            <span className="step-num">4</span>
                            <p>Complete the service and make payment</p>
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <Link to="/" className="btn btn-primary">
                        <FiHome />
                        Back to Home
                    </Link>
                    <Link to="/services" className="btn btn-outline">
                        Browse More Services
                    </Link>
                </div>

                <div className="support-info">
                    <p>Need help with your booking?</p>
                    <p>Contact us: <a href="tel:+919876543210">+91 98765 43210</a> | <a href="mailto:support@kamwalaa.com">support@kamwalaa.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
