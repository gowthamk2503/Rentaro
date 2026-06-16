const BookingDetails = require('../models/BookingDetails');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      pickupLocation,
      pickupDate,
      returnDate,
      color,
      comments,
      car,
      carName,
      carImage,
      pricePerDay
    } = req.body;

    if (!name || !email || !phone || !pickupLocation || !pickupDate || !returnDate || !car || !carName || !pricePerDay) {
      return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    const pickup = new Date(pickupDate);
    const drop = new Date(returnDate);
    const timeDiff = drop.getTime() - pickup.getTime();
    if (timeDiff < 0) {
      return res.status(400).json({ message: 'Return date must be after pickup date.' });
    }

    const rentalDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const totalCost = rentalDays * pricePerDay;

    const newBooking = new BookingDetails({
      userId,
      name,
      email,
      phone,
      pickupLocation,
      pickupDate: pickup,
      returnDate: drop,
      rentalDays,
      pricePerDay,
      totalCost,
      color,
      comments,
      car,
      carName,
      carImage,
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingDetails.find();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingDetails.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await BookingDetails.findByIdAndUpdate(
      id,
      { status: 'Successful' }, // <- update the status to 'Successful'
      { new: true } // <- important to get the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await BookingDetails.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const bookings = await BookingDetails.find({ email });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this email' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

