const Graduate = require('../models/Graduate');
const Comment = require('../models/Comment');
const Memory = require('../models/Memory');

exports.getGraduates = async (req, res) => {
  try {
    const { page = 1, limit = 12, department, search, status } = req.query;
    const query = { status: 'approved', graduationYear: 2026 };

    if (department) query.department = department;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.user && req.user.role === 'admin' && status) {
      query.status = status;
    }

    const total = await Graduate.countDocuments(query);
    const graduates = await Graduate.find(query)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      graduates,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGraduateById = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id)
      .populate('user', 'email');

    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    if (graduate.status !== 'approved' && graduate.status !== 'pending') {
      if (
        !req.user ||
        (req.user._id.toString() !== graduate.user._id.toString() &&
          req.user.role !== 'admin')
      ) {
        return res.status(404).json({ message: 'Graduate not found' });
      }
    }

    graduate.views += 1;
    await graduate.save();

    const comments = await Comment.find({ graduate: graduate._id, isApproved: true })
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json({ graduate, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGraduate = async (req, res) => {
  try {
    let graduate = await Graduate.findOne({ user: req.user._id });

    if (!graduate) {
      return res.status(404).json({ message: 'Graduate profile not found' });
    }

    const allowedFields = [
      'fullName', 'studentId', 'department', 'graduationYear',
      'quote', 'biography', 'favoriteMemory',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        graduate[field] = req.body[field];
      }
    });

    if (graduate.status !== 'approved') {
      graduate.status = 'pending';
      graduate.adminNote = '';
    }

    graduate = await graduate.save();

    res.json(graduate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitForApproval = async (req, res) => {
  try {
    const graduate = await Graduate.findOne({ user: req.user._id });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate profile not found' });
    }

    if (!graduate.fullName || !graduate.studentId || !graduate.department || !graduate.graduationYear) {
      return res.status(400).json({ message: 'Please complete your profile before submitting' });
    }

    graduate.status = 'pending';
    await graduate.save();

    res.json({ message: 'Profile submitted for approval', graduate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const graduate = await Graduate.findOne({ user: req.user._id })
      .populate('user', 'email');
    if (!graduate) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(graduate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeGraduate = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.id);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    const index = graduate.likes.indexOf(req.user._id);
    if (index > -1) {
      graduate.likes.splice(index, 1);
    } else {
      graduate.likes.push(req.user._id);
    }

    await graduate.save();
    res.json({ likes: graduate.likes, likesCount: graduate.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentGraduates = async (req, res) => {
  try {
    const graduates = await Graduate.find({ status: 'approved', graduationYear: 2026 })
      .populate('user', 'email')
      .sort({ updatedAt: -1 })
      .limit(12);
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedGraduates = async (req, res) => {
  try {
    const graduates = await Graduate.find({ status: 'approved', isFeatured: true, graduationYear: 2026 })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalGraduates = await Graduate.countDocuments({ status: 'approved', graduationYear: 2026 });
    const graduationYears = await Graduate.distinct('graduationYear', {
      status: 'approved', graduationYear: 2026,
    });
    const departments = await Graduate.distinct('department', {
      status: 'approved', graduationYear: 2026,
    });

    const totalPhotos = await Graduate.aggregate([
      { $match: { status: 'approved', graduationYear: 2026 } },
      { $group: { _id: null, total: { $sum: { $size: '$photos' } } } },
    ]);

    res.json({
      totalGraduates,
      totalBatches: graduationYears.length,
      totalDepartments: departments.length,
      totalPhotos: totalPhotos[0]?.total || 0,
      graduationYears: graduationYears.sort((a, b) => b - a),
      departments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
