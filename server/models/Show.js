/**
 * @file Show.js
 * @description Mongoose Show Schema definition for movie showtimes and pricing
 * 
 * WHY IT EXISTS:
 * In a real-world ticketing engine (e.g. BookMyShow), a "Show" acts as the central pivot entity connecting 
 * a specific Movie to a specific Theatre venue auditorium (Screen) at a specific date and time slot.
 * 
 * HOW IT WORKS:
 * Holds 3 relational `ObjectId` references (`movieId`, `theatreId`, `screenId`) alongside `showDate`, `showTime`, and `ticketPrice`.
 * 
 * WHY THIS APPROACH IS USED IN REAL MERN APPLICATIONS:
 * Normalized relational references prevent data duplication. If a movie's poster or duration changes, 
 * updating the single Movie document updates all corresponding shows automatically when populated.
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
        }
    },
    {
        timestamps: true
    }
);

// Compound Index for fast lookup of showtimes by movie and date
showSchema.index({ movieId: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
