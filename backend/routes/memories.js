const express = require('express');
const router = express.Router();
const {
  addMemory,
  getMemories,
  likeMemory,
  editMemory,
  approveMemory,
  deleteMemory,
} = require('../controllers/memoryController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getMemories);
router.post('/', protect, addMemory);
router.post('/:id/like', protect, likeMemory);
router.put('/:id', protect, editMemory);
router.put('/:id/approve', protect, admin, approveMemory);
router.delete('/:id', protect, deleteMemory);

module.exports = router;
