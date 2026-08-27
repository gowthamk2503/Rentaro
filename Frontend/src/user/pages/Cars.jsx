import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import { carsApi } from '../../services/api';
import { 
  FiSearch, 
  FiFilter, 
  FiStar, 
  FiZap, 
  FiCheck, 
  FiX, 
  FiSliders, 
  FiArrowRight, 
  FiRefreshCw,
  FiUsers,
  FiTruck,
  FiDroplet,
  FiAlertCircle
} from 'react-icons/fi';
import '../styles/Cars.css';

const categoriesList = ['All', 'Electric', 'SUV', 'Luxury', 'Sedan', 'Economy'];
const fuelTypesList = ['All', 'Petrol', 'Diesel', 'Electric'];
const transmissionsList = ['All', 'Automatic', 'Manual'];
const seatingList = ['All', '4', '5', '7'];

export default function Cars() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Cars State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load cars from MongoDB Backend
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        fuelType: selectedFuel !== 'All' ? selectedFuel : undefined,
        transmission: selectedTransmission !== 'All' ? selectedTransmission : undefined,
        seats: selectedSeats !== 'All' ? Number(selectedSeats) : undefined,
        maxPrice: maxPrice < 15000 ? maxPrice : undefined,
        available: availableOnly ? 'true' : undefined,
        sort: sortBy,
        search: search.trim() ? search.trim() : undefined,
      };

      const data = await carsApi.getAll(query);
      setCars(Array.isArray(data) ? data : data.cars || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Unable to load vehicle fleet. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [selectedCategory, selectedFuel, selectedTransmission, selectedSeats, maxPrice, availableOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSelectedSeats('All');
    setMaxPrice(15000);
    setAvailableOnly(false);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="cars-page-wrapper page-wrapper">
      <div className="container-custom">
        {/* Page Header */}
        <div className="cars-page-header">
          <div>
            <span className="section-tag">PREMIUM VEHICLE FLEET</span>
            <h1 className="section-title">Explore Our Fleet</h1>
            <p className="section-subtitle">
              Choose from our curated collection of verified luxury, electric, and performance cars.
            </p>
          </div>

          <div className="header-search-bar">
            <form onSubmit={handleSearchSubmit} className="search-form-inline">
              <FiSearch className="search-icon-prefix" />
              <input 
                type="text"
                placeholder="Search by make, model, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-field"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-pills-bar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Grid: Sidebar Filters + Car Grid */}
        <div className="cars-layout-grid">
          {/* Desktop Filter Sidebar */}
          <aside className={`cars-filter-sidebar card-light ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-header">
              <div className="flex-center gap-2">
                <FiSliders className="text-coral" />
                <h3 className="filter-title">Filter Options</h3>
              </div>
              <button onClick={resetFilters} className="btn-reset-filters" title="Reset all filters">
                <FiRefreshCw /> Reset
              </button>
            </div>

            <hr className="filter-divider" />

            {/* Transmission */}
            <div className="filter-group">
              <label className="form-label">Transmission</label>
              <div className="filter-chips-row">
                {transmissionsList.map((trans) => (
                  <button
                    key={trans}
                    onClick={() => setSelectedTransmission(trans)}
                    className={`filter-chip ${selectedTransmission === trans ? 'active' : ''}`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="filter-group">
              <label className="form-label">Fuel Type</label>
              <div className="filter-chips-row">
                {fuelTypesList.map((fuel) => (
                  <button
                    key={fuel}
                    onClick={() => setSelectedFuel(fuel)}
                    className={`filter-chip ${selectedFuel === fuel ? 'active' : ''}`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div className="filter-group">
              <label className="form-label">Seating Capacity</label>
              <div className="filter-chips-row">
                {seatingList.map((seats) => (
                  <button
                    key={seats}
                    onClick={() => setSelectedSeats(seats)}
                    className={`filter-chip ${selectedSeats === seats ? 'active' : ''}`}
                  >
                    {seats === 'All' ? 'All Seats' : `${seats} Seats`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Daily Budget Slider */}
            <div className="filter-group">
              <div className="flex-between mb-2">
                <label className="form-label">Max Price / Day</label>
                <span className="price-tag-value">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="2000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-range-slider"
              />
              <div className="flex-between text-xs text-muted mt-1">
                <span>₹2,000</span>
                <span>₹15,000+</span>
              </div>
            </div>

            {/* Available Only Toggle */}
            <div className="filter-group toggle-group">
              <label className="toggle-label" htmlFor="avail-toggle">
                <span>Available Vehicles Only</span>
                <input 
                  type="checkbox"
                  id="avail-toggle"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="toggle-checkbox"
                />
              </label>
            </div>
          </aside>

          {/* Main Fleet Content Area */}
          <div className="cars-content-area">
            {/* Top Toolbar: Results Count & Sort Dropdown */}
            <div className="cars-toolbar card-light">
              <div className="results-count">
                Showing <strong>{cars.length}</strong> {cars.length === 1 ? 'vehicle' : 'vehicles'}
              </div>

              <div className="sort-wrapper">
                <label htmlFor="sort-select" className="sort-label">Sort By:</label>
                <select 
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select-field"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Year</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="cars-fleet-grid">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="skeleton" style={{ height: '400px', borderRadius: '18px' }}></div>
                ))}
              </div>
            ) : error ? (
              <div className="cars-empty-box card-light">
                <FiAlertCircle className="empty-icon text-coral" />
                <h3>Error Loading Fleet</h3>
                <p>{error}</p>
                <button onClick={fetchCars} className="btn btn-primary mt-3">
                  <FiRefreshCw /> Try Again
                </button>
              </div>
            ) : cars.length === 0 ? (
              <div className="cars-empty-box card-light">
                <div className="empty-icon-wrap">🚗</div>
                <h3>No Matching Vehicles Found</h3>
                <p>Try adjusting your search query, price range, or category filters.</p>
                <button onClick={resetFilters} className="btn btn-outline mt-3">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="cars-fleet-grid">
                {cars.map((car) => (
                  <div key={car._id || car.id} className="car-card card-light">
                    {/* Media */}
                    <div className="car-card-media">
                      <img 
                        src={car.image || '/swift.jpg'} 
                        alt={`${car.make} ${car.model}`}
                        className="car-photo"
                        onError={(e) => { e.target.src = '/swift.jpg'; }}
                      />
                      <span className="car-cat-chip">{car.category || 'SUV'}</span>
                      <span className={`car-avail-chip ${car.available ? 'avail' : 'booked'}`}>
                        {car.available ? '● Available' : '● Booked'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="car-card-body">
                      <div className="car-header-row">
                        <div>
                          <h3 className="car-title">{car.make} {car.model}</h3>
                          <span className="car-year">{car.year || 2025} Model</span>
                        </div>
                        <div className="car-rating-badge">
                          <FiStar className="star-icon" /> {car.rating || 4.8}
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="car-specs-grid">
                        <div className="spec-item">
                          <FiUsers className="text-muted" />
                          <span>{car.seats || 5} Seats</span>
                        </div>
                        <div className="spec-item">
                          <FiTruck className="text-muted" />
                          <span>{car.transmission || 'Automatic'}</span>
                        </div>
                        <div className="spec-item">
                          <FiDroplet className="text-muted" />
                          <span>{car.fuelType || 'Petrol'}</span>
                        </div>
                        <div className="spec-item">
                          <FiZap className="text-muted" />
                          <span>{car.mileage || '18 kmpl'}</span>
                        </div>
                      </div>

                      {/* Footer & CTA */}
                      <div className="car-card-footer">
                        <div className="car-price-wrap">
                          <span className="rate-sub">Daily Rate</span>
                          <strong className="rate-val">₹{Number(car.pricePerDay || 3500).toLocaleString()}<span className="rate-period">/day</span></strong>
                        </div>

                        <NavLink 
                          to={`/cars/${car._id || car.id}`}
                          className="btn btn-primary btn-sm car-view-btn"
                        >
                          View Details <FiArrowRight />
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}