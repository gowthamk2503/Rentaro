const express = require('express');
const router = express.Router();

// Destructure only the functions you need
const { getAllCars, addCar, toggleAvailability } = require('../controllers/carController');

// Define routes with valid handlers
router.get('/', getAllCars);
router.post('/add', addCar);
router.patch('/:id', toggleAvailability);

module.exports = router;
