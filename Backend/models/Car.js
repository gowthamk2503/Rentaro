const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Economy', 'Sedan', 'SUV', 'Luxury', 'Electric'], 
    default: 'Sedan' 
  },
  pricePerDay: { type: Number, required: true },
  available: { type: Boolean, default: true },
  fuelType: { type: String, default: 'Petrol' },
  transmission: { type: String, default: 'Automatic' },
  seats: { type: Number, default: 5 },
  mileage: { type: String, default: '20 kmpl' },
  bootSpace: { type: String, default: '300 Litres' },
  groundClearance: { type: String, default: '170 mm' },
  engine: { type: String, default: '1.5L Turbo' },
  power: { type: String, default: '115 bhp' },
  torque: { type: String, default: '150 Nm' },
  image: { type: String, default: '/swift.jpg' },
  images: [{ type: String }],
  features: [{ type: String }],
  colors: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  tripsCount: { type: Number, default: 12 },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);
