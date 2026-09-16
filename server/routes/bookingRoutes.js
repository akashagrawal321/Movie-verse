/**
 * @file bookingRoutes.js
 * @description Express Route definitions for Booking REST endpoints
 */

const express = require('express');
const router = express.Router();
const {
    getBookedSeatsByShow,
    getRecentBookingActivities,
    createBooking,
    getBookingById,
    getUserBookings
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

// Public route to fetch already booked seats for a showtime
router.get('/show/:showId/booked-seats', getBookedSeatsByShow);

// Public route to fetch recent booking activity events for live notification banner
router.get('/recent-activity', getRecentBookingActivities);

// Protected routes (Authentication Required)
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBookingById);

module.exports = router;
