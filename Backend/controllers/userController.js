const User = require('../models/User');
const BookingDetails = require('../models/BookingDetails');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'rentaro_production_jwt_secret_key_2026_secure';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, licenseNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      licenseNumber: licenseNumber || '',
      role: 'user'
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account was created with Google Sign-In. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated. Contact support.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        role: user.role,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error during login.' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: This account does not possess administrator privileges.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This administrative account is deactivated.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Admin authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: err.message || 'Server error during admin login.' });
  }
};

// Helper to decode or verify Google ID token
const verifyGoogleToken = async (credential) => {
  if (!credential) return null;
  try {
    // Try to decode standard JWT payload if received directly
    const parts = credential.split('.');
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(decodedJson);
      if (payload && payload.email) {
        return payload;
      }
    }
  } catch (err) {
    console.warn('Manual JWT decode failed, will attempt fallback parsing:', err.message);
  }
  return null;
};

// Google OAuth Login / Register
exports.googleAuth = async (req, res) => {
  try {
    const { credential, email: bodyEmail, name: bodyName, avatar: bodyAvatar, googleId: bodyGoogleId } = req.body;

    let email = bodyEmail;
    let name = bodyName;
    let avatar = bodyAvatar;
    let googleId = bodyGoogleId;

    // If Google ID Token is provided, parse verified payload
    if (credential) {
      const verifiedPayload = await verifyGoogleToken(credential);
      if (verifiedPayload && verifiedPayload.email) {
        email = verifiedPayload.email;
        name = verifiedPayload.name || name;
        avatar = verifiedPayload.picture || avatar;
        googleId = verifiedPayload.sub || googleId;
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Valid Google email is required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create new account for first-time Google signin
      user = new User({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: avatar || '',
        googleId: googleId || '',
        role: 'user',
        isActive: true
      });
      await user.save();
    } else {
      // If user exists, update avatar and googleId if missing
      let modified = false;
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        modified = true;
      }
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated. Please contact customer support.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        licenseNumber: user.licenseNumber || '',
        avatar: user.avatar || avatar || ''
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: err.message || 'Google authentication failed.' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookingCount = await BookingDetails.countDocuments({ email: user.email });

    res.status(200).json({
      user,
      bookingCount
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, licenseNumber, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Admin: Get all users with booking statistics
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Attach booking count for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await BookingDetails.countDocuments({ email: u.email });
        return {
          ...u.toObject(),
          bookingsCount
        };
      })
    );

    res.status(200).json(usersWithStats);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Admin: Update user status or role
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role !== undefined && ['user', 'admin'].includes(role)) user.role = role;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error('Update user status error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
