const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Admin login
// @route   POST /api/v1/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
          role: admin.role
        }
      });
    }

    // Default admin fallback if DB has no admin registered yet
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && username === 'admin' && password === 'admin123') {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt);
      const newAdmin = await Admin.create({
        username: 'admin',
        passwordHash: hash,
        name: 'Anshika Gupta',
        role: 'Administrator'
      });

      return res.json({
        token: generateToken(newAdmin._id),
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          name: newAdmin.name,
          role: newAdmin.role
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials. (Demo: admin / admin123)' });
  } catch (error) {
    // If MongoDB is offline, provide graceful response for testing
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        token: 'mock-jwt-token-demo',
        admin: {
          id: 'admin-1',
          username: 'admin',
          name: 'Anshika Gupta',
          role: 'Administrator'
        }
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get current admin user profile
// @route   GET /api/v1/auth/me
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  res.json(req.admin);
};

module.exports = { loginAdmin, getAdminProfile };
