const mongoose = require('mongoose');

const dns = require('dns');
// Configure reliable DNS servers to prevent querySrv ECONNREFUSED on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.trim() === '') {
    console.warn('⚠️  MONGO_URI is not defined in .env. MongoDB connection skipped.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed if database has empty collections
    const { autoSeedIfEmpty } = require('../utils/seedDB');
    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('🔄 Will retry MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
