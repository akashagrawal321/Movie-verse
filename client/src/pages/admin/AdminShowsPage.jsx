/**
 * @file AdminShowsPage.jsx
 * @description Admin Page for Scheduling Movie Showtimes, Managing Cinema Venues & Auditoriums
 */

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import './AdminShowsPage.css';

const AdminShowsPage = () => {
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedTheatre, setSelectedTheatre] = useState('');
    const [selectedScreen, setSelectedScreen] = useState('');
    const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
    const [showTime, setShowTime] = useState('07:30 PM');
    const [ticketPrice, setTicketPrice] = useState(250);

    // New Theatre Form state
    const [newTheatre, setNewTheatre] = useState({ theatreName: '', city: 'Mumbai', address: '' });
    const [showTheatreModal, setShowTheatreModal] = useState(false);

    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [moviesRes, theatresRes] = await Promise.all([
                API.get('/movies'),
                API.get('/shows/theatres')
            ]);

            if (moviesRes.data && moviesRes.data.success) {
                setMovies(moviesRes.data.movies);
                if (moviesRes.data.movies.length > 0) setSelectedMovie(moviesRes.data.movies[0]._id);
            }

            if (theatresRes.data && theatresRes.data.success) {
                setTheatres(theatresRes.data.theatres);
                if (theatresRes.data.theatres.length > 0) {
                    const firstTheatre = theatresRes.data.theatres[0]._id;
                    setSelectedTheatre(firstTheatre);
                    fetchScreens(firstTheatre);
                }
            }
        } catch (error) {
            console.error('Error fetching admin show data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchScreens = async (theatreId) => {
        try {
            const res = await API.get(`/shows/screens/${theatreId}`);
            if (res.data && res.data.success) {
                setScreens(res.data.screens);
                if (res.data.screens.length > 0) setSelectedScreen(res.data.screens[0]._id);
            }
        } catch (error) {
            console.error('Error fetching screens:', error);
        }
    };

    const fetchShowsForMovie = async (movieId) => {
        if (!movieId) return;
        try {
            const res = await API.get(`/shows/movie/${movieId}`);
            if (res.data && res.data.success) {
                setShows(res.data.shows);
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedMovie) {
            fetchShowsForMovie(selectedMovie);
        }
    }, [selectedMovie]);

    const handleTheatreChange = (e) => {
        const thId = e.target.value;
        setSelectedTheatre(thId);
        fetchScreens(thId);
    };

    const handleCreateTheatre = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/shows/theatres', newTheatre);
            if (res.data && res.data.success) {
                setMessage({ type: 'success', text: 'New theatre venue added!' });
                setShowTheatreModal(false);
                setNewTheatre({ theatreName: '', city: 'Mumbai', address: '' });
                fetchData();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add theatre' });
        }
    };

    const handleCreateShow = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                movieId: selectedMovie,
                theatreId: selectedTheatre,
                screenId: selectedScreen,
                showDate,
                showTime,
                ticketPrice: Number(ticketPrice)
            };

            const res = await API.post('/shows', payload);
            if (res.data && res.data.success) {
                setMessage({ type: 'success', text: 'Showtime scheduled successfully!' });
                fetchShowsForMovie(selectedMovie);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create showtime' });
        }
    };

    const handleDeleteShow = async (showId) => {
        if (window.confirm('Are you sure you want to cancel and delete this showtime?')) {
            try {
                const res = await API.delete(`/shows/${showId}`);
                if (res.data && res.data.success) {
                    setMessage({ type: 'success', text: 'Showtime deleted successfully' });
                    fetchShowsForMovie(selectedMovie);
                }
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
            }
        }
    };

    return (
        <div className="admin-shows-container">
            <div className="admin-header-row">
                <div>
                    <h1>🎟️ Showtime & Venue Management</h1>
                    <p>Schedule movie showtimes across cinema auditoriums and cities.</p>
                </div>
                <button className="btn btn-outline" onClick={() => setShowTheatreModal(true)}>
                    + Add New Theatre Venue
                </button>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-shows-grid">
                {/* Schedule Showtime Card Form */}
                <div className="card glassmorphism schedule-card">
                    <h3>Schedule New Showtime</h3>
                    <form onSubmit={handleCreateShow} className="schedule-form">
                        <div className="form-group">
                            <label>Select Movie</label>
                            <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                                {movies.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.title} ({m.language})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Theatre Venue</label>
                            <select value={selectedTheatre} onChange={handleTheatreChange}>
                                {theatres.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.theatreName} - {t.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Screen / Auditorium</label>
                            <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)}>
                                {screens.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        Screen #{s.screenNumber} ({s.totalRows}x{s.seatsPerRow} = {s.totalRows * s.seatsPerRow} seats)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={showDate}
                                    onChange={(e) => setShowDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Timing</label>
                                <select value={showTime} onChange={(e) => setShowTime(e.target.value)}>
                                    <option value="10:00 AM">10:00 AM (Morning)</option>
                                    <option value="01:30 PM">01:30 PM (Matinee)</option>
                                    <option value="04:45 PM">04:45 PM (Evening)</option>
                                    <option value="07:30 PM">07:30 PM (Prime)</option>
                                    <option value="10:15 PM">10:15 PM (Night)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ticket Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={ticketPrice}
                                onChange={(e) => setTicketPrice(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            ➕ Create Showtime
                        </button>
                    </form>
                </div>

                {/* Existing Showtimes Table */}
                <div className="shows-list-card">
                    <h3>Scheduled Showtimes for Selected Movie</h3>
                    {shows.length > 0 ? (
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Theatre</th>
                                        <th>Screen</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shows.map((s) => (
                                        <tr key={s._id}>
                                            <td>
                                                <strong>{new Date(s.showDate).toLocaleDateString()}</strong>
                                                <div className="small-text">{s.showTime}</div>
                                            </td>
                                            <td>{s.theatreId?.theatreName || 'Theatre'}</td>
                                            <td>Screen #{s.screenId?.screenNumber || 1}</td>
                                            <td>₹{s.ticketPrice}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteShow(s._id)}>
                                                    🗑️ Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-shows">No showtimes scheduled for this movie yet.</div>
                    )}
                </div>
            </div>

            {/* Add Theatre Modal */}
            {showTheatreModal && (
                <div className="modal-backdrop">
                    <div className="modal-content glassmorphism">
                        <h3>Add New Cinema Venue</h3>
                        <form onSubmit={handleCreateTheatre} className="modal-form">
                            <div className="form-group">
                                <label>Theatre Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. PVR Director's Cut"
                                    value={newTheatre.theatreName}
                                    onChange={(e) => setNewTheatre({ ...newTheatre, theatreName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mumbai"
                                    value={newTheatre.city}
                                    onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    rows="2"
                                    required
                                    placeholder="Full street address & mall name"
                                    value={newTheatre.address}
                                    onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowTheatreModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Venue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShowsPage;
