const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Create a temporary route to create an admin user
router.get('/setup-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin user already exists' 
      });
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router; 