const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  contentType: {
    type: String,
    enum: ['article', 'video', 'image', 'audio'],
    required: true
  },
  contentUrl: {
    type: String,
    required: [true, 'Please add content URL']
  },
  thumbnail: {
    type: String,
    default: 'default-thumbnail.jpg'
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema); 