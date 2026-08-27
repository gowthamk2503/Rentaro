const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Booking creation (supports both / and /create)
router.post('/', bookingController.createBooking);
router.post('/create', bookingController.createBooking);

// Customer bookings routes
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);
router.get('/email/:email', bookingController.getBookingsByEmail);
router.get('/user/:email', bookingController.getBookingsByEmail);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// Admin-only booking routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.put('/:id', authMiddleware, adminMiddleware, bookingController.updateBookingStatus);
router.patch('/:id', authMiddleware, adminMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, adminMiddleware, bookingController.deleteBooking);

module.exports = router;
