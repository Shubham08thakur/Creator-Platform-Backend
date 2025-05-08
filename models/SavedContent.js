const mongoose = require('mongoose');

const SavedContentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['twitter', 'reddit', 'linkedin', 'internal'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: String,
  contentUrl: {
    type: String,
    required: true
  },
  author: String,
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate saves
SavedContentSchema.index({ user: 1, contentId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SavedContent', SavedContentSchema); 