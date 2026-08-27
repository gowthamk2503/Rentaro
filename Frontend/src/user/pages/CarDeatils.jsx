import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { carsApi, bookingsApi } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiCalendar, 
  FiClock, 
  FiShield, 
  FiStar, 
  FiZap, 
  FiTruck, 
  FiInfo, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiLock,
  FiArrowRight,
  FiDroplet,
  FiUsers,
  FiPackage,
  FiActivity
} from 'react-icons/fi';
import '../styles/CarDetails.css';

export default function CarDetails() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState(null);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Card State
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [selectedColor, setSelectedColor] = useState('');
  const [comments, setComments] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Prefill customer info from auth
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Load car details from MongoDB
  useEffect(() => {
    const loadCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const carData = await carsApi.getById(carId);
        setCar(carData);
        if (carData.colors && carData.colors.length > 0) {
          setSelectedColor(carData.colors[0]);
        }

        // Fetch related cars in same category
        const allCars = await carsApi.getAll({ category: carData.category });
        const list = Array.isArray(allCars) ? allCars : allCars.cars || [];
        setRecommendedCars(list.filter(c => c._id !== carData._id).slice(0, 3));
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Vehicle details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    loadCar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [carId]);

  // Live Price Calculation
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.max(0, end - start);
  const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyPrice = car ? car.pricePerDay : 4500;
  const subtotal = dailyPrice * rentalDays;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const estimatedTotal = subtotal + taxAmount;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setBookingError('Please enter your full name, email, and phone number.');
      return;
    }

    setSubmittingBooking(true);
    try {
      const payload = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        pickupDate,
        returnDate,
        color: selectedColor || 'Standard',
        comments,
        car: `${car.make} ${car.model}`,
        carId: car._id,
        userId: user?._id || user?.id,
      };

      const res = await bookingsApi.create(payload);
      const booking = res.booking;

      // Navigate directly to Payment Checkout
      navigate(`/booking/${booking._id || booking.bookingRef}/pay`, {
        state: {
          booking,
          carImage: car.image || (car.images && car.images[0]) || '/swift.jpg',
        }
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      setBookingError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="car-details-page page-wrapper">
        <div className="container-custom">
          <div className="skeleton" style={{ height: '40px', width: '220px', marginBottom: '2rem' }}></div>
          <div className="details-layout-grid">
            <div className="skeleton" style={{ height: '520px', borderRadius: '18px' }}></div>
            <div className="skeleton" style={{ height: '520px', borderRadius: '18px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-details-page page-wrapper">
        <div className="container-custom text-center py-5">
          <h2 className="section-title mb-2">Vehicle Not Found</h2>
          <p className="text-muted mb-4">{error || 'The requested car is unavailable.'}</p>
          <NavLink to="/cars" className="btn btn-primary">
            <FiArrowLeft /> Back to Fleet Catalogue
          </NavLink>
        </div>
      </div>
    );
  }

  const galleryImages = car.images && car.images.length > 0 ? car.images : [car.image || '/swift.jpg'];

  return (
    <div className="car-details-page page-wrapper">
      <div className="container-custom">
        {/* Top Back Navigation */}
        <div className="details-nav-bar">
          <button onClick={() => navigate('/cars')} className="back-link-btn">
            <FiArrowLeft /> Back to All Cars
          </button>
          <div className="breadcrumbs-trail">
            <NavLink to="/">Home</NavLink> / <NavLink to="/cars">Cars</NavLink> / <span>{car.make} {car.model}</span>
          </div>
        </div>

        {/* 2-Column Main Layout: Gallery & Details (Left) + Sticky Booking Card (Right) */}
        <div className="details-layout-grid">
          {/* Left Column: Media Gallery, Overview, Specifications, Features */}
          <div className="details-main-content">
            {/* Gallery Section */}
            <div className="car-gallery-box card-light">
              <div className="main-display-photo-wrap">
                <img 
                  src={galleryImages[activeImageIndex] || car.image || '/swift.jpg'} 
                  alt={`${car.make} ${car.model}`}
                  className="main-gallery-photo"
                  onError={(e) => { e.target.src = '/swift.jpg'; }}
                />
                <span className="gallery-cat-badge">{car.category}</span>
                <span className={`gallery-avail-badge ${car.available ? 'avail' : 'booked'}`}>
                  {car.available ? '● Available for Instant Booking' : '● Currently Reserved'}
                </span>
              </div>

              {/* Thumbnails row */}
              {galleryImages.length > 1 && (
                <div className="gallery-thumbnails-row">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} onError={(e) => { e.target.src = '/swift.jpg'; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Overview & Description */}
            <div className="car-overview-box card-light">
              <div className="overview-title-row">
                <div>
                  <span className="section-tag">{car.category} CLASS</span>
                  <h1 className="car-hero-title">{car.make} {car.model}</h1>
                  <span className="car-model-year">{car.year || 2025} Edition</span>
                </div>
                <div className="car-rating-pill-large">
                  <FiStar className="star-icon" /> {car.rating || 4.9} 
                  <span className="trips-count">({car.tripsCount || 35}+ trips)</span>
                </div>
              </div>

              <p className="car-full-desc">
                {car.description || `Experience superior handling and craftsmanship with the ${car.make} ${car.model}. Equipped with premium audio, ADAS safety suite, and luxurious comfort for family tours or corporate transfers.`}
              </p>

              {/* Color Selector */}
              {car.colors && car.colors.length > 0 && (
                <div className="color-selection-block">
                  <span className="block-label">Available Exterior Finishes:</span>
                  <div className="colors-chips-list">
                    {car.colors.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedColor(clr)}
                        className={`color-chip ${selectedColor === clr ? 'active' : ''}`}
                      >
                        <span className="color-dot"></span>
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Technical Specifications Grid */}
            <div className="car-specs-section card-light">
              <h2 className="specs-section-title">Technical Specifications</h2>
              <div className="specs-detail-matrix">
                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiTruck /> Powertrain / Engine</span>
                  <strong className="spec-m-v">{car.engine || '1.5L Turbocharged'}</strong>
                </div>

                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiZap /> Max Power</span>
                  <strong className="spec-m-v">{car.power || '142 bhp'}</strong>
                </div>

                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiActivity /> Peak Torque</span>
                  <strong className="spec-m-v">{car.torque || '250 Nm'}</strong>
                </div>

                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiDroplet /> Fuel / Efficiency</span>
                  <strong className="spec-m-v">{car.fuelType} • {car.mileage || '18.4 kmpl'}</strong>
                </div>

                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiUsers /> Seating Layout</span>
                  <strong className="spec-m-v">{car.seats || 5} Executive Seats</strong>
                </div>

                <div className="spec-matrix-card">
                  <span className="spec-m-k"><FiPackage /> Luggage Capacity</span>
                  <strong className="spec-m-v">{car.bootSpace || '433 Litres'}</strong>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="car-features-section card-light">
              <h2 className="specs-section-title">Standard Features & Inclusions</h2>
              <div className="features-checklist-grid">
                {(car.features && car.features.length > 0 ? car.features : [
                  'Touchscreen Infotainment with Apple CarPlay / Android Auto',
                  'High Resolution 360-degree Parking Camera',
                  'Comprehensive Collision Damage Waiver (CDW)',
                  '24/7 National Emergency Roadside Assistance',
                  'Fully Sanitized Cabin with AQI Air Filtration',
                  'Fastag Enabled for Frictionless Highway Tolls'
                ]).map((feat, i) => (
                  <div key={i} className="feature-check-item">
                    <div className="check-icon-circle"><FiCheck /></div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking & Pricing Panel */}
          <div className="details-booking-sidebar">
            <div className="booking-card-panel card-light">
              {/* Daily Rate Header */}
              <div className="booking-rate-header">
                <div>
                  <span className="rate-sub">Daily Rate</span>
                  <div className="price-num-row">
                    <strong className="rate-big">₹{Number(dailyPrice).toLocaleString()}</strong>
                    <span className="rate-unit">/day</span>
                  </div>
                </div>
                <span className="badge badge-active">Instant Confirmation</span>
              </div>

              <hr className="booking-card-divider" />

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="booking-form-inner">
                {bookingError && (
                  <div className="booking-error-alert">
                    <FiInfo /> {bookingError}
                  </div>
                )}

                {/* Schedule Inputs */}
                <div className="form-group-item">
                  <label className="form-label"><FiCalendar className="text-coral" /> Pick-up Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label"><FiCalendar className="text-coral" /> Return Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>

                {/* Driver Details */}
                <div className="form-group-item">
                  <label className="form-label"><FiUser className="text-coral" /> Primary Driver Name</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Full legal name on license"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group-item">
                    <label className="form-label"><FiMail className="text-coral" /> Email</label>
                    <input 
                      type="email"
                      className="form-input"
                      placeholder="driver@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-label"><FiPhone className="text-coral" /> Phone</label>
                    <input 
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="form-label">Special Requests (Optional)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g. Airport delivery, Child seat..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                {/* Price Breakdown Calculation */}
                <div className="price-breakdown-box">
                  <div className="breakdown-row">
                    <span>Rate for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>GST & Platform Taxes (5%)</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row total-row">
                    <strong>Total Payable</strong>
                    <strong className="total-amount-highlight">₹{estimatedTotal.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Action CTA */}
                <button 
                  type="submit" 
                  disabled={submittingBooking || !car.available}
                  className="btn btn-primary w-full book-submit-btn"
                >
                  <FiLock /> {submittingBooking ? 'Reserving Vehicle...' : !car.available ? 'Vehicle Booked' : `Reserve Now • ₹${estimatedTotal.toLocaleString()}`}
                </button>

                <div className="booking-trust-micro">
                  <span>🔒 256-bit Encrypted Reservation</span>
                  <span>🛡️ Free cancellation up to 24h prior</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Recommended Cars Section */}
        {recommendedCars.length > 0 && (
          <div className="recommended-fleet-section">
            <div className="section-heading-row">
              <div>
                <span className="section-tag">SIMILAR FLEET</span>
                <h2 className="section-title">You May Also Like</h2>
              </div>
              <NavLink to="/cars" className="btn btn-outline btn-sm">
                View All <FiArrowRight />
              </NavLink>
            </div>

            <div className="fleet-grid-preview">
              {recommendedCars.map((rc) => (
                <div key={rc._id} className="vehicle-showcase-card card-light">
                  <div className="vehicle-card-media">
                    <img 
                      src={rc.image || '/swift.jpg'} 
                      alt={`${rc.make} ${rc.model}`}
                      className="vehicle-img"
                      onError={(e) => { e.target.src = '/swift.jpg'; }}
                    />
                    <span className="vehicle-badge-cat">{rc.category}</span>
                  </div>

                  <div className="vehicle-card-body">
                    <h3 className="vehicle-model-name">{rc.make} {rc.model}</h3>
                    <div className="vehicle-specs-pills">
                      <span className="spec-pill">{rc.seats || 5} Seats</span>
                      <span className="spec-pill">{rc.transmission}</span>
                      <span className="spec-pill">{rc.fuelType}</span>
                    </div>

                    <div className="vehicle-card-footer">
                      <div className="price-block">
                        <span className="price-label">Daily</span>
                        <strong className="price-amount">₹{Number(rc.pricePerDay).toLocaleString()}</strong>
                      </div>
                      <NavLink to={`/cars/${rc._id}`} className="btn btn-primary btn-sm">
                        View
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}