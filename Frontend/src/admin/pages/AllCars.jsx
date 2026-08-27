import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { carsApi } from '../../services/api';
import { 
  FiTruck, 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiFilter, 
  FiStar, 
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/AllCars.css';

export default function AllCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchFleet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carsApi.getAll();
      setCars(Array.isArray(data) ? data : data.cars || []);
    } catch (err) {
      console.error('Error fetching fleet:', err);
      setError('Failed to load fleet catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleToggleAvailability = async (carId) => {
    setTogglingId(carId);
    try {
      await carsApi.toggleAvailability(carId);
      setCars(prev => 
        prev.map(c => c._id === carId ? { ...c, available: !c.available } : c)
      );
    } catch (err) {
      alert('Error updating vehicle availability: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCar = async (carId, carName) => {
    if (!window.confirm(`Are you sure you want to remove "${carName}" from the fleet permanently?`)) {
      return;
    }

    setDeletingId(carId);
    try {
      await carsApi.delete(carId);
      setCars(prev => prev.filter(c => c._id !== carId));
    } catch (err) {
      alert('Failed to remove vehicle: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCars = cars.filter(c => {
    const matchesSearch = 
      (c.make && c.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.model && c.model.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || c.category?.toLowerCase() === categoryFilter.toLowerCase();

    let matchesAvail = true;
    if (availabilityFilter === 'available') matchesAvail = c.available === true;
    if (availabilityFilter === 'unavailable') matchesAvail = c.available === false;

    return matchesSearch && matchesCategory && matchesAvail;
  });

  return (
    <div className="admin-fleet-page">
      {/* Top Header */}
      <div className="fleet-header-row">
        <div>
          <span className="section-tag">FLEET INVENTORY</span>
          <h1 className="fleet-title font-mono">Vehicle Fleet Management</h1>
          <p className="fleet-subtitle">Manage availability, adjust daily rental rates, and register new cars.</p>
        </div>

        <div className="fleet-header-actions">
          <button onClick={fetchFleet} className="btn btn-outline btn-sm">
            <FiRefreshCw /> Refresh
          </button>
          <NavLink to="/admin/cars/add" className="btn btn-primary btn-sm">
            <FiPlus /> Add Vehicle
          </NavLink>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="fleet-toolbar-card card-light">
        <div className="fleet-search-box">
          <FiSearch className="search-icon-prefix text-coral" />
          <input 
            type="text"
            placeholder="Search make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fleet-search-input"
          />
        </div>

        <div className="fleet-filter-pills">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="fleet-filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Electric">Electric</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
            <option value="Sedan">Sedan</option>
            <option value="Economy">Economy</option>
          </select>

          <select 
            value={availabilityFilter} 
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="fleet-filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Booked / Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="fleet-table-card card-light">
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Vehicle Photo</th>
                <th>Make & Model</th>
                <th>Category</th>
                <th>Transmission</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="skeleton" style={{ height: '30px', width: '300px', margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-coral">{error}</td>
                </tr>
              ) : filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No vehicles found matching filters.</td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car._id}>
                    <td>
                      <div className="fleet-car-thumb-wrap">
                        <img 
                          src={car.image || '/swift.jpg'} 
                          alt={`${car.make} ${car.model}`}
                          className="fleet-car-thumb"
                          onError={(e) => { e.target.src = '/swift.jpg'; }}
                        />
                      </div>
                    </td>
                    <td>
                      <strong className="car-table-title">{car.make} {car.model}</strong>
                      <span className="car-table-sub">{car.year || 2025} • {car.fuelType}</span>
                    </td>
                    <td>
                      <span className="badge badge-pending">{car.category}</span>
                    </td>
                    <td>{car.transmission || 'Automatic'}</td>
                    <td className="font-mono font-bold text-coral">
                      ₹{Number(car.pricePerDay || 3500).toLocaleString()}/day
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(car._id)}
                        disabled={togglingId === car._id}
                        className={`badge-toggle-btn ${car.available ? 'badge-available' : 'badge-booked'}`}
                        title="Click to toggle availability"
                      >
                        {car.available ? '● Available' : '● Booked'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions-group">
                        <button 
                          onClick={() => navigate(`/admin/cars/edit/${car._id}`)}
                          className="btn-icon-action edit-btn"
                          title="Edit vehicle details"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteCar(car._id, `${car.make} ${car.model}`)}
                          disabled={deletingId === car._id}
                          className="btn-icon-action delete-btn"
                          title="Delete vehicle"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
