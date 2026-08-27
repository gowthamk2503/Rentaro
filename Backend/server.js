const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const statsRoutes = require('./routes/statsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Security headers for Google Identity Services OAuth popup postMessage
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Middleware: Preserves rawBody buffer for Razorpay webhook signature verification
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration: Allow frontend development origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow for local development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    service: 'Rentaro Backend API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    razorpay: {
      keyConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
      secretConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET)
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint ${req.method} ${req.url} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Database Connection & Server Launch
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('CRITICAL: MONGODB_URI is not set in environment variables!');
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully to Rentaro cluster');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

const server = app.listen(PORT, () => {
  console.log(`🚀 Rentaro Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process. Please free port ${PORT} or change PORT in .env.`);
  } else {
    console.error('❌ Server startup error:', err);
  }
});

module.exports = app;
