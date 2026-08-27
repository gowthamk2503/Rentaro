const mongoose = require('mongoose');

const bookingDetailsSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  date: { type: Date }, // legacy compatibility
  days: { type: Number, default: 1 },
  color: { type: String, default: 'Black' },
  comments: { type: String, default: '' },
  car: { type: String, required: true }, // Car name or identifier
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  carDetails: {
    make: String,
    model: String,
    year: Number,
    category: String,
    image: String,
    pricePerDay: Number
  },
  dailyRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Successful'], 
    default: 'Pending' 
  },
  // Razorpay Payment Fields
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded', 'Pending', 'Paid', 'Failed', 'Refunded'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paidAt: { type: Date },
  amountPaid: { type: Number },
  currency: { type: String, default: 'INR' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookingDetails', bookingDetailsSchema);
