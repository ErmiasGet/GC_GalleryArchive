const mongoose = require('mongoose');

const batchPhotoSchema = new mongoose.Schema({
  graduationYear: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['ceremony', 'department', 'campus', 'group', 'other'],
    default: 'other',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BatchPhoto', batchPhotoSchema);
