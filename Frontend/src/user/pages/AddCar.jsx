import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddCar.css';

const AddCar = () => {
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: '',
  });

  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errorCars, setErrorCars] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoadingCars(true);
      setErrorCars(null);
      try {
        const res = await axios.get('https://rentro-backend.onrender.com/api/cars');
        setCars(res.data);
      } catch (err) {
        setErrorCars('Failed to load cars.');
        console.error(err);
      } finally {
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://rentro-backend.onrender.com/api/cars/add', {
        ...carDetails,
        available: true
      });
      if (response && response.data) {
        alert('Car added successfully');
        setCarDetails({
          make: '',
          model: '',
          year: '',
          pricePerDay: '',
        });
        setCars((prevCars) => [...prevCars, response.data]);
      } else {
        alert('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('Error adding car: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="add-car-page">
      <div className="add-car-container">
        <h1>Car Suggestion Box</h1>
        <form onSubmit={handleSubmit} className="add-car-form">
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input
              type="text"
              id="make"
              name="make"
              value={carDetails.make}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={carDetails.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={carDetails.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerDay">Price per Day (₹)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={carDetails.pricePerDay}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="no-arrow"
              min="0"
              step="1"
              placeholder="e.g., 3500"
            />
          </div>

          <button type="submit" className="submit-button">
            Send Car
          </button>
        </form>
      </div>

      <div className="car-list-container">
        <h2>Current Cars in Fleet</h2>
        {loadingCars && <p>Loading cars...</p>}
        {errorCars && <p className="error">{errorCars}</p>}

        {!loadingCars && !errorCars && cars.length === 0 && (
          <p>No cars available.</p>
        )}

        {!loadingCars && !errorCars && cars.length > 0 && (
          <div className="car-list-grid">
            {cars.map((car) => (
              <div key={car._id || car.id} className="car-card">
                <h3>{car.make} {car.model}</h3>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Price per Day:</strong> ₹{car.pricePerDay}</p>
                <p><strong>Status:</strong> {car.available ? 'Available' : 'Unavailable'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCar;
