const express = require('express');
const {
  getFeed,
  saveContent,
  getSavedContent,
  deleteSavedContent,
  reportContent
} = require('../controllers/feedController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getFeed);

// Protected routes
router.post('/save', protect, saveContent);
router.get('/saved', protect, getSavedContent);
router.delete('/saved/:id', protect, deleteSavedContent);
router.post('/report', protect, reportContent);

module.exports = router; 