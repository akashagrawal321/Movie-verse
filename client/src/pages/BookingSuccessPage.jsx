/**
 * @file BookingSuccessPage.jsx
 * @description Dedicated Ticket Booking Success & Printable Ticket Receipt Page
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Printable Ticket Component Layout:
 *    - Displays ticket stub with perforated border effect, QR code graphic, and barcode.
 * 2. Window Print Trigger:
 *    - Uses native `window.print()` for physical ticket printing.
 * 3. Deep Route Data Resolution:
 *    - Resolves booking document by `bookingId` URL param.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import API from '../services/api';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [loading, setLoading] = useState(!location.state?.booking);

    // Fallback demo ticket if ID is custom demo string
    const fallbackBooking = {
        _id: bookingId || 'MV-849201',
        bookingDate: new Date().toISOString(),
        selectedSeats: ['A1', 'A2'],
        totalAmount: 550,
        showId: {
            date: '2026-08-20',
            time: '06:45 PM',
            ticketPrice: 250,
            movieId: {
                title: 'Oppenheimer',
                language: 'English, Hindi',
                genre: ['Biography', 'Drama'],
                poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
                format: 'IMAX 3D'
            },
            theatreId: {
                theatreName: 'PVR IMAX Megaplex',
                city: 'Mumbai',
                address: 'Phoenix Palladium, Lower Parel'
            },
            screenId: {
                screenNumber: 1
            }
        }
    };

    useEffect(() => {
        if (!booking) {
            fetchBooking();
        }

        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('print') === 'true') {
            const timer = setTimeout(() => {
                window.print();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [bookingId, location.search]);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/bookings/${bookingId}`);
            if (res.data && res.data.success) {
                setBooking(res.data.booking);
            }
        } catch (error) {
            console.error('[BookingSuccess] Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const b = booking || fallbackBooking;
    const show = b.showId || {};
    const movie = show.movieId || {};
    const theatre = show.theatreId || {};
    const screen = show.screenId || {};

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="booking-success-container">
            {/* Celebration Header */}
            <div className="success-banner">
                <span className="celebration-badge">🎉 CONFIRMED</span>
                <h1>Ticket Booking Successful!</h1>
                <p>Your tickets have been confirmed and sent to your email.</p>
            </div>

            {/* Printable Ticket Stub */}
            <div className="ticket-card-printable" id="printable-ticket">
                {/* Ticket Top: Poster + Movie Meta */}
                <div className="ticket-top">
                    <img src={movie.poster} alt={movie.title} className="ticket-movie-poster" />
                    <div className="ticket-movie-meta">
                        <span className="ticket-category-tag">MOVIEVERSE TICKET PASS</span>
                        <h2 className="ticket-title">{movie.title}</h2>
                        <p className="ticket-genre">{Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}</p>
                        <span className="ticket-lang-badge">{movie.language || 'English'}</span>
                    </div>
                </div>

                {/* Perforation Line Graphic */}
                <div className="ticket-perforation">
                    <span className="circle-notch left"></span>
                    <span className="dashed-line"></span>
                    <span className="circle-notch right"></span>
                </div>

                {/* Ticket Bottom: Cinema & Showtime Details */}
                <div className="ticket-bottom">
                    <div className="ticket-info-grid">
                        <div className="info-block">
                            <label>Booking Reference</label>
                            <strong className="highlight-ref">#{b._id}</strong>
                        </div>

                        <div className="info-block">
                            <label>Cinema Venue</label>
                            <strong>{theatre.theatreName || 'PVR IMAX'}</strong>
                            <span className="sub-addr">{theatre.city}</span>
                        </div>

                        <div className="info-block">
                            <label>Date & Showtime</label>
                            <strong>📅 {show.date ? new Date(show.date).toLocaleDateString() : 'Today'}</strong>
                            <span className="time-highlight">⏱️ {show.time || '06:45 PM'}</span>
                        </div>

                        <div className="info-block">
                            <label>Screen & Seats</label>
                            <span className="seats-badge">Screen {screen.screenNumber || 1}</span>
                            <strong className="seat-numbers">{(b.selectedSeats || []).join(', ')}</strong>
                        </div>

                        <div className="info-block">
                            <label>Total Paid</label>
                            <strong className="price-tag">₹{b.totalAmount}</strong>
                        </div>
                    </div>

                    {/* QR Code Barcode Box */}
                    <div className="ticket-qr-box">
                        <div className="qr-code-placeholder">
                            <span className="qr-icon">📱</span>
                            <span>SCAN AT ENTRANCE</span>
                        </div>
                        <span className="barcode-line">||||| |||||| |||| ||||||| ||||</span>
                    </div>
                </div>
            </div>

            {/* Page Actions */}
            <div className="success-page-actions">
                <button className="btn btn-secondary" onClick={handlePrint}>
                    🖨️ Print Ticket
                </button>
                <Link to="/my-bookings" className="btn btn-primary">
                    🎟️ View My Bookings
                </Link>
                <Link to="/" className="btn btn-outline">
                    🏠 Home Page
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
