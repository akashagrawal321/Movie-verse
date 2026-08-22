/**
 * @file wishlistController.js
 * @description Controller for User Movie Wishlist Bookmarks
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Compound Index Prevention:
 *    Uses Mongoose `Wishlist.index({ userId: 1, movieId: 1 }, { unique: true })` to prevent duplicate bookmarks.
 * 2. Mongoose Population:
 *    Populates the linked `movieId` document to return full movie objects to the client.
 */

const Wishlist = require('../models/Wishlist');

/**
 * @route   POST /api/wishlist
 * @desc    Add movie to user's wishlist
 * @access  Private (Protected)
 */
const addToWishlist = async (req, res, next) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({
                success: false,
                message: 'Movie ID is required'
            });
        }

        // Check if already wishlisted
        const existing = await Wishlist.findOne({ userId: req.user._id, movieId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Movie is already in your wishlist'
            });
        }

        const item = await Wishlist.create({
            userId: req.user._id,
            movieId
        });

        const populatedItem = await item.populate('movieId');

        res.status(201).json({
            success: true,
            message: 'Movie added to wishlist',
            item: populatedItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlisted movies
 * @access  Private (Protected)
 */
const getUserWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('movieId');

        res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/wishlist/:movieId
 * @desc    Remove movie from wishlist
 * @access  Private (Protected)
 */
const removeFromWishlist = async (req, res, next) => {
    try {
        const item = await Wishlist.findOneAndDelete({
            userId: req.user._id,
            movieId: req.params.movieId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Movie removed from wishlist'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist
};
