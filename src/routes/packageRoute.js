// packageRoute.js

const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Routes for packages
router.get('/', packageController.getAllPackages); // Get all packages
router.put('/:id', packageController.updatePackage); // Update a package by ID

module.exports = router;
