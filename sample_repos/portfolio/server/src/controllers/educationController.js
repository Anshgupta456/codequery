const Education = require('../models/Education');

const getEducation = async (req, res) => {
  try {
    const list = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEducation = async (req, res) => {
  try {
    const count = await Education.countDocuments();
    const item = await Education.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : count + 1
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Education record not found' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Education record not found' });
    await item.deleteOne();
    res.json({ message: 'Education record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
};
