const Memory = require('../models/Memory');
const Graduate = require('../models/Graduate');

exports.addMemory = async (req, res) => {
  try {
    const graduate = await Graduate.findOne({ user: req.user._id });
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate profile not found' });
    }

    const memory = await Memory.create({
      graduate: graduate._id,
      user: req.user._id,
      message: req.body.message,
    });

    const populatedMemory = await Memory.findById(memory._id)
      .populate({
        path: 'graduate',
        select: 'fullName profilePhoto graduationYear department',
      })
      .populate('user', 'email');

    res.status(201).json(populatedMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemories = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const memories = await Memory.find({ isApproved: true })
      .populate({
        path: 'graduate',
        select: 'fullName profilePhoto graduationYear department',
      })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Memory.countDocuments({ isApproved: true });

    res.json({
      memories,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const index = memory.likes.indexOf(req.user._id);
    if (index > -1) {
      memory.likes.splice(index, 1);
    } else {
      memory.likes.push(req.user._id);
    }

    await memory.save();
    res.json({ likes: memory.likes, likesCount: memory.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editMemory = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this memory' });
    }

    if (memory.edited) {
      return res.status(400).json({ message: 'Memory can only be edited once' });
    }

    memory.message = message.trim();
    memory.edited = true;
    memory.updatedAt = new Date();
    await memory.save();

    const populatedMemory = await Memory.findById(memory._id)
      .populate({
        path: 'graduate',
        select: 'fullName profilePhoto graduationYear department',
      })
      .populate('user', 'email');

    res.json(populatedMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    memory.isApproved = true;
    await memory.save();
    res.json({ message: 'Memory approved', memory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    await memory.deleteOne();
    res.json({ message: 'Memory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
