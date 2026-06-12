const cloudinary = require('../config/cloudinary');
const Graduate = require('../models/Graduate');

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const graduate = await Graduate.findOne({ user: req.user._id });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    if (graduate.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(graduate.profilePhotoPublicId);
    }

    graduate.profilePhoto = req.file.path;
    graduate.profilePhotoPublicId = req.file.filename;
    await graduate.save();

    res.json({
      message: 'Profile photo uploaded',
      url: req.file.path,
      graduate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const graduate = await Graduate.findOne({ user: req.user._id });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    if (graduate.coverPhotoPublicId) {
      await cloudinary.uploader.destroy(graduate.coverPhotoPublicId);
    }

    graduate.coverPhoto = req.file.path;
    graduate.coverPhotoPublicId = req.file.filename;
    await graduate.save();

    res.json({
      message: 'Cover photo uploaded',
      url: req.file.path,
      graduate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadGalleryPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const graduate = await Graduate.findOne({ user: req.user._id });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    const newPhotos = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      caption: '',
    }));

    graduate.photos.push(...newPhotos);
    await graduate.save();

    res.json({
      message: `${req.files.length} photos uploaded`,
      photos: newPhotos,
      graduate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
