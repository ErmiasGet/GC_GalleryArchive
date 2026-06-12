const express = require('express');
const router = express.Router();
const {
  getPendingApprovals,
  approveGraduate,
  rejectGraduate,
  getAllGraduates,
  getAllUsers,
  toggleFeatured,
  getDashboardStats,
  deleteGraduate,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/pending', getPendingApprovals);
router.get('/graduates', getAllGraduates);
router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.put('/approve/:id', approveGraduate);
router.put('/reject/:id', rejectGraduate);
router.put('/featured/:id', toggleFeatured);
router.delete('/graduates/:id', deleteGraduate);

module.exports = router;
