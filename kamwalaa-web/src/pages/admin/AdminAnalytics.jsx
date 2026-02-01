import React, { useState, useEffect } from 'react';
import {
    FaCalendarDay,
    FaCalendarWeek,
    FaCalendarAlt,
    FaChartLine,
    FaMoneyBillWave,
    FaUsers,
    FaDownload,
    FaFilter
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getAllBookings } from '../../services/apiService';
import './AdminAnalytics.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalytics = () => {
    const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly
    const [bookings, setBookings] = useState([]);
    const [analytics, setAnalytics] = useState({
        daily: { revenue: 0, bookings: 0, customers: 0, avgOrder: 0 },
        weekly: { revenue: 0, bookings: 0, customers: 0, avgOrder: 0 },
        monthly: { revenue: 0, bookings: 0, customers: 0, avgOrder: 0 },
        chartData: {
            daily: [],
            weekly: [],
            monthly: []
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings();

            if (response.success && response.data) {
                const bookingsData = response.data;
                setBookings(bookingsData);
                calculateAnalytics(bookingsData);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (bookingsData) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Calculate daily analytics (today)
        const dailyBookings = bookingsData.filter(b => {
            const bookingDate = new Date(b.created_at);
            return bookingDate >= today;
        });

        // Calculate weekly analytics (last 7 days)
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyBookings = bookingsData.filter(b => {
            const bookingDate = new Date(b.created_at);
            return bookingDate >= weekAgo;
        });

        // Calculate monthly analytics (last 30 days)
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        const monthlyBookings = bookingsData.filter(b => {
            const bookingDate = new Date(b.created_at);
            return bookingDate >= monthAgo;
        });

        // Helper function to calculate metrics
        const calculateMetrics = (bookings) => {
            const revenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
            const uniqueCustomers = new Set(bookings.map(b => b.customer_phone)).size;
            const avgOrder = bookings.length > 0 ? revenue / bookings.length : 0;

            return {
                revenue: revenue,
                bookings: bookings.length,
                customers: uniqueCustomers,
                avgOrder: avgOrder
            };
        };

        // Prepare chart data for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }

        const dailyChartData = last7Days.map(date => {
            const dayBookings = bookingsData.filter(b => {
                const bookingDate = new Date(b.created_at);
                return bookingDate.toDateString() === date.toDateString();
            });

            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dayBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
                bookings: dayBookings.length
            };
        });

        // Prepare chart data for last 4 weeks
        const weeklyChartData = [];
        for (let i = 3; i >= 0; i--) {
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 6);

            const weekBookings = bookingsData.filter(b => {
                const bookingDate = new Date(b.created_at);
                return bookingDate >= weekStart && bookingDate <= weekEnd;
            });

            weeklyChartData.push({
                date: `Week ${4 - i}`,
                revenue: weekBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
                bookings: weekBookings.length
            });
        }

        // Prepare chart data for last 6 months
        const monthlyChartData = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            const monthBookings = bookingsData.filter(b => {
                const bookingDate = new Date(b.created_at);
                return bookingDate >= monthDate && bookingDate <= monthEnd;
            });

            monthlyChartData.push({
                date: monthDate.toLocaleDateString('en-US', { month: 'short' }),
                revenue: monthBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
                bookings: monthBookings.length
            });
        }

        setAnalytics({
            daily: calculateMetrics(dailyBookings),
            weekly: calculateMetrics(weeklyBookings),
            monthly: calculateMetrics(monthlyBookings),
            chartData: {
                daily: dailyChartData,
                weekly: weeklyChartData,
                monthly: monthlyChartData
            }
        });
    };

    // Get current data based on timeRange
    const getCurrentData = () => {
        switch (timeRange) {
            case 'daily':
                return analytics.daily;
            case 'weekly':
                return analytics.weekly;
            case 'monthly':
                return analytics.monthly;
            default:
                return analytics.daily;
        }
    };

    const getCurrentChartData = () => {
        switch (timeRange) {
            case 'daily':
                return analytics.chartData.daily;
            case 'weekly':
                return analytics.chartData.weekly;
            case 'monthly':
                return analytics.chartData.monthly;
            default:
                return analytics.chartData.daily;
        }
    };

    // Chart configurations
    const revenueChartData = {
        labels: getCurrentChartData().map(d => d.date),
        datasets: [
            {
                label: 'Revenue (₹)',
                data: getCurrentChartData().map(d => d.revenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const bookingsChartData = {
        labels: getCurrentChartData().map(d => d.date),
        datasets: [
            {
                label: 'Bookings',
                data: getCurrentChartData().map(d => d.bookings),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    // Status distribution chart
    const statusData = {
        labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        datasets: [
            {
                data: [
                    bookings.filter(b => b.status === 'pending').length,
                    bookings.filter(b => b.status === 'confirmed').length,
                    bookings.filter(b => b.status === 'completed').length,
                    bookings.filter(b => b.status === 'cancelled').length,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    };

    const currentData = getCurrentData();

    const handleExportReport = () => {
        // Generate CSV report
        const csvContent = generateCSVReport();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const generateCSVReport = () => {
        let csv = `Kamwalaa Analytics Report - ${timeRange.toUpperCase()}\n`;
        csv += `Generated on: ${new Date().toLocaleString()}\n\n`;
        csv += `Metric,Value\n`;
        csv += `Total Revenue,₹${currentData.revenue.toFixed(2)}\n`;
        csv += `Total Bookings,${currentData.bookings}\n`;
        csv += `Unique Customers,${currentData.customers}\n`;
        csv += `Average Order Value,₹${currentData.avgOrder.toFixed(2)}\n\n`;

        csv += `Date,Revenue,Bookings\n`;
        getCurrentChartData().forEach(item => {
            csv += `${item.date},₹${item.revenue.toFixed(2)},${item.bookings}\n`;
        });

        return csv;
    };

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Business Analytics</h1>
                    <p>Comprehensive insights and performance metrics</p>
                </div>
                <button className="export-btn" onClick={handleExportReport}>
                    <FaDownload /> Export Report
                </button>
            </div>

            {/* Time Range Selector */}
            <div className="time-range-selector">
                <button
                    className={`range-btn ${timeRange === 'daily' ? 'active' : ''}`}
                    onClick={() => setTimeRange('daily')}
                >
                    <FaCalendarDay /> Daily
                </button>
                <button
                    className={`range-btn ${timeRange === 'weekly' ? 'active' : ''}`}
                    onClick={() => setTimeRange('weekly')}
                >
                    <FaCalendarWeek /> Weekly
                </button>
                <button
                    className={`range-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                    onClick={() => setTimeRange('monthly')}
                >
                    <FaCalendarAlt /> Monthly
                </button>
            </div>

            {/* Key Metrics Cards */}
            <div className="metrics-grid">
                <div className="metric-card revenue">
                    <div className="metric-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Revenue</p>
                        <h2 className="metric-value">₹{currentData.revenue.toLocaleString()}</h2>
                        <p className="metric-period">{timeRange === 'daily' ? 'Today' : timeRange === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</p>
                    </div>
                </div>

                <div className="metric-card bookings">
                    <div className="metric-icon">
                        <FaChartLine />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Total Bookings</p>
                        <h2 className="metric-value">{currentData.bookings}</h2>
                        <p className="metric-period">{timeRange === 'daily' ? 'Today' : timeRange === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</p>
                    </div>
                </div>

                <div className="metric-card customers">
                    <div className="metric-icon">
                        <FaUsers />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Unique Customers</p>
                        <h2 className="metric-value">{currentData.customers}</h2>
                        <p className="metric-period">{timeRange === 'daily' ? 'Today' : timeRange === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</p>
                    </div>
                </div>

                <div className="metric-card average">
                    <div className="metric-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="metric-content">
                        <p className="metric-label">Avg. Order Value</p>
                        <h2 className="metric-value">₹{currentData.avgOrder.toFixed(0)}</h2>
                        <p className="metric-period">{timeRange === 'daily' ? 'Today' : timeRange === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Revenue Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Revenue Trend</h3>
                        <span className="chart-subtitle">
                            {timeRange === 'daily' ? 'Last 7 days' : timeRange === 'weekly' ? 'Last 4 weeks' : 'Last 6 months'}
                        </span>
                    </div>
                    <div className="chart-body">
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Bookings Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Bookings Overview</h3>
                        <span className="chart-subtitle">
                            {timeRange === 'daily' ? 'Last 7 days' : timeRange === 'weekly' ? 'Last 4 weeks' : 'Last 6 months'}
                        </span>
                    </div>
                    <div className="chart-body">
                        <Bar data={bookingsChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="chart-card status-chart">
                    <div className="chart-header">
                        <h3>Booking Status Distribution</h3>
                        <span className="chart-subtitle">All time</span>
                    </div>
                    <div className="chart-body doughnut">
                        <Doughnut data={statusData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="chart-card summary-card">
                    <div className="chart-header">
                        <h3>Performance Summary</h3>
                        <span className="chart-subtitle">{timeRange} overview</span>
                    </div>
                    <div className="summary-stats">
                        <div className="summary-item">
                            <span className="summary-label">Total Revenue</span>
                            <span className="summary-value">₹{currentData.revenue.toLocaleString()}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item">
                            <span className="summary-label">Total Orders</span>
                            <span className="summary-value">{currentData.bookings}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item">
                            <span className="summary-label">Customers</span>
                            <span className="summary-value">{currentData.customers}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item">
                            <span className="summary-label">Avg. Order</span>
                            <span className="summary-value">₹{currentData.avgOrder.toFixed(0)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item">
                            <span className="summary-label">Pending</span>
                            <span className="summary-value pending">{bookings.filter(b => b.status === 'pending').length}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-item">
                            <span className="summary-label">Completed</span>
                            <span className="summary-value completed">{bookings.filter(b => b.status === 'completed').length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
