import React, { useEffect, useState } from 'react';
import { bookingsApi } from '../../services/api';
import { 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiTrash2, 
  FiCheckCircle, 
  FiClock, 
  FiX, 
  FiPrinter, 
  FiDollarSign, 
  FiUser, 
  FiPhone, 
  FiMail,
  FiShield,
  FiCreditCard,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/AllBookings.css';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingsApi.getAll();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      setError('Failed to retrieve bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await bookingsApi.updateStatus(bookingId, newStatus);
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await bookingsApi.delete(bookingId);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      alert('Failed to delete booking: ' + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.name && b.name.toLowerCase().includes(term)) ||
      (b.email && b.email.toLowerCase().includes(term)) ||
      (b.car && b.car.toLowerCase().includes(term)) ||
      (b.bookingRef && b.bookingRef.toLowerCase().includes(term)) ||
      (b.razorpayPaymentId && b.razorpayPaymentId.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'All' || b.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPaymentStatus = paymentStatusFilter === 'All' || b.paymentStatus?.toLowerCase() === paymentStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <div className="admin-bookings-page">
      {/* Header */}
      <div className="bookings-header-row">
        <div>
          <span className="section-tag">RESERVATION MANAGEMENT</span>
          <h1 className="bookings-page-title font-mono">Trip Reservations & Vouchers</h1>
          <p className="bookings-page-subtitle">Track payments, update trip lifecycles, and issue vouchers.</p>
        </div>

        <button onClick={fetchBookings} className="btn btn-outline btn-sm">
          <FiRefreshCw /> Refresh Data
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bookings-filter-bar card-light">
        <div className="bookings-search-box">
          <FiSearch className="search-icon-prefix text-coral" />
          <input 
            type="text"
            placeholder="Search REF, customer name, email, car, payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bookings-search-input"
          />
        </div>

        <div className="bookings-filter-selects">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bookings-filter-select"
          >
            <option value="All">All Trip Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active (On Road)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={paymentStatusFilter} 
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="bookings-filter-select"
          >
            <option value="All">All Payment States</option>
            <option value="paid">Paid (Verified)</option>
            <option value="pending">Pending Payment</option>
            <option value="failed">Failed / Refunded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-card card-light">
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Booking REF</th>
                <th>Vehicle</th>
                <th>Driver / Customer</th>
                <th>Trip Schedule</th>
                <th>Total Cost</th>
                <th>Payment</th>
                <th>Trip Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="skeleton" style={{ height: '30px', width: '300px', margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-coral">{error}</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">No reservations matching query.</td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isPaid = b.paymentStatus === 'paid' || b.paymentStatus === 'Paid';
                  const pickup = new Date(b.pickupDate || b.date);
                  const dropoff = new Date(b.returnDate || new Date(pickup.getTime() + 24 * 60 * 60 * 1000));

                  return (
                    <tr key={b._id}>
                      <td className="font-mono text-xs font-bold text-coral">
                        {b.bookingRef || `REF-${b._id.slice(-6).toUpperCase()}`}
                      </td>
                      <td>
                        <strong className="car-booking-name">{b.car}</strong>
                        <span className="car-booking-color text-xs text-muted">Color: {b.color || 'Standard'}</span>
                      </td>
                      <td>
                        <strong className="driver-name-text">{b.name}</strong>
                        <span className="driver-email-text text-xs text-muted">{b.email}</span>
                      </td>
                      <td>
                        <span className="date-range-text text-xs">
                          {pickup.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ➝ {dropoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="duration-text text-xs text-muted block">({b.days || 1} days)</span>
                      </td>
                      <td className="font-mono font-bold text-coral">
                        ₹{Number(b.totalCost || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge badge-${isPaid ? 'paid' : 'pending'}`}>
                          {isPaid ? '● Paid' : '● Pending'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={b.status || 'Pending'}
                          disabled={updatingId === b._id}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className="admin-inline-select font-mono"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-actions-group">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="btn-icon-action view-btn"
                            title="Inspect details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b._id)}
                            className="btn-icon-action delete-btn"
                            title="Delete booking"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Drawer Inspection Modal */}
      {selectedBooking && (
        <div className="booking-modal-backdrop" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal-card card-light" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex-center gap-2">
                <FiCalendar className="text-coral" size={22} />
                <h3 className="modal-title font-mono">Reservation Details</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="modal-close-btn">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-k">Reference Code:</span>
                  <strong className="modal-v font-mono text-coral font-bold">{selectedBooking.bookingRef || selectedBooking._id}</strong>
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
                  <span className="modal-k">Driver Email:</span>
                  <strong className="modal-v">{selectedBooking.email}</strong>
                </div>
                <div className="modal-info-item">
                  <span className="modal-k">Phone:</span>
                  <strong className="modal-v">{selectedBooking.phone || 'N/A'}</strong>
                </div>
                <div className="modal-info-item">
                  <span className="modal-k">Rental Duration:</span>
                  <strong className="modal-v">{selectedBooking.days || 1} Days</strong>
                </div>
                <div className="modal-info-item">
                  <span className="modal-k">Status:</span>
                  <span className={`badge badge-${(selectedBooking.status || 'pending').toLowerCase()}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-k">Payment:</span>
                  <span className={`badge badge-${selectedBooking.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                    {selectedBooking.paymentStatus || 'Pending'}
                  </span>
                </div>
                {selectedBooking.razorpayPaymentId && (
                  <div className="modal-info-item">
                    <span className="modal-k">Razorpay Payment ID:</span>
                    <strong className="modal-v font-mono text-xs">{selectedBooking.razorpayPaymentId}</strong>
                  </div>
                )}
                <div className="modal-info-item">
                  <span className="modal-k">Total Charged:</span>
                  <strong className="modal-v font-mono text-coral font-bold">₹{Number(selectedBooking.totalCost || 0).toLocaleString()}</strong>
                </div>
              </div>

              {selectedBooking.comments && (
                <div className="modal-comments-box">
                  <span className="modal-k">Customer Special Notes:</span>
                  <p className="modal-comments-text">{selectedBooking.comments}</p>
                </div>
              )}
            </div>

            <div className="modal-footer-actions">
              <button onClick={() => window.print()} className="btn btn-outline btn-sm">
                <FiPrinter /> Print Voucher
              </button>
              <button onClick={() => setSelectedBooking(null)} className="btn btn-primary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
