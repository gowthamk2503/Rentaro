const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingDetails',
    required: true
  },
  bookingRef: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerEmail: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountInPaise: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'failed', 'refunded'],
    default: 'created'
  },
  paymentMethod: {
    type: String,
    default: 'razorpay'
  },
  notes: {
    type: Object,
    default: {}
  },
  rawEventData: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

paymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
