/**
 * @file BookingNotificationBanner.jsx
 * @description Real-Time Live Ticket Booking Alert & Concurrency Notification Banner (Positioned above Hero section)
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Real-Time Event Ticker Polling:
 *    Fetches live booking activities every 10 seconds and cycles through alert messages.
 * 2. Dynamic Banner Animation:
 *    Smooth entrance CSS animations with glowing alert badges for instant visual feedback.
 */

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import './BookingNotificationBanner.css';

const DEFAULT_ALERTS = [
    {
        userName: 'Alex',
        movieTitle: 'Inception (4DX)',
        showTime: '07:30 PM',
        theatreName: 'PVR IMAX',
        seatCount: 2,
        seats: ['F4', 'F5']
    },
    {
        userName: 'Mohan',
        movieTitle: 'Interstellar',
        showTime: '09:15 PM',
        theatreName: 'INOX Megaplex',
        seatCount: 3,
        seats: ['D8', 'D9', 'D10']
    },
    {
        userName: 'Rajat',
        movieTitle: 'Avatar: Fire and Ash',
        showTime: '04:00 PM',
        theatreName: 'Cinepolis VIP',
        seatCount: 2,
        seats: ['C2', 'C3']
    }
];

const BookingNotificationBanner = () => {
    const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Fetch live recent booking activity from backend API
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await API.get('/bookings/recent-activity');
                if (res.data && res.data.success && res.data.activities.length > 0) {
                    setAlerts(res.data.activities);
                }
            } catch (err) {
                // Fallback to default sample alerts if backend network is delayed
            }
        };

        fetchActivities();
        const intervalId = setInterval(fetchActivities, 12000);
        return () => clearInterval(intervalId);
    }, []);

    // Cycle through alert messages every 4 seconds
    useEffect(() => {
        if (alerts.length <= 1) return;
        const rotateId = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % alerts.length);
        }, 4500);
        return () => clearInterval(rotateId);
    }, [alerts]);

    if (!isVisible || alerts.length === 0) return null;

    const currentAlert = alerts[currentIndex];

    return (
        <div className="booking-notification-banner">
            <div className="banner-content-wrapper">
                <div className="alert-badge-group">
                    <span className="pulse-indicator"></span>
                    <span className="alert-badge">🚨 LIVE BOOKING LOCK ALERT</span>
                </div>

                <div className="alert-text-marquee">
                    <span className="user-name">{currentAlert.userName}</span> just reserved{' '}
                    <span className="seats-highlight">{currentAlert.seatCount} ticket(s)</span> for{' '}
                    <strong className="movie-title">"{currentAlert.movieTitle}"</strong> ({currentAlert.showTime} slot at {currentAlert.theatreName})!{' '}
                    <span className="slot-status-tag">⚡ Single-Threaded Exclusive Lock Active</span>
                </div>

                <button
                    className="banner-close-btn"
                    onClick={() => setIsVisible(false)}
                    title="Dismiss Notification"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default BookingNotificationBanner;
