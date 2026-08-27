import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { bookingsApi, paymentsApi } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiShield, 
  FiLock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiCalendar, 
  FiClock, 
  FiArrowRight, 
  FiUser, 
  FiFileText, 
  FiRefreshCw, 
  FiArrowLeft,
  FiCreditCard,
  FiInfo
} from 'react-icons/fi';
import '../styles/PaymentCheckout.css';

// Helper to dynamically load the official Razorpay Checkout SDK
const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentCheckout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch Booking Details
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await bookingsApi.getById(bookingId);
        setBooking(res.booking);
      } catch (err) {
        console.error('Error fetching booking for checkout:', err);
        setError(err.message || 'Could not find booking reservation details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // Handle Razorpay Checkout Modal
  const handleInitiatePayment = async () => {
    setPaymentError('');
    setPaymentProcessing(true);

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Request backend to create Razorpay Order
      const orderRes = await paymentsApi.createOrder(booking._id || bookingId);
      
      const keyId = orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TUj9UkimkaJNMH';

      // 3. Configure Razorpay Checkout options
      const options = {
        key: keyId,
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'Rentaro Mobility',
        description: `Rental Reservation - ${booking.car} (${orderRes.bookingRef || booking.bookingRef})`,
        image: '/logo.png',
        order_id: orderRes.orderId,
        prefill: {
          name: booking.name || user?.name || '',
          email: booking.email || user?.email || '',
          contact: booking.phone || user?.phone || '',
        },
        theme: {
          color: '#E85D6A',
          backdrop_color: 'rgba(37, 37, 43, 0.75)'
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
            setPaymentError('Payment window was closed before completion. You can retry anytime.');
          }
        },
        handler: async function (response) {
          // 4. Send payment signature to backend for verification
          setPaymentProcessing(true);
          try {
            const verificationPayload = {
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await paymentsApi.verifyPayment(verificationPayload);

            setPaymentSuccess(true);
            setPaymentProcessing(false);

            // Redirect to confirmation page with receipt
            setTimeout(() => {
              navigate(`/booking/${booking._id || booking.bookingRef}`, {
                state: {
                  booking: verifyRes.booking,
                  paymentVerified: true
                }
              });
            }, 1200);
          } catch (verErr) {
            console.error('Signature verification error:', verErr);
            setPaymentProcessing(false);
            setPaymentError(verErr.message || 'Payment signature verification failed. Please contact support.');
          }
        }
      };

      // 5. Open Razorpay Modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (failRes) {
        console.error('Razorpay payment failure:', failRes.error);
        setPaymentProcessing(false);
        setPaymentError(`Payment failed: ${failRes.error.description || 'Transaction was declined.'}`);
      });

      paymentObject.open();
    } catch (err) {
      console.error('Payment initialization error:', err);
      setPaymentProcessing(false);
      setPaymentError(err.message || 'Failed to start secure payment gateway.');
    }
  };

  // Instant Sandbox Simulation Payment
  const handleSimulatedPayment = async () => {
    setPaymentError('');
    setPaymentProcessing(true);

    try {
      const orderRes = await paymentsApi.createOrder(booking._id || bookingId);
      const mockPayId = `pay_sim_${Date.now().toString(36).toUpperCase()}`;
      const mockSignature = `sandbox_sim_${Date.now()}_${mockPayId}`;

      const verifyRes = await paymentsApi.verifyPayment({
        bookingId: booking._id,
        razorpay_order_id: orderRes.orderId,
        razorpay_payment_id: mockPayId,
        razorpay_signature: mockSignature,
      });

      setPaymentSuccess(true);
      setPaymentProcessing(false);

      setTimeout(() => {
        navigate(`/booking/${booking._id || booking.bookingRef}`, {
          state: {
            booking: verifyRes.booking,
            paymentVerified: true
          }
        });
      }, 1000);
    } catch (simErr) {
      console.error('Simulation payment error:', simErr);
      setPaymentProcessing(false);
      setPaymentError(simErr.message || 'Payment simulation failed.');
    }
  };

  if (loading) {
    return (
      <div className="checkout-page-wrapper page-wrapper">
        <div className="container-custom">
          <div className="skeleton" style={{ height: '450px', maxWidth: '800px', margin: '3rem auto', borderRadius: '18px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="checkout-page-wrapper page-wrapper">
        <div className="container-custom text-center py-5">
          <h2 className="section-title mb-2">Reservation Not Found</h2>
          <p className="text-muted mb-4">{error || 'Could not find booking record.'}</p>
          <NavLink to="/cars" className="btn btn-primary">
            Explore Vehicles
          </NavLink>
        </div>
      </div>
    );
  }

  const isAlreadyPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'Paid';
  const isCancelled = booking.status === 'Cancelled';
  const carImg = booking.carDetails?.image || '/swift.jpg';
  const pickup = new Date(booking.pickupDate || booking.date);
  const dropoff = new Date(booking.returnDate || new Date(pickup.getTime() + 24 * 60 * 60 * 1000));

  return (
    <div className="checkout-page-wrapper page-wrapper">
      {/* Verification / Loading Overlay */}
      {paymentProcessing && (
        <div className="payment-processing-overlay">
          <div className="processing-card card-light">
            <div className="processing-spinner"></div>
            <h3 className="processing-title">Connecting to Secure Gateway</h3>
            <p className="processing-desc">Please complete your payment in the Razorpay window. Do not refresh or close this page.</p>
          </div>
        </div>
      )}

      <div className="container-custom">
        <div className="checkout-container-box">
          {/* Header Bar */}
          <div className="checkout-top-bar">
            <NavLink to="/bookings" className="btn btn-outline btn-sm">
              <FiArrowLeft /> My Bookings
            </NavLink>
            <div className="secure-badge">
              <FiShield className="text-green" /> 256-bit Encrypted Checkout
            </div>
          </div>

          <div className="checkout-layout-grid">
            {/* Left Column: Vehicle & Booking Breakdown */}
            <div className="checkout-summary-col">
              <div className="summary-panel card-light">
                <div className="panel-badge-row">
                  <span className="badge-ref font-mono">{booking.bookingRef || `REF-${booking._id.slice(-6).toUpperCase()}`}</span>
                  <span className={`badge badge-${(booking.paymentStatus || 'pending').toLowerCase()}`}>
                    {isAlreadyPaid ? '● Payment Verified' : '● Awaiting Payment'}
                  </span>
                </div>

                <div className="checkout-car-preview">
                  <img 
                    src={carImg} 
                    alt={booking.car} 
                    className="checkout-car-img" 
                    onError={(e) => { e.target.src = '/swift.jpg'; }}
                  />
                  <div className="checkout-car-meta">
                    <span className="car-cat-badge">{booking.carDetails?.category || 'Sedan'}</span>
                    <h2 className="checkout-car-name">{booking.car}</h2>
                    <p className="checkout-driver-name"><FiUser /> Driver: <b>{booking.name}</b></p>
                  </div>
                </div>

                {/* Dates & Schedule */}
                <div className="schedule-detail-box">
                  <div className="schedule-row">
                    <div>
                      <span className="schedule-k"><FiCalendar /> Pick-up Date</span>
                      <strong className="schedule-v">{pickup.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                    <div className="schedule-divider">➝</div>
                    <div>
                      <span className="schedule-k"><FiCalendar /> Return Date</span>
                      <strong className="schedule-v">{dropoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                  </div>
                  <div className="schedule-duration-pill">
                    <FiClock /> Duration: <b>{booking.days || 1} {booking.days === 1 ? 'Day' : 'Days'}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Breakdown & Payment CTA */}
            <div className="checkout-payment-col">
              <div className="payment-panel card-light">
                <h3 className="payment-panel-title"><FiFileText /> Payment Summary</h3>
                <p className="payment-panel-sub">Review order details and pay in Indian Rupees (₹).</p>

                {paymentError && (
                  <div className="checkout-alert-error">
                    <FiAlertTriangle className="flex-shrink-0" />
                    <div>
                      <strong>Payment Unsuccessful</strong>
                      <p>{paymentError}</p>
                    </div>
                  </div>
                )}

                {paymentSuccess && (
                  <div className="checkout-alert-success">
                    <FiCheckCircle className="flex-shrink-0" />
                    <div>
                      <strong>Payment Verified!</strong>
                      <p>Your reservation is now confirmed. Redirecting to receipt...</p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="cost-breakdown-list">
                  <div className="cost-row">
                    <span>Rental Rate ({booking.days || 1} {booking.days === 1 ? 'day' : 'days'})</span>
                    <span>₹{(booking.dailyRate ? booking.dailyRate * (booking.days || 1) : Math.round(booking.totalCost * 0.95)).toLocaleString()}</span>
                  </div>

                  <div className="cost-row">
                    <span>GST & Platform Taxes (5%)</span>
                    <span>₹{(booking.taxAmount || Math.round(booking.totalCost * 0.05)).toLocaleString()}</span>
                  </div>

                  <div className="cost-row total-cost-row">
                    <span>Total Payable Amount</span>
                    <span className="cost-total-number">₹{Number(booking.totalCost || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Action Buttons */}
                <div className="payment-actions-wrap">
                  {isAlreadyPaid ? (
                    <div className="already-paid-box">
                      <FiCheckCircle className="text-green" size={28} />
                      <div>
                        <strong>This booking is already paid!</strong>
                        <p className="text-xs text-muted">Payment ID: {booking.razorpayPaymentId || 'Verified'}</p>
                      </div>
                      <NavLink to={`/booking/${booking._id || booking.bookingRef}`} className="btn btn-primary w-full mt-3">
                        View Confirmation Receipt
                      </NavLink>
                    </div>
                  ) : isCancelled ? (
                    <div className="cancelled-booking-box">
                      <FiAlertTriangle className="text-danger" size={28} />
                      <p>This reservation has been cancelled and cannot be paid.</p>
                      <NavLink to="/cars" className="btn btn-outline w-full mt-2">
                        Book Another Vehicle
                      </NavLink>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleInitiatePayment}
                        disabled={paymentProcessing}
                        className="btn btn-primary w-full pay-now-btn"
                      >
                        <FiLock /> {paymentProcessing ? 'Opening Gateway...' : `Pay via Razorpay • ₹${Number(booking.totalCost || 0).toLocaleString()}`}
                      </button>

                      <button 
                        onClick={handleSimulatedPayment}
                        disabled={paymentProcessing}
                        className="btn btn-outline w-full mt-2 pay-sandbox-btn"
                        title="Instant local sandbox simulated payment"
                      >
                        ⚡ Instant Sandbox Test Pay (Simulation)
                      </button>

                      {paymentError && (
                        <button 
                          onClick={handleInitiatePayment}
                          className="btn btn-outline w-full mt-2"
                        >
                          <FiRefreshCw /> Retry Razorpay
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Security Trust Badges */}
                <div className="payment-trust-footer">
                  <div className="trust-item"><FiShield /> Razorpay Certified Gateway</div>
                  <div className="trust-item"><FiCreditCard /> UPI, Cards, NetBanking, Wallets</div>
                  <div className="trust-item"><FiLock /> Zero Card Details Stored Locally</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
