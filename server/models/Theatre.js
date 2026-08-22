/**
 * @file Theatre.js
 * @description Mongoose Theatre Schema definition for cinema locations
 */

const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
    {
        theatreName: {
            type: String,
            required: [true, 'Theatre name is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Address is required']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Theatre', theatreSchema);
