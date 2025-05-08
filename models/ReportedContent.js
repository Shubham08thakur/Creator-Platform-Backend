const mongoose = require('mongoose');

const ReportedContentSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    required: true,
    enum: ['spam', 'inappropriate', 'offensive', 'misinformation', 'copyright', 'other']
  },
  details: {
    type: String
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'approved'],
    default: 'pending'
  }
});

// Compound index to prevent duplicate reports from same user
ReportedContentSchema.index({ user: 1, contentId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('ReportedContent', ReportedContentSchema); 