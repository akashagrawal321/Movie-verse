/**
 * @file authRoutes.js
 * @description Express Router for User Authentication & Profile Endpoints
 */

const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public Endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected User Profile Endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Legacy alias compatibility
router.get('/me', protect, getUserProfile);

module.exports = router;
