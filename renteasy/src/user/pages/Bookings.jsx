import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const car = state?.car;
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, you would send this to your backend
    console.log('Booking details:', { ...formData, car });
    setBookingSuccess(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!car) {
    return (
      <div className="booking-container">
        <h2>No car selected</h2>
        <button onClick={() => navigate('/cars')}>Back to Cars</button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <h2>🎉 Booking Successful!</h2>
        <p>Your booking for {car.name} has been confirmed.</p>
        <div className="success-actions">
          <button onClick={() => navigate('/bookings')}>View Bookings</button>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Book {car.name}</h1>
        <p className="price">₹{(car.price / 100000).toFixed(2)} Lakh</p>
      </div>

      <div className="booking-content">
        <div className="car-summary">
          <img src={car.images[0]} alt={car.name} />
          <div className="car-specs">
            <h3>Key Specifications:</h3>
            <ul>
              {car.specs.slice(0, 4).map((spec, idx) => (
                <li key={idx}>{spec.icon} {spec.label}</li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-group">
            <label>Pickup Date</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button type="submit" className="submit-booking">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}