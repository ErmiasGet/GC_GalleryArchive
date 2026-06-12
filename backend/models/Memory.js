const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  graduate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Graduate',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Memory message is required'],
    trim: true,
    maxlength: [300, 'Message cannot exceed 300 characters'],
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Memory', memorySchema);
