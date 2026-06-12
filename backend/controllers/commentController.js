const Comment = require('../models/Comment');
const Graduate = require('../models/Graduate');

exports.addComment = async (req, res) => {
  try {
    const graduate = await Graduate.findById(req.params.graduateId);
    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    const comment = await Comment.create({
      graduate: req.params.graduateId,
      user: req.user._id,
      text: req.body.text,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      graduate: req.params.graduateId,
      isApproved: true,
    })
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
