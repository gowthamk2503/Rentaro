const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public car exploration routes
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Admin-only car management routes
router.post('/add', authMiddleware, adminMiddleware, carController.addCar);
router.post('/', authMiddleware, adminMiddleware, carController.addCar); // REST standard alias
router.put('/:id', authMiddleware, adminMiddleware, carController.updateCar);
router.patch('/:id', authMiddleware, adminMiddleware, carController.toggleAvailability);
router.delete('/:id', authMiddleware, adminMiddleware, carController.deleteCar);

module.exports = router;
