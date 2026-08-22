/**
 * @file server.js
 * @description Main Express Server Entry Point for MovieVerse Pro Backend API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load Environment Variables
dotenv.config();

// Connect MongoDB Database
connectDB();

const app = express();

// Core Middlewares - Allow CORS from any origin
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// API REST Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root Endpoint Health Check
app.get('/', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    res.status(200).json({
        success: true,
        message: 'MovieVerse Pro Backend REST API is operational 🚀',
        dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
        dbError: global.lastDbError || null
    });
});

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 MovieVerse Pro Server running on port ${PORT}`);
});
