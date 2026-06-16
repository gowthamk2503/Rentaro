import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cars.css';

// Extended car data with 20+ popular Indian cars
const cars = [
  { id: 1, name: "Maruti Suzuki Swift", price: 4500, highlight: false, image: "/swift.jpg" },
  { id: 2, name: "Hyundai Grand i10", price: 4200, highlight: false, image: "/grand_i10.jpg" },
  { id: 3, name: "Tata Tiago", price: 4000, highlight: false, image: "/tiago.jpg" },
  { id: 4, name: "Maruti Suzuki Alto 800", price: 3800, highlight: false, image: "/alto.jpg" },
  { id: 5, name: "Renault Kwid", price: 4100, highlight: false, image: "/kwid.jpg" },
  { id: 6, name: "Datsun Redi-GO", price: 3900, highlight: false, image: "/redigo.jpg" },
  { id: 7, name: "Honda Amaze", price: 4800, highlight: false, image: "/amaze.jpg" },
  { id: 8, name: "Maruti Suzuki Wagon R", price: 4300, highlight: false, image: "/wagonr.jpg" },
  { id: 9, name: "Kia Seltos", price: 5500, highlight: false, image: "/seltos.jpg" },
  { id: 10, name: "Hyundai Creta", price: 5200, highlight: false, image: "/creta.jpg" },
  { id: 11, name: "Toyota Fortuner", price: 7500, highlight: false, image: "/fortuner.jpg" },
  { id: 12, name: "Mahindra Thar", price: 6500, highlight: false, image: "/mahindra_thar.png" },
  { id: 13, name: "Maruti Suzuki Baleno", price: 4700, highlight: false, image: "/baleno.jpg" },
  { id: 14, name: "Hyundai Venue", price: 5000, highlight: false, image: "/venue.jpg" },
  { id: 15, name: "Tata Nexon", price: 5100, highlight: false, image: "/nexon.jpg" },
  { id: 16, name: "Mahindra Scorpio", price: 6000, highlight: false, image: "/scorpio.jpg" },
  { id: 17, name: "Toyota Innova Crysta", price: 7000, highlight: false, image: "/innova.jpg" },
  { id: 18, name: "Honda City", price: 5800, highlight: false, image: "/city.jpg" },
  { id: 19, name: "Volkswagen Polo", price: 4900, highlight: false, image: "/polo.jpg" },
  { id: 20, name: "Skoda Kushaq", price: 6200, highlight: false, image: "/kushaq.jpg" },
  { id: 21, name: "MG Hector", price: 6800, highlight: false, image: "/hector.jpg" },
  { id: 22, name: "Tata Harrier", price: 6400, highlight: false, image: "/harrier.jpg" },
  { id: 23, name: "Kia Sonet", price: 5300, highlight: false, image: "/sonet.jpg" },
  { id: 24, name: "Maruti Suzuki Brezza", price: 5400, highlight: false, image: "/brezza.jpg" },
  { id: 25, name: "Hyundai Verna", price: 5700, highlight: false, image: "/verna.jpg" }
];


export default function CarFleet() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  // Filter cars based on search
  const filteredCars = useMemo(() => {
    if (!searchInput) return cars;
    return cars.filter(car =>
      car.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput]);

  // Navigate to car detail
  const handleCarClick = (car) => {
    navigate(`/cars/${car.id}`);
  };

  return (
    <div className="car-fleet-container">
      <section className="car-fleet-section">
        <div className="section-header">
          <h3 className="section-subtitle">THE CARS</h3>
          <h2 className="section-title">Our Impressive Fleet</h2>
          <input
            type="text"
            placeholder="Search cars..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="car-search-input"
            aria-label="Search cars"
          />
        </div>

        <div className="cars-wrapper">
          <div className="car-grid">
            {filteredCars.length > 0 ? (
              filteredCars.map(car => (
                <div
                  key={car.id}
                  className={`car-card ${car.highlight ? 'highlighted' : ''}`}
                  onClick={() => handleCarClick(car)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') handleCarClick(car);
                  }}
                  aria-label={`View details for ${car.name}`}
                >
                  <div className="car-image-wrapper">
                    <img
                      src={car.image || "/images/cars/default-car.png"}
                      alt={`${car.name}`}
                      className="car-image"
                      onError={(e) => {
                        e.target.src = "/images/cars/default-car.png";
                      }}
                    />
                  </div>
                  <div className="car-details">
                    <h3 className="car-name">{car.name}</h3>
                    <div className="car-pricing">
                      <div className="price-info">
                        <p className="price-label">Starting at</p>
                        <p className="price-value">₹{car.price}/day</p>
                      </div>
                      <button
                        className="rent-now-button"
                        aria-label={`Rent ${car.name}`}
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </div>
                
              ))
            ) : (
              <p className="no-results">
                No cars found matching "{searchInput}"
              </p>
            )}
            
          </div>
        </div>
      </section>
    </div>
    
  );
}