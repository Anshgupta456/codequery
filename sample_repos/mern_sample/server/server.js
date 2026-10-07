const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/merndb';

app.use(express.json());

// Mount application routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Database connection helper
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectDB();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
