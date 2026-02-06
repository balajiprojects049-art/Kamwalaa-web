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
    FaMapMarkerAlt,
    FaUserPlus
} from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { getAllBookings, updateBookingStatus, getAllPartners, assignPartner } from '../../services/apiService';
import './AdminBookings.css';

const AdminBookings = () => {
    const { showToast } = useToast();

    // Mock Bookings Data
    const [bookings, setBookings] = useState([]);
    const [partners, setPartners] = useState([]); // State for partners
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false); // Modal state
    const [selectedPartner, setSelectedPartner] = useState('');

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
                    instructions: b.special_instructions || 'None',
                    partnerName: b.partner_name || null // Add partner name
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

    const fetchPartners = async () => {
        try {
            const response = await getAllPartners();
            if (response.success) {
                setPartners(response.data);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchPartners(); // Fetch partners on load
    }, []);

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

    const handleAssignPartner = async () => {
        if (!selectedPartner || !selectedBooking) {
            showToast('Please select a partner', 'error');
            return;
        }

        try {
            const response = await assignPartner(selectedBooking.id, selectedPartner);
            if (response.success) {
                showToast('Partner assigned successfully!', 'success');
                setShowAssignModal(false);
                setSelectedPartner('');
                fetchBookings(); // Refresh bookings to show assigned status/partner
            }
        } catch (error) {
            console.error('Error assigning partner:', error);
            showToast('Failed to assign partner', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Confirmed': return 'status-confirmed';
            case 'Assigned': return 'status-confirmed'; // Reuse confirmed color or add new
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
                        <option value="Assigned">Assigned</option>
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
                                                {booking.partnerName && (
                                                    <span style={{ fontSize: '0.8rem', color: '#1a73e8', display: 'block' }}>
                                                        Valet: {booking.partnerName}
                                                    </span>
                                                )}
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
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Allow Assign Partner for Confirmed Bookings */}
                                                {(booking.status === 'Confirmed' || booking.status === 'Assigned') && (
                                                    <button
                                                        className="icon-btn confirm-btn"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowAssignModal(true);
                                                        }}
                                                        style={{ backgroundColor: '#2563eb' }}
                                                        title="Assign Partner"
                                                    >
                                                        <FaUserPlus />
                                                    </button>
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
            {selectedBooking && !showAssignModal && (
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

                            {/* Assign Partner Button inside View Modal */}
                            {selectedBooking.status === 'Confirmed' && (
                                <button
                                    className="action-btn accept"
                                    onClick={() => setShowAssignModal(true)}
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    Assign Partner
                                </button>
                            )}

                            <button className="cancel-btn" onClick={() => setSelectedBooking(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Partner Modal */}
            {showAssignModal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal-content booking-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Assign Partner</h2>
                            <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <p style={{ marginBottom: '10px' }}>Assign a service partner for Booking <strong>{selectedBooking.displayId}</strong></p>

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Partner</label>
                            <select
                                value={selectedPartner}
                                onChange={(e) => setSelectedPartner(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    marginBottom: '20px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">-- Choose a Partner --</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.business_name} ({p.contact_phone})
                                    </option>
                                ))}
                            </select>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowAssignModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="action-btn accept"
                                    onClick={handleAssignPartner}
                                    disabled={!selectedPartner}
                                    style={{ opacity: !selectedPartner ? 0.5 : 1 }}
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
