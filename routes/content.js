const express = require('express');
const router = express.Router();
const {
  getContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  likeContent
} = require('../controllers/content');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getContents)
  .post(protect, createContent);

router.route('/:id')
  .get(getContent)
  .put(protect, updateContent)
  .delete(protect, deleteContent);

router.route('/:id/like')
  .put(protect, likeContent);

module.exports = router; 