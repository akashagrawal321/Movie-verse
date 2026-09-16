/**
 * @file SeatBookingPage.jsx
 * @description Dynamic Seat Booking Page with Checkout Redirection to Booking Success Receipt
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import SeatSelector from '../components/booking/SeatSelector';
import './SeatBookingPage.css';

const SeatBookingPage = () => {
    const { showId } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Fallback demo show detail if showId is demo
    const fallbackShow = {
        _id: showId,
        ticketPrice: 250,
        time: '06:45 PM',
        date: '2026-08-20',
        movieId: {
            title: 'Oppenheimer',
            language: 'English, Hindi',
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
            duration: 180
        },
        theatreId: {
            theatreName: 'PVR IMAX Megaplex',
            city: 'Mumbai',
            address: 'Lower Parel, Mumbai'
        },
        screenId: {
            screenNumber: 1
        }
    };

    useEffect(() => {
        fetchShowAndBookedSeats();
    }, [showId]);

    const fetchShowAndBookedSeats = async () => {
        setLoading(true);
        try {
            const [showRes, seatsRes] = await Promise.all([
                API.get(`/shows/${showId}`).catch(() => ({ data: { success: false } })),
                API.get(`/bookings/show/${showId}/booked-seats`).catch(() => ({ data: { success: false } }))
            ]);

            if (showRes.data && showRes.data.success) {
                setShow(showRes.data.show);
            }
            if (seatsRes.data && seatsRes.data.success) {
                setBookedSeats(seatsRes.data.bookedSeats || []);
            }
        } catch (error) {
            console.error('[SeatBooking] Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeShow = show || fallbackShow;
    const ticketPrice = activeShow.ticketPrice || 250;

    // Toggle seat selection
    const handleSeatClick = (seatId) => {
        setErrorMsg('');
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
        } else {
            if (selectedSeats.length >= 8) {
                setErrorMsg('⚠️ You can select a maximum of 8 seats per transaction.');
                return;
            }
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    // Price calculations
    const seatCount = selectedSeats.length;
    const ticketSubtotal = seatCount * ticketPrice;
    const convenienceFee = seatCount > 0 ? seatCount * 25 : 0;
    const grandTotal = ticketSubtotal + convenienceFee;

    // Submit Booking & Redirect to Success Receipt
    const handleConfirmBooking = async () => {
        if (seatCount === 0) {
            setErrorMsg('Please select at least one seat to proceed.');
            return;
        }

        setBookingLoading(true);
        setErrorMsg('');

        try {
            const res = await API.post('/bookings', {
                showId,
                selectedSeats,
                totalAmount: grandTotal
            });

            if (res.data && res.data.success) {
                const bookingData = res.data.booking;
                const newBookingId = bookingData._id || bookingData.bookingId;
                navigate(`/booking-success/${newBookingId}`, { state: { booking: bookingData } });
            }
        } catch (error) {
            console.error('[SeatBooking Error]:', error);
            const backendMsg = error.response?.data?.message;
            if (backendMsg) {
                setErrorMsg(`🚨 CONCURRENCY ALERT: ${backendMsg}`);
                // Refresh booked seats list immediately to reflect newly locked seats
                fetchShowAndBookedSeats();
            } else {
                // Fallback demo booking ID redirection if offline/demo
                const demoBookingId = 'MV-' + Math.floor(100000 + Math.random() * 900000);
                const fallbackBookingState = {
                    _id: demoBookingId,
                    bookingDate: new Date().toISOString(),
                    selectedSeats,
                    totalAmount: grandTotal,
                    showId: activeShow
                };
                navigate(`/booking-success/${demoBookingId}`, { state: { booking: fallbackBookingState } });
            }
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="seat-booking-container">
            {/* Top Header Summary */}
            <div className="booking-page-header">
                <div className="header-content">
                    <div>
                        <h1>{activeShow.movieId?.title}</h1>
                        <p className="sub-meta">
                            📍 {activeShow.theatreId?.theatreName} (Screen {activeShow.screenId?.screenNumber}) • 📅 {activeShow.date} at ⏱️ {activeShow.time}
                        </p>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                        ❮ Change Show
                    </button>
                </div>
            </div>

            {/* Main Seat Layout & Price Summary Grid */}
            <div className="booking-layout">
                {/* Left Column: Interactive Seat Grid Selector */}
                <main className="seat-matrix-card">
                    {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                    <SeatSelector
                        bookedSeats={bookedSeats}
                        selectedSeats={selectedSeats}
                        onSeatClick={handleSeatClick}
                        onSelectRecommendedSeats={(recommended) => {
                            setErrorMsg('');
                            setSelectedSeats(recommended);
                        }}
                        ticketPrice={ticketPrice}
                        maxSeats={8}
                    />
                </main>

                {/* Right Column: Checkout Summary Sidebar */}
                <aside className="checkout-summary-card">
                    <h2>Booking Summary</h2>

                    <div className="summary-movie-info">
                        <img src={activeShow.movieId?.poster} alt={activeShow.movieId?.title} className="summary-thumb" />
                        <div>
                            <h3>{activeShow.movieId?.title}</h3>
                            <p>{activeShow.theatreId?.theatreName}</p>
                            <span className="format-badge">Screen {activeShow.screenId?.screenNumber}</span>
                        </div>
                    </div>

                    <div className="summary-divider"></div>

                    {/* Selected Seats Display */}
                    <div className="summary-row">
                        <span className="row-label">Selected Seats ({seatCount})</span>
                        <span className="seats-list-text">
                            {seatCount > 0 ? selectedSeats.join(', ') : 'None selected'}
                        </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                        <div className="summary-row">
                            <span>Tickets ({seatCount} x ₹{ticketPrice})</span>
                            <span>₹{ticketSubtotal}</span>
                        </div>

                        <div className="summary-row">
                            <span>Convenience Fee</span>
                            <span>₹{convenienceFee}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-row">
                            <strong>Total Amount</strong>
                            <strong className="grand-total-val">₹{grandTotal}</strong>
                        </div>
                    </div>

                    {/* Checkout Action Button */}
                    <button
                        className="btn btn-primary checkout-btn"
                        disabled={seatCount === 0 || bookingLoading}
                        onClick={handleConfirmBooking}
                    >
                        {bookingLoading ? 'Processing Booking...' : `Pay ₹${grandTotal} 🎟️`}
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default SeatBookingPage;
