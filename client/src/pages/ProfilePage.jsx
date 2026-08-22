/**
 * @file ProfilePage.jsx
 * @description User Profile, Ticket Booking History & Saved Watchlist Page for MovieVerse Pro
 */

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { INITIAL_MOVIES } from '../data/moviesData';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [watchlistMovies, setWatchlistMovies] = useState([]);

    // Load user's watchlisted movies from localStorage
    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem('user_watchlist') || '[]');
        const filtered = INITIAL_MOVIES.filter(m => savedWatchlist.includes(m._id) || savedWatchlist.includes(String(m.id)));
        setWatchlistMovies(filtered);
    }, []);

    // Sample booking history setup
    const bookings = [
        {
            id: 'BK-10029',
            movieTitle: 'Dune: Part Two',
            theatre: 'PVR IMAX Grand Mall',
            seats: ['E5', 'E6'],
            showTime: '2026-08-22 • 06:45 PM',
            totalAmount: 560,
            status: 'Confirmed'
        }
    ];

    const handleDownloadTicket = (bookingId) => {
        navigate(`/booking-success/${bookingId}?print=true`);
    };

    const removeFromWatchlist = (id) => {
        const savedWatchlist = JSON.parse(localStorage.getItem('user_watchlist') || '[]');
        const updated = savedWatchlist.filter(itemId => itemId !== id);
        localStorage.setItem('user_watchlist', JSON.stringify(updated));
        setWatchlistMovies(prev => prev.filter(m => m._id !== id && String(m.id) !== id));
    };

    return (
        <div className="profile-page">
            {/* Header Box */}
            <div className="profile-header">
                <div className="profile-avatar-large">👤</div>
                <div className="profile-details">
                    <h2>{user?.name || 'MovieVerse Fan'}</h2>
                    <p className="email">{user?.email || 'user@example.com'}</p>
                    <span className="badge badge-red">{user?.role === 'admin' ? 'Admin Account' : 'Movie Enthusiast'}</span>
                </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="profile-nav-tabs">
                <button
                    className={`profile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    🎟️ My Ticket Bookings ({bookings.length})
                </button>
                <button
                    className={`profile-tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watchlist')}
                >
                    ❤️ My Watchlist ({watchlistMovies.length})
                </button>
            </div>

            {/* Bookings Section */}
            {activeTab === 'bookings' && (
                <div className="booking-history-section">
                    <h3 className="section-title">Active & Past Bookings</h3>

                    {bookings.length > 0 ? (
                        <div className="tickets-list">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="ticket-card">
                                    <div className="ticket-header">
                                        <span className="ticket-id">#{booking.id}</span>
                                        <span className="badge badge-gold">{booking.status}</span>
                                    </div>
                                    <div className="ticket-body">
                                        <h4>{booking.movieTitle}</h4>
                                        <p>📍 {booking.theatre}</p>
                                        <p>🗓️ {booking.showTime}</p>
                                        <p>🪑 Seats: <strong>{booking.seats.join(', ')}</strong></p>
                                    </div>
                                    <div className="ticket-footer">
                                        <span>Paid Amount: <strong>₹{booking.totalAmount}</strong></span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDownloadTicket(booking.id)}
                                        >
                                            ⏬ Download Ticket
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-bookings">No ticket bookings found yet. Explore movies and book your first show!</p>
                    )}
                </div>
            )}

            {/* Watchlist Section */}
            {activeTab === 'watchlist' && (
                <div className="booking-history-section">
                    <h3 className="section-title">Saved Movies & Content</h3>

                    {watchlistMovies.length > 0 ? (
                        <div className="watchlist-grid">
                            {watchlistMovies.map((movie) => (
                                <div key={movie._id} className="watchlist-card">
                                    <img src={movie.poster} alt={movie.title} className="watchlist-poster" />
                                    <div className="watchlist-info">
                                        <h4>{movie.title}</h4>
                                        <p>⭐ {movie.rating}/10 • {movie.language}</p>
                                        <div className="watchlist-actions">
                                            <Link to={`/movies/${movie._id}`} className="btn btn-primary btn-sm">
                                                View Details
                                            </Link>
                                            <button
                                                className="btn-remove-watchlist"
                                                onClick={() => removeFromWatchlist(movie._id)}
                                            >
                                                ✕ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-watchlist">
                            <p>You haven't saved any movies to your watchlist yet.</p>
                            <Link to="/movies" className="btn btn-primary btn-sm">Browse Movies</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
