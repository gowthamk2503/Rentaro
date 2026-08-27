const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Order creation - requires authenticated user
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Payment signature verification - requires authenticated user
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Webhook listener - open endpoint verified by Razorpay cryptographic webhook signature
router.post('/webhook', paymentController.handleWebhook);

// Get payment status for a specific booking - requires authenticated user
router.get('/booking/:bookingId', authMiddleware, paymentController.getBookingPayment);

module.exports = router;
