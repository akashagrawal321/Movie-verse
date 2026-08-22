/**
 * @file Movie.js
 * @description Mongoose Movie Schema definition for film catalog management
 */

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Movie title is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        genre: {
            type: [String],
            required: [true, 'At least one genre is required']
        },
        language: {
            type: String,
            required: [true, 'Language is required']
        },
        duration: {
            type: Number,
            required: [true, 'Duration in minutes is required']
        },
        poster: {
            type: String,
            required: [true, 'Poster image URL is required']
        },
        trailer: {
            type: String,
            default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        releaseDate: {
            type: Date,
            default: Date.now
        },
        rating: {
            type: Number,
            default: 8.5,
            min: 0,
            max: 10
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Movie', movieSchema);
