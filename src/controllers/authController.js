// authController.js

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config');
const Admin = require('../models/adminModel');

// Login function
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let admin = await Admin.findOne({ adminName: username });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For demo purposes, we're assuming a simple comparison for password
        if (admin.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // JWT token generation
        jwt.sign(
            { id: admin.id },
            secret,
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
