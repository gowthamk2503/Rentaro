import React, { useEffect, useState } from 'react';
import '../styles/AllBookings.css';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");

      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      // Update local state to reflect change
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Successful" } : b))
      );

      alert("Booking status updated to 'Successful'");
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status");
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="all-bookings">
      <h1>All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="booking-card"
              onClick={() => updateBookingStatus(booking._id)}
              style={{ cursor: 'pointer' }}
              title="Click to update status"
            >
              <h3>{booking.name}</h3>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Car:</strong> {booking.car}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Total:</strong> ₹{booking.totalCost.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
