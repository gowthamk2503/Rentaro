const express = require('express');
const router = express.Router();
const {
  createPayment,
  listPayments,
  getPaymentByBookingId,
  approvePayment,
  rejectPayment
} = require('../controllers/paymentController');

// POST /api/payments
router.post('/', createPayment);

// GET /api/payments  -> optional ?status=Pending|Verification Pending|Paid|Failed|all
router.get('/', listPayments);

// GET /api/payments/booking/:bookingId
router.get('/booking/:bookingId', getPaymentByBookingId);

// POST /api/payments/:id/approve
router.post('/:id/approve', approvePayment);

// POST /api/payments/:id/reject
router.post('/:id/reject', rejectPayment);

module.exports = router;
