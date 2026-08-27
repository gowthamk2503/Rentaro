const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public auth routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/admin-login', userController.adminLogin);
router.post('/google-login', userController.googleAuth);
router.post('/google', userController.googleAuth); // Alias

// Authenticated user profile routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Admin-only user management routes
router.get('/admin/all', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, userController.updateUserStatus);
router.patch('/:id', authMiddleware, adminMiddleware, userController.updateUserStatus);
router.delete('/admin/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
