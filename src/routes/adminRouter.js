const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes for admins
router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmins);
router.delete('/:id', adminController.deleteAdminById);
router.get('/count', adminController.getAdminsCount);

// New route for admins grouped by city
router.get('/by-city', adminController.getAdminsByCity);

module.exports = router;
