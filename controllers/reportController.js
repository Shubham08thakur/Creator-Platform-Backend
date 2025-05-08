const ReportedContent = require('../models/ReportedContent');
const Content = require('../models/Content');

// @desc    Report a content
// @route   POST /api/reports
// @access  Private
exports.reportContent = async (req, res) => {
  try {
    const { contentId, reason, details } = req.body;

    // Check if content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user has already reported this content
    const existingReport = await ReportedContent.findOne({
      user: req.user.id,
      contentId,
      platform: 'internal'
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        error: 'You have already reported this content'
      });
    }

    // Create report
    const report = await ReportedContent.create({
      user: req.user.id,
      contentId,
      platform: 'internal',
      reason,
      details: details || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all reported content (admin only)
// @route   GET /api/reports
// @access  Private/Admin
exports.getReportedContent = async (req, res) => {
  try {
    const reports = await ReportedContent.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort('-reportedAt');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update report status (admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'rejected', 'approved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const report = await ReportedContent.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 