const express = require('express');
const router = express.Router();
const {
  getGraduates,
  getGraduateById,
  updateGraduate,
  submitForApproval,
  getMyProfile,
  likeGraduate,
  getRecentGraduates,
  getFeaturedGraduates,
  getStatistics,
} = require('../controllers/graduateController');
const { protect } = require('../middleware/auth');

router.get('/', getGraduates);
router.get('/statistics', getStatistics);
router.get('/recent', getRecentGraduates);
router.get('/featured', getFeaturedGraduates);
router.get('/me', protect, getMyProfile);
router.get('/:id', getGraduateById);
router.put('/me', protect, updateGraduate);
router.post('/submit', protect, submitForApproval);
router.post('/:id/like', protect, likeGraduate);

module.exports = router;
