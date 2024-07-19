// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login route
router.post('/login', authController.login);



module.exports = router;
