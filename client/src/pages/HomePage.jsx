/**
 * @file HomePage.jsx
 * @description BookMyShow-inspired Premium Homepage Page Component with Synchronized Recommended Movies
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroBanner from '../components/home/HeroBanner';
import LatestMovieAd from '../components/home/LatestMovieAd';
import PartnershipAdSection from '../components/home/PartnershipAdSection';
import MovieList from '../components/movies/MovieList';
import { INITIAL_MOVIES } from '../data/moviesData';
import './HomePage.css';

const HomePage = () => {
    const [moviesData, setMoviesData] = useState(INITIAL_MOVIES);
    const [selectedGenre, setSelectedGenre] = useState('All');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('/api/movies');
                if (res.data && res.data.movies && res.data.movies.length > 0) {
                    const fetched = res.data.movies;
                    const combined = [...fetched];
                    INITIAL_MOVIES.forEach((m) => {
                        const existingIdx = combined.findIndex(c => c.title.toLowerCase() === m.title.toLowerCase());
                        if (existingIdx === -1) {
                            combined.push(m);
                        } else if (!combined[existingIdx].poster || combined[existingIdx].poster.includes('media-amazon')) {
                            combined[existingIdx].poster = m.poster;
                        }
                    });
                    setMoviesData(combined);
                } else {
                    setMoviesData(INITIAL_MOVIES);
                }
            } catch (err) {
                setMoviesData(INITIAL_MOVIES);
            }
        };

        fetchMovies();
    }, []);

    const genres = ['All', 'Action', 'Sci-Fi', 'Biography', 'Drama', 'Crime', 'Comedy', 'Horror', 'Survival'];

    // Synchronized Genre Filter
    const filteredMovies = selectedGenre === 'All'
        ? moviesData
        : moviesData.filter((m) => {
            const mGenres = Array.isArray(m.genre) ? m.genre : [m.genre];
            return mGenres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
        });

    return (
        <div className="home-page-container">
            {/* Featured Banner Carousel */}
            <HeroBanner />

            {/* Latest Movie Spotlight Ad Banner */}
            <LatestMovieAd />

            {/* Recommended Movies Section */}
            <section className="home-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Recommended Movies ({filteredMovies.length})</h2>
                        <p className="section-subtitle">Explore top-rated blockbusters showing near you</p>
                    </div>
                    <Link to="/movies" className="see-all-link">
                        See All ({moviesData.length}) ❯
                    </Link>
                </div>

                {/* Genre Filter Chips */}
                <div className="genre-chips-row">
                    {genres.map((g) => (
                        <button
                            key={g}
                            className={`filter-chip ${selectedGenre === g ? 'active' : ''}`}
                            onClick={() => setSelectedGenre(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                {/* Movies Grid */}
                <MovieList movies={filteredMovies} />
            </section>

            {/* Stream Premiere Promo Banner */}
            <section className="promo-banner-section">
                <div className="promo-banner-card">
                    <div className="promo-content">
                        <span className="promo-badge">🎬 MOVIEVERSE STREAM</span>
                        <h2>Premiere Movies Direct to your Living Room</h2>
                        <p>Rent or buy brand new releases every Friday with 4K HDR & Dolby Atmos surround audio.</p>
                        <Link to="/movies" className="btn btn-primary">
                            Explore Premieres
                        </Link>
                    </div>
                    <div className="promo-graphic">🍿</div>
                </div>
            </section>

            {/* Preferred Cinema Chains */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Popular Cinema Chains</h2>
                </div>
                <div className="cinema-chains-grid">
                    <div className="cinema-chain-card">
                        <span className="chain-logo">PVR</span>
                        <span className="chain-name">PVR IMAX & Directors Cut</span>
                    </div>
                    <div className="cinema-chain-card">
                        <span className="chain-logo">INOX</span>
                        <span className="chain-name">INOX Megaplex</span>
                    </div>
                    <div className="cinema-chain-card">
                        <span className="chain-logo">CINEPOLIS</span>
                        <span className="chain-name">Cinepolis VIP 4DX</span>
                    </div>
                    <div className="cinema-chain-card">
                        <span className="chain-logo">MIRAJ</span>
                        <span className="chain-name">Miraj Cinemas</span>
                    </div>
                </div>
            </section>

            {/* Brand & Movie Partnership Advertising Section */}
            <PartnershipAdSection />
        </div>
    );
};

export default HomePage;
