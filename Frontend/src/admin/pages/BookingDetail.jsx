import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { bookingsApi } from '../../services/api';
import { FiArrowLeft, FiPrinter, FiUser, FiCalendar, FiDollarSign, FiShield } from 'react-icons/fi';
import '../styles/AllBookings.css';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingsApi.getById(bookingId);
        setBooking(res.booking);
      } catch (err) {
        setError('Booking not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="p-4 text-muted font-mono">Loading booking details...</div>;
  if (error || !booking) return <div className="p-4 text-coral">{error || 'Not found'}</div>;

  const isPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'Paid';

  return (
    <div className="admin-booking-detail-page">
      <NavLink to="/admin/bookings" className="btn btn-outline btn-sm mb-3">
        <FiArrowLeft /> Back to All Bookings
      </NavLink>

      <div className="card-light p-4 max-w-700" style={{ padding: '2.5rem', borderRadius: '18px', maxWidth: '700px' }}>
        <div className="flex-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="font-mono text-xl font-bold">Booking #{booking.bookingRef || booking._id}</h2>
          <span className={`badge badge-${(booking.status || 'pending').toLowerCase()}`}>
            {booking.status}
          </span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.25rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
          <div><strong>Vehicle:</strong> {booking.car}</div>
          <div><strong>Customer:</strong> {booking.name} ({booking.email}, {booking.phone})</div>
          <div><strong>Dates:</strong> {new Date(booking.pickupDate || booking.date).toLocaleDateString()} to {new Date(booking.returnDate || booking.date).toLocaleDateString()}</div>
          <div><strong>Total Cost:</strong> <span className="font-mono font-bold text-coral">₹{Number(booking.totalCost || 0).toLocaleString()}</span></div>
          <div><strong>Payment Status:</strong> <span className={`badge badge-${isPaid ? 'paid' : 'pending'}`}>{isPaid ? 'Paid' : 'Pending'}</span></div>
          {booking.razorpayPaymentId && <div><strong>Razorpay ID:</strong> <code className="font-mono">{booking.razorpayPaymentId}</code></div>}
        </div>

        <button onClick={() => window.print()} className="btn btn-outline mt-4" style={{ marginTop: '1.5rem' }}>
          <FiPrinter /> Print Official Voucher
        </button>
      </div>
    </div>
  );
}
