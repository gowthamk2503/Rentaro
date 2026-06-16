const fs = require('fs');
const path = require('path');
const Payment = require('../models/Payment');
const BookingDetails = require('../models/BookingDetails');

const saveScreenshot = (screenshotBase64) => {
  if (!screenshotBase64 || !screenshotBase64.startsWith('data:')) return null;
  const matches = screenshotBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1].split('/')[1] || 'png';
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `payment-${Date.now()}.${ext}`;
  const screenshotPath = path.join('uploads', filename);
  fs.writeFileSync(path.join(__dirname, '..', screenshotPath), buffer);
  return screenshotPath.replace(/\\/g, '/');
};

exports.createPayment = async (req, res) => {
  try {
    const {
      bookingId,
      customerId,
      amount,
      paymentMethod,
      transactionId,
      screenshotBase64,
      notes
    } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Booking, amount and payment method are required.' });
    }

    const booking = await BookingDetails.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const screenshotPath = saveScreenshot(screenshotBase64);
    let status = 'Pending';
    if (paymentMethod === 'COD') {
      status = 'Pending';
    } else if (transactionId && transactionId.toString().trim().length >= 6) {
      status = 'Verification Pending';
    } else {
      status = 'Pending';
    }

    const payment = new Payment({
      bookingId,
      customerId,
      amount,
      paymentMethod,
      transactionId,
      screenshotPath,
      status,
      notes
    });
    await payment.save();

    booking.paymentStatus = status;
    await booking.save();

    return res.status(201).json({ success: true, payment, message: 'Payment details saved.', status });
  } catch (err) {
    console.error('createPayment error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.listPayments = async (req, res) => {
  try {
    const status = req.query.status || 'all';
    let filter = {};
    if (status !== 'all') filter.status = status;

    const payments = await Payment.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, payments });
  } catch (err) {
    console.error('listPayments error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = await Payment.findOne({ bookingId }).lean();
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found for this booking.' });
    return res.json({ success: true, payment });
  } catch (err) {
    console.error('getPaymentByBookingId error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

    payment.status = 'Paid';
    await payment.save();

    const booking = await BookingDetails.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'Paid';
      booking.status = 'Successful';
      await booking.save();
    }

    return res.json({ success: true, message: 'Payment approved.', payment });
  } catch (err) {
    console.error('approvePayment error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

    payment.status = 'Failed';
    payment.notes = `${payment.notes || ''} ${req.body.reason || 'Rejected by admin.'}`.trim();
    await payment.save();

    const booking = await BookingDetails.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'Failed';
      await booking.save();
    }

    return res.json({ success: true, message: 'Payment rejected.', payment });
  } catch (err) {
    console.error('rejectPayment error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
