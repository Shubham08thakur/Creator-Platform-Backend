const Content = require('../models/Content');
const User = require('../models/User');

// @desc    Get all content or filtered content
// @route   GET /api/content
// @access  Public
exports.getContents = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Content.find(JSON.parse(queryStr)).populate({
      path: 'creator',
      select: 'name profileImage'
    });

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Content.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const contents = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: contents.length,
      pagination,
      data: contents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Public
exports.getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate({
      path: 'creator',
      select: 'name profileImage'
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Increment views
    content.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private
exports.createContent = async (req, res) => {
  try {
    // Add creator to req.body
    req.body.creator = req.user.id;

    const content = await Content.create(req.body);

    // Reward the creator with credits for creating content
    const user = await User.findById(req.user.id);
    user.credits += 10;
    await user.save();

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
exports.updateContent = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Make sure user is content creator
    if (content.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this content'
      });
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Make sure user is content creator
    if (content.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this content'
      });
    }

    await content.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Like content
// @route   PUT /api/content/:id/like
// @access  Private
exports.likeContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Increment likes
    content.likes += 1;
    await content.save();

    // Reward the content creator with credits
    const creator = await User.findById(content.creator);
    creator.credits += 1;
    await creator.save();

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 