import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarDetails.css';
const cars = [
  {
    id: "1",
    name: "Maruti Suzuki Swift",
    price: 4500,
    desc: "The 2025 Maruti Suzuki Swift is a compact and efficient hatchback offering a blend of style, performance, and advanced features. With its peppy engine and agile handling, it's perfect for city driving.",
    images: ["/swift.jpg", "/car_view/back/swift.jpg", "/car_view/side/swift.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / CNG" },
      { icon: "⚙️", label: "Engine: 1197 cc, 3-cylinder" },
      { icon: "🏎️", label: "Power: 80.46 bhp @ 5700 rpm" },
      { icon: "🔧", label: "Torque: 111.7 Nm @ 4300 rpm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic" },
      { icon: "🛣️", label: "Mileage: 24.8 - 25.75 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3860 x 1735 x 1520 mm" },
      { icon: "⚖️", label: "Kerb Weight: 920 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 37 Litres" },
      { icon: "📦", label: "Boot Space: 265 Litres" },
      { icon: "🛞", label: "Ground Clearance: 163 mm" }
    ],
    features: [
      "9-inch touchscreen infotainment",
      "Wireless Android Auto and Apple CarPlay",
      "Cruise Control",
      "6 Airbags",
      "Engine Start/Stop button",
      "Automatic Climate Control",
      "Rear AC Vents",
      "Wireless Charger",
      "Rear Camera",
      "ABS, EBD, ESP, Hill Assist"
    ],
    colors: ["Red", "Blue", "White", "Silver", "Black"]
  },
  {
    id: "2",
    name: "Hyundai Grand i10",
    price: 4200,
    desc: "The Hyundai Grand i10 offers a premium compact hatchback experience with modern features, advanced tech, and a sleek design that stands out in urban environments.",
    images: ["/grand_i10.jpg", "/car_view/back/grand_i10.jpg", "/car_view/side/grand_i10.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / Diesel" },
      { icon: "⚙️", label: "Engine: 1197 cc, 4-cylinder" },
      { icon: "🏎️", label: "Power: 81.86 bhp @ 6000 rpm" },
      { icon: "🔧", label: "Torque: 114 Nm @ 4000 rpm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic" },
      { icon: "🛣️", label: "Mileage: 18.9 - 22.0 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3795 x 1660 x 1520 mm" },
      { icon: "⚖️", label: "Kerb Weight: 890 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 43 Litres" },
      { icon: "📦", label: "Boot Space: 256 Litres" },
      { icon: "🛞", label: "Ground Clearance: 165 mm" }
    ],
    features: [
      "7-inch touchscreen infotainment",
      "Smart Key",
      "Cooled Glove Box",
      "6 Airbags",
      "Rear Parking Sensors",
      "Alloy Wheels",
      "Reverse Parking Camera",
      "Driver Side Airbag"
    ],
    colors: ["Red", "Blue", "White", "Silver", "Black"]
  },
  {
    id: "3",
    name: "Tata Tiago",
    price: 4000,
    desc: "The Tata Tiago is a stylish and affordable hatchback with a solid build quality, impressive safety features, and a refined petrol engine that delivers excellent fuel efficiency.",
    images: ["/tiago.jpg", "/car_view/back/tiago.jpg", "/car_view/side/tiago.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / CNG" },
      { icon: "⚙️", label: "Engine: 1199 cc, 3-cylinder" },
      { icon: "🏎️", label: "Power: 84.8 bhp @ 6000 rpm" },
      { icon: "🔧", label: "Torque: 113 Nm @ 3300 rpm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic" },
      { icon: "🛣️", label: "Mileage: 19.8 - 23.84 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3765 x 1670 x 1535 mm" },
      { icon: "⚖️", label: "Kerb Weight: 997 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 35 Litres" },
      { icon: "📦", label: "Boot Space: 242 Litres" },
      { icon: "🛞", label: "Ground Clearance: 165 mm" }
    ],
    features: [
      "7-inch Harman touchscreen",
      "Apple CarPlay & Android Auto",
      "Voice Recognition",
      "Dual Airbags",
      "ABS with EBD",
      "Rear Parking Sensors",
      "Automatic Climate Control",
      "Steering Mounted Controls"
    ],
    colors: ["Red", "Blue", "White", "Silver", "Orange"]
  },
  {
    id: "4",
    name: "Maruti Suzuki Alto 800",
    price: 3800,
    desc: "The most affordable car in India, the Alto 800 offers basic transportation with Maruti's renowned reliability and excellent fuel efficiency for budget-conscious buyers.",
    images: ["/alto.jpg", "/car_view/back/alto.jpg", "/car_view/side/alto.png"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / CNG" },
      { icon: "⚙️", label: "Engine: 796 cc, 3-cylinder" },
      { icon: "🏎️", label: "Power: 47.3 bhp @ 6000 rpm" },
      { icon: "🔧", label: "Torque: 69 Nm @ 3500 rpm" },
      { icon: "🚗", label: "Transmission: Manual" },
      { icon: "🛣️", label: "Mileage: 22.05 - 31.59 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3445 x 1515 x 1475 mm" },
      { icon: "⚖️", label: "Kerb Weight: 725 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 35 Litres" },
      { icon: "📦", label: "Boot Space: 177 Litres" },
      { icon: "🛞", label: "Ground Clearance: 160 mm" }
    ],
    features: [
      "Manual AC",
      "Front Power Windows",
      "Digital Speedometer",
      "Driver Airbag",
      "ABS with EBD",
      "Rear Parking Sensors",
      "Central Locking",
      "12V Power Outlet"
    ],
    colors: ["White", "Silver", "Blue", "Red", "Grey"]
  },
  {
    id: "5",
    name: "Renault Kwid",
    price: 4100,
    desc: "The Renault Kwid combines SUV-inspired styling with hatchback practicality, offering a commanding driving position and premium features at an affordable price point.",
    images: ["/kwid.jpg", "/car_view/back/kwid.jpg", "/car_view/side/kwid.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol" },
      { icon: "⚙️", label: "Engine: 999 cc, 3-cylinder" },
      { icon: "🏎️", label: "Power: 67 bhp @ 5500 rpm" },
      { icon: "🔧", label: "Torque: 91 Nm @ 4250 rpm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic" },
      { icon: "🛣️", label: "Mileage: 22.0 - 25.17 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3731 x 1579 x 1511 mm" },
      { icon: "⚖️", label: "Kerb Weight: 757 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 28 Litres" },
      { icon: "📦", label: "Boot Space: 279 Litres" },
      { icon: "🛞", label: "Ground Clearance: 184 mm" }
    ],
    features: [
      "8-inch touchscreen",
      "Digital Instrument Cluster",
      "Apple CarPlay & Android Auto",
      "Driver Airbag",
      "ABS with EBD",
      "Rear Parking Camera",
      "Tilt Steering",
      "LED Daytime Running Lights"
    ],
    colors: ["Red", "Blue", "White", "Brown", "Grey"]
  },
  {
    id: "6",
    name: "Datsun Redi-GO",
    price: 3900,
    desc: "The Datsun Redi-GO is an ultra-affordable urban crossover with a compact footprint, making it perfect for navigating tight city streets while offering surprising interior space.",
    images: ["/redigo.jpg", "/car_view/back/redigo.jpg", "/car_view/side/redigo.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol" },
      { icon: "⚙️", label: "Engine: 799 cc, 3-cylinder" },
      { icon: "🏎️", label: "Power: 53 bhp @ 5678 rpm" },
      { icon: "🔧", label: "Torque: 72 Nm @ 4386 rpm" },
      { icon: "🚗", label: "Transmission: Manual" },
      { icon: "🛣️", label: "Mileage: 22.7 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3429 x 1560 x 1541 mm" },
      { icon: "⚖️", label: "Kerb Weight: 697 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 28 Litres" },
      { icon: "📦", label: "Boot Space: 222 Litres" },
      { icon: "🛞", label: "Ground Clearance: 185 mm" }
    ],
    features: [
      "5-inch touchscreen",
      "Bluetooth Connectivity",
      "Digital Instrument Cluster",
      "Driver Airbag",
      "ABS with EBD",
      "Speed Sensing Door Lock",
      "Rear Parking Sensors",
      "12V Power Outlet"
    ],
    colors: ["Red", "Orange", "White", "Silver", "Grey"]
  },
  {
    id: "7",
    name: "Honda Amaze",
    price: 3900,
    desc: "The Honda Amaze offers premium sedan experience with refined diesel and petrol engines, spacious interiors, and Honda's legendary reliability in a compact package.",
    images: ["/amaze.jpg", "/car_view/back/amaze.jpg", "/car_view/side/amaze.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / Diesel" },
      { icon: "⚙️", label: "Engine: 1199 cc Petrol / 1498 cc Diesel" },
      { icon: "🏎️", label: "Power: 88.7 bhp @ 6000 rpm (Petrol)" },
      { icon: "🔧", label: "Torque: 110 Nm @ 4800 rpm (Petrol)" },
      { icon: "🚗", label: "Transmission: Manual / CVT" },
      { icon: "🛣️", label: "Mileage: 18.6 - 24.7 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3995 x 1695 x 1501 mm" },
      { icon: "⚖️", label: "Kerb Weight: 980-1065 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 35 Litres" },
      { icon: "📦", label: "Boot Space: 420 Litres" },
      { icon: "🛞", label: "Ground Clearance: 165 mm" }
    ],
    features: [
      "7-inch touchscreen",
      "Apple CarPlay & Android Auto",
      "Leather-wrapped Steering",
      "Dual Airbags",
      "ABS with EBD",
      "Rear Parking Camera",
      "Push Button Start",
      "Automatic Climate Control"
    ],
    colors: ["White", "Silver", "Red", "Blue", "Grey"]
  },
  {
    id: "8",
    name: "Maruti Suzuki Wagon R",
    price: 4800,
    desc: "The tall-boy design of the Wagon R offers exceptional headroom and practicality, making it one of the most versatile city cars with its boxy shape and spacious interior.",
    images: ["/wagonr.jpg", "/car_view/back/wagonr.jpg", "/car_view/side/wagonr.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / CNG" },
      { icon: "⚙️", label: "Engine: 998 cc / 1197 cc" },
      { icon: "🏎️", label: "Power: 65.7 bhp @ 5500 rpm" },
      { icon: "🔧", label: "Torque: 89 Nm @ 3500 rpm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic" },
      { icon: "🛣️", label: "Mileage: 21.79 - 34.05 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 3655 x 1620 x 1675 mm" },
      { icon: "⚖️", label: "Kerb Weight: 840-855 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 32 Litres" },
      { icon: "📦", label: "Boot Space: 341 Litres" },
      { icon: "🛞", label: "Ground Clearance: 165 mm" }
    ],
    features: [
      "7-inch SmartPlay Studio",
      "Steering Mounted Controls",
      "Dual Airbags",
      "ABS with EBD",
      "Rear Parking Sensors",
      "Automatic Climate Control",
      "Keyless Entry",
      "Front Power Windows"
    ],
    colors: ["White", "Silver", "Blue", "Red", "Orange"]
  },
  {
    id: "9",
    name: "Kia Seltos",
    price: 5500,
    desc: "The Kia Seltos is a feature-packed compact SUV with bold styling, premium interiors, and multiple powertrain options that make it one of the most versatile choices in its segment.",
    images: ["/seltos.jpg", "/car_view/back/seltos.jpg", "/car_view/side/seltos.jpg"],
    specs: [
      { icon: "⛽", label: "Fuel Type: Petrol / Diesel" },
      { icon: "⚙️", label: "Engine: 1353 cc / 1493 cc / 1497 cc" },
      { icon: "🏎️", label: "Power: 113 - 138 bhp" },
      { icon: "🔧", label: "Torque: 144 - 250 Nm" },
      { icon: "🚗", label: "Transmission: Manual / Automatic / DCT" },
      { icon: "🛣️", label: "Mileage: 16.5 - 21.0 kmpl" },
      { icon: "👥", label: "Seating Capacity: 5" },
      { icon: "📏", label: "Dimensions: 4315 x 1800 x 1620 mm" },
      { icon: "⚖️", label: "Kerb Weight: 1245-1385 kg" },
      { icon: "🛢️", label: "Fuel Tank Capacity: 50 Litres" },
      { icon: "📦", label: "Boot Space: 433 Litres" },
      { icon: "🛞", label: "Ground Clearance: 190 mm" }
    ],
    features: [
      "10.25-inch touchscreen",
      "Bose Premium Sound System",
      "Ventilated Seats",
      "6 Airbags",
      "360 Degree Camera",
      "Panoramic Sunroof",
      "Wireless Charger",
      "Ambient Lighting"
    ],
    colors: ["White", "Grey", "Blue", "Red", "Black"]
  }
  // ... you can continue adding more cars following the same pattern
];

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    pickupDate: '',
    returnDate: '',
    color: '',
    comments: ''
  });

  const car = cars.find(car => car.id === carId);

  if (!car) return <div className="error-container">Car not found.</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.pickupLocation || !bookingForm.pickupDate || !bookingForm.returnDate || !bookingForm.color) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const userId = localStorage.getItem('userEmail') || 'guest';
      const pickup = new Date(bookingForm.pickupDate);
      const drop = new Date(bookingForm.returnDate);
      if (drop < pickup) {
        alert('Return date must be after pickup date.');
        return;
      }

      const rentalDays = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)));
      const totalCost = rentalDays * car.price;

      const response = await axios.post('http://localhost:5000/api/bookings/', {
        userId,
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        pickupLocation: bookingForm.pickupLocation,
        pickupDate: bookingForm.pickupDate,
        returnDate: bookingForm.returnDate,
        color: bookingForm.color,
        comments: bookingForm.comments,
        car: car.id,
        carName: car.name,
        carImage: car.images[0],
        pricePerDay: car.price
      });

      const booking = response.data.booking;
      navigate(`/payment?bookingId=${booking._id}`, {
        state: { booking }
      });
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="car-details">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>{car.name}</h1>
      </div>

      <div className="car-gallery-container">
        <div className="main-image-container">
          <img src={car.images[mainImage]} alt="Main Car View" className="main-image" />
        </div>
        <div className="thumbnail-container">
          {car.images.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail ${mainImage === idx ? 'active' : ''}`}
              onClick={() => setMainImage(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="car-info-container">
        <p>{car.desc}</p>
        <h2 className="price-tag">₹{car.price.toLocaleString()}</h2>
        <button className="booking-button" onClick={() => setShowBookingForm(prev => !prev)}>
          {showBookingForm ? "Hide Booking Form" : "Book a Test Drive"}
        </button>
      </div>

      {showBookingForm && (
        <div className="booking-form-container">
          <h3>Book a Test Drive</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={bookingForm.name} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={bookingForm.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={bookingForm.phone} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickupLocation">Pickup Location</label>
                <input id="pickupLocation" name="pickupLocation" value={bookingForm.pickupLocation} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="color">Preferred Color</label>
                <select id="color" name="color" value={bookingForm.color} onChange={handleInputChange} required>
                  <option value="">Select</option>
                  {car.colors.map((clr, idx) => (
                    <option key={idx} value={clr}>{clr}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickupDate">Pickup Date</label>
                <input type="date" id="pickupDate" name="pickupDate" value={bookingForm.pickupDate} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="returnDate">Return Date</label>
                <input type="date" id="returnDate" name="returnDate" value={bookingForm.returnDate} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea id="comments" name="comments" rows="3" value={bookingForm.comments} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit" className="submit-button">Submit Booking</button>
          </form>
        </div>
      )}

      <div className="car-details-sections">
        <div className="section specifications">
          <h3>Specifications</h3>
          <ul className="specs-list">
            {car.specs.map((spec, idx) => (
              <li key={idx}><span>{spec.icon}</span> {spec.label}</li>
            ))}
          </ul>
        </div>

        <div className="section features">
          <h3>Features</h3>
          <ul className="features-list">
            {car.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;