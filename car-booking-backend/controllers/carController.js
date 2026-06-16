const Car = require('../models/Car');

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ ADD THIS FUNCTION
exports.toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.available = !car.available;
    await car.save();
    res.status(200).json({ message: 'Availability toggled', car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
