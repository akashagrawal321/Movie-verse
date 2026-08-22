/**
 * @file reviewRoutes.js
 * @description Express Router for User Ratings & Reviews
 */

const express = require('express');
const router = express.Router();
const { addReview, getMovieReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', getMovieReviews);
router.post('/', protect, addReview);

module.exports = router;
