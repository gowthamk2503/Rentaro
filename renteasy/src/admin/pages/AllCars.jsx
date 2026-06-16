import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AllCars.css';

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cars');
        setCars(res.data);
      } catch (err) {
        setError('Failed to fetch cars.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Delete car handler
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/cars/${carId}`);
      setCars((prevCars) => prevCars.filter(car => car._id !== carId));
    } catch (error) {
      console.error('Failed to delete car:', error);
      alert('Failed to delete the car. Please try again.');
    }
  };

  // Toggle availability handler
  const toggleAvailability = async (carId, currentStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/cars/${carId}`, {
        available: !currentStatus
      });

      if (response && response.data) {
        setCars((prevCars) =>
          prevCars.map(car =>
            car._id === carId ? { ...car, available: !currentStatus } : car
          )
        );
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update car status');
    }
  };

  // Filter cars based on search term and availability status
  const filteredCars = cars.filter(car => {
    const matchesSearch =
      (car.make && car.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'available') return matchesSearch && car.available;
    if (filterStatus === 'unavailable') return matchesSearch && !car.available;

    return matchesSearch;
  });

  if (loading) return (
    <div className="loading-container">Loading cars...</div>
  );

  if (error) return (
    <div className="error-container">{error}</div>
  );

  return (
    <div className="all-cars-page">
      <div className="all-cars-container">
        <div className="all-cars-header">
          <h2>Vehicle Management</h2>
          <div className="vehicle-count">{cars.length} Vehicles in Fleet</div>
        </div>

        <div className="all-cars-controls">
          <input
            type="text"
            placeholder="Search by make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Vehicles</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>

          <button className="add-vehicle-btn">
            + Add New Vehicle
          </button>
        </div>

        {filteredCars.length === 0 ? (
          <div className="all-cars-empty">
            <div className="empty-icon">🚗</div>
            <p className="empty-text">
              {searchTerm || filterStatus !== 'all'
                ? "No vehicles match your search criteria."
                : "No vehicles found in the system."}
            </p>
          </div>
        ) : (
          <div className="all-cars-grid">
            {filteredCars.map(car => (
              <div key={car._id} className="car-card">
                <div className="car-image-placeholder">
                  Car Image
                </div>
                <div className="car-details">
                  <div className="car-header">
                    <div>
                      <h3 className="car-title">{car.make} {car.model}</h3>
                      <p className="car-year">{car.year}</p>
                    </div>
                    <div className={`car-status ${car.available ? 'available' : 'unavailable'}`}>
                      {car.available ? 'Available' : 'Not Available'}
                    </div>
                  </div>

                  <div className="car-attributes">
                    {car.color && (
                      <div>
                        <span>Color:</span>{' '}
                        <span className="font-medium">{car.color}</span>
                      </div>
                    )}

                    {car.transmission && (
                      <div>
                        <span>Transmission:</span>{' '}
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                    )}

                    {car.fuelType && (
                      <div>
                        <span>Fuel Type:</span>{' '}
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                    )}
                  </div>

                  <p className="car-price">${car.pricePerDay}/day</p>

                  <div className="car-actions">
                    <button className="edit-btn">
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(car._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="availability-control">
                    <span>Status: {car.available ? 'Available' : 'Unavailable'}</span>
                    <button
                      onClick={() => toggleAvailability(car._id, car.available)}
                      className={`toggle-btn ${car.available ? 'available' : 'unavailable'}`}
                    >
                      {car.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCars;
