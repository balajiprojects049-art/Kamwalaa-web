import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaCheckCircle,
    FaBan,
    FaTimes,
    FaTrash,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { getAllBookings, updateBookingStatus } from '../../services/apiService';
import './AdminBookings.css';

const AdminBookings = () => {
    const { showToast } = useToast();

    // Mock Bookings Data
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings();
            if (response.success) {
                // Transform data to match existing component structure
                const formattedBookings = response.data.map(b => ({
                    id: b.id.toString(), // Ensure string (UUID)
                    displayId: b.booking_number, // User friendly ID
                    customerName: b.customer_name || 'Guest',
                    service: b.service_name || 'Unknown Service',
                    category: b.service_category || 'General',
                    date: b.booking_date ? new Date(b.booking_date).toISOString().split('T')[0] : 'N/A',
                    time: b.booking_time,
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1), // Capitalize
                    amount: `₹${b.total_amount}`,
                    address: `${b.address_line1}, ${b.city}`,
                    phone: b.customer_phone || 'N/A',
                    paymentMethod: b.payment_method || 'Cash',
                    instructions: b.special_instructions || 'None'
                }));
                setBookings(formattedBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            showToast('Failed to fetch bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const apiStatus = newStatus.toLowerCase(); // Backend expects lowercase
            const response = await updateBookingStatus(id, apiStatus);

            if (response.success) {
                setBookings(prev => prev.map(b =>
                    b.id === id ? { ...b, status: newStatus } : b
                ));

                let msgType = 'info';
                if (newStatus === 'Confirmed') msgType = 'success';
                if (newStatus === 'Cancelled') msgType = 'error';
                if (newStatus === 'Completed') msgType = 'success';

                showToast(`Booking marked as ${newStatus}`, msgType);
                if (selectedBooking) setSelectedBooking(null); // Close modal if open
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status', 'error');
        }
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                        Loading bookings...
                                    </td>
                                </tr>
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="id-cell">{booking.displayId}</td>
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
                                                            <FaCheckCircle />
                                                        </button>
                                                        <button
                                                            className="icon-btn reject-btn"
                                                            onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                            title="Reject Booking"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'Confirmed' && (
                                                    <button
                                                        className="icon-btn complete-btn"
                                                        onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheckCircle />
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
                                <p className="highlight-text">{selectedBooking.displayId}</p>
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
                            <div className="detail-group">
                                <label>Payment Method</label>
                                <p style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                    {selectedBooking.paymentMethod === 'online' ? 'Online (Prepaid)' : 'Cash on Service'}
                                </p>
                            </div>
                            <div className="detail-group full-width">
                                <label>Special Instructions</label>
                                <p style={{
                                    backgroundColor: '#f9fafb',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e5e7eb',
                                    marginTop: '0.25rem'
                                }}>
                                    {selectedBooking.instructions}
                                </p>
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
