/**
 * @file errorMiddleware.js
 * @description Centralized Express Error Handling Middlewares
 * 
 * WHY IT EXISTS:
 * Prevents unhandled server exceptions from crashing the process and formats error responses 
 * into a consistent JSON API structure across all endpoints.
 * 
 * HOW IT WORKS:
 * 1. `notFound`: Catches requests to unmapped endpoints and forwards a 404 Error.
 * 2. `errorHandler`: Global Express 4-parameter error handler middleware (`(err, req, res, next)`)
 *    that intercepts exceptions, normalizes HTTP status codes, and strips stack traces in production.
 * 
 * WHY THIS APPROACH IS USED IN REAL MERN APPLICATIONS:
 * Standardizes API error responses (`{ success: false, message: '...' }`) making frontend error handling 
 * predictable and clean.
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
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
};
