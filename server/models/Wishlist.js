/**
 * @file Wishlist.js
 * @description Mongoose Wishlist Schema definition for user movie bookmarking
 * 
 * RELATIONAL REFERENCES:
 * - `userId`: Foreign key reference to User model.
 * - `movieId`: Foreign key reference to Movie model.
 */

const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: [true, 'Movie ID is required']
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate wishlist entries for same user and movie
wishlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
