/**
 * @file adminController.js
 * @description Controller for Admin Analytics Dashboard using Advanced MongoDB Aggregation Pipelines
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Advanced MongoDB Aggregation Pipelines (`$lookup`, `$group`, `$sum`, `$count`, `$sort`, `$unwind`):
 *    - Most Booked Movie: Joins `bookings` to `shows` to `movies`, groups by `movieId`, sums total tickets sold.
 *    - Most Popular Theatre: Joins `bookings` to `shows` to `theatres`, groups by `theatreId`, sums total tickets sold.
 *    - Total Revenue: Aggregates sum of all booking `totalAmount` fields.
 */

const Movie = require('../models/Movie');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Theatre = require('../models/Theatre');

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide summary analytics via MongoDB Aggregation Pipelines
 * @access  Private (Admin Only)
 */
const getAdminStats = async (req, res, next) => {
    try {
        const [
            totalMovies,
            totalUsers,
            totalBookings,
            revenueAggregation,
            mostBookedMovieAgg,
            mostPopularTheatreAgg,
            recentBookings
        ] = await Promise.all([
            Movie.countDocuments(),
            User.countDocuments(),
            Booking.countDocuments(),

            // 1. Total Revenue Aggregation Pipeline
            Booking.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalAmount' },
                        totalTicketsBooked: { $sum: { $size: '$seats' } }
                    }
                }
            ]),

            // 2. Most Booked Movie Aggregation Pipeline ($lookup -> $unwind -> $group -> $sort -> $limit)
            Booking.aggregate([
                {
                    $lookup: {
                        from: 'shows',
                        localField: 'showId',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$show' },
                {
                    $lookup: {
                        from: 'movies',
                        localField: 'show.movieId',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                { $unwind: '$movie' },
                {
                    $group: {
                        _id: '$movie._id',
                        title: { $first: '$movie.title' },
                        poster: { $first: '$movie.poster' },
                        ticketsSold: { $sum: { $size: '$seats' } },
                        totalRevenue: { $sum: '$totalAmount' }
                    }
                },
                { $sort: { ticketsSold: -1 } },
                { $limit: 1 }
            ]),

            // 3. Most Popular Theatre Aggregation Pipeline ($lookup -> $unwind -> $group -> $sort -> $limit)
            Booking.aggregate([
                {
                    $lookup: {
                        from: 'shows',
                        localField: 'showId',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$show' },
                {
                    $lookup: {
                        from: 'theatres',
                        localField: 'show.theatreId',
                        foreignField: '_id',
                        as: 'theatre'
                    }
                },
                { $unwind: '$theatre' },
                {
                    $group: {
                        _id: '$theatre._id',
                        theatreName: { $first: '$theatre.theatreName' },
                        city: { $first: '$theatre.city' },
                        ticketsSold: { $sum: { $size: '$seats' } }
                    }
                },
                { $sort: { ticketsSold: -1 } },
                { $limit: 1 }
            ]),

            // 4. Recent Bookings with deep populated lookup
            Booking.aggregate([
                { $sort: { bookingDate: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'shows',
                        localField: 'showId',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$user' },
                { $unwind: '$show' },
                {
                    $lookup: {
                        from: 'movies',
                        localField: 'show.movieId',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                { $unwind: '$movie' },
                {
                    $project: {
                        bookingId: 1,
                        seats: 1,
                        totalAmount: 1,
                        bookingDate: 1,
                        'user.name': 1,
                        'user.email': 1,
                        'movie.title': 1,
                        'movie.poster': 1
                    }
                }
            ])
        ]);

        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;
        const totalTicketsBooked = revenueAggregation.length > 0 ? revenueAggregation[0].totalTicketsBooked : 0;
        const mostBookedMovie = mostBookedMovieAgg.length > 0 ? mostBookedMovieAgg[0] : null;
        const mostPopularTheatre = mostPopularTheatreAgg.length > 0 ? mostPopularTheatreAgg[0] : null;

        res.status(200).json({
            success: true,
            stats: {
                totalMovies,
                totalUsers,
                totalBookings,
                totalRevenue,
                totalTicketsBooked,
                mostBookedMovie,
                mostPopularTheatre
            },
            recentBookings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get directory of all registered users
 * @access  Private (Admin Only)
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all customer ticket bookings list
 * @access  Private (Admin Only)
 */
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .sort({ bookingDate: -1 })
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId', select: 'title poster' },
                    { path: 'theatreId', select: 'theatreName city' },
                    { path: 'screenId', select: 'screenNumber' }
                ]
            })
            .populate('userId', 'name email');

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
    getAdminStats,
    getAllUsers,
    getAllBookings
};
