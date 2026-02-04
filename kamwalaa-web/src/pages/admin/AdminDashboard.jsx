import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaMoneyBillWave, FaUserPlus, FaStar } from 'react-icons/fa';
import { getAllBookings } from '../../services/apiService';
import './AdminDashboard.css';

const StatCard = ({ title, value, change, icon, colorClass }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
            <div className={`stat-icon ${colorClass}`}>
                {icon}
            </div>
        </div>
        <div className="stat-footer">
            <span className={`stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
                {change}
            </span>
            <span className="stat-period">from last month</span>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getAllBookings();
                if (response.success && response.data) {
                    const bookings = response.data;
                    const totalRev = bookings.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);

                    // Calculate popular services
                    const serviceCount = {};
                    bookings.forEach(booking => {
                        const serviceName = booking.service_name || 'Unknown Service';
                        serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
                    });

                    // Sort and get top 5 services
                    const sortedServices = Object.entries(serviceCount)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([name, count], index) => ({
                            name,
                            count,
                            colorClass: ['bg-blue-fill', 'bg-green-fill', 'bg-purple-fill', 'bg-orange-fill', 'bg-pink-fill'][index]
                        }));

                    // Calculate unique customers from the last 30 days
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const recentBookings = bookings.filter(b => new Date(b.created_at) >= thirtyDaysAgo);
                    const uniqueCustomers = new Set(recentBookings.map(b => b.customer_phone || b.user_id)).size;

                    setStats({
                        totalBookings: bookings.length,
                        totalRevenue: totalRev,
                        recentBookings: bookings.slice(0, 5), // Top 5 recent
                        newCustomers: uniqueCustomers,
                        popularServices: sortedServices
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Real-time analytics and booking insights.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    change="--%"
                    icon={<FaCalendarCheck />}
                    colorClass="bg-blue"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    change="--%"
                    icon={<FaMoneyBillWave />}
                    colorClass="bg-green"
                />
                <StatCard
                    title="New Customers"
                    value={stats.newCustomers || 0}
                    change="--%"
                    icon={<FaUserPlus />}
                    colorClass="bg-purple"
                />
                <StatCard
                    title="Avg. Rating"
                    value="4.8"
                    change="+0.2%"
                    icon={<FaStar />}
                    colorClass="bg-yellow"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="dashboard-grid">
                {/* Recent Bookings */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Booking Requests</h3>
                        <button className="view-all-btn">View All</button>
                    </div>

                    <div className="table-responsive">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>

                                {stats.recentBookings.length > 0 ? (
                                    stats.recentBookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-small">
                                                        {booking.customer_name ? booking.customer_name.charAt(0) : 'U'}
                                                    </div>
                                                    <span className="user-name">{booking.customer_name}</span>
                                                </div>
                                            </td>
                                            <td className="text-cell">{booking.service_name}</td>
                                            <td className="date-cell">
                                                {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="amount-cell">₹{booking.total_amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                                            No recent bookings
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Services */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Popular Services</h3>
                    </div>

                    <div className="service-list">
                        {stats.popularServices && stats.popularServices.length > 0 ? (
                            stats.popularServices.map((service, index) => (
                                <div key={index} className="service-item">
                                    <div className="service-item-header">
                                        <span className="service-name">{service.name}</span>
                                        <span className="service-count">{service.count} bookings</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className={`progress-bar-fill ${service.colorClass || 'bg-blue-fill'}`}
                                            style={{ width: `${(service.count / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                                No data available yet
                            </p>
                        )}
                    </div>

                    <button className="service-analysis-btn">
                        View Service Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
