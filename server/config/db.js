/**
 * @file db.js
 * @description MongoDB Mongoose Database Connection Configuration
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Mongoose Connection Abstraction:
 *    Asynchronous connection handler establishing connection to local or cloud MongoDB instances.
 * 2. Process Error Handling:
 *    Gracefully terminates process on failure (`process.exit(1)`).
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieverse_pro');
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
