import React, { useState, useEffect, useCallback } from 'react';
import {
    FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiShoppingBag,
    FiStar, FiRefreshCw, FiDownload, FiFilter, FiCalendar,
    FiMapPin, FiAward, FiAlertCircle, FiCheckCircle, FiXCircle,
    FiClock, FiBarChart2, FiActivity
} from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './AdminAnalytics.css';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Tooltip, Legend, Filler
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ============================================================
   HELPERS
   ============================================================ */
const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const formatNumber = (n) =>
    new Intl.NumberFormat('en-IN').format(n || 0);

const pct = (current, prev) => {
    if (!prev) return 0;
    return (((current - prev) / prev) * 100).toFixed(1);
};

/* ============================================================
   KPI CARD
   ============================================================ */
const KPICard = ({ title, value, prev, icon: Icon, color, format = 'number', suffix = '' }) => {
    const change = pct(value, prev);
    const isUp = parseFloat(change) >= 0;

    const display = format === 'currency' ? formatCurrency(value)
        : format === 'number' ? formatNumber(value)
            : `${value}${suffix}`;

    return (
        <div className="kpi-card" style={{ '--kpi-color': color }}>
            <div className="kpi-top">
                <div className="kpi-icon-wrap"><Icon /></div>
                <div className={`kpi-change ${isUp ? 'kpi-up' : 'kpi-down'}`}>
                    {isUp ? <FiTrendingUp /> : <FiTrendingDown />}
                    {Math.abs(change)}%
                </div>
            </div>
            <div className="kpi-value">{display}</div>
            <div className="kpi-title">{title}</div>
            <div className="kpi-compare">vs last period</div>
        </div>
    );
};

/* ============================================================
   PARTNER PERFORMANCE ROW
   ============================================================ */
const PartnerRow = ({ partner, rank }) => {
    const score = partner.performance_score || 0;
    const bar = `${Math.min(score, 100)}%`;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#d4a843' : '#ef4444';

    return (
        <tr className="partner-row">
            <td>
                <span className={`rank-badge rank-${rank <= 3 ? rank : 'other'}`}>#{rank}</span>
            </td>
            <td>
                <div className="partner-cell">
                    <div className="partner-avatar">{partner.name?.charAt(0) || 'P'}</div>
                    <div>
                        <div className="partner-name">{partner.name}</div>
                        <div className="partner-phone">{partner.phone}</div>
                    </div>
                </div>
            </td>
            <td>
                <div className="rating-cell">
                    <FiStar style={{ color: '#d4a843' }} />
                    {parseFloat(partner.rating || 0).toFixed(1)}
                </div>
            </td>
            <td>{formatNumber(partner.total_bookings)}</td>
            <td>{formatCurrency(partner.total_earnings)}</td>
            <td>
                <div className="score-cell">
                    <div className="score-bar-bg">
                        <div className="score-bar-fill" style={{ width: bar, background: color }} />
                    </div>
                    <span style={{ color }}>{score.toFixed(0)}</span>
                </div>
            </td>
            <td>
                <span className={`status-badge status-${partner.availability_status}`}>
                    {partner.availability_status || 'unknown'}
                </span>
            </td>
        </tr>
    );
};

/* ============================================================
   CITY HEATMAP CARD
   ============================================================ */
