/**
 * @file movieController.js
 * @description Controller for Movie Catalog CRUD Operations
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. RESTful CRUD Architecture:
 *    - GET /api/movies (List movies)
 *    - GET /api/movies/:id (Single movie details)
 *    - POST /api/movies (Create movie - Admin)
 *    - PUT /api/movies/:id (Update movie - Admin)
 *    - DELETE /api/movies/:id (Delete movie - Admin)
 * 2. Input Sanitization & Error Prevention:
 *    Ensures non-existent IDs return HTTP 404 cleanly.
 */

const Movie = require('../models/Movie');

/**
 * @route   GET /api/movies
 * @desc    Get all catalog movies
 * @access  Public
 */
const getMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/movies/:id
 * @desc    Get single movie details by ID
 * @access  Public
 */
const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: `Movie not found with ID ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            movie
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/movies
 * @desc    Create a new catalog movie
 * @access  Private (Admin Only)
 */
const createMovie = async (req, res, next) => {
    try {
        const { title, description, genre, language, duration, poster, trailer, releaseDate, rating } = req.body;

        if (!title || !description || !language || !duration || !poster) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, language, duration, and poster URL'
            });
        }

        const movie = await Movie.create({
            title,
            description,
            genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map(g => g.trim()) : ['Drama']),
            language,
            duration,
            poster,
            trailer: trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            releaseDate: releaseDate || Date.now(),
            rating: rating || 8.5
        });

        res.status(201).json({
            success: true,
            message: 'Movie entry created successfully',
            movie
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/movies/:id
 * @desc    Update an existing catalog movie
 * @access  Private (Admin Only)
 */
const updateMovie = async (req, res, next) => {
    try {
        let movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: `Movie not found with ID ${req.params.id}`
            });
        }

        movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            movie
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie from catalog
 * @access  Private (Admin Only)
 */
const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: `Movie not found with ID ${req.params.id}`
            });
        }

        await movie.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully from catalog'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
