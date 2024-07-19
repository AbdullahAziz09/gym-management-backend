// traineeRouter.js

const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/traineeController');

// Routes for trainees
router.post('/', traineeController.createTrainee); // Create a new trainee
router.get('/', traineeController.getAllTrainees); // Get all trainees with pagination
router.delete('/:id', traineeController.deleteTraineeById); // Delete a trainee by ID

// Pagination route
router.get('/page', traineeController.getAllTrainees); // Endpoint to fetch trainees with pagination
router.get('/count', traineeController.getTraineesCount); // Endpoint to get total count of trainees
router.get('/by-city', traineeController.getTraineesByCity);

module.exports = router;
