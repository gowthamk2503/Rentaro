import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { bookingsApi } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiMapPin, 
  FiXCircle, 
  FiCheckCircle, 
  FiArrowRight, 
  FiInfo, 
  FiX, 
  FiPrinter,
  FiCreditCard,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/Bookings.css';

export default function Bookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (user?.email) {
        data = await bookingsApi.getByEmail(user.email);
      } else {
        data = await bookingsApi.getMyBookings();
      }
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.email]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(bookingId);
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b)
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: 'Cancelled' }));
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter(b => {
    const now = new Date();
    const pickup = new Date(b.pickupDate || b.date);
    const dropoff = new Date(b.returnDate || new Date(pickup.getTime() + 24 * 60 * 60 * 1000));
    const status = b.status?.toLowerCase();
    const payStatus = b.paymentStatus?.toLowerCase();

    if (activeTab === 'all') return true;
    if (activeTab === 'pending_payment') {
      return (payStatus === 'pending' || payStatus === 'failed') && status !== 'cancelled';
    }
    if (activeTab === 'active') {
      return (status === 'active' || (status === 'confirmed' && now >= pickup && now <= dropoff && payStatus === 'paid'));
    }
    if (activeTab === 'upcoming') {
      return (status === 'confirmed' || status === 'pending') && now < pickup && payStatus === 'paid';
    }
    if (activeTab === 'completed') {
      return status === 'completed' || status === 'successful' || (now > dropoff && status !== 'cancelled' && payStatus === 'paid');
    }
    if (activeTab === 'cancelled') {
      return status === 'cancelled';
    }
    return true;
  });

  return (
    <div className="bookings-page-wrapper page-wrapper">
      <div className="container-custom">
        {/* Page Header */}
        <div className="bookings-header-row">
          <div>
            <span className="section-tag">TRIP MANAGEMENT</span>
            <h1 className="section-title">My Bookings & Reservations</h1>
            <p className="section-subtitle">
              Track active rentals, inspect payment receipts, and manage upcoming schedules.
            </p>
          </div>

          <button onClick={fetchBookings} className="btn btn-outline btn-sm">
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Tab Filters */}
        <div className="bookings-tabs-bar">
          {[
            { id: 'all', label: 'All Trips', count: bookings.length },
            { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => (b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending') && b.paymentStatus?.toLowerCase() === 'paid' && new Date() < new Date(b.pickupDate || b.date)).length },
            { id: 'active', label: 'Active', count: bookings.filter(b => b.status?.toLowerCase() === 'active').length },
            { id: 'pending_payment', label: 'Pending Payment', count: bookings.filter(b => b.paymentStatus?.toLowerCase() === 'pending' && b.status?.toLowerCase() !== 'cancelled').length },
            { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status?.toLowerCase() === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`booking-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label} {tab.count > 0 && <span className="tab-badge-num">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="bookings-cards-list">
            {[1, 2, 3].map(n => (
              <div key={n} className="skeleton" style={{ height: '160px', borderRadius: '18px', marginBottom: '1.5rem' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="empty-state-box card-light">
            <FiInfo className="text-coral" size={36} />
            <h3>Unable to Load Bookings</h3>
            <p>{error}</p>
            <button onClick={fetchBookings} className="btn btn-primary mt-3">
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state-box card-light">
            <div className="empty-state-icon-box">🚗</div>
            <h3>No Bookings Found</h3>
            <p>You have no reservations matching this filter.</p>
            <NavLink to="/cars" className="btn btn-primary mt-3">
              Explore Vehicle Fleet <FiArrowRight />
            </NavLink>
          </div>
        ) : (
          <div className="bookings-cards-list">
            {filteredBookings.map(booking => {
              const isPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'Paid';
              const isCancelled = booking.status === 'Cancelled';
              const pickup = new Date(booking.pickupDate || booking.date);
              const dropoff = new Date(booking.returnDate || new Date(pickup.getTime() + 24 * 60 * 60 * 1000));
              const carImg = booking.carDetails?.image || '/swift.jpg';

              return (
                <div key={booking._id} className="booking-item-card card-light">
                  {/* Vehicle Thumbnail */}
                  <div className="booking-card-media">
                    <img 
                      src={carImg} 
                      alt={booking.car} 
                      className="booking-car-thumb"
                      onError={(e) => { e.target.src = '/swift.jpg'; }}
                    />
                    <span className="booking-cat-tag">{booking.carDetails?.category || 'Fleet'}</span>
                  </div>

                  {/* Booking Main Info */}
                  <div className="booking-card-info">
                    <div className="booking-card-top">
                      <div>
                        <span className="booking-ref-code font-mono">{booking.bookingRef || `REF-${booking._id.slice(-6).toUpperCase()}`}</span>
                        <h3 className="booking-car-name">{booking.car}</h3>
                      </div>
                      <div className="booking-status-badges">
                        <span className={`badge badge-${(booking.status || 'pending').toLowerCase()}`}>
                          ● {booking.status || 'Pending'}
                        </span>
                        <span className={`badge badge-${isPaid ? 'paid' : 'pending'}`}>
                          {isPaid ? 'Paid' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="booking-dates-row">
                      <div className="date-item">
                        <FiCalendar className="text-coral" />
                        <span>Pick-up: <b>{pickup.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</b></span>
                      </div>
                      <div className="date-item">
                        <FiCalendar className="text-coral" />
                        <span>Return: <b>{dropoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</b></span>
                      </div>
                      <div className="date-item">
                        <FiClock className="text-muted" />
                        <span>Duration: <b>{booking.days || 1} {booking.days === 1 ? 'Day' : 'Days'}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Actions */}
                  <div className="booking-card-actions">
                    <div className="booking-price-pill">
                      <span className="price-tag-sub">Total Cost</span>
                      <strong className="price-tag-amount font-mono">₹{Number(booking.totalCost || 0).toLocaleString()}</strong>
                    </div>

                    <div className="action-buttons-wrap">
                      {!isPaid && !isCancelled && (
                        <NavLink to={`/booking/${booking._id || booking.bookingRef}/pay`} className="btn btn-primary btn-sm">
                          <FiCreditCard /> Pay Now
                        </NavLink>
                      )}

                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </button>

                      {!isCancelled && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="btn btn-danger btn-sm"
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal Drawer */}
        {selectedBooking && (
          <div className="booking-modal-backdrop" onClick={() => setSelectedBooking(null)}>
            <div className="booking-modal-card card-light" onClick={e => e.stopPropagation()}>
              <div className="modal-header-row">
                <div className="flex-center gap-2">
                  <FiFileText className="text-coral" size={22} />
                  <h3 className="modal-title font-mono">Booking Information</h3>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="modal-close-btn">
                  <FiX size={20} />
                </button>
              </div>

              <div className="modal-body-content">
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <span className="modal-k">Booking Reference:</span>
                    <strong className="modal-v font-mono text-coral">{selectedBooking.bookingRef || selectedBooking._id}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Vehicle:</span>
                    <strong className="modal-v">{selectedBooking.car}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Driver:</span>
                    <strong className="modal-v">{selectedBooking.name}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Email:</span>
                    <strong className="modal-v">{selectedBooking.email}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Phone:</span>
                    <strong className="modal-v">{selectedBooking.phone || 'N/A'}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Color Selected:</span>
                    <strong className="modal-v">{selectedBooking.color || 'Standard'}</strong>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Rental Status:</span>
                    <span className={`badge badge-${(selectedBooking.status || 'pending').toLowerCase()}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-k">Payment Status:</span>
                    <span className={`badge badge-${(selectedBooking.paymentStatus || 'pending').toLowerCase()}`}>
                      {selectedBooking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  {selectedBooking.razorpayPaymentId && (
                    <div className="modal-info-item">
                      <span className="modal-k">Payment ID:</span>
                      <strong className="modal-v font-mono text-xs">{selectedBooking.razorpayPaymentId}</strong>
                    </div>
                  )}
                  <div className="modal-info-item">
                    <span className="modal-k">Total Amount:</span>
                    <strong className="modal-v font-mono text-coral font-bold">₹{Number(selectedBooking.totalCost || 0).toLocaleString()}</strong>
                  </div>
                </div>

                {selectedBooking.comments && (
                  <div className="modal-comments-box">
                    <span className="modal-k">Special Instructions:</span>
                    <p className="modal-comments-text">{selectedBooking.comments}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer-actions">
                <NavLink 
                  to={`/booking/${selectedBooking._id || selectedBooking.bookingRef}`}
                  className="btn btn-outline btn-sm"
                >
                  <FiPrinter /> Official Voucher
                </NavLink>
                {selectedBooking.paymentStatus !== 'paid' && selectedBooking.status !== 'Cancelled' && (
                  <NavLink 
                    to={`/booking/${selectedBooking._id || selectedBooking.bookingRef}/pay`}
                    className="btn btn-primary btn-sm"
                  >
                    <FiCreditCard /> Pay Now
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}