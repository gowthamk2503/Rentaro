const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  googleId: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
