const cloudinary = require('../config/cloudinary');
const Graduate = require('../models/Graduate');
const User = require('../models/User');

const deleteGraduateImages = async (graduate) => {
  const deletions = [];

  if (graduate.profilePhotoPublicId) {
    deletions.push(cloudinary.uploader.destroy(graduate.profilePhotoPublicId));
  }
  if (graduate.coverPhotoPublicId) {
    deletions.push(cloudinary.uploader.destroy(graduate.coverPhotoPublicId));
  }
  graduate.photos.forEach((photo) => {
    if (photo.publicId) {
      deletions.push(cloudinary.uploader.destroy(photo.publicId));
    }
  });

  await Promise.allSettled(deletions);
};

exports.getPendingApprovals = async (req, res) => {
  try {
    const graduates = await Graduate.find({ status: 'pending', graduationYear: 2026 })
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveGraduate = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    graduate.status = 'approved';
    graduate.adminNote = '';
    await graduate.save();

    res.json({ message: 'Graduate approved successfully', graduate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectGraduate = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    const { reason } = req.body;
    graduate.status = 'rejected';
    graduate.adminNote = reason || 'Profile requires corrections';
    await graduate.save();

    res.json({ message: 'Graduate rejected', graduate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGraduates = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = { graduationYear: 2026 };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Graduate.countDocuments(query);
    const graduates = await Graduate.find(query)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ graduates, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }
    graduate.isFeatured = !graduate.isFeatured;
    await graduate.save();
    res.json({ isFeatured: graduate.isFeatured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalGraduates = await Graduate.countDocuments({ graduationYear: 2026 });
    const pendingGraduates = await Graduate.countDocuments({ status: 'pending', graduationYear: 2026 });
    const approvedGraduates = await Graduate.countDocuments({ status: 'approved', graduationYear: 2026 });
    const rejectedGraduates = await Graduate.countDocuments({ status: 'rejected', graduationYear: 2026 });
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const yearDistribution = await Graduate.aggregate([
      { $match: { graduationYear: 2026 } },
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const departmentDistribution = await Graduate.aggregate([
      { $match: { graduationYear: 2026 } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalGraduates,
      pendingGraduates,
      approvedGraduates,
      rejectedGraduates,
      totalUsers,
      totalAdmins,
      yearDistribution,
      departmentDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGraduate = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    await deleteGraduateImages(graduate);
    await graduate.deleteOne();

    res.json({ message: 'Graduate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
