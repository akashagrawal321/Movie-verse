/**
 * @file index.js
 * @description Main Express Server Entry Point for MovieVerse MERN Platform
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Environment Variables
dotenv.config();

// Connect MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'MovieVerse MERN Backend API is running smoothly 🚀'
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('[Global Error]:', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 MovieVerse Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
