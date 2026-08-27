import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { carsApi } from '../../services/api';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiSave, 
  FiTruck, 
  FiDollarSign, 
  FiInfo, 
  FiCheck, 
  FiImage 
} from 'react-icons/fi';
import '../styles/AddCar.css';

const PRESET_CAR_IMAGES = [
  { label: 'Tata Nexon EV', url: '/tata_nexon_ev.png' },
  { label: 'Mahindra Thar', url: '/mahindra_thar.png' },
  { label: 'Hyundai Creta', url: '/hyundai_creta.png' },
  { label: 'Kia Seltos', url: '/kia_seltos.png' },
  { label: 'Maruti Swift', url: '/swift.jpg' },
  { label: 'Toyota Fortuner', url: '/fortuner.jpg' },
  { label: 'Toyota Innova', url: '/innova.jpg' },
  { label: 'Honda City', url: '/city.jpg' },
  { label: 'Tata Harrier', url: '/harrier.jpg' },
  { label: 'Exotic Velocita GT', url: '/red_car.png' },
];

export default function AddCar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sedan',
    pricePerDay: 4500,
    available: true,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '20 kmpl',
    bootSpace: '350 Litres',
    groundClearance: '170 mm',
    engine: '1.5L Turbo Engine',
    power: '115 bhp @ 5500 rpm',
    torque: '150 Nm @ 3500 rpm',
    image: '/swift.jpg',
    description: '',
    features: [
      'Touchscreen Infotainment',
      'Apple CarPlay & Android Auto',
      'Air Conditioning & Climate Control',
      '6 Airbags & ABS with EBD',
      'Rear Parking Camera'
    ]
  });

  const [featureInput, setFeatureInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.make || !formData.model || !formData.pricePerDay || !formData.year) {
      setError('Please fill in make, model, year, and daily rate.');
      return;
    }

    setSubmitting(true);
    try {
      await carsApi.add({
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        year: Number(formData.year),
        seats: Number(formData.seats),
        images: [formData.image],
      });
      navigate('/admin/cars');
    } catch (err) {
      console.error('Failed to create car:', err);
      setError(err.message || 'Error registering vehicle into database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-car-page-wrapper">
      {/* Top Header */}
      <div className="add-car-header-row">
        <div>
          <NavLink to="/admin/cars" className="btn btn-outline btn-sm mb-2">
            <FiArrowLeft /> Back to Fleet
          </NavLink>
          <h1 className="add-car-title font-mono">Register New Fleet Vehicle</h1>
          <p className="add-car-subtitle">Add vehicle specifications, exterior photos, and pricing parameters.</p>
        </div>
      </div>

      {error && (
        <div className="add-car-alert-error">
          <FiInfo /> {error}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="add-car-form-layout">
        {/* Left Col: Core Specs & Details */}
        <div className="add-car-main-col card-light">
          <h3 className="form-section-heading font-mono">1. Vehicle Identification & Model</h3>

          <div className="form-grid-2">
            <div className="form-group-item">
              <label className="form-label">Brand / Manufacturer Make *</label>
              <input 
                type="text" 
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Tata, Mahindra, Hyundai"
                className="form-input"
                required
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Vehicle Model Name *</label>
              <input 
                type="text" 
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Nexon EV, Thar 4x4, Creta"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group-item">
              <label className="form-label">Manufacturing Year *</label>
              <input 
                type="number" 
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2020"
                max="2028"
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Vehicle Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Electric">Electric</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Sedan">Sedan</option>
                <option value="Economy">Economy</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label">Fuel Type</label>
              <select 
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          <hr className="form-divider" />

          <h3 className="form-section-heading font-mono">2. Transmission & Performance Specs</h3>

          <div className="form-grid-3">
            <div className="form-group-item">
              <label className="form-label">Transmission</label>
              <select 
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label">Seating Capacity</label>
              <select 
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="form-input font-mono"
              >
                <option value={4}>4 Seats</option>
                <option value={5}>5 Seats</option>
                <option value={7}>7 Seats</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label">Fuel Economy / Range</label>
              <input 
                type="text" 
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="e.g. 18.5 kmpl or 450 km"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group-item">
              <label className="form-label">Engine / Motor</label>
              <input 
                type="text" 
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="e.g. 1.5L Turbo Diesel"
                className="form-input"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Max Power</label>
              <input 
                type="text" 
                name="power"
                value={formData.power}
                onChange={handleChange}
                placeholder="e.g. 140 bhp"
                className="form-input"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Luggage Boot Capacity</label>
              <input 
                type="text" 
                name="bootSpace"
                value={formData.bootSpace}
                onChange={handleChange}
                placeholder="e.g. 433 Litres"
                className="form-input"
              />
            </div>
          </div>

          <hr className="form-divider" />

          <h3 className="form-section-heading font-mono">3. Description & Marketing Copy</h3>
          <div className="form-group-item">
            <label className="form-label">Overview Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe vehicle comfort, performance highlights, or suitable trip use cases..."
              className="form-input"
            />
          </div>

          <hr className="form-divider" />

          <h3 className="form-section-heading font-mono">4. Features & Inclusions</h3>
          <div className="features-builder-block">
            <div className="feature-input-row">
              <input 
                type="text" 
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                placeholder="Type feature (e.g. Panoramic Sunroof) and click Add"
                className="form-input"
              />
              <button type="button" onClick={handleAddFeature} className="btn btn-outline">
                <FiPlus /> Add
              </button>
            </div>

            <div className="features-tags-list">
              {formData.features.map((feat, idx) => (
                <span key={idx} className="feature-tag-chip">
                  <FiCheck className="text-green" /> {feat}
                  <button type="button" onClick={() => handleRemoveFeature(feat)} className="tag-remove-btn">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Media Image Presets & Pricing */}
        <div className="add-car-sidebar-col">
          {/* Pricing & Availability Card */}
          <div className="pricing-settings-card card-light mb-4">
            <h3 className="form-section-heading font-mono">Pricing & Status</h3>

            <div className="form-group-item">
              <label className="form-label"><FiDollarSign className="text-coral" /> Daily Rental Rate (₹ INR) *</label>
              <input 
                type="number" 
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                min="1000"
                step="250"
                className="form-input font-mono font-bold"
                required
              />
            </div>

            <div className="form-group-item toggle-item mt-3">
              <label className="toggle-label" htmlFor="available">
                <span>Available for Immediate Booking</span>
                <input 
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="toggle-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Vehicle Media & Image Presets */}
          <div className="media-selector-card card-light mb-4">
            <h3 className="form-section-heading font-mono"><FiImage className="text-coral" /> Vehicle Image</h3>

            <div className="selected-preview-frame">
              <img 
                src={formData.image} 
                alt="Selected Vehicle Preview" 
                className="car-selected-img"
                onError={(e) => { e.target.src = '/swift.jpg'; }}
              />
            </div>

            <span className="text-xs text-muted mb-2 block font-mono">Quick Preset Library:</span>
            <div className="presets-grid">
              {PRESET_CAR_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                  className={`preset-car-btn ${formData.image === preset.url ? 'active' : ''}`}
                >
                  <img src={preset.url} alt={preset.label} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="form-group-item mt-3">
              <label className="form-label">Or Custom Image URL</label>
              <input 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://... or /filename.png"
                className="form-input text-xs"
              />
            </div>
          </div>

          {/* Final Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary w-full save-car-btn"
          >
            <FiSave /> {submitting ? 'Registering Vehicle...' : 'Save & Publish Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}