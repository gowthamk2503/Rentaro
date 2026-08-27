const BookingDetails = require('../models/BookingDetails');
const Car = require('../models/Car');
const User = require('../models/User');

const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'REN-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// Create a new booking (initialized as Pending until Razorpay payment verification)
exports.createBooking = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      pickupDate, 
      returnDate, 
      date, // fallback if single date provided
      color, 
      comments, 
      car: carIdentifier, 
      carId, 
      userId 
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Customer name, email, and phone are required.' });
    }

    // Determine pickup and return dates
    const start = new Date(pickupDate || date || Date.now());
    let end = returnDate ? new Date(returnDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid dates provided.' });
    }

    if (end <= start) {
      // If same day or end before start, default to 1 day rental
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }

    // Calculate rental duration
    const diffTime = Math.abs(end - start);
    const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Find car in database
    let carDoc = null;
    if (carId && carId.match(/^[0-9a-fA-F]{24}$/)) {
      carDoc = await Car.findById(carId);
    }
    if (!carDoc && carIdentifier) {
      carDoc = await Car.findOne({
        $or: [
          { _id: carIdentifier.match(/^[0-9a-fA-F]{24}$/) ? carIdentifier : null },
          { model: new RegExp(carIdentifier, 'i') },
          { make: new RegExp(carIdentifier, 'i') }
        ]
      });
    }

    // Determine pricing
    const dailyRate = carDoc ? carDoc.pricePerDay : 4500;
    const subtotal = dailyRate * rentalDays;
    const taxAmount = Math.round(subtotal * 0.05); // 5% GST/tax
    const serverTotalCost = subtotal + taxAmount;

    // Check for conflicting active/confirmed bookings on the same car
    if (carDoc) {
      const conflict = await BookingDetails.findOne({
        $or: [
          { carId: carDoc._id },
          { car: `${carDoc.make} ${carDoc.model}` }
        ],
        status: { $in: ['Confirmed', 'Active'] },
        $or: [
          { pickupDate: { $lte: end }, returnDate: { $gte: start } }
        ]
      });

      if (conflict && !carDoc.available) {
        return res.status(400).json({
          message: 'Selected vehicle is already booked for these dates. Please choose different dates or another car.'
        });
      }
    }

    // Check if user is linked
    let linkedUserId = req.user ? req.user._id : null;
    if (!linkedUserId && userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      linkedUserId = userId;
    }
    if (!linkedUserId) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) linkedUserId = existingUser._id;
    }

    const bookingRef = generateBookingRef();
    const carDisplayName = carDoc ? `${carDoc.make} ${carDoc.model}` : (carIdentifier || 'Premium Rental Car');

    const newBooking = new BookingDetails({
      bookingRef,
      user: linkedUserId,
      name,
      email: email.toLowerCase(),
      phone,
      pickupDate: start,
      returnDate: end,
      date: start,
      days: rentalDays,
      color: color || 'Standard',
      comments: comments || '',
      car: carDisplayName,
      carId: carDoc ? carDoc._id : null,
      carDetails: carDoc ? {
        make: carDoc.make,
        model: carDoc.model,
        year: carDoc.year,
        category: carDoc.category,
        image: carDoc.image || (carDoc.images && carDoc.images[0]) || '/swift.jpg',
        pricePerDay: carDoc.pricePerDay
      } : {
        make: 'Rentaro',
        model: carDisplayName,
        year: new Date().getFullYear(),
        category: 'Sedan',
        image: '/swift.jpg',
        pricePerDay: dailyRate
      },
      dailyRate,
      taxAmount,
      totalCost: serverTotalCost,
      status: 'Pending',
      paymentStatus: 'pending'
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking initiated. Please complete payment to confirm.',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Failed to process booking', error: error.message });
  }
};

// Get all bookings (Admin endpoint with filters)
exports.getAllBookings = async (req, res) => {
  try {
    const { search, status, paymentStatus, sort } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { car: searchRegex },
        { bookingRef: searchRegex }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = new RegExp(`^${paymentStatus}$`, 'i');
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'date_asc') sortOptions = { pickupDate: 1 };
    if (sort === 'date_desc') sortOptions = { pickupDate: -1 };
    if (sort === 'total_desc') sortOptions = { totalCost: -1 };

    const bookings = await BookingDetails.find(query).sort(sortOptions);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
  }
};

// Get booking by ID or reference
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingDetails.findById(id);
    }
    
    if (!booking) {
      booking = await BookingDetails.findOne({ bookingRef: id.toUpperCase() });
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: 'Server error retrieving booking', error: error.message });
  }
};

// Get bookings by email (for customer dashboard)
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const bookings = await BookingDetails.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get bookings for logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const bookings = await BookingDetails.find({
      $or: [
        { user: req.user._id },
        { email: userEmail.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to load bookings' });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    // Support legacy PUT without body (which set status to 'Successful')
    if (!status && !paymentStatus) {
      updateFields.status = 'Successful';
    }

    const updatedBooking = await BookingDetails.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ 
      message: 'Booking updated successfully', 
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

// Cancel booking (by customer or admin)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingDetails.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization: must be admin or the booking owner
    if (req.user.role !== 'admin' && booking.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (['Completed', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status.toLowerCase()} booking.` });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};

// Delete a booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await BookingDetails.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
};
