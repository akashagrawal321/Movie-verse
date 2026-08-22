/**
 * @file errorMiddleware.js
 * @description Centralized Express Error Handling Middlewares
 */

/**
 * Handle 404 Not Found endpoints
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Centralized Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'MongooseError' || err.message.includes('buffering timed out')) {
        statusCode = 503;
        message = 'Database connection is initializing or unavailable. Please verify MongoDB Atlas IP whitelist.';
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
};
