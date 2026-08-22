/**
 * @file WishlistPage.jsx
 * @description User Wishlist Page for saved bookmark movies
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/movies/MovieCard';
import './WishlistPage.css';

const WishlistPage = () => {
    const [wishlistItems] = useState([
        {
            _id: '1',
            title: 'Oppenheimer',
            genre: ['Biography', 'Drama'],
            language: 'English',
            rating: 8.9,
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80'
        },
        {
            _id: '3',
            title: 'Dune: Part Two',
            genre: ['Sci-Fi', 'Action'],
            language: 'English',
            rating: 8.8,
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80'
        }
    ]);

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>❤️ My Movie Wishlist</h1>
                <p>Keep track of all the upcoming blockbusters you want to watch.</p>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="movies-grid">
                    {wishlistItems.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <p>Your wishlist is currently empty.</p>
                    <Link to="/movies" className="btn btn-primary">
                        Explore Movies 🍿
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
