/**
 * @file Review.js
 * @description Mongoose Review Schema definition for user movie ratings and comments
 * 
 * RELATIONAL REFERENCES:
 * - `userId`: Foreign key reference to User model.
 * - `movieId`: Foreign key reference to Movie model.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Review', reviewSchema);
