const express = require('express');
const router = express.Router();
const {
  getMessages,
  submitMessage,
  markMessageRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit messages
router.post('/', submitMessage);

// Admin-protected routes
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, markMessageRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
