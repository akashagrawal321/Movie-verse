/**
 * @file Show.js
 * @description Mongoose Show Schema definition for movie showtimes and pricing
 */

const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
    {
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: [true, 'Movie reference ID is required']
        },
        theatreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theatre',
            required: [true, 'Theatre reference ID is required']
        },
        screenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Screen',
            required: [true, 'Screen reference ID is required']
        },
        showDate: {
            type: Date,
            required: [true, 'Show date is required']
        },
        showTime: {
            type: String,
            required: [true, 'Show time is required']
        },
        ticketPrice: {
            type: Number,
            required: [true, 'Ticket price is required']
        },
        bookedSeats: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// Compound Index for fast lookup of showtimes by movie, date, and theatre slot
showSchema.index({ movieId: 1, showDate: 1 });
showSchema.index({ theatreId: 1, showDate: 1, showTime: 1 });

module.exports = mongoose.model('Show', showSchema);
