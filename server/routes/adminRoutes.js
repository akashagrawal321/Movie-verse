/**
 * @file adminRoutes.js
 * @description Express Router for Admin Dashboard analytics and management endpoints
 */

const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    getAllBookings
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes require both Authentication and Admin Role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);

module.exports = router;
