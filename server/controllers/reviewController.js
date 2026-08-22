/**
 * @file reviewController.js
 * @description Controller for User Movie Ratings & Reviews
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Deep Population:
 *    Populates the `userId` field (retrieving name and avatar) when serving movie reviews.
 */

const Review = require('../models/Review');

/**
 * @route   POST /api/reviews
 * @desc    Add review & rating for a movie
 * @access  Private (Protected)
 */
const addReview = async (req, res, next) => {
    try {
        const { movieId, rating, comment } = req.body;

        if (!movieId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Movie ID, rating (1-5), and comment are required'
            });
        }

        const review = await Review.create({
            userId: req.user._id,
            movieId,
            rating,
            comment
        });

        const populatedReview = await review.populate('userId', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Review posted successfully',
            review: populatedReview
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/reviews/movie/:movieId
 * @desc    Get all user reviews for a specific movie
 * @access  Public
 */
const getMovieReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addReview,
    getMovieReviews
};
