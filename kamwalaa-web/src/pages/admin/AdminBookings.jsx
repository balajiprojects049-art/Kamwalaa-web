import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaCheck,
    FaTimes,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt
} from 'react-icons/fa';
import './AdminBookings.css';

const AdminBookings = () => {
    const { showToast } = useToast();

    // Mock Bookings Data
    const [bookings, setBookings] = useState([
        {
            id: 'BK-1001',
            customerName: 'Rajesh Kumar',
            service: 'AC Repair & Service',
            category: 'Appliance Repair',
            date: '2025-01-24',
            time: '10:00 AM',
            status: 'Pending',
            amount: '₹499',
            address: 'H.No 12-3, Gachibowli, Hyderabad',
            phone: '+91 98765 43210'
        },
        {
            id: 'BK-1002',
            customerName: 'Sneha Reddy',
            service: 'Full House Cleaning',
            category: 'Cleaning',
            date: '2025-01-23',
            time: '02:00 PM',
            status: 'Confirmed',
            amount: '₹2,499',
            address: 'Flat 404, Sunshine Apts, Madhapur',
            phone: '+91 98765 12345'
        },
        {
            id: 'BK-1003',
            customerName: 'Amit Shah',
            service: 'Plumbing Repair',
            category: 'Plumbing',
            date: '2025-01-22',
            time: '11:30 AM',
            status: 'Completed',
            amount: '₹350',
            address: 'Plot 45, Jubliee Hills',
            phone: '+91 99887 76655'
        },
        {
            id: 'BK-1004',
            customerName: 'Priya Singh',
            service: 'Salon at Home',
            category: 'Beauty',
            date: '2025-01-25',
            time: '04:00 PM',
            status: 'Pending',
            amount: '₹1,200',
            address: 'Villa 12, Palm Meadows',
            phone: '+91 88776 65544'
        },
        {
            id: 'BK-1005',
            customerName: 'David John',
            service: 'Carpenter Work',
            category: 'Carpentry',
            date: '2025-01-21',
            time: '09:00 AM',
            status: 'Cancelled',
            amount: '₹800',
            address: 'Secunderabad',
            phone: '+91 77665 54433'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
        const matchesSearch =
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Action Handlers
    const handleStatusUpdate = (id, newStatus) => {
        setBookings(prev => prev.map(b =>
            b.id === id ? { ...b, status: newStatus } : b
        ));

        let msgType = 'info';
        if (newStatus === 'Confirmed') msgType = 'success';
        if (newStatus === 'Cancelled') msgType = 'error';
        if (newStatus === 'Completed') msgType = 'success';

        showToast(`Booking ${id} marked as ${newStatus}`, msgType);
        if (selectedBooking) setSelectedBooking(null); // Close modal if open
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Confirmed': return 'status-confirmed';
            case 'Completed': return 'status-completed';
            case 'Cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    };

    return (
        <div className="admin-bookings-container">
            <div className="bookings-header">
                <div>
                    <h1>Bookings Management</h1>
                    <p>Track and manage customer appointments</p>
                </div>
                <div className="header-stats">
                    <div className="stat-pill">
                        Total: <span>{bookings.length}</span>
                    </div>
                    <div className="stat-pill pending">
                        Pending: <span>{bookings.filter(b => b.status === 'Pending').length}</span>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="controls-bar">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by ID, Name, Service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-wrapper">
                    <FaFilter className="filter-icon" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bookings-table-card">
                <div className="table-responsive">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Service Info</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="id-cell">{booking.id}</td>
                                        <td>
                                            <div className="customer-info">
                                                <span className="customer-name">{booking.customerName}</span>
                                                <span className="customer-phone">{booking.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="service-info">
                                                <span className="service-name">{booking.service}</span>
                                                <span className="service-cat">{booking.category}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="datetime-info">
                                                <span><FaCalendarAlt /> {booking.date}</span>
                                                <span><FaClock /> {booking.time}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="amount-cell">{booking.amount}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="icon-btn view-btn"
                                                    onClick={() => setSelectedBooking(booking)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>

                                                {booking.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            className="icon-btn confirm-btn"
                                                            onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                                                            title="Confirm Booking"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            className="icon-btn cancel-btn"
                                                            onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                            title="Reject Booking"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'Confirmed' && (
                                                    <button
                                                        className="icon-btn complete-btn"
                                                        onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="modal-content booking-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Booking Details</h2>
                            <button className="close-btn" onClick={() => setSelectedBooking(null)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="booking-details-grid">
                            <div className="detail-group">
                                <label>Booking ID</label>
                                <p className="highlight-text">{selectedBooking.id}</p>
                            </div>
                            <div className="detail-group">
                                <label>Status</label>
                                <span className={`status-badge ${getStatusColor(selectedBooking.status)}`}>
                                    {selectedBooking.status}
                                </span>
                            </div>

                            <div className="detail-divider"></div>

                            <div className="detail-group">
                                <label>Customer Name</label>
                                <p>{selectedBooking.customerName}</p>
                            </div>
                            <div className="detail-group">
                                <label>Phone Number</label>
                                <p>{selectedBooking.phone}</p>
                            </div>
                            <div className="detail-group full-width">
                                <label>Service Address</label>
                                <p className="address-text"><FaMapMarkerAlt /> {selectedBooking.address}</p>
                            </div>

                            <div className="detail-divider"></div>

                            <div className="detail-group">
                                <label>Service Requested</label>
                                <p>{selectedBooking.service}</p>
                            </div>
                            <div className="detail-group">
                                <label>Date & Time</label>
                                <p>{selectedBooking.date} at {selectedBooking.time}</p>
                            </div>
                            <div className="detail-group">
                                <label>Total Amount</label>
                                <p className="price-text">{selectedBooking.amount}</p>
                            </div>
                        </div>

                        <div className="modal-actions">
                            {selectedBooking.status === 'Pending' && (
                                <>
                                    <button
                                        className="action-btn reject"
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'Cancelled')}
                                    >
                                        Reject Booking
                                    </button>
                                    <button
                                        className="action-btn accept"
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'Confirmed')}
                                    >
                                        Accept Booking
                                    </button>
                                </>
                            )}
                            <button className="cancel-btn" onClick={() => setSelectedBooking(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
