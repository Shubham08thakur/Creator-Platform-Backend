const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, credits } = req.body;
  
  // Find user
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User with id ${req.params.id} not found`, 404));
  }
  
  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  
  // Handle credit adjustments
  if (credits !== undefined && credits !== user.credits) {
    const creditChange = credits - user.credits;
    const description = `Admin adjustment by ${req.user.name}`;
    
    user.addCredits(creditChange, description, 'admin_adjustment');
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Prevent admin from deleting themselves
  if (req.params.id === req.user.id) {
    return next(new ErrorResponse('Admin cannot delete their own account', 400));
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User with id ${req.params.id} not found`, 404));
  }
  
  await user.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
}); 