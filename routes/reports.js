const express = require('express');
const router = express.Router();
const {
  reportContent,
  getReportedContent,
  updateReportStatus
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// Route for users to report content
router.post('/', protect, reportContent);

// Routes for admins to manage reported content
router.get('/', protect, authorize('admin'), getReportedContent);
router.put('/:id', protect, authorize('admin'), updateReportStatus);

module.exports = router; 