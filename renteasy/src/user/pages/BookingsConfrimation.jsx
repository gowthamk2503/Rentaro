import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get carImage from navigation state, fallback to a default image if not present
  const carImage = location.state?.carImage || '/images/default_car.jpg';

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching booking");
        setBooking(data.booking);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="loading-container">Loading booking details...</div>;
  if (error || !booking) return <div className="error-container">{error || 'Booking not found'}</div>;

  const handleDownloadReceipt = () => {
    const receipt = `Booking Receipt\n\nBooking ID: ${booking._id}\nName: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nCar: ${booking.carName || booking.car}\nPickup Location: ${booking.pickupLocation || 'N/A'}\nPickup Date: ${new Date(booking.pickupDate).toLocaleDateString()}\nReturn Date: ${new Date(booking.returnDate).toLocaleDateString()}\nRental Days: ${booking.rentalDays || 'N/A'}\nPrice Per Day: ₹${booking.pricePerDay?.toLocaleString() || booking.totalCost}\nTotal Amount: ₹${booking.totalCost.toLocaleString()}\nBooking Status: ${booking.status}\nPayment Status: ${booking.paymentStatus}`;
    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${booking._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="booking-confirmation">
      <h1>Booking Confirmation</h1>
      <div className="car-summary">
        <img 
          src={carImage} 
          alt={booking.carName || booking.car} 
          className="car-image"
          onError={e => { e.target.onerror = null; e.target.src = '/images/default_car.jpg'; }}
        />
        <h2>{booking.carName || booking.car}</h2>
        <p><strong>Total Price:</strong> ₹{booking.totalCost.toLocaleString()}</p>
      </div>
      <div className="customer-details">
        <h3>Your Booking Details</h3>
        <p><strong>Name:</strong> {booking.name}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
        <p><strong>Pickup Date:</strong> {new Date(booking.pickupDate).toLocaleDateString()}</p>
        <p><strong>Return Date:</strong> {new Date(booking.returnDate).toLocaleDateString()}</p>
        <p><strong>Rental Days:</strong> {booking.rentalDays}</p>
        <p><strong>Color:</strong> {booking.color}</p>
        <p><strong>Comments:</strong> {booking.comments || 'None'}</p>
      </div>
      <div className="status-section">
        <h3>Booking Status</h3>
        <p>{booking.status}</p>
        <h3>Payment</h3>
        <p>Status: {booking.paymentStatus}</p>
        <p>Amount: ₹{booking.totalCost.toLocaleString()}</p>
      </div>
      <button className="go-home-btn" onClick={() => navigate('/home')}>
        Go Back to Home
      </button>
      <button className="go-home-btn" onClick={handleDownloadReceipt} style={{ marginTop: '1rem' }}>
        Download Booking Receipt
      </button>
    </div>
  );
};

export default BookingConfirmation;
