/**
 * @file MovieCarousel.jsx
 * @description Horizontal Scrolling Movie Carousel Component with pure CSS scroll snap
 */

import React, { useRef } from 'react';
import MovieCard from '../movies/MovieCard';
import './MovieCarousel.css';

const MovieCarousel = ({ title, movies = [] }) => {
    const scrollRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="carousel-section">
            <div className="carousel-header">
                <h2>{title}</h2>
                <div className="carousel-controls">
                    <button className="carousel-arrow" onClick={() => handleScroll('left')}>❮</button>
                    <button className="carousel-arrow" onClick={() => handleScroll('right')}>❯</button>
                </div>
            </div>

            <div className="carousel-track" ref={scrollRef}>
                {movies.map((movie) => (
                    <div key={movie._id} className="carousel-item">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MovieCarousel;
