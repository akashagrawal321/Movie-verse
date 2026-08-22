/**
 * @file MovieList.jsx
 * @description Responsive Movie Cards Grid Component
 */

import React from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

const MovieList = ({ movies = [] }) => {
    if (!movies || movies.length === 0) {
        return (
            <div className="movie-list-empty">
                <span className="empty-icon">🎬</span>
                <h3>No Movies Found</h3>
                <p>Try adjusting your search query or genre filter.</p>
            </div>
        );
    }

    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
