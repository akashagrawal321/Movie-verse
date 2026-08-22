/**
 * @file MoviesPage.jsx
 * @description Dedicated Movies Catalogue Page with Synchronized Category, Language, Genre & Format Filters
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieList from '../components/movies/MovieList';
import { INITIAL_MOVIES } from '../data/moviesData';
import './MoviesPage.css';

const MoviesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSearchQuery = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';

    const [moviesList, setMoviesList] = useState(INITIAL_MOVIES);
    const [loading, setLoading] = useState(false);

    // Synchronized Filter State Variables
    const [search, setSearch] = useState(urlSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedFormat, setSelectedFormat] = useState('All');
    const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'title'

    // Sync state if URL query params change (e.g. from sub-navbar click)
    useEffect(() => {
        if (urlSearchQuery !== undefined) {
            setSearch(urlSearchQuery);
        }
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        }
    }, [urlSearchQuery, urlCategory]);

    // Fetch from backend API if available, fallback to INITIAL_MOVIES dataset
    useEffect(() => {
        const fetchMoviesFromApi = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/movies');
                if (res.data && res.data.movies && res.data.movies.length > 0) {
                    const fetched = res.data.movies;
                    const combined = [...fetched];
                    INITIAL_MOVIES.forEach((m) => {
                        const existingIdx = combined.findIndex(c => c.title.toLowerCase() === m.title.toLowerCase());
                        if (existingIdx === -1) {
                            combined.push(m);
                        } else {
                            combined[existingIdx].category = m.category || 'Movies';
                            if (!combined[existingIdx].poster || combined[existingIdx].poster.includes('media-amazon')) {
                                combined[existingIdx].poster = m.poster;
                            }
                        }
                    });
                    setMoviesList(combined);
                }
            } catch (err) {
                setMoviesList(INITIAL_MOVIES);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesFromApi();
    }, []);

    const categories = ['All', 'Movies', 'Stream', 'Events', 'Plays', 'Sports'];
    const languages = ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];
    const genres = ['All', 'Action', 'Sci-Fi', 'Biography', 'Drama', 'Crime', 'Comedy', 'Horror', 'Survival', 'Fantasy', 'Music'];
    const formats = ['All', 'IMAX 3D', 'IMAX 2D', '4DX', '3D', '2D', 'OTT 4K'];

    // Category Emoji Icons
    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Movies': return '🎬';
            case 'Stream': return '📺';
            case 'Events': return '🎪';
            case 'Plays': return '🎭';
            case 'Sports': return '⚽';
            default: return '🍿';
        }
    };

    // Synchronized Real-time Filtering Logic
    const filteredMovies = moviesList.filter((movie) => {
        // Category Filter
        const matchesCategory = selectedCategory === 'All' ||
            (movie.category && movie.category.toLowerCase() === selectedCategory.toLowerCase());

        // Search Title / Description Filter
        const matchesSearch = !search.trim() ||
            movie.title.toLowerCase().includes(search.toLowerCase().trim()) ||
            (movie.description && movie.description.toLowerCase().includes(search.toLowerCase().trim()));

        // Language Filter
        const movieLangs = Array.isArray(movie.language)
            ? movie.language
            : (movie.language ? movie.language.split(',').map(l => l.trim()) : []);
        const matchesLang = selectedLanguage === 'All' || movieLangs.some(l => l.toLowerCase() === selectedLanguage.toLowerCase());

        // Genre Filter
        const movieGenres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
        const matchesGenre = selectedGenre === 'All' || movieGenres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());

        // Format Filter
        const movieFormats = Array.isArray(movie.formats) ? movie.formats : ['2D'];
        const matchesFormat = selectedFormat === 'All' || movieFormats.some(f => f.toLowerCase().includes(selectedFormat.toLowerCase()));

        return matchesCategory && matchesSearch && matchesLang && matchesGenre && matchesFormat;
    }).sort((a, b) => {
        if (sortBy === 'rating') {
            return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        }
        return a.title.localeCompare(b.title);
    });

    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('All');
        setSelectedLanguage('All');
        setSelectedGenre('All');
        setSelectedFormat('All');
        setSortBy('rating');
        setSearchParams({});
    };

    return (
        <div className="movies-page-container">
            {/* Page Header */}
            <div className="movies-page-header">
                <h1>{selectedCategory === 'All' ? 'Movies & Entertainment in Cinema' : `${selectedCategory} Collection`}</h1>
                <p>Browse live blockbusters, OTT streams, theater plays, concerts, and stadium sports.</p>

                {/* Top Category Switcher Bar */}
                <div className="top-category-bar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`top-category-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSearchParams(cat === 'All' ? {} : { category: cat });
                            }}
                        >
                            <span className="cat-emoji">{getCategoryIcon(cat)}</span> {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="movies-layout">
                {/* Sidebar Filters Column */}
                <aside className="filters-sidebar">
                    <div className="filter-card">
                        <div className="filter-header">
                            <h3>Filters</h3>
                            <button className="reset-btn" onClick={resetFilters}>Clear All</button>
                        </div>

                        {/* Search Input */}
                        <div className="filter-group">
                            <label>Search Title</label>
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="filter-search-input"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <label>Category / Type</label>
                            <div className="filter-options-grid">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`filter-pill-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSearchParams(cat === 'All' ? {} : { category: cat });
                                        }}
                                    >
                                        {getCategoryIcon(cat)} {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Languages Filter */}
                        <div className="filter-group">
                            <label>Languages</label>
                            <div className="filter-options-grid">
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        className={`filter-pill-btn ${selectedLanguage === lang ? 'active' : ''}`}
                                        onClick={() => setSelectedLanguage(lang)}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Genres Filter */}
                        <div className="filter-group">
                            <label>Genres</label>
                            <div className="filter-options-grid">
                                {genres.map((g) => (
                                    <button
                                        key={g}
                                        className={`filter-pill-btn ${selectedGenre === g ? 'active' : ''}`}
                                        onClick={() => setSelectedGenre(g)}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Formats Filter */}
                        <div className="filter-group">
                            <label>Format</label>
                            <div className="filter-options-grid">
                                {formats.map((fmt) => (
                                    <button
                                        key={fmt}
                                        className={`filter-pill-btn ${selectedFormat === fmt ? 'active' : ''}`}
                                        onClick={() => setSelectedFormat(fmt)}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Movies Grid Main Column */}
                <main className="movies-main">
                    <div className="movies-result-bar">
                        <span>Showing <strong>{filteredMovies.length}</strong> of <strong>{moviesList.length}</strong> {selectedCategory === 'All' ? 'Items' : selectedCategory}</span>
                        <div className="sort-selector">
                            <label>Sort By:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                <option value="rating">Top Rated ⭐</option>
                                <option value="title">Title A-Z</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading catalog...</div>
                    ) : filteredMovies.length > 0 ? (
                        <MovieList movies={filteredMovies} />
                    ) : (
                        <div className="no-movies-found">
                            <h3>No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'items'} match your selected filters</h3>
                            <p>Try clearing active filters or selecting another category.</p>
                            <button className="btn btn-primary" onClick={resetFilters}>Reset All Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MoviesPage;
