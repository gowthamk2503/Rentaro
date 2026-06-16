const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');


dotenv.config();
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (Atlas). If connection fails (auth or network),
// fall back to an in-memory MongoDB for local development.
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectWithFallback(){
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    console.log('Falling back to in-memory MongoDB for development...');
    try {
      const mem = await MongoMemoryServer.create();
      const memUri = mem.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB');
    } catch (memErr) {
      console.error('In-memory MongoDB failed to start:', memErr);
    }
  }
}

connectWithFallback();

app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
