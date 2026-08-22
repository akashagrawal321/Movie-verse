/**
 * @file Booking.js
 * @description Mongoose Booking Schema definition for customer ticket reservations
 * 
 * WHY IT EXISTS:
 * Records successful ticket bookings, locking selected seat IDs (`['F5', 'F6']`) for a specific Show document 
 * and associating them with the purchasing User.
 * 
 * HOW IT WORKS:
 * Stores array of seat strings, calculates total amount, generates a unique human-readable reference code (`MVP-XXXXXX`),
 * and tracks payment status (`paid`, `pending`, `cancelled`).
 * 
 * WHY THIS APPROACH IS USED IN REAL MERN APPLICATIONS:
 * 1. Unique Booking Reference Code: Provides an alphanumeric code easily readable on paper tickets or QR codes.
 * 2. Seat Array Lock: Enables MongoDB `$in` concurrency queries during seat selection to prevent double-booking.
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            unique: true,
            required: true,
            default: () => 'MVP-' + Math.floor(100000 + Math.random() * 900000)
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference ID is required']
        },
        showId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Show',
            required: [true, 'Show reference ID is required']
        },
        seats: {
            type: [String],
            required: [true, 'Selected seats array is required']
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required']
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'pending', 'cancelled'],
            default: 'paid'
        },
        bookingDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Index for query optimization by showId and userId
bookingSchema.index({ showId: 1 });
bookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
