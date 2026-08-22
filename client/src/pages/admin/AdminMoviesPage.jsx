/**
 * @file AdminMoviesPage.jsx
 * @description Admin Page for Adding, Editing, Listing, and Deleting Catalog Movies
 */

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import './AdminMoviesPage.css';

const AdminMoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        language: '',
        duration: 120,
        poster: '',
        trailer: '',
        rating: 8.5
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await API.get('/movies');
            if (res.data && res.data.success) {
                setMovies(res.data.movies);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleOpenAddModal = () => {
        setEditingMovie(null);
        setFormData({
            title: '',
            description: '',
            genre: 'Action, Sci-Fi',
            language: 'English',
            duration: 120,
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
            trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            rating: 8.5
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (movie) => {
        setEditingMovie(movie);
        setFormData({
            title: movie.title,
            description: movie.description,
            genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
            language: movie.language,
            duration: movie.duration,
            poster: movie.poster,
            trailer: movie.trailer || '',
            rating: movie.rating
        });
        setShowModal(true);
    };

    const handleDeleteMovie = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie entry?')) {
            try {
                const res = await API.delete(`/movies/${id}`);
                if (res.data && res.data.success) {
                    setMessage({ type: 'success', text: 'Movie deleted successfully' });
                    fetchMovies();
                }
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                genre: formData.genre.split(',').map((g) => g.trim())
            };

            if (editingMovie) {
                const res = await API.put(`/movies/${editingMovie._id}`, payload);
                if (res.data && res.data.success) {
                    setMessage({ type: 'success', text: 'Movie updated successfully' });
                }
            } else {
                const res = await API.post('/movies', payload);
                if (res.data && res.data.success) {
                    setMessage({ type: 'success', text: 'Movie added successfully' });
                }
            }

            setShowModal(false);
            fetchMovies();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
        }
    };

    return (
        <div className="admin-movies-container">
            <div className="admin-header-row">
                <div>
                    <h1>🎬 Catalog Movie Management</h1>
                    <p>Add, edit, or remove catalog movies available for booking.</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    + Add New Movie
                </button>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="loading-spinner">Loading movies...</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Title</th>
                                <th>Language</th>
                                <th>Duration</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie._id}>
                                    <td>
                                        <img src={movie.poster} alt={movie.title} className="table-poster-thumb" />
                                    </td>
                                    <td>
                                        <strong>{movie.title}</strong>
                                        <div className="small-text">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</div>
                                    </td>
                                    <td>{movie.language}</td>
                                    <td>{movie.duration} mins</td>
                                    <td>⭐ {movie.rating}/10</td>
                                    <td className="actions-cell">
                                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenEditModal(movie)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMovie(movie._id)}>
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Dialog */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content glassmorphism">
                        <h3>{editingMovie ? 'Edit Movie Entry' : 'Add New Catalog Movie'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Movie Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Language</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration (mins)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Genres (comma separated)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rating (0-10)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Poster Image URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.poster}
                                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Synopsis Description</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingMovie ? 'Save Changes' : 'Create Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMoviesPage;
