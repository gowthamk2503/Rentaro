const Car = require('../models/Car');

// Get all cars with filtering and sorting
exports.getAllCars = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      fuelType, 
      transmission, 
      seats, 
      maxPrice, 
      available, 
      sort 
    } = req.query;

    let query = {};

    // Search by make or model
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { make: searchRegex },
        { model: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Fuel type filter
    if (fuelType && fuelType !== 'All') {
      query.fuelType = { $regex: new RegExp(fuelType, 'i') };
    }

    // Transmission filter
    if (transmission && transmission !== 'All') {
      query.transmission = { $regex: new RegExp(transmission, 'i') };
    }

    // Minimum seats filter
    if (seats && Number(seats) > 0) {
      query.seats = { $gte: Number(seats) };
    }

    // Maximum price per day filter
    if (maxPrice && Number(maxPrice) > 0) {
      query.pricePerDay = { $lte: Number(maxPrice) };
    }

    // Availability filter
    if (available !== undefined && available !== 'all') {
      query.available = available === 'true' || available === true;
    }

    // Sort setup
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { pricePerDay: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { pricePerDay: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'year') {
      sortOptions = { year: -1 };
    }

    const cars = await Car.find(query).sort(sortOptions);
    res.status(200).json(cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ message: 'Failed to retrieve vehicle fleet', error: err.message });
  }
};

// Get single car by ID
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if valid ObjectId or fallback
    let car = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      car = await Car.findById(id);
    }
    
    if (!car) {
      // Try searching by numeric legacy id or model name
      car = await Car.findOne({
        $or: [
          { model: new RegExp(id, 'i') }
        ]
      });
    }

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json(car);
  } catch (err) {
    console.error('Error fetching car by ID:', err);
    res.status(500).json({ message: 'Server error retrieving car details' });
  }
};

// Add new car
exports.addCar = async (req, res) => {
  try {
    const { 
      make, 
      model, 
      year, 
      pricePerDay, 
      category, 
      fuelType, 
      transmission, 
      seats, 
      mileage,
      bootSpace,
      groundClearance,
      engine,
      power,
      torque,
      image,
      images,
      features,
      colors,
      description
    } = req.body;

    if (!make || !model || !year || !pricePerDay) {
      return res.status(400).json({ message: 'Make, model, year, and pricePerDay are required.' });
    }

    const car = new Car({
      make,
      model,
      year: Number(year),
      category: category || 'Sedan',
      pricePerDay: Number(pricePerDay),
      available: req.body.available !== undefined ? req.body.available : true,
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Automatic',
      seats: Number(seats) || 5,
      mileage: mileage || '20 kmpl',
      bootSpace: bootSpace || '300 Litres',
      groundClearance: groundClearance || '170 mm',
      engine: engine || '1.5L Engine',
      power: power || '115 bhp',
      torque: torque || '150 Nm',
      image: image || (images && images.length > 0 ? images[0] : '/swift.jpg'),
      images: images && images.length > 0 ? images : [image || '/swift.jpg'],
      features: features || ['Air Conditioning', 'Infotainment System', 'ABS with EBD'],
      colors: colors || ['White', 'Black', 'Silver', 'Red'],
      description: description || `Experience the luxury and reliability of the ${year} ${make} ${model}.`
    });

    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    console.error('Error adding car:', err);
    res.status(400).json({ message: err.message || 'Failed to add car' });
  }
};

// Update existing car
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.pricePerDay) updateData.pricePerDay = Number(updateData.pricePerDay);
    if (updateData.year) updateData.year = Number(updateData.year);
    if (updateData.seats) updateData.seats = Number(updateData.seats);

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(400).json({ message: err.message || 'Failed to update car' });
  }
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.available = !car.available;
    await car.save();

    res.status(200).json({ 
      message: `Car availability updated to ${car.available ? 'Available' : 'Unavailable'}`, 
      car 
    });
  } catch (err) {
    console.error('Error toggling availability:', err);
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car removed from fleet successfully' });
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({ message: 'Failed to delete car' });
  }
};
