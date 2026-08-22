/**
 * @file movieRoutes.js
 * @description Express Router for Movie Catalog Management
 */

const express = require('express');
const router = express.Router();
const {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} = require('../controllers/movieController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public catalog routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected Admin CRUD routes
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;
