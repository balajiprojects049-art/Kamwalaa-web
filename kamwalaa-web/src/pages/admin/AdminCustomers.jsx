import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAllUsers } from '../../services/apiService';
import {
    FaSearch,
    FaUser,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaEllipsisV,
    FaBan,
    FaTrash
} from 'react-icons/fa';
import './AdminCustomers.css';

const AdminCustomers = () => {
    const { showToast } = useToast();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getAllUsers();
                if (response.success && response.data) {
                    // Normalize data format
                    const formattedUsers = response.data.map(user => ({
                        id: user.id.toString(),
                        name: user.name || 'Unknown',
                        email: user.email || 'No Email',
                        phone: user.phone ? `+91 ${user.phone}` : 'N/A',
                        location: user.location || 'N/A',
                        totalBookings: parseInt(user.total_bookings) || 0,
                        totalSpent: `₹${parseFloat(user.total_spent) || 0}`,
                        status: user.role === 'admin' ? 'Admin' : 'Active', // Simple logic for now
                        joinedDate: new Date(user.joined_date).toLocaleDateString()
                    }));
                    setCustomers(formattedUsers);
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
                showToast('Failed to load customers', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [showToast]);

    const [searchTerm, setSearchTerm] = useState('');
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    // Filter Logic
    // Filter Logic
    const filteredCustomers = customers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchTerm))
    );

    // Handlers
    const handleBlockUser = (id) => {
        if (window.confirm('Are you sure you want to block this user?')) {
            setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked' } : c));
            showToast('User has been blocked', 'warning');
            setActionMenuOpen(null);
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            setCustomers(prev => prev.filter(c => c.id !== id));
            showToast('User deleted successfully', 'success');
            setActionMenuOpen(null);
        }
    };

    return (
        <div className="admin-customers-container">
            <div className="customers-header">
                <div>
                    <h1>Customer Management</h1>
                    <p>View and manage all registered users</p>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{customers.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Active</span>
                        <span className="stat-value">{customers.filter(c => c.status === 'Active').length}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="customers-controls">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="export-btn">Export CSV</button>
            </div>

            {/* Customers List */}
            {/* Customers List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="customer-card">
                            <div className="card-header">
                                <div className="user-avatar">
                                    <FaUser />
                                </div>
                                <div className="user-basic-info">
                                    <h3>{customer.name}</h3>
                                    <span className={`status-dot ${customer.status.toLowerCase()}`}>
                                        {customer.status}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <FaEnvelope className="info-icon" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="info-row">
                                    <FaPhoneAlt className="info-icon" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="info-row">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <span>{customer.location}</span>
                                </div>

                                <div className="stats-row">
                                    <div className="stat-item">
                                        <label>Bookings</label>
                                        <span>{customer.totalBookings}</span>
                                    </div>
                                    <div className="stat-item">
                                        <label>Spent</label>
                                        <span>{customer.totalSpent}</span>
                                    </div>
                                    <div className="stat-item">
                                        <label>Joined</label>
                                        <span>{customer.joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredCustomers.length === 0 && (
                <div className="no-results">
                    <p>No customers found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
