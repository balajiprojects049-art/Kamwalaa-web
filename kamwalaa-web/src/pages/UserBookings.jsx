import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/common/PageHero';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './UserBookings.css';

const UserBookings = () => {
    const { user } = useAuth();

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
                                <div className="booking-header">
                                    <div className="booking-id">#{booking.id}</div>
                                    <div className={`booking-status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                <h3 className="booking-service">{booking.service}</h3>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <FiCalendar /> {booking.date}
                                    </div>
                                    <div className="detail-item">
                                        <FiClock /> {booking.time}
                                    </div>
                                    <div className="detail-item">
                                        <FiMapPin /> {user.address || 'Home Address'}
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="booking-amount">{booking.amount}</div>
                                    {booking.status === 'Completed' && (
                                        <button className="btn btn-sm btn-outline">Rate Service</button>
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

export default UserBookings;
