/**
 * @file Screen.js
 * @description Mongoose Screen Schema definition for theatre auditoriums
 * 
 * RELATIONAL REFERENCE:
 * - `theatreId`: Foreign key reference to Theatre model.
 */

const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema(
    {
        theatreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theatre',
            required: [true, 'Parent Theatre ID is required']
        },
        screenNumber: {
            type: Number,
            required: [true, 'Screen number is required']
        },
        totalRows: {
            type: Number,
            required: [true, 'Total rows count is required'],
            default: 10
        },
        seatsPerRow: {
            type: Number,
            required: [true, 'Seats per row count is required'],
            default: 12
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Screen', screenSchema);
