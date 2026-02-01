import React, { useState, useEffect } from 'react';
import {
    FaFileDownload,
    FaPrint,
    FaChartBar,
    FaCalendarAlt,
    FaFilter,
    FaCheckCircle,
    FaClock,
    FaTimes
} from 'react-icons/fa';
import { getAllBookings } from '../../services/apiService';
import './AdminReports.css';

const AdminReports = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('revenue'); // revenue, bookings, customers, services
    const [dateRange, setDateRange] = useState('month'); // week, month, quarter, year, custom
    const [customDates, setCustomDates] = useState({ start: '', end: '' });
    const [reports, setReports] = useState({
        revenueReport: {},
        bookingReport: {},
        customerReport: {},
        serviceReport: {}
    });

    useEffect(() => {
        fetchReportsData();
    }, []);

    useEffect(() => {
        if (bookings.length > 0) {
            generateReports();
        }
    }, [bookings, dateRange, customDates]);

    const fetchReportsData = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings();

            if (response.success && response.data) {
                setBookings(response.data);
            }
        } catch (error) {
            console.error('Error fetching reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDateRangeFilter = () => {
        const now = new Date();
        let startDate = new Date();

        switch (dateRange) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'custom':
                if (customDates.start && customDates.end) {
                    return {
                        start: new Date(customDates.start),
                        end: new Date(customDates.end)
                    };
                }
                startDate.setMonth(now.getMonth() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        return { start: startDate, end: now };
    };

    const filterBookingsByDate = (bookingsList) => {
        const { start, end } = getDateRangeFilter();
        return bookingsList.filter(booking => {
            const bookingDate = new Date(booking.created_at);
            return bookingDate >= start && bookingDate <= end;
        });
    };

    const generateReports = () => {
        const filteredBookings = filterBookingsByDate(bookings);

        // Revenue Report
        const totalRevenue = filteredBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
        const paidBookings = filteredBookings.filter(b => b.payment_status === 'paid');
        const paidRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
        const pendingRevenue = totalRevenue - paidRevenue;

        // Payment methods breakdown
        const paymentMethods = {};
        filteredBookings.forEach(b => {
            const method = b.payment_method || 'cash';
            paymentMethods[method] = (paymentMethods[method] || 0) + parseFloat(b.total_amount || 0);
        });

        // Booking Report
        const statusCount = {
            pending: filteredBookings.filter(b => b.status === 'pending').length,
            confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
            completed: filteredBookings.filter(b => b.status === 'completed').length,
            cancelled: filteredBookings.filter(b => b.status === 'cancelled').length
        };

        // Service Report
        const servicesData = {};
        filteredBookings.forEach(b => {
            const serviceName = b.service_name || 'Unknown';
            if (!servicesData[serviceName]) {
                servicesData[serviceName] = {
                    count: 0,
                    revenue: 0,
                    category: b.service_category || 'General'
                };
            }
            servicesData[serviceName].count++;
            servicesData[serviceName].revenue += parseFloat(b.total_amount || 0);
        });

        const topServices = Object.entries(servicesData)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Customer Report
        const uniqueCustomers = new Set(filteredBookings.map(b => b.customer_phone)).size;
        const customersByCity = {};
        filteredBookings.forEach(b => {
            const city = b.city || 'Unknown';
            customersByCity[city] = (customersByCity[city] || 0) + 1;
        });

        setReports({
            revenueReport: {
                total: totalRevenue,
                paid: paidRevenue,
                pending: pendingRevenue,
                paymentMethods,
                avgOrderValue: filteredBookings.length > 0 ? totalRevenue / filteredBookings.length : 0
            },
            bookingReport: {
                total: filteredBookings.length,
                statusCount,
                completionRate: filteredBookings.length > 0
                    ? ((statusCount.completed / filteredBookings.length) * 100).toFixed(2)
                    : 0
            },
            customerReport: {
                uniqueCustomers,
                totalOrders: filteredBookings.length,
                avgOrdersPerCustomer: uniqueCustomers > 0
                    ? (filteredBookings.length / uniqueCustomers).toFixed(2)
                    : 0,
                customersByCity
            },
            serviceReport: {
                topServices,
                totalCategories: new Set(filteredBookings.map(b => b.service_category)).size
            }
        });
    };

    const handleDownloadReport = () => {
        const content = generateReportContent();
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kamwalaa-${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const generateReportContent = () => {
        const { start, end } = getDateRangeFilter();
        let csv = `Kamwalaa ${reportType.toUpperCase()} Report\n`;
        csv += `Period: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}\n`;
        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        switch (reportType) {
            case 'revenue':
                csv += `Revenue Summary\n`;
                csv += `Total Revenue,₹${reports.revenueReport.total?.toFixed(2) || 0}\n`;
                csv += `Paid Revenue,₹${reports.revenueReport.paid?.toFixed(2) || 0}\n`;
                csv += `Pending Revenue,₹${reports.revenueReport.pending?.toFixed(2) || 0}\n`;
                csv += `Average Order Value,₹${reports.revenueReport.avgOrderValue?.toFixed(2) || 0}\n\n`;

                csv += `Payment Methods\n`;
                Object.entries(reports.revenueReport.paymentMethods || {}).forEach(([method, amount]) => {
                    csv += `${method},₹${amount.toFixed(2)}\n`;
                });
                break;

            case 'bookings':
                csv += `Booking Summary\n`;
                csv += `Total Bookings,${reports.bookingReport.total}\n`;
                csv += `Pending,${reports.bookingReport.statusCount?.pending || 0}\n`;
                csv += `Confirmed,${reports.bookingReport.statusCount?.confirmed || 0}\n`;
                csv += `Completed,${reports.bookingReport.statusCount?.completed || 0}\n`;
                csv += `Cancelled,${reports.bookingReport.statusCount?.cancelled || 0}\n`;
                csv += `Completion Rate,${reports.bookingReport.completionRate}%\n`;
                break;

            case 'services':
                csv += `Service Performance\n`;
                csv += `Service Name,Category,Bookings,Revenue\n`;
                (reports.serviceReport.topServices || []).forEach(service => {
                    csv += `${service.name},${service.category},${service.count},₹${service.revenue.toFixed(2)}\n`;
                });
                break;

            case 'customers':
                csv += `Customer Analytics\n`;
                csv += `Unique Customers,${reports.customerReport.uniqueCustomers}\n`;
                csv += `Total Orders,${reports.customerReport.totalOrders}\n`;
                csv += `Avg Orders per Customer,${reports.customerReport.avgOrdersPerCustomer}\n\n`;

                csv += `Customers by City\n`;
                Object.entries(reports.customerReport.customersByCity || {}).forEach(([city, count]) => {
                    csv += `${city},${count}\n`;
                });
                break;
        }

        return csv;
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="reports-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-container">
            {/* Header */}
            <div className="reports-header">
                <div>
                    <h1>Business Reports & Portfolio</h1>
                    <p>Comprehensive business performance reports</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn print-btn" onClick={handlePrint}>
                        <FaPrint /> Print
                    </button>
                    <button className="action-btn download-btn" onClick={handleDownloadReport}>
                        <FaFileDownload /> Download
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="reports-filters">
                <div className="filter-group">
                    <label>Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="bookings">Bookings Report</option>
                        <option value="services">Services Report</option>
                        <option value="customers">Customer Report</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date Range</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {dateRange === 'custom' && (
                    <div className="custom-dates">
                        <input
                            type="date"
                            value={customDates.start}
                            onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
                            className="date-input"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={customDates.end}
                            onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
                            className="date-input"
                        />
                    </div>
                )}
            </div>

            {/* Report Content */}
            <div className="reports-content">
                {reportType === 'revenue' && (
                    <div className="report-section revenue-report">
                        <h2><FaChartBar /> Revenue Report</h2>

                        <div className="report-cards">
                            <div className="report-card total">
                                <div className="card-icon">₹</div>
                                <div className="card-content">
                                    <p className="card-label">Total Revenue</p>
                                    <h3>₹{reports.revenueReport.total?.toLocaleString() || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card paid">
                                <div className="card-icon"><FaCheckCircle /></div>
                                <div className="card-content">
                                    <p className="card-label">Paid Revenue</p>
                                    <h3>₹{reports.revenueReport.paid?.toLocaleString() || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card pending">
                                <div className="card-icon"><FaClock /></div>
                                <div className="card-content">
                                    <p className="card-label">Pending Revenue</p>
                                    <h3>₹{reports.revenueReport.pending?.toLocaleString() || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card average">
                                <div className="card-icon">Avg</div>
                                <div className="card-content">
                                    <p className="card-label">Avg Order Value</p>
                                    <h3>₹{reports.revenueReport.avgOrderValue?.toFixed(0) || 0}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="payment-methods">
                            <h3>Payment Methods Breakdown</h3>
                            <div className="methods-list">
                                {Object.entries(reports.revenueReport.paymentMethods || {}).map(([method, amount]) => (
                                    <div key={method} className="method-item">
                                        <span className="method-name">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                                        <span className="method-amount">₹{amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'bookings' && (
                    <div className="report-section bookings-report">
                        <h2><FaCalendarAlt /> Bookings Report</h2>

                        <div className="report-cards">
                            <div className="report-card total">
                                <div className="card-icon">#</div>
                                <div className="card-content">
                                    <p className="card-label">Total Bookings</p>
                                    <h3>{reports.bookingReport.total}</h3>
                                </div>
                            </div>

                            <div className="report-card status-pending">
                                <div className="card-icon"><FaClock /></div>
                                <div className="card-content">
                                    <p className="card-label">Pending</p>
                                    <h3>{reports.bookingReport.statusCount?.pending || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card status-confirmed">
                                <div className="card-icon"><FaCheckCircle /></div>
                                <div className="card-content">
                                    <p className="card-label">Confirmed</p>
                                    <h3>{reports.bookingReport.statusCount?.confirmed || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card status-completed">
                                <div className="card-icon">✓</div>
                                <div className="card-content">
                                    <p className="card-label">Completed</p>
                                    <h3>{reports.bookingReport.statusCount?.completed || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card status-cancelled">
                                <div className="card-icon"><FaTimes /></div>
                                <div className="card-content">
                                    <p className="card-label">Cancelled</p>
                                    <h3>{reports.bookingReport.statusCount?.cancelled || 0}</h3>
                                </div>
                            </div>

                            <div className="report-card completion">
                                <div className="card-icon">%</div>
                                <div className="card-content">
                                    <p className="card-label">Completion Rate</p>
                                    <h3>{reports.bookingReport.completionRate}%</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'services' && (
                    <div className="report-section services-report">
                        <h2><FaChartBar /> Top Performing Services</h2>

                        <div className="services-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Service Name</th>
                                        <th>Category</th>
                                        <th>Bookings</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(reports.serviceReport.topServices || []).map((service, index) => (
                                        <tr key={index}>
                                            <td className="rank">#{index + 1}</td>
                                            <td className="service-name">{service.name}</td>
                                            <td className="category">{service.category}</td>
                                            <td className="count">{service.count}</td>
                                            <td className="revenue">₹{service.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {reportType === 'customers' && (
                    <div className="report-section customers-report">
                        <h2><FaChartBar /> Customer Analytics</h2>

                        <div className="report-cards">
                            <div className="report-card total">
                                <div className="card-icon">👥</div>
                                <div className="card-content">
                                    <p className="card-label">Unique Customers</p>
                                    <h3>{reports.customerReport.uniqueCustomers}</h3>
                                </div>
                            </div>

                            <div className="report-card orders">
                                <div className="card-icon">#</div>
                                <div className="card-content">
                                    <p className="card-label">Total Orders</p>
                                    <h3>{reports.customerReport.totalOrders}</h3>
                                </div>
                            </div>

                            <div className="report-card average">
                                <div className="card-icon">Avg</div>
                                <div className="card-content">
                                    <p className="card-label">Avg Orders/Customer</p>
                                    <h3>{reports.customerReport.avgOrdersPerCustomer}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="city-breakdown">
                            <h3>Customers by City</h3>
                            <div className="city-list">
                                {Object.entries(reports.customerReport.customersByCity || {})
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([city, count]) => (
                                        <div key={city} className="city-item">
                                            <span className="city-name">{city}</span>
                                            <div className="city-bar">
                                                <div
                                                    className="city-fill"
                                                    style={{
                                                        width: `${(count / Math.max(...Object.values(reports.customerReport.customersByCity))) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="city-count">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
