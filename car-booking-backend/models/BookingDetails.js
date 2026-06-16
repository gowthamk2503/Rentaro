const mongoose = require('mongoose');

const bookingDetailsSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  rentalDays: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  car: { type: String, required: true },
  carName: { type: String, required: true },
  carImage: { type: String },
  comments: { type: String },
  status: { type: String, default: 'Pending' },
  paymentStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookingDetails', bookingDetailsSchema);
