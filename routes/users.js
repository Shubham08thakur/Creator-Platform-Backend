const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  updateCredits 
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

router.route('/:id/credits')
  .put(updateCredits);

module.exports = router; 