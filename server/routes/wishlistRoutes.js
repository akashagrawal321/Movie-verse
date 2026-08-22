/**
 * @file wishlistRoutes.js
 * @description Express Router for User Wishlist Bookmarks
 */

const express = require('express');
const router = express.Router();
const {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(protect);

router.post('/', addToWishlist);
router.get('/', getUserWishlist);
router.delete('/:movieId', removeFromWishlist);

module.exports = router;
