const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mern-secret-token';

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (err) {
        return res.status(500).json({ error: 'Server error during registration' });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        return res.status(500).json({ error: 'Server error during login' });
    }
});

// @route GET /api/auth/me
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.json({ user });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
