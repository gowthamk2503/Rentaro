const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'rentaro_production_jwt_secret_key_2026_secure';
    
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token: User no longer exists.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
};

module.exports = authMiddleware;
