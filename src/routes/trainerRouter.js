const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// Routes for trainers
router.post('/', trainerController.createTrainer); // Create a new trainer
router.get('/', trainerController.getAllTrainers); // Get all trainers with pagination
router.delete('/:id', trainerController.deleteTrainerById); // Delete a trainer by ID

// Pagination route
router.get('/page', trainerController.getAllTrainers); // Endpoint to fetch trainers with pagination
router.get('/count', trainerController.getTrainersCount); // Endpoint to get total count of trainers
router.get('/by-city', trainerController.getTrainersByCity);





module.exports = router;
