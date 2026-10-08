const Message = require('../models/Message');

// @desc    Get all messages (Admin)
// @route   GET /api/v1/messages
// @access  Private (Admin)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit new message (Public Contact Form)
// @route   POST /api/v1/messages
// @access  Public
const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message body' });
  }

  try {
    const newMessage = await Message.create({
      name,
      email,
      message
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read/unread
// @route   PATCH /api/v1/messages/:id/read
// @access  Private (Admin)
const markMessageRead = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    msg.isRead = req.body.isRead !== undefined ? req.body.isRead : true;
    const updated = await msg.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/v1/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    await msg.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  submitMessage,
  markMessageRead,
  deleteMessage
};
