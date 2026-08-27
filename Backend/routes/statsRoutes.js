const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin statistics endpoint
router.get('/dashboard', authMiddleware, adminMiddleware, statsController.getDashboardStats);
// Public/fallback overview stats
router.get('/overview', statsController.getDashboardStats);

module.exports = router;
