/**
 * @file authMiddleware.js
 * @description Express Authentication & Role Authorization Middleware
 * 
 * WHY IT EXISTS:
 * Protects private endpoints from unauthenticated requests and restricts admin-only administrative routes.
 * 
 * HOW IT WORKS:
 * 1. `protect`: Extracts JWT token from the `Authorization: Bearer <token>` HTTP header.
 * 2. Decodes the token using `jwt.verify()`, fetches the corresponding User document from MongoDB (excluding password),
 *    and attaches it to `req.user`.
 * 3. `adminOnly`: Verifies `req.user.role === 'admin'`. Returns HTTP 403 Forbidden if user is a standard customer.
 * 
 * WHY THIS APPROACH IS USED IN REAL MERN APPLICATIONS:
 * Stateless authentication using JWT avoids storing session state in server memory, allowing 
 * horizontal scaling across microservices or serverless clusters.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes requiring valid JWT authentication
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token string from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify token signature against JWT secret
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'movieverse_super_secret_jwt_key_2026_interview_ready'
            );

            // Attach user document to request object (excluding password hash)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User account associated with this token no longer exists'
                });
            }

            next();
        } catch (error) {
            console.error('[Auth Middleware Error]:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, invalid or expired token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided in request header'
        });
    }
};

/**
 * Middleware to restrict route access exclusively to users with 'admin' role
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Access restricted to System Administrators only'
        });
    }
};

module.exports = {
    protect,
    adminOnly
};
