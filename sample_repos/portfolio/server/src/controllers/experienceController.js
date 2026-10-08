const Experience = require('../models/Experience');

const getExperience = async (req, res) => {
  try {
    const list = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const count = await Experience.countDocuments();
    const item = await Experience.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : count + 1
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Experience record not found' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Experience record not found' });
    await item.deleteOne();
    res.json({ message: 'Experience removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
};
