import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { bookingsApi } from '../../services/api';
import { 
  FiCheckCircle, 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiPrinter, 
  FiArrowRight, 
  FiFileText, 
  FiShield, 
  FiUser, 
  FiPhone, 
  FiMail,
  FiCreditCard,
  FiAlertTriangle
} from 'react-icons/fi';
import '../styles/BookingConfirmation.css';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState('');

  const passedImage = location.state?.carImage;
  const isPaymentVerified = location.state?.paymentVerified;

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await bookingsApi.getById(bookingId);
        setBooking(res.booking);
      } catch (err) {
        console.error('Error fetching booking confirmation:', err);
        setError('Could not retrieve booking details. Please visit My Bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingData();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="confirmation-page-wrapper page-wrapper">
        <div className="container-custom">
          <div className="skeleton" style={{ height: '450px', maxWidth: '800px', margin: '3rem auto', borderRadius: '18px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="confirmation-page-wrapper page-wrapper">
        <div className="container-custom text-center py-5">
          <h2 className="section-title mb-2">Booking Not Found</h2>
          <p className="text-muted mb-4">{error || 'Booking reference could not be found.'}</p>
          <NavLink to="/bookings" className="btn btn-primary">
            View My Bookings
          </NavLink>
        </div>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'Paid';
  const carImage = passedImage || booking.carDetails?.image || '/swift.jpg';
  const pickup = new Date(booking.pickupDate || booking.date);
  const dropoff = new Date(booking.returnDate || new Date(pickup.getTime() + 24 * 60 * 60 * 1000));

  return (
    <div className="confirmation-page-wrapper page-wrapper">
      <div className="container-custom">
        <div className="confirmation-card-box card-light">
          {/* Header Banner */}
          <div className="confirmation-header-banner">
            <div className={`check-success-glow ${!isPaid ? 'pending-glow' : ''}`}>
              {isPaid ? <FiCheckCircle /> : <FiClock />}
            </div>
            <h1 className="confirmation-headline">
              {isPaid ? 'Reservation Confirmed & Paid!' : 'Reservation Initiated'}
            </h1>
            <p className="confirmation-subtext">
              {isPaid 
                ? `Your vehicle reservation is confirmed with verified payment. A formal tax receipt and trip schedule has been recorded for ${booking.email}.`
                : `Your reservation request is recorded. Please finalize payment to secure your vehicle allocation.`
              }
            </p>
            <div className="reference-pill">
              <span>BOOKING REFERENCE:</span>
              <strong className="ref-number font-mono">{booking.bookingRef || `REF-${booking._id.slice(-6).toUpperCase()}`}</strong>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Core Booking & Vehicle Details */}
          <div className="confirmation-body-grid">
            {/* Left: Car Summary Card */}
            <div className="receipt-car-card">
              <img 
                src={carImage} 
                alt={booking.car} 
                className="receipt-car-photo"
                onError={(e) => { e.target.src = '/swift.jpg'; }}
              />
              <div className="receipt-car-meta">
                <span className="car-cat-badge">{booking.carDetails?.category || 'Fleet Vehicle'}</span>
                <h2 className="receipt-car-title">{booking.car}</h2>
                <div className="receipt-status-pill">
                  <span className={`badge badge-${isPaid ? 'paid' : 'pending'}`}>
                    {isPaid ? '● Payment Verified' : '● Awaiting Payment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Itinerary Schedule & Driver Details */}
            <div className="receipt-itinerary-card">
              <div className="receipt-info-block">
                <h3 className="receipt-block-title"><FiCalendar className="text-coral" /> Schedule & Dates</h3>
                <div className="schedule-meta-grid">
                  <div>
                    <span className="info-k">Pick-up Date</span>
                    <strong className="info-v">{pickup.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </div>
                  <div>
                    <span className="info-k">Return Date</span>
                    <strong className="info-v">{dropoff.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </div>
                </div>
                <div className="duration-tag font-mono">
                  <FiClock /> Rental Duration: <b>{booking.days || 1} {booking.days === 1 ? 'Day' : 'Days'}</b>
                </div>
              </div>

              <div className="receipt-info-block">
                <h3 className="receipt-block-title"><FiUser className="text-coral" /> Driver Details</h3>
                <div className="schedule-meta-grid">
                  <div>
                    <span className="info-k">Full Name</span>
                    <strong className="info-v">{booking.name}</strong>
                  </div>
                  <div>
                    <span className="info-k">Phone</span>
                    <strong className="info-v">{booking.phone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="info-k">Email</span>
                    <strong className="info-v">{booking.email}</strong>
                  </div>
                  <div>
                    <span className="info-k">Color Preference</span>
                    <strong className="info-v">{booking.color || 'Standard'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Financial Breakdown & Razorpay Audit */}
          <div className="receipt-financial-row">
            <div className="payment-breakdown-details">
              <div className="cost-line">
                <span>Rental Daily Rate:</span>
                <span>₹{(booking.dailyRate ? booking.dailyRate * (booking.days || 1) : Math.round(booking.totalCost * 0.95)).toLocaleString()}</span>
              </div>
              <div className="cost-line">
                <span>GST & Platform Taxes (5%):</span>
                <span>₹{(booking.taxAmount || Math.round(booking.totalCost * 0.05)).toLocaleString()}</span>
              </div>
              <div className="cost-line total-highlight">
                <strong>Total Amount Paid:</strong>
                <strong className="total-val font-mono">₹{Number(booking.totalCost || 0).toLocaleString()}</strong>
              </div>
            </div>

            <div className="razorpay-audit-box">
              <div className="audit-header font-mono">
                <FiShield className="text-green" /> Verified Transaction
              </div>
              {booking.razorpayPaymentId && (
                <div className="audit-line">
                  <span className="info-k">Payment ID:</span>
                  <span className="info-v font-mono text-xs">{booking.razorpayPaymentId}</span>
                </div>
              )}
              {booking.razorpayOrderId && (
                <div className="audit-line">
                  <span className="info-k">Order ID:</span>
                  <span className="info-v font-mono text-xs">{booking.razorpayOrderId}</span>
                </div>
              )}
              <div className="audit-line">
                <span className="info-k">Security Audit:</span>
                <span className="info-v text-xs text-green font-mono">● 256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="receipt-action-bar">
            <div className="action-buttons-left">
              <button onClick={handlePrint} className="btn btn-outline">
                <FiPrinter /> Print / Save PDF
              </button>
            </div>

            <div className="action-buttons-right">
              {!isPaid && (
                <NavLink to={`/booking/${booking._id || booking.bookingRef}/pay`} className="btn btn-primary">
                  <FiCreditCard /> Complete Payment Now
                </NavLink>
              )}
              <NavLink to="/bookings" className="btn btn-secondary">
                My Bookings Dashboard <FiArrowRight />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
