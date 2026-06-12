const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const {
  uploadProfilePhoto,
  uploadCoverPhoto,
  uploadGalleryPhotos,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/profile', protect, upload.single('image'), uploadProfilePhoto);
router.post('/cover', protect, upload.single('image'), uploadCoverPhoto);
router.post('/gallery', protect, upload.array('images', 10), uploadGalleryPhotos);

module.exports = router;
