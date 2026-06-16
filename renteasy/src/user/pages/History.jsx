import React, { useEffect, useState } from 'react';
import '../styles/History.css';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      setError('User email not found in localStorage');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/email/${userEmail}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');

      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading booking history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="history-container">
      <h1>Booking History</h1>
      {bookings.length === 0 ? (
        <p>No past bookings found.</p>
      ) : (
        <div className="history-list">
          {bookings.map((booking) => {
            const downloadReceipt = () => {
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
              <div key={booking._id} className="history-card">
                <h3>{booking.name}</h3>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Car:</strong> {booking.carName || booking.car}</p>
                <p><strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}</p>
                <p><strong>Return:</strong> {new Date(booking.returnDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
                <p><strong>Payment Status:</strong> <span className={`status ${booking.paymentStatus.toLowerCase().replace(/\s/g, '-')}`}>{booking.paymentStatus}</span></p>
                <p><strong>Total:</strong> ₹{booking.totalCost.toLocaleString()}</p>
                <button className="receipt-button" onClick={downloadReceipt}>Download Receipt</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
