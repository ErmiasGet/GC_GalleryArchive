const mongoose = require('mongoose');

const graduateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required'],
  },
  quote: {
    type: String,
    trim: true,
    maxlength: [300, 'Quote cannot exceed 300 characters'],
  },
  biography: {
    type: String,
    trim: true,
    maxlength: [1000, 'Biography cannot exceed 1000 characters'],
  },
  favoriteMemory: {
    type: String,
    trim: true,
    maxlength: [500, 'Favorite memory cannot exceed 500 characters'],
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  profilePhotoPublicId: {
    type: String,
    default: '',
  },
  coverPhoto: {
    type: String,
    default: '',
  },
  coverPhotoPublicId: {
    type: String,
    default: '',
  },
  photos: [
    {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
      caption: { type: String, default: '' },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

graduateSchema.index({ graduationYear: 1, department: 1 });
graduateSchema.index({ fullName: 'text', biography: 'text' });

graduateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Graduate', graduateSchema);
