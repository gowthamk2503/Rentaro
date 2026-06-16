import React, { useState } from 'react';
import '../styles/AddCar.css';

const AddCar = () => {
  // Form state
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
    mileage: '',
    fuelType: 'petrol',
    transmission: 'automatic',
    category: 'sedan',
    seats: '',
    dailyRate: '',
    availability: true,
    features: {
      airConditioning: false,
      bluetooth: false,
      gps: false,
      usbPort: false,
      androidAuto: false,
      appleCarPlay: false,
      sunroof: false,
      leatherSeats: false
    },
    images: []
  });

  // Form validation
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // For nested objects like features
      const [parent, child] = name.split('.');
      setCarData({
        ...carData,
        [parent]: {
          ...carData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setCarData({
        ...carData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In real implementation, you would handle file upload to server
    // This is just a placeholder for demo purposes
    setCarData({
      ...carData,
      images: [...carData.images, ...files]
    });
  };

  // Remove uploaded image
  const removeImage = (index) => {
    const updatedImages = [...carData.images];
    updatedImages.splice(index, 1);
    setCarData({
      ...carData,
      images: updatedImages
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!carData.make) newErrors.make = 'Make is required';
    if (!carData.model) newErrors.model = 'Model is required';
    if (!carData.year) newErrors.year = 'Year is required';
    else if (!/^\d{4}$/.test(carData.year)) newErrors.year = 'Enter a valid year';
    
    if (!carData.licensePlate) newErrors.licensePlate = 'License plate is required';
    if (!carData.color) newErrors.color = 'Color is required';
    
    if (!carData.mileage) newErrors.mileage = 'Mileage is required';
    else if (isNaN(carData.mileage)) newErrors.mileage = 'Mileage must be a number';
    
    if (!carData.dailyRate) newErrors.dailyRate = 'Daily rate is required';
    else if (isNaN(carData.dailyRate)) newErrors.dailyRate = 'Daily rate must be a number';
    
    if (!carData.seats) newErrors.seats = 'Number of seats is required';
    else if (isNaN(carData.seats)) newErrors.seats = 'Number of seats must be a number';
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Clear any existing errors
    setErrors({});
    
    // Submit data to server
    console.log('Submitting car data:', carData);
    // In a real application, you would make an API call here
    alert('Car added successfully!');
    
    // Reset form
    setCarData({
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      mileage: '',
      fuelType: 'petrol',
      transmission: 'automatic',
      category: 'sedan',
      seats: '',
      dailyRate: '',
      availability: true,
      features: {
        airConditioning: false,
        bluetooth: false,
        gps: false,
        usbPort: false,
        androidAuto: false,
        appleCarPlay: false,
        sunroof: false,
        leatherSeats: false
      },
      images: []
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
          </div>
          
          {/* Make */}
          <div className="mb-4">
            <label htmlFor="make" className="block text-gray-700 font-medium mb-2">
              Make*
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={carData.make}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.make ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Toyota, Honda, Ford, etc."
            />
            {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
          </div>
          
          {/* Model */}
          <div className="mb-4">
            <label htmlFor="model" className="block text-gray-700 font-medium mb-2">
              Model*
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={carData.model}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Corolla, Civic, Focus, etc."
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>
          
          {/* Year */}
          <div className="mb-4">
            <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
              Year*
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={carData.year}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="2023"
              maxLength="4"
            />
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>
          
          {/* License Plate */}
          <div className="mb-4">
            <label htmlFor="licensePlate" className="block text-gray-700 font-medium mb-2">
              License Plate*
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={carData.licensePlate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.licensePlate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ABC-1234"
            />
            {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
          </div>
          
          {/* Color */}
          <div className="mb-4">
            <label htmlFor="color" className="block text-gray-700 font-medium mb-2">
              Color*
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={carData.color}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Black, White, Silver, etc."
            />
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
          
          {/* Mileage */}
          <div className="mb-4">
            <label htmlFor="mileage" className="block text-gray-700 font-medium mb-2">
              Mileage (km)*
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={carData.mileage}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.mileage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="10000"
              min="0"
            />
            {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
          </div>
          
          {/* Car Details Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Car Details</h2>
          </div>
          
          {/* Fuel Type */}
          <div className="mb-4">
            <label htmlFor="fuelType" className="block text-gray-700 font-medium mb-2">
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={carData.fuelType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="lpg">LPG</option>
            </select>
          </div>
          
          {/* Transmission */}
          <div className="mb-4">
            <label htmlFor="transmission" className="block text-gray-700 font-medium mb-2">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={carData.transmission}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="cvt">CVT</option>
              <option value="semi-automatic">Semi-Automatic</option>
            </select>
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={carData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupe</option>
              <option value="pickup">Pickup</option>
              <option value="van">Van</option>
              <option value="luxury">Luxury</option>
              <option value="convertible">Convertible</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          
          {/* Seats */}
          <div className="mb-4">
            <label htmlFor="seats" className="block text-gray-700 font-medium mb-2">
              Number of Seats*
            </label>
            <input
              type="number"
              id="seats"
              name="seats"
              value={carData.seats}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.seats ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="5"
              min="1"
              max="15"
            />
            {errors.seats && <p className="text-red-500 text-sm mt-1">{errors.seats}</p>}
          </div>
          
          {/* Daily Rate */}
          <div className="mb-4">
            <label htmlFor="dailyRate" className="block text-gray-700 font-medium mb-2">
              Daily Rate ($)*
            </label>
            <input
              type="number"
              id="dailyRate"
              name="dailyRate"
              value={carData.dailyRate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.dailyRate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="50"
              min="0"
              step="0.01"
            />
            {errors.dailyRate && <p className="text-red-500 text-sm mt-1">{errors.dailyRate}</p>}
          </div>
          
          {/* Availability */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Availability
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={carData.availability}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="availability" className="ml-2 text-gray-700">
                Available for rent
              </label>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.airConditioning"
                  name="features.airConditioning"
                  checked={carData.features.airConditioning}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.airConditioning" className="ml-2 text-gray-700">
                  Air Conditioning
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.bluetooth"
                  name="features.bluetooth"
                  checked={carData.features.bluetooth}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.bluetooth" className="ml-2 text-gray-700">
                  Bluetooth
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.gps"
                  name="features.gps"
                  checked={carData.features.gps}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.gps" className="ml-2 text-gray-700">
                  GPS
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.usbPort"
                  name="features.usbPort"
                  checked={carData.features.usbPort}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.usbPort" className="ml-2 text-gray-700">
                  USB Port
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.androidAuto"
                  name="features.androidAuto"
                  checked={carData.features.androidAuto}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.androidAuto" className="ml-2 text-gray-700">
                  Android Auto
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.appleCarPlay"
                  name="features.appleCarPlay"
                  checked={carData.features.appleCarPlay}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.appleCarPlay" className="ml-2 text-gray-700">
                  Apple CarPlay
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.sunroof"
                  name="features.sunroof"
                  checked={carData.features.sunroof}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.sunroof" className="ml-2 text-gray-700">
                  Sunroof
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="features.leatherSeats"
                  name="features.leatherSeats"
                  checked={carData.features.leatherSeats}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="features.leatherSeats" className="ml-2 text-gray-700">
                  Leather Seats
                </label>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Car Images</h2>
            <div className="mb-4">
              <label htmlFor="images" className="block text-gray-700 font-medium mb-2">
                Upload Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                accept="image/*"
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">
                You can upload multiple images. Max file size: 5MB per image.
              </p>
            </div>
            
            {/* Preview Images */}
            {carData.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {carData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Car Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-400"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Car
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;