import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAllUsers, deleteUser } from '../../services/apiService';
import {
    FaSearch,
    FaUser,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaEllipsisV,
    FaBan,
    FaTrash,
    FaEdit
} from 'react-icons/fa';
import './AdminCustomers.css';

const AdminCustomers = () => {
    const { showToast } = useToast();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers();
            if (response.success && response.data) {
                // Normalize data format using actual database fields
                const formattedUsers = response.data.map(user => ({
                    id: user.id,
                    name: user.name || 'Unknown User',
                    email: user.email || 'No Email',
                    phone: user.phone ? `+91 ${user.phone}` : 'N/A',
                    location: user.city || user.location || 'N/A',
                    totalBookings: user.total_bookings || 0,
                    totalSpent: user.total_spent ? `₹${user.total_spent}` : '₹0',
                    status: user.role === 'admin' ? 'Admin' : 'Active',
                    joinedDate: user.joined_date ? new Date(user.joined_date).toLocaleDateString() : 'N/A'
                }));
                setCustomers(formattedUsers);
            } else {
                showToast('No customer data available', 'info');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            showToast('Failed to load customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredCustomers = customers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchTerm))
    );

    // Handlers
    const toggleActionMenu = (id, e) => {
        e.stopPropagation();
        setActionMenuOpen(actionMenuOpen === id ? null : id);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActionMenuOpen(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleBlockUser = (id) => {
        if (window.confirm('Are you sure you want to block this user?')) {
            // TODO: Implement block API endpoint
            setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'Blocked' } : c));
            showToast('User has been blocked', 'warning');
            setActionMenuOpen(null);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
            try {
                const response = await deleteUser(id);
                if (response.success) {
                    setCustomers(prev => prev.filter(c => c.id !== id));
                    showToast('User deleted successfully', 'success');
                } else {
                    showToast(response.message || 'Failed to delete user', 'error');
                }
            } catch (error) {
                console.error('Delete error:', error);
                showToast('Error deleting user', 'error');
            }
            setActionMenuOpen(null);
        }
    };

    const handleEditUser = (id) => {
        showToast('Edit feature coming soon!', 'info');
        setActionMenuOpen(null);
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
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="customer-card">
                            <div className="card-header">
                                <div className="user-info-wrapper">
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

                                {/* Action Menu */}
                                <div className="action-menu-wrapper">
                                    <button
                                        className="action-btn"
                                        onClick={(e) => toggleActionMenu(customer.id, e)}
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    {actionMenuOpen === customer.id && (
                                        <div className="action-dropdown">
                                            <button onClick={() => handleEditUser(customer.id)}>
                                                <FaEdit /> Edit
                                            </button>
                                            <button onClick={() => handleBlockUser(customer.id)}>
                                                <FaBan /> Block
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteUser(customer.id)}
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    )}
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

            {filteredCustomers.length === 0 && !loading && (
                <div className="no-results">
                    <p>No customers found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
