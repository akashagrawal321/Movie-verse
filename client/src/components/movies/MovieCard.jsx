/**
 * @file MovieCard.jsx
 * @description Premium BookMyShow Inspired Movie Card Component with Fallback Card Artwork
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const [imgError, setImgError] = useState(false);

    const {
        _id,
        title,
        genre,
        language,
        poster,
        rating = '8.8',
        votes = '120K',
        formats = ['2D', 'IMAX 3D']
    } = movie || {};

    // Formatted genre array string
    const genreText = Array.isArray(genre) ? genre.join(' • ') : genre || 'Action • Drama';

    return (
        <div className="movie-card">
            {/* Poster Image Container with Hover Overlay */}
            <div className="poster-container">
                {!imgError && poster ? (
                    <img
                        src={poster}
                        alt={title || 'Movie Poster'}
                        className="poster-image"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="poster-fallback-card">
                        <div className="fallback-card-icon">🎬</div>
                        <h4 className="fallback-card-title">{title}</h4>
                        <span className="fallback-card-lang">{language || 'Hindi'}</span>
                    </div>
                )}

                {/* Rating Badge */}
                <div className="card-rating-badge">
                    ⭐ {rating} <span className="votes">({votes})</span>
                </div>

                {/* Formats Overlay Pills */}
                <div className="card-format-row">
                    {(formats || ['2D', 'IMAX 3D']).map((fmt, idx) => (
                        <span key={idx} className={`format-pill ${fmt.includes('IMAX') ? 'imax' : ''}`}>
                            {fmt}
                        </span>
                    ))}
                </div>

                {/* Hover Overlay with Quick Action Button */}
                <div className="card-hover-overlay">
                    <Link to={`/movie/${_id}`} className="btn btn-secondary btn-sm">
                        ℹ Details
                    </Link>
                    <Link to={`/shows/${_id}`} className="btn btn-primary btn-sm">
                        🎟️ Book Tickets
                    </Link>
                </div>
            </div>

            {/* Movie Meta Information */}
            <div className="movie-info">
                <h3 className="movie-title">
                    <Link to={`/movie/${_id}`}>{title || 'Untitled Movie'}</Link>
                </h3>
                <p className="movie-genre">{genreText}</p>
                <span className="movie-language">{language || 'English'}</span>
            </div>
        </div>
    );
};

export default MovieCard;
