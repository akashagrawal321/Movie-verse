/**
 * @file bookingController.js
 * @description Backend Booking Controller with Single-Threaded Mutex Concurrency Lock & Live Activity Alerts
 */

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

// In-Memory Mutex Lock Queue Map per show slot
const showBookingLocks = new Map();

/**
 * Executes a callback function inside a single-threaded queue for a specific show slot
 * @param {string} showId 
 * @param {Function} taskFn 
 * @returns {Promise<any>}
 */
const executeInShowLock = async (showId, taskFn) => {
    const lockKey = String(showId);

    // Acquire or initialize Promise chain lock for this show
    const currentLock = showBookingLocks.get(lockKey) || Promise.resolve();

    let release;
    const nextLock = new Promise((resolve) => {
        release = resolve;
    });

    // Chain the next task to run only after the current lock completes
    showBookingLocks.set(lockKey, currentLock.then(() => nextLock));

    try {
        // Wait for previous transactions on this show slot to finish
        await currentLock;
        // Execute the current booking transaction exclusively
        return await taskFn();
    } finally {
        // Release the lock for the next queued request in line
        release();
        if (showBookingLocks.get(lockKey) === nextLock) {
            showBookingLocks.delete(lockKey);
        }
    }
};

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

        // Fetch from Show document
        const show = await Show.findById(showId).select('bookedSeats');
        let bookedSeats = show && show.bookedSeats ? show.bookedSeats : [];

        // Fallback: also check Booking collection for legacy data
        if (bookedSeats.length === 0) {
            const bookings = await Booking.find({ showId }).select('selectedSeats');
            bookedSeats = bookings.reduce((acc, booking) => {
                return acc.concat(booking.selectedSeats || []);
            }, []);
        }

        res.status(200).json({
            success: true,
            showId,
            bookedSeats: [...new Set(bookedSeats)]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/bookings/recent-activity
 * @desc    Fetch recent ticket booking transactions across all users for live alert banner
 * @access  Public
 */
const getRecentBookingActivities = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .sort({ bookingDate: -1 })
            .limit(5)
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId', select: 'title poster genre' },
                    { path: 'theatreId', select: 'theatreName city' }
                ]
            })
            .populate('userId', 'name');

        const activities = bookings.map(b => ({
            _id: b._id,
            userName: b.userId?.name ? b.userId.name.split(' ')[0] : 'Cinemagoer',
            movieTitle: b.showId?.movieId?.title || 'Blockbuster Feature',
            showTime: b.showId?.showTime || '07:30 PM',
            theatreName: b.showId?.theatreId?.theatreName || 'PVR IMAX',
            seatCount: b.selectedSeats ? b.selectedSeats.length : 2,
            seats: b.selectedSeats || ['A1', 'A2']
        }));

        res.status(200).json({
            success: true,
            activities
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/bookings
 * @desc    Confirm & Store a new movie ticket booking with single-threaded concurrency lock
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

        const lockKey = mongoose.Types.ObjectId.isValid(showId) ? String(showId) : 'global_lock';

        // Execute booking transaction exclusively inside single-threaded lock for this show slot
        const result = await executeInShowLock(lockKey, async () => {
            let verifiedTotal = totalAmount;

            if (mongoose.Types.ObjectId.isValid(showId)) {
                // 1. Double-booking conflict check across existing bookings
                const existingConflict = await Booking.findOne({
                    showId,
                    selectedSeats: { $in: selectedSeats }
                });

                if (existingConflict) {
                    const conflictSeats = existingConflict.selectedSeats.filter(s => selectedSeats.includes(s));
                    return {
                        errorStatus: 400,
                        errorMessage: `Seat reservation collision! Seat(s) [${conflictSeats.join(', ')}] have already been booked for this cinema showtime slot by another user.`
                    };
                }

                // 2. Atomic update on Show model: Ensure none of the selectedSeats exist in bookedSeats array
                const updatedShow = await Show.findOneAndUpdate(
                    {
                        _id: showId,
                        bookedSeats: { $nin: selectedSeats }
                    },
                    {
                        $addToSet: { bookedSeats: { $each: selectedSeats } }
                    },
                    { new: true }
                );

                if (!updatedShow) {
                    return {
                        errorStatus: 400,
                        errorMessage: 'One or more of your selected seats were just booked by another user! Please select different seats.'
                    };
                }

                const calculatedBase = selectedSeats.length * updatedShow.ticketPrice;
                const convenienceFee = selectedSeats.length * 25;
                verifiedTotal = calculatedBase + convenienceFee;
            }

            // 3. Create the unique booking record
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

            return {
                success: true,
                booking: populatedBooking || booking
            };
        });

        if (result.errorStatus) {
            return res.status(result.errorStatus).json({
                success: false,
                message: result.errorMessage
            });
        }

        res.status(201).json({
            success: true,
            message: 'Ticket booking confirmed and saved successfully with exclusive slot reservation!',
            booking: result.booking
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
    getRecentBookingActivities,
    createBooking,
    getBookingById,
    getUserBookings
};
