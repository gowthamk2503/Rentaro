import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h1 className="hero-title">
            Your Journey,<br/>
            Your Car,<br/>
            Your Way
          </h1>
          <p className="hero-subtext">
            Experience the ultimate freedom of choice with <b>Rentaro</b> - tailor your
            adventure by choosing from our premium fleet of vehicles.
          </p>
          <button className="get-started-button">Get Started</button>
          <div className="social-icons">
            <span className="social-icon">FB</span>
            <span className="social-icon">IG</span>
            <span className="social-icon">TW</span>
            <span className="social-icon">YT</span>
          </div>
        </div>

        <div className="hero-center">
          <div className="car-image-container">
            <img src="/red_car.png" alt="Red Sports Car" className="car-image-center" />
            <div className="watermark">Rentaro</div>
          </div>
        </div>
        
        <div className="hero-right">
          <div className="stats-box">
            <h2 className="stats-number">50+</h2>
            <p className="stats-text">Car Types<br/>Available</p>
          </div>
        </div>
      </section>
      
      {/* Car Fleet Section */}
     <section className="car-fleet-section">
      <div className="section-header">
        <h3 className="section-subtitle">EXPLORE OUR FLEET</h3>
        <h2 className="section-title">Featured Vehicles</h2>
        <p className="section-description">
          Choose from our wide selection of premium vehicles for your next journey
        </p>
      </div>

      {/* First Car Grid - Electric Vehicles */}
      <div className="car-category">
        <h3 className="category-title">Electric Vehicles</h3>
        <div className="car-grid">
          {/* Tata Nexon EV */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="/tata_nexon_ev.png" 
                alt="Tata Nexon EV" 
                className="car-fleet-image" 
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
              <div className="car-badge">Popular</div>
            </div>
            <div className="car-details">
              <h3 className="car-name">Tata Nexon EV</h3>
              <div className="car-features">
                <span>5 Seats</span>
                <span>Automatic</span>
                <span>250km Range</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹3,500/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>

          {/* MG ZS EV */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="mahindra_thar.png" 
                alt="mahindra thar" 
                className="car-fleet-image"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
            </div>
            <div className="car-details">
              <h3 className="car-name">MG ZS EV</h3>
              <div className="car-features">
                <span>5 Seats</span>
                <span>Automatic</span>
                <span>340km Range</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹4,200/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>

          {/* Tata Tigor EV */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="/tiago.jpg" 
                alt="Tata Tigor EV" 
                className="car-fleet-image"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
            </div>
            <div className="car-details">
              <h3 className="car-name">Tata Tigor EV</h3>
              <div className="car-features">
                <span>5 Seats</span>
                <span>Automatic</span>
                <span>220km Range</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹3,200/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Car Grid - SUVs */}
      <div className="car-category">
        <h3 className="category-title">Premium SUVs</h3>
        <div className="car-grid">
          {/* Hyundai Creta */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="/hyundai_creta.png" 
                alt="Hyundai Creta" 
                className="car-fleet-image"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
              <div className="car-badge">Best Seller</div>
            </div>
            <div className="car-details">
              <h3 className="car-name">Hyundai Creta</h3>
              <div className="car-features">
                <span>5 Seats</span>
                <span>Automatic</span>
                <span>Diesel</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹4,500/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>

          {/* Kia Seltos */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="/kia_seltos.png" 
                alt="Kia Seltos" 
                className="car-fleet-image"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
            </div>
            <div className="car-details">
              <h3 className="car-name">Kia Seltos</h3>
              <div className="car-features">
                <span>5 Seats</span>
                <span>Automatic</span>
                <span>Sunroof</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹4,800/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>

          {/* Mahindra Scorpio */}
          <div className="car-card">
            <div className="car-image-wrapper">
              <img 
                src="scorpio.jpg" 
                alt="Mahindra Scorpio" 
                className="car-fleet-image"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                  e.target.alt = 'Default Car Image';
                }}
              />
            </div>
            <div className="car-details">
              <h3 className="car-name">Mahindra Scorpio</h3>
              <div className="car-features">
                <span>7 Seats</span>
                <span>Manual</span>
                <span>4WD</span>
              </div>
              <div className="car-pricing">
                <div className="price-info">
                  <p className="price-label">Starting at</p>
                  <p className="price-value">₹5,500/day</p>
                </div>
                <NavLink to="/cars" className="rent-now-button">
                  Rent Now
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="view-all-container">
        <NavLink to="/cars" className="view-all-button">
          View All Vehicles
        </NavLink>
      </div>
    </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About Rentaro</h2>
            <p className="section-subtitle">Your Trusted Automotive Partner</p>
            <div className="about-description">
              <p>
                Founded in 2010, <b>Rentaro</b> has grown to become a premier destination for car rentals, 
                purchases, and sales. Our mission is to provide exceptional vehicles and service 
                that exceeds your expectations.
              </p>
              <p>
                With over a decade of experience in the automotive industry, we've served more than 
                12,500 satisfied customers across the country. Our team of experts is dedicated to 
                helping you find the perfect vehicle for your needs.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <h3>12.5K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Vehicle Models</p>
              </div>
              <div className="stat-item">
                <h3>24/7</h3>
                <p>Customer Support</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="/rentaro.png" alt="Rentaro Team" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* Contact Section */}
<section id="contact" className="contact-section">
  <div className="section-header">
    <h3 className="section-subtitle">GET IN TOUCH</h3>
    <h2 className="section-title">Contact Us</h2>
    <p className="section-description">
      Have questions about booking a vehicle? Our team is here to help.
    </p>
  </div>

  <div className="contact-content">
    <div className="contact-info">

      <div className="info-item">
        <div className="info-icon">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div className="info-text">
          <h4>Location</h4>
          <p>Coimbatore, Tamil Nadu, India</p>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon">
          <i className="fas fa-phone-alt"></i>
        </div>
        <div className="info-text">
          <h4>Customer Support</h4>
          <p>+91 73736 92501</p>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon">
          <i className="fas fa-envelope"></i>
        </div>
        <div className="info-text">
          <h4>Email Address</h4>
          <p>gowtham.k2023it@sece.ac.in</p>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="info-text">
          <h4>Business Hours</h4>
          <p>Monday - Sunday</p>
          <p>24/7 Online Booking Support</p>
        </div>
      </div>

    </div>

    <div className="contact-form">
      <form>
        <div className="form-group">
          <input type="text" placeholder="Your Name" required />
        </div>

        <div className="form-group">
          <input type="email" placeholder="Your Email" required />
        </div>

        <div className="form-group">
          <input type="text" placeholder="Subject" />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Rentaro.</h2>
            <p>Your journey, your car, your way</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/cars">Cars</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Services</h4>
              <ul>
                <li><NavLink to="/rent">Rent a Car</NavLink></li>
                <li><NavLink to="/buy">Buy a Car</NavLink></li>
                <li><NavLink to="/sell">Sell Your Car</NavLink></li>
                <li><NavLink to="/consult">Consultation</NavLink></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rentaro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
