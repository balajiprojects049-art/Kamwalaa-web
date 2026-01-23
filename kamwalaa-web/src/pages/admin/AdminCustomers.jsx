import React, { useState } from 'react';
import { useToastContext as useToast } from '../../context/ToastContext';
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

    // Mock Customer Data
    const [customers, setCustomers] = useState([
        {
            id: 'C-001',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            phone: '+91 98765 43210',
            location: 'Gachibowli, Hyderabad',
            totalBookings: 12,
            totalSpent: '₹15,400',
            status: 'Active',
            joinedDate: '2024-11-15'
        },
        {
            id: 'C-002',
            name: 'Priya Sharma',
            email: 'priya.s@example.com',
            phone: '+91 98765 12345',
            location: 'Madhapur, Hyderabad',
            totalBookings: 3,
            totalSpent: '₹2,100',
            status: 'Active',
            joinedDate: '2025-01-02'
        },
        {
            id: 'C-003',
            name: 'Amit Patel',
            email: 'amit.p@example.com',
            phone: '+91 99887 76655',
            location: 'Jubilee Hills, Hyderabad',
            totalBookings: 0,
            totalSpent: '₹0',
            status: 'Inactive',
            joinedDate: '2025-01-10'
        },
        {
            id: 'C-004',
            name: 'Sarah Jenkins',
            email: 's.jenkins@example.com',
            phone: '+91 88776 65544',
            location: 'Banjara Hills, Hyderabad',
            totalBookings: 8,
            totalSpent: '₹8,500',
            status: 'Active',
            joinedDate: '2024-12-05'
        },
        {
            id: 'C-005',
            name: 'Vikram Singh',
            email: 'vikram.singh@example.com',
            phone: '+91 77665 54433',
            location: 'Kondapur, Hyderabad',
            totalBookings: 1,
            totalSpent: '₹450',
            status: 'Blocked',
            joinedDate: '2024-10-20'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    // Filter Logic
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
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
                            <div className="card-actions">
                                <button
                                    className="action-menu-btn"
                                    onClick={() => setActionMenuOpen(actionMenuOpen === customer.id ? null : customer.id)}
                                >
                                    <FaEllipsisV />
                                </button>
                                {actionMenuOpen === customer.id && (
                                    <div className="action-dropdown">
                                        <button onClick={() => handleBlockUser(customer.id)}>
                                            <FaBan /> Block User
                                        </button>
                                        <button className="delete-action" onClick={() => handleDeleteUser(customer.id)}>
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

            {filteredCustomers.length === 0 && (
                <div className="no-results">
                    <p>No customers found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
