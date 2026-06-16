const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingDetails', required: true },
  customerId: { type: String },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String },
  paymentDate: { type: Date, default: Date.now },
  screenshotPath: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Verification Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PaymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
