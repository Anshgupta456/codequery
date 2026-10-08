const path = require('path');
const express = require('express');
const cors = require('cors');

// Explicitly resolve .env path so PM2 loads it regardless of execution cwd
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Also check parent directory if not found in server directory
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const experienceRoutes = require('./src/routes/experienceRoutes');
const skillRoutes = require('./src/routes/skillRoutes');
const educationRoutes = require('./src/routes/educationRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const projectCategoryRoutes = require('./src/routes/projectCategoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (schema updated)
connectDB();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, same-origin, health checks) or any valid origin
    const allowed = [
      'https://anshikagupta.online',
      'http://anshikagupta.online',
      'http://localhost:5173',
      'http://localhost:5000',
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (!origin || allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive CORS for portfolio admin
  },
  credentials: true
}));

app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
const mongoose = require('mongoose');
app.get('/api/v1/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.json({
    status: dbState === 'connected' ? 'online' : 'degraded',
    database: dbState,
    service: 'Anshika Gupta Portfolio & Admin API',
    timestamp: new Date().toISOString()
  });
});

// Mount Resource Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/experience', experienceRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/project-categories', projectCategoryRoutes);
app.use('/api/v1/projects/categories', projectCategoryRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on http://localhost:${PORT}`);
  console.log(`📋 Admin auth endpoint: http://localhost:${PORT}/api/v1/auth/login`);
});
