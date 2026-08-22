/**
 * @file Navbar.jsx
 * @description BookMyShow-inspired Header Navigation with Full-Catalog Real-Time Search & Responsive Mobile Drawer Menu
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { INITIAL_MOVIES } from '../../data/moviesData';
import OffersModal from './OffersModal';
import GiftCardsModal from './GiftCardsModal';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedCity, setSelectedCity] = useState('Mumbai');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showOffersModal, setShowOffersModal] = useState(false);
    const [showGiftCardsModal, setShowGiftCardsModal] = useState(false);

    const cities = [
        'Mumbai',
        'Delhi-NCR',
        'Bengaluru',
        'Hyderabad',
        'Chennai',
        'Kolkata',
        'Ahmedabad',
        'Pune',
        'Jaipur',
        'Chandigarh',
        'Lucknow',
        'Kochi',
        'Indore',
        'Patna',
        'Goa',
        'Bhopal',
        'Surat',
        'Nagpur'
    ];

    // Real-time search across all 22+ catalog movies
    const filteredMovies = searchQuery.trim()
        ? INITIAL_MOVIES.filter((m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            (m.genre && (Array.isArray(m.genre) ? m.genre.join(' ') : m.genre).toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
            (m.language && m.language.toLowerCase().includes(searchQuery.toLowerCase().trim()))
        ).slice(0, 6) // Top 6 matching results
        : [];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="navbar-header">
            {/* Main Upper Header */}
            <div className="navbar-top">
                <div className="navbar-container">
                    {/* Logo & Mobile Menu Toggle */}
                    <div className="navbar-left-brand">
                        <button
                            className="mobile-hamburger-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>

                        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
                            <span className="logo-icon">🎬</span>
                            <span className="logo-text">Movie<span className="highlight">Verse</span></span>
                        </Link>
                    </div>

                    {/* Search Bar Form */}
                    <div className="navbar-search-wrapper">
                        <form onSubmit={handleSearchSubmit} className="navbar-search">
                            <button type="submit" className="search-submit-btn" title="Search">
                                🔍
                            </button>
                            <input
                                type="text"
                                placeholder="Search for Movies, Events, Plays, Sports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
                            )}
                        </form>

                        {/* Live Search Popup */}
                        {isSearchFocused && filteredMovies.length > 0 && (
                            <div className="search-results-dropdown">
                                {filteredMovies.map((movie) => (
                                    <Link
                                        key={movie._id}
                                        to={`/movie/${movie._id}`}
                                        className="search-result-item"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setIsSearchFocused(false);
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="search-thumb"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=100&q=80';
                                            }}
                                        />
                                        <div className="result-info">
                                            <span className="result-title">{movie.title}</span>
                                            <span className="result-genre">
                                                {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre} • {movie.language}
                                            </span>
                                        </div>
                                        <span className="rating-pill">⭐ {movie.rating}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* City Selector & Auth Actions */}
                    <div className="navbar-right">
                        {/* City Dropdown */}
                        <div className="city-selector">
                            <button
                                className="city-btn"
                                onClick={() => setShowCityDropdown(!showCityDropdown)}
                            >
                                📍 <span>{selectedCity}</span> ▾
                            </button>

                            {showCityDropdown && (
                                <div className="city-dropdown-menu">
                                    {cities.map((city) => (
                                        <div
                                            key={city}
                                            className={`city-item ${selectedCity === city ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setShowCityDropdown(false);
                                            }}
                                        >
                                            {city}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop Auth Actions & Admin Link */}
                        <div className="desktop-auth-links">
                            {isAuthenticated ? (
                                <div className="user-profile-menu">
                                    {isAdmin && (
                                        <Link to="/admin" className="btn btn-secondary btn-sm admin-badge-btn">
                                            📊 Admin
                                        </Link>
                                    )}
                                    <Link to="/my-bookings" className="btn btn-outline btn-sm">
                                        🎟️ Bookings
                                    </Link>
                                    <Link to="/profile" className="profile-btn">
                                        <span className="avatar">👤</span>
                                        <span className="name">{user?.name?.split(' ')[0] || 'Profile'}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn btn-primary btn-sm">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="mobile-drawer">
                    <form onSubmit={handleSearchSubmit} className="mobile-search-box">
                        <input
                            type="text"
                            placeholder="🔍 Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input mobile-input"
                        />
                    </form>

                    <div className="mobile-drawer-links">
                        <Link to="/movies" className="drawer-item" onClick={() => setMobileMenuOpen(false)}>🎬 Movies Catalog</Link>
                        <Link to="/wishlist" className="drawer-item" onClick={() => setMobileMenuOpen(false)}>❤️ My Wishlist</Link>
                        <button className="drawer-item promo-drawer-btn" onClick={() => { setMobileMenuOpen(false); setShowOffersModal(true); }}>🎁 Exclusive Offers</button>
                        <button className="drawer-item promo-drawer-btn" onClick={() => { setMobileMenuOpen(false); setShowGiftCardsModal(true); }}>🎟️ e-Gift Cards</button>

                        {isAuthenticated ? (
                            <>
                                <Link to="/my-bookings" className="drawer-item" onClick={() => setMobileMenuOpen(false)}>🎟️ My Ticket Bookings</Link>
                                <Link to="/profile" className="drawer-item" onClick={() => setMobileMenuOpen(false)}>👤 My Profile</Link>
                                {isAdmin && (
                                    <Link to="/admin" className="drawer-item admin-item" onClick={() => setMobileMenuOpen(false)}>📊 Admin Dashboard</Link>
                                )}
                                <button className="drawer-item logout-item" onClick={handleLogout}>🚪 Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="drawer-item login-item" onClick={() => setMobileMenuOpen(false)}>🔑 Sign In / Register</Link>
                        )}
                    </div>
                </div>
            )}

            {/* Sub Navigation Category Bar */}
            <nav className="navbar-sub">
                <div className="navbar-container sub-container">
                    <div className="sub-links-left">
                        <Link to="/movies?category=Movies" className="sub-link">🎬 Movies</Link>
                        <Link to="/movies?category=Stream" className="sub-link">📺 Stream</Link>
                        <Link to="/movies?category=Events" className="sub-link">🎪 Events</Link>
                        <Link to="/movies?category=Plays" className="sub-link">🎭 Plays</Link>
                        <Link to="/movies?category=Sports" className="sub-link">⚽ Sports</Link>
                    </div>
                    <div className="sub-links-right">
                        <button className="sub-promo-btn" onClick={() => setShowOffersModal(true)}>
                            🎁 Offers
                        </button>
                        <button className="sub-promo-btn" onClick={() => setShowGiftCardsModal(true)}>
                            🎟️ Gift Cards
                        </button>
                    </div>
                </div>
            </nav>

            {/* Interactive Modals */}
            <OffersModal isOpen={showOffersModal} onClose={() => setShowOffersModal(false)} />
            <GiftCardsModal isOpen={showGiftCardsModal} onClose={() => setShowGiftCardsModal(false)} />
        </header>
    );
};

export default Navbar;
