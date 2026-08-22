/**
 * @file User.js
 * @description Mongoose User Schema definition for authentication and role management
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Pre-Save Hooks (Middleware): Automatically hashes plain text passwords using bcryptjs before saving.
 * 2. Schema Methods: Encapsulates `matchPassword` method for secure credential verification.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide an email address'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters']
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        phone: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
