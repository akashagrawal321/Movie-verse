/**
 * @file showRoutes.js
 * @description Express Router for Theatres, Screens, and Showtimes
 */

const express = require('express');
const router = express.Router();
const {
    addTheatre,
    getTheatres,
    deleteTheatre,
    addScreen,
    getScreensByTheatre,
    createShow,
    getShowsByMovie,
    getShowById,
    deleteShow,
    getSeatRecommendations
} = require('../controllers/showController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Theatre routes
router.get('/theatres', getTheatres);
router.post('/theatres', protect, adminOnly, addTheatre);
router.delete('/theatres/:id', protect, adminOnly, deleteTheatre);

// Screen routes
router.get('/screens/:theatreId', getScreensByTheatre);
router.post('/screens', protect, adminOnly, addScreen);

// Showtime routes
router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id/recommend-seats', getSeatRecommendations);
router.get('/:id', getShowById);
router.post('/', protect, adminOnly, createShow);
router.delete('/:id', protect, adminOnly, deleteShow);

module.exports = router;
