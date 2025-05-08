const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controllers
const { getUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { getReportedContent, updateReportStatus } = require('../controllers/reportController');

// Routes
// All routes need authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.route('/users').get(getUsers);
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Reported content routes
router.route('/reported-content').get(getReportedContent);
router.route('/reported-content/:id').put(updateReportStatus);

// Feed analytics routes (to be implemented)
router.route('/feed/analytics').get((req, res) => {
  // Placeholder for analytics endpoint
  res.status(200).json({ 
    success: true, 
    message: 'Feed analytics endpoint (to be implemented)'
  });
});

module.exports = router; 