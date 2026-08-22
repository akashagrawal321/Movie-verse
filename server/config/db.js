/**
 * @file db.js
 * @description MongoDB Mongoose Database Connection Configuration
 */

const mongoose = require('mongoose');

// Disable buffering so queries fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

global.lastDbError = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/movieverse_pro';
    console.log(`📡 Connecting to MongoDB...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    global.lastDbError = null;
    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host} [Database: ${conn.connection.name}]`);
  } catch (error) {
    global.lastDbError = error.message;
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
  }
};

module.exports = connectDB;
