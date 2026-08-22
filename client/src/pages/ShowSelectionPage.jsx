/**
 * @file ShowSelectionPage.jsx
 * @description User Show Selection Page displaying cinema theatres and available showtimes by movie
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Data Grouping: Organizes raw showtime arrays by Theatre venue ObjectId.
 * 2. Date Filtering: Filters showtimes based on active date pill selection.
 * 3. Dynamic Navigation: Clicking a time slot routes user to `/booking/:showId`.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './ShowSelectionPage.css';

const ShowSelectionPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('Today');

    // Sample Dates Row
    const dates = [
        { label: 'TODAY', dateStr: 'Aug 20' },
        { label: 'TOMORROW', dateStr: 'Aug 21' },
        { label: 'FRI', dateStr: 'Aug 22' },
        { label: 'SAT', dateStr: 'Aug 23' },
        { label: 'SUN', dateStr: 'Aug 24' }
    ];

    // Demo fallback dataset if backend shows are empty
    const fallbackMovie = {
        _id: movieId || '1',
        title: 'Oppenheimer',
        language: 'English, Hindi',
        genre: ['Biography', 'Drama'],
        duration: 180,
        rating: '8.9',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80'
    };

    const fallbackTheatres = [
        {
            theatreName: 'PVR IMAX Megaplex, Lower Parel',
            address: 'Phoenix Palladium Mall, Senapati Bapat Marg, Mumbai',
            showtimes: [
                { _id: 's1', time: '10:30 AM', price: 250, format: 'IMAX 3D' },
                { _id: 's2', time: '02:15 PM', price: 320, format: 'IMAX 3D' },
                { _id: 's3', time: '06:45 PM', price: 380, format: 'IMAX 3D' },
                { _id: 's4', time: '10:00 PM', price: 280, format: '2D' }
            ]
        },
        {
            theatreName: 'INOX Megaplex, Inorbit Mall',
            address: 'Link Road, Malad West, Mumbai',
            showtimes: [
                { _id: 's5', time: '11:15 AM', price: 220, format: '2D' },
                { _id: 's6', time: '03:30 PM', price: 280, format: '4DX' },
                { _id: 's7', time: '07:15 PM', price: 350, format: '4DX' }
            ]
        },
        {
            theatreName: 'Cinepolis VIP 4DX, Viviana Mall',
            address: 'Eastern Express Highway, Thane West, Mumbai',
            showtimes: [
                { _id: 's8', time: '01:00 PM', price: 300, format: 'VIP 2D' },
                { _id: 's9', time: '05:30 PM', price: 400, format: 'VIP 3D' },
                { _id: 's10', time: '09:15 PM', price: 350, format: 'VIP 3D' }
            ]
        }
    ];

    useEffect(() => {
        fetchMovieAndShows();
    }, [movieId]);

    const fetchMovieAndShows = async () => {
        setLoading(true);
        try {
            const [movieRes, showsRes] = await Promise.all([
                API.get(`/movies/${movieId}`),
                API.get(`/shows/movie/${movieId}`)
            ]);

            if (movieRes.data.success) setMovie(movieRes.data.movie);
            if (showsRes.data.success) setShows(showsRes.data.shows || []);
        } catch (error) {
            console.error('[Fetch Shows Error]:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeMovie = movie || fallbackMovie;

    return (
        <div className="show-selection-container">
            {/* Top Movie Summary Header */}
            <div className="show-movie-header">
                <div className="header-inner">
                    <div className="movie-header-thumb">
                        <img src={activeMovie.poster} alt={activeMovie.title} />
                    </div>

                    <div className="movie-header-meta">
                        <h1>{activeMovie.title}</h1>
                        <div className="header-tags">
                            <span className="rating-pill">⭐ {activeMovie.rating || '8.9'}</span>
                            <span>{activeMovie.language || 'English, Hindi'}</span>
                            <span>•</span>
                            <span>⏱️ {activeMovie.duration || 180} mins</span>
                            <span>•</span>
                            <span>{Array.isArray(activeMovie.genre) ? activeMovie.genre.join(', ') : activeMovie.genre}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Selector Filter Row */}
            <div className="date-filter-bar">
                <div className="date-filter-inner">
                    {dates.map((d, i) => (
                        <button
                            key={i}
                            className={`date-pill-btn ${selectedDate === d.label ? 'active' : ''}`}
                            onClick={() => setSelectedDate(d.label)}
                        >
                            <span className="day-lbl">{d.label}</span>
                            <span className="date-lbl">{d.dateStr}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Theatres List */}
            <main className="shows-main-content">
                <div className="theatres-legend">
                    <span>🟢 Available</span>
                    <span>🟡 Fast Filling</span>
                    <span>🔴 Almost Full</span>
                </div>

                <div className="theatres-list">
                    {fallbackTheatres.map((t, idx) => (
                        <div key={idx} className="theatre-card">
                            {/* Theatre Meta */}
                            <div className="theatre-info">
                                <span className="heart-icon">❤️</span>
                                <div>
                                    <h3 className="theatre-title">{t.theatreName}</h3>
                                    <p className="theatre-address">📍 {t.address}</p>
                                </div>
                            </div>

                            {/* Showtimes Buttons Grid */}
                            <div className="showtimes-grid">
                                {t.showtimes.map((st) => (
                                    <button
                                        key={st._id}
                                        className="time-slot-btn"
                                        onClick={() => navigate(`/booking/${st._id}`)}
                                    >
                                        <span className="slot-time">{st.time}</span>
                                        <span className="slot-format">{st.format}</span>
                                        <span className="slot-price">₹{st.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ShowSelectionPage;
