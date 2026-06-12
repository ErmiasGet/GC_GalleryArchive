const cloudinary = require('../config/cloudinary');
const BatchPhoto = require('../models/BatchPhoto');

exports.getBatchPhotos = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = { graduationYear: 2026 };
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BatchPhoto.countDocuments(filter);
    const photos = await BatchPhoto.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name email');

    res.json({
      photos,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableYears = async (req, res) => {
  try {
    res.json([2026]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadBatchPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const { caption, category } = req.body;

    const photo = await BatchPhoto.create({
      graduationYear: 2026,
      url: req.file.path,
      publicId: req.file.filename,
      caption: caption || '',
      category: category || 'other',
      uploadedBy: req.user._id,
    });

    const populated = await photo.populate('uploadedBy', 'name email');

    res.status(201).json({ message: 'Batch photo uploaded', photo: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBatchPhoto = async (req, res) => {
  try {
    const photo = await BatchPhoto.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    await photo.deleteOne();
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBatchPhoto = async (req, res) => {
  try {
    const { caption, category } = req.body;
    const photo = await BatchPhoto.findByIdAndUpdate(
      req.params.id,
      { ...(caption !== undefined && { caption }), ...(category !== undefined && { category }) },
      { new: true }
    );
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json({ message: 'Photo updated', photo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
