const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CreditTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['login', 'profile_update', 'content_creation', 'like_received', 'content_view', 'admin_adjustment'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  credits: {
    type: Number,
    default: 0
  },
  creditHistory: [CreditTransactionSchema],
  lastLoginDate: {
    type: Date
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add credit points with transaction history
UserSchema.methods.addCredits = function(amount, description, transactionType) {
  this.credits += amount;
  this.creditHistory.push({
    amount,
    description,
    transactionType
  });
};

module.exports = mongoose.model('User', UserSchema); 