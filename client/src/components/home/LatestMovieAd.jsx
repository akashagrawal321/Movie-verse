/**
 * @file LatestMovieAd.jsx
 * @description High-Impact Premium Movie Spotlight Advertisement Banner
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TrailerModal from '../common/TrailerModal';
import './LatestMovieAd.css';

const LatestMovieAd = () => {
    const [showTrailer, setShowTrailer] = useState(false);

    const latestMovie = {
        title: 'Avatar: Fire & Ash',
        subtitle: 'THE NEXT CINEMATIC EPIC IN IMAX 3D',
        tagline: 'Enter the unchartered volcanic regions of Pandora. Experience unmatched visual realism.',
        releaseDate: 'Releasing Worldwide This Friday',
        imdb: '9.4',
        rating: 'UA 13+',
        trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        discountCode: 'AVATAR20'
    };

    return (
        <section className="latest-movie-ad-section">
            <div className="ad-container">
                <div className="ad-spotlight-badge">
                    <span className="badge-pulse">⚡ SPECIAL MOVIE SPOTLIGHT</span>
                    <span className="ad-tag">SPONSORED ADVERTISEMENT</span>
                </div>

                <div className="ad-billboard-card">
                    {/* Visual Graphic Banner */}
                    <div className="ad-poster-wrapper">
                        <img src={latestMovie.posterUrl} alt={latestMovie.title} className="ad-poster-img" />
                        <span className="imax-badge">IMAX 3D</span>
                    </div>

                    {/* Movie Information & Actions */}
                    <div className="ad-content">
                        <span className="ad-subtitle">{latestMovie.subtitle}</span>
                        <h2 className="ad-title">{latestMovie.title}</h2>

                        <div className="ad-meta-tags">
                            <span className="ad-meta-pill rating">⭐ {latestMovie.imdb} IMDb</span>
                            <span className="ad-meta-pill cert">{latestMovie.rating}</span>
                            <span className="ad-meta-pill date">📅 {latestMovie.releaseDate}</span>
                        </div>

                        <p className="ad-tagline">{latestMovie.tagline}</p>

                        <div className="ad-promo-box">
                            <span className="promo-gift-icon">🎁</span>
                            <div>
                                <span className="promo-title">Exclusive Opening Offer!</span>
                                <p className="promo-text">Get 20% cashback on advance group tickets with code <strong className="code-highlight">{latestMovie.discountCode}</strong></p>
                            </div>
                        </div>

                        <div className="ad-actions">
                            <Link to="/movies" className="btn btn-primary btn-lg">
                                🎟️ Book Advance Tickets
                            </Link>
                            <button className="btn btn-secondary btn-lg" onClick={() => setShowTrailer(true)}>
                                ▶️ Watch Teaser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            <TrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                videoUrl={latestMovie.trailerUrl}
                title={latestMovie.title}
            />
        </section>
    );
};

export default LatestMovieAd;
