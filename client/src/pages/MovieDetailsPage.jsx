/**
 * @file MovieDetailsPage.jsx
 * @description Premium BookMyShow Inspired Movie Details Page Component with Full Interactive Functionalities (Rate Now, Watchlist, Share, Format Selector & User Reviews)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TrailerModal from '../components/common/TrailerModal';
import RatingModal from '../components/movies/RatingModal';
import { INITIAL_MOVIES } from '../data/moviesData';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('All');
    const [toastMessage, setToastMessage] = useState('');

    // Comprehensive detailed movie dictionary
    const moviesDict = {
        '1': {
            _id: '1',
            title: 'Oppenheimer',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II. A gripping historical biopic directed by Christopher Nolan.',
            language: 'English, Hindi',
            genre: ['Biography', 'Drama', 'History'],
            duration: '3h 00m',
            rating: '8.9',
            votes: '210K',
            releaseDate: '2023-07-21',
            formats: ['IMAX 70MM', 'IMAX 2D', '2D'],
            poster: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
            bannerBg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
            cast: [
                { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Cillian_Murphy_2014.jpg' },
                { name: 'Emily Blunt', role: 'Katherine Oppenheimer', avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Emily_Blunt_2018.jpg' },
                { name: 'Matt Damon', role: 'Leslie Groves', avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Matt_Damon_2014.jpg' },
                { name: 'Robert Downey Jr.', role: 'Lewis Strauss', avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' }
            ]
        },
        '2': {
            _id: '2',
            title: 'Interstellar',
            description: 'When Earth becomes uninhabitable, a team of ex-NASA astronauts travel through a wormhole near Saturn in search of a new home for mankind.',
            language: 'English, Hindi',
            genre: ['Sci-Fi', 'Adventure', 'Drama'],
            duration: '2h 49m',
            rating: '8.6',
            votes: '190K',
            releaseDate: '2014-11-07',
            formats: ['IMAX 3D', '2D'],
            poster: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
            bannerBg: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
            cast: [
                { name: 'Matthew McConaughey', role: 'Joseph Cooper', avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Matthew_McConaughey_2019_%28cropped%29.jpg' },
                { name: 'Anne Hathaway', role: 'Dr. Amelia Brand', avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Anne_Hathaway_at_the_2018_Toronto_International_Film_Festival.jpg' },
                { name: 'Jessica Chastain', role: 'Murphy Cooper', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Jessica_Chastain_2019_by_Glenn_Francis.jpg' },
                { name: 'Michael Caine', role: 'Professor Brand', avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Sir_Michael_Caine_at_the_East_End_Film_Festival.jpg' }
            ]
        },
        '3': {
            _id: '3',
            title: 'Dune: Part Two',
            description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family on the desert planet of Arrakis.',
            language: 'English, Hindi, Telugu',
            genre: ['Sci-Fi', 'Action', 'Adventure'],
            duration: '2h 46m',
            rating: '8.8',
            votes: '145K',
            releaseDate: '2024-03-01',
            formats: ['IMAX 3D', '4DX', '2D'],
            poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
            bannerBg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
            cast: [
                { name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg' },
                { name: 'Zendaya', role: 'Chani', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg' },
                { name: 'Rebecca Ferguson', role: 'Lady Jessica', avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Rebecca_Ferguson_2018.jpg' },
                { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Austin_Butler_2022.jpg' }
            ]
        },
        '4': {
            _id: '4',
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            language: 'English, Hindi',
            genre: ['Action', 'Crime', 'Drama'],
            duration: '2h 32m',
            rating: '9.0',
            votes: '280K',
            releaseDate: '2008-07-18',
            formats: ['IMAX 2D', '2D'],
            poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
            bannerBg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
            cast: [
                { name: 'Christian Bale', role: 'Bruce Wayne / Batman', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Christian_Bale-7837.jpg' },
                { name: 'Heath Ledger', role: 'Joker', avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Heath_Ledger_%282007%29.jpg' },
                { name: 'Aaron Eckhart', role: 'Harvey Dent', avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/AaronEckhartOct08.jpg' },
                { name: 'Gary Oldman', role: 'Jim Gordon', avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Gary_Oldman_Cannes_2017.jpg' }
            ]
        },
        '14': {
            _id: '14',
            title: 'Stree 2',
            description: 'The peaceful town of Chanderi is terrorized once again by a new headless malevolent spirit named Sarkata. Vicky, Stree, and their eccentric gang must unite to save Chanderi.',
            language: 'Hindi',
            genre: ['Comedy', 'Horror'],
            duration: '2h 27m',
            rating: '8.3',
            votes: '140K',
            releaseDate: '2024-08-15',
            formats: ['2D'],
            poster: 'https://upload.wikimedia.org/wikipedia/en/0/00/Stree-2.jpg',
            bannerBg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1600&q=80',
            trailerUrl: 'https://www.youtube.com/embed/vSQjk9jKzGg',
            cast: [
                { name: 'Shraddha Kapoor', role: 'The Unknown Stree', avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Shraddha_Kapoor_promoting_Tu_Jhoothi_Main_Makkaar.jpg' },
                { name: 'Rajkummar Rao', role: 'Vicky', avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Rajkummar_Rao_promoting_Made_In_China.jpg' },
                { name: 'Pankaj Tripathi', role: 'Rudra', avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Pankaj_Tripathi_in_2021.jpg' },
                { name: 'Abhishek Banerjee', role: 'Jana', avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Abhishek_Banerjee.jpg' }
            ]
        }
    };

    // Load movie metadata with initial fallbacks
    const selectedMovie = moviesDict[id] || INITIAL_MOVIES.find((m) => m._id === id || String(m.id) === id) || INITIAL_MOVIES[0];

    const [movieData, setMovieData] = useState(selectedMovie);
    const [userRating, setUserRating] = useState(null);
    const [reviews, setReviews] = useState([
        { user: 'Rahul S.', rating: 9, comment: 'Mind-blowing visuals and spectacular direction! Must watch in theaters.', date: '2 days ago' },
        { user: 'Priya M.', rating: 10, comment: 'One of the best cinematic experiences of the year!', date: '1 week ago' }
    ]);

    // Check if watchlisted in localStorage
    useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem('user_watchlist') || '[]');
        setIsWatchlisted(savedWatchlist.includes(movieData._id));
    }, [movieData._id]);

    // Show temporary toast notification
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Handle User Rating Submission
    const handleRatingSubmit = (stars, text) => {
        setUserRating(stars);
        // Calculate new rating average state
        const numVotes = parseInt(String(movieData.votes).replace(/[^0-9]/g, '')) || 100;
        const newVotes = numVotes + 1;
        const updatedRating = (((parseFloat(movieData.rating) * numVotes) + stars) / newVotes).toFixed(1);

        setMovieData(prev => ({
            ...prev,
            rating: updatedRating,
            votes: `${newVotes}K`
        }));

        if (text && text.trim()) {
            setReviews(prev => [
                { user: 'You', rating: stars, comment: text, date: 'Just now' },
                ...prev
            ]);
        }

        showToast(`⭐ Rating of ${stars}/10 submitted successfully!`);
    };

    // Toggle Watchlist / Favorite State
    const toggleWatchlist = () => {
        const savedWatchlist = JSON.parse(localStorage.getItem('user_watchlist') || '[]');
        let updated = [];
        if (isWatchlisted) {
            updated = savedWatchlist.filter(item => item !== movieData._id);
            showToast('Removed from Watchlist');
        } else {
            updated = [...savedWatchlist, movieData._id];
            showToast('❤️ Added to your Watchlist!');
        }
        localStorage.setItem('user_watchlist', JSON.stringify(updated));
        setIsWatchlisted(!isWatchlisted);
    };

    // Copy Shareable Link to Clipboard
    const copyShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Movie link copied to clipboard!');
    };

    return (
        <div className="movie-details-container">
            {/* Toast Feedback Banner */}
            {toastMessage && <div className="details-toast-banner">{toastMessage}</div>}

            {/* Immersive Hero Header */}
            <div
                className="details-hero-backdrop"
                style={{ backgroundImage: `linear-gradient(to right, rgba(11, 14, 20, 0.96) 30%, rgba(11, 14, 20, 0.75) 70%, rgba(11, 14, 20, 0.96)), url(${movieData.bannerBg || movieData.banner})` }}
            >
                <div className="details-hero-content">
                    {/* Poster Image */}
                    <div className="details-poster-box">
                        <img
                            src={movieData.poster}
                            alt={movieData.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://upload.wikimedia.org/wikipedia/en/0/00/Stree-2.jpg';
                            }}
                        />
                    </div>

                    {/* Details Meta */}
                    <div className="details-info-box">
                        <h1 className="details-title">{movieData.title}</h1>

                        {/* Interactive Rating Bar */}
                        <div className="details-rating-bar">
                            <span className="rating-pill">⭐ {movieData.rating}/10</span>
                            <span className="votes-count">({movieData.votes} votes)</span>
                            <button
                                className="rate-now-btn"
                                onClick={() => setIsRatingOpen(true)}
                            >
                                {userRating ? `Your Rating: ⭐ ${userRating}/10 (Edit)` : 'Rate Now'}
                            </button>
                        </div>

                        {/* Formats and Languages */}
                        <div className="details-tags-row">
                            <div className="tag-box">
                                <span className="tag-label">Formats:</span>
                                {(movieData.formats || ['2D']).map((fmt, i) => (
                                    <button
                                        key={i}
                                        className={`format-pill ${selectedFormat === fmt ? 'selected' : ''} ${fmt.includes('IMAX') ? 'imax' : ''}`}
                                        onClick={() => {
                                            setSelectedFormat(fmt);
                                            showToast(`Selected Format: ${fmt}`);
                                        }}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                            <div className="tag-box">
                                <span className="tag-label">Languages:</span>
                                <span className="tag-val">{movieData.language}</span>
                            </div>
                        </div>

                        {/* Duration, Genres, Release Date */}
                        <div className="details-meta-specs">
                            <span>⏱️ {movieData.duration}</span>
                            <span>•</span>
                            <span>{Array.isArray(movieData.genre) ? movieData.genre.join(', ') : movieData.genre}</span>
                            <span>•</span>
                            <span>📅 {movieData.releaseDate}</span>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="details-actions">
                            <Link to={`/shows/${movieData._id}`} className="btn btn-primary btn-lg">
                                🎟️ Book Tickets
                            </Link>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={() => setIsTrailerOpen(true)}
                            >
                                ▶ Watch Trailer
                            </button>

                            {/* Watchlist & Share Buttons */}
                            <button
                                className={`btn-icon-action ${isWatchlisted ? 'active' : ''}`}
                                onClick={toggleWatchlist}
                                title={isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                            >
                                {isWatchlisted ? '❤️ Saved' : '🤍 Watchlist'}
                            </button>
                            <button
                                className="btn-icon-action"
                                onClick={copyShareLink}
                                title="Share Link"
                            >
                                🔗 Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Page Content Body */}
            <div className="details-body">
                {/* About the Movie */}
                <section className="details-section">
                    <h2>About the Content</h2>
                    <p className="synopsis-text">{movieData.description}</p>
                </section>

                {/* Cast & Crew */}
                <section className="details-section">
                    <h2>Cast & Lead Performers</h2>
                    <div className="cast-grid">
                        {(movieData.cast || [
                            { name: 'Lead Performer', role: 'Main Character' },
                            { name: 'Co-Star', role: 'Supporting Role' }
                        ]).map((actor, idx) => (
                            <div key={idx} className="cast-card text-badge-card" onClick={() => showToast(`Performer: ${actor.name} (${actor.role})`)}>
                                <div className="cast-badge-icon">🎭</div>
                                <div className="cast-badge-info">
                                    <span className="cast-name">{actor.name}</span>
                                    <span className="cast-role">{actor.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* User Reviews Section */}
                <section className="details-section">
                    <div className="reviews-section-header">
                        <h2>User Reviews & Ratings ({reviews.length})</h2>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsRatingOpen(true)}>
                            + Write a Review
                        </button>
                    </div>

                    <div className="reviews-list">
                        {reviews.map((rev, idx) => (
                            <div key={idx} className="review-card">
                                <div className="review-card-header">
                                    <span className="review-author">{rev.user}</span>
                                    <span className="review-score">⭐ {rev.rating}/10</span>
                                </div>
                                <p className="review-comment">{rev.comment}</p>
                                <span className="review-date">{rev.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Interactive 10-Star Rating Modal */}
            <RatingModal
                isOpen={isRatingOpen}
                onClose={() => setIsRatingOpen(false)}
                movieTitle={movieData.title}
                currentRating={movieData.rating}
                onRateSubmit={handleRatingSubmit}
            />

            {/* Trailer Video Popup Modal */}
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                movieTitle={movieData.title}
                trailerUrl={movieData.trailerUrl}
            />
        </div>
    );
};

export default MovieDetailsPage;
