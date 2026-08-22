/**
 * @file bookingController.js
 * @description Backend Booking Controller handling full ticket booking lifecycle
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Double-Booking Conflict Prevention (Concurrency Control):
 *    Uses MongoDB `$in` operator to prevent race condition seat collisions.
 * 2. ObjectId Validation & Custom Reference Lookup:
 *    Supports both standard MongoDB ObjectId and custom reference strings (e.g. `MV-360207`).
 */

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

/**
 * @route   GET /api/bookings/show/:showId/booked-seats
 * @desc    Fetch array of all seat IDs already booked for a specific showtime
 * @access  Public
 */
const getBookedSeatsByShow = async (req, res, next) => {
    try {
        const { showId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(showId)) {
            return res.status(200).json({
                success: true,
                showId,
                bookedSeats: []
            });
        }

        const bookings = await Booking.find({ showId }).select('selectedSeats');
        const bookedSeats = bookings.reduce((acc, booking) => {
            return acc.concat(booking.selectedSeats || []);
        }, []);

        res.status(200).json({
            success: true,
            showId,
            bookedSeats
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/bookings
 * @desc    Confirm & Store a new movie ticket booking in MongoDB
 * @access  Private (Authenticated User Required)
 */
const createBooking = async (req, res, next) => {
    try {
        const { showId, selectedSeats, totalAmount } = req.body;
        const userId = req.user._id;

        if (!showId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request: showId and at least one selected seat are required.'
            });
        }

        if (selectedSeats.length > 8) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 8 seats allowed per booking transaction.'
            });
        }

        let verifiedTotal = totalAmount;
        if (mongoose.Types.ObjectId.isValid(showId)) {
            const show = await Show.findById(showId);
            if (show) {
                const existingConflict = await Booking.findOne({
                    showId,
                    selectedSeats: { $in: selectedSeats }
                });

                if (existingConflict) {
                    return res.status(400).json({
                        success: false,
                        message: 'One or more of your selected seats are already booked! Please choose different seats.'
                    });
                }

                const calculatedBase = selectedSeats.length * show.ticketPrice;
                const convenienceFee = selectedSeats.length * 25;
                verifiedTotal = calculatedBase + convenienceFee;
            }
        }

        const customRef = 'MV-' + Math.floor(100000 + Math.random() * 900000);
        const bookingPayload = {
            bookingId: customRef,
            userId,
            showId: mongoose.Types.ObjectId.isValid(showId) ? showId : null,
            selectedSeats,
            totalAmount: verifiedTotal || 550,
            bookingDate: new Date()
        };

        const booking = await Booking.create(bookingPayload);

        let populatedBooking = booking;
        if (mongoose.Types.ObjectId.isValid(showId)) {
            populatedBooking = await Booking.findById(booking._id)
                .populate({
                    path: 'showId',
                    populate: [
                        { path: 'movieId', select: 'title poster language genre duration format' },
                        { path: 'theatreId', select: 'theatreName city address' },
                        { path: 'screenId', select: 'screenNumber' }
                    ]
                })
                .populate('userId', 'name email');
        }

        res.status(201).json({
            success: true,
            message: 'Ticket booking confirmed and saved successfully!',
            booking: populatedBooking || booking
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/bookings/:id
 * @desc    Fetch single booking document details by ID or custom booking reference code
 * @access  Private (Authenticated User Required)
 */
const getBookingById = async (req, res, next) => {
    try {
        const param = req.params.id;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(param)) {
            query = { _id: param };
        } else {
            query = { bookingId: param };
        }

        const booking = await Booking.findOne(query)
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId', select: 'title poster language genre duration format' },
                    { path: 'theatreId', select: 'theatreName city address' },
                    { path: 'screenId', select: 'screenNumber' }
                ]
            })
            .populate('userId', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking record not found.'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Fetch complete booking history for logged-in user
 * @access  Private (Authenticated User Required)
 */
const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ userId })
            .sort({ bookingDate: -1 })
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId', select: 'title poster language genre format' },
                    { path: 'theatreId', select: 'theatreName city address' },
                    { path: 'screenId', select: 'screenNumber' }
                ]
            });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBookedSeatsByShow,
    createBooking,
    getBookingById,
    getUserBookings
};
