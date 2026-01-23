import React from 'react';
import { FaCalendarCheck, FaMoneyBillWave, FaUserPlus, FaStar } from 'react-icons/fa';
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
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, here's what's happening efficiently.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Bookings"
                    value="1,248"
                    change="+12.5%"
                    icon={<FaCalendarCheck />}
                    colorClass="bg-blue"
                />
                <StatCard
                    title="Total Revenue"
                    value="₹8.4L"
                    change="+8.2%"
                    icon={<FaMoneyBillWave />}
                    colorClass="bg-green"
                />
                <StatCard
                    title="New Customers"
                    value="384"
                    change="+5.4%"
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
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-small">
                                                    C{item}
                                                </div>
                                                <span className="user-name">John Doe</span>
                                            </div>
                                        </td>
                                        <td className="text-cell">AC Repair Service</td>
                                        <td className="date-cell">23 Jan, 2026</td>
                                        <td>
                                            <span className="status-badge status-pending">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="amount-cell">₹450</td>
                                    </tr>
                                ))}
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
                        {[
                            { name: 'AC Services', count: 320, colorClass: 'bg-blue-fill' },
                            { name: 'Plumbing', count: 215, colorClass: 'bg-indigo-fill' },
                            { name: 'Electrical', count: 180, colorClass: 'bg-yellow-fill' },
                            { name: 'Cleaning', count: 124, colorClass: 'bg-green-fill' },
                        ].map((service, index) => (
                            <div key={index} className="service-item">
                                <div className="service-item-header">
                                    <span className="service-name">{service.name}</span>
                                    <span className="service-count">{service.count} bookings</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div
                                        className={`progress-bar-fill ${service.colorClass}`}
                                        style={{ width: `${(service.count / 350) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
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
