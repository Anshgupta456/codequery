const express = require('express');
const router = express.Router();
const {
  getSkills,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSkills)
  .post(protect, createCategory);

router.route('/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
