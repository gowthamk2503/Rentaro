import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { carsApi } from '../../services/api';
import { 
  FiArrowLeft, 
  FiSave, 
  FiTruck, 
  FiInfo, 
  FiCheck, 
  FiImage, 
  FiPlus 
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

export default function EditCar() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2025,
    category: 'Sedan',
    pricePerDay: 4500,
    available: true,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '20 kmpl',
    bootSpace: '350 Litres',
    groundClearance: '170 mm',
    engine: '1.5L Engine',
    power: '115 bhp',
    torque: '150 Nm',
    image: '/swift.jpg',
    description: '',
    features: []
  });

  const [loading, setLoading] = useState(true);
  const [featureInput, setFeatureInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const car = await carsApi.getById(carId);
        setFormData({
          make: car.make || '',
          model: car.model || '',
          year: car.year || 2025,
          category: car.category || 'Sedan',
          pricePerDay: car.pricePerDay || 4500,
          available: car.available !== undefined ? car.available : true,
          fuelType: car.fuelType || 'Petrol',
          transmission: car.transmission || 'Automatic',
          seats: car.seats || 5,
          mileage: car.mileage || '20 kmpl',
          bootSpace: car.bootSpace || '350 Litres',
          groundClearance: car.groundClearance || '170 mm',
          engine: car.engine || '1.5L Engine',
          power: car.power || '115 bhp',
          torque: car.torque || '150 Nm',
          image: car.image || (car.images && car.images[0]) || '/swift.jpg',
          description: car.description || '',
          features: car.features || ['Air Conditioning', 'Infotainment System']
        });
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load vehicle data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

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

    setSubmitting(true);
    try {
      await carsApi.update(carId, {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        year: Number(formData.year),
        seats: Number(formData.seats),
        images: [formData.image],
      });
      navigate('/admin/cars');
    } catch (err) {
      console.error('Failed to update car:', err);
      setError(err.message || 'Error updating vehicle in database.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-car-page-wrapper">
        <div className="skeleton" style={{ height: '400px', borderRadius: '18px' }}></div>
      </div>
    );
  }

  return (
    <div className="add-car-page-wrapper">
      {/* Top Header */}
      <div className="add-car-header-row">
        <div>
          <NavLink to="/admin/cars" className="btn btn-outline btn-sm mb-2">
            <FiArrowLeft /> Back to Fleet Catalogue
          </NavLink>
          <h1 className="add-car-title font-mono">Edit Vehicle Details</h1>
          <p className="add-car-subtitle">Updating {formData.make} {formData.model} ({formData.year})</p>
        </div>
      </div>

      {error && (
        <div className="add-car-alert-error">
          <FiInfo /> {error}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="add-car-form-layout">
        {/* Left Col: Core Specs */}
        <div className="add-car-main-col card-light">
          <h3 className="form-section-heading font-mono">1. Vehicle Identification</h3>

          <div className="form-grid-2">
            <div className="form-group-item">
              <label className="form-label">Brand / Make *</label>
              <input 
                type="text" 
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Model Name *</label>
              <input 
                type="text" 
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group-item">
              <label className="form-label">Year *</label>
              <input 
                type="number" 
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group-item">
              <label className="form-label">Category</label>
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

          <h3 className="form-section-heading font-mono">2. Transmission & Specs</h3>

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
              <label className="form-label">Mileage / Efficiency</label>
              <input 
                type="text" 
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <hr className="form-divider" />

          <h3 className="form-section-heading font-mono">3. Description & Features</h3>
          <div className="form-group-item">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-input"
            />
          </div>

          <div className="features-builder-block mt-3">
            <div className="feature-input-row">
              <input 
                type="text" 
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add standard feature..."
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

        {/* Right Col: Media & Pricing */}
        <div className="add-car-sidebar-col">
          <div className="pricing-settings-card card-light mb-4">
            <h3 className="form-section-heading font-mono">Pricing & Availability</h3>

            <div className="form-group-item">
              <label className="form-label">Daily Rental Rate (₹ INR) *</label>
              <input 
                type="number" 
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
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

          <div className="media-selector-card card-light mb-4">
            <h3 className="form-section-heading font-mono"><FiImage className="text-coral" /> Vehicle Photo</h3>

            <div className="selected-preview-frame">
              <img 
                src={formData.image} 
                alt="Selected Vehicle Preview" 
                className="car-selected-img"
                onError={(e) => { e.target.src = '/swift.jpg'; }}
              />
            </div>

            <div className="presets-grid mt-3">
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
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary w-full save-car-btn"
          >
            <FiSave /> {submitting ? 'Saving Updates...' : 'Update Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
