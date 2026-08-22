/**
 * @file HeroBanner.jsx
 * @description Premium BookMyShow Featured Hero Banner Carousel Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TrailerModal from '../common/TrailerModal';
import './HeroBanner.css';

const HeroBanner = () => {
    const featuredMovies = [
        {
            id: '3',
            title: 'Dune: Part Two',
            genre: 'Sci-Fi • Action • Adventure',
            language: 'English, Hindi, Telugu',
            rating: '8.8',
            votes: '145K',
            duration: '2h 46m',
            formats: ['IMAX 3D', '4DX', '2D'],
            description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
            bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1'
        },
        {
            id: '1',
            title: 'Oppenheimer',
            genre: 'Biography • Drama • History',
            language: 'English, Hindi',
            rating: '8.9',
            votes: '210K',
            duration: '3h 00m',
            formats: ['IMAX 70MM', 'IMAX 2D'],
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during WWII.',
            bgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1'
        },
        {
            id: '2',
            title: 'Interstellar',
            genre: 'Sci-Fi • Adventure • Drama',
            language: 'English',
            rating: '8.6',
            votes: '190K',
            duration: '2h 49m',
            formats: ['IMAX 3D', '2D'],
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival as Earth perishes.',
            bgImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auto slide carousel every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [featuredMovies.length]);

    const activeMovie = featuredMovies[currentIndex];

    return (
        <div className="hero-banner-container">
            {/* Background Banner with Overlay Gradient */}
            <div
                className="hero-slide-backdrop"
                style={{ backgroundImage: `linear-gradient(to right, rgba(11, 14, 20, 0.95) 25%, rgba(11, 14, 20, 0.6) 60%, rgba(11, 14, 20, 0.95)), url(${activeMovie.bgImage})` }}
            >
                <div className="hero-slide-content">
                    <div className="hero-badge-row">
                        <span className="badge badge-gold">⭐ FEATURED PREMIERE</span>
                        <div className="hero-formats">
                            {activeMovie.formats.map((fmt, i) => (
                                <span key={i} className={`format-pill ${fmt.includes('IMAX') ? 'imax' : 'premium'}`}>{fmt}</span>
                            ))}
                        </div>
                    </div>

                    <h1 className="hero-slide-title">{activeMovie.title}</h1>

                    <div className="hero-meta-row">
                        <span className="rating-pill">⭐ {activeMovie.rating} <small>({activeMovie.votes} votes)</small></span>
                        <span className="dot">•</span>
                        <span>{activeMovie.genre}</span>
                        <span className="dot">•</span>
                        <span>⏱️ {activeMovie.duration}</span>
                    </div>

                    <p className="hero-slide-description">{activeMovie.description}</p>

                    <div className="hero-slide-actions">
                        <Link to={`/shows/${activeMovie.id}`} className="btn btn-primary">
                            🎟️ Book Tickets
                        </Link>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            ▶ Watch Trailer
                        </button>
                    </div>
                </div>

                {/* Slide Indicators Dots */}
                <div className="carousel-indicators">
                    {featuredMovies.map((_, idx) => (
                        <button
                            key={idx}
                            className={`indicator-dot ${currentIndex === idx ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Slide ${idx + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Trailer Video Pop-up Modal */}
            <TrailerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movieTitle={activeMovie.title}
                trailerUrl={activeMovie.trailerUrl}
            />
        </div>
    );
};

export default HeroBanner;
