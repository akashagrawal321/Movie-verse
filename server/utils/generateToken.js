/**
 * @file generateToken.js
 * @description Utility function to sign JWT authentication tokens
 * 
 * INTERVIEW CONCEPTS COVERED:
 * - Utility Pattern: Reusable helper function for token creation across controllers.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token
 * @param {string} id - User MongoDB ObjectId
 * @param {string} role - User authorization role ('user' | 'admin')
 * @returns {string} Signed JWT token string
 */
const generateToken = (id, role = 'user') => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'movieverse_super_secret_jwt_key_2026_interview_ready',
        { expiresIn: '30d' }
    );
};

module.exports = generateToken;
