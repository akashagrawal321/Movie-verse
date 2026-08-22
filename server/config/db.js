/**
 * @file db.js
 * @description MongoDB Mongoose Database Connection Configuration
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/movieverse_pro';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 sec timeout to avoid hanging indefinitely
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not kill the Express process so Render remains operational and can respond
  }
};

module.exports = connectDB;
