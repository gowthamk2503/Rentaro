import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { carsApi } from '../../services/api';
import { 
  FiMapPin, 
  FiCalendar, 
  FiSearch, 
  FiCheckCircle, 
  FiShield, 
  FiClock, 
  FiDollarSign, 
  FiStar, 
  FiArrowRight,
  FiZap,
  FiAward,
  FiUserCheck,
  FiTruck,
  FiUsers,
  FiDroplet,
  FiHeart
} from 'react-icons/fi';
import '../styles/Home.css';

const categories = [
  { id: 'All', name: 'All Vehicles', icon: '🚗', count: '14+ Cars' },
  { id: 'Electric', name: 'Electric', icon: '⚡', count: 'Zero Emission' },
  { id: 'SUV', name: 'SUVs & 4x4', icon: '🚙', count: 'All Terrain' },
  { id: 'Luxury', name: 'Luxury & Exotic', icon: '✨', count: 'Executive' },
  { id: 'Sedan', name: 'Sedans', icon: '🏎️', count: 'Comfort Cruiser' },
  { id: 'Economy', name: 'Economy', icon: '💰', count: 'Best Value' },
];

const testimonials = [
  {
    name: 'Vikram Malhotra',
    role: 'Managing Director, Horizon Tech',
    comment: 'Rentaro transformed our corporate delegation experience. Seamless Tata Nexon EV booking and instant verification. Flawless white-glove service.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Malhotra&background=EEF3FA&color=25252B'
  },
  {
    name: 'Ananya Sharma',
    role: 'Product Designer',
    comment: 'The Mahindra Thar was spotless and delivered right to my apartment. Zero hidden deposit hassles and ultra-smooth return. Highly recommended!',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Sharma&background=F9DDE1&color=E85D6A'
  },
  {
    name: 'Rohan Gupta',
    role: 'Travel Enthusiast',
    comment: 'Rented the Fortuner Legender for a 10-day Himachal expedition. Top-tier mechanical condition and 24/7 roadside assistance gave us total peace of mind.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Rohan+Gupta&background=EEF3FA&color=75AF8B'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  
  // Search Card State
  const [pickupLocation, setPickupLocation] = useState('Central Motor Plaza, Metro');
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

  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        const data = await carsApi.getAll();
        const list = Array.isArray(data) ? data : data.cars || [];
        setFeaturedCars(list.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured cars:', err);
      } finally {
        setLoadingCars(false);
      }
    };
    loadFeaturedCars();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/cars?pickupDate=${pickupDate}&returnDate=${returnDate}&location=${encodeURIComponent(pickupLocation)}`);
  };

  const handleCategoryClick = (catId) => {
    if (catId === 'All') {
      navigate('/cars');
    } else {
      navigate(`/cars?category=${catId}`);
    }
  };

  return (
    <div className="home-page-wrapper page-wrapper">
      {/* 1. Hero Section */}
      <section className="hero-section">
        {/* Soft Ambient Decorative Glows */}
        <div className="ambient-glow-pink hero-glow-left"></div>
        <div className="ambient-glow-blue hero-glow-right"></div>

        <div className="container-custom hero-content-grid">
          {/* Left: Hero Typography & CTAs */}
          <div className="hero-text-col">
            <div className="hero-pill-badge">
              <span className="pill-dot"></span> Premium Mobility Experience
            </div>
            
            <h1 className="hero-main-title">
              Your Journey,<br />
              Your Car,<br />
              <span className="text-coral">Your Way.</span>
            </h1>

            <p className="hero-description">
              Experience effortless vehicle rentals with transparent daily pricing, doorstep delivery, and zero friction. Choose from our handpicked luxury sedans, rugged 4x4 SUVs, and eco-friendly electric vehicles.
            </p>
            
            <div className="hero-action-row">
              <NavLink to="/cars" className="btn btn-primary hero-cta-btn">
                Get Started <FiArrowRight />
              </NavLink>
              <NavLink to="/cars" className="btn btn-outline hero-secondary-btn">
                Explore Fleet
              </NavLink>
            </div>

            {/* Micro Trust Stats */}
            <div className="hero-trust-row">
              <div className="trust-stat-item">
                <strong className="stat-number">500+</strong>
                <span className="stat-label">Verified Trips</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-stat-item">
                <strong className="stat-number">4.9 ★</strong>
                <span className="stat-label">Customer Rating</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-stat-item">
                <strong className="stat-number">100%</strong>
                <span className="stat-label">Refundable Deposit</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Vehicle Visual with Floating Availability Card */}
          <div className="hero-visual-col">
            <div className="hero-image-stage">
              <div className="hero-glow-backdrop"></div>
              <img 
                src="/red_car.png" 
                alt="Rentaro Performance Luxury Car" 
                className="hero-main-vehicle-img"
              />

              {/* Floating Availability Card */}
              <div className="floating-availability-card card-light">
                <div className="availability-num-badge">
                  <span className="avail-number">50+</span>
                </div>
                <div className="availability-meta">
                  <strong className="avail-title">Car Types Available</strong>
                  <span className="avail-sub">Instant Booking Confirmation</span>
                </div>
              </div>

              {/* Secondary Floating Feature Pill */}
              <div className="floating-feature-pill card-light">
                <FiZap className="text-coral" size={18} />
                <span>Zero Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Search & Reserve Bar */}
      <section className="search-bar-section">
        <div className="container-custom">
          <form onSubmit={handleSearchSubmit} className="home-search-panel card-light">
            <div className="search-input-group">
              <label className="search-label"><FiMapPin className="text-coral" /> Pick-up Location</label>
              <input 
                type="text"
                className="search-control"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="City, Airport, or Station..."
                required
              />
            </div>

            <div className="search-divider-vertical"></div>

            <div className="search-input-group">
              <label className="search-label"><FiCalendar className="text-coral" /> Pick-up Date</label>
              <input 
                type="date"
                className="search-control"
                value={pickupDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>

            <div className="search-divider-vertical"></div>

            <div className="search-input-group">
              <label className="search-label"><FiCalendar className="text-coral" /> Return Date</label>
              <input 
                type="date"
                className="search-control"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary search-submit-btn">
              <FiSearch /> Find Vehicles
            </button>
          </form>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section className="categories-section">
        <div className="container-custom">
          <div className="section-heading-row">
            <div>
              <span className="section-tag">CURATED FLEET</span>
              <h2 className="section-title">Browse by Vehicle Category</h2>
            </div>
            <NavLink to="/cars" className="btn btn-outline btn-sm">
              View All Categories <FiArrowRight />
            </NavLink>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="category-card card-light"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="cat-icon-wrap">{cat.icon}</div>
                <h3 className="cat-name">{cat.name}</h3>
                <span className="cat-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Vehicles */}
      <section className="featured-fleet-section">
        <div className="container-custom">
          <div className="section-heading-row">
            <div>
              <span className="section-tag">POPULAR CHOICES</span>
              <h2 className="section-title">Featured Fleet Highlights</h2>
              <p className="section-subtitle">Top-rated vehicles meticulously sanitized, insured, and prepped for your journey.</p>
            </div>
            <NavLink to="/cars" className="btn btn-primary btn-sm">
              Explore Full Fleet <FiArrowRight />
            </NavLink>
          </div>

          {loadingCars ? (
            <div className="fleet-grid-preview">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: '380px', borderRadius: '18px' }}></div>
              ))}
            </div>
          ) : (
            <div className="fleet-grid-preview">
              {featuredCars.map((car) => (
                <div key={car._id || car.id} className="vehicle-showcase-card card-light">
                  <div className="vehicle-card-media">
                    <img 
                      src={car.image || '/swift.jpg'} 
                      alt={`${car.make} ${car.model}`}
                      className="vehicle-img"
                      onError={(e) => { e.target.src = '/swift.jpg'; }}
                    />
                    <span className="vehicle-badge-cat">{car.category || 'SUV'}</span>
                  </div>

                  <div className="vehicle-card-body">
                    <div className="vehicle-title-row">
                      <h3 className="vehicle-model-name">{car.make} {car.model}</h3>
                      <div className="vehicle-rating-pill">
                        <FiStar className="star-icon" /> {car.rating || 4.8}
                      </div>
                    </div>

                    <div className="vehicle-specs-pills">
                      <span className="spec-pill"><FiUsers /> {car.seats || 5} Seats</span>
                      <span className="spec-pill"><FiTruck /> {car.transmission || 'Automatic'}</span>
                      <span className="spec-pill"><FiDroplet /> {car.fuelType || 'Petrol'}</span>
                    </div>

                    <div className="vehicle-card-footer">
                      <div className="price-block">
                        <span className="price-label">Daily Rate</span>
                        <strong className="price-amount">₹{Number(car.pricePerDay || 3500).toLocaleString()}<span className="price-sub">/day</span></strong>
                      </div>
                      <NavLink to={`/cars/${car._id || car.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container-custom">
          <div className="text-center mb-5">
            <span className="section-tag">SEAMLESS PROCESS</span>
            <h2 className="section-title">How Rentaro Works</h2>
            <p className="section-subtitle mx-auto">Get behind the wheel in 3 effortless steps with zero paperwork hassles.</p>
          </div>

          <div className="steps-cards-grid">
            <div className="step-item-card card-light">
              <div className="step-number-badge">01</div>
              <h3 className="step-title">Select Your Vehicle</h3>
              <p className="step-description">
                Filter through our fleet of luxury sedans, electric cars, and rugged SUVs based on your itinerary and preferences.
              </p>
            </div>

            <div className="step-item-card card-light">
              <div className="step-number-badge">02</div>
              <h3 className="step-title">Confirm & Secure</h3>
              <p className="step-description">
                Select your dates, add doorstep delivery, and complete your reservation via certified Razorpay checkout or instant simulation.
              </p>
            </div>

            <div className="step-item-card card-light">
              <div className="step-number-badge">03</div>
              <h3 className="step-title">Hit the Open Road</h3>
              <p className="step-description">
                Pick up your keys or receive your sanitized car at your doorstep with 24/7 roadside assistance on standby throughout your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Rentaro */}
      <section className="why-rentaro-section" id="why-rentaro">
        <div className="container-custom">
          <div className="why-rentaro-layout card-light">
            <div className="why-rentaro-text">
              <span className="section-tag">WHY CHOOSE US</span>
              <h2 className="section-title">Engineered for Frictionless Driving</h2>
              <p className="section-subtitle mb-4">
                We combine transparent digital booking with premier vehicle maintenance to give you absolute peace of mind.
              </p>

              <div className="value-pillars-list">
                <div className="pillar-item">
                  <div className="pillar-icon"><FiCheckCircle /></div>
                  <div>
                    <strong className="pillar-title">Zero Hidden Fees & 100% Refundable Deposit</strong>
                    <p className="pillar-desc">What you see is what you pay. Transparent daily pricing with automated deposit refunds.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon"><FiShield /></div>
                  <div>
                    <strong className="pillar-title">Fully Insured with 24/7 Roadside Assistance</strong>
                    <p className="pillar-desc">Comprehensive insurance coverage on all trips with emergency concierge on call.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon"><FiClock /></div>
                  <div>
                    <strong className="pillar-title">Doorstep Delivery & Flexible Return Points</strong>
                    <p className="pillar-desc">Receive your car right outside your home or hotel at your scheduled pickup time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="why-rentaro-visual">
              <img 
                src="/tata_nexon_ev.png" 
                alt="Rentaro Verified Fleet" 
                className="why-car-img" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="testimonials-section">
        <div className="container-custom">
          <div className="text-center mb-5">
            <span className="section-tag">TRAVELER EXPERIENCES</span>
            <h2 className="section-title">Loved by Thousands of Drivers</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card card-light">
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-quote">"{t.comment}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="author-avatar" />
                  <div>
                    <h4 className="author-name">{t.name}</h4>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="cta-banner-section">
        <div className="container-custom">
          <div className="cta-card card-light">
            <div className="ambient-glow-pink" style={{ top: '-20%', right: '-10%' }}></div>
            <div className="ambient-glow-blue" style={{ bottom: '-20%', left: '-10%' }}></div>

            <div className="cta-card-content text-center">
              <span className="section-tag">START YOUR TRIP</span>
              <h2 className="section-title">Ready to Experience the Road?</h2>
              <p className="section-subtitle mx-auto mb-4">
                Explore our fleet now and unlock exclusive seasonal discounts on multi-day rentals.
              </p>
              <div className="cta-button-group">
                <NavLink to="/cars" className="btn btn-primary">
                  Browse Available Cars <FiArrowRight />
                </NavLink>
                <NavLink to="/contact" className="btn btn-outline">
                  Contact Concierge
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. White Footer */}
      <footer className="rentaro-footer">
        <div className="container-custom">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <NavLink to="/" className="brand-logo mb-3">
                <div className="logo-icon-wrap">
                  <span className="logo-r">R</span>
                </div>
                <span className="brand-name">RENTARO<span className="brand-dot">.</span></span>
              </NavLink>
              <p className="footer-brand-desc">
                Rentaro is India’s premier luxury and performance vehicle mobility platform. Driven by technology, built for adventure.
              </p>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Fleet</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/cars?category=Electric">Electric Vehicles</NavLink></li>
                <li><NavLink to="/cars?category=SUV">4x4 & SUVs</NavLink></li>
                <li><NavLink to="/cars?category=Luxury">Luxury Sedans</NavLink></li>
                <li><NavLink to="/cars?category=Economy">City Economy</NavLink></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/home">Home</NavLink></li>
                <li><NavLink to="/cars">Explore Cars</NavLink></li>
                <li><NavLink to="/bookings">My Bookings</NavLink></li>
                <li><NavLink to="/contact">Contact Support</NavLink></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Contact & Support</h4>
              <ul className="footer-links-list">
                <li><span className="footer-text-muted">Lead: Gowtham</span></li>
                <li><span className="footer-text-muted">Phone: <a href="tel:7373692501" style={{ color: 'inherit' }}>7373692501</a></span></li>
                <li><span className="footer-text-muted">Email: <a href="mailto:vijaygowtham2530@gmail.com" style={{ color: 'inherit' }}>vijaygowtham2530@gmail.com</a></span></li>
                <li><span className="footer-text-muted">Doorstep Delivery Hub</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="footer-copy">© 2026 Rentaro Mobility Solutions Inc. All rights reserved.</p>
            <div className="footer-badges-row">
              <span className="footer-chip">🔒 256-bit SSL</span>
              <span className="footer-chip">🛡️ Razorpay Certified</span>
              <span className="footer-chip">⚡ 100% Verified Fleet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
