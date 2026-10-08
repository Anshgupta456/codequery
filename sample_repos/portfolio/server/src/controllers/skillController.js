const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  try {
    const list = await Skill.find().sort({ order: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const count = await Skill.countDocuments();
    const item = await Skill.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : count + 1
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Skill category not found' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Skill category not found' });
    await item.deleteOne();
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSkills,
  createCategory,
  updateCategory,
  deleteCategory
};
