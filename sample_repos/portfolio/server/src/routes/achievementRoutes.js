const express = require('express');
const router = express.Router();
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAchievements)
  .post(protect, createAchievement);

router.route('/:id')
  .put(protect, updateAchievement)
  .delete(protect, deleteAchievement);

module.exports = router;
