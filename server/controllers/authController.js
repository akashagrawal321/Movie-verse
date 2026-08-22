/**
 * @file authController.js
 * @description Controller for User Registration, Login, Profile Retrieval & Updates
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Password Hashing: Uses bcrypt pre-save hook in User model to prevent storing raw passwords.
 * 2. Token Generation: Encapsulates JWT signing (`id`, `role`) inside `generateToken` helper.
 * 3. Validation & Error Handling: Returns 400 Bad Request for validation errors and 401 Unauthorized for bad credentials.
 * 4. Password Security: Always excludes password fields (`.select('-password')`) before sending user objects to clients.
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // 1. Validation: Required fields check
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // 2. Validation: Password length check
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // 3. Validation: Duplicate Email Check
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'A user account with this email already exists'
            });
        }

        // 4. Create User (password gets automatically hashed by Mongoose pre-save hook)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone: phone || ''
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User account registered successfully',
                token: generateToken(user._id, user.role),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    avatar: user.avatar,
                    createdAt: user.createdAt
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validation: Input fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // 2. Find User by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // 3. Verify existence and match bcrypt password hash
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: generateToken(user._id, user.role),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    avatar: user.avatar,
                    createdAt: user.createdAt
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email address or password'
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile details
 * @access  Private (Protected)
 */
const getUserProfile = async (req, res, next) => {
    try {
        // req.user attached by protect middleware (password excluded)
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile details
 * @access  Private (Protected)
 */
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowable profile fields
        user.name = req.body.name || user.name;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.avatar = req.body.avatar || user.avatar;

        // Optional password update
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long'
                });
            }
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
