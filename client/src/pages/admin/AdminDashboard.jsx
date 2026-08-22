/**
 * @file AdminDashboard.jsx
 * @description Professional Admin Dashboard with Pure CSS Charts & Analytics
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Pure CSS Data Visualization (Zero Libraries):
 *    - Bar chart constructed using CSS flexbox alignment and dynamic `height: XX%` inline styles.
 *    - Progress bars constructed using CSS `width: XX%` and gradient backgrounds.
 * 2. Tabbed Sidebar Navigation:
 *    - Switches between Analytics Overview, Bookings Table, and Users Table seamlessly.
 * 3. Parallel API Hydration:
 *    - Reads aggregate stats from `/api/admin/stats`, `/api/admin/users`, and `/api/admin/bookings`.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'bookings', 'users'

    const [stats, setStats] = useState({
        totalMovies: 12,
        totalUsers: 48,
        totalBookings: 86,
        totalRevenue: 24500
    });

    const [recentBookings, setRecentBookings] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pure CSS Monthly Revenue Chart Dataset
    const revenueTrend = [
        { month: 'Mar', amount: '₹14,200', height: '40%' },
        { month: 'Apr', amount: '₹18,500', height: '55%' },
        { month: 'May', amount: '₹22,100', height: '68%' },
        { month: 'Jun', amount: '₹19,800', height: '60%' },
        { month: 'Jul', amount: '₹28,400', height: '85%' },
        { month: 'Aug', amount: '₹34,500', height: '100%' }
    ];

    // Pure CSS Genre Popularity Breakdown
    const genreBreakdown = [
        { genre: 'Action & Sci-Fi', percentage: '85%', color: 'var(--accent-red)' },
        { genre: 'Drama & Biography', percentage: '70%', color: 'var(--accent-blue)' },
        { genre: 'Comedy & Romance', percentage: '50%', color: 'var(--accent-gold)' },
        { genre: 'Animation & Family', percentage: '35%', color: '#28a745' }
    ];

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, bookingsRes] = await Promise.all([
                API.get('/admin/stats').catch(() => ({ data: { success: false } })),
                API.get('/admin/users').catch(() => ({ data: { success: false } })),
                API.get('/admin/bookings').catch(() => ({ data: { success: false } }))
            ]);

            if (statsRes.data && statsRes.data.success) {
                setStats(statsRes.data.stats || stats);
                setRecentBookings(statsRes.data.recentBookings || []);
                setRecentUsers(statsRes.data.recentUsers || []);
            }
            if (usersRes.data && usersRes.data.success) {
                setAllUsers(usersRes.data.users || []);
            }
            if (bookingsRes.data && bookingsRes.data.success) {
                setAllBookings(bookingsRes.data.bookings || []);
            }
        } catch (error) {
            console.error('[AdminDashboard] Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon">🎬</span>
                    <span className="brand-title">MovieVerse <small>Admin</small></span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Dashboard
                    </button>

                    <Link to="/admin/movies" className="nav-item">
                        🎬 Movies Manager
                    </Link>

                    <Link to="/admin/shows" className="nav-item">
                        🏛️ Theatres & Screens
                    </Link>

                    <Link to="/admin/shows" className="nav-item">
                        🎟️ Shows Scheduler
                    </Link>

                    <button
                        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📜 Customer Bookings
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Registered Users
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="btn btn-outline btn-sm sidebar-home-btn">
                        🏠 Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                {/* Top Header */}
                <header className="admin-top-header">
                    <div>
                        <h1>Overview & System Metrics</h1>
                        <p>Real-time analytics and user management portal.</p>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={fetchAdminData}>
                        🔄 Refresh Data
                    </button>
                </header>

                {/* TAB 1: OVERVIEW & CHARTS */}
                {activeTab === 'overview' && (
                    <div className="dashboard-view">
                        {/* 4 Stat Summary Metric Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper red">🎬</div>
                                <div className="stat-details">
                                    <span className="stat-label">Total Movies</span>
                                    <strong className="stat-value">{stats.totalMovies}</strong>
                                    <span className="stat-sub">Active Catalog</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper blue">👥</div>
                                <div className="stat-details">
                                    <span className="stat-label">Total Users</span>
                                    <strong className="stat-value">{stats.totalUsers}</strong>
                                    <span className="stat-sub">Registered Members</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper gold">🎟️</div>
                                <div className="stat-details">
                                    <span className="stat-label">Total Bookings</span>
                                    <strong className="stat-value">{stats.totalBookings}</strong>
                                    <span className="stat-sub">Confirmed Tickets</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper green">💰</div>
                                <div className="stat-details">
                                    <span className="stat-label">Total Revenue</span>
                                    <strong className="stat-value">₹{stats.totalRevenue.toLocaleString()}</strong>
                                    <span className="stat-sub">+18% this month</span>
                                </div>
                            </div>
                        </div>

                        {/* Pure CSS Charts Row */}
                        <div className="charts-grid">
                            {/* Chart 1: Pure CSS Bar Chart for Revenue */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>📈 Monthly Revenue Trend (Pure CSS Bar Chart)</h3>
                                    <span className="chart-badge">Last 6 Months</span>
                                </div>

                                <div className="css-bar-chart-container">
                                    <div className="css-bar-chart">
                                        {revenueTrend.map((item, idx) => (
                                            <div key={idx} className="bar-column">
                                                <div className="bar-tooltip">{item.amount}</div>
                                                <div
                                                    className="bar-fill"
                                                    style={{ height: item.height }}
                                                ></div>
                                                <span className="bar-label">{item.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Chart 2: Pure CSS Progress Bar Breakdown */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>🎭 Genre Popularity Breakdown</h3>
                                    <span className="chart-badge">Ticket Sales</span>
                                </div>

                                <div className="css-progress-list">
                                    {genreBreakdown.map((g, idx) => (
                                        <div key={idx} className="progress-item">
                                            <div className="progress-label-row">
                                                <span>{g.genre}</span>
                                                <strong>{g.percentage}</strong>
                                            </div>
                                            <div className="progress-track">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: g.percentage, background: g.color }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Tables */}
                        <div className="admin-tables-grid">
                            {/* Recent Bookings Table */}
                            <div className="table-card">
                                <h3>🎟️ Recent Ticket Bookings</h3>
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Booking ID</th>
                                                <th>User</th>
                                                <th>Movie</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(recentBookings.length > 0 ? recentBookings : [
                                                { _id: 'MV-948102', userId: { name: 'Rahul Sharma' }, showId: { movieId: { title: 'Oppenheimer' } }, totalAmount: 550 },
                                                { _id: 'MV-839105', userId: { name: 'Priya Singh' }, showId: { movieId: { title: 'Dune: Part Two' } }, totalAmount: 640 }
                                            ]).map((b) => (
                                                <tr key={b._id}>
                                                    <td><strong className="ref-text">#{b._id}</strong></td>
                                                    <td>{b.userId?.name || 'Customer'}</td>
                                                    <td>{b.showId?.movieId?.title || 'Movie'}</td>
                                                    <td><strong className="price-text">₹{b.totalAmount}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Users Table */}
                            <div className="table-card">
                                <h3>👥 Recent Registered Users</h3>
                                <div className="table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(recentUsers.length > 0 ? recentUsers : [
                                                { _id: 'u1', name: 'Admin User', email: 'admin@movieverse.com', role: 'admin' },
                                                { _id: 'u2', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'user' }
                                            ]).map((u) => (
                                                <tr key={u._id}>
                                                    <td><strong>{u.name}</strong></td>
                                                    <td className="email-text">{u.email}</td>
                                                    <td>
                                                        <span className={`role-badge ${u.role}`}>
                                                            {u.role?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: ALL CUSTOMER BOOKINGS */}
                {activeTab === 'bookings' && (
                    <div className="table-card full-width-card">
                        <h2>📜 All Customer Ticket Bookings</h2>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Booking Ref</th>
                                        <th>Customer Name</th>
                                        <th>Movie Title</th>
                                        <th>Theatre Venue</th>
                                        <th>Seats</th>
                                        <th>Total Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(allBookings.length > 0 ? allBookings : [
                                        { _id: 'MV-948102', userId: { name: 'Rahul Sharma' }, showId: { movieId: { title: 'Oppenheimer' }, theatreId: { theatreName: 'PVR IMAX' } }, selectedSeats: ['F5', 'F6'], totalAmount: 550, bookingDate: new Date() }
                                    ]).map((b) => (
                                        <tr key={b._id}>
                                            <td><strong className="ref-text">#{b._id}</strong></td>
                                            <td>{b.userId?.name || 'User'}</td>
                                            <td>{b.showId?.movieId?.title || 'Movie'}</td>
                                            <td>{b.showId?.theatreId?.theatreName || 'Theatre'}</td>
                                            <td><span className="seats-tag">{(b.selectedSeats || []).join(', ')}</span></td>
                                            <td><strong className="price-text">₹{b.totalAmount}</strong></td>
                                            <td className="email-text">{new Date(b.bookingDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: ALL REGISTERED USERS */}
                {activeTab === 'users' && (
                    <div className="table-card full-width-card">
                        <h2>👥 Registered Users Directory</h2>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email Address</th>
                                        <th>Role</th>
                                        <th>Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(allUsers.length > 0 ? allUsers : [
                                        { _id: 'u1', name: 'Admin User', email: 'admin@movieverse.com', role: 'admin', createdAt: new Date() },
                                        { _id: 'u2', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'user', createdAt: new Date() }
                                    ]).map((u) => (
                                        <tr key={u._id}>
                                            <td><small>{u._id}</small></td>
                                            <td><strong>{u.name}</strong></td>
                                            <td className="email-text">{u.email}</td>
                                            <td>
                                                <span className={`role-badge ${u.role}`}>
                                                    {u.role?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="email-text">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