const CityHeatmap = ({ data }) => {
    if (!data?.length) return <div className="no-data">No city data available</div>;

    const max = Math.max(...data.map(d => d.total_bookings || 0));

    return (
        <div className="city-heatmap">
            {data.map((city, i) => {
                const intensity = max ? (city.total_bookings / max) : 0;
                const opacity = 0.15 + intensity * 0.85;
                return (
                    <div key={i} className="city-cell" title={city.city}>
                        <div
                            className="city-block"
                            style={{ background: `rgba(26, 58, 107, ${opacity})` }}
                        >
                            <div className="city-cell-name">{city.city}</div>
                            <div className="city-cell-val">{formatNumber(city.total_bookings)}</div>
                            <div className="city-cell-rev">{formatCurrency(city.gross_revenue)}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ============================================================
   MAIN ADMIN ANALYTICS
   ============================================================ */
const AdminAnalytics = () => {
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);

    const periods = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 3 Months' },
        { value: '1y', label: 'Last Year' },
    ];

    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [dashRes, citiesRes, partnersRes] = await Promise.allSettled([
                axios.get(`${API}/api/v1/admin/analytics?period=${period}`, { headers }),
                axios.get(`${API}/api/v1/admin/analytics/cities?period=${period}`, { headers }),
                axios.get(`${API}/api/v1/admin/partners/performance?limit=10`, { headers }),
            ]);

            const dash = dashRes.status === 'fulfilled' ? dashRes.value.data.data : null;
            const cities = citiesRes.status === 'fulfilled' ? citiesRes.value.data.data : [];
            const partners = partnersRes.status === 'fulfilled' ? partnersRes.value.data.data : [];

            setData({ dash, cities, partners });
        } catch (e) {
            console.error('Analytics fetch error:', e);
            setError('Failed to load analytics data.');
        } finally {
            setLoading(false);
        }
    }, [period, token]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    /* ---- Demo data when API unavailable ---- */
    const demo = {
        kpis: {
            revenue: { current: 485000, prev: 412000 },
            bookings: { current: 1247, prev: 1089 },
            customers: { current: 894, prev: 761 },
            partners: { current: 68, prev: 54 },
            avgOrderValue: { current: 389, prev: 378 },
            cancelRate: { current: 4.2, prev: 5.1 },
        },
        revenueChart: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenue: [320000, 285000, 410000, 375000, 460000, 420000, 510000, 485000, 520000, 498000, 565000, 600000],
            bookings: [780, 720, 930, 850, 1020, 960, 1140, 1080, 1190, 1120, 1260, 1380],
        },
        categoryBreakdown: [
            { label: 'AC Service', value: 28, color: '#1a3a6b' },
            { label: 'Electrician', value: 22, color: '#d4a843' },
            { label: 'Plumbing', value: 18, color: '#22c55e' },
            { label: 'Photography', value: 15, color: '#7c3aed' },
            { label: 'Painting', value: 10, color: '#e11d48' },
            { label: 'Others', value: 7, color: '#0891b2' },
        ],
        cities: [
            { city: 'Ranchi', total_bookings: 420, gross_revenue: 168000 },
            { city: 'Delhi', total_bookings: 310, gross_revenue: 142000 },
            { city: 'Noida', total_bookings: 195, gross_revenue: 89000 },
            { city: 'Mumbai', total_bookings: 160, gross_revenue: 74000 },
            { city: 'Bokaro', total_bookings: 87, gross_revenue: 32000 },
            { city: 'Bangalore', total_bookings: 75, gross_revenue: 28000 },
        ],
        topPartners: [
            { name: 'Rajesh AC Services', phone: '98765XXXXX', rating: 4.9, total_bookings: 142, total_earnings: 56800, performance_score: 96, availability_status: 'available' },
            { name: 'Sanjay Electricals', phone: '98765XXXXX', rating: 4.8, total_bookings: 128, total_earnings: 48000, performance_score: 92, availability_status: 'busy' },
            { name: 'Vikram Plumbers', phone: '98765XXXXX', rating: 4.7, total_bookings: 115, total_earnings: 41400, performance_score: 89, availability_status: 'available' },
            { name: 'Aakash Photography', phone: '98765XXXXX', rating: 4.9, total_bookings: 98, total_earnings: 78400, performance_score: 94, availability_status: 'available' },
            { name: 'Kiran Painters', phone: '98765XXXXX', rating: 4.6, total_bookings: 89, total_earnings: 26700, performance_score: 82, availability_status: 'offline' },
        ],
        recentActivity: [
            { icon: FiCheckCircle, color: '#22c55e', text: 'Booking #BK20260302-1247 completed in Ranchi', time: '2 min ago' },
            { icon: FiAlertCircle, color: '#d4a843', text: 'New partner request from Amit Kumar (AC Service)', time: '8 min ago' },
            { icon: FiXCircle, color: '#ef4444', text: 'Booking #BK20260302-1243 cancelled — refund initiated', time: '15 min ago' },
            { icon: FiCheckCircle, color: '#22c55e', text: 'Payment of ₹4,500 received for BK20260302-1241', time: '22 min ago' },
            { icon: FiUsers, color: '#1a3a6b', text: '5 new customers registered today', time: '1 hr ago' },
        ],
    };

    const kpis = data?.dash?.kpis || demo.kpis;
    const dCity = data?.cities || demo.cities;
    const dPart = data?.partners || demo.topPartners;

    /* ---- Chart configs ---- */
    const revenueChartData = {
        labels: demo.revenueChart.labels,
        datasets: [
            {
                label: 'Revenue (₹)',
                data: demo.revenueChart.revenue,
                borderColor: '#1a3a6b',
                backgroundColor: 'rgba(26,58,107,0.08)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1a3a6b',
                pointRadius: 4,
                pointHoverRadius: 7,
            },
        ],
    };

    const bookingsChartData = {
        labels: demo.revenueChart.labels,
        datasets: [
            {
                label: 'Bookings',
                data: demo.revenueChart.bookings,
                backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                    g.addColorStop(0, 'rgba(212,168,67,0.85)');
                    g.addColorStop(1, 'rgba(212,168,67,0.15)');
                    return g;
                },
                borderColor: '#d4a843',
                borderWidth: 1.5,
                borderRadius: 6,
            },
        ],
    };

    const categoryData = {
        labels: demo.categoryBreakdown.map(c => c.label),
        datasets: [{
            data: demo.categoryBreakdown.map(c => c.value),
            backgroundColor: demo.categoryBreakdown.map(c => c.color),
            borderWidth: 2,
            borderColor: 'var(--bg-card)',
            hoverOffset: 8,
        }],
    };

    const chartOpts = (yLabel) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15,23,42,0.92)',
                padding: 12,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: { color: '#94a3b8', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                    callback: (v) => yLabel === 'currency' ? `₹${(v / 1000).toFixed(0)}K` : v,
                },
            },
        },
    });

    const doughnutOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, color: 'var(--text-secondary)', font: { size: 12 } },
            },
            tooltip: {
                backgroundColor: 'rgba(15,23,42,0.92)',
                callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` },
            },
        },
        cutout: '65%',
    };

    /* ---- Export CSV (demo) ---- */
    const exportCSV = () => {
        const rows = [['Month', 'Revenue', 'Bookings'], ...demo.revenueChart.labels.map((l, i) => [l, demo.revenueChart.revenue[i], demo.revenueChart.bookings[i]])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href, download: 'kamwalaa-analytics.csv' });
        a.click();
        URL.revokeObjectURL(href);
    };

    /* ---- Render ---- */
    return (
        <div className="admin-analytics-enterprise">

            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1 className="analytics-title">Revenue Analytics</h1>
                    <p className="analytics-subtitle">Real-time business intelligence dashboard</p>
                </div>
                <div className="analytics-actions">
                    {/* Period filter */}
                    <div className="period-tabs">
                        {periods.map(p => (
                            <button
                                key={p.value}
                                className={`period-tab ${period === p.value ? 'active' : ''}`}
                                onClick={() => setPeriod(p.value)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button className="analytics-btn" onClick={fetchAnalytics} title="Refresh">
                        <FiRefreshCw className={loading ? 'spin' : ''} />
                    </button>
                    <button className="analytics-btn gold" onClick={exportCSV} title="Export CSV">
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

            {error && (
                <div className="analytics-error">
                    <FiAlertCircle /> {error} — Showing demo data.
                </div>
            )}

            {/* KPI Grid */}
            <div className="kpi-grid">
                <KPICard title="Gross Revenue" value={kpis.revenue?.current} prev={kpis.revenue?.prev} icon={FiDollarSign} color="#1a3a6b" format="currency" />
                <KPICard title="Total Bookings" value={kpis.bookings?.current} prev={kpis.bookings?.prev} icon={FiShoppingBag} color="#d4a843" format="number" />
                <KPICard title="Active Customers" value={kpis.customers?.current} prev={kpis.customers?.prev} icon={FiUsers} color="#22c55e" format="number" />
                <KPICard title="Active Partners" value={kpis.partners?.current} prev={kpis.partners?.prev} icon={FiAward} color="#7c3aed" format="number" />
                <KPICard title="Avg. Order Value" value={kpis.avgOrderValue?.current} prev={kpis.avgOrderValue?.prev} icon={FiBarChart2} color="#0891b2" format="currency" />
                <KPICard title="Cancellation Rate" value={kpis.cancelRate?.current} prev={kpis.cancelRate?.prev} icon={FiActivity} color="#e11d48" format="number" suffix="%" />
            </div>

            {/* Charts Row 1 */}
            <div className="charts-row">
                {/* Revenue Trend */}
                <div className="chart-card chart-wide">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Revenue Trend</h3>
                            <p className="chart-subtitle">Monthly gross revenue (INR)</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-dot" style={{ background: '#1a3a6b' }} />
                            <span>Revenue</span>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Line data={revenueChartData} options={chartOpts('currency')} />
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="chart-card chart-narrow">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Category Mix</h3>
                            <p className="chart-subtitle">Booking share by service</p>
                        </div>
                    </div>
                    <div className="chart-body chart-doughnut">
                        <Doughnut data={categoryData} options={doughnutOpts} />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-row">
                {/* Bookings Bar */}
                <div className="chart-card chart-medium">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Monthly Bookings</h3>
                            <p className="chart-subtitle">Booking volume per month</p>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Bar data={bookingsChartData} options={chartOpts('number')} />
                    </div>
                </div>

                {/* City Heatmap */}
                <div className="chart-card chart-medium">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">City Performance</h3>
                            <p className="chart-subtitle">Bookings &amp; revenue by city</p>
                        </div>
                        <FiMapPin style={{ color: 'var(--gold-500)' }} />
                    </div>
                    <div className="chart-body">
                        <CityHeatmap data={dCity} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="analytics-bottom">

                {/* Partner Performance Table */}
                <div className="analytics-card table-card">
                    <div className="card-header">
                        <h3 className="chart-title">Top Partner Performance</h3>
                        <span className="card-header-tag">Last 30 Days</span>
                    </div>
                    <div className="table-wrap">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Partner</th>
                                    <th>Rating</th>
                                    <th>Bookings</th>
                                    <th>Earnings</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dPart?.slice?.(0, 5) || demo.topPartners).map((p, i) => (
                                    <PartnerRow key={p.id || i} partner={p} rank={i + 1} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="analytics-card activity-card">
                    <div className="card-header">
                        <h3 className="chart-title">Live Activity</h3>
                        <span className="live-dot-wrap">
                            <span className="live-dot" />
                            Live
                        </span>
                    </div>
                    <div className="activity-feed">
                        {demo.recentActivity.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="activity-item">
                                    <div className="activity-icon" style={{ color: item.color, background: item.color + '18' }}>
                                        <Icon />
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-text">{item.text}</p>
                                        <span className="activity-time">
                                            <FiClock style={{ fontSize: '0.7rem' }} /> {item.time}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAnalytics;
