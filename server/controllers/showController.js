/**
 * @file showController.js
 * @description Controller for Theatre Venues, Screens, and Showtimes Management
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Multi-Level Relational Queries:
 *    Show scheduling links a `Movie`, `Theatre`, and `Screen` together.
 * 2. Deep Mongoose Population:
 *    Populates `movieId`, `theatreId`, and `screenId` when returning showtimes to the client.
 */

const mongoose = require('mongoose');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');

// ==========================================
// 🏛️ THEATRE CONTROLLERS
// ==========================================

/**
 * @route   POST /api/shows/theatres
 * @desc    Add a new cinema theatre venue
 * @access  Private (Admin Only)
 */
const addTheatre = async (req, res, next) => {
    try {
        const { theatreName, city, address } = req.body;
        if (!theatreName || !city || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide theatreName, city, and address'
            });
        }

        const theatre = await Theatre.create({ theatreName, city, address });
        res.status(201).json({
            success: true,
            message: 'Theatre venue created successfully',
            theatre
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/shows/theatres
 * @desc    Get all theatre venues
 * @access  Public
 */
const getTheatres = async (req, res, next) => {
    try {
        const { city } = req.query;
        const filter = city ? { city: new RegExp(city, 'i') } : {};
        const theatres = await Theatre.find(filter).sort({ theatreName: 1 });

        res.status(200).json({
            success: true,
            count: theatres.length,
            theatres
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/shows/theatres/:id
 * @desc    Delete a theatre venue
 * @access  Private (Admin Only)
 */
const deleteTheatre = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        const theatre = await Theatre.findByIdAndDelete(req.params.id);
        if (!theatre) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        res.status(200).json({ success: true, message: 'Theatre deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 📺 SCREEN CONTROLLERS
// ==========================================

/**
 * @route   POST /api/shows/screens
 * @desc    Add an auditorium screen to a theatre
 * @access  Private (Admin Only)
 */
const addScreen = async (req, res, next) => {
    try {
        const { theatreId, screenNumber, totalRows, seatsPerRow } = req.body;
        if (!theatreId || !screenNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide theatreId and screenNumber'
            });
        }

        const screen = await Screen.create({
            theatreId,
            screenNumber,
            totalRows: totalRows || 10,
            seatsPerRow: seatsPerRow || 12
        });

        res.status(201).json({
            success: true,
            message: 'Screen added to theatre successfully',
            screen
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/shows/screens/:theatreId
 * @desc    Get all screens belonging to a specific theatre
 * @access  Public
 */
const getScreensByTheatre = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.theatreId)) {
            return res.status(200).json({ success: true, count: 0, screens: [] });
        }
        const screens = await Screen.find({ theatreId: req.params.theatreId });
        res.status(200).json({
            success: true,
            count: screens.length,
            screens
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 🎟️ SHOWTIME CONTROLLERS
// ==========================================

/**
 * @route   POST /api/shows
 * @desc    Schedule a new movie showtime
 * @access  Private (Admin Only)
 */
const createShow = async (req, res, next) => {
    try {
        const { movieId, theatreId, screenId, showDate, showTime, ticketPrice } = req.body;
        if (!movieId || !theatreId || !screenId || !showDate || !showTime || !ticketPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide movieId, theatreId, screenId, showDate, showTime, and ticketPrice'
            });
        }

        const show = await Show.create({
            movieId,
            theatreId,
            screenId,
            showDate: new Date(showDate),
            showTime,
            ticketPrice
        });

        const populatedShow = await show.populate(['movieId', 'theatreId', 'screenId']);

        res.status(201).json({
            success: true,
            message: 'Show scheduled successfully',
            show: populatedShow
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/shows/movie/:movieId
 * @desc    Get all scheduled showtimes for a movie
 * @access  Public
 */
const getShowsByMovie = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.movieId)) {
            return res.status(200).json({ success: true, count: 0, shows: [] });
        }
        const shows = await Show.find({ movieId: req.params.movieId })
            .populate('movieId')
            .populate('theatreId')
            .populate('screenId')
            .sort({ showDate: 1, showTime: 1 });

        res.status(200).json({
            success: true,
            count: shows.length,
            shows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/shows/:id
 * @desc    Get single show details by ID
 * @access  Public
 */
const getShowById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }
        const show = await Show.findById(req.params.id)
            .populate('movieId')
            .populate('theatreId')
            .populate('screenId');

        if (!show) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }

        res.status(200).json({ success: true, show });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/shows/:id
 * @desc    Delete a scheduled showtime
 * @access  Private (Admin Only)
 */
const deleteShow = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }
        res.status(200).json({ success: true, message: 'Showtime deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/shows/:id/recommend-seats
 * @desc    Get top 3 intelligent seat recommendations for group/family bookings
 * @access  Public
 */
const getSeatRecommendations = async (req, res, next) => {
    try {
        const { count = 4 } = req.query;
        const showId = req.params.id;

        // Fetch show details or fallback
        let ticketPrice = 250;
        let totalRows = 10;
        let seatsPerRow = 12;

        if (mongoose.Types.ObjectId.isValid(showId)) {
            const show = await Show.findById(showId).populate('screenId');
            if (show) {
                ticketPrice = show.ticketPrice || 250;
                if (show.screenId) {
                    totalRows = show.screenId.totalRows || 10;
                    seatsPerRow = show.screenId.seatsPerRow || 12;
                }
            }
        }

        // Fetch booked seats for this show from Booking model
        const Booking = require('../models/Booking');
        let bookedSeats = [];
        if (mongoose.Types.ObjectId.isValid(showId)) {
            const bookings = await Booking.find({ showId, paymentStatus: 'Completed' });
            bookedSeats = bookings.reduce((acc, b) => acc.concat(b.seats || []), []);
        }

        const recommendBestSeats = require('../utils/seatRecommendation').recommendBestSeats;
        const recommendations = recommendBestSeats(bookedSeats, parseInt(count, 10), ticketPrice);

        res.status(200).json({
            success: true,
            ticketCount: parseInt(count, 10),
            ticketPrice,
            bookedSeatsCount: bookedSeats.length,
            recommendations
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addTheatre,
    getTheatres,
    deleteTheatre,
    addScreen,
    getScreensByTheatre,
    createShow,
    getShowsByMovie,
    getShowById,
    deleteShow,
    getSeatRecommendations
};
