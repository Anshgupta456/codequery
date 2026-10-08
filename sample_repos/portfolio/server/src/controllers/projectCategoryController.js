const ProjectCategory = require('../models/ProjectCategory');

const DEFAULT_CATEGORIES = ['Full Stack', 'Frontend', 'Backend', 'AI & ML'];

// @desc    Get all project categories
// @route   GET /api/v1/project-categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    let categories = await ProjectCategory.find().sort({ order: 1, createdAt: 1 });
    
    // Auto-seed default categories if collection is completely empty
    if (categories.length === 0) {
      const seeded = await ProjectCategory.insertMany(
        DEFAULT_CATEGORIES.map((name, index) => ({ name, order: index + 1 }))
      );
      return res.json(seeded);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create project category
// @route   POST /api/v1/project-categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const existing = await ProjectCategory.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
    });

    if (existing) {
      return res.status(400).json({ message: `Category "${trimmedName}" already exists` });
    }

    const count = await ProjectCategory.countDocuments();
    const newCategory = await ProjectCategory.create({
      name: trimmedName,
      order: count + 1
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete project category
// @route   DELETE /api/v1/project-categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ message: 'Category removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
