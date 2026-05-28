const mongoose = require('mongoose');

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lifepause';
  
  // Securely mask the password for console logging
  const maskedUri = rawUri.replace(/:([^:@]+)@/, ':******@');
  console.log(`Attempting to connect to MongoDB with URI: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000 // Fast fail in 5 seconds instead of waiting 30 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Mongoose connection failed. Please verify that your MONGO_URI username, password, and cluster link are 100% correct.');
  }
};

module.exports = connectDB;
