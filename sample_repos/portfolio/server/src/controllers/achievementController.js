const Achievement = require('../models/Achievement');

const getAchievements = async (req, res) => {
  try {
    const list = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const count = await Achievement.countDocuments();
    const item = await Achievement.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : count + 1
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Achievement not found' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Achievement not found' });
    await item.deleteOne();
    res.json({ message: 'Achievement removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
