import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentGateway.css';

const UPI_ID = 'carrental@upi';
const BUSINESS_NAME = 'Car Rental Service';

const buildQrText = ({ upiId, payeeName, amount }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: 'INR'
  });
  return `upi://pay?${params.toString()}`;
};

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const bookingId = searchParams.get('bookingId');
  const bookingState = location.state?.booking;

  const [booking, setBooking] = useState(bookingState || null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [countdown, setCountdown] = useState(15 * 60);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const amount = booking?.totalCost || 0;
  const qrText = buildQrText({ upiId: UPI_ID, payeeName: BUSINESS_NAME, amount });
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrText)}`;

  useEffect(() => {
    if (!booking && bookingId) {
      fetch(`http://localhost:5000/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.booking) setBooking(data.booking);
          else setError(data.message || 'Booking not found');
        })
        .catch((err) => setError(err.message || 'Failed to fetch booking'));
    }
  }, [bookingId, booking]);

  useEffect(() => {
    if (!bookingId && !booking) {
      navigate('/cars');
    }
  }, [booking, bookingId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  const handleScreenshot = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Upload only image files');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be smaller than 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result);
      setScreenshotPreview(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setSuccessMessage('UPI ID copied to clipboard');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err) {
      setError('Unable to copy UPI ID');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!booking) return;
    if (!transactionId && paymentMethod !== 'COD') {
      setError('Enter your transaction ID for online payments.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const payload = {
      bookingId: booking._id,
      customerId: booking.userId || booking.email,
      amount: amount,
      paymentMethod,
      transactionId: paymentMethod === 'COD' ? '' : transactionId,
      screenshotBase64: paymentMethod === 'COD' ? '' : screenshotBase64,
      notes: paymentMethod === 'COD' ? 'Cash on Delivery selected' : 'UPI payment submitted'
    };

    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment submission failed');
      setSuccessMessage('Payment submitted successfully. Verification will be completed by admin.');
      setTimeout(() => setSuccessMessage(''), 5000);
      if (data.payment) {
        navigate(`/booking/${booking._id}`, { state: { paymentMessage: data.message } });
      }
    } catch (err) {
      setError(err.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  const bookingSummary = booking ? [
    { label: 'Car', value: booking.carName },
    { label: 'Rental Days', value: booking.rentalDays },
    { label: 'Price Per Day', value: formatCurrency(booking.pricePerDay) },
    { label: 'Total Amount', value: formatCurrency(booking.totalCost) },
    { label: 'Booking ID', value: booking._id }
  ] : [];

  return (
    <div className="payment-page">
      <div className="payment-shell">
        <div className="payment-header">
          <div>
            <h1>Secure Booking Payment</h1>
            <p>Complete payment for your booking before the timer expires.</p>
          </div>
          <div className="payment-timer">
            <span>Payment valid for</span>
            <strong>{minutes}:{seconds}</strong>
          </div>
        </div>

        <div className="payment-layout">
          <section className="payment-card booking-card">
            <h2>Booking Summary</h2>
            {booking ? (
              <div className="booking-summary-list">
                <div className="summary-image">
                  <img src={booking.carImage || '/images/default_car.jpg'} alt={booking.carName} />
                </div>
                <div className="summary-details">
                  {bookingSummary.map((item) => (
                    <div key={item.label} className="summary-row">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading booking details...</p>
            )}
          </section>

          <section className="payment-card qr-card">
            <h2>Pay with UPI</h2>
            <div className="qr-panel">
              <img className="qr-image" src={qrImageUrl} alt="Payment QR code" />
              <div className="qr-label">Scan to pay</div>
              <div className="upi-line">{BUSINESS_NAME}</div>
              <div className="upi-line large">{UPI_ID}</div>
              <button type="button" className="copy-button" onClick={copyUpiId}>Copy UPI ID</button>
            </div>
          </section>

          <section className="payment-card payment-method-card">
            <h2>Payment Options</h2>
            <div className="payment-methods">
              {['UPI', 'QR', 'COD'].map((option) => (
                <label key={option} className={`method-option ${paymentMethod === option ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option}
                    checked={paymentMethod === option}
                    onChange={() => setPaymentMethod(option)}
                  />
                  {option === 'COD' ? 'Cash on Delivery' : option === 'QR' ? 'QR Code Payment' : 'UPI Payment'}
                </label>
              ))}
            </div>

            <form className="payment-form" onSubmit={handleSubmit}>
              {paymentMethod !== 'COD' && (
                <>
                  <div className="form-group">
                    <label>Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter UPI transaction ID"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Screenshot</label>
                    <input type="file" accept="image/*" onChange={handleScreenshot} />
                    {screenshotPreview && <img className="preview-image" src={screenshotPreview} alt="Payment screenshot preview" />}
                  </div>
                </>
              )}

              <button type="submit" className="submit-button" disabled={loading || !booking}>
                {loading ? 'Submitting...' : 'Submit Payment'}
              </button>

              {successMessage && <div className="alert success">{successMessage}</div>}
              {error && <div className="alert error">{error}</div>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
