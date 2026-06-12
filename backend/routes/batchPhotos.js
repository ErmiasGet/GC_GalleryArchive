const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const {
  getBatchPhotos,
  getAvailableYears,
  uploadBatchPhoto,
  deleteBatchPhoto,
  updateBatchPhoto,
} = require('../controllers/batchPhotoController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getBatchPhotos);
router.get('/years', getAvailableYears);
router.post('/', protect, admin, upload.single('image'), uploadBatchPhoto);
router.put('/:id', protect, admin, updateBatchPhoto);
router.delete('/:id', protect, admin, deleteBatchPhoto);

module.exports = router;
